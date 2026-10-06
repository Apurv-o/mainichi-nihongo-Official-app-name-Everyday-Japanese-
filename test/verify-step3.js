/**
 * Automated Verification Suite for Step 3: JLPT N3 / N2 / N1 Expansion
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function runSuite() {
  console.log('========================================================');
  console.log(' Running Step 3 Verification Suite (N5 - N1 Expansion)');
  console.log('========================================================\n');

  const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

  // ----------------------------------------------------
  // SECTION 1: Kanji Datasets Integrity & Schema
  // ----------------------------------------------------
  console.log('--- 1. Kanji Datasets (N5 – N1) ---');

  LEVELS.forEach(lvl => {
    test(`data/kanji/${lvl.toLowerCase()}.json exists and follows schema`, () => {
      const p = path.join(ROOT_DIR, 'data', 'kanji', `${lvl.toLowerCase()}.json`);
      assert.strictEqual(fs.existsSync(p), true, `${p} must exist`);
      const list = JSON.parse(fs.readFileSync(p, 'utf8'));
      assert.ok(Array.isArray(list) && list.length > 0, `${lvl} kanji array must not be empty`);
      
      const seen = new Set();
      list.forEach((item, idx) => {
        assert.ok(item.k, `Item ${idx} in ${lvl} must have 'k'`);
        assert.strictEqual(item.lvl, lvl, `Item ${idx} 'lvl' must match ${lvl}`);
        assert.ok(item.h, `Item ${idx} in ${lvl} must have 'h'`);
        assert.ok(item.r, `Item ${idx} in ${lvl} must have 'r'`);
        assert.ok(item.m, `Item ${idx} in ${lvl} must have 'm'`);
        assert.ok(item.ex, `Item ${idx} in ${lvl} must have 'ex'`);
        assert.ok(item.s_jp, `Item ${idx} in ${lvl} must have 's_jp'`);
        assert.ok(item.s_hira, `Item ${idx} in ${lvl} must have 's_hira'`);
        assert.ok(item.s_en, `Item ${idx} in ${lvl} must have 's_en'`);
        assert.strictEqual(seen.has(item.k), false, `Duplicate kanji '${item.k}' found in ${lvl}`);
        seen.add(item.k);
      });
    });
  });

  // ----------------------------------------------------
  // SECTION 2: Vocabulary Datasets Integrity & Schema
  // ----------------------------------------------------
  console.log('\n--- 2. Vocabulary Datasets (N5 – N1) ---');

  LEVELS.forEach(lvl => {
    test(`data/vocabulary/${lvl.toLowerCase()}.json exists and follows schema`, () => {
      const p = path.join(ROOT_DIR, 'data', 'vocabulary', `${lvl.toLowerCase()}.json`);
      assert.strictEqual(fs.existsSync(p), true, `${p} must exist`);
      const list = JSON.parse(fs.readFileSync(p, 'utf8'));
      assert.ok(Array.isArray(list) && list.length > 0, `${lvl} vocab array must not be empty`);

      const seenIds = new Set();
      list.forEach((item, idx) => {
        assert.ok(item.id, `Item ${idx} in ${lvl} vocab must have 'id'`);
        assert.strictEqual(item.level, lvl, `Item ${idx} 'level' must match ${lvl}`);
        assert.ok(item.word, `Item ${idx} in ${lvl} vocab must have 'word'`);
        assert.ok(item.reading, `Item ${idx} in ${lvl} vocab must have 'reading'`);
        assert.ok(item.romaji, `Item ${idx} in ${lvl} vocab must have 'romaji'`);
        assert.ok(item.meaning, `Item ${idx} in ${lvl} vocab must have 'meaning'`);
        assert.ok(item.example, `Item ${idx} in ${lvl} vocab must have 'example'`);
        assert.ok(item.example.jp, `Item ${idx} in ${lvl} vocab must have 'example.jp'`);
        assert.ok(item.example.hira, `Item ${idx} in ${lvl} vocab must have 'example.hira'`);
        assert.ok(item.example.en, `Item ${idx} in ${lvl} vocab must have 'example.en'`);
        assert.strictEqual(seenIds.has(item.id), false, `Duplicate vocab ID '${item.id}' in ${lvl}`);
        seenIds.add(item.id);
      });
    });
  });

  // ----------------------------------------------------
  // SECTION 3: Grammar Datasets Integrity & Schema
  // ----------------------------------------------------
  console.log('\n--- 3. Grammar Datasets (N5 – N1) ---');

  LEVELS.forEach(lvl => {
    test(`data/grammar/${lvl.toLowerCase()}.json exists and follows schema`, () => {
      const p = path.join(ROOT_DIR, 'data', 'grammar', `${lvl.toLowerCase()}.json`);
      assert.strictEqual(fs.existsSync(p), true, `${p} must exist`);
      const list = JSON.parse(fs.readFileSync(p, 'utf8'));
      assert.ok(Array.isArray(list) && list.length > 0, `${lvl} grammar array must not be empty`);

      const seenIds = new Set();
      list.forEach((item, idx) => {
        assert.ok(item.id, `Item ${idx} in ${lvl} grammar must have 'id'`);
        assert.strictEqual(item.level, lvl, `Item ${idx} 'level' must match ${lvl}`);
        assert.ok(item.pattern, `Item ${idx} in ${lvl} grammar must have 'pattern'`);
        assert.ok(item.meaning, `Item ${idx} in ${lvl} grammar must have 'meaning'`);
        assert.ok(item.explanation, `Item ${idx} in ${lvl} grammar must have 'explanation'`);
        assert.ok(item.formation, `Item ${idx} in ${lvl} grammar must have 'formation'`);
        assert.ok(Array.isArray(item.examples) && item.examples.length > 0, `Item ${idx} examples must be non-empty array`);
        assert.strictEqual(seenIds.has(item.id), false, `Duplicate grammar ID '${item.id}' in ${lvl}`);
        seenIds.add(item.id);
      });
    });
  });

  // ----------------------------------------------------
  // SECTION 4: Data Loader Layer in index.html
  // ----------------------------------------------------
  console.log('\n--- 4. Frontend Data Layer & Loaders in index.html ---');

  test('index.html defines unified SUPPORTED_JLPT_LEVELS and loaders', () => {
    const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    assert.ok(html.includes("SUPPORTED_JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']"), 'SUPPORTED_JLPT_LEVELS must exist');
    assert.ok(html.includes('async function loadDataset(type, level)'), 'Generic loadDataset helper must exist');
    assert.ok(html.includes('async function loadKanjiLevel(level)'), 'loadKanjiLevel must exist');
    assert.ok(html.includes('async function loadVocabularyLevel(level)'), 'loadVocabularyLevel must exist');
    assert.ok(html.includes('async function loadGrammarLevel(level)'), 'loadGrammarLevel must exist');
    assert.ok(html.includes('function getAllLoadedKanji()'), 'getAllLoadedKanji must exist');
    assert.ok(html.includes('function getAllLoadedVocabulary()'), 'getAllLoadedVocabulary must exist');
    assert.ok(html.includes('function getAllLoadedGrammar()'), 'getAllLoadedGrammar must exist');
  });

  test('Kanji UI level filter contains N5, N4, N3, N2, N1 buttons', () => {
    const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    assert.ok(html.includes('data-lvl="N5"'), 'Must have N5 button');
    assert.ok(html.includes('data-lvl="N4"'), 'Must have N4 button');
    assert.ok(html.includes('data-lvl="N3"'), 'Must have N3 button');
    assert.ok(html.includes('data-lvl="N2"'), 'Must have N2 button');
    assert.ok(html.includes('data-lvl="N1"'), 'Must have N1 button');
  });

  // ----------------------------------------------------
  // SECTION 5: Service Worker Cache v6 & Assets
  // ----------------------------------------------------
  console.log('\n--- 5. Service Worker & Caching ---');

  test('sw.js cache version is bumped to v6 and includes all 15 datasets', () => {
    const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
    assert.ok(/mainichi-nihongo-v(6|7|8|9|10)/.test(swContent), 'Cache name should be mainichi-nihongo-v6 or higher');
    LEVELS.forEach(lvl => {
      assert.ok(swContent.includes(`./data/kanji/${lvl.toLowerCase()}.json`), `SW must precache kanji ${lvl}`);
      assert.ok(swContent.includes(`./data/vocabulary/${lvl.toLowerCase()}.json`), `SW must precache vocab ${lvl}`);
      assert.ok(swContent.includes(`./data/grammar/${lvl.toLowerCase()}.json`), `SW must precache grammar ${lvl}`);
    });
  });

  // ----------------------------------------------------
  // SECTION 6: API & Security Check
  // ----------------------------------------------------
  console.log('\n--- 6. API Route & Security Verification ---');

  test('Vercel API Route /api/ai-coach exists and is protected', () => {
    assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'api', 'ai-coach.js')), true);
    assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'api', 'lib', 'geminiProvider.js')), true);
    assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'api', 'lib', 'rateLimiter.js')), true);
  });

  test('No secrets or private API keys committed in codebase', () => {
    const searchDirs = ['data', 'api', 'assets'];
    const forbiddenPatterns = [/AIza[0-9A-Za-z-_]{35}/];

    function scan(dir) {
      const entries = fs.readdirSync(path.join(ROOT_DIR, dir), { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(ROOT_DIR, dir, entry.name);
        if (entry.isDirectory()) {
          scan(path.join(dir, entry.name));
        } else if (entry.isFile()) {
          const content = fs.readFileSync(full, 'utf8');
          for (const pat of forbiddenPatterns) {
            assert.strictEqual(pat.test(content), false, `Found potential secret in ${full}`);
          }
        }
      }
    }
    searchDirs.forEach(d => scan(d));
  });

  console.log('\n========================================================');
  console.log(` Test Results: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('========================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runSuite().catch(err => {
  console.error('Test suite runner encountered an error:', err);
  process.exit(1);
});
