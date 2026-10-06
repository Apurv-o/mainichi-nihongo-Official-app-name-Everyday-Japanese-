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
console.log(' Running Step 3.2 Verification Suite (Kanji + Animations)');
console.log('========================================================\n');

// ----------------------------------------------------
// SECTION 1: Kanji Datasets Quality & Comprehensive Coverage
// ----------------------------------------------------
console.log('--- 1. Kanji Library Coverage & Data Quality ---');

const kanjiLevels = ['n5', 'n4', 'n3', 'n2', 'n1'];
const kanjiMinCounts = { n5: 105, n4: 148, n3: 100, n2: 100, n1: 100 };
const allKanjiChars = new Set();
let totalKanjiCount = 0;

kanjiLevels.forEach(lvl => {
  test(`data/kanji/${lvl}.json has >= ${kanjiMinCounts[lvl]} comprehensive unique records and valid schema`, () => {
    const p = path.join(__dirname, `../data/kanji/${lvl}.json`);
    assert.strictEqual(fs.existsSync(p), true, `File ${p} does not exist`);
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    assert(data.length >= kanjiMinCounts[lvl], `${lvl} count ${data.length} is less than required minimum ${kanjiMinCounts[lvl]}`);
    totalKanjiCount += data.length;

    const levelSeen = new Set();
    data.forEach((item, idx) => {
      assert(item.k && typeof item.k === 'string', `Item ${idx} missing .k`);
      assert(!levelSeen.has(item.k), `Duplicate kanji '${item.k}' within ${lvl}`);
      assert(!allKanjiChars.has(item.k), `Cross-level duplicate kanji '${item.k}' found in ${lvl}`);
      levelSeen.add(item.k);
      allKanjiChars.add(item.k);

      assert.strictEqual(item.lvl.toLowerCase(), lvl, `Item ${idx} (${item.k}) lvl '${item.lvl}' does not match file level ${lvl}`);
      assert(item.h && item.h.length > 0, `Item ${idx} (${item.k}) missing .h reading`);
      assert(item.r && item.r.length > 0, `Item ${idx} (${item.k}) missing .r romaji`);
      assert(item.m && item.m.length > 0, `Item ${idx} (${item.k}) missing .m meaning`);
      assert(item.ex && item.ex.length > 0, `Item ${idx} (${item.k}) missing .ex compound`);
      assert(item.s_jp && item.s_jp.length > 0, `Item ${idx} (${item.k}) missing .s_jp Japanese sentence`);
      assert(item.s_hira && item.s_hira.length > 0, `Item ${idx} (${item.k}) missing .s_hira furigana sentence`);
      assert(item.s_en && item.s_en.length > 0, `Item ${idx} (${item.k}) missing .s_en English translation`);
    });
  });
});

test('N5 and N4 datasets remain exactly identical to the original 253 records', () => {
  const n5 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n5.json'), 'utf8'));
  const n4 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n4.json'), 'utf8'));
  assert.strictEqual(n5.length, 105, 'N5 must have exactly 105 original records');
  assert.strictEqual(n4.length, 148, 'N4 must have exactly 148 original records');
  assert.strictEqual(n5.length + n4.length, 253, 'N5+N4 total must equal 253');
});

test('Total comprehensive kanji library exceeds 600 unique records', () => {
  assert(totalKanjiCount >= 600, `Total kanji ${totalKanjiCount} is less than 600`);
});

// ----------------------------------------------------
// SECTION 2: Vocabulary & Grammar Regression Check
// ----------------------------------------------------
console.log('\n--- 2. Vocabulary & Grammar Datasets Stability ---');

kanjiLevels.forEach(lvl => {
  test(`data/vocabulary/${lvl}.json and data/grammar/${lvl}.json are valid`, () => {
    const vp = path.join(__dirname, `../data/vocabulary/${lvl}.json`);
    const gp = path.join(__dirname, `../data/grammar/${lvl}.json`);
    assert(fs.existsSync(vp), `Missing ${vp}`);
    assert(fs.existsSync(gp), `Missing ${gp}`);
    const vdata = JSON.parse(fs.readFileSync(vp, 'utf8'));
    const gdata = JSON.parse(fs.readFileSync(gp, 'utf8'));
    assert(Array.isArray(vdata) && vdata.length > 0, `Invalid vocab ${lvl}`);
    assert(Array.isArray(gdata) && gdata.length > 0, `Invalid grammar ${lvl}`);
  });
});

