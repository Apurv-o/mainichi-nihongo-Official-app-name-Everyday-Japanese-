const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /(?:kanji|cards|deck|253)/gi;
let match;
const lines = html.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('253') || line.toLowerCase().includes('all kanji')) {
    console.log((idx + 1) + ': ' + line.trim());
  }
});
