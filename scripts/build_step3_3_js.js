const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update Storage keys & State in index.html
const oldStorage = `const LS_STUDY = 'mn.study.v1', LS_SETTINGS = 'mn.settings.v1', LS_STARRED = 'mn.kanji.starred.v1';`;
const newStorage = `const LS_STUDY = 'mn.study.v1', LS_SETTINGS = 'mn.settings.v1', LS_STARRED = 'mn.kanji.starred.v1';
const LS_VOCAB_STARRED = 'mn.vocab.mastered.v1', LS_GRAMMAR_STARRED = 'mn.grammar.mastered.v1';

let vocabStarred = new Set();
let grammarStarred = new Set();
let vocabDeck = [];
let currentVocabLvl = 'all';
let currentVocabStatus = 'all';
let currentVocabMode = 'grid';
let vocabIdx = 0;

let currentGrammarLvl = 'all';
let currentGrammarStatus = 'all';`;

html = html.replace(oldStorage, newStorage);

// 2. Update loadAll to load vocabStarred and grammarStarred and preload all datasets
const oldLoadAll = `    const st = localStorage.getItem(LS_STARRED);
    if (st) kanjiStarred = new Set(JSON.parse(st));

    // Modular Kanji data loading (preloads all supported levels)
    await Promise.all(SUPPORTED_JLPT_LEVELS.map(lvl => loadKanjiLevel(lvl)));
    kanjiDeck = getFilteredKanji();
    updateDynamicKanjiCounts();`;

const newLoadAll = `    const st = localStorage.getItem(LS_STARRED);
    if (st) kanjiStarred = new Set(JSON.parse(st));
    const vst = localStorage.getItem(LS_VOCAB_STARRED);
    if (vst) vocabStarred = new Set(JSON.parse(vst));
    const gst = localStorage.getItem(LS_GRAMMAR_STARRED);
    if (gst) grammarStarred = new Set(JSON.parse(gst));

    // Preload all supported JLPT datasets for Kanji, Vocabulary, and Grammar
    await Promise.all([
      ...SUPPORTED_JLPT_LEVELS.map(lvl => loadKanjiLevel(lvl)),
      ...SUPPORTED_JLPT_LEVELS.map(lvl => loadVocabularyLevel(lvl)),
      ...SUPPORTED_JLPT_LEVELS.map(lvl => loadGrammarLevel(lvl))
    ]);
    kanjiDeck = getFilteredKanji();
    vocabDeck = getFilteredVocabulary();
    updateDynamicKanjiCounts();`;

html = html.replace(oldLoadAll, newLoadAll);

// 3. Add Save helpers
const oldSaveStarred = `function saveKanjiStarred(){
  try { localStorage.setItem(LS_STARRED, JSON.stringify([...kanjiStarred])); } catch(e){}
}`;

const newSaveStarred = `function saveKanjiStarred(){
  try { localStorage.setItem(LS_STARRED, JSON.stringify([...kanjiStarred])); } catch(e){}
}
function saveVocabStarred(){
  try { localStorage.setItem(LS_VOCAB_STARRED, JSON.stringify([...vocabStarred])); } catch(e){}
}
function saveGrammarStarred(){
  try { localStorage.setItem(LS_GRAMMAR_STARRED, JSON.stringify([...grammarStarred])); } catch(e){}
}`;

html = html.replace(oldSaveStarred, newSaveStarred);

// 4. Update router VIEWS array and switchView dispatcher
html = html.replace(
  "const VIEWS = ['today', 'kanji', 'history', 'progress', 'goals', 'notes', 'settings'];",
  "const VIEWS = ['today', 'vocabulary', 'grammar', 'kanji', 'history', 'progress', 'goals', 'notes', 'settings'];"
);