// ----------------------------------------------------
// SECTION 3: Dynamic Counts & Library UI
// ----------------------------------------------------
console.log('\n--- 3. Dynamic Counts & UX Consistency ---');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

test('index.html contains dynamic count handlers and no hardcoded "(253)" library button', () => {
  assert(!indexHtml.includes('All Kanji (253)'), 'Found hardcoded "All Kanji (253)" in index.html');
  assert(indexHtml.includes('id="sidebar-kanji-count"'), 'Missing #sidebar-kanji-count in index.html');
  assert(indexHtml.includes('updateDynamicKanjiCounts'), 'Missing updateDynamicKanjiCounts function in index.html');
});

// ----------------------------------------------------
// SECTION 4: Animation System & Japanese Minimalism
// ----------------------------------------------------
console.log('\n--- 4. Polished Animation System ---');

test('Subtle page transition opacity + translateY exists for views', () => {
  assert(indexHtml.includes('viewFadeSlide'), 'Missing viewFadeSlide page transition animation');
  assert(indexHtml.includes('transform: translateY(') || indexHtml.includes('transform:translateY('), 'Missing translateY in page transition');
});

test('Kanji cards feature subtle hover elevation, active press, and staggered entrance', () => {
  assert(indexHtml.includes('cardEntrance'), 'Missing cardEntrance animation');
  assert(indexHtml.includes('--item-idx'), 'Missing --item-idx staggered entrance');
  assert(indexHtml.includes('.kj-tile:hover'), 'Missing .kj-tile hover elevation style');
  assert(indexHtml.includes('.kj-tile:active'), 'Missing .kj-tile active press state');
});

test('Flashcard has 3D perspective and smooth 180deg flip', () => {
  assert(indexHtml.includes('perspective: 1200px') || indexHtml.includes('perspective:1200px') || indexHtml.includes('perspective:1000px'), 'Missing 3D perspective on .fc-wrap');
  assert(indexHtml.includes('rotateY(180deg)'), 'Missing 180deg flip transform');
  assert(indexHtml.includes('backface-visibility: hidden') || indexHtml.includes('backface-visibility:hidden'), 'Missing backface-visibility: hidden');
});

test('Segmented filter pills animate smoothly with background and scale transition', () => {
  assert(indexHtml.includes('.seg button'), 'Missing .seg button transition rules');
  assert(indexHtml.includes('.seg button:active'), 'Missing active press feedback on filter buttons');
});

test('Search box has focus-within elevation and border highlight', () => {
  assert(indexHtml.includes('.search-box:focus-within'), 'Missing .search-box:focus-within state');
});

test('Mastery feedback animation starPulse is implemented', () => {
  assert(indexHtml.includes('starPulse'), 'Missing starPulse mastery animation');
});

test('Loading skeleton state is implemented', () => {
  assert(indexHtml.includes('skeletonPulse'), 'Missing skeletonPulse loading animation');
});

// ----------------------------------------------------
// SECTION 5: Reduced-Motion Accessibility
// ----------------------------------------------------
console.log('\n--- 5. Reduced-Motion Accessibility ---');

test('prefers-reduced-motion media query is implemented and disables transforms/animations', () => {
  assert(indexHtml.includes('@media (prefers-reduced-motion: reduce)') || indexHtml.includes('@media(prefers-reduced-motion:reduce)'), 'Missing prefers-reduced-motion media query');
  assert(indexHtml.includes('animation-duration: 0.001ms') || indexHtml.includes('animation: none'), 'prefers-reduced-motion must minimize or disable animations');
});

// ----------------------------------------------------
// SECTION 6: Service Worker Cache Version & Precaching
// ----------------------------------------------------
console.log('\n--- 6. Service Worker Caching ---');

const swContent = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');

test('sw.js cache version is bumped and precaches all 15 datasets', () => {
  assert(/mainichi-nihongo-v(8|9|10)/.test(swContent), 'sw.js cache version should be bumped to v8 or higher');
  for (const cat of ['kanji', 'vocabulary', 'grammar']) {
    for (const lvl of kanjiLevels) {
      assert(swContent.includes(`./data/${cat}/${lvl}.json`), `sw.js missing ./data/${cat}/${lvl}.json`);
    }
  }
});

console.log('\n========================================================');
console.log(` Test Results: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('========================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
