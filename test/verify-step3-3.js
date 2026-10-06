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
console.log(' Running Complete Step 3.3 Verification Suite (Vocab & Grammar)');
console.log('========================================================\n');

const levels = ['n5', 'n4', 'n3', 'n2', 'n1'];
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// ----------------------------------------------------
// SECTION 1: Vocabulary & Grammar Datasets Integrity
// ----------------------------------------------------
console.log('--- 1. Vocabulary & Grammar Datasets Integrity ---');

levels.forEach(lvl => {
  test(`data/vocabulary/${lvl}.json has valid schema & non-empty items`, () => {
    const p = path.join(__dirname, `../data/vocabulary/${lvl}.json`);
    assert(fs.existsSync(p), `File ${p} does not exist`);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    assert(Array.isArray(data) && data.length > 0, `${lvl} vocabulary is empty or not an array`);

    const seenIds = new Set();
    data.forEach((item, idx) => {
      assert(item.id, `Item ${idx} missing id in vocab ${lvl}`);
      assert(!seenIds.has(item.id), `Duplicate id ${item.id} in vocab ${lvl}`);
      seenIds.add(item.id);
      assert(item.word && item.word.length > 0, `Item ${idx} missing word`);
      assert(item.reading && item.reading.length > 0, `Item ${idx} missing reading`);
      assert(item.romaji && item.romaji.length > 0, `Item ${idx} missing romaji`);
      assert(item.meaning && item.meaning.length > 0, `Item ${idx} missing meaning`);
      assert(item.partOfSpeech && item.partOfSpeech.length > 0, `Item ${idx} missing partOfSpeech`);
      assert.strictEqual(item.level.toLowerCase(), lvl, `Item ${idx} level mismatch: ${item.level} vs ${lvl}`);
      assert(item.example, `Item ${idx} missing example`);
      assert(item.example.jp, `Item ${idx} missing example.jp`);
      assert(item.example.hira, `Item ${idx} missing example.hira`);
      assert(item.example.en, `Item ${idx} missing example.en`);
    });
  });
});

levels.forEach(lvl => {
  test(`data/grammar/${lvl}.json has valid schema & non-empty items`, () => {
    const p = path.join(__dirname, `../data/grammar/${lvl}.json`);
    assert(fs.existsSync(p), `File ${p} does not exist`);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    assert(Array.isArray(data) && data.length > 0, `${lvl} grammar is empty or not an array`);

    const seenIds = new Set();
    data.forEach((item, idx) => {
      assert(item.id, `Item ${idx} missing id in grammar ${lvl}`);
      assert(!seenIds.has(item.id), `Duplicate id ${item.id} in grammar ${lvl}`);
      seenIds.add(item.id);
      assert(item.pattern && item.pattern.length > 0, `Item ${idx} missing pattern`);
      assert(item.meaning && item.meaning.length > 0, `Item ${idx} missing meaning`);
      assert(item.explanation && item.explanation.length > 0, `Item ${idx} missing explanation`);
      assert(item.formation && item.formation.length > 0, `Item ${idx} missing formation`);
      assert.strictEqual(item.level.toLowerCase(), lvl, `Item ${idx} level mismatch: ${item.level} vs ${lvl}`);
      assert(Array.isArray(item.examples) && item.examples.length > 0, `Item ${idx} missing examples array`);
      item.examples.forEach((ex, exIdx) => {
        assert(ex.jp, `Example ${exIdx} missing jp in ${item.id}`);
        assert(ex.hira, `Example ${exIdx} missing hira in ${item.id}`);
        assert(ex.en, `Example ${exIdx} missing en in ${item.id}`);
      });
    });
  });
});

// ----------------------------------------------------
// SECTION 2: Vocabulary Library Section & Features
// ----------------------------------------------------
console.log('\n--- 2. Vocabulary Library View & Controllers ---');

test('index.html contains #view-vocabulary with title, level filters, and search box', () => {
  assert(indexHtml.includes('id="view-vocabulary"'), 'Missing #view-vocabulary');
  assert(indexHtml.includes('Vocabulary Library'), 'Missing Vocabulary Library title');
  assert(indexHtml.includes('Build practical Japanese vocabulary from N5 to N1'), 'Missing Vocabulary subtitle');
  assert(indexHtml.includes('id="vocab-lvl-filter"'), 'Missing #vocab-lvl-filter');
  assert(indexHtml.includes('id="vocab-search-input"'), 'Missing #vocab-search-input');
  assert(indexHtml.includes('Search by Japanese, reading, romaji, or meaning'), 'Missing vocab search placeholder');
});

test('Vocabulary library supports Grid, Flashcards, and Focused Queue modes', () => {
  assert(indexHtml.includes('id="vb-grid-mode"'), 'Missing #vb-grid-mode');
  assert(indexHtml.includes('id="vocab-grid-list"'), 'Missing #vocab-grid-list');
  assert(indexHtml.includes('id="vb-flashcard-mode"'), 'Missing #vb-flashcard-mode');
  assert(indexHtml.includes('id="vocab-flashcard"'), 'Missing #vocab-flashcard');
  assert(indexHtml.includes('id="vb-queue-mode"'), 'Missing #vb-queue-mode');
  assert(indexHtml.includes('id="vocab-queue-list"'), 'Missing #vocab-queue-list');
});

test('Vocabulary mastery is persisted via mn.vocab.mastered.v1', () => {
  assert(indexHtml.includes('LS_VOCAB_STARRED = \'mn.vocab.mastered.v1\''), 'Missing LS_VOCAB_STARRED constant');
  assert(indexHtml.includes('function saveVocabStarred'), 'Missing saveVocabStarred function');
});

