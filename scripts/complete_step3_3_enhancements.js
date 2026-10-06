const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.html');
let raw = fs.readFileSync(filePath, 'utf8');

// 1. Update #view-grammar HTML to add mode switcher and queue view
const oldGrammarHeader = `<div class="seg" id="grammar-status-filter">
              <button data-status="all" class="active">All Status</button>
              <button data-status="starred">⭐ Mastered</button>
              <button data-status="unstarred">Need Practice</button>
            </div>`;

const newGrammarHeader = `<div class="seg" id="grammar-view-mode">
              <button data-mode="grid" class="active">Browse Cards</button>
              <button data-mode="queue">🌸 Today's Queue</button>
            </div>
            <div class="seg" id="grammar-status-filter">
              <button data-status="all" class="active">All Status</button>
              <button data-status="starred">⭐ Mastered</button>
              <button data-status="unstarred">Need Practice</button>
            </div>`;

raw = raw.replace(oldGrammarHeader, newGrammarHeader);

const oldGrammarGridEnd = `        <!-- Grid Cards Mode -->
        <div id="gm-grid-mode">
          <div class="grammar-grid-list" id="grammar-grid-list"></div>
        </div>
      </section>`;

const newGrammarGridEnd = `        <!-- Grid Cards Mode -->
        <div id="gm-grid-mode">
          <div class="grammar-grid-list" id="grammar-grid-list"></div>
        </div>

        <!-- Today's Grammar Queue Mode -->
        <div id="gm-queue-mode" style="display:none">
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;margin-top:8px">
            <h3 style="font-size:16px;font-weight:900;color:var(--text);margin-bottom:4px">🌸 Today's Focused Queue (10 Patterns)</h3>
            <p style="font-size:12px;color:var(--text-soft);margin-bottom:14px">Prioritizing unmastered grammar patterns and review items for daily practice.</p>
            <div class="grammar-grid-list" id="grammar-queue-list"></div>
          </div>
        </div>
      </section>`;

raw = raw.replace(oldGrammarGridEnd, newGrammarGridEnd);

// 2. Add currentGrammarMode and Grammar Queue functions
const oldGrammarControllers = `/* ============================================================
   GRAMMAR CONTROLLERS & LEARNING ENGINE
   ============================================================ */
function getFilteredGrammar(){`;

const newGrammarControllers = `/* ============================================================
   GRAMMAR CONTROLLERS & LEARNING ENGINE
   ============================================================ */
let currentGrammarMode = 'grid';

function getFilteredGrammar(){`;

raw = raw.replace(oldGrammarControllers, newGrammarControllers);

const oldRenderGrammarView = `function renderGrammarView(){
  const all = getAllLoadedGrammar();
  const filtered = getFilteredGrammar();

  // Progress Bar
  const totalCount = all.length || 1;
  const masteredCount = grammarStarred.size;
  const pct = Math.min(100, Math.round((masteredCount / totalCount) * 100));
  if ($('#grammar-progress-text')) $('#grammar-progress-text').textContent = \`\${masteredCount} / \${all.length} mastered (\${pct}%)\`;
  if ($('#grammar-progress-fill')) $('#grammar-progress-fill').style.width = pct + '%';

  const list = $('#grammar-grid-list');
  if (!list) return;

  if (!filtered.length) {
    list.innerHTML = \`<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-soft);font-size:13px">No matching grammar patterns found.</div>\`;
    return;
  }

  list.innerHTML = filtered.map((item, idx) => {
    const isStarred = grammarStarred.has(item.id);
    const delayStyle = idx < 30 ? \`style="--item-idx:\${idx}"\` : '';
    return \`
      <div class="grammar-card \${isStarred ? 'starred' : ''}" data-id="\${item.id}" \${delayStyle}>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
          </div>
          <div class="grammar-pattern" style="margin-top:6px">\${esc(item.pattern)}</div>
          <div class="grammar-meaning">\${esc(item.meaning)}</div>
          <div class="grammar-explanation" style="margin-top:4px">\${esc(item.explanation)}</div>
        </div>
        <div class="grammar-formation-preview">\${esc(item.formation || 'Pattern')}</div>
      </div>
    \`;
  }).join('');

  $$('.grammar-card', list).forEach(card => {
    card.onclick = () => {
      const id = card.dataset.id;
      const item = all.find(x => x.id === id);
      if (item) openGrammarDetail(item);
    };
  });
}`;

