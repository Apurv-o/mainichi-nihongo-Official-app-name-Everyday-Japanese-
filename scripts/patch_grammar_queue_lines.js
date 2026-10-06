const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const isCRLF = raw.includes('\r\n');
const lines = raw.split(/\r?\n/);

console.log('Lines before:', lines.length);

// 1. Locate #grammar-status-filter and insert #grammar-view-mode before it
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="grammar-status-filter"')) {
    console.log(`Found grammar-status-filter at line ${i + 1}`);
    const modePillLines = [
      `            <div class="seg" id="grammar-view-mode">`,
      `              <button data-mode="grid" class="active">Browse Cards</button>`,
      `              <button data-mode="queue">🌸 Today's Queue</button>`,
      `            </div>`
    ];
    lines.splice(i, 0, ...modePillLines);
    break;
  }
}

// 2. Locate #gm-grid-mode end and insert #gm-queue-mode
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="gm-grid-mode"') && lines[i+1].includes('id="grammar-grid-list"')) {
    console.log(`Found gm-grid-mode at line ${i + 1}`);
    const queueLines = [
      ``,
      `        <!-- Today's Grammar Queue Mode -->`,
      `        <div id="gm-queue-mode" style="display:none">`,
      `          <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;margin-top:8px">`,
      `            <h3 style="font-size:16px;font-weight:900;color:var(--text);margin-bottom:4px">🌸 Today's Focused Queue (10 Patterns)</h3>`,
      `            <p style="font-size:12px;color:var(--text-soft);margin-bottom:14px">Prioritizing unmastered grammar patterns and review items for daily practice.</p>`,
      `            <div class="grammar-grid-list" id="grammar-queue-list"></div>`,
      `          </div>`,
      `        </div>`
    ];
    lines.splice(i + 3, 0, ...queueLines);
    break;
  }
}

// 3. Locate Grammar controllers and add renderGrammarGrid, renderGrammarQueue, switchGrammarMode
let gCtrlStart = -1, gCtrlEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function renderGrammarView(){')) {
    gCtrlStart = i;
  }
  if (gCtrlStart !== -1 && lines[i].includes('function openGrammarDetail(item){')) {
    gCtrlEnd = i - 1;
    break;
  }
}

