const fs = require('fs');
const path = require('path');

function dedupeKanjiFile(filePath, level, replacementList) {
  const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seen = new Set();
  const deduped = [];
  const duplicates = [];

  for (const item of list) {
    if (seen.has(item.k)) {
      duplicates.push(item.k);
    } else {
      seen.add(item.k);
      deduped.push(item);
    }
  }

  console.log(`[${level}] Found ${duplicates.length} duplicates:`, duplicates);

  for (const rep of replacementList) {
    if (deduped.length < 100 && !seen.has(rep.k)) {
      seen.add(rep.k);
      deduped.push(rep);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(deduped, null, 2), 'utf8');
  console.log(`[${level}] Updated file with ${deduped.length} unique kanji.`);
}

const n2Replacements = [
  { k: "標", lvl: "N2", h: "ヒョウ / しるし", r: "hyou / shirushi", m: "signpost, mark, target", ex: "目標 (mokuhyou - goal)", s_jp: "目標に向かって努力する。", s_hira: "もくひょうにむかってどりょくする。", s_en: "Work hard toward your goal.", source: "JLPT-aligned Study Reference" },
  { k: "創", lvl: "N2", h: "ソウ / つく・る", r: "sou / tsuku-ru", m: "create, originate, establish", ex: "創造 (souzou - creation)", s_jp: "新しい文化を創造する。", s_hira: "あたらしいぶんかをそうぞうする。", s_en: "Create a new culture.", source: "JLPT-aligned Study Reference" },
  { k: "訪", lvl: "N2", h: "ホウ / おとず・れる、たず・ねる", r: "hou / otozu-reru, tazu-neru", m: "visit, call on", ex: "訪問 (houmon - visit)", s_jp: "友人の家を訪問した。", s_hira: "ゆうじんのいえをほうもんした。", s_en: "Visited a friend's house.", source: "JLPT-aligned Study Reference" }
];

const n1Replacements = [
  { k: "慶", lvl: "N1", h: "ケイ / よろこ・び", r: "kei / yoroko-bi", m: "jubilation, rejoice, congratulation", ex: "慶事 (keiji - auspicious event)", s_jp: "心からお慶び申し上げます。", s_hira: "こころからおよろこびもうしあげます。", s_en: "I offer my heartfelt congratulations.", source: "JLPT-aligned Study Reference" },
  { k: "蔑", lvl: "N1", h: "ベツ / さげす・む", r: "betsu / sagesu-mu", m: "scorn, despise, contempt", ex: "軽蔑 (keibetsu - contempt)", s_jp: "人を軽蔑してはいけない。", s_hira: "ひとをけいべつしてはいけない。", s_en: "You must not despise others.", source: "JLPT-aligned Study Reference" },
  { k: "遵", lvl: "N1", h: "ジュン", r: "jun", m: "abide by, follow, obey", ex: "遵守 (junshu - compliance)", s_jp: "法令を遵守する。", s_hira: "ほうれいをじゅんしゅする。", s_en: "Comply with laws and regulations.", source: "JLPT-aligned Study Reference" }
];

dedupeKanjiFile(path.join(__dirname, '../data/kanji/n2.json'), 'N2', n2Replacements);
dedupeKanjiFile(path.join(__dirname, '../data/kanji/n1.json'), 'N1', n1Replacements);