html = html.replace(
  "if (v === 'today') renderToday();\n  else if (v === 'kanji'){ updateFlashcardUI(); if (state.ui.kanjiMode === 'grid') renderKanjiGrid(); }",
  `if (v === 'today') renderToday();
  else if (v === 'vocabulary') renderVocabularyView();
  else if (v === 'grammar') renderGrammarView();
  else if (v === 'kanji'){ updateFlashcardUI(); if (state.ui.kanjiMode === 'grid') renderKanjiGrid(); }`
);

// 5. Add Complete Vocabulary and Grammar controller code right above /* ---------------- Navigation / Router ---------------- */
const vocabGrammarControllers = `
/* ============================================================
   VOCABULARY CONTROLLERS & LEARNING ENGINE
   ============================================================ */
function getFilteredVocabulary(){
  const all = getAllLoadedVocabulary();
  const q = ($('#vocab-search-input') && $('#vocab-search-input').value || '').trim().toLowerCase();
  
  return all.filter(item => {
    if (currentVocabLvl !== 'all' && (item.level || '').toUpperCase() !== currentVocabLvl.toUpperCase()) return false;
    const isStarred = vocabStarred.has(item.id);
    if (currentVocabStatus === 'starred' && !isStarred) return false;
    if (currentVocabStatus === 'unstarred' && isStarred) return false;
    if (q){
      return (item.word && item.word.toLowerCase().includes(q)) ||
             (item.reading && item.reading.toLowerCase().includes(q)) ||
             (item.romaji && item.romaji.toLowerCase().includes(q)) ||
             (item.meaning && item.meaning.toLowerCase().includes(q));
    }
    return true;
  });
}

function renderVocabularyView(){
  const all = getAllLoadedVocabulary();
  const filtered = getFilteredVocabulary();
  vocabDeck = filtered;

  // Progress Bar
  const totalCount = all.length || 1;
  const masteredCount = vocabStarred.size;
  const pct = Math.min(100, Math.round((masteredCount / totalCount) * 100));
  if ($('#vocab-progress-text')) $('#vocab-progress-text').textContent = \`\${masteredCount} / \${all.length} mastered (\${pct}%)\`;
  if ($('#vocab-progress-fill')) $('#vocab-progress-fill').style.width = pct + '%';

  // Render active mode
  if (currentVocabMode === 'grid') {
    renderVocabGrid(filtered);
  } else if (currentVocabMode === 'flashcard') {
    updateVocabFlashcardUI();
  } else if (currentVocabMode === 'queue') {
    renderVocabQueue();
  }
}

function renderVocabGrid(items){
  const list = $('#vocab-grid-list');
  if (!list) return;

  if (!items.length) {
    list.innerHTML = \`<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-soft);font-size:13px">No matching vocabulary words found.</div>\`;
    return;
  }

  list.innerHTML = items.map((item, idx) => {
    const isStarred = vocabStarred.has(item.id);
    const delayStyle = idx < 30 ? \`style="--item-idx:\${idx}"\` : '';
    return \`
      <div class="vocab-card \${isStarred ? 'starred' : ''}" data-id="\${item.id}" \${delayStyle}>
        <div>
          <div class="vocab-card-head">
            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
          </div>
          <div class="vocab-word" style="margin-top:6px">\${esc(item.word)}</div>
          <div class="vocab-reading">\${esc(item.reading)}</div>
          <div class="vocab-romaji">\${esc(item.romaji)}</div>
          <div class="vocab-meaning">\${esc(item.meaning)}</div>
        </div>
        <div class="vocab-pos-tag">\${esc(item.partOfSpeech || 'word')}</div>
      </div>
    \`;
  }).join('');

  $$('.vocab-card', list).forEach(card => {
    card.onclick = () => {
      const id = card.dataset.id;
      const item = getAllLoadedVocabulary().find(x => x.id === id);
      if (item) openVocabDetail(item);
    };
  });
}

function openVocabDetail(item){
  const isStarred = vocabStarred.has(item.id);
  const ex = item.example || {};
  const tagsHtml = (item.tags || []).map(t => \`<span class="vocab-pos-tag" style="margin-right:4px">#\${esc(t)}</span>\`).join('');

  const bodyHtml = \`
    <div style="text-align:left">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
          <div class="detail-modal-word">\${esc(item.word)}</div>
          <div class="detail-modal-reading">\${esc(item.reading)} · <span style="font-size:14px;color:var(--text-soft);font-style:italic">\${esc(item.romaji)}</span></div>
        </div>
        <button class="fc-btn star \${isStarred ? 'active' : ''}" id="modal-vocab-star-btn" style="align-self:flex-start">
          ⭐ \${isStarred ? 'Mastered ✓' : 'Mark Mastered'}
        </button>
      </div>

      <div class="detail-modal-section">
        <div class="detail-modal-label">Meaning & Part of Speech</div>
        <div style="font-size:15px;font-weight:700;color:var(--text)">\${esc(item.meaning)}</div>
        <div style="font-size:12px;color:var(--text-soft);margin-top:2px">\${esc(item.partOfSpeech || '')}</div>
      </div>

      <div class="detail-modal-section">
        <div class="detail-modal-label">Example Sentence</div>
        <div style="font-size:14.5px;font-weight:800;color:var(--text)">\${esc(ex.jp || '')}</div>
        <div style="font-size:12.5px;font-weight:700;color:var(--green-deep);margin-top:2px">\${esc(ex.hira || '')}</div>
        <div style="font-size:12px;color:var(--text-soft);font-style:italic;margin-top:2px">\${esc(ex.en || '')}</div>
      </div>

      \${tagsHtml ? \`<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:4px">\${tagsHtml}</div>\` : ''}
    </div>
  \`;

  openModal('📖 Vocabulary Detail', bodyHtml);

  $('#modal-vocab-star-btn').onclick = () => {
    if (vocabStarred.has(item.id)) {
      vocabStarred.delete(item.id);
      toast(\`Unmarked \${item.word}\`);
    } else {
      vocabStarred.add(item.id);
      toast(\`⭐ Mastered \${item.word} (\${item.reading})!\`);
    }
    saveVocabStarred();
    renderVocabularyView();
    closeModal();
  };
}

function updateVocabFlashcardUI(){
  if (!vocabDeck.length) {
    vocabDeck = getFilteredVocabulary();
  }
  const item = vocabDeck[vocabIdx] || vocabDeck[0];
  if (!item) return;

  $('#vb-fc-current-idx').textContent = vocabIdx + 1;
  $('#vb-fc-total-cards').textContent = vocabDeck.length;
  $('#vb-fc-mastered-count').textContent = vocabStarred.size;

  $('#vb-fc-word').textContent = item.word;
  $('#vb-fc-pos').textContent = item.partOfSpeech || 'vocabulary';
  const badge = $('#vb-fc-lvl-badge');
  badge.textContent = \`JLPT \${item.level || 'N5'}\`;
  badge.className = \`fc-badge \${(item.level||'n5').toLowerCase()}\`;

  $('#vb-fc-reading').textContent = item.reading;
  $('#vb-fc-romaji').textContent = item.romaji;
  $('#vb-fc-meaning').textContent = item.meaning;
  
  const ex = item.example || {};
  $('#vb-fc-s-jp').textContent = ex.jp || '';
  $('#vb-fc-s-hira').textContent = ex.hira || '';
  $('#vb-fc-s-en').textContent = ex.en || '';

  const isStarred = vocabStarred.has(item.id);
  $('#vb-fc-star').classList.toggle('active', isStarred);
  $('#vb-fc-star-label').textContent = isStarred ? 'Mastered ✓' : 'Mark Mastered';
  $('#vocab-flashcard').classList.remove('flipped');
}

function renderVocabQueue(){
  const all = getAllLoadedVocabulary();
  const unmastered = all.filter(x => !vocabStarred.has(x.id));
  const queue = (unmastered.length >= 10 ? unmastered : all).slice(0, 10);
  
  const list = $('#vocab-queue-list');
  if (!list) return;

  list.innerHTML = queue.map((item, idx) => {
    const isStarred = vocabStarred.has(item.id);
    return \`
      <div class="vocab-card \${isStarred ? 'starred' : ''}" data-id="\${item.id}" style="--item-idx:\${idx}">
        <div>
          <div class="vocab-card-head">
            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
            <span style="font-size:11px;font-weight:700;color:var(--green-deep)">Queue #\${idx + 1}</span>
          </div>
          <div class="vocab-word" style="margin-top:6px">\${esc(item.word)}</div>
          <div class="vocab-reading">\${esc(item.reading)}</div>
          <div class="vocab-meaning">\${esc(item.meaning)}</div>
        </div>
        <div class="vocab-pos-tag">\${esc(item.partOfSpeech || '')}</div>
      </div>
    \`;
  }).join('');

  $$('.vocab-card', list).forEach(card => {
    card.onclick = () => {
      const id = card.dataset.id;
      const item = all.find(x => x.id === id);
      if (item) openVocabDetail(item);
    };
  });
}

function switchVocabMode(mode){
  currentVocabMode = mode;
  $('#vb-grid-mode').style.display = (mode === 'grid') ? 'block' : 'none';
  $('#vb-flashcard-mode').style.display = (mode === 'flashcard') ? 'block' : 'none';
  $('#vb-queue-mode').style.display = (mode === 'queue') ? 'block' : 'none';
  $$('#vocab-view-mode button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  renderVocabularyView();
}

/* ============================================================
   GRAMMAR CONTROLLERS & LEARNING ENGINE
   ============================================================ */
function getFilteredGrammar(){
  const all = getAllLoadedGrammar();
  const q = ($('#grammar-search-input') && $('#grammar-search-input').value || '').trim().toLowerCase();

  return all.filter(item => {
    if (currentGrammarLvl !== 'all' && (item.level || '').toUpperCase() !== currentGrammarLvl.toUpperCase()) return false;
    const isStarred = grammarStarred.has(item.id);
    if (currentGrammarStatus === 'starred' && !isStarred) return false;
    if (currentGrammarStatus === 'unstarred' && isStarred) return false;
    if (q){
      return (item.pattern && item.pattern.toLowerCase().includes(q)) ||
             (item.meaning && item.meaning.toLowerCase().includes(q)) ||
             (item.explanation && item.explanation.toLowerCase().includes(q));
    }
    return true;
  });
}

function renderGrammarView(){
  const all = getAllLoadedGrammar();
  const filtered = getFilteredGrammar();

  // Progress Bar
  const totalCount = all.length || 1;
  const masteredCount = grammarStarred.size;
  const pct = Math.min(100, Math.round((masteredCount / totalCount) * 100));
  if ($('#grammar-progress-text')) $('#grammar-progress-text').textContent = \`\${masteredCount} / \${all.length} mastered (\${pct}%)\`;
  if ($('#grammar-progress-fill')) $('#grammar-progress-fill').style.width = pct + '%';

  const list = $('#grammar-grid-list');
  if (!list) return;

  if (!filtered.length) {
    list.innerHTML = \`<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-soft);font-size:13px">No matching grammar patterns found.</div>\`;
    return;
  }

  list.innerHTML = filtered.map((item, idx) => {
    const isStarred = grammarStarred.has(item.id);
    const delayStyle = idx < 30 ? \`style="--item-idx:\${idx}"\` : '';
    return \`
      <div class="grammar-card \${isStarred ? 'starred' : ''}" data-id="\${item.id}" \${delayStyle}>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
          </div>
          <div class="grammar-pattern" style="margin-top:6px">\${esc(item.pattern)}</div>
          <div class="grammar-meaning">\${esc(item.meaning)}</div>
          <div class="grammar-explanation" style="margin-top:4px">\${esc(item.explanation)}</div>
        </div>
        <div class="grammar-formation-preview">\${esc(item.formation || 'Pattern')}</div>
      </div>
    \`;
  }).join('');

  $$('.grammar-card', list).forEach(card => {
    card.onclick = () => {
      const id = card.dataset.id;
      const item = all.find(x => x.id === id);
      if (item) openGrammarDetail(item);
    };
  });
}

function openGrammarDetail(item){
  const isStarred = grammarStarred.has(item.id);
  const examplesHtml = (item.examples || []).map(ex => \`
    <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px dashed var(--border)">
      <div style="font-size:14px;font-weight:800;color:var(--text)">\${esc(ex.jp || '')}</div>
      <div style="font-size:12px;font-weight:700;color:var(--green-deep)">\${esc(ex.hira || '')}</div>
      <div style="font-size:11.5px;color:var(--text-soft);font-style:italic">\${esc(ex.en || '')}</div>
    </div>
  \`).join('');

  const bodyHtml = \`
    <div style="text-align:left">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
          <div style="font-family:var(--font-jp);font-size:24px;font-weight:900;color:var(--text);margin-top:4px">\${esc(item.pattern)}</div>
          <div style="font-size:14px;font-weight:700;color:var(--pink-text);margin-top:2px">\${esc(item.meaning)}</div>
        </div>
        <button class="fc-btn star \${isStarred ? 'active' : ''}" id="modal-grammar-star-btn" style="align-self:flex-start">
          ⭐ \${isStarred ? 'Mastered ✓' : 'Mark Mastered'}
        </button>
      </div>

      <div class="detail-modal-section">
        <div class="detail-modal-label">Grammar Explanation</div>
        <div style="font-size:13px;color:var(--text);line-height:1.45">\${esc(item.explanation)}</div>
      </div>

      <div class="detail-modal-section">
        <div class="detail-modal-label">Formation / Structure</div>
        <div style="font-size:12.5px;font-weight:700;color:var(--text-soft);font-family:monospace">\${esc(item.formation)}</div>
      </div>

      <div class="detail-modal-section">
        <div class="detail-modal-label">Examples</div>
        \${examplesHtml || '<div style="font-size:12px;color:var(--text-soft)">No example available.</div>'}
      </div>

      \${item.commonMistakes ? \`
        <div class="detail-modal-section" style="border-left:3px solid var(--amber)">
          <div class="detail-modal-label" style="color:var(--amber-text)">⚠️ Usage Note & Common Mistakes</div>
          <div style="font-size:12px;color:var(--text-soft)">\${esc(item.commonMistakes)}</div>
        </div>
      \` : ''}
    </div>
  \`;

  openModal('📝 Grammar Detail', bodyHtml);

  $('#modal-grammar-star-btn').onclick = () => {
    if (grammarStarred.has(item.id)) {
      grammarStarred.delete(item.id);
      toast(\`Unmarked \${item.pattern}\`);
    } else {
      grammarStarred.add(item.id);
      toast(\`⭐ Mastered \${item.pattern}!\`);
    }
    saveGrammarStarred();
    renderGrammarView();
    closeModal();
  };
}
`;

