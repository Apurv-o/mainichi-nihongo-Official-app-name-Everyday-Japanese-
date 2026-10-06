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
console.log(' Running Step 3.1 Verification Suite');
console.log('========================================================\n');

// 1. Kanji Datasets (N5 – N1)
console.log('--- 1. Kanji Learning Content & Counts ---');

const kanjiLevels = ['n5', 'n4', 'n3', 'n2', 'n1'];
const kanjiMinCounts = { n5: 100, n4: 100, n3: 100, n2: 100, n1: 100 };
let totalKanji = 0;

kanjiLevels.forEach(lvl => {
  test(`data/kanji/${lvl}.json has >= ${kanjiMinCounts[lvl]} unique records and valid schema`, () => {
    const p = path.join(__dirname, `../data/kanji/${lvl}.json`);
    assert.strictEqual(fs.existsSync(p), true, `File ${p} does not exist`);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    assert(data.length >= kanjiMinCounts[lvl], `${lvl} count ${data.length} is less than ${kanjiMinCounts[lvl]}`);
    totalKanji += data.length;

    const seen = new Set();
    data.forEach((item, idx) => {
      assert(item.k && typeof item.k === 'string', `Item ${idx} missing .k`);
      assert(!seen.has(item.k), `Duplicate kanji '${item.k}' found in ${lvl}`);
      seen.add(item.k);
      assert(item.lvl && typeof item.lvl === 'string', `Item ${idx} missing .lvl`);
      assert(item.h && typeof item.h === 'string', `Item ${idx} missing .h (hiragana)`);
      assert(item.r && typeof item.r === 'string', `Item ${idx} missing .r (romaji)`);
      assert(item.m && typeof item.m === 'string', `Item ${idx} missing .m (meaning)`);
      assert(item.ex && typeof item.ex === 'string', `Item ${idx} missing .ex (example word)`);
      assert(item.s_jp && typeof item.s_jp === 'string', `Item ${idx} missing .s_jp (sentence)`);
      assert(item.s_hira && typeof item.s_hira === 'string', `Item ${idx} missing .s_hira`);
      assert(item.s_en && typeof item.s_en === 'string', `Item ${idx} missing .s_en`);
    });
  });
});

test('N5 and N4 kanji equal exactly the original 253 records', () => {
  const n5 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n5.json'), 'utf8'));
  const n4 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n4.json'), 'utf8'));
  assert.strictEqual(n5.length + n4.length, 253);
});

// 2. Vocabulary Datasets (N5 – N1)
console.log('\n--- 2. Vocabulary Learning Content & Counts ---');

const vocabMinCounts = { n5: 5, n4: 5, n3: 100, n2: 100, n1: 100 };

kanjiLevels.forEach(lvl => {
  test(`data/vocabulary/${lvl}.json has >= ${vocabMinCounts[lvl]} records and valid schema`, () => {
    const p = path.join(__dirname, `../data/vocabulary/${lvl}.json`);
    assert.strictEqual(fs.existsSync(p), true, `File ${p} does not exist`);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    assert(data.length >= vocabMinCounts[lvl], `${lvl} vocab count ${data.length} is less than ${vocabMinCounts[lvl]}`);

    const seenIds = new Set();
    const seenWords = new Set();
    data.forEach((item, idx) => {
      assert(item.id, `Item ${idx} missing .id`);
      assert(!seenIds.has(item.id), `Duplicate vocab id ${item.id}`);
      seenIds.add(item.id);

      assert(item.word, `Item ${idx} missing .word`);
      assert(!seenWords.has(item.word), `Duplicate vocab word '${item.word}' in ${lvl}`);
      seenWords.add(item.word);

      assert(item.level, `Item ${idx} missing .level`);
      assert(item.reading, `Item ${idx} missing .reading`);
      assert(item.romaji, `Item ${idx} missing .romaji`);
      assert(item.meaning, `Item ${idx} missing .meaning`);
      assert(item.example && item.example.jp && item.example.hira && item.example.en, `Item ${idx} missing full example`);
      assert(Array.isArray(item.tags), `Item ${idx} missing .tags array`);
      assert(item.source, `Item ${idx} missing .source attribution`);
    });
  });
});

