const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('====================================================');
console.log('🧪 VERIFY STEP 3.4: TODAY\'S QUEUE & STUDY SESSIONS');
console.log('====================================================\n');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// 1. Inspect DOM Elements in index.html
console.log('--- TEST 1: DOM Elements & Study Session Modal ---');
assert(html.includes('id="study-session-modal"'), 'Missing #study-session-modal in index.html');
assert(html.includes('id="sess-card-body"'), 'Missing #sess-card-body');
assert(html.includes('id="sess-controls-bar"'), 'Missing #sess-controls-bar');
assert(html.includes('id="sess-progress-bar"'), 'Missing #sess-progress-bar');
assert(html.includes('id="btn-start-global-queue"'), 'Missing #btn-start-global-queue on Today dashboard');
assert(html.includes('id="kanji-view-mode"'), 'Missing #kanji-view-mode on Kanji view');
assert(html.includes('id="vocab-view-mode"'), 'Missing #vocab-view-mode on Vocabulary view');
assert(html.includes('id="grammar-view-mode"'), 'Missing #grammar-view-mode on Grammar view');
console.log('✓ All required DOM elements for Step 3.4 study sessions are present.\n');

// 2. Load Mock Runtime Environment with real sample datasets
console.log('--- TEST 2: Environment Setup with Multi-Level JLPT Datasets ---');

const vN5 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vocabulary/n5.json'), 'utf8'));
const vN4 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vocabulary/n4.json'), 'utf8'));
const vN3 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vocabulary/n3.json'), 'utf8'));
const vN2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vocabulary/n2.json'), 'utf8'));
const vN1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vocabulary/n1.json'), 'utf8'));

const gN5 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grammar/n5.json'), 'utf8'));
const gN4 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grammar/n4.json'), 'utf8'));
const gN3 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grammar/n3.json'), 'utf8'));
const gN2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grammar/n2.json'), 'utf8'));
const gN1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grammar/n1.json'), 'utf8'));

const kN3 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n3.json'), 'utf8'));
const kN2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n2.json'), 'utf8'));
const kN1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n1.json'), 'utf8'));

class MockElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.classList = {
      _classes: new Set(className.split(' ').filter(Boolean)),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (this.classList._classes.has(c)) this.classList._classes.delete(c);
          else this.classList._classes.add(c);
        } else if (force) {
          this.classList._classes.add(c);
        } else {
          this.classList._classes.delete(c);
        }
      },
      contains: (c) => this.classList._classes.has(c)
    };
    this.dataset = {};
    this.style = {};
    this.children = [];
    this.onclick = null;
    this.oninput = null;
    this.onchange = null;
    this.textContent = '';
    this.innerHTML = '';
    this.value = '';
  }
  setAttribute(k, v) { this[k] = v; }
  getAttribute(k) { return this[k]; }
  querySelector(sel) { return new MockElement('div'); }
  querySelectorAll(sel) { return [new MockElement('div')]; }
  appendChild(child) { this.children.push(child); }
  focus() {}
}

const mockDoc = {
  documentElement: new MockElement('html'),
  getElementById: (id) => new MockElement('div', id),
  querySelector: (sel) => new MockElement('div', '', ''),
  querySelectorAll: (sel) => [new MockElement('div', '', '')],
  createElement: (tag) => new MockElement(tag),
  addEventListener: () => {}
};

const mockWindow = {
  document: mockDoc,
  localStorage: {
    _data: {},
    getItem: (k) => mockWindow.localStorage._data[k] || null,
    setItem: (k, v) => { mockWindow.localStorage._data[k] = String(v); },
    removeItem: (k) => { delete mockWindow.localStorage._data[k]; },
    clear: () => { mockWindow.localStorage._data = {}; },
    get length() { return Object.keys(mockWindow.localStorage._data).length; },
    key: (i) => Object.keys(mockWindow.localStorage._data)[i] || null
  },
  location: { hash: '#/today' },
  scrollTo: () => {},
  addEventListener: () => {},
  matchMedia: () => ({ matches: false }),
  setInterval: () => 1,
  clearInterval: () => {},
  setTimeout: (fn) => fn(),
  clearTimeout: () => {}
};

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
const code = scriptMatch[1];

