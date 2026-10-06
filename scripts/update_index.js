const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update subnav
html = html.replace(
  '<button class="subnav-item" data-lib="grid">📑 All Kanji (253)</button>',
  '<button class="subnav-item" data-lib="grid">📑 All Kanji <span id="sidebar-kanji-count"></span></button>'
);

// 2. Update flashcard card count placeholder
html = html.replace(
  '<span id="fc-total-cards">253</span>',
  '<span id="fc-total-cards">--</span>'
);

// 3. Add updateDynamicKanjiCounts function and update loadAll
const oldLoadAll = `    // Modular Kanji data loading (preloads N5 and N4)
    await Promise.all([loadKanjiLevel('N5'), loadKanjiLevel('N4')]);
    kanjiDeck = getFilteredKanji();`;

const newLoadAll = `    // Modular Kanji data loading (preloads all supported levels)
    await Promise.all(SUPPORTED_JLPT_LEVELS.map(lvl => loadKanjiLevel(lvl)));
    kanjiDeck = getFilteredKanji();
    updateDynamicKanjiCounts();`;

if (html.includes(oldLoadAll)) {
  html = html.replace(oldLoadAll, newLoadAll);
} else {
  console.log('Notice: oldLoadAll not matched exactly, checking alternative');
}

// 4. Insert updateDynamicKanjiCounts function right above updateFlashcardUI
const oldFunc = '/* ---------------- Kanji Flashcard UI ---------------- */';
const newFunc = `/* ---------------- Dynamic Counts & Kanji Flashcard UI ---------------- */
function updateDynamicKanjiCounts(){
  const allCount = getAllLoadedKanji().length;
  const countEl = $('#sidebar-kanji-count');
  if (countEl) {
    countEl.textContent = allCount ? \`(\${allCount})\` : '';
  }
  const fcTotalEl = $('#fc-total-cards');
  if (fcTotalEl) {
    fcTotalEl.textContent = kanjiDeck.length;
  }
}
`;

if (!html.includes('function updateDynamicKanjiCounts()')) {
  html = html.replace(oldFunc, newFunc + '\n' + oldFunc);
}

// 5. Ensure updateDynamicKanjiCounts is also called inside updateFlashcardUI and level switches
html = html.replace(
  '  $(\'#fc-mastered-count\').textContent = kanjiStarred.size;',
  '  $(\'#fc-mastered-count\').textContent = kanjiStarred.size;\n  updateDynamicKanjiCounts();'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html with dynamic kanji count architecture!');