// 3. Grammar Datasets (N5 – N1)
console.log('\n--- 3. Grammar Learning Content & Counts ---');

const gramMinCounts = { n5: 2, n4: 2, n3: 30, n2: 30, n1: 30 };

kanjiLevels.forEach(lvl => {
  test(`data/grammar/${lvl}.json has >= ${gramMinCounts[lvl]} records and valid schema`, () => {
    const p = path.join(__dirname, `../data/grammar/${lvl}.json`);
    assert.strictEqual(fs.existsSync(p), true, `File ${p} does not exist`);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    assert(data.length >= gramMinCounts[lvl], `${lvl} grammar count ${data.length} is less than ${gramMinCounts[lvl]}`);

    const seenIds = new Set();
    data.forEach((item, idx) => {
      assert(item.id, `Item ${idx} missing .id`);
      assert(!seenIds.has(item.id), `Duplicate grammar id ${item.id}`);
      seenIds.add(item.id);

      assert(item.pattern, `Item ${idx} missing .pattern`);
      assert(item.meaning, `Item ${idx} missing .meaning`);
      assert(item.explanation, `Item ${idx} missing .explanation`);
      assert(item.formation, `Item ${idx} missing .formation`);
      assert(Array.isArray(item.examples) && item.examples.length > 0, `Item ${idx} missing .examples array`);
      assert(item.examples[0].jp && item.examples[0].hira && item.examples[0].en, `Item ${idx} example missing jp/hira/en`);
      assert(item.source, `Item ${idx} missing .source attribution`);
    });
  });
});

// 4. Dynamic Counts & UI Inconsistencies Fix
console.log('\n--- 4. Dynamic Library Counts & UI Inconsistency Fixes ---');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

test('index.html has no hard-coded "(253)" library count', () => {
  assert(!indexHtml.includes('All Kanji (253)'), 'Found hard-coded "All Kanji (253)" in index.html');
  assert(!indexHtml.includes('id="fc-total-cards">253<'), 'Found hard-coded "253" in #fc-total-cards');
});

test('index.html contains #sidebar-kanji-count element and updateDynamicKanjiCounts function', () => {
  assert(indexHtml.includes('id="sidebar-kanji-count"'), 'Missing #sidebar-kanji-count in index.html');
  assert(indexHtml.includes('updateDynamicKanjiCounts'), 'Missing updateDynamicKanjiCounts function in index.html');
});

test('index.html preloads all supported JLPT levels on boot', () => {
  assert(indexHtml.includes('SUPPORTED_JLPT_LEVELS.map') || indexHtml.includes("loadKanjiLevel('N1')"), 'Did not find all-level kanji preloader in index.html');
});

// 5. Neutral Source Attribution Rule
console.log('\n--- 5. Neutral Source Attribution ---');

test('Datasets avoid claiming "Official JLPT lists" and use neutral wording', () => {
  const allJsonPaths = [];
  ['kanji', 'vocabulary', 'grammar'].forEach(cat => {
    kanjiLevels.forEach(lvl => {
      allJsonPaths.push(path.join(__dirname, `../data/${cat}/${lvl}.json`));
    });
  });

  allJsonPaths.forEach(p => {
    const raw = fs.readFileSync(p, 'utf8');
    assert(!raw.toLowerCase().includes('official jlpt list'), `Found forbidden phrase 'official jlpt list' in ${p}`);
  });
});

// 6. Service Worker
console.log('\n--- 6. Service Worker Caching ---');

const swContent = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');

test('sw.js cache version is bumped and caches all 15 learning datasets', () => {
  assert(/mainichi-nihongo-v(7|8|9|10)/.test(swContent), 'sw.js cache version should be v7 or higher');
  for (const cat of ['kanji', 'vocabulary', 'grammar']) {
    for (const lvl of kanjiLevels) {
      assert(swContent.includes(`./data/${cat}/${lvl}.json`), `sw.js missing asset ./data/${cat}/${lvl}.json`);
    }
  }
});

console.log('\n========================================================');
console.log(` Test Results: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('========================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