const newRenderGrammarView = `function renderGrammarView(){
  const all = getAllLoadedGrammar();
  const filtered = getFilteredGrammar();

  // Progress Bar
  const totalCount = all.length || 1;
  const masteredCount = grammarStarred.size;
  const pct = Math.min(100, Math.round((masteredCount / totalCount) * 100));
  if ($('#grammar-progress-text')) $('#grammar-progress-text').textContent = \`\${masteredCount} / \${all.length} mastered (\${pct}%)\`;
  if ($('#grammar-progress-fill')) $('#grammar-progress-fill').style.width = pct + '%';

  if (currentGrammarMode === 'grid') {
    renderGrammarGrid(filtered);
  } else if (currentGrammarMode === 'queue') {
    renderGrammarQueue();
  }
}

function renderGrammarGrid(items){
  const list = $('#grammar-grid-list');
  if (!list) return;

  if (!items.length) {
    list.innerHTML = \`<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-soft);font-size:13px">No matching grammar patterns found.</div>\`;
    return;
  }

  const all = getAllLoadedGrammar();
  list.innerHTML = items.map((item, idx) => {
    const isStarred = grammarStarred.has(item.id);
    const delayStyle = idx < 30 ? \`style="--item-idx:\${idx}"\` : '';
    return \`
      <div class="grammar-card \${isStarred ? 'starred' : ''}" data-id="\${item.id}" \${delayStyle}>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
          </div>
          <div class="grammar-pattern" style="margin-top:6px">\${esc(item.pattern)}</div>
          <div class="grammar-meaning">\${esc(item.meaning)}</div>
          <div class="grammar-explanation" style="margin-top:4px">\${esc(item.explanation)}</div>
        </div>
        <div class="grammar-formation-preview">\${esc(item.formation || 'Pattern')}</div>
      </div>
    \`;
  }).join('');

  $$('.grammar-card', list).forEach(card => {
    card.onclick = () => {
      const id = card.dataset.id;
      const item = all.find(x => x.id === id);
      if (item) openGrammarDetail(item);
    };
  });
}

function renderGrammarQueue(){
  const all = getAllLoadedGrammar();
  const unmastered = all.filter(x => !grammarStarred.has(x.id));
  const queue = (unmastered.length >= 10 ? unmastered : all).slice(0, 10);
  
  const list = $('#grammar-queue-list');
  if (!list) return;

  list.innerHTML = queue.map((item, idx) => {
    const isStarred = grammarStarred.has(item.id);
    return \`
      <div class="grammar-card \${isStarred ? 'starred' : ''}" data-id="\${item.id}" style="--item-idx:\${idx}">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>
            <span style="font-size:11px;font-weight:700;color:var(--pink-text)">Queue #\${idx + 1}</span>
          </div>
          <div class="grammar-pattern" style="margin-top:6px">\${esc(item.pattern)}</div>
          <div class="grammar-meaning">\${esc(item.meaning)}</div>
          <div class="grammar-explanation" style="margin-top:4px">\${esc(item.explanation)}</div>
        </div>
        <div class="grammar-formation-preview">\${esc(item.formation || 'Pattern')}</div>
      </div>
    \`;
  }).join('');

  $$('.grammar-card', list).forEach(card => {
    card.onclick = () => {
      const id = card.dataset.id;
      const item = all.find(x => x.id === id);
      if (item) openGrammarDetail(item);
    };
  });
}

function switchGrammarMode(mode){
  currentGrammarMode = mode;
  $('#gm-grid-mode').style.display = (mode === 'grid') ? 'block' : 'none';
  $('#gm-queue-mode').style.display = (mode === 'queue') ? 'block' : 'none';
  $$('#grammar-view-mode button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  renderGrammarView();
}`;

raw = raw.replace(oldRenderGrammarView, newRenderGrammarView);

// 3. Add listener for grammar-view-mode in init
const oldGrammarModeInit = `  // Grammar Filters & Search`;
const newGrammarModeInit = `  // Grammar Mode Switcher
  $$('#grammar-view-mode button').forEach(b => {
    b.onclick = () => switchGrammarMode(b.dataset.mode);
  });

  // Grammar Filters & Search`;

raw = raw.replace(oldGrammarModeInit, newGrammarModeInit);

fs.writeFileSync(filePath, raw, 'utf8');
console.log('Successfully completed Step 3.3 enhancements');