html = html.replace('/* ---------------- Navigation / Router ---------------- */', vocabGrammarControllers + '\n/* ---------------- Navigation / Router ---------------- */');

// 6. Hook up Vocabulary & Grammar event listeners in app initialization
const eventHookups = `
  // Vocabulary Filters & Search
  $$('#vocab-lvl-filter button').forEach(b => {
    b.onclick = async () => {
      currentVocabLvl = b.dataset.lvl;
      $$('#vocab-lvl-filter button').forEach(x => x.classList.toggle('active', x === b));
      if (currentVocabLvl !== 'all') await loadVocabularyLevel(currentVocabLvl);
      vocabIdx = 0;
      renderVocabularyView();
    };
  });
  $$('#vocab-view-mode button').forEach(b => {
    b.onclick = () => switchVocabMode(b.dataset.mode);
  });
  $$('#vocab-status-filter button').forEach(b => {
    b.onclick = () => {
      currentVocabStatus = b.dataset.status;
      $$('#vocab-status-filter button').forEach(x => x.classList.toggle('active', x === b));
      renderVocabularyView();
    };
  });
  if ($('#vocab-search-input')) $('#vocab-search-input').oninput = renderVocabularyView;

  // Vocabulary Flashcards controls
  const vcard = $('#vocab-flashcard');
  if (vcard) {
    vcard.onclick = () => vcard.classList.toggle('flipped');
    $('#vb-fc-flip').onclick = () => vcard.classList.toggle('flipped');
    $('#vb-fc-next').onclick = () => {
      vocabIdx = (vocabIdx + 1) % (vocabDeck.length || 1);
      updateVocabFlashcardUI();
    };
    $('#vb-fc-prev').onclick = () => {
      vocabIdx = (vocabIdx - 1 + (vocabDeck.length || 1)) % (vocabDeck.length || 1);
      updateVocabFlashcardUI();
    };
    $('#vb-fc-shuffle').onclick = () => {
      for (let i = vocabDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [vocabDeck[i], vocabDeck[j]] = [vocabDeck[j], vocabDeck[i]];
      }
      vocabIdx = 0; updateVocabFlashcardUI();
      toast('🔀 Vocabulary deck shuffled!');
    };
    $('#vb-fc-star').onclick = () => {
      const item = vocabDeck[vocabIdx];
      if (!item) return;
      if (vocabStarred.has(item.id)){
        vocabStarred.delete(item.id); toast(\`Unmarked \${item.word}\`);
      } else {
        vocabStarred.add(item.id); toast(\`⭐ Mastered \${item.word} (\${item.reading})!\`);
      }
      saveVocabStarred(); updateVocabFlashcardUI();
    };
    $('#vb-fc-log').onclick = async () => {
      const cur = getTodayEntry().words || 0;
      await patchToday({ words: cur + 1 });
      renderToday();
      toast(\`+1 Word logged to today! 📖\`);
    };
  }

  // Grammar Filters & Search
  $$('#grammar-lvl-filter button').forEach(b => {
    b.onclick = async () => {
      currentGrammarLvl = b.dataset.lvl;
      $$('#grammar-lvl-filter button').forEach(x => x.classList.toggle('active', x === b));
      if (currentGrammarLvl !== 'all') await loadGrammarLevel(currentGrammarLvl);
      renderGrammarView();
    };
  });
  $$('#grammar-status-filter button').forEach(b => {
    b.onclick = () => {
      currentGrammarStatus = b.dataset.status;
      $$('#grammar-status-filter button').forEach(x => x.classList.toggle('active', x === b));
      renderGrammarView();
    };
  });
  if ($('#grammar-search-input')) $('#grammar-search-input').oninput = renderGrammarView;
`;

