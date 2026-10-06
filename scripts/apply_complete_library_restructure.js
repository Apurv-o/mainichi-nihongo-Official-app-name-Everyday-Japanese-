const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. CSS REPLACEMENT
const oldCSS = `.nav-item .nav-arrow{margin-left:auto;font-size:10px;opacity:.65;transition:transform .2s}
.nav-item.open .nav-arrow{transform:rotate(180deg)}

/* Submenu for Library */
.nav-submenu{display:none;flex-direction:column;gap:2px;padding-left:34px;margin-top:2px}
.nav-submenu.show{display:flex}
.subnav-item{
  padding:5px 10px;font-size:12.5px;font-weight:600;color:var(--text-soft);
  border-radius:6px;transition:all .15s;
}
.subnav-item:hover{color:var(--text);background:var(--surface2)}
.subnav-item.active{color:var(--green-deep);font-weight:800}`;

const newCSS = `.nav-item .nav-arrow{margin-left:auto;font-size:9px;opacity:.7;display:inline-block;transition:transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)}
.nav-item.open .nav-arrow{transform:rotate(180deg)}

/* Submenu for Library (Collapsible with smooth 180-220ms transition) */
.nav-group {
  display: flex;
  flex-direction: column;
}
.nav-item.in-section {
  color: var(--green-deep);
  font-weight: 700;
}
.nav-submenu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 20px;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, margin 0.2s ease;
  pointer-events: none;
}
.nav-submenu.show {
  max-height: 260px;
  opacity: 1;
  margin-top: 3px;
  margin-bottom: 5px;
  pointer-events: auto;
}
.subnav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-soft);
  border-radius: 8px;
  text-decoration: none;
  transition: all .15s ease;
  position: relative;
  cursor: pointer;
}
.subnav-item:hover {
  color: var(--text);
  background: var(--surface2);
}
.subnav-item.active {
  color: var(--green-deep);
  background: var(--green-soft);
  font-weight: 800;
}
.subnav-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3.5px;
  background: var(--green-deep);
  border-radius: 0 4px 4px 0;
}
.subnav-icon {
  font-size: 14px;
  width: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 900;
}`;

html = html.replace(oldCSS, newCSS);

// 2. ROUTER REPLACEMENT
const oldRouter = `/* ---------------- Navigation / Router ---------------- */
const VIEWS = ['today', 'vocabulary', 'grammar', 'kanji', 'history', 'progress', 'goals', 'notes', 'settings'];
function currentView(){
  const h = location.hash.replace('#/', '');
  return VIEWS.includes(h) ? h : 'today';
}
function switchView(v){
  VIEWS.forEach(x => { const el = $('#view-' + x); if (el) el.classList.toggle('active', x === v); });
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  $$('.bnav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  
  if (v === 'today') renderToday();
  else if (v === 'vocabulary') renderVocabularyView();
  else if (v === 'grammar') renderGrammarView();
  else if (v === 'kanji'){ updateFlashcardUI(); if (state.ui.kanjiMode === 'grid') renderKanjiGrid(); }
  else if (v === 'history'){ renderCalendar(); renderDayDetail(); renderHistoryList(); }
  else if (v === 'progress') renderProgress();
  else if (v === 'goals') syncGoalsUI();
  else if (v === 'notes') syncNotesUI();
  else if (v === 'settings') syncSettingsUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}`;

