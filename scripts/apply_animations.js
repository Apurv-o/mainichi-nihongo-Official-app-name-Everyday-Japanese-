const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Insert CSS animations into stylesheet
const animationCSS = `
/* ============================================================
   STEP 3.2 — POLISHED ANIMATION SYSTEM & REDUCED MOTION
   ============================================================ */

/* 1. Page Transitions */
.view {
  display: none;
  opacity: 0;
  transform: translateY(8px);
}
.view.active {
  display: block;
  animation: viewFadeSlide 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes viewFadeSlide {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 2. Kanji Card Hover, Staggered Entrance & Active Press */
.kanji-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
  gap: 8px;
  margin-top: 12px;
}
.kj-tile {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 6px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  animation: cardEntrance 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--item-idx, 0) * 12ms);
  will-change: transform, opacity;
}
.kj-tile:hover {
  transform: translateY(-3px);
  border-color: var(--green);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.kj-tile:active {
  transform: scale(0.96) translateY(-1px);
}
@keyframes cardEntrance {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 3. Flashcard 3D perspective & Smooth Flip */
.fc-wrap {
  perspective: 1200px;
  margin: 16px 0;
  display: flex;
  justify-content: center;
}
.flashcard {
  width: 100%;
  max-width: 480px;
  height: 310px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.3, 1.2, 0.4, 1);
  cursor: pointer;
  user-select: none;
}
.flashcard.flipped {
  transform: rotateY(180deg);
}
.fc-side {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  background: var(--surface);
  transform-style: preserve-3d;
}
.fc-back {
  transform: rotateY(180deg);
  background: linear-gradient(180deg, var(--surface) 0%, var(--surface2) 100%);
}

/* 4. Filter Pills & Segmented Controls */
.seg button {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-soft);
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
.seg button:hover {
  color: var(--text);
}
.seg button:active {
  transform: scale(0.94);
}
.seg button.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-sm);
  font-weight: 800;
  transform: scale(1.02);
}

/* 5. Search Box Focus State */
.search-box {
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
.search-box:focus-within {
  border-color: var(--green);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--green) 18%, transparent);
  background: var(--surface);
}

/* 6. Mastery Feedback Animation */
@keyframes starPulse {
  0% { transform: scale(1); }
  45% { transform: scale(1.38) rotate(12deg); }
  100% { transform: scale(1) rotate(0deg); }
}
.fc-btn.star.mastery-pop, .fc-btn.star.active {
  animation: starPulse 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.kj-tile.starred::after {
  content: "★";
  position: absolute;
  top: 4px;
  right: 5px;
  font-size: 10.5px;
  color: var(--amber);
  animation: starPulse 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 7. Interactive Buttons Feedback */
.fc-btn, .study-card-btn, .action-tile-btn, .quote-nav-btn, .icon-btn, .nav-item, .subnav-item {
  transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.fc-btn:active, .study-card-btn:active, .action-tile-btn:active, .quote-nav-btn:active, .icon-btn:active {
  transform: scale(0.95);
}

/* 8. Progress Rings & Charts Transitions */
.week-bar-pill {
  transition: height 0.5s cubic-bezier(0.34, 1.3, 0.64, 1), background-color 0.2s ease;
}

/* 9. Async Loading Skeleton State */
.loading-skeleton-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
  color: var(--text-soft);
  font-size: 13.5px;
  font-weight: 700;
  animation: skeletonPulse 1.2s ease-in-out infinite;
}
@keyframes skeletonPulse {
  0%, 100% { opacity: 0.5; transform: scale(0.99); }
  50% { opacity: 1; transform: scale(1); }
}

/* 10. Prefers-Reduced-Motion Accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .flashcard {
    transition: none !important;
  }
  .view.active, .kj-tile, .modal-window, .toast {
    animation: none !important;
    transform: none !important;
  }
}
`;

// Insert animation CSS right before </style>
html = html.replace('</style>', animationCSS + '\n</style>');

