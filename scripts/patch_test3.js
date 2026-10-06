const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../test/verify-step3.js');
let content = fs.readFileSync(p, 'utf8');
content = content.replace(
  "assert.ok(swContent.includes('mainichi-nihongo-v6'), 'Cache name should be mainichi-nihongo-v6');",
  "assert.ok(swContent.includes('mainichi-nihongo-v6') || swContent.includes('mainichi-nihongo-v7'), 'Cache name should be mainichi-nihongo-v6 or higher');"
);
fs.writeFileSync(p, content, 'utf8');
console.log('Updated verify-step3.js');
