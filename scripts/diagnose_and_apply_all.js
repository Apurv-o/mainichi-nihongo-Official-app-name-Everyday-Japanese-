const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Check & Replace Navigation
console.log('Nav item check:', html.includes('id="nav-library-btn"'));
const navPattern = /<nav class="nav-menu" aria-label="Main Navigation">[\s\S]*?<\/nav>/;
const newNavMenu = `<nav class="nav-menu" aria-label="Main Navigation">
        <button class="nav-item active" data-view="today" id="nav-today"><svg class="ic"><use href="#i-home"/></svg>Today</button>
        <button class="nav-item" data-view="vocabulary" id="nav-vocabulary"><svg class="ic"><use href="#i-book"/></svg>Vocabulary</button>
        <button class="nav-item" data-view="grammar" id="nav-grammar"><svg class="ic"><use href="#i-pen"/></svg>Grammar</button>
        
        <!-- Kanji Library with Submenu -->
        <button class="nav-item" id="nav-library-btn" data-view="kanji">
          <svg class="ic"><use href="#i-torii"/></svg>Kanji
          <span class="nav-arrow">▼</span>
        </button>
        <div class="nav-submenu" id="library-submenu">
          <button class="subnav-item active" data-lib="flashcard">🎴 Flashcards</button>
          <button class="subnav-item" data-lib="grid">📑 All Kanji <span id="sidebar-kanji-count"></span></button>
        </div>

        <button class="nav-item" data-view="history" id="nav-history"><svg class="ic"><use href="#i-cal"/></svg>History</button>
        <button class="nav-item" data-view="progress" id="nav-progress"><svg class="ic"><use href="#i-chart"/></svg>Progress</button>
        <button class="nav-item" data-view="goals" id="nav-goals"><svg class="ic"><use href="#i-target"/></svg>Goals</button>
        <button class="nav-item" data-view="notes" id="nav-notes"><svg class="ic"><use href="#i-notes"/></svg>Notes</button>
        <button class="nav-item" data-view="settings" id="nav-settings"><svg class="ic"><use href="#i-sliders"/></svg>Settings</button>
      </nav>`;

if (navPattern.test(html)) {
  html = html.replace(navPattern, newNavMenu);
  console.log('Nav menu replaced successfully');
} else {
  console.log('Nav menu pattern failed to match');
}

// 2. Check & Replace Today study card action buttons
const vocabBtnRegex = /<button class="study-card-btn" data-step-act="plus" data-step-key="words">[\s\S]*?Start Learning →[\s\S]*?<\/button>/;
const gramBtnRegex = /<button class="study-card-btn" data-step-act="plus" data-step-key="grammarPages">[\s\S]*?Study Grammar →[\s\S]*?<\/button>/;

if (vocabBtnRegex.test(html)) {
  html = html.replace(vocabBtnRegex, `<a href="#/vocabulary" class="study-card-btn" style="text-decoration:none">Start Learning →</a>`);
  console.log('Vocab button replaced');
}
if (gramBtnRegex.test(html)) {
  html = html.replace(gramBtnRegex, `<a href="#/grammar" class="study-card-btn" style="text-decoration:none">Study Grammar →</a>`);
  console.log('Grammar button replaced');
}

// 3. Check & Fix saveVocabStarred / saveGrammarStarred
if (!html.includes('function saveVocabStarred')) {
  console.log('Adding saveVocabStarred and saveGrammarStarred');
  const saveKanjiDef = /function saveKanjiStarred\(\)\s*\{[\s\S]*?\}/;
  const newSaveStarred = `function saveKanjiStarred(){
  try { localStorage.setItem(LS_STARRED, JSON.stringify([...kanjiStarred])); } catch(e){}
}
function saveVocabStarred(){
  try { localStorage.setItem(LS_VOCAB_STARRED, JSON.stringify([...vocabStarred])); } catch(e){}
}
function saveGrammarStarred(){
  try { localStorage.setItem(LS_GRAMMAR_STARRED, JSON.stringify([...grammarStarred])); } catch(e){}
}`;
  html = html.replace(saveKanjiDef, newSaveStarred);
}

// 4. Check & Fix switchView
const switchViewPattern = /function switchView\(v\)\s*\{[\s\S]*?window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);\s*\}/;
const newSwitchView = `function switchView(v){
  VIEWS.forEach(x => { const el = $('#view-' + x); if (el) el.classList.toggle('active', x === v); });
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  $$('.bnav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  
  if (v === 'today') renderToday();
  else if (v === 'vocabulary') renderVocabularyView();
  else if (v === 'grammar') renderGrammarView();
  else if (v === 'kanji'){ updateFlashcardUI(); if (state.ui.kanjiMode === 'grid') renderKanjiGrid(); }
  else if (v === 'history'){ renderCalendar(); renderDayDetail(); renderHistoryList(); }
  else if (v === 'progress') renderProgress();
  else if (v === 'goals') syncGoalsUI();
  else if (v === 'notes') syncNotesUI();
  else if (v === 'settings') syncSettingsUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}`;

if (switchViewPattern.test(html)) {
  html = html.replace(switchViewPattern, newSwitchView);
  console.log('switchView replaced');
} else {
  console.log('switchView pattern failed to match');
}

