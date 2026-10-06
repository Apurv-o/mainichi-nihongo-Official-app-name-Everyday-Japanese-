const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const isCRLF = raw.includes('\r\n');
let lines = raw.split(/\r?\n/);

console.log('Lines before:', lines.length);

// 1. Add Today Dashboard "Start Today's Study" Button
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('class="panel-title">今日の学習')) {
    console.log(`Found Today's Study header at line ${i + 1}`);
    const globalQueueBtn = [
      `            <div style="margin-bottom:12px">`,
      `              <button class="study-card-btn" id="btn-start-global-queue" style="width:100%;padding:10px 16px;background:var(--green-soft);color:var(--green-deep);border:1px solid var(--green);font-size:13.5px;font-weight:800;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">`,
      `                🌸 Start Today's Daily Queue (10 Items) →`,
      `              </button>`,
      `            </div>`
    ];
    lines.splice(i + 4, 0, ...globalQueueBtn);
    break;
  }
}

// 2. Add Kanji Mode Switcher for Queue
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="kanji-view-mode"')) {
    console.log(`Found kanji-view-mode at line ${i + 1}`);
    lines[i+2] = `              <button data-mode="grid">Browse Grid</button>`;
    lines.splice(i+3, 0, `              <button data-mode="queue">🌸 Today's Queue</button>`);
    break;
  }
}

// 3. Add #kj-queue-mode into #view-kanji
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="kj-grid-mode"') && lines[i+1].includes('id="kanji-grid-list"')) {
    console.log(`Found kj-grid-mode at line ${i + 1}`);
    const kjQueueLines = [
      ``,
      `        <!-- Today's Kanji Queue Mode -->`,
      `        <div id="kj-queue-mode" style="display:none">`,
      `          <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;margin-top:8px">`,
      `            <h3 style="font-size:16px;font-weight:900;color:var(--text);margin-bottom:4px">🌸 Today's Focused Queue (10 Kanji)</h3>`,
      `            <p style="font-size:12px;color:var(--text-soft);margin-bottom:14px">Prioritizing unmastered Kanji and review items for daily practice.</p>`,
      `            <div class="kanji-grid-list" id="kanji-queue-list"></div>`,
      `          </div>`,
      `        </div>`
    ];
    lines.splice(i + 3, 0, ...kjQueueLines);
    break;
  }
}

// 4. Add Universal Study Session Modal Markup right before </main>
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('</main>')) {
    console.log(`Inserting Study Session Modal before </main> at line ${i + 1}`);
    const sessionModalHtml = [
      `      <!-- ================= UNIVERSAL STUDY SESSION OVERLAY ================= -->`,
      `      <div id="study-session-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:90;align-items:center;justify-content:center;padding:16px">`,
      `        <div class="session-window" style="background:var(--surface);border:1px solid var(--border);border-radius:16px;max-width:560px;width:100%;box-shadow:0 12px 36px rgba(0,0,0,0.22);padding:24px;position:relative;animation:cardEntrance 0.25s ease both">`,
      `          <div class="session-head" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:16px">`,
      `            <div>`,
      `              <div style="font-size:12px;font-weight:700;color:var(--green-deep)" id="sess-badge-context">TODAY'S STUDY QUEUE</div>`,
      `              <div style="font-size:18px;font-weight:900;color:var(--text)" id="sess-title">Daily Practice</div>`,
      `            </div>`,
      `            <button id="sess-btn-close" style="width:30px;height:30px;border-radius:50%;border:1px solid var(--border);background:var(--surface2);font-size:14px;cursor:pointer;color:var(--text-soft)">✕</button>`,
      `          </div>`,
      `          `,
      `          <!-- Progress bar -->`,
      `          <div style="margin-bottom:16px">`,
      `            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px">`,
      `              <span>Item <b id="sess-cur-step" style="color:var(--text)">1</b> of <span id="sess-total-steps">10</span></span>`,
      `              <span id="sess-type-tag" class="vocab-pos-tag">Vocabulary</span>`,
      `            </div>`,
      `            <div class="lib-progress-bar-wrap" style="width:100%;height:6px">`,
      `              <div class="lib-progress-bar-fill" id="sess-progress-bar" style="width:10%"></div>`,
      `            </div>`,
      `          </div>`,
      `          `,
      `          <!-- Main Card Content Area -->`,
      `          <div id="sess-card-body" style="min-height:220px;display:flex;flex-direction:column;justify-content:center;text-align:center"></div>`,
      `          `,
      `          <!-- Footer Controls -->`,
      `          <div id="sess-controls-bar" style="margin-top:20px;display:flex;gap:10px;justify-content:center"></div>`,
      `        </div>`,
      `      </div>`
    ];
    lines.splice(i, 0, ...sessionModalHtml);
    break;
  }
}