html = html.replace('// Kanji level filter', eventHookups + '\n  // Kanji level filter');

// 7. Update Global Search Modal to search across Kanji, Vocabulary, and Grammar
const oldSearchModal = `function openSearchModal(){
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

const newSearchModal = `function openSearchModal(){
  const html = \`
    <input type="text" id="g-search-input" placeholder="Search words, grammar, or kanji..." style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:14px;background:var(--bg);color:var(--text)">
    <div id="g-search-results" style="max-height:340px;overflow-y:auto;margin-top:12px;display:flex;flex-direction:column;gap:6px"></div>
  \`;
  openModal('🔍 Search Japanese Knowledge Base', html);
  const input = $('#g-search-input');
  input.focus();
  input.oninput = () => {
    const q = input.value.trim().toLowerCase();
    const resBox = $('#g-search-results');
    if (!q){ resBox.innerHTML = ''; return; }

    const allKanji = getAllLoadedKanji();
    const allVocab = getAllLoadedVocabulary();
    const allGrammar = getAllLoadedGrammar();

    const kMatches = allKanji.filter(k => k.k.includes(q) || k.h.toLowerCase().includes(q) || k.r.toLowerCase().includes(q) || k.m.toLowerCase().includes(q)).slice(0, 5).map(x => ({ type: 'kanji', data: x }));
    const vMatches = allVocab.filter(v => v.word.includes(q) || v.reading.toLowerCase().includes(q) || v.romaji.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q)).slice(0, 5).map(x => ({ type: 'vocab', data: x }));
    const gMatches = allGrammar.filter(g => g.pattern.includes(q) || g.meaning.toLowerCase().includes(q) || g.explanation.toLowerCase().includes(q)).slice(0, 5).map(x => ({ type: 'grammar', data: x }));

    const combined = [...kMatches, ...vMatches, ...gMatches];
    if (!combined.length){
      resBox.innerHTML = \`<p style="font-size:12.5px;color:var(--text-soft);padding:8px">No matching items found.</p>\`;
      return;
    }

    resBox.innerHTML = combined.map(item => {
      if (item.type === 'kanji') {
        const m = item.data;
        return \`
          <div class="search-res-item" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between" data-type="kanji" data-k="\${m.k}">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:24px;font-weight:900">\${m.k}</span>
              <div>
                <div style="font-weight:800;font-size:13.5px">\${m.h} (\${m.r})</div>
                <div style="font-size:11.5px;color:var(--text-soft)">\${m.m} · \${m.ex}</div>
              </div>
            </div>
            <span class="fc-badge \${(m.lvl||'n5').toLowerCase()}">Kanji \${m.lvl||'N5'}</span>
          </div>
        \`;
      } else if (item.type === 'vocab') {
        const v = item.data;
        return \`
          <div class="search-res-item" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between" data-type="vocab" data-id="\${v.id}">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:16px;font-weight:900;color:var(--green-deep)">\${v.word}</span>
              <div>
                <div style="font-weight:800;font-size:13px">\${v.reading} (\${v.romaji})</div>
                <div style="font-size:11.5px;color:var(--text-soft)">\${v.meaning}</div>
              </div>
            </div>
            <span class="fc-badge \${(v.level||'n5').toLowerCase()}">Vocab \${v.level||'N5'}</span>
          </div>
        \`;
      } else {
        const g = item.data;
        return \`
          <div class="search-res-item" style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between" data-type="grammar" data-id="\${g.id}">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:14px;font-weight:900;color:var(--pink-text)">\${g.pattern}</span>
              <div>
                <div style="font-size:12.5px;font-weight:700;color:var(--text)">\${g.meaning}</div>
              </div>
            </div>
            <span class="fc-badge \${(g.level||'n5').toLowerCase()}">Grammar \${g.level||'N5'}</span>
          </div>
        \`;
      }
    }).join('');

    $$('.search-res-item', resBox).forEach(item => {
      item.onclick = () => {
        closeModal();
        const type = item.dataset.type;
        if (type === 'kanji') {
          location.hash = '#/kanji';
          kanjiIdx = kanjiDeck.findIndex(x => x.k === item.dataset.k);
          if (kanjiIdx < 0) kanjiIdx = 0;
          updateFlashcardUI();
        } else if (type === 'vocab') {
          location.hash = '#/vocabulary';
          const v = getAllLoadedVocabulary().find(x => x.id === item.dataset.id);
          if (v) openVocabDetail(v);
        } else if (type === 'grammar') {
          location.hash = '#/grammar';
          const g = getAllLoadedGrammar().find(x => x.id === item.dataset.id);
          if (g) openGrammarDetail(g);
        }
      };
    });
  };
}`;

html = html.replace(oldSearchModal, newSearchModal);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully integrated Vocabulary & Grammar controllers, router, and global search into index.html');