const newRouter = `/* ---------------- Navigation / Router ---------------- */
const VIEWS = ['today', 'flashcards', 'kanji', 'vocabulary', 'grammar', 'history', 'progress', 'goals', 'notes', 'settings'];
const LS_LIB_OPEN = 'mn.library.open.v1';

function currentView(){
  const h = location.hash.replace('#/', '');
  return VIEWS.includes(h) ? h : 'today';
}

function switchView(v){
  const viewId = (v === 'flashcards') ? 'kanji' : v;
  ['today', 'kanji', 'vocabulary', 'grammar', 'history', 'progress', 'goals', 'notes', 'settings'].forEach(x => {
    const el = $('#view-' + x);
    if (el) el.classList.toggle('active', x === viewId);
  });
  
  // Top-level main items
  $$('.nav-item:not(.nav-group-header)').forEach(b => {
    b.classList.toggle('active', b.dataset.view === v);
  });

  // Library Group and Submenu state
  const isLibraryRoute = ['flashcards', 'kanji', 'vocabulary', 'grammar'].includes(v);
  const libBtn = $('#nav-library-btn');
  const submenu = $('#library-submenu');
  if (libBtn) {
    libBtn.classList.toggle('in-section', isLibraryRoute);
    if (isLibraryRoute) {
      libBtn.classList.add('open');
      libBtn.setAttribute('aria-expanded', 'true');
      if (submenu) submenu.classList.add('show');
    }
  }

  // Library Subnav items active state
  $$('.subnav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.subview === v);
  });

  // Mobile Bottom Navigation
  $$('.bnav-btn').forEach(b => {
    if (b.dataset.view === 'kanji' || b.dataset.view === 'library') {
      b.classList.toggle('active', isLibraryRoute);
    } else {
      b.classList.toggle('active', b.dataset.view === v);
    }
  });

  if (v === 'today') renderToday();
  else if (v === 'flashcards'){ switchKanjiMode('flashcard'); updateFlashcardUI(); }
  else if (v === 'kanji'){ switchKanjiMode('grid'); renderKanjiGrid(); }
  else if (v === 'vocabulary') renderVocabularyView();
  else if (v === 'grammar') renderGrammarView();
  else if (v === 'history'){ renderCalendar(); renderDayDetail(); renderHistoryList(); }
  else if (v === 'progress') renderProgress();
  else if (v === 'goals') syncGoalsUI();
  else if (v === 'notes') syncNotesUI();
  else if (v === 'settings') syncSettingsUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}`;

html = html.replace(oldRouter, newRouter);

// 3. INIT LOGIC REPLACEMENT
const oldInit = `  // Nav clicks
  $$('.nav-item').forEach(b => {
    b.onclick = () => {
      if (b.id === 'nav-library-btn'){
        $('#library-submenu').classList.toggle('show');
        b.classList.toggle('open');
      }
      location.hash = '#/' + b.dataset.view;
    };
  });
  $$('.subnav-item').forEach(b => {
    b.onclick = () => {
      location.hash = '#/kanji';
      switchKanjiMode(b.dataset.lib);
    };
  });`;

const newInit = `  // Library collapsible state initialization
  const libSavedState = localStorage.getItem(LS_LIB_OPEN);
  const libBtn = $('#nav-library-btn');
  const libSubmenu = $('#library-submenu');
  if (libSavedState === '0') {
    if (libBtn) { libBtn.classList.remove('open'); libBtn.setAttribute('aria-expanded', 'false'); }
    if (libSubmenu) { libSubmenu.classList.remove('show'); }
  } else {
    if (libBtn) { libBtn.classList.add('open'); libBtn.setAttribute('aria-expanded', 'true'); }
    if (libSubmenu) { libSubmenu.classList.add('show'); }
  }

  // Library Toggle Click
  if (libBtn) {
    libBtn.onclick = (e) => {
      e.preventDefault();
      const willBeOpen = !libBtn.classList.contains('open');
      libBtn.classList.toggle('open', willBeOpen);
      libBtn.setAttribute('aria-expanded', willBeOpen ? 'true' : 'false');
      if (libSubmenu) libSubmenu.classList.toggle('show', willBeOpen);
      try { localStorage.setItem(LS_LIB_OPEN, willBeOpen ? '1' : '0'); } catch(err){}
    };
  }

  // Top-level Nav Clicks
  $$('.nav-item:not(.nav-group-header)').forEach(b => {
    b.onclick = () => {
      if (b.dataset.view) location.hash = '#/' + b.dataset.view;
    };
  });`;

html = html.replace(oldInit, newInit);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Finished applying complete library restructure');