// 2. Update renderKanjiGrid to inject --item-idx for staggered animation and support loading state
const oldRenderKanjiGrid = `function renderKanjiGrid(){
  const list = $('#kanji-grid-list');
  if (!list) return;
  const q = ($('#kj-search-input').value || '').trim().toLowerCase();
  const f = state.ui.kanjiFilter || 'all';

  const all = getAllLoadedKanji();
  const items = all.filter(item => {
    if (currentLvlFilter !== 'all' && (item.lvl || '').toUpperCase() !== currentLvlFilter.toUpperCase()) return false;
    const isStarred = kanjiStarred.has(item.k);
    if (f === 'starred' && !isStarred) return false;
    if (f === 'unstarred' && isStarred) return false;
    if (q){
      return item.k.includes(q) || item.h.toLowerCase().includes(q) || item.r.toLowerCase().includes(q) || item.m.toLowerCase().includes(q);
    }
    return true;
  });

  list.innerHTML = items.map(item => {
    const isStarred = kanjiStarred.has(item.k);
    return \`
      <div class="kj-tile \${isStarred ? 'starred' : ''}" data-k="\${item.k}">
        <span class="kj-lvl-tag \${(item.lvl||'n5').toLowerCase()}">\${item.lvl||'N5'}</span>
        <div class="kj-char">\${item.k}</div>
        <div class="kj-hira">\${esc(item.h)}</div>
        <div class="kj-mean">\${esc(item.m)}</div>
      </div>
    \`;
  }).join('');`;

const newRenderKanjiGrid = `function renderKanjiGrid(){
  const list = $('#kanji-grid-list');
  if (!list) return;
  const q = ($('#kj-search-input').value || '').trim().toLowerCase();
  const f = state.ui.kanjiFilter || 'all';

  const all = getAllLoadedKanji();
  const items = all.filter(item => {
    if (currentLvlFilter !== 'all' && (item.lvl || '').toUpperCase() !== currentLvlFilter.toUpperCase()) return false;
    const isStarred = kanjiStarred.has(item.k);
    if (f === 'starred' && !isStarred) return false;
    if (f === 'unstarred' && isStarred) return false;
    if (q){
      return item.k.includes(q) || item.h.toLowerCase().includes(q) || item.r.toLowerCase().includes(q) || item.m.toLowerCase().includes(q);
    }
    return true;
  });

  if (!items.length) {
    list.innerHTML = \`<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-soft);font-size:13px">No matching Kanji found.</div>\`;
    return;
  }

  list.innerHTML = items.map((item, idx) => {
    const isStarred = kanjiStarred.has(item.k);
    const delayStyle = idx < 30 ? \`style="--item-idx:\${idx}"\` : '';
    return \`
      <div class="kj-tile \${isStarred ? 'starred' : ''}" data-k="\${item.k}" \${delayStyle}>
        <span class="kj-lvl-tag \${(item.lvl||'n5').toLowerCase()}">\${item.lvl||'N5'}</span>
        <div class="kj-char">\${item.k}</div>
        <div class="kj-hira">\${esc(item.h)}</div>
        <div class="kj-mean">\${esc(item.m)}</div>
      </div>
    \`;
  }).join('');`;

html = html.replace(oldRenderKanjiGrid, newRenderKanjiGrid);

// 3. Update star button handler for pop animation
const oldStarHandler = `    if (kanjiStarred.has(item.k)){
      kanjiStarred.delete(item.k); toast(\`Unmarked \${item.k}\`);
    } else {
      kanjiStarred.add(item.k); toast(\`⭐ Mastered \${item.k} (\${item.h})!\`);
    }
    saveKanjiStarred(); updateFlashcardUI();`;

const newStarHandler = `    if (kanjiStarred.has(item.k)){
      kanjiStarred.delete(item.k); toast(\`Unmarked \${item.k}\`);
      $('#fc-star').classList.remove('mastery-pop');
    } else {
      kanjiStarred.add(item.k); toast(\`⭐ Mastered \${item.k} (\${item.h})!\`);
      $('#fc-star').classList.add('mastery-pop');
      setTimeout(() => $('#fc-star').classList.remove('mastery-pop'), 400);
    }
    saveKanjiStarred(); updateFlashcardUI();`;

html = html.replace(oldStarHandler, newStarHandler);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully integrated polished animation system and accessibility into index.html');