if (gCtrlStart !== -1 && gCtrlEnd !== -1) {
  console.log(`Replacing Grammar render controllers from line ${gCtrlStart + 1} to ${gCtrlEnd + 1}`);
  const replacementGrammar = [
    `let currentGrammarMode = 'grid';`,
    ``,
    `function renderGrammarView(){`,
    `  const all = getAllLoadedGrammar();`,
    `  const filtered = getFilteredGrammar();`,
    ``,
    `  // Progress Bar`,
    `  const totalCount = all.length || 1;`,
    `  const masteredCount = grammarStarred.size;`,
    `  const pct = Math.min(100, Math.round((masteredCount / totalCount) * 100));`,
    `  if ($('#grammar-progress-text')) $('#grammar-progress-text').textContent = \`\${masteredCount} / \${all.length} mastered (\${pct}%)\`;`,
    `  if ($('#grammar-progress-fill')) $('#grammar-progress-fill').style.width = pct + '%';`,
    ``,
    `  if (currentGrammarMode === 'grid') {`,
    `    renderGrammarGrid(filtered);`,
    `  } else if (currentGrammarMode === 'queue') {`,
    `    renderGrammarQueue();`,
    `  }`,
    `}`,
    ``,
    `function renderGrammarGrid(items){`,
    `  const list = $('#grammar-grid-list');`,
    `  if (!list) return;`,
    ``,
    `  if (!items.length) {`,
    `    list.innerHTML = \`<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-soft);font-size:13px">No matching grammar patterns found.</div>\`;`,
    `    return;`,
    `  }`,
    ``,
    `  const all = getAllLoadedGrammar();`,
    `  list.innerHTML = items.map((item, idx) => {`,
    `    const isStarred = grammarStarred.has(item.id);`,
    `    const delayStyle = idx < 30 ? \`style="--item-idx:\${idx}"\` : '';`,
    `    return \``,
    `      <div class="grammar-card \${isStarred ? 'starred' : ''}" data-id="\${item.id}" \${delayStyle}>`,
    `        <div>`,
    `          <div style="display:flex;justify-content:space-between;align-items:center">`,
    `            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>`,
    `          </div>`,
    `          <div class="grammar-pattern" style="margin-top:6px">\${esc(item.pattern)}</div>`,
    `          <div class="grammar-meaning">\${esc(item.meaning)}</div>`,
    `          <div class="grammar-explanation" style="margin-top:4px">\${esc(item.explanation)}</div>`,
    `        </div>`,
    `        <div class="grammar-formation-preview">\${esc(item.formation || 'Pattern')}</div>`,
    `      </div>`,
    `    \`;`,
    `  }).join('');`,
    ``,
    `  $$('.grammar-card', list).forEach(card => {`,
    `    card.onclick = () => {`,
    `      const id = card.dataset.id;`,
    `      const item = all.find(x => x.id === id);`,
    `      if (item) openGrammarDetail(item);`,
    `    };`,
    `  });`,
    `}`,
    ``,
    `function renderGrammarQueue(){`,
    `  const all = getAllLoadedGrammar();`,
    `  const unmastered = all.filter(x => !grammarStarred.has(x.id));`,
    `  const queue = (unmastered.length >= 10 ? unmastered : all).slice(0, 10);`,
    `  `,
    `  const list = $('#grammar-queue-list');`,
    `  if (!list) return;`,
    ``,
    `  list.innerHTML = queue.map((item, idx) => {`,
    `    const isStarred = grammarStarred.has(item.id);`,
    `    return \``,
    `      <div class="grammar-card \${isStarred ? 'starred' : ''}" data-id="\${item.id}" style="--item-idx:\${idx}">`,
    `        <div>`,
    `          <div style="display:flex;justify-content:space-between;align-items:center">`,
    `            <span class="fc-badge \${(item.level||'n5').toLowerCase()}">JLPT \${item.level||'N5'}</span>`,
    `            <span style="font-size:11px;font-weight:700;color:var(--pink-text)">Queue #\${idx + 1}</span>`,
    `          </div>`,
    `          <div class="grammar-pattern" style="margin-top:6px">\${esc(item.pattern)}</div>`,
    `          <div class="grammar-meaning">\${esc(item.meaning)}</div>`,
    `          <div class="grammar-explanation" style="margin-top:4px">\${esc(item.explanation)}</div>`,
    `        </div>`,
    `        <div class="grammar-formation-preview">\${esc(item.formation || 'Pattern')}</div>`,
    `      </div>`,
    `    \`;`,
    `  }).join('');`,
    ``,
    `  $$('.grammar-card', list).forEach(card => {`,
    `    card.onclick = () => {`,
    `      const id = card.dataset.id;`,
    `      const item = all.find(x => x.id === id);`,
    `      if (item) openGrammarDetail(item);`,
    `    };`,
    `  });`,
    `}`,
    ``,
    `function switchGrammarMode(mode){`,
    `  currentGrammarMode = mode;`,
    `  $('#gm-grid-mode').style.display = (mode === 'grid') ? 'block' : 'none';`,
    `  $('#gm-queue-mode').style.display = (mode === 'queue') ? 'block' : 'none';`,
    `  $$('#grammar-view-mode button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));`,
    `  renderGrammarView();`,
    `}`
  ];
  lines.splice(gCtrlStart, gCtrlEnd - gCtrlStart + 1, ...replacementGrammar);
}

// 4. Attach event listeners for #grammar-view-mode
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Grammar Filters & Search')) {
    console.log(`Adding grammar-view-mode click listeners at line ${i + 1}`);
    const gmListeners = [
      `  // Grammar Mode Switcher`,
      `  $$('#grammar-view-mode button').forEach(b => {`,
      `    b.onclick = () => switchGrammarMode(b.dataset.mode);`,
      `  });`,
      ``
    ];
    lines.splice(i, 0, ...gmListeners);
    break;
  }
}

const finalContent = lines.join(isCRLF ? '\r\n' : '\n');
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully patched grammar queue in index.html. Total lines now:', lines.length);
