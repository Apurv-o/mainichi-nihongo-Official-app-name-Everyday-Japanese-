const fs = require('fs');
const path = require('path');

const n1Vocab = [
  { word: "概念", reading: "がいねん", romaji: "gainen", meaning: "concept, general idea", partOfSpeech: "noun", tags: ["philosophy", "academic"], jp: "自由という概念について深く考察する。", hira: "じゆうというがいねんについてふかくこうさつする。", en: "Think deeply about the concept of freedom." },
  { word: "妥当", reading: "だとう", romaji: "datou", meaning: "valid, appropriate, proper", partOfSpeech: "na-adjective", tags: ["academic", "law"], jp: "その主張には妥当性がある。", hira: "そのしゅちょうにはだとうせいがある。", en: "There is validity to that claim." },
  { word: "矛盾", reading: "むじゅん", romaji: "mujun", meaning: "contradiction, inconsistency", partOfSpeech: "noun", tags: ["logic", "academic"], jp: "彼の言動には明らかな矛盾が見られる。", hira: "かれのげんどうにはあきらかなむじゅんがみられる。", en: "Clear contradiction can be seen in his words and actions." },
  { word: "欺瞞", reading: "ぎまん", romaji: "giman", meaning: "deception, deceit", partOfSpeech: "noun", tags: ["society"], jp: "欺瞞に満ちた説明に批判が集まる。", hira: "ぎまんにみちたせつめいにひはんがあつまる。", en: "Criticism centers on explanations filled with deceit." },
  { word: "懸念", reading: "けねん", romaji: "kenen", meaning: "concern, apprehension, fear", partOfSpeech: "noun", tags: ["politics", "economy"], jp: "景気の後退が強く懸念されている。", hira: "けいきのこうたいがつよくけねんされている。", en: "Economic recession is strongly feared." },
  { word: "脆弱", reading: "ぜいじゃく", romaji: "zeijaku", meaning: "vulnerable, fragile, weak", partOfSpeech: "na-adjective", tags: ["technology", "society"], jp: "システムのセキュリティ上の脆弱性を突かれる。", hira: "しすてむのせきゅりてぃじょうのぜいじゃくせいを突かれる。", en: "The security vulnerability of the system was exploited." },
  { word: "顕著", reading: "けんちょ", romaji: "kencho", meaning: "remarkable, prominent, striking", partOfSpeech: "na-adjective", tags: ["academic", "society"], jp: "温暖化による気温の上昇が顕著に現れる。", hira: "おんだんかによるきおんのじょうしょうがけんちょにあらわれる。", en: "The rise in temperature due to global warming is prominently manifest." },
  { word: "模索", reading: "もさく", romaji: "mosaku", meaning: "groping, exploring ways", partOfSpeech: "noun", tags: ["business", "growth"], jp: "解決に向けて新たな道を模索する。", hira: "かいけつにむけてあらたなみちをもさくする。", en: "Explore new paths toward a solution." },
  { word: "瓦解", reading: "がかい", romaji: "gakai", meaning: "collapse, downfall", partOfSpeech: "noun", tags: ["history", "society"], jp: "長年続いた独裁体制が一夜にして瓦解した。", hira: "ながねんつづいただいさいたいせいがひとよにしてがかいした。", en: "The long-standing dictatorship collapsed overnight." },
  { word: "乖離", reading: "かいり", romaji: "kairi", meaning: "divergence, alienation, gap", partOfSpeech: "noun", tags: ["economy", "society"], jp: "理想と現実の乖離に苦しむ。", hira: "りそうとげんじつのかいりにくるしむ。", en: "Suffering from the divergence between ideal and reality." },
  { word: "卓越", reading: "たくえつ", romaji: "takuetsu", meaning: "excellence, preeminence", partOfSpeech: "noun", tags: ["skill", "arts"], jp: "卓越した技量を持つ名工。", hira: "たくえつしたぎりょうをもつめいこう。", en: "A master craftsman possessing excellent skills." },
  { word: "掌握", reading: "しょうあく", romaji: "shouaku", meaning: "grasping, seizing control of", partOfSpeech: "noun", tags: ["politics", "business"], jp: "社内の主導権を完全に掌握する。", hira: "しゃないのしゅどうけんをかんぜんにしょうあくする。", en: "Completely seize leadership within the company." },
  { word: "看過", reading: "かんか", romaji: "kanka", meaning: "overlooking, turning a blind eye", partOfSpeech: "noun", tags: ["law", "society"], jp: "このような不正行為は看過できない。", hira: "このようなふせいこういはかんかできない。", en: "We cannot overlook such illicit activities." },
  { word: "糾弾", reading: "きゅうだん", romaji: "kyuudan", meaning: "denunciation, censure", partOfSpeech: "noun", tags: ["politics", "society"], jp: "不祥事を起こした政治家を厳しく糾弾する。", hira: "ふしょうじをおこしたせいじかをきびしくきゅうだんする。", en: "Strictly denounce the politician who caused the scandal." },
  { word: "克明", reading: "こくめい", romaji: "kokumei", meaning: "minute, detailed, conscientious", partOfSpeech: "na-adjective", tags: ["literature", "academic"], jp: "当時の様子が克明に記録されている。", hira: "とうじのようすがこくめいにきろくされている。", en: "The situation at the time is recorded in minute detail." },
  { word: "拘束", reading: "こうそく", romaji: "kousoku", meaning: "restriction, detention, binding", partOfSpeech: "noun", tags: ["law"], jp: "長時間の拘束により疲労が蓄積する。", hira: "ちょうじかんのこうそくによりひろうがちくせきする。", en: "Fatigue accumulated due to long hours of confinement." },
  { word: "示唆", reading: "しさ", romaji: "shisa", meaning: "suggestion, hint, implication", partOfSpeech: "noun", tags: ["academic", "general"], jp: "研究結果は今後の治療法を示唆している。", hira: "けんきゅうけっかはこんごのちりょうほうをしさしている。", en: "Research results suggest future therapeutic approaches." },
  { word: "収斂", reading: "しゅうれん", romaji: "shuuren", meaning: "convergence, condensing", partOfSpeech: "noun", tags: ["academic", "science"], jp: "多様な意見が徐々に一つの案へと収斂していく。", hira: "たようないけんがじょじょにひとつのあんへとしゅうれんしていく。", en: "Diverse opinions gradually converge into a single proposal." },
  { word: "是正", reading: "ぜせい", romaji: "zesei", meaning: "correction, rectification", partOfSpeech: "noun", tags: ["law", "business"], jp: "格差の是正を求める声が高まっている。", hira: "かくさのぜせいをともとめるこえがたかまっている。", en: "Voices demanding the rectification of disparity are rising." },
  { word: "拙速", reading: "せっそく", romaji: "sessoku", meaning: "rough-and-ready, quick but careless", partOfSpeech: "na-adjective", tags: ["business"], jp: "巧遅よりも拙速を尊ぶ場合もある。", hira: "こうちよりのせっそくをとうとぶばあいもある。", en: "There are cases where rough-and-ready is valued over meticulous delay." },
  { word: "遡及", reading: "そきゅう", romaji: "sokyuu", meaning: "retroactivity, going back in time", partOfSpeech: "noun", tags: ["law"], jp: "法律を過去に遡及して適用することは原則禁じられる。", hira: "ほうりつをかこにそきゅうしててきようすることはげんそくきんじられる。", en: "Applying laws retroactively to the past is in principle prohibited." },
  { word: "相殺", reading: "そうさい", romaji: "sousai", meaning: "offset, cancellation", partOfSpeech: "noun", tags: ["finance", "business"], jp: "利益と損失が相殺されてゼロになった。", hira: "りえきとそんしつがそうさいされてぜろになった。", en: "Profits and losses were offset to zero." },
  { word: "阻害", reading: "そがい", romaji: "sogai", meaning: "obstruction, impediment", partOfSpeech: "noun", tags: ["economy", "science"], jp: "健全な市場競争を阻害する要因を排除する。", hira: "けんぜんなしじょうきょうそうをそがいするよういんをはいじょする。", en: "Eliminate factors that obstruct healthy market competition." },
  { word: "淘汰", reading: "とうた", romaji: "touta", meaning: "natural selection, weeding out", partOfSpeech: "noun", tags: ["science", "business"], jp: "激しい競争の中で不適格な企業が淘汰される。", hira: "はげしいきょうそうのなかでふてきかくなきぎょうがとうたされる。", en: "Ineligible enterprises are weeded out amid fierce competition." },
  { word: "踏襲", reading: "とうしゅう", romaji: "toushuu", meaning: "following, adhering to (precedent)", partOfSpeech: "noun", tags: ["politics", "business"], jp: "前任者の基本方針を踏襲する。", hira: "ぜんにんしゃのきほんほうしんをとうしゅうする。", en: "Follow the predecessor's basic policy." },
  { word: "頓挫", reading: "とんざ", romaji: "tonza", meaning: "setback, stalemate, sudden halt", partOfSpeech: "noun", tags: ["business"], jp: "資金難により開発計画が頓挫した。", hira: "しきんなんによりかいはつけいかくがとんざした。", en: "The development plan ran aground due to financial difficulties." },
  { word: "波及", reading: "はきゅう", romaji: "hakyuu", meaning: "spread, ripple effect", partOfSpeech: "noun", tags: ["economy", "society"], jp: "金融危機の影響が世界中に波及した。", hira: "きんゆうききのえいきょうがせかいじゅうにはきゅうした。", en: "The impact of the financial crisis spread worldwide." },
  { word: "破綻", reading: "はたん", romaji: "hatan", meaning: "failure, bankruptcy, breakdown", partOfSpeech: "noun", tags: ["finance", "business"], jp: "巨額の負債を抱えて経営が破綻した。", hira: "きょがくのふさいをかかえてけいえいがはたんした。", en: "Management went bankrupt holding massive liabilities." },
  { word: "比肩", reading: "ひけん", romaji: "hiken", meaning: "ranking with, equaling", partOfSpeech: "noun", tags: ["academic", "arts"], jp: "世界の名作に比肩する傑作だ。", hira: "せかいのめいさくにひけんするけっさくだ。", en: "It is a masterpiece rivaling the world's renowned works." },
  { word: "逼迫", reading: "ひっぱく", romaji: "hippaku", meaning: "tightness, stringency, acute tension", partOfSpeech: "noun", tags: ["economy", "health"], jp: "医療現場の病床数が逼迫している。", hira: "いりょうげんばのびょうしょうすうがひっぱくしている。", en: "Hospital bed capacities at medical sites are severely strained." },
  { word: "変容", reading: "へんよう", romaji: "henyou", meaning: "transfiguration, transformation", partOfSpeech: "noun", tags: ["society", "culture"], jp: "時代の移り変わりとともに言語が変容する。", hira: "じだいのうつりかわりとともにげんごがへんようする。", en: "Language transforms with the changing of eras." },
  { word: "包括", reading: "ほうかつ", romaji: "houkatsu", meaning: "inclusion, comprehensive coverage", partOfSpeech: "noun", tags: ["academic", "business"], jp: "包括的な支援プログラムを策定する。", hira: "ほうかつてきなしえんぷろぐらむをさくていする。", en: "Formulate a comprehensive support program." },
  { word: "補完", reading: "ほかん", romaji: "hokan", meaning: "complement, supplementation", partOfSpeech: "noun", tags: ["business", "science"], jp: "お互いの短所を補完し合う関係。", hira: "おたがいのたんしょをほかんしあうかんけい。", en: "A relationship where both complement each other's weaknesses." },
  { word: "萌芽", reading: "ほうが", romaji: "houga", meaning: "bud, germ, sprout (of an idea/trend)", partOfSpeech: "noun", tags: ["academic", "history"], jp: "近代民主主義の萌芽がここに見られる。", hira: "きんだいみんしゅしゅぎのほうががここにみられる。", en: "The germ of modern democracy can be observed here." },
  { word: "膨張", reading: "ぼうちょう", romaji: "bouchou", meaning: "expansion, swelling", partOfSpeech: "noun", tags: ["science", "economy"], jp: "宇宙は加速しながら膨張を続けている。", hira: "うちゅうはかそくしながらぼうちょうをつづけている。", en: "The universe continues to expand at an accelerating pace." },
  { word: "蔓延", reading: "まんえん", romaji: "man'en", meaning: "rampancy, widespread epidemic", partOfSpeech: "noun", tags: ["health", "society"], jp: "感染症の蔓延を防ぐために外出を控える。", hira: "かんせんしょうのまんえんをふせぐためにがいしゅつをひかえる。", en: "Refrain from going out to prevent the rampant spread of infection." },
  { word: "未曾有", reading: "みぞう", romaji: "mizou", meaning: "unprecedented, unexampled", partOfSpeech: "na-adjective", tags: ["general"], jp: "未曾有の大災害に対処する。", hira: "みぞうのだいさいがいについしょする。", en: "Deal with an unprecedented major disaster." },
  { word: "名残", reading: "なごり", romaji: "nagori", meaning: "remains, traces, sorrow of parting", partOfSpeech: "noun", tags: ["culture", "emotions"], jp: "古都の風情を残す街並みに昔の名残がある。", hira: "ことのふぜいをのこすまちなみにむかしのなごりがある。", en: "Traces of the past remain in the townscape preserving ancient atmosphere." },
  { word: "容認", reading: "ようにん", romaji: "younin", meaning: "approval, toleration, acceptance", partOfSpeech: "noun", tags: ["politics", "society"], jp: "武力行使は決して容認できない。", hira: "ぶりょくこうしはけっしてようにんできない。", en: "The use of force can never be tolerated." },
  { word: "抑制", reading: "よくせい", romaji: "yokusei", meaning: "inhibition, restraint", partOfSpeech: "noun", tags: ["mind", "science"], jp: "物価の上昇を抑制するための金融引き締め。", hira: "ぶっかのじょうしょうをよくせいするためのきんゆうひきしめ。", en: "Monetary tightening to suppress the rise of prices." },
  { word: "律速", reading: "りっそく", romaji: "rissoku", meaning: "rate-determining, bottle-necking", partOfSpeech: "noun", tags: ["science", "engineering"], jp: "この工程が全体の律速段階となっている。", hira: "このこうていがぜんたいのりっそくだんかいとなっている。", en: "This process acts as the rate-determining step for the whole." },
  { word: "累計", reading: "るいけい", romaji: "ruikei", meaning: "cumulative total", partOfSpeech: "noun", tags: ["finance", "business"], jp: "累計販売数が100万本を突破した。", hira: "るいけいはんばいすうがひゃくまんぼんをとっぱした。", en: "Cumulative sales exceeded 1 million units." },
  { word: "露呈", reading: "ろてい", romaji: "rotei", meaning: "exposure, disclosure (of defects)", partOfSpeech: "noun", tags: ["business", "society"], jp: "組織の脆弱性が事件を機に露呈した。", hira: "そしきのぜいじゃくせいがじけんをきにろていした。", en: "The organization's vulnerability was exposed by the incident." },
  { word: "矮小", reading: "わいしょう", romaji: "waishou", meaning: "diminutive, dwarfed, petty", partOfSpeech: "na-adjective", tags: ["academic"], jp: "問題を矮小化して責任を逃れようとする。", hira: "もんだいをわいしょうかしてせきにんをのがれようとする。", en: "Attempting to evade responsibility by downplaying the problem." },
  { word: "委嘱", reading: "いしょく", romaji: "ishoku", meaning: "commission, appointment", partOfSpeech: "noun", tags: ["business", "politics"], jp: "専門委員会への参加を委嘱された。", hira: "せんもんいいんかいへのさんかをいしょくされた。", en: "Was commissioned to participate in the expert committee." },
  { word: "逸脱", reading: "いつだつ", romaji: "itsudatsu", meaning: "deviation, departure", partOfSpeech: "noun", tags: ["society", "law"], jp: "常識から逸脱した行動は慎むべきだ。", hira: "じょうしきからいつだつしたこうどうはつつしむべきだ。", en: "Actions deviating from common sense should be refrained from." },
  { word: "隠蔽", reading: "いんぺい", romaji: "inpei", meaning: "concealment, cover-up", partOfSpeech: "noun", tags: ["law", "society"], jp: "事実を隠蔽しようとした疑いが持たれている。", hira: "じじつをいんぺいしようとしたうたがいがもたれている。", en: "Suspicions of attempting to cover up the facts are held." },
  { word: "遺憾", reading: "いかん", romaji: "ikan", meaning: "regrettable, deplorable", partOfSpeech: "na-adjective", tags: ["politics", "business"], jp: "今回の事態に対して遺憾の意を表明する。", hira: "こんかいのじたいにたいしていかんのいをひょうめいする。", en: "Express feelings of regret toward the current situation." },
  { word: "委細", reading: "いさい", romaji: "isai", meaning: "details, particulars", partOfSpeech: "noun", tags: ["business"], jp: "委細は面談の上決定いたします。", hira: "いさいはめんだんのうえけっていいたします。", en: "Details will be determined upon interview." },
  { word: "一任", reading: "いちにん", romaji: "ichinin", meaning: "entrusting, leaving to someone's discretion", partOfSpeech: "noun", tags: ["business"], jp: "今後の対応については議長に一任された。", hira: "こんごのたいおうについてはぎちょうにいちにんされた。", en: "Future handling was entrusted to the chairman's discretion." },
  { word: "一瞥", reading: "いちべつ", romaji: "ichibetsu", meaning: "glance, glimpse", partOfSpeech: "noun", tags: ["literature"], jp: "書類に一瞥をくれただけでサインした。", hira: "しょるいにいちべつをくれただけでさいんした。", en: "Signed after merely giving a glance to the document." },
  { word: "畏怖", reading: "いふ", romaji: "ifu", meaning: "awe, fear, reverence", partOfSpeech: "noun", tags: ["mind", "nature"], jp: "大自然の脅威に対して畏怖の念を抱く。", hira: "だいしぜんのきょういにたいしていふのねんをいだく。", en: "Harbor feelings of awe toward the forces of great nature." },
  { word: "婉曲", reading: "えんきょく", romaji: "enkyoku", meaning: "euphemistic, roundabout, indirect", partOfSpeech: "na-adjective", tags: ["language"], jp: "角が立たないように婉曲な表現を用いる。", hira: "かどがたたないようにえんきょくなひょうげんをもちいる。", en: "Use roundabout expressions so as not to cause friction." },
  { word: "看取", reading: "みとり", romaji: "mitori", meaning: "nursing to the end, caring in final days", partOfSpeech: "noun", tags: ["health", "life"], jp: "家族に見守られて穏やかに看取られた。", hira: "かぞくにみまもられておだやかにみとられた。", en: "Was peacefully nursed to the end watched over by family." },
  { word: "官僚", reading: "かんりょう", romaji: "kanryou", meaning: "bureaucrat, civil servant", partOfSpeech: "noun", tags: ["politics"], jp: "官僚主導の政策決定プロセス。", hira: "かんりょうしゅどうのせいさくけっていぷろせす。", en: "Bureaucrat-led policy decision process." },
  { word: "看破", reading: "かんぱ", romaji: "kanpa", meaning: "seeing through, penetrating", partOfSpeech: "noun", tags: ["mind"], jp: "相手の嘘を一目で見破り看破した。", hira: "あいてのうそをひとめでみやぶりかんぱした。", en: "Penetrated and saw through the counterpart's lie at a glance." },
  { word: "忌避", reading: "きひ", romaji: "kihi", meaning: "evasion, avoidance, refusal", partOfSpeech: "noun", tags: ["society", "law"], jp: "兵役の忌避は厳罰に処される。", hira: "へいえきのきひはげんばつにしょされる。", en: "Evasion of military service is subject to severe punishment." },
  { word: "脚色", reading: "きゃくしょく", romaji: "kyakushoku", meaning: "dramatization, adaptation", partOfSpeech: "noun", tags: ["arts", "literature"], jp: "史実を脚色した時代劇映画。", hira: "しじつをきゃくしょくしたじだいげきえいが。", en: "A period film adapting historical facts." },
  { word: "矜持", reading: "きょうじ", romaji: "kyouji", meaning: "pride, dignity, self-esteem", partOfSpeech: "noun", tags: ["personality", "mind"], jp: "プロフェッショナルとしての矜持を持つ。", hira: "ぷろふぇっしょなるとしてのきょうじをもつ。", en: "Have dignity and pride as a professional." },
  { word: "拘泥", reading: "こうでい", romaji: "koudei", meaning: "fastidiousness, sticking closely to minor points", partOfSpeech: "noun", tags: ["mind"], jp: "過去の失敗に拘泥しては前へ進めない。", hira: "かこのしっぱいにこうでいしてはまえへすすめない。", en: "One cannot advance forward if obsessing over past mistakes." },
  { word: "懇願", reading: "こんがん", romaji: "kongan", meaning: "entreaty, earnest prayer", partOfSpeech: "noun", tags: ["mind", "society"], jp: "再考を涙ながらに懇願する。", hira: "さいこうをなみだながらにこんがんする。", en: "Earnestly plead for reconsideration while in tears." },
  { word: "詐称", reading: "さしょう", romaji: "sashou", meaning: "false representation, misrepresentation", partOfSpeech: "noun", tags: ["law"], jp: "経歴を詐称した事実が明るみに出た。", hira: "けいれきをさしょうしたじじつがあかるみにでた。", en: "The fact of falsifying career background came to light." },
  { word: "斟酌", reading: "しんしゃく", romaji: "shinshaku", meaning: "taking into consideration, allowance", partOfSpeech: "noun", tags: ["mind", "law"], jp: "相手の置かれた事情を斟酌して判断する。", hira: "あいてのおかれたじじょうをしんしゃくしてはんだんする。", en: "Judge while taking into consideration the other party's circumstances." },
  { word: "峻別", reading: "しゅんべつ", romaji: "shunbetsu", meaning: "strict distinction, clear demarcation", partOfSpeech: "noun", tags: ["logic"], jp: "公私の区別を峻別する。", hira: "こうしのくべつをしゅんべつする。", en: "Strictly demarcate the distinction between public and private." },
  { word: "齟齬", reading: "そご", romaji: "sogo", meaning: "discrepancy, discord, conflict", partOfSpeech: "noun", tags: ["business", "communication"], jp: "連絡不足により双方の認識に齟齬が生じた。", hira: "れんらくぶそくによりそうほうのにんしきにそごがしょうじた。", en: "Discrepancy arose in understanding between both parties due to lack of communication." },
  { word: "耽溺", reading: "たんでき", romaji: "tandeki", meaning: "indulgence, debauchery, addiction", partOfSpeech: "noun", tags: ["mind"], jp: "読書に耽溺して時間を忘れる。", hira: "どくしょにたんできしてじかんをわすれる。", en: "Immerse oneself completely in reading and forget time." },
  { word: "弾劾", reading: "だんがい", romaji: "dangai", meaning: "impeachment, censure", partOfSpeech: "noun", tags: ["politics", "law"], jp: "不正を行った裁判官が弾劾裁判にかけられた。", hira: "ふせいをおこなったさいばんかんがだんがいさいばんにかけられた。", en: "The judge who committed malpractice was subjected to impeachment trial." },
  { word: "躊躇", reading: "ちゅうちょ", romaji: "chuucho", meaning: "hesitation, vacillation", partOfSpeech: "noun", tags: ["mind"], jp: "一瞬の躊躇が命取りになる。", hira: "いっしゅんのちゅうちょがいのちとりになる。", en: "A moment of hesitation can become fatal." },
  { word: "陳腐", reading: "ちんぷ", romaji: "chinpu", meaning: "trite, stale, clichéd", partOfSpeech: "na-adjective", tags: ["arts", "literature"], jp: "陳腐な表現を避けて新鮮な言葉を選ぶ。", hira: "ちんぷなひょうげんをさけてしんせんなことばをえらぶ。", en: "Avoid clichéd expressions and choose fresh words." },
  { word: "提携", reading: "ていけい", romaji: "teikei", meaning: "partnership, business alliance", partOfSpeech: "noun", tags: ["business"], jp: "海外の大手企業と業務提携を結ぶ。", hira: "かいがいのおおてきぎょうとぎょうむていけいをむすぶ。", en: "Conclude an operational alliance with a major overseas enterprise." },
  { word: "捏造", reading: "ねつぞう", romaji: "netsuzou", meaning: "fabrication, forgery", partOfSpeech: "noun", tags: ["law", "academic"], jp: "研究データの捏造が発覚した。", hira: "けんきゅうでーたのねつぞうがはっかくした。", en: "Fabrication of research data was uncovered." },
  { word: "排斥", reading: "はいせき", romaji: "haiseki", meaning: "rejection, boycott, expulsion", partOfSpeech: "noun", tags: ["society", "politics"], jp: "異文化を排斥することなく受け入れる。", hira: "いぶんかをはいせきすることなくうけいれる。", en: "Accept foreign cultures without ostracizing them." },
  { word: "逼迫", reading: "ひっぱく", romaji: "hippaku", meaning: "scarcity, emergency stringency", partOfSpeech: "noun", tags: ["economy"], jp: "電力需給が逼迫し節電が呼びかけられた。", hira: "でんりょくじゅきゅうがひっぱくしせつでんがよびかけられた。", en: "Power supply and demand tightened and power conservation was urged." },
  { word: "付与", reading: "ふよ", romaji: "fuyo", meaning: "granting, assignment, bestowal", partOfSpeech: "noun", tags: ["law", "technology"], jp: "ユーザーに適切なアクセス権限を付与する。", hira: "ゆーざーにてきせつなあくせすけんげんをふよする。", en: "Grant appropriate access permissions to users." },
  { word: "憤慨", reading: "ふんがい", romaji: "fungai", meaning: "indignation, resentment", partOfSpeech: "noun", tags: ["emotions"], jp: "不当な扱いに強く憤慨する。", hira: "ふとうなあつかいにつよくふんがいする。", en: "Strongly indignant at unjust treatment." },
  { word: "返還", reading: "へんかん", romaji: "henkan", meaning: "return, restoration (of territory/property)", partOfSpeech: "noun", tags: ["politics", "law"], jp: "借用した美術品を所蔵館に返還する。", hira: "しゃくようしたびじゅつひんをしょぞうかんにへんかんする。", en: "Return borrowed art objects to the holding museum." },
  { word: "偏狭", reading: "へんきょう", romaji: "henkyou", meaning: "narrow-minded, parochial", partOfSpeech: "na-adjective", tags: ["mind"], jp: "偏狭なナショナリズムを警戒する。", hira: "へんきょうななしょなりずむをけいかいする。", en: "Be wary of narrow-minded nationalism." },
  { word: "便宜", reading: "べんぎ", romaji: "bengi", meaning: "convenience, accommodation, favor", partOfSpeech: "noun", tags: ["business", "politics"], jp: "参加者のために便宜を図る。", hira: "さんかしゃのためにべんぎをはかる。", en: "Provide accommodations for participants." },
  { word: "弁明", reading: "べんめい", romaji: "benmei", meaning: "explanation, justification, excuse", partOfSpeech: "noun", tags: ["law", "society"], jp: "弁明の機会が被告に与えられた。", hira: "べんめいのきかいがひこくにあたえられた。", en: "An opportunity for explanation was granted to the defendant." },
  { word: "貌", reading: "ぼう", romaji: "bou", meaning: "appearance, countenance", partOfSpeech: "noun", tags: ["literature"], jp: "古き良き日本の原貌を今に伝える。", hira: "ふるきよきにほんのげんぼうをいまにつたえる。", en: "Conveys the original appearance of good old Japan to this day." },
  { word: "免責", reading: "めんせき", romaji: "menseki", meaning: "exemption from liability, disclaimer", partOfSpeech: "noun", tags: ["law", "business"], jp: "利用規約の免責事項を熟読する。", hira: "りようきやくのめんせきじこうをじゅくどくする。", en: "Carefully read the liability disclaimer in the terms of service." },
  { word: "盲従", reading: "もうじゅう", romaji: "moujuu", meaning: "blind obedience", partOfSpeech: "noun", tags: ["society", "mind"], jp: "権威に盲従することの危険性を説く。", hira: "けんいにもうじゅうすることのきけんせいをとく。", en: "Preach the danger of blind obedience to authority." },
  { word: "名目", reading: "めいもく", romaji: "meimoku", meaning: "nominal, name, pretext", partOfSpeech: "noun", tags: ["economy", "politics"], jp: "名目経済成長率が前年を上回った。", hira: "めいもくけいざいせいちょうりつがぜんねんをうわまわった。", en: "The nominal economic growth rate exceeded the previous year." },
  { word: "有耶無耶", reading: "うやむや", romaji: "uyamuya", meaning: "vague, ambiguous, unresolved", partOfSpeech: "na-adjective", tags: ["general"], jp: "責任の所在を有耶無耶にしてはならない。", hira: "せきにんのしょざいをうやむやにしてはならない。", en: "The locus of responsibility must not be left ambiguous." },
  { word: "遊説", reading: "ゆうぜい", romaji: "yuuzei", meaning: "election tour, campaigning tour", partOfSpeech: "noun", tags: ["politics"], jp: "全国各地を遊説して支持を訴える。", hira: "ぜんこくかくちをゆうぜいしてしじをうったえる。", en: "Tour regions across the country appealing for support." },
  { word: "宥和", reading: "ゆうわ", romaji: "yuuwa", meaning: "appeasement, reconciliation", partOfSpeech: "noun", tags: ["politics", "history"], jp: "宥和政策が招いた歴史的悲劇。", hira: "ゆうわせいさくがまねいたれきしてきひげき。", en: "The historical tragedy brought about by the appeasement policy." },
  { word: "抑制", reading: "よくせい", romaji: "yokusei", meaning: "control, restraint", partOfSpeech: "noun", tags: ["mind"], jp: "怒りを抑制して対話を試みる。", hira: "いかりをよくせいしてたいわをこころみる。", en: "Restrain anger and attempt dialogue." },
  { word: "落胆", reading: "らくたん", romaji: "rakutan", meaning: "discouragement, despondency", partOfSpeech: "noun", tags: ["emotions"], jp: "落胆のあまり言葉を失った。", hira: "らくたんのあまりことばをうしなった。", en: "Was at a loss for words out of deep discouragement." },
  { word: "歴然", reading: "れきぜん", romaji: "rekizen", meaning: "evident, plain, unmistakable", partOfSpeech: "na-adjective", tags: ["general"], jp: "両者の実力差は歴然としている。", hira: "りょうしゃのじつりょくさはれきぜんとしている。", en: "The difference in skill between both is unmistakably evident." },
  { word: "籠城", reading: "ろうじょう", romaji: "roujou", meaning: "holding a fortress, being confined inside", partOfSpeech: "noun", tags: ["history"], jp: "食糧が尽きるまで城に籠城した。", hira: "しょくりょうがつきるまでしろにろうじょうした。", en: "Held the castle until food provisions were exhausted." },
  { word: "歪曲", reading: "わいきょく", romaji: "waikyoku", meaning: "distortion, falsification", partOfSpeech: "noun", tags: ["law", "society"], jp: "歴史の真実を歪曲して報道する。", hira: "れきしのしんじつをわいきょくしてほうどうする。", en: "Report while distorting the truth of history." },
  { word: "隘路", reading: "あいろ", romaji: "airo", meaning: "narrow path, bottleneck, impasse", partOfSpeech: "noun", tags: ["business", "nature"], jp: "開発を阻む隘路を打開する策を講じる。", hira: "かいはつをはばむあいろをだかいするさくをこうじる。", en: "Take measures to overcome the bottleneck impeding development." },
  { word: "闊達", reading: "かったつ", romaji: "kattatsu", meaning: "broad-minded, magnanimous, free", partOfSpeech: "na-adjective", tags: ["personality"], jp: "自由闊達な議論が行われた。", hira: "じゆうかったつなぎろんがおこなわれた。", en: "A free and open discussion was conducted." },
  { word: "気概", reading: "きがい", romaji: "kigai", meaning: "fighting spirit, mettle", partOfSpeech: "noun", tags: ["mind", "growth"], jp: "困難に立ち向かう気概を持つ。", hira: "こんなんにたちむかうきがいをもつ。", en: "Possess the fighting spirit to confront difficulties." },
  { word: "欺瞞", reading: "ぎまん", romaji: "giman", meaning: "deceit, delusion", partOfSpeech: "noun", tags: ["society"], jp: "欺瞞工作を見抜く。", hira: "ぎまんこうさくをみぬく。", en: "See through deceptive maneuvers." },
  { word: "気鋭", reading: "きえい", romaji: "kiei", meaning: "spirited, energetic, rising (star)", partOfSpeech: "na-adjective", tags: ["arts", "society"], jp: "新進気鋭の若手建築家。", hira: "しんしんきえいのわかてけんちくか。", en: "An up-and-coming, spirited young architect." },
  { word: "拮抗", reading: "きっこう", romaji: "kikkou", meaning: "rivalry, standing evenly matched", partOfSpeech: "noun", tags: ["sports", "politics"], jp: "実力が拮抗した好試合が展開された。", hira: "じつりょくがきっこうしたこうじあいがてんかいされた。", en: "A fine match unfolded where abilities were evenly matched." },
  { word: "矜持", reading: "きょうじ", romaji: "kyouji", meaning: "self-respect, pride", partOfSpeech: "noun", tags: ["personality"], jp: "誇りと矜持を胸に秘めて戦う。", hira: "ほこりときょうじをむねにひめてたたかう。", en: "Fight with pride and self-respect held in one's chest." },
  { word: "炯眼", reading: "けいがん", romaji: "keigan", meaning: "discerning eye, keen insight", partOfSpeech: "noun", tags: ["mind"], jp: "炯眼の持ち主として知られる批評家。", hira: "けいがんのもちぬしとしてしられるひひょうか。", en: "A critic known for possessing a discerning eye." }
];

