const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}\n`);
  }
}

console.log('========================================================');
console.log(' Running Library Navigation Restructure Verification');
console.log('========================================================\n');

const indexPath = path.join(__dirname, '../index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

// 1. Sidebar Structure & Removal of "All Kanji (xxx)"
console.log('--- 1. Sidebar Structure & Child Items ---');

test('No "All Kanji (553)" or similar count item exists as a sidebar link', () => {
  // Check sidebar navigation menu content specifically
  const navMenuMatch = indexHtml.match(/<nav class="nav-menu" aria-label="Main Navigation">([\s\S]*?)<\/nav>/);
  assert(navMenuMatch, 'Could not find nav.nav-menu');
  const navMenuHtml = navMenuMatch[1];
  assert(!navMenuHtml.includes('All Kanji'), 'Sidebar nav still contains "All Kanji" link');
  assert(!navMenuHtml.includes('553'), 'Sidebar nav still contains "553" count');
});

test('Today dashboard remains separate as the first top-level nav item', () => {
  assert(indexHtml.includes('data-view="today" id="nav-today"'), 'Missing #nav-today');
  const todayIdx = indexHtml.indexOf('id="nav-today"');
  const libraryIdx = indexHtml.indexOf('id="nav-library-group"');
  assert(todayIdx !== -1 && libraryIdx !== -1 && todayIdx < libraryIdx, 'Today must be before Library');
});

test('Library section contains all 4 required child items with icons and links', () => {
  assert(indexHtml.includes('id="nav-flashcards"'), 'Missing #nav-flashcards');
  assert(indexHtml.includes('href="#/flashcards"'), 'Missing href="#/flashcards"');
  assert(indexHtml.includes('🎴') && indexHtml.includes('Flashcards'), 'Missing Flashcards icon/text');

  assert(indexHtml.includes('id="nav-kanji"'), 'Missing #nav-kanji');
  assert(indexHtml.includes('href="#/kanji"'), 'Missing href="#/kanji"');
  assert(indexHtml.includes('漢') && indexHtml.includes('Kanji'), 'Missing Kanji icon/text');

  assert(indexHtml.includes('id="nav-vocabulary"'), 'Missing #nav-vocabulary');
  assert(indexHtml.includes('href="#/vocabulary"'), 'Missing href="#/vocabulary"');
  assert(indexHtml.includes('📖') && indexHtml.includes('Vocabulary'), 'Missing Vocabulary icon/text');

  assert(indexHtml.includes('id="nav-grammar"'), 'Missing #nav-grammar');
  assert(indexHtml.includes('href="#/grammar"'), 'Missing href="#/grammar"');
  assert(indexHtml.includes('文') && indexHtml.includes('Grammar'), 'Missing Grammar icon/text');
});

// 2. Collapsible Behavior & LocalStorage
console.log('\n--- 2. Collapsible Behavior & State Persistence ---');

test('Library parent has toggle button, arrow indicator, and is open by default', () => {
  assert(indexHtml.includes('id="nav-library-btn"'), 'Missing #nav-library-btn');
  assert(indexHtml.includes('class="nav-arrow"'), 'Missing nav-arrow');
  assert(indexHtml.includes('id="library-submenu"'), 'Missing #library-submenu');
  assert(indexHtml.includes('class="nav-submenu show"'), 'Library submenu should have "show" class by default');
});

test('Library collapsed/expanded state is saved and restored via localStorage', () => {
  assert(indexHtml.includes('LS_LIB_OPEN') || indexHtml.includes('mn.library.open.v1'), 'Missing localStorage key for library open/collapsed state');
  assert(indexHtml.includes("localStorage.setItem(LS_LIB_OPEN"), 'Missing localStorage.setItem for library state');
  assert(indexHtml.includes("localStorage.getItem(LS_LIB_OPEN"), 'Missing localStorage.getItem for library state');
});

// 3. Router & Active State Handling
console.log('\n--- 3. Router & Active State Handling ---');

test('VIEWS array and router support all 4 Library sub-routes (#/flashcards, #/kanji, #/vocabulary, #/grammar)', () => {
  assert(indexHtml.includes("'flashcards'"), "VIEWS missing 'flashcards'");
  assert(indexHtml.includes("'kanji'"), "VIEWS missing 'kanji'");
  assert(indexHtml.includes("'vocabulary'"), "VIEWS missing 'vocabulary'");
  assert(indexHtml.includes("'grammar'"), "VIEWS missing 'grammar'");
});

test('switchView handles flashcards and kanji modes cleanly', () => {
  assert(indexHtml.includes("else if (v === 'flashcards'){ switchKanjiMode('flashcard'); updateFlashcardUI(); }"), "switchView missing flashcards dispatcher");
  assert(indexHtml.includes("else if (v === 'kanji'){ switchKanjiMode('grid'); renderKanjiGrid(); }"), "switchView missing kanji grid dispatcher");
  assert(indexHtml.includes("else if (v === 'vocabulary') renderVocabularyView()"), "switchView missing vocabulary dispatcher");
  assert(indexHtml.includes("else if (v === 'grammar') renderGrammarView()"), "switchView missing grammar dispatcher");
});

test('switchView highlights parent Library with in-section class and auto-expands when in Library routes', () => {
  assert(indexHtml.includes("libBtn.classList.toggle('in-section', isLibraryRoute)"), "Missing in-section class toggling on parent library button");
  assert(indexHtml.includes("submenu.classList.add('show')"), "Missing auto-expand when in library route");
});

test('switchView highlights respective subnav item', () => {
  assert(indexHtml.includes("b.classList.toggle('active', b.dataset.subview === v)"), "Missing subnav active class toggling");
});

// 4. CSS & Animations
console.log('\n--- 4. CSS Animations & Visual Polish ---');

test('Smooth max-height and opacity transitions exist for submenu', () => {
  assert(indexHtml.includes('transition: max-height') || indexHtml.includes('transition:max-height'), 'Submenu missing max-height transition');
  assert(indexHtml.includes('.nav-item.open .nav-arrow'), 'Missing arrow rotation rule for open state');
  assert(indexHtml.includes('transform: rotate(180deg)') || indexHtml.includes('transform:rotate(180deg)'), 'Arrow missing 180deg rotation');
});

test('prefers-reduced-motion media query disables animations/transitions', () => {
  assert(indexHtml.includes('@media (prefers-reduced-motion: reduce)') || indexHtml.includes('@media(prefers-reduced-motion:reduce)'), 'Missing prefers-reduced-motion media query');
});

// 5. Dynamic Counts Inside Page
console.log('\n--- 5. In-Page Dynamic Counts & Non-Regression ---');

test('Dynamic Kanji count is updated in Kanji section without hardcoded counts', () => {
  assert(indexHtml.includes('updateDynamicKanjiCounts'), 'updateDynamicKanjiCounts missing');
  assert(indexHtml.includes('id="kanji-page-count"'), 'Missing #kanji-page-count in Kanji section header');
});

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n========================================================');
console.log(` Results: ${passedTests} / ${totalTests} tests passed`);
console.log('========================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('All Library Navigation Restructure verifications passed successfully! 🚀');
}