// 5. Global Search
const searchModalPattern = /\/\* ---------------- Global Search Modal \(Ctrl \+ K\) ---------------- \*\/[\s\S]*?function openSearchModal\(\)\s*\{[\s\S]*?\n\}/;
const newSearchModal = `/* ---------------- Global Search Modal (Ctrl + K) ---------------- */
function openSearchModal(){
  const html = \`
    <input type="text" id="g-search-input" placeholder="Search words, kanji (e.g. 会, book), or grammar..." style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:14px;background:var(--bg);color:var(--text)">
    <div id="g-search-results" style="max-height:340px;overflow-y:auto;margin-top:12px;display:flex;flex-direction:column;gap:6px"></div>
  \`;
  openModal('🔍 Search Japanese Knowledge Base', html);
  const input = $('#g-search-input');
  input.focus();
  input.oninput = () => {
    const q = input.value.trim().toLowerCase();
    const resBox = $('#g-search-results');
    if (!q){ resBox.innerHTML = ''; return; }

    const kanjiList = getAllLoadedKanji();
    const vocabList = getAllLoadedVocabulary();
    const gramList = getAllLoadedGrammar();

    const kanjiMatches = kanjiList.filter(k => k.k.includes(q) || k.h.toLowerCase().includes(q) || k.r.toLowerCase().includes(q) || k.m.toLowerCase().includes(q)).slice(0, 5).map(x => ({ type: 'kanji', ...x }));
    const vocabMatches = vocabList.filter(v => v.word.toLowerCase().includes(q) || v.reading.toLowerCase().includes(q) || v.romaji.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q)).slice(0, 5).map(x => ({ type: 'vocab', ...x }));
    const gramMatches = gramList.filter(g => g.pattern.toLowerCase().includes(q) || g.meaning.toLowerCase().includes(q) || g.explanation.toLowerCase().includes(q)).slice(0, 5).map(x => ({ type: 'grammar', ...x }));

    const combined = [...kanjiMatches, ...vocabMatches, ...gramMatches];
    if (!combined.length){
      resBox.innerHTML = \`<p style="font-size:12.5px;color:var(--text-soft);padding:8px">No matching results found.</p>\`;
      return;
    }

    resBox.innerHTML = combined.map(item => {
      if (item.type === 'kanji'){
        return \`
          <div class="search-res-item" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between" data-type="kanji" data-k="\${item.k}">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:22px;font-weight:900">\${item.k}</span>
              <div>
                <div style="font-weight:800;font-size:13.5px"><span class="vocab-pos-tag" style="margin-right:4px">漢字</span>\${item.h} (\${item.r})</div>
                <div style="font-size:11.5px;color:var(--text-soft)">\${item.m} · \${item.ex}</div>
              </div>
            </div>
            <span class="fc-badge \${(item.lvl||'n5').toLowerCase()}">JLPT \${item.lvl||'N5'}</span>
          </div>
        \`;
      } else if (item.type === 'vocab') {
        return \`
          <div class="search-res-item" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between" data-type="vocab" data-id="\${item.id}">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:18px;font-weight:900;color:var(--green-deep)">\${item.word}</span>
              <div>
                <div style="font-weight:800;font-size:13.5px"><span class="vocab-pos-tag" style="margin-right:4px">語彙</span>\${item.reading} (\${item.romaji})</div>
                <div style="font-size:11.5px;color:var(--text-soft)">\${item.meaning} · \${item.partOfSpeech||''}</div>
              </div>
            </div>
            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
          </div>
        \`;
      } else {
        return \`
          <div class="search-res-item" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between" data-type="grammar" data-id="\${item.id}">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:16px;font-weight:900;color:var(--pink-text)">\${item.pattern}</span>
              <div>
                <div style="font-weight:800;font-size:13px"><span class="vocab-pos-tag" style="margin-right:4px">文法</span>\${item.meaning}</div>
                <div style="font-size:11.5px;color:var(--text-soft);max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${item.explanation}</div>
              </div>
            </div>
            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
          </div>
        \`;
      }
    }).join('');

    $$('.search-res-item', resBox).forEach(item => {
      item.onclick = () => {
        const type = item.dataset.type;
        closeModal();
        if (type === 'kanji'){
          location.hash = '#/kanji';
          kanjiIdx = kanjiDeck.findIndex(x => x.k === item.dataset.k);
          if (kanjiIdx < 0) kanjiIdx = 0;
          updateFlashcardUI();
        } else if (type === 'vocab'){
          location.hash = '#/vocabulary';
          const target = getAllLoadedVocabulary().find(x => x.id === item.dataset.id);
          if (target) openVocabDetail(target);
        } else if (type === 'grammar'){
          location.hash = '#/grammar';
          const target = getAllLoadedGrammar().find(x => x.id === item.dataset.id);
          if (target) openGrammarDetail(target);
        }
      };
    });
  };
}`;

if (searchModalPattern.test(html)) {
  html = html.replace(searchModalPattern, newSearchModal);
  console.log('Search modal replaced');
} else {
  console.log('Search modal pattern failed to match');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Finished diagnose and apply');
