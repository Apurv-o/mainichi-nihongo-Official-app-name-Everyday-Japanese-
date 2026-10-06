const fs = require('fs');
const path = require('path');

const n5 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n5.json'), 'utf8'));
const n4 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n4.json'), 'utf8'));

const allSeen = new Set([...n5.map(x => x.k), ...n4.map(x => x.k)]);

function compileLevel(levelName, kanjiArray, outputPath) {
  const result = [];
  const levelSeen = new Set();
  
  for (const item of kanjiArray) {
    const k = item[0];
    if (allSeen.has(k)) continue;
    if (levelSeen.has(k)) continue;
    
    levelSeen.add(k);
    allSeen.add(k);
    
    result.push({
      k: item[0],
      lvl: levelName,
      h: item[1],
      r: item[2],
      m: item[3],
      ex: item[4],
      s_jp: item[5],
      s_hira: item[6],
      s_en: item[7],
      source: "JLPT-aligned Study Reference"
    });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`[${levelName}] Successfully written ${result.length} unique records.`);
  return result.length;
}

// Export compile helper
module.exports = { compileLevel, allSeen };