const context = vm.createContext({
  window: mockWindow,
  document: mockDoc,
  localStorage: mockWindow.localStorage,
  location: mockWindow.location,
  matchMedia: mockWindow.matchMedia,
  setInterval: mockWindow.setInterval,
  clearInterval: mockWindow.clearInterval,
  setTimeout: mockWindow.setTimeout,
  clearTimeout: mockWindow.clearTimeout,
  console: console,
  fetch: async (url) => {
    if (url.includes('data/vocabulary/n5.json')) return { ok: true, json: async () => vN5 };
    if (url.includes('data/vocabulary/n4.json')) return { ok: true, json: async () => vN4 };
    if (url.includes('data/vocabulary/n3.json')) return { ok: true, json: async () => vN3 };
    if (url.includes('data/vocabulary/n2.json')) return { ok: true, json: async () => vN2 };
    if (url.includes('data/vocabulary/n1.json')) return { ok: true, json: async () => vN1 };
    if (url.includes('data/grammar/n5.json')) return { ok: true, json: async () => gN5 };
    if (url.includes('data/grammar/n4.json')) return { ok: true, json: async () => gN4 };
    if (url.includes('data/grammar/n3.json')) return { ok: true, json: async () => gN3 };
    if (url.includes('data/grammar/n2.json')) return { ok: true, json: async () => gN2 };
    if (url.includes('data/grammar/n1.json')) return { ok: true, json: async () => gN1 };
    if (url.includes('data/kanji/n3.json')) return { ok: true, json: async () => kN3 };
    if (url.includes('data/kanji/n2.json')) return { ok: true, json: async () => kN2 };
    if (url.includes('data/kanji/n1.json')) return { ok: true, json: async () => kN1 };
    return { ok: true, json: async () => [] };
  },
  Notification: { permission: 'default', requestPermission: async () => 'granted' }
});

vm.runInContext(code, context);

// Set datasets into mock context datasetCache
vm.runInContext(`
  datasetCache.set('vocabulary:N5', ${JSON.stringify(vN5)});
  datasetCache.set('vocabulary:N4', ${JSON.stringify(vN4)});
  datasetCache.set('vocabulary:N3', ${JSON.stringify(vN3)});
  datasetCache.set('vocabulary:N2', ${JSON.stringify(vN2)});
  datasetCache.set('vocabulary:N1', ${JSON.stringify(vN1)});

  datasetCache.set('grammar:N5', ${JSON.stringify(gN5)});
  datasetCache.set('grammar:N4', ${JSON.stringify(gN4)});
  datasetCache.set('grammar:N3', ${JSON.stringify(gN3)});
  datasetCache.set('grammar:N2', ${JSON.stringify(gN2)});
  datasetCache.set('grammar:N1', ${JSON.stringify(gN1)});

  datasetCache.set('kanji:N3', ${JSON.stringify(kN3)});
  datasetCache.set('kanji:N2', ${JSON.stringify(kN2)});
  datasetCache.set('kanji:N1', ${JSON.stringify(kN1)});
`, context);

console.log('✓ Mock runtime environment successfully populated with N5..N1 datasets in datasetCache.\n');

const exec = (fnStr) => vm.runInContext(fnStr, context);

// 3. Test Level Isolation in Queue Generation
console.log('--- TEST 3: Strict Level Isolation for Queues ---');

// Clear existing daily queues
mockWindow.localStorage.clear();

// Generate N3 Vocab Queue
const n3VocabSession = exec('generateStudyQueue({ source: "vocabulary", level: "n3", limit: 10 })');
assert(n3VocabSession.items && n3VocabSession.items.length > 0, 'N3 Vocab queue items should not be empty');
n3VocabSession.items.forEach(item => {
  assert.strictEqual(item.itemType, 'vocabulary', 'Item must be vocabulary');
  assert.strictEqual(item.level.toLowerCase(), 'n3', `Expected item level n3 but got ${item.level}`);
});
console.log(`✓ Vocab N3 Queue generated ${n3VocabSession.items.length} items, 100% strictly N3.`);

