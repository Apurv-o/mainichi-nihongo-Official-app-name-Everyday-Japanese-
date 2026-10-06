const fs = require('fs');
const path = require('path');

// Load existing N5 and N4 to ensure zero cross-contamination
const n5 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n5.json'), 'utf8'));
const n4 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n4.json'), 'utf8'));

const existingChars = new Set([...n5.map(x => x.k), ...n4.map(x => x.k)]);
console.log(`Preserved ${existingChars.size} existing N5 & N4 kanji.`);

// We will load or construct comprehensive lists for N3, N2, N1
