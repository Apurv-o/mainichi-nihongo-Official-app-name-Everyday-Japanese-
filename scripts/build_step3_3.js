const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. ADD CSS FOR VOCABULARY & GRAMMAR SECTIONS
const vocabGrammarCSS = `
/* ============================================================
   STEP 3.3 — VOCABULARY & GRAMMAR LEARNING SECTIONS CSS
   ============================================================ */

/* Vocab & Grammar Grids */
.vocab-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  margin-top: 14px;
}
.grammar-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 14px;
}

/* Vocab Card */
.vocab-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  animation: cardEntrance 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--item-idx, 0) * 10ms);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}
.vocab-card:hover {
  transform: translateY(-3px);
  border-color: var(--green);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.vocab-card:active {
  transform: scale(0.97);
}
.vocab-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vocab-word {
  font-family: var(--font-jp);
  font-size: 22px;
  font-weight: 900;
  color: var(--text);
  line-height: 1.2;
}
.vocab-reading {
  font-size: 13px;
  font-weight: 700;
  color: var(--green-deep);
  margin-top: 2px;
}
.vocab-romaji {
  font-size: 11px;
  color: var(--text-soft);
  font-style: italic;
}
.vocab-meaning {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-top: 4px;
  line-height: 1.35;
}
.vocab-pos-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  background: var(--surface2);
  color: var(--text-soft);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
  align-self: flex-start;
}
.vocab-card.starred::after, .grammar-card.starred::after {
  content: "★";
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 14px;
  color: var(--amber);
  animation: starPulse 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Grammar Card */
.grammar-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 18px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  animation: cardEntrance 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--item-idx, 0) * 10ms);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}
.grammar-card:hover {
  transform: translateY(-3px);
  border-color: var(--pink);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.grammar-card:active {
  transform: scale(0.97);
}
.grammar-pattern {
  font-family: var(--font-jp);
  font-size: 16px;
  font-weight: 900;
  color: var(--text);
  line-height: 1.3;
}
.grammar-meaning {
  font-size: 13px;
  font-weight: 700;
  color: var(--pink-text);
  margin-top: 2px;
}
.grammar-explanation {
  font-size: 12px;
  color: var(--text-soft);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.grammar-formation-preview {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-faint);
  background: var(--surface2);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px dashed var(--border);
}

/* Progress summary strip */
.lib-progress-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 14px;
}
.lib-progress-bar-wrap {
  flex: 1;
  min-width: 140px;
  height: 8px;
  background: var(--border);
  border-radius: 999px;
  overflow: hidden;
}
.lib-progress-bar-fill {
  height: 100%;
  background: var(--green);
  border-radius: 999px;
  transition: width 0.4s ease;
}
.lib-progress-bar-fill.pink {
  background: var(--pink);
}

/* Detail Modal Styles */
.detail-modal-word {
  font-family: var(--font-jp);
  font-size: 34px;
  font-weight: 900;
  color: var(--text);
  line-height: 1.15;
}
.detail-modal-reading {
  font-size: 18px;
  font-weight: 800;
  color: var(--green-deep);
  margin-top: 4px;
}
.detail-modal-section {
  margin-top: 14px;
  padding: 10px 14px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.detail-modal-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
`;

// Insert CSS before </style>
html = html.replace('</style>', vocabGrammarCSS + '\n</style>');

// 2. UPDATE SIDEBAR WITH VOCABULARY & GRAMMAR LINKS
const oldNav = `<nav class="nav-menu" aria-label="Main Navigation">
        <button class="nav-item active" data-view="today"><svg class="ic"><use href="#i-home"/></svg>Today</button>
        <button class="nav-item" data-view="history"><svg class="ic"><use href="#i-cal"/></svg>History</button>
        <button class="nav-item" data-view="progress"><svg class="ic"><use href="#i-chart"/></svg>Progress</button>
        
        <!-- Library with Submenu -->
        <button class="nav-item" id="nav-library-btn" data-view="kanji">
          <svg class="ic"><use href="#i-book"/></svg>Library
          <span class="nav-arrow">▼</span>
        </button>
        <div class="nav-submenu" id="library-submenu">
          <button class="subnav-item active" data-lib="flashcard">🎴 Flashcards</button>
          <button class="subnav-item" data-lib="grid">📑 All Kanji <span id="sidebar-kanji-count"></span></button>
        </div>

        <button class="nav-item" data-view="goals"><svg class="ic"><use href="#i-target"/></svg>Goals</button>
        <button class="nav-item" data-view="notes"><svg class="ic"><use href="#i-notes"/></svg>Notes</button>
        <button class="nav-item" data-view="settings"><svg class="ic"><use href="#i-sliders"/></svg>Settings</button>
      </nav>`;

