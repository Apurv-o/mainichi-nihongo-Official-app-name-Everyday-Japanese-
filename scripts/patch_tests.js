const fs = require('fs');
const path = require('path');

// Update verify-step3.js
const p3 = path.join(__dirname, '../test/verify-step3.js');
let c3 = fs.readFileSync(p3, 'utf8');
c3 = c3.replace(
  "assert.ok(swContent.includes('mainichi-nihongo-v6') || swContent.includes('mainichi-nihongo-v7'), 'Cache name should be mainichi-nihongo-v6 or higher');",
  "assert.ok(/mainichi-nihongo-v[6789]/.test(swContent), 'Cache name should be mainichi-nihongo-v6 or higher');"
);
fs.writeFileSync(p3, c3, 'utf8');

// Update verify-step3-1.js
const p31 = path.join(__dirname, '../test/verify-step3-1.js');
let c31 = fs.readFileSync(p31, 'utf8');
c31 = c31.replace(
  "assert(swContent.includes('mainichi-nihongo-v7'), 'sw.js cache version not updated to v7');",
  "assert(/mainichi-nihongo-v[789]/.test(swContent), 'sw.js cache version should be v7 or higher');"
);
fs.writeFileSync(p31, c31, 'utf8');

console.log('Updated legacy test regexes.');
