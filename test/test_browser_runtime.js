const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// 1. Script Syntax Check
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
assert(scriptMatch, 'No <script> block found in index.html');
const code = scriptMatch[1];

try {
  new Function(code);
  console.log('✓ index.html JavaScript syntax is 100% valid');
} catch (e) {
  console.error('✗ JavaScript Syntax Error:', e);
  process.exit(1);
}

// 2. Mock DOM & Runtime Execution Test
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
  querySelector(sel) { return null; }
  querySelectorAll(sel) { return []; }
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

// Test running the code inside mock environment
const vm = require('vm');
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
  fetch: async () => ({ ok: true, json: async () => [] }),
  Notification: { permission: 'default', requestPermission: async () => 'granted' }
});

try {
  vm.runInContext(code, context);
  console.log('✓ Script initialized and ran successfully without runtime exceptions');
} catch (err) {
  console.error('✗ Runtime execution error:', err);
  process.exit(1);
}

// Test executing switchView for all routes
const routes = ['today', 'flashcards', 'kanji', 'vocabulary', 'grammar', 'history', 'progress', 'goals', 'notes', 'settings'];
routes.forEach(route => {
  try {
    context.switchView(route);
    console.log(`  ✓ switchView('${route}') executed cleanly`);
  } catch (err) {
    console.error(`  ✗ Error in switchView('${route}'):`, err);
    process.exit(1);
  }
});

console.log('\nAll Mock Runtime & Navigation checks PASSED! 🚀');