const newNav = `<nav class="nav-menu" aria-label="Main Navigation">
        <button class="nav-item active" data-view="today"><svg class="ic"><use href="#i-home"/></svg>Today</button>
        <button class="nav-item" data-view="vocabulary"><svg class="ic"><use href="#i-book"/></svg>Vocabulary</button>
        <button class="nav-item" data-view="grammar"><svg class="ic"><use href="#i-notes"/></svg>Grammar</button>
        
        <!-- Library with Submenu -->
        <button class="nav-item" id="nav-library-btn" data-view="kanji">
          <svg class="ic"><use href="#i-torii"/></svg>Kanji Library
          <span class="nav-arrow">▼</span>
        </button>
        <div class="nav-submenu" id="library-submenu">
          <button class="subnav-item active" data-lib="flashcard">🎴 Flashcards</button>
          <button class="subnav-item" data-lib="grid">📑 All Kanji <span id="sidebar-kanji-count"></span></button>
        </div>

        <button class="nav-item" data-view="history"><svg class="ic"><use href="#i-cal"/></svg>History</button>
        <button class="nav-item" data-view="progress"><svg class="ic"><use href="#i-chart"/></svg>Progress</button>
        <button class="nav-item" data-view="goals"><svg class="ic"><use href="#i-target"/></svg>Goals</button>
        <button class="nav-item" data-view="notes"><svg class="ic"><use href="#i-notes"/></svg>Notes</button>
        <button class="nav-item" data-view="settings"><svg class="ic"><use href="#i-sliders"/></svg>Settings</button>
      </nav>`;

html = html.replace(oldNav, newNav);

// 3. UPDATE TODAY ACTIONS BUTTONS TO NAVIGATE TO VOCABULARY & GRAMMAR
html = html.replace(
  '<button class="study-card-btn" data-step-act="plus" data-step-key="words">\n                  Start Learning →\n                </button>',
  '<a href="#/vocabulary" class="study-card-btn" style="text-decoration:none">\n                  Start Learning →\n                </a>'
);

html = html.replace(
  '<button class="study-card-btn" data-step-act="plus" data-step-key="grammarPages">\n                  Study Grammar →\n                </button>',
  '<a href="#/grammar" class="study-card-btn" style="text-decoration:none">\n                  Study Grammar →\n                </a>'
);

