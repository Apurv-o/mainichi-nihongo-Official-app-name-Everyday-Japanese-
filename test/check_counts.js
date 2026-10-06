const fs = require('fs');
['kanji', 'vocabulary', 'grammar'].forEach(cat => {
  ['n5', 'n4', 'n3', 'n2', 'n1'].forEach(lvl => {
    const p = `./data/${cat}/${lvl}.json`;
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      console.log(`${cat}/${lvl}: ${data.length}`);
    } else {
      console.log(`${cat}/${lvl}: missing`);
    }
  });
});