// 5. Add Queue and Session Logic in JavaScript
const queueControllerCode = [
  `/* ============================================================`,
  `   STEP 3.4 — TODAY'S QUEUE & STUDY SESSION ENGINE`,
  `   ============================================================ */`,
  `const LS_DAILY_QUEUE = 'mn.daily.queue.v1';`,
  `const LS_RECENT_STUDIED = 'mn.recently.studied.v1';`,
  ``,
  `let currentSession = null;`,
  ``,
  `function logRecentlyStudied(id, type, level, result){`,
  `  try {`,
  `    let list = JSON.parse(localStorage.getItem(LS_RECENT_STUDIED) || '[]');`,
  `    list = list.filter(x => x.id !== id);`,
  `    list.unshift({ id, type, level, date: todayStr(), result });`,
  `    if (list.length > 200) list = list.slice(0, 200);`,
  `    localStorage.setItem(LS_RECENT_STUDIED, JSON.stringify(list));`,
  `  } catch(e){}`,
  `}`,
  ``,
  `function generateStudyQueue({ source = 'global', level = 'all', limit = 10 } = {}){`,
  `  const todayKey = todayStr();`,
  `  const normLevel = (level || 'all').toLowerCase();`,
  `  const queueKey = \`\${LS_DAILY_QUEUE}_\${todayKey}_\${source}_\${normLevel}\`;`,
  `  `,
  `  try {`,
  `    const cached = localStorage.getItem(queueKey);`,
  `    if (cached) {`,
  `      const parsed = JSON.parse(cached);`,
  `      if (parsed && parsed.date === todayKey && Array.isArray(parsed.items) && parsed.items.length > 0) {`,
  `        return parsed;`,
  `      }`,
  `    }`,
  `  } catch(e){}`,
  ``,
  `  let recentList = [];`,
  `  try { recentList = JSON.parse(localStorage.getItem(LS_RECENT_STUDIED) || '[]'); } catch(e){}`,
  `  const recentIds = new Set(recentList.map(x => x.id));`,
  `  const practiceIds = new Set(recentList.filter(x => x.result === 'practice').map(x => x.id));`,
  ``,
  `  let items = [];`,
  `  if (source === 'vocabulary') {`,
  `    const all = getAllLoadedVocabulary();`,
  `    const pool = (normLevel === 'all') ? all : all.filter(x => (x.level || '').toLowerCase() === normLevel);`,
  `    items = rankAndSelectItems(pool, vocabStarred, practiceIds, recentIds, limit, 'vocabulary');`,
  `  } else if (source === 'grammar') {`,
  `    const all = getAllLoadedGrammar();`,
  `    const pool = (normLevel === 'all') ? all : all.filter(x => (x.level || '').toLowerCase() === normLevel);`,
  `    items = rankAndSelectItems(pool, grammarStarred, practiceIds, recentIds, limit, 'grammar');`,
  `  } else if (source === 'kanji') {`,
  `    const all = getAllLoadedKanji();`,
  `    const pool = (normLevel === 'all') ? all : all.filter(x => (x.lvl || '').toLowerCase() === normLevel);`,
  `    items = rankAndSelectItems(pool, kanjiStarred, practiceIds, recentIds, limit, 'kanji');`,
  `  } else {`,
  `    // Global balanced daily study: 5 Vocab, 3 Grammar, 2 Kanji`,
  `    const allV = getAllLoadedVocabulary();`,
  `    const allG = getAllLoadedGrammar();`,
  `    const allK = getAllLoadedKanji();`,
  `    const vItems = rankAndSelectItems(allV, vocabStarred, practiceIds, recentIds, 5, 'vocabulary');`,
  `    const gItems = rankAndSelectItems(allG, grammarStarred, practiceIds, recentIds, 3, 'grammar');`,
  `    const kItems = rankAndSelectItems(allK, kanjiStarred, practiceIds, recentIds, 2, 'kanji');`,
  `    items = [...vItems, ...gItems, ...kItems];`,
  `  }`,
  ``,
  `  const queueObj = {`,
  `    date: todayKey,`,
  `    source,`,
  `    level: normLevel,`,
  `    currentIndex: 0,`,
  `    items,`,
  `    answers: {},`,
  `    completed: false`,
  `  };`,
  ``,
  `  try { localStorage.setItem(queueKey, JSON.stringify(queueObj)); } catch(e){}`,
  `  return queueObj;`,
  `}`,
  ``,
  `function rankAndSelectItems(pool, masteredSet, practiceIds, recentIds, limit, itemType, excludeIds = new Set()){`,
  `  if (!pool || !pool.length) return [];`,
  `  const getId = item => (itemType === 'kanji' ? item.k : item.id);`,
  `  const available = pool.filter(item => !excludeIds.has(getId(item)));`,
  ``,
  `  // Priority 1: Need Practice`,
  `  const p1 = available.filter(item => practiceIds.has(getId(item)) && !masteredSet.has(getId(item)));`,
  `  // Priority 2: Unmastered`,
  `  const p2 = available.filter(item => !masteredSet.has(getId(item)) && !practiceIds.has(getId(item)));`,
  `  // Priority 3: Mastered Review`,
  `  const p3 = available.filter(item => masteredSet.has(getId(item)));`,
  ``,
  `  const combined = [];`,
  `  const seen = new Set(excludeIds);`,
  `  for (const group of [p1, p2, p3]) {`,
  `    for (const item of group) {`,
  `      const id = getId(item);`,
  `      if (!seen.has(id)) {`,
  `        seen.add(id);`,
  `        combined.push({ itemType, ...item });`,
  `        if (combined.length >= limit) return combined;`,
  `      }`,
  `    }`,
  `  }`,
  `  return combined;`,
  `}`,
  ``,
  `function startStudySession(source = 'global', level = 'all', mistakeItems = null){`,
  `  if (mistakeItems && mistakeItems.length > 0) {`,
  `    currentSession = {`,
  `      date: todayStr(),`,
  `      source,`,
  `      level,`,
  `      currentIndex: 0,`,
  `      items: mistakeItems,`,
  `      answers: {},`,
  `      completed: false,`,
  `      isReview: true`,
  `    };`,
  `  } else {`,
  `    currentSession = generateStudyQueue({ source, level, limit: 10 });`,
  `  }`,
  `  renderStudySessionStep();`,
  `}`,
  ``,
  `function renderStudySessionStep(){`,
  `  const modal = $('#study-session-modal');`,
  `  if (!modal || !currentSession) return;`,
  `  modal.style.display = 'flex';`,
  ``,
  `  const { items, currentIndex, source, level, completed } = currentSession;`,
  `  const total = items.length;`,
  ``,
  `  // Header Context`,
  `  const ctxLabel = source === 'global' ? 'DAILY BALANCED STUDY' : \`\${source.toUpperCase()} · \${level.toUpperCase()}\`;`,
  `  $('#sess-badge-context').textContent = ctxLabel;`,
  `  $('#sess-title').textContent = currentSession.isReview ? 'Review Mistakes' : "Today's Study Session";`,
  ``,
  `  if (completed || currentIndex >= total) {`,
  `    renderStudySessionSummary();`,
  `    return;`,
  `  }`,
  ``,
  `  const item = items[currentIndex];`,
  `  const itemType = item.itemType || (item.k ? 'kanji' : item.pattern ? 'grammar' : 'vocabulary');`,
  `  `,
  `  // Progress`,
  `  $('#sess-cur-step').textContent = currentIndex + 1;`,
  `  $('#sess-total-steps').textContent = total;`,
  `  $('#sess-type-tag').textContent = itemType.toUpperCase();`,
  `  $('#sess-progress-bar').style.width = \`\${Math.round(((currentIndex) / total) * 100)}%\`;`,
  ``,
  `  // Front Presentation`,
  `  const body = $('#sess-card-body');`,
  `  const controls = $('#sess-controls-bar');`,
  ``,
  `  let frontPrompt = '';`,
  `  if (itemType === 'vocabulary') {`,
  `    frontPrompt = \`<div style="font-family:var(--font-jp);font-size:42px;font-weight:900;color:var(--text)">\${esc(item.word)}</div><div class="vocab-pos-tag" style="margin-top:6px">\${esc(item.partOfSpeech||'word')} · JLPT \${esc(item.level||'N5')}</div>\`;`,
  `  } else if (itemType === 'grammar') {`,
  `    frontPrompt = \`<div style="font-family:var(--font-jp);font-size:28px;font-weight:900;color:var(--text)">\${esc(item.pattern)}</div><div class="vocab-pos-tag" style="margin-top:6px">JLPT \${esc(item.level||'N5')}</div>\`;`,
  `  } else {`,
  `    frontPrompt = \`<div style="font-family:var(--font-jp);font-size:56px;font-weight:900;color:var(--text)">\${esc(item.k)}</div><div class="vocab-pos-tag" style="margin-top:6px">JLPT \${esc(item.lvl||'N5')}</div>\`;`,
  `  }`,
  ``,
  `  body.innerHTML = \`\${frontPrompt}<div id="sess-revealed-content" style="display:none;margin-top:16px;text-align:left;background:var(--surface2);padding:14px 16px;border-radius:10px;border:1px solid var(--border)"></div>\`;`,
  `  controls.innerHTML = \`<button class="study-card-btn" id="btn-sess-reveal" style="padding:10px 24px;font-size:14px;font-weight:800;background:var(--green-btn);color:#fff;border-radius:8px">👁️ Reveal Answer (Space)</button>\`;`,
  ``,
  `  $('#btn-sess-reveal').onclick = () => revealSessionAnswer(item, itemType);`,
  `}`,
  ``,
  `function revealSessionAnswer(item, itemType){`,
  `  const revBox = $('#sess-revealed-content');`,
  `  const controls = $('#sess-controls-bar');`,
  `  if (!revBox || !controls) return;`,
  ``,
  `  let answerHtml = '';`,
  `  if (itemType === 'vocabulary') {`,
  `    const ex = item.example || {};`,
  `    answerHtml = \``,
  `      <div style="font-size:16px;font-weight:800;color:var(--green-deep)">\${esc(item.reading)} <span style="font-size:13px;color:var(--text-soft);font-style:italic">(\${esc(item.romaji)})</span></div>`,
  `      <div style="font-size:14px;font-weight:700;color:var(--text);margin-top:4px">\${esc(item.meaning)}</div>`,
  `      \${ex.jp ? \`<div style="margin-top:8px;font-size:12.5px;color:var(--text);border-top:1px dashed var(--border);padding-top:6px"><div>\${esc(ex.jp)}</div><div style="color:var(--text-soft);font-size:11.5px;font-style:italic">\${esc(ex.en||'')}</div></div>\` : ''}`,
  `    \`;`,
  `  } else if (itemType === 'grammar') {`,
  `    const ex0 = (item.examples && item.examples[0]) || {};`,
  `    answerHtml = \``,
  `      <div style="font-size:15px;font-weight:800;color:var(--pink-text)">\${esc(item.meaning)}</div>`,
  `      <div style="font-size:12.5px;color:var(--text-soft);margin-top:4px">\${esc(item.explanation)}</div>`,
  `      <div style="font-size:12px;font-family:monospace;font-weight:700;color:var(--text);margin-top:6px">\${esc(item.formation)}</div>`,
  `      \${ex0.jp ? \`<div style="margin-top:8px;font-size:12.5px;color:var(--text);border-top:1px dashed var(--border);padding-top:6px"><div>\${esc(ex0.jp)}</div><div style="color:var(--text-soft);font-size:11.5px;font-style:italic">\${esc(ex0.en||'')}</div></div>\` : ''}`,
  `    \`;`,
  `  } else {`,
  `    answerHtml = \``,
  `      <div style="font-size:16px;font-weight:800;color:var(--lav)">\${esc(item.h)} <span style="font-size:13px;color:var(--text-soft);font-style:italic">(\${esc(item.r)})</span></div>`,
  `      <div style="font-size:14px;font-weight:700;color:var(--text);margin-top:4px">\${esc(item.m)}</div>`,
  `      <div style="font-size:12px;color:var(--text-soft);margin-top:4px">Compound: <b>\${esc(item.ex||'')}</b></div>`,
  `    \`;`,
  `  }`,
  ``,
  `  revBox.innerHTML = answerHtml;`,
  `  revBox.style.display = 'block';`,
  ``,
  `  controls.innerHTML = \``,
  `    <button class="fc-btn" id="btn-sess-need-practice" style="border-color:var(--amber);color:var(--amber-text);padding:10px 18px">↻ Need Practice (1)</button>`,
  `    <button class="fc-btn" id="btn-sess-got-it" style="background:var(--green-soft);color:var(--green-deep);border-color:var(--green);padding:10px 22px;font-weight:800">Got It ✓ (2)</button>`,
  `  \`;`,
  ``,
  `  $('#btn-sess-need-practice').onclick = () => answerSessionStep(item, itemType, 'practice');`,
  `  $('#btn-sess-got-it').onclick = () => answerSessionStep(item, itemType, 'mastered');`,
  `}`,
  ``,
  `async function answerSessionStep(item, itemType, result){`,
  `  const id = itemType === 'kanji' ? item.k : item.id;`,
  `  currentSession.answers[id] = result;`,
  `  logRecentlyStudied(id, itemType, item.level || item.lvl || 'n5', result);`,
  ``,
  `  if (result === 'mastered') {`,
  `    if (itemType === 'vocabulary') { vocabStarred.add(id); saveVocabStarred(); }`,
  `    else if (itemType === 'grammar') { grammarStarred.add(id); saveGrammarStarred(); }`,
  `    else if (itemType === 'kanji') { kanjiStarred.add(id); saveKanjiStarred(); }`,
  `    `,
  `    const todayKey = itemType === 'vocabulary' ? 'words' : itemType === 'grammar' ? 'grammarPages' : 'kanjiPages';`,
  `    const cur = getTodayEntry()[todayKey] || 0;`,
  `    await patchToday({ [todayKey]: cur + 1 });`,
  `    renderToday();`,
  `  } else {`,
  `    if (itemType === 'vocabulary' && vocabStarred.has(id)) { vocabStarred.delete(id); saveVocabStarred(); }`,
  `    else if (itemType === 'grammar' && grammarStarred.has(id)) { grammarStarred.delete(id); saveGrammarStarred(); }`,
  `    else if (itemType === 'kanji' && kanjiStarred.has(id)) { kanjiStarred.delete(id); saveKanjiStarred(); }`,
  `  }`,
  ``,
  `  currentSession.currentIndex++;`,
  `  if (currentSession.currentIndex >= currentSession.items.length) {`,
  `    currentSession.completed = true;`,
  `  }`,
  `  `,
  `  const normLevel = (currentSession.level || 'all').toLowerCase();`,
  `  const queueKey = \`\${LS_DAILY_QUEUE}_\${todayStr()}_\${currentSession.source}_\${normLevel}\`;`,
  `  try { localStorage.setItem(queueKey, JSON.stringify(currentSession)); } catch(e){}`,
  ``,
  `  renderStudySessionStep();`,
  `}`,
  ``,
  `function renderStudySessionSummary(){`,
  `  const { items, answers, source, level } = currentSession;`,
  `  const total = items.length;`,
  `  const masteredCount = Object.values(answers).filter(v => v === 'mastered').length;`,
  `  const practiceItems = items.filter(item => {`,
  `    const id = item.itemType === 'kanji' ? item.k : item.id;`,
  `    return answers[id] === 'practice';`,
  `  });`,
  ``,
  `  $('#sess-progress-bar').style.width = '100%';`,
  `  $('#sess-card-body').innerHTML = \``,
  `    <div style="padding:16px 0;text-align:center">`,
  `      <div style="font-size:44px;margin-bottom:8px">🎉</div>`,
  `      <h2 style="font-size:22px;font-weight:900;color:var(--text)">Session Complete!</h2>`,
  `      <div style="font-size:15px;font-weight:800;color:var(--green-deep);margin-top:6px">\${masteredCount} / \${total} Items Mastered</div>`,
  `      <div style="display:flex;justify-content:center;gap:12px;margin-top:14px;font-size:12.5px;color:var(--text-soft)">`,
  `        <span>⭐ Mastered: <b>\${masteredCount}</b></span>`,
  `        <span>↻ Need Practice: <b>\${practiceItems.length}</b></span>`,
  `      </div>`,
  `    </div>`,
  `  \`;`,
  ``,
  `  let btns = \`<button class="study-card-btn" id="btn-sess-done" style="padding:10px 24px;background:var(--green-btn);color:#fff;font-weight:800;border-radius:8px">✓ Back to Dashboard</button>\`;`,
  `  if (practiceItems.length > 0) {`,
  `    btns = \``,
  `      <button class="fc-btn" id="btn-sess-review-mistakes" style="border-color:var(--amber);color:var(--amber-text);padding:10px 18px">↻ Review Mistakes (\${practiceItems.length})</button>`,
  `      \${btns}`,
  `    \`;`,
  `  }`,
  ``,
  `  $('#sess-controls-bar').innerHTML = btns;`,
  `  $('#btn-sess-done').onclick = () => {`,
  `    $('#study-session-modal').style.display = 'none';`,
  `    if (source === 'vocabulary') renderVocabularyView();`,
  `    else if (source === 'grammar') renderGrammarView();`,
  `    else renderToday();`,
  `  };`,
  `  if (practiceItems.length > 0) {`,
  `    $('#btn-sess-review-mistakes').onclick = () => startStudySession(source, level, practiceItems);`,
  `  }`,
  `}`
];