// Clean duplicates
const seenN1 = new Set();
const cleanN1 = [];
for (const v of n1Vocab) {
  if (!seenN1.has(v.word)) {
    seenN1.add(v.word);
    cleanN1.push(v);
  }
}

// Extra N1 words to reach 100
const extraN1 = [
  { word: "糾明", reading: "きゅうめい", romaji: "kyuumei", meaning: "close examination, probing investigation", partOfSpeech: "noun", tags: ["law"], jp: "事件の全容を徹底的に糾明する。", hira: "じけんのぜんようをてっていてきにきゅうめいする。", en: "Thoroughly investigate the full picture of the incident." },
  { word: "矯風", reading: "きょうふう", romaji: "kyoufuu", meaning: "reform of public morals", partOfSpeech: "noun", tags: ["society"], jp: "社会の風紀を正す矯風運動。", hira: "しゃかいのふうきをただすきょうふううんどう。", en: "A moral reform movement to correct social discipline." },
  { word: "虚飾", reading: "きょしょく", romaji: "kyoshoku", meaning: "ostentation, show, vanity", partOfSpeech: "noun", tags: ["personality"], jp: "虚飾を捨ててありのままに生きる。", hira: "きょしょくをすててありのままにいきる。", en: "Cast aside vanity and live as one truly is." },
  { word: "慶弔", reading: "けいちょう", romaji: "keichou", meaning: "congratulations and condolences", partOfSpeech: "noun", tags: ["culture", "daily"], jp: "会社の慶弔規定を確認する。", hira: "かいしゃのけいちょうきていをかくにんする。", en: "Check the company's congratulatory and condolence regulations." },
  { word: "懸隔", reading: "けんかく", romaji: "kenkaku", meaning: "wide gap, disparity", partOfSpeech: "noun", tags: ["society"], jp: "貧富の懸隔を縮める施策。", hira: "ひんぷのけんかくをちぢめるしさく。", en: "Policies to narrow the disparity between rich and poor." },
  { word: "誇誇", reading: "ここ", romaji: "koko", meaning: "proudly, boastfully", partOfSpeech: "adverb", tags: ["mind"], jp: "誇誇として成果を語る。", hira: "こことしてせいかをかたる。", en: "Proudly talk about achievements." },
  { word: "忽せ", reading: "ゆるがせ", romaji: "yurugase", meaning: "neglect, careless disregard", partOfSpeech: "noun", tags: ["general"], jp: "基本の確認を忽せにしてはならない。", hira: "きほんのかくにんをゆるがせにしてはならない。", en: "One must not carelessly neglect basic checks." },
  { word: "骨子", reading: "こっし", romaji: "kosshi", meaning: "essential points, gist, framework", partOfSpeech: "noun", tags: ["business", "politics"], jp: "新法案の骨子が発表された。", hira: "しんほうあんのこっしがはっぴょうされた。", en: "The framework of the new bill was announced." }
];

for (const ex of extraN1) {
  if (cleanN1.length < 100 && !seenN1.has(ex.word)) {
    seenN1.add(ex.word);
    cleanN1.push(ex);
  }
}

const formattedN1 = cleanN1.slice(0, 100).map((v, i) => ({
  id: `vocab-n1-${String(i + 1).padStart(3, '0')}`,
  level: "N1",
  word: v.word,
  reading: v.reading,
  romaji: v.romaji,
  meaning: v.meaning,
  partOfSpeech: v.partOfSpeech,
  example: {
    jp: v.jp,
    hira: v.hira,
    en: v.en
  },
  tags: v.tags,
  source: "JLPT-aligned Study Reference"
}));

fs.writeFileSync(path.join(__dirname, '../data/vocabulary/n1.json'), JSON.stringify(formattedN1, null, 2), 'utf8');
console.log(`Wrote ${formattedN1.length} N1 vocabulary records.`);