// 4. ADD HTML FOR #view-vocabulary AND #view-grammar
const viewsHTML = `
      <!-- ================= VOCABULARY LIBRARY VIEW ================= -->
      <section class="view" id="view-vocabulary">
        <div class="panel-head" style="flex-wrap:wrap;gap:10px;margin-bottom:14px">
          <div>
            <h2 style="font-size:20px;font-weight:900;color:var(--text)">📖 Vocabulary Library</h2>
            <p style="font-size:12.5px;color:var(--text-soft)">Build practical Japanese vocabulary from N5 to N1.</p>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <div class="seg" id="vocab-lvl-filter">
              <button data-lvl="all" class="active">All</button>
              <button data-lvl="N5">N5</button>
              <button data-lvl="N4">N4</button>
              <button data-lvl="N3">N3</button>
              <button data-lvl="N2">N2</button>
              <button data-lvl="N1">N1</button>
            </div>
            <div class="seg" id="vocab-view-mode">
              <button data-mode="grid" class="active">Browse Cards</button>
              <button data-mode="flashcard">🎴 Flashcards</button>
              <button data-mode="queue">🌸 Today's Queue</button>
            </div>
          </div>
        </div>

        <!-- Progress and Filter Bar -->
        <div class="lib-progress-strip">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:13px;font-weight:800;color:var(--text)" id="vocab-progress-text">0 / 0 mastered (0%)</span>
            <div class="lib-progress-bar-wrap" style="width:160px">
              <div class="lib-progress-bar-fill" id="vocab-progress-fill" style="width:0%"></div>
            </div>
          </div>

          <div class="seg" id="vocab-status-filter">
            <button data-status="all" class="active">All Status</button>
            <button data-status="starred">⭐ Mastered</button>
            <button data-status="unstarred">Need Practice</button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-box" style="max-width:100%;margin-bottom:14px">
          <svg class="ic" style="width:15px;height:15px"><use href="#i-search"/></svg>
          <input type="text" id="vocab-search-input" placeholder="Search by Japanese, reading, romaji, or meaning...">
        </div>

        <!-- Grid Cards Mode -->
        <div id="vb-grid-mode">
          <div class="vocab-grid-list" id="vocab-grid-list"></div>
        </div>

        <!-- Flashcard Mode -->
        <div id="vb-flashcard-mode" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-soft)">
            <span>Card <b id="vb-fc-current-idx" style="color:var(--text)">1</b> of <span id="vb-fc-total-cards">--</span></span>
            <span>⭐ Mastered: <b id="vb-fc-mastered-count" style="color:var(--amber)">0</b></span>
          </div>

          <div class="fc-wrap">
            <div class="flashcard" id="vocab-flashcard" role="button" tabindex="0">
              <div class="fc-side fc-front">
                <span class="fc-badge n5" id="vb-fc-lvl-badge">JLPT N5</span>
                <div class="fc-kanji" id="vb-fc-word" style="font-size:52px">友達</div>
                <div class="vocab-pos-tag" id="vb-fc-pos" style="margin-top:6px">noun</div>
                <p style="font-size:11.5px;color:var(--text-faint);margin-top:12px">👆 Click or Space to Flip</p>
              </div>
              <div class="fc-side fc-back">
                <span class="fc-badge" style="background:var(--surface2);color:var(--text)">Reading & Meaning</span>
                <div class="fc-reading" id="vb-fc-reading">ともだち</div>
                <div class="fc-romaji" id="vb-fc-romaji">tomodachi</div>
                <div class="fc-meaning" id="vb-fc-meaning">friend</div>
                <div class="fc-sentence" id="vb-fc-sentence">
                  <div class="fc-s-jp" id="vb-fc-s-jp">友達と映画を見に行きました。</div>
                  <div class="fc-s-hira" id="vb-fc-s-hira">ともだちと えいがを みに いきました。</div>
                  <div class="fc-s-en" id="vb-fc-s-en">I went to watch a movie with a friend.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="fc-controls">
            <button class="fc-btn" id="vb-fc-prev">⟨ Previous</button>
            <button class="fc-btn" id="vb-fc-flip">🔄 Flip</button>
            <button class="fc-btn" id="vb-fc-next">Next ⟩</button>
            <button class="fc-btn" id="vb-fc-shuffle">🔀 Shuffle</button>
            <button class="fc-btn star" id="vb-fc-star">⭐ <span id="vb-fc-star-label">Mark Mastered</span></button>
            <button class="fc-btn" id="vb-fc-log" style="background:var(--green-soft);color:var(--green-deep);border-color:var(--green)">+1 Log to Today</button>
          </div>
        </div>

        <!-- Today's Queue Mode -->
        <div id="vb-queue-mode" style="display:none">
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;margin-top:8px">
            <h3 style="font-size:16px;font-weight:900;color:var(--text);margin-bottom:4px">🌸 Today's Focused Queue (10 Words)</h3>
            <p style="font-size:12px;color:var(--text-soft);margin-bottom:14px">Prioritizing unmastered vocabulary and review items for daily practice.</p>
            <div class="vocab-grid-list" id="vocab-queue-list"></div>
          </div>
        </div>
      </section>

      <!-- ================= GRAMMAR LIBRARY VIEW ================= -->
      <section class="view" id="view-grammar">
        <div class="panel-head" style="flex-wrap:wrap;gap:10px;margin-bottom:14px">
          <div>
            <h2 style="font-size:20px;font-weight:900;color:var(--text)">📝 Grammar Library</h2>
            <p style="font-size:12.5px;color:var(--text-soft)">Understand Japanese grammar from N5 to N1.</p>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <div class="seg" id="grammar-lvl-filter">
              <button data-lvl="all" class="active">All</button>
              <button data-lvl="N5">N5</button>
              <button data-lvl="N4">N4</button>
              <button data-lvl="N3">N3</button>
              <button data-lvl="N2">N2</button>
              <button data-lvl="N1">N1</button>
            </div>
            <div class="seg" id="grammar-status-filter">
              <button data-status="all" class="active">All Status</button>
              <button data-status="starred">⭐ Mastered</button>
              <button data-status="unstarred">Need Practice</button>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="lib-progress-strip">
          <div style="display:flex;align-items:center;gap:10px;width:100%">
            <span style="font-size:13px;font-weight:800;color:var(--text)" id="grammar-progress-text">0 / 0 mastered (0%)</span>
            <div class="lib-progress-bar-wrap">
              <div class="lib-progress-bar-fill pink" id="grammar-progress-fill" style="width:0%"></div>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-box" style="max-width:100%;margin-bottom:14px">
          <svg class="ic" style="width:15px;height:15px"><use href="#i-search"/></svg>
          <input type="text" id="grammar-search-input" placeholder="Search by grammar pattern, meaning, or explanation...">
        </div>

        <!-- Grid Cards Mode -->
        <div id="gm-grid-mode">
          <div class="grammar-grid-list" id="grammar-grid-list"></div>
        </div>
      </section>
`;

// Insert viewsHTML right before </main>
html = html.replace('</main>', viewsHTML + '\n    </main>');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully inserted Vocabulary and Grammar HTML and CSS into index.html');
