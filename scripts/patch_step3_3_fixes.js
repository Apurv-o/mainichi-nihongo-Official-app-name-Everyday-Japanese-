const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Fix $$ querySelectorAll for vocab and grammar cards
html = html.replace(
  `  $('.vocab-card', list).forEach(card => {`,
  `  $$('.vocab-card', list).forEach(card => {`
);
html = html.replace(
  `  $('.grammar-card', list).forEach(card => {`,
  `  $$('.grammar-card', list).forEach(card => {`
);

// 2. Fix switchView dispatching
const oldSwitchView = `function switchView(v){
  VIEWS.forEach(x => { const el = $('#view-' + x); if (el) el.classList.toggle('active', x === v); });
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  $$('.bnav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  
  if (v === 'today') renderToday();
  else if (v === 'kanji'){ updateFlashcardUI(); if (state.ui.kanjiMode === 'grid') renderKanjiGrid(); }`;

const newSwitchView = `function switchView(v){
  VIEWS.forEach(x => { const el = $('#view-' + x); if (el) el.classList.toggle('active', x === v); });
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  $$('.bnav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  
  if (v === 'today') renderToday();
  else if (v === 'vocabulary') renderVocabularyView();
  else if (v === 'grammar') renderGrammarView();
  else if (v === 'kanji'){ updateFlashcardUI(); if (state.ui.kanjiMode === 'grid') renderKanjiGrid(); }`;

html = html.replace(oldSwitchView, newSwitchView);

// 3. Update Unified Global Search Modal (Ctrl + K)
const oldSearchModal = `/* ---------------- Global Search Modal (Ctrl + K) ---------------- */
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

    const all = getAllLoadedKanji();
    const matches = all.filter(k => k.k.includes(q) || k.h.toLowerCase().includes(q) || k.r.toLowerCase().includes(q) || k.m.toLowerCase().includes(q)).slice(0, 15);
    if (!matches.length){
      resBox.innerHTML = \`<p style="font-size:12.5px;color:var(--text-soft);padding:8px">No matching Kanji or words found.</p>\`;
      return;
    }
    resBox.innerHTML = matches.map(m => \`
      <div class="search-res-item" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between" data-k="\${m.k}">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:24px;font-weight:900">\${m.k}</span>
          <div>
            <div style="font-weight:800;font-size:13.5px">\${m.h} (\${m.r})</div>
            <div style="font-size:11.5px;color:var(--text-soft)">\${m.m} · \${m.ex}</div>
          </div>
        </div>
        <span class="fc-badge \${(m.lvl||'n5').toLowerCase()}">JLPT \${m.lvl||'N5'}</span>
      </div>
    \`).join('');

    $$('.search-res-item', resBox).forEach(item => {
      item.onclick = () => {
        closeModal();
        location.hash = '#/kanji';
        kanjiIdx = kanjiDeck.findIndex(x => x.k === item.dataset.k);
        if (kanjiIdx < 0) kanjiIdx = 0;
        updateFlashcardUI();
      };
    });
  };
}`;

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

html = html.replace(oldSearchModal, newSearchModal);

// 4. Update Sidebar Navigation to include Vocabulary and Grammar directly
const oldNav = `<nav class="nav-menu" aria-label="Main Navigation">
        <button class="nav-item active" data-view="today"><svg class="ic"><use href="#i-home"/></svg>Today</button>
        <button class="nav-item" data-view="history"><svg class="ic"><use href="#i-cal"/></svg>History</button>
        <button class="nav-item" data-view="progress"><svg class="ic"><use href="#i-chart"/></svg>Progress</button>
        
        <!-- Library with Submenu -->
        <button class="nav-item" id="nav-library-btn" data-view="kanji">
          <svg class="ic"><use href="#i-book"/></svg>Library
          <span class="nav-arrow">▼</span>
        </button>
        <div class="nav-submenu" id="library-submenu">
          <button class="subnav-item active" data-lib="flashcard">🎴 Flashcards</button>
          <button class="subnav-item" data-lib="grid">📑 All Kanji <span id="sidebar-kanji-count"></span></button>
        </div>

        <button class="nav-item" data-view="goals"><svg class="ic"><use href="#i-target"/></svg>Goals</button>
        <button class="nav-item" data-view="notes"><svg class="ic"><use href="#i-notes"/></svg>Notes</button>
        <button class="nav-item" data-view="settings"><svg class="ic"><use href="#i-sliders"/></svg>Settings</button>
      </nav>`;

const newNav = `<nav class="nav-menu" aria-label="Main Navigation">
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

html = html.replace(oldNav, newNav);

// 5. Update Today view study action buttons
html = html.replace(
  `<button class="study-card-btn" data-step-act="plus" data-step-key="words">\n                  Start Learning →\n                </button>`,
  `<a href="#/vocabulary" class="study-card-btn" style="text-decoration:none">\n                  Start Learning →\n                </a>`
);
html = html.replace(
  `<button class="study-card-btn" data-step-act="plus" data-step-key="grammarPages">\n                  Study Grammar →\n                </button>`,
  `<a href="#/grammar" class="study-card-btn" style="text-decoration:none">\n                  Study Grammar →\n                </a>`
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully applied Step 3.3 polish and fixes to index.html');