// Generate N2 Grammar Queue
const n2GrammarSession = exec('generateStudyQueue({ source: "grammar", level: "n2", limit: 10 })');
assert(n2GrammarSession.items && n2GrammarSession.items.length > 0, 'N2 Grammar queue items should not be empty');
n2GrammarSession.items.forEach(item => {
  assert.strictEqual(item.itemType, 'grammar', 'Item must be grammar');
  assert.strictEqual(item.level.toLowerCase(), 'n2', `Expected item level n2 but got ${item.level}`);
});
console.log(`✓ Grammar N2 Queue generated ${n2GrammarSession.items.length} items, 100% strictly N2.`);

// Generate N1 Kanji Queue
const n1KanjiSession = exec('generateStudyQueue({ source: "kanji", level: "n1", limit: 10 })');
assert(n1KanjiSession.items && n1KanjiSession.items.length > 0, 'N1 Kanji queue items should not be empty');
n1KanjiSession.items.forEach(item => {
  assert.strictEqual(item.itemType, 'kanji', 'Item must be kanji');
  assert.strictEqual(item.lvl.toLowerCase(), 'n1', `Expected item level n1 but got ${item.lvl}`);
});
console.log(`✓ Kanji N1 Queue generated ${n1KanjiSession.items.length} items, 100% strictly N1.\n`);

// 4. Test Global Queue Composition
console.log('--- TEST 4: Global Balanced Daily Queue ---');
const globalSession = exec('generateStudyQueue({ source: "global", level: "all", limit: 10 })');
assert.strictEqual(globalSession.items.length, 10, 'Global queue must have 10 items');
const vCount = globalSession.items.filter(i => i.itemType === 'vocabulary').length;
const gCount = globalSession.items.filter(i => i.itemType === 'grammar').length;
const kCount = globalSession.items.filter(i => i.itemType === 'kanji').length;
assert.strictEqual(vCount, 5, `Expected 5 Vocab in global queue, got ${vCount}`);
assert.strictEqual(gCount, 3, `Expected 3 Grammar in global queue, got ${gCount}`);
assert.strictEqual(kCount, 2, `Expected 2 Kanji in global queue, got ${kCount}`);
console.log(`✓ Global Queue correctly balanced: ${vCount} Vocab + ${gCount} Grammar + ${kCount} Kanji = 10 items.\n`);

// 5. Test Priority Ranking (Mistakes -> Unmastered -> Review -> New)
console.log('--- TEST 5: Priority Ranking Algorithm ---');

// Mock mastery state & practice needed in context
exec(`
  vocabStarred.add('v_n3_2');
`);

const samplePool = [
  { id: 'v_n3_2', itemType: 'vocabulary', level: 'n3', word: 'MasteredWord' },
  { id: 'v_n3_3', itemType: 'vocabulary', level: 'n3', word: 'UnmasteredWord' },
  { id: 'v_n3_1', itemType: 'vocabulary', level: 'n3', word: 'NeedPracticeWord' }
];

// Set recent study with practice result for v_n3_1
mockWindow.localStorage.setItem('mn.recently.studied.v1', JSON.stringify([
  { id: 'v_n3_1', type: 'vocabulary', level: 'n3', result: 'practice', at: Date.now() }
]));

const ranked = exec(`
  rankAndSelectItems(${JSON.stringify(samplePool)}, vocabStarred, new Set(['v_n3_1']), new Set(['v_n3_1']), 3, 'vocabulary')
`);
assert.strictEqual(ranked[0].id, 'v_n3_1', 'Item needing practice MUST be ranked first');
assert.strictEqual(ranked[1].id, 'v_n3_3', 'Unmastered item MUST be ranked before mastered');
assert.strictEqual(ranked[2].id, 'v_n3_2', 'Mastered item should be ranked last');
console.log('✓ Priority ranking verified: [Need Practice] > [Unmastered] > [Mastered].\n');