// Insert Queue controllers right before `/* ---------------- Navigation / Router ---------------- */`
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('/* ---------------- Navigation / Router ---------------- */')) {
    console.log(`Inserting Queue and Session controllers before line ${i + 1}`);
    lines.splice(i, 0, ...queueControllerCode, ``);
    break;
  }
}

// 6. Hook up buttons in init
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Top-level Nav Clicks')) {
    console.log(`Adding Queue start listeners in init at line ${i + 1}`);
    const initQueueListeners = [
      `  // Global Queue button in Today view`,
      `  const btnGlobalQueue = $('#btn-start-global-queue');`,
      `  if (btnGlobalQueue) {`,
      `    btnGlobalQueue.onclick = () => startStudySession('global', 'all');`,
      `  }`,
      ``,
      `  // Session modal close button`,
      `  const btnCloseSess = $('#sess-btn-close');`,
      `  if (btnCloseSess) {`,
      `    btnCloseSess.onclick = () => { $('#study-session-modal').style.display = 'none'; };`,
      `  }`,
      ``,
      `  // Kanji View Mode clicks (including queue)`,
      `  $$('#kanji-view-mode button').forEach(b => {`,
      `    b.onclick = () => {`,
      `      const mode = b.dataset.mode;`,
      `      if (mode === 'queue') {`,
      `        startStudySession('kanji', currentLvlFilter || 'all');`,
      `      } else {`,
      `        switchKanjiMode(mode);`,
      `      }`,
      `    };`,
      `  });`,
      ``
    ];
    lines.splice(i, 0, ...initQueueListeners);
    break;
  }
}

// 7. Update Vocabulary and Grammar Queue Switchers to trigger startStudySession directly
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("function switchVocabMode(mode){")) {
    lines[i+4] = `  if (mode === 'queue') { startStudySession('vocabulary', currentVocabLvl || 'all'); return; }`;
  }
  if (lines[i].includes("function switchGrammarMode(mode){")) {
    lines[i+4] = `  if (mode === 'queue') { startStudySession('grammar', currentGrammarLvl || 'all'); return; }`;
  }
}

const finalContent = lines.join(isCRLF ? '\r\n' : '\n');
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully applied Step 3.4 Queue Architecture to index.html. Total lines now:', lines.length);
