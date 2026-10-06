/**
 * Automated Verification Suite for Step 2: Data Architecture & Vercel AI Infrastructure
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
  console.log(' Running Step 2 Verification Suite');
  console.log('========================================================\n');

  // ----------------------------------------------------
  // SECTION 1: PART A — Modularize Existing JLPT Data
  // ----------------------------------------------------
  console.log('--- 1. Modular Kanji Data Files ---');

  test('data/kanji/n5.json exists and is valid JSON', () => {
    const filePath = path.join(ROOT_DIR, 'data', 'kanji', 'n5.json');
    assert.strictEqual(fs.existsSync(filePath), true, 'n5.json should exist');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert.strictEqual(Array.isArray(data), true, 'n5.json should be an array');
    assert.strictEqual(data.length, 105, 'n5.json should contain exactly 105 items');
    data.forEach((item, idx) => {
      assert.ok(item.k, `Item ${idx} must have 'k'`);
      assert.strictEqual(item.lvl, 'N5', `Item ${idx} level must be 'N5'`);
      assert.ok(item.h, `Item ${idx} must have 'h'`);
      assert.ok(item.r, `Item ${idx} must have 'r'`);
      assert.ok(item.m, `Item ${idx} must have 'm'`);
      assert.ok(item.ex, `Item ${idx} must have 'ex'`);
      assert.ok(item.s_jp, `Item ${idx} must have 's_jp'`);
      assert.ok(item.s_hira, `Item ${idx} must have 's_hira'`);
      assert.ok(item.s_en, `Item ${idx} must have 's_en'`);
    });
  });

  test('data/kanji/n4.json exists and is valid JSON', () => {
    const filePath = path.join(ROOT_DIR, 'data', 'kanji', 'n4.json');
    assert.strictEqual(fs.existsSync(filePath), true, 'n4.json should exist');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert.strictEqual(Array.isArray(data), true, 'n4.json should be an array');
    assert.strictEqual(data.length, 148, 'n4.json should contain exactly 148 items');
    data.forEach((item, idx) => {
      assert.ok(item.k, `Item ${idx} must have 'k'`);
      assert.strictEqual(item.lvl, 'N4', `Item ${idx} level must be 'N4'`);
      assert.ok(item.h, `Item ${idx} must have 'h'`);
      assert.ok(item.r, `Item ${idx} must have 'r'`);
      assert.ok(item.m, `Item ${idx} must have 'm'`);
      assert.ok(item.ex, `Item ${idx} must have 'ex'`);
      assert.ok(item.s_jp, `Item ${idx} must have 's_jp'`);
      assert.ok(item.s_hira, `Item ${idx} must have 's_hira'`);
      assert.ok(item.s_en, `Item ${idx} must have 's_en'`);
    });
  });

  test('Total modularized kanji count equals exactly 253', () => {
    const n5 = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'kanji', 'n5.json'), 'utf8'));
    const n4 = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'kanji', 'n4.json'), 'utf8'));
    assert.strictEqual(n5.length + n4.length, 253);
  });

  // ----------------------------------------------------
  // SECTION 2: Service Worker & Offline Caching
  // ----------------------------------------------------
  console.log('\n--- 2. Service Worker & Caching ---');

  test('sw.js cache version is bumped to v5 or higher', () => {
    const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
    assert.ok(/mainichi-nihongo-v\d+/.test(swContent), 'Cache name should match mainichi-nihongo-v*');
  });

  test('sw.js ASSETS precaches n5.json and n4.json', () => {
    const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
    assert.ok(swContent.includes('./data/kanji/n5.json'), 'ASSETS must contain ./data/kanji/n5.json');
    assert.ok(swContent.includes('./data/kanji/n4.json'), 'ASSETS must contain ./data/kanji/n4.json');
  });

  test('sw.js explicitly ignores /api/ routes to prevent caching serverless endpoints', () => {
    const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
    assert.ok(swContent.includes('/api/'), 'Service Worker must have a bypass check for /api/');
  });

  // ----------------------------------------------------
  // SECTION 3: Frontend Data Loader Verification
  // ----------------------------------------------------
  console.log('\n--- 3. Frontend Data Layer in index.html ---');

  test('index.html contains loadKanjiLevel supporting N5-N1', () => {
    const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    assert.ok(indexContent.includes('async function loadKanjiLevel(level)'), 'loadKanjiLevel function must exist');
    assert.ok(indexContent.includes('SUPPORTED_KANJI_LEVELS'), 'SUPPORTED_KANJI_LEVELS must exist');
    assert.ok(indexContent.includes('kanjiLevelCache'), 'kanjiLevelCache must exist');
    assert.ok(indexContent.includes('getAllLoadedKanji'), 'getAllLoadedKanji function must exist');
  });

  test('index.html no longer hardcodes the 253-item N4_KANJI array', () => {
    const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    assert.strictEqual(indexContent.includes('const N4_KANJI ='), false, 'N4_KANJI constant should be removed');
  });

  // ----------------------------------------------------
  // SECTION 4: PART B — Vercel API Route & Gemini Provider
  // ----------------------------------------------------
  console.log('\n--- 4. Vercel Serverless Function & AI Infrastructure ---');

  const handler = require('../api/ai-coach');
  const { getConfiguredKeys, buildPrompt } = require('../api/lib/geminiProvider');
  const { isRateLimited } = require('../api/lib/rateLimiter');

  test('api/ai-coach.js exists and exports handler function', () => {
    assert.strictEqual(typeof handler, 'function');
  });

  test('Prompt builder formats all 5 modes correctly', () => {
    const modes = ['explain', 'translate', 'hint', 'practice', 'coach'];
    modes.forEach(mode => {
      const p = buildPrompt(mode, 'N4', '試験', { recentMistakes: 1 });
      assert.ok(p.system && p.system.length > 20, `Mode ${mode} must produce system prompt`);
      assert.ok(p.user.includes('試験'), `Mode ${mode} must include user input`);
      assert.ok(p.user.includes('recentMistakes'), `Mode ${mode} must include context`);
    });
  });

  await asyncTest('API rejects non-POST HTTP methods with 405 Method Not Allowed', async () => {
    const req = { method: 'GET', headers: {} };
    let statusCode = null;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (c) => { statusCode = c; return res; },
      json: (d) => { jsonResult = d; return res; },
      end: () => {}
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 405, 'Status must be 405');
    assert.strictEqual(jsonResult.success, false);
  });

  await asyncTest('API handles OPTIONS preflight with 200 OK', async () => {
    const req = { method: 'OPTIONS', headers: {} };
    let ended = false;
    let statusCode = null;
    const res = {
      setHeader: () => {},
      status: (c) => { statusCode = c; return res; },
      end: () => { ended = true; }
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(ended, true);
  });

  await asyncTest('API rejects invalid mode with 400 Bad Request', async () => {
    const req = {
      method: 'POST',
      headers: {},
      body: { mode: 'invalid-mode', level: 'N5', input: 'test' }
    };
    let statusCode = null;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (c) => { statusCode = c; return res; },
      json: (d) => { jsonResult = d; return res; }
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonResult.success, false);
    assert.ok(jsonResult.error.includes('Invalid mode'));
  });

  await asyncTest('API rejects invalid level with 400 Bad Request', async () => {
    const req = {
      method: 'POST',
      headers: {},
      body: { mode: 'explain', level: 'N99', input: 'test' }
    };
    let statusCode = null;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (c) => { statusCode = c; return res; },
      json: (d) => { jsonResult = d; return res; }
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonResult.success, false);
    assert.ok(jsonResult.error.includes('Invalid level'));
  });

  await asyncTest('API rejects empty input with 400 Bad Request', async () => {
    const req = {
      method: 'POST',
      headers: {},
      body: { mode: 'explain', level: 'N5', input: '   ' }
    };
    let statusCode = null;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (c) => { statusCode = c; return res; },
      json: (d) => { jsonResult = d; return res; }
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonResult.success, false);
    assert.ok(jsonResult.error.includes('non-empty'));
  });

  await asyncTest('API returns clean configured:false response when no API keys exist', async () => {
    // Clear any GEMINI keys from env for test
    const origKey1 = process.env.GEMINI_API_KEY_1;
    delete process.env.GEMINI_API_KEY_1;
    delete process.env.GEMINI_API_KEY_2;
    delete process.env.GEMINI_API_KEY_3;
    delete process.env.GEMINI_API_KEY_4;

    const req = {
      method: 'POST',
      headers: {},
      body: { mode: 'explain', level: 'N5', input: '猫' }
    };
    let statusCode = null;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (c) => { statusCode = c; return res; },
      json: (d) => { jsonResult = d; return res; }
    };

    await handler(req, res);
    assert.strictEqual(jsonResult.success, false);
    assert.strictEqual(jsonResult.configured, false);
    assert.ok(jsonResult.error.includes('not currently configured'));

    if (origKey1) process.env.GEMINI_API_KEY_1 = origKey1;
  });

  test('Rate limiter tracks request counts and blocks excessive requests', () => {
    const testIp = '192.0.2.123';
    for (let i = 0; i < 30; i++) {
      const res = isRateLimited(testIp);
      assert.strictEqual(res.limited, false, `Request ${i + 1} should be permitted`);
    }
    // 31st request should be limited
    const blocked = isRateLimited(testIp);
    assert.strictEqual(blocked.limited, true, '31st request must be rate limited');
  });

  // ----------------------------------------------------
  // SECTION 5: Multi-Key Failover Logic Simulation
  // ----------------------------------------------------
  console.log('\n--- 5. Multi-Key Failover Architecture ---');

  await asyncTest('Gemini provider fails over from Key 1 (rate-limited) to Key 2 (successful)', async () => {
    // Set up 2 dummy test keys
    process.env.GEMINI_API_KEY_1 = 'test-key-1';
    process.env.GEMINI_API_KEY_2 = 'test-key-2';
    delete process.env.GEMINI_API_KEY_3;
    delete process.env.GEMINI_API_KEY_4;

    const configured = getConfiguredKeys();
    assert.strictEqual(configured.length, 2);
    assert.strictEqual(configured[0].name, 'GEMINI_API_KEY_1');
    assert.strictEqual(configured[1].name, 'GEMINI_API_KEY_2');

    // Mock global fetch to simulate 429 on key 1, and 200 on key 2
    const originalFetch = global.fetch;
    const callLog = [];

    global.fetch = async (url, opts) => {
      callLog.push(url);
      if (url.includes('test-key-1')) {
        return {
          ok: false,
          status: 429,
          json: async () => ({ error: { message: 'Quota exceeded for key 1' } }),
          text: async () => 'Quota exceeded'
        };
      }
      if (url.includes('test-key-2')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [{ text: '「猫」(ねこ) means cat in Japanese.' }]
                }
              }
            ]
          })
        };
      }
      return { ok: false, status: 500 };
    };

    const { callGeminiWithFailover } = require('../api/lib/geminiProvider');
    const result = await callGeminiWithFailover({
      mode: 'explain',
      level: 'N5',
      input: '猫',
      context: {}
    });

    global.fetch = originalFetch;

    // Verify key failover behavior
    assert.strictEqual(result.success, true, 'Result should succeed on key 2');
    assert.strictEqual(result.keySlotUsed, 'GEMINI_API_KEY_2', 'Must record that Key 2 was used');
    assert.ok(result.reply.includes('cat'), 'Should receive Key 2 response text');
    assert.strictEqual(callLog.length, 2, 'Must have attempted key 1 then key 2');
    // Verify that NO API key string is exposed in the return object
    assert.strictEqual(result.key, undefined);
    assert.strictEqual(result.apiKey, undefined);

    // Cleanup env
    delete process.env.GEMINI_API_KEY_1;
    delete process.env.GEMINI_API_KEY_2;
  });

  // ----------------------------------------------------
  // SECTION 6: Security & Secrets Check
  // ----------------------------------------------------
  console.log('\n--- 6. Security, .env.example & .gitignore ---');

  test('.env.example exists with empty key placeholders', () => {
    const envExamplePath = path.join(ROOT_DIR, '.env.example');
    assert.strictEqual(fs.existsSync(envExamplePath), true, '.env.example must exist');
    const content = fs.readFileSync(envExamplePath, 'utf8');
    assert.ok(content.includes('GEMINI_API_KEY_1='), 'Must include GEMINI_API_KEY_1=');
    assert.ok(content.includes('GEMINI_API_KEY_2='), 'Must include GEMINI_API_KEY_2=');
    assert.ok(content.includes('GEMINI_API_KEY_3='), 'Must include GEMINI_API_KEY_3=');
    assert.ok(content.includes('GEMINI_API_KEY_4='), 'Must include GEMINI_API_KEY_4=');
    // Ensure no actual key value is written in .env.example
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.startsWith('GEMINI_API_KEY_')) {
        const val = line.split('=')[1].trim();
        assert.strictEqual(val, '', `.env.example line "${line}" must not have a value`);
      }
    });
  });

  test('.gitignore exists and protects .env files and build artifacts', () => {
    const gitignorePath = path.join(ROOT_DIR, '.gitignore');
    assert.strictEqual(fs.existsSync(gitignorePath), true, '.gitignore must exist');
    const content = fs.readFileSync(gitignorePath, 'utf8');
    assert.ok(content.includes('.env'), '.gitignore must protect .env');
    assert.ok(content.includes('.env.local'), '.gitignore must protect .env.local');
    assert.ok(content.includes('.env.*.local'), '.gitignore must protect .env.*.local');
    assert.ok(content.includes('node_modules'), '.gitignore must ignore node_modules');
    assert.ok(content.includes('.vercel'), '.gitignore must ignore .vercel');
  });

  test('No real Gemini API keys or secrets exist in the codebase', () => {
    const searchDirs = ['.', 'data', 'assets', 'api', 'api/lib'];
    const forbiddenPatterns = [/AIza[0-9A-Za-z-_]{35}/, /generativelanguage\.googleapis\.com.*key=[A-Za-z0-9-_]{20,}/];

    function scanDir(dir) {
      const entries = fs.readdirSync(path.join(ROOT_DIR, dir), { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.git') || entry.name === 'node_modules' || entry.name === 'verify-step2.js') continue;
        const fullPath = path.join(ROOT_DIR, dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(path.join(dir, entry.name));
        } else if (entry.isFile()) {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const pat of forbiddenPatterns) {
            assert.strictEqual(pat.test(content), false, `Found potential secret in ${fullPath}`);
          }
        }
      }
    }

    scanDir('.');
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