// 6. Test Daily Queue Persistence in LocalStorage
console.log('--- TEST 6: LocalStorage Daily Queue Persistence ---');
const todayKey = exec('todayStr()');
const storageKey = `mn.daily.queue.v1_${todayKey}_vocabulary_n3`;
const storedQueueJson = mockWindow.localStorage.getItem(storageKey);
assert(storedQueueJson, 'Queue must be stored in localStorage');
const parsedStored = JSON.parse(storedQueueJson);
assert.strictEqual(parsedStored.items.length, n3VocabSession.items.length, 'Stored queue length matches generated queue');
assert.strictEqual(parsedStored.items[0].id, n3VocabSession.items[0].id, 'Stored items match generated items');
console.log(`✓ Daily queue persisted stably under "${storageKey}".\n`);

// 7. Test Interactive Study Session Flow
console.log('--- TEST 7: Study Session Interactive State Machine ---');

(async () => {
  // Start session with 2 items
  const testSessionItems = [
    { id: 'v_test_1', itemType: 'vocabulary', level: 'n3', word: '約束', reading: 'やくそく', meaning: 'Promise' },
    { id: 'v_test_2', itemType: 'vocabulary', level: 'n3', word: '未来', reading: 'みらい', meaning: 'Future' }
  ];

  exec(`startStudySession('vocabulary', 'n3', ${JSON.stringify(testSessionItems)})`);
  let curSess = exec('currentSession');
  assert(curSess, 'Study session state should be active');
  assert.strictEqual(curSess.items.length, 2, 'Session has 2 items');
  assert.strictEqual(curSess.currentIndex, 0, 'Starts at step 0');

  // Reveal answer
  exec(`revealSessionAnswer(currentSession.items[0], 'vocabulary')`);

  // Answer item 1 as 'practice' (Need Practice)
  await exec(`answerSessionStep(currentSession.items[0], 'vocabulary', 'practice')`);
  curSess = exec('currentSession');
  assert.strictEqual(curSess.currentIndex, 1, 'Moved to step 1');
  assert.strictEqual(curSess.answers['v_test_1'], 'practice', '1 practice answer recorded');

  // Reveal item 2
  exec(`revealSessionAnswer(currentSession.items[1], 'vocabulary')`);
  // Answer item 2 as 'mastered' (Got It)
  await exec(`answerSessionStep(currentSession.items[1], 'vocabulary', 'mastered')`);
  curSess = exec('currentSession');
  assert.strictEqual(curSess.answers['v_test_2'], 'mastered', '1 mastered answer recorded');
  assert.strictEqual(curSess.completed, true, 'Session is complete');
  console.log('✓ Study Session complete flow: Front -> Reveal -> Answer -> Mastery -> Summary.\n');

  // 8. Test Review Mistakes Functionality
  console.log('--- TEST 8: Review Mistakes Retry Queue ---');
  const mistakeItems = curSess.items.filter(item => {
    return curSess.answers[item.id] === 'practice';
  });
  assert.strictEqual(mistakeItems.length, 1, 'Mistakes list contains 1 item');
  assert.strictEqual(mistakeItems[0].id, 'v_test_1', 'Mistake item is v_test_1');

  exec(`startStudySession('vocabulary', 'n3', ${JSON.stringify(mistakeItems)})`);
  curSess = exec('currentSession');
  assert(curSess.isReview, 'Review mistakes session flagged as review');
  assert.strictEqual(curSess.items.length, 1, 'Mistakes session contains 1 missed item');
  assert.strictEqual(curSess.items[0].id, 'v_test_1', 'Missed item is v_test_1');
  console.log('✓ Review Mistakes initiates retry session targeting only missed items.\n');

  // 9. Test Recently Studied Logger
  console.log('--- TEST 9: Recently Studied Logger (Bounded) ---');
  exec(`logRecentlyStudied('v_sample_log', 'vocabulary', 'n3', 'mastered')`);
  const recents = JSON.parse(mockWindow.localStorage.getItem('mn.recently.studied.v1') || '[]');
  assert(recents.length > 0, 'Recently studied items must be recorded');
  assert.strictEqual(recents[0].id, 'v_sample_log', 'Recent item logged at top of list');
  console.log(`✓ Recently studied items logged under "mn.recently.studied.v1" (${recents.length} entries).\n`);

  console.log('====================================================');
  console.log('🎉 ALL STEP 3.4 VERIFICATION TESTS PASSED (100%)!');
  console.log('====================================================\n');
})();