test('Vocabulary controllers provide search, filtering, detail modal, and progress calculation', () => {
  assert(indexHtml.includes('function getFilteredVocabulary'), 'Missing getFilteredVocabulary function');
  assert(indexHtml.includes('function renderVocabularyView'), 'Missing renderVocabularyView function');
  assert(indexHtml.includes('function openVocabDetail'), 'Missing openVocabDetail function');
  assert(indexHtml.includes('function renderVocabQueue'), 'Missing renderVocabQueue function');
  assert(indexHtml.includes('function updateVocabFlashcardUI'), 'Missing updateVocabFlashcardUI function');
});

// ----------------------------------------------------
// SECTION 3: Grammar Library Section & Features
// ----------------------------------------------------
console.log('\n--- 3. Grammar Library View & Controllers ---');

test('index.html contains #view-grammar with title, level filters, and search box', () => {
  assert(indexHtml.includes('id="view-grammar"'), 'Missing #view-grammar');
  assert(indexHtml.includes('Grammar Library'), 'Missing Grammar Library title');
  assert(indexHtml.includes('Understand Japanese grammar from N5 to N1'), 'Missing Grammar subtitle');
  assert(indexHtml.includes('id="grammar-lvl-filter"'), 'Missing #grammar-lvl-filter');
  assert(indexHtml.includes('id="grammar-search-input"'), 'Missing #grammar-search-input');
  assert(indexHtml.includes('Search by grammar pattern, meaning, or explanation'), 'Missing grammar search placeholder');
});

test('Grammar library supports Grid and Focused Queue modes', () => {
  assert(indexHtml.includes('id="gm-grid-mode"'), 'Missing #gm-grid-mode');
  assert(indexHtml.includes('id="grammar-grid-list"'), 'Missing #grammar-grid-list');
  assert(indexHtml.includes('id="gm-queue-mode"'), 'Missing #gm-queue-mode');
  assert(indexHtml.includes('id="grammar-queue-list"'), 'Missing #grammar-queue-list');
});

test('Grammar mastery is persisted via mn.grammar.mastered.v1', () => {
  assert(indexHtml.includes('LS_GRAMMAR_STARRED = \'mn.grammar.mastered.v1\''), 'Missing LS_GRAMMAR_STARRED constant');
  assert(indexHtml.includes('function saveGrammarStarred'), 'Missing saveGrammarStarred function');
});

test('Grammar controllers provide search, filtering, detail modal, formation, examples, and common mistakes', () => {
  assert(indexHtml.includes('function getFilteredGrammar'), 'Missing getFilteredGrammar function');
  assert(indexHtml.includes('function renderGrammarView'), 'Missing renderGrammarView function');
  assert(indexHtml.includes('function renderGrammarGrid'), 'Missing renderGrammarGrid function');
  assert(indexHtml.includes('function renderGrammarQueue'), 'Missing renderGrammarQueue function');
  assert(indexHtml.includes('function openGrammarDetail'), 'Missing openGrammarDetail function');
});

// ----------------------------------------------------
// SECTION 4: Today Dashboard & Navigation Integration
// ----------------------------------------------------
console.log('\n--- 4. Today Dashboard & Router Integration ---');

test('Today dashboard action buttons navigate to #/vocabulary and #/grammar', () => {
  assert(indexHtml.includes('href="#/vocabulary" class="study-card-btn"'), 'Today vocab card must link to #/vocabulary');
  assert(indexHtml.includes('href="#/grammar" class="study-card-btn"'), 'Today grammar card must link to #/grammar');
});

test('Router switchView dispatches vocabulary and grammar views properly', () => {
  assert(indexHtml.includes("else if (v === 'vocabulary') renderVocabularyView()"), "Router missing vocabulary branch");
  assert(indexHtml.includes("else if (v === 'grammar') renderGrammarView()"), "Router missing grammar branch");
});

test('Unified Global Search (Ctrl + K) handles Kanji, Vocabulary, and Grammar with badges and navigation', () => {
  assert(indexHtml.includes('openSearchModal'), 'openSearchModal missing');
  assert(indexHtml.includes('getAllLoadedVocabulary()'), 'Global search missing vocab query');
  assert(indexHtml.includes('getAllLoadedGrammar()'), 'Global search missing grammar query');
  assert(indexHtml.includes('openVocabDetail(target)'), 'Global search missing vocab detail routing');
  assert(indexHtml.includes('openGrammarDetail(target)'), 'Global search missing grammar detail routing');
});

// ----------------------------------------------------
// SECTION 5: Service Worker Offline Caching
// ----------------------------------------------------
console.log('\n--- 5. Service Worker Offline Caching ---');

const swContent = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');

test('sw.js cache is updated and includes all N5-N1 vocab, grammar, and kanji assets', () => {
  assert(/mainichi-nihongo-v(9|10)/.test(swContent), 'sw.js cache name is updated');
  levels.forEach(lvl => {
    assert(swContent.includes(`./data/vocabulary/${lvl}.json`), `sw.js missing ./data/vocabulary/${lvl}.json`);
    assert(swContent.includes(`./data/grammar/${lvl}.json`), `sw.js missing ./data/grammar/${lvl}.json`);
    assert(swContent.includes(`./data/kanji/${lvl}.json`), `sw.js missing ./data/kanji/${lvl}.json`);
  });
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
  console.log('All Step 3.3 verifications passed successfully! 🚀');
}
