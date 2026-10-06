const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.html');
let raw = fs.readFileSync(filePath, 'utf8');

// In String.prototype.replace, '$$$$' produces '$$'
const fixed = raw.replace(/(?<!\$)\$\((['"`][^'"`]+['"`][^)]*)\)\.forEach/g, '$$$$($1).forEach');

fs.writeFileSync(filePath, fixed, 'utf8');

// Verify
const remaining = fixed.match(/(?<!\$)\$\((['"`][^'"`]+['"`][^)]*)\)\.forEach/g) || [];
console.log('Remaining single dollar forEach calls:', remaining.length);
if (remaining.length) {
  console.log('Remaining:', remaining);
}
