const fs = require('fs');
const path = require('path');

// 100 N3 Vocabulary
const n3Vocab = [
  { word: "政党", reading: "せいとう", romaji: "seitou", meaning: "political party", partOfSpeech: "noun", tags: ["politics", "society"], jp: "彼は新しい政党を結成した。", hira: "かれはあたらしいせいとうをけっせいした。", en: "He formed a new political party." },
  { word: "原料", reading: "げんりょう", romaji: "genryou", meaning: "raw materials", partOfSpeech: "noun", tags: ["industry", "business"], jp: "この製品の原料は輸入されている。", hira: "このせいひんのげんりょうはゆにゅうされている。", en: "The raw materials for this product are imported." },
  { word: "節約", reading: "せつやく", romaji: "setsuyaku", meaning: "saving, economizing", partOfSpeech: "noun", tags: ["daily", "finance"], jp: "電気代を節約するために早寝する。", hira: "でんきだいをせつやくするためにはやねする。", en: "I go to bed early to save on electricity bills." },
  { word: "消費", reading: "しょうひ", romaji: "shouhi", meaning: "consumption", partOfSpeech: "noun", tags: ["economy"], jp: "エネルギーの消費を抑える必要がある。", hira: "えねるぎーのしょうひをおさえるひつようがある。", en: "It is necessary to restrain energy consumption." },
  { word: "権利", reading: "けんり", romaji: "kenri", meaning: "right, privilege", partOfSpeech: "noun", tags: ["law", "society"], jp: "すべての国民には投票する権利がある。", hira: "すべてのごくみんにはとうひょうするけんりがある。", en: "Every citizen has the right to vote." },
  { word: "義務", reading: "ぎむ", romaji: "gimu", meaning: "duty, obligation", partOfSpeech: "noun", tags: ["society", "education"], jp: "教育を受けさせることは親の義務です。", hira: "きょういくをうけさせることはおやのぎむです。", en: "Providing education is a parent's duty." },
  { word: "成功", reading: "せいこう", romaji: "seikou", meaning: "success", partOfSpeech: "noun", tags: ["general"], jp: "プロジェクトが成功裏に終了した。", hira: "ぷろじぇくとがせいこうりにしゅうりょうした。", en: "The project ended in success." },
  { word: "失敗", reading: "しっぱい", romaji: "shippai", meaning: "failure, mistake", partOfSpeech: "noun", tags: ["general"], jp: "失敗から多くの教訓を学んだ。", hira: "しっぱいからおおくのきょうくんをまなんだ。", en: "I learned many lessons from failure." },
  { word: "希望", reading: "きぼう", romaji: "kibou", meaning: "hope, wish", partOfSpeech: "noun", tags: ["emotions"], jp: "将来への希望を持って進む。", hira: "しょうらいへのきぼうをもってすすむ。", en: "Moving forward with hope for the future." },
  { word: "失望", reading: "しつぼう", romaji: "shitsubou", meaning: "disappointment, despair", partOfSpeech: "noun", tags: ["emotions"], jp: "結果に深く失望した。", hira: "けっかにふかくしつぼうした。", en: "I was deeply disappointed with the result." },
  { word: "満足", reading: "まんぞく", romaji: "manzoku", meaning: "satisfaction, contentment", partOfSpeech: "na-adjective", tags: ["emotions"], jp: "今の生活にとても満足している。", hira: "いまのせいかつにとてもまんぞくしている。", en: "I am very satisfied with my current life." },
  { word: "不満", reading: "ふまん", romaji: "fuman", meaning: "dissatisfaction, discontent", partOfSpeech: "na-adjective", tags: ["emotions"], jp: "給料に対して不満を述べる。", hira: "きゅうりょうにたいしてふまんをのべる。", en: "To express dissatisfaction regarding salary." },
  { word: "協力", reading: "きょうりょく", romaji: "kyouryoku", meaning: "cooperation, collaboration", partOfSpeech: "noun", tags: ["teamwork", "business"], jp: "チーム全員の協力が不可欠だ。", hira: "ちーむぜんいんのきょうりょくがふかけつだ。", en: "The cooperation of all team members is essential." },
  { word: "援助", reading: "えんじょ", romaji: "enjo", meaning: "assistance, aid", partOfSpeech: "noun", tags: ["society"], jp: "被災地へ資金援助を行った。", hira: "ひさいちへしきんえんじょをおこなった。", en: "We provided financial aid to the disaster area." },
  { word: "発展", reading: "はってん", romaji: "hatten", meaning: "development, growth", partOfSpeech: "noun", tags: ["economy", "society"], jp: "科学技術が急速に発展している。", hira: "かがくぎじゅつがきゅうそくにはってんしている。", en: "Science and technology are developing rapidly." },
  { word: "進歩", reading: "しんぽ", romaji: "shinpo", meaning: "progress, advance", partOfSpeech: "noun", tags: ["education", "technology"], jp: "医療技術の進歩に驚かされる。", hira: "いりょうぎじゅつのしんぽにおどろかされる。", en: "I am amazed by the progress of medical technology." },
  { word: "環境", reading: "かんきょう", romaji: "kankyou", meaning: "environment, surroundings", partOfSpeech: "noun", tags: ["nature", "society"], jp: "自然環境を守る取り組みを始める。", hira: "しぜんかんきょうをまもるとりくみをはじめる。", en: "Start initiatives to protect the natural environment." },
  { word: "公害", reading: "こうがい", romaji: "kougai", meaning: "pollution, public nuisance", partOfSpeech: "noun", tags: ["nature", "society"], jp: "工場からの公害が問題になっている。", hira: "こうじょうからのこうがいがもんだいになっている。", en: "Pollution from factories has become an issue." },
  { word: "自然", reading: "しぜん", romaji: "shizen", meaning: "nature, natural", partOfSpeech: "na-adjective", tags: ["nature"], jp: "美しい自然に囲まれて暮らす。", hira: "うつくしいしぜんにかこまれてくらす。", en: "Living surrounded by beautiful nature." },
  { word: "人工", reading: "じんこう", romaji: "jinkou", meaning: "artificial, man-made", partOfSpeech: "noun", tags: ["technology"], jp: "人工知能の活用が進んでいる。", hira: "じんこうちのうのかつようがすすんでいる。", en: "The utilization of artificial intelligence is advancing." },
  { word: "管理", reading: "かんり", romaji: "kanri", meaning: "management, administration", partOfSpeech: "noun", tags: ["business"], jp: "在庫の管理を徹底する。", hira: "ざいこのかんりをてっていする。", en: "Strictly manage the inventory." },
  { word: "経営", reading: "けいえい", romaji: "keiei", meaning: "business management, operation", partOfSpeech: "noun", tags: ["business"], jp: "会社の経営方針を見直す。", hira: "かいしゃのけいえいほうしんをみなおす。", en: "Review the company management policy." },
  { word: "交渉", reading: "こうしょう", romaji: "koushou", meaning: "negotiation, bargaining", partOfSpeech: "noun", tags: ["business", "politics"], jp: "契約条件について交渉を行う。", hira: "けいやくじょうけんについてこうしょうをおこなう。", en: "Conduct negotiations regarding contract terms." },
  { word: "契約", reading: "けいやく", romaji: "keiyaku", meaning: "contract, agreement", partOfSpeech: "noun", tags: ["business", "law"], jp: "無事に新しい契約を結んだ。", hira: "ぶじにあたらしいけいやくをむすんだ。", en: "Successfully concluded the new contract." },
  { word: "約束", reading: "やくそく", romaji: "yakusoku", meaning: "promise, appointment", partOfSpeech: "noun", tags: ["daily"], jp: "友達と会う約束がある。", hira: "ともだちとあうやくそくがある。", en: "I have an appointment to meet a friend." },
  { word: "予約", reading: "よやく", romaji: "yoyaku", meaning: "reservation, booking", partOfSpeech: "noun", tags: ["travel", "daily"], jp: "新幹線の指定席を予約した。", hira: "しんかんせんのしていせきをよやくした。", en: "I reserved a seat on the Shinkansen." },
  { word: "確認", reading: "かくにん", romaji: "kakunin", meaning: "confirmation, verification", partOfSpeech: "noun", tags: ["business", "daily"], jp: "メールの内容を再確認してください。", hira: "めーるのないようをさいかくにんしてください。", en: "Please re-check the content of the email." },
  { word: "調査", reading: "ちょうさ", romaji: "chousa", meaning: "investigation, survey", partOfSpeech: "noun", tags: ["business", "science"], jp: "市場調査の結果を報告する。", hira: "しじょうちょうさのけっかをほうこくする。", en: "Report the results of the market research." },
  { word: "研究", reading: "けんきゅう", romaji: "kenkyuu", meaning: "research, study", partOfSpeech: "noun", tags: ["education", "science"], jp: "大学で再生エネルギーの研究を行う。", hira: "だいがくでさいせいえねるぎーのけんきゅうをおこなう。", en: "Conduct renewable energy research at the university." },
  { word: "実験", reading: "じっけん", romaji: "jikken", meaning: "experiment", partOfSpeech: "noun", tags: ["science"], jp: "実験の結果が予想通りに出た。", hira: "じっけんのけっかがよそうどおりにでた。", en: "The experimental results came out as expected." },
  { word: "観察", reading: "かんさつ", romaji: "kansatsu", meaning: "observation", partOfSpeech: "noun", tags: ["science", "education"], jp: "植物の成長を注意深く観察する。", hira: "しょくぶつのせいちょうをちゅういぶかくかんさつする。", en: "Carefully observe the growth of plants." },
  { word: "計算", reading: "けいさん", romaji: "keisan", meaning: "calculation, computation", partOfSpeech: "noun", tags: ["daily", "business"], jp: "旅行の予算を正確に計算する。", hira: "りょこうのよさんをせいかくにけいさんする。", en: "Calculate the travel budget accurately." },
  { word: "予想", reading: "よそう", romaji: "yosou", meaning: "expectation, forecast", partOfSpeech: "noun", tags: ["general"], jp: "明日の天気予報を予想する。", hira: "あしたのてんきよほうをよそうする。", en: "Forecast tomorrow's weather." },
  { word: "想像", reading: "そうぞう", romaji: "souzou", meaning: "imagination, fancy", partOfSpeech: "noun", tags: ["mind"], jp: "未来の都市の姿を想像する。", hira: "みらいのとしのすがたをそうぞうする。", en: "Imagine the appearance of future cities." },
  { word: "判断", reading: "はんだん", romaji: "handan", meaning: "judgment, decision", partOfSpeech: "noun", tags: ["mind", "business"], jp: "冷静な判断が求められる状況だ。", hira: "れいせいなはんだんがもとめられるじょうきょうだ。", en: "It is a situation where calm judgment is required." },
  { word: "決断", reading: "けつだん", romaji: "ketsudan", meaning: "decision, determination", partOfSpeech: "noun", tags: ["mind"], jp: "重大な決断を下す時が来た。", hira: "じゅうだいなけつだんをくだすときがきた。", en: "The time has come to make a crucial decision." },
  { word: "選択", reading: "せんたく", romaji: "sentaku", meaning: "choice, selection", partOfSpeech: "noun", tags: ["daily"], jp: "最良の選択肢を選ぶ。", hira: "さいりょうのせんたくしをえらぶ。", en: "Choose the best option." },
  { word: "解決", reading: "かいけつ", romaji: "kaiketsu", meaning: "settlement, resolution", partOfSpeech: "noun", tags: ["business", "general"], jp: "複雑な問題を速やかに解決した。", hira: "ふくざつなもんだいをすみやかにかいけつした。", en: "Promptly solved the complex problem." },
  { word: "原因", reading: "げんいん", romaji: "gen'in", meaning: "cause, origin", partOfSpeech: "noun", tags: ["general"], jp: "事故の原因を徹底的に究明する。", hira: "じこのげんいんをてっていてきにきゅうめいする。", en: "Thoroughly investigate the cause of the accident." },
  { word: "結果", reading: "けっか", romaji: "kekka", meaning: "result, consequence", partOfSpeech: "noun", tags: ["general"], jp: "試験の結果が明日発表される。", hira: "しけんのけっかがあしたはっぴょうされる。", en: "The exam results will be announced tomorrow." },
  { word: "理由", reading: "りゆう", romaji: "riyuu", meaning: "reason, motive", partOfSpeech: "noun", tags: ["general"], jp: "遅刻した理由を説明してください。", hira: "ちこくしたりゆうをせつめいしてください。", en: "Please explain the reason for being late." },
  { word: "目的", reading: "もくてき", romaji: "mokuteki", meaning: "purpose, objective", partOfSpeech: "noun", tags: ["general"], jp: "留学の目的は語学力の向上です。", hira: "りゅうがくのもくてきはごがくりょくのこうじょうです。", en: "The purpose of studying abroad is to improve language skills." },
  { word: "目標", reading: "もくひょう", romaji: "mokuhyou", meaning: "goal, target", partOfSpeech: "noun", tags: ["education", "business"], jp: "今年の目標はJLPT合格です。", hira: "ことしのもくひょうはJLPTごうかくです。", en: "This year's goal is passing the JLPT." },
  { word: "計画", reading: "けいかく", romaji: "keikaku", meaning: "plan, project", partOfSpeech: "noun", tags: ["business", "daily"], jp: "綿密な計画を立てて行動する。", hira: "めんみつなけいかくをたててこうどうする。", en: "Act according to a detailed plan." },
  { word: "準備", reading: "じゅんび", romaji: "junbi", meaning: "preparation, setup", partOfSpeech: "noun", tags: ["daily", "business"], jp: "プレゼンテーションの準備を終えた。", hira: "ぷれぜんてーしょんのじゅんびをおえた。", en: "Finished preparation for the presentation." },
  { word: "整理", reading: "せいり", romaji: "seiri", meaning: "arrangement, tidying up", partOfSpeech: "noun", tags: ["daily", "business"], jp: "机の上の書類を整理する。", hira: "つくえのうえのしょるいをせいりする。", en: "Organize the documents on the desk." },
  { word: "整頓", reading: "せいとん", romaji: "seiton", meaning: "neatness, orderly arrangement", partOfSpeech: "noun", tags: ["daily"], jp: "部屋の整頓を心がけましょう。", hira: "へやのせいとんをこころがけましょう。", en: "Let us keep the room neat and tidy." },
  { word: "清潔", reading: "せいけつ", romaji: "seiketsu", meaning: "clean, hygienic", partOfSpeech: "na-adjective", tags: ["daily", "health"], jp: "手洗いで清潔を保つ。", hira: "てあらいでせいけつをたもつ。", en: "Maintain hygiene through hand washing." },
  { word: "健康", reading: "けんこう", romaji: "kenkou", meaning: "health, healthy", partOfSpeech: "na-adjective", tags: ["health"], jp: "適度な運動は健康に良い。", hira: "てきどなうんどうはけんこうによい。", en: "Moderate exercise is good for health." },
  { word: "病気", reading: "びょうき", romaji: "byouki", meaning: "illness, disease", partOfSpeech: "noun", tags: ["health"], jp: "重い病気から完全に回復した。", hira: "おもいびょうきからかんぜんにかいふくした。", en: "Fully recovered from a serious illness." },
  { word: "回復", reading: "かいふく", romaji: "kaifuku", meaning: "recovery, improvement", partOfSpeech: "noun", tags: ["health", "economy"], jp: "天候の回復を待って出発する。", hira: "てんこうのかいふくをまってしゅっぱつする。", en: "Depart after waiting for the weather to improve." },
  { word: "治療", reading: "ちりょう", romaji: "chiryou", meaning: "medical treatment, cure", partOfSpeech: "noun", tags: ["health"], jp: "怪我の治療に専念する。", hira: "けがのちりょうにせんねんする。", en: "Focus on treatment of the injury." },
  { word: "手術", reading: "しゅじゅつ", romaji: "shujutsu", meaning: "surgical operation", partOfSpeech: "noun", tags: ["health"], jp: "手術は無事に成功した。", hira: "しゅじゅつはぶじにせいこうした。", en: "The surgery was successful." },
  { word: "薬局", reading: "やっきょく", romaji: "yakkyoku", meaning: "pharmacy, drugstore", partOfSpeech: "noun", tags: ["health", "town"], jp: "処方箋を持って薬局へ行く。", hira: "しょほうせんをもってやっきょくへいく。", en: "Go to the pharmacy with a prescription." },
  { word: "病院", reading: "びょういん", romaji: "byouin", meaning: "hospital", partOfSpeech: "noun", tags: ["town", "health"], jp: "定期健診のため病院を受診する。", hira: "ていきけんしんのためびょういんをじゅしんする。", en: "Visit the hospital for a periodic medical checkup." },
  { word: "診察", reading: "しんさつ", romaji: "shinsatsu", meaning: "medical examination", partOfSpeech: "noun", tags: ["health"], jp: "医師の診察を受ける。", hira: "いしのしんさつをうける。", en: "Receive an examination by a doctor." },
  { word: "救急", reading: "きゅうきゅう", romaji: "kyuukyuu", meaning: "emergency, first aid", partOfSpeech: "noun", tags: ["health", "emergency"], jp: "救急車がすぐに現場に到着した。", hira: "きゅうきゅうしゃがすぐにげんばにとうちゃくした。", en: "The ambulance quickly arrived at the scene." },
  { word: "警察", reading: "けいさつ", romaji: "keisatsu", meaning: "police", partOfSpeech: "noun", tags: ["society"], jp: "落とし物を警察に届け出た。", hira: "おとしものをけいさつにとどけでた。", en: "Reported the lost item to the police." },
  { word: "消防", reading: "しょうぼう", romaji: "shoubou", meaning: "firefighting, fire defense", partOfSpeech: "noun", tags: ["emergency"], jp: "消防署で防災訓練が行われた。", hira: "しょうぼうしょでぼうさいくんれんがおこなわれた。", en: "Disaster prevention drill was held at the fire station." },
  { word: "地震", reading: "じしん", romaji: "jishin", meaning: "earthquake", partOfSpeech: "noun", tags: ["nature", "emergency"], jp: "大きな地震が発生した。", hira: "おおきなじしんがはっせいした。", en: "A major earthquake occurred." },
  { word: "台風", reading: "たいふう", romaji: "taifuu", meaning: "typhoon", partOfSpeech: "noun", tags: ["nature", "weather"], jp: "台風の接近に伴い大雨が降った。", hira: "たいふうのせっきんにともないおおあめがふった。", en: "Heavy rain fell accompanying the approach of the typhoon." },
  { word: "洪水", reading: "こうずい", romaji: "kouzui", meaning: "flood", partOfSpeech: "noun", tags: ["nature", "emergency"], jp: "大雨で川が氾濫し洪水が起きた。", hira: "おおあめでかわがはんらんしこうずいがおきた。", en: "The river overflowed from heavy rain and a flood occurred." },
  { word: "避難", reading: "ひなん", romaji: "hinan", meaning: "evacuation, taking refuge", partOfSpeech: "noun", tags: ["emergency"], jp: "安全な高台へ避難してください。", hira: "あんぜんなたかだいへひなんしてください。", en: "Please evacuate to safe high ground." },
  { word: "警報", reading: "けいほう", romaji: "keihou", meaning: "warning, alarm", partOfSpeech: "noun", tags: ["weather", "emergency"], jp: "大雨警報が発令された。", hira: "おおあめけいほうにはつれいされた。", en: "A heavy rain warning was issued." },
  { word: "注意", reading: "ちゅうい", romaji: "chuui", meaning: "caution, attention", partOfSpeech: "noun", tags: ["daily"], jp: "足元に十分注意して歩く。", hira: "あしもとにじゅうぶんちゅういしてあるく。", en: "Walk while paying close attention to your footing." },
  { word: "危険", reading: "きけん", romaji: "kiken", meaning: "danger, hazardous", partOfSpeech: "na-adjective", tags: ["general"], jp: "危険な場所には近づかないこと。", hira: "きけんなばしょにはちかづかないこと。", en: "Do not approach dangerous areas." },
  { word: "安全", reading: "あんぜん", romaji: "anzen", meaning: "safety, secure", partOfSpeech: "na-adjective", tags: ["general"], jp: "シートベルトを締めて安全を確保する。", hira: "しーとべるとをしめてあんぜんをかくほする。", en: "Fasten your seatbelt to ensure safety." },
  { word: "交通", reading: "こうつう", romaji: "koutsuu", meaning: "traffic, transportation", partOfSpeech: "noun", tags: ["travel", "town"], jp: "この地域は交通の便がとても良い。", hira: "このちいきはこうつうのべんがとてもよい。", en: "This area has very convenient transportation." },
  { word: "通勤", reading: "つうきん", romaji: "tsuukin", meaning: "commuting to work", partOfSpeech: "noun", tags: ["business", "daily"], jp: "毎朝電車で通勤している。", hira: "まいあさでんしゃでつうきんしている。", en: "I commute to work by train every morning." },
  { word: "通学", reading: "つうがく", romaji: "tsuugaku", meaning: "commuting to school", partOfSpeech: "noun", tags: ["education", "daily"], jp: "自転車で通学する学生が多い。", hira: "じてんしゃでつうがくするがくせいがおおい。", en: "Many students commute to school by bicycle." },
  { word: "乗車", reading: "じょうしゃ", romaji: "jousha", meaning: "boarding a train/bus", partOfSpeech: "noun", tags: ["travel"], jp: "乗車券をお持ちですか。", hira: "じょうしゃけんをおもちですか。", en: "Do you have a boarding ticket?" },
  { word: "下車", reading: "げしゃ", romaji: "gesha", meaning: "alighting, getting off", partOfSpeech: "noun", tags: ["travel"], jp: "次の駅で下車してください。", hira: "つぎのえきでげしゃしてください。", en: "Please get off at the next station." },
  { word: "乗り換える", reading: "のりかえる", romaji: "norikaeru", meaning: "to transfer, change trains", partOfSpeech: "verb", tags: ["travel"], jp: "新宿駅で地下鉄に乗り換える。", hira: "しんじゅくえきでちかてつにのりかえる。", en: "Transfer to the subway at Shinjuku Station." },
  { word: "遅延", reading: "ちえん", romaji: "chien", meaning: "delay, lateness", partOfSpeech: "noun", tags: ["travel"], jp: "悪天候により列車の遅延が発生した。", hira: "あくてんこうによりれっしゃのちえんがはっせいした。", en: "Train delays occurred due to bad weather." },
  { word: "運休", reading: "うんきゅう", romaji: "unkyuu", meaning: "suspension of service", partOfSpeech: "noun", tags: ["travel"], jp: "強風のためフェリーが運休になった。", hira: "きょうふうのためふぇりーがうんきゅうになった。", en: "The ferry service was suspended due to strong winds." },
  { word: "出発", reading: "しゅっぱつ", romaji: "shuppatsu", meaning: "departure", partOfSpeech: "noun", tags: ["travel"], jp: "定刻通りに飛行機が出発した。", hira: "ていこくどおりにひこうきがしゅっぱつした。", en: "The plane departed on schedule." },
  { word: "到着", reading: "とうちゃく", romaji: "touchaku", meaning: "arrival", partOfSpeech: "noun", tags: ["travel"], jp: "無事に東京駅に到着しました。", hira: "ぶじにとうきょうえきにとうちゃくしました。", en: "Arrived safely at Tokyo Station." },
  { word: "予定", reading: "よてい", romaji: "yotei", meaning: "schedule, plan", partOfSpeech: "noun", tags: ["daily", "business"], jp: "明日の予定を確認する。", hira: "あしたのよていをかくにんする。", en: "Check tomorrow's schedule." },
  { word: "日程", reading: "にってい", romaji: "nittei", meaning: "itinerary, schedule", partOfSpeech: "noun", tags: ["travel", "business"], jp: "出張の日程を調整する。", hira: "しゅっちょうのにっていをちょうせいする。", en: "Adjust the business trip schedule." },
  { word: "調整", reading: "ちょうせい", romaji: "chousei", meaning: "adjustment, coordination", partOfSpeech: "noun", tags: ["business"], jp: "会議の時間を調整しましょう。", hira: "かいぎのじかんをちょうせいしましょう。", en: "Let us coordinate the meeting time." },
  { word: "相談", reading: "そうだん", romaji: "soudan", meaning: "consultation, discussion", partOfSpeech: "noun", tags: ["daily", "business"], jp: "上司に進路について相談する。", hira: "じょうしにしんろについてそうだんする。", en: "Consult with my supervisor about career paths." },
  { word: "報告", reading: "ほうこく", romaji: "houkoku", meaning: "report, briefing", partOfSpeech: "noun", tags: ["business"], jp: "進捗状況を部長に報告した。", hira: "しんちょくじょうきょうをぶちょうにほうこくした。", en: "Reported the progress status to the department manager." },
  { word: "連絡", reading: "れんらく", romaji: "renraku", meaning: "contact, communication", partOfSpeech: "noun", tags: ["daily", "business"], jp: "後ほどメールでご連絡いたします。", hira: "のちほどめーるでごれんらくいたします。", en: "I will contact you by email later." },
  { word: "賛成", reading: "さんせい", romaji: "sansei", meaning: "agreement, approval", partOfSpeech: "noun", tags: ["opinion"], jp: "彼の提案に全員が賛成した。", hira: "かれのていあんにぜんいんがさんせいした。", en: "Everyone agreed with his proposal." },
  { word: "反対", reading: "はんたい", romaji: "hantai", meaning: "opposition, objection", partOfSpeech: "noun", tags: ["opinion"], jp: "計画の変更に反対する。", hira: "けいかくのへんこうにはんたいする。", en: "Oppose the modification of the plan." },
  { word: "意見", reading: "いけん", romaji: "iken", meaning: "opinion, view", partOfSpeech: "noun", tags: ["opinion"], jp: "率直なご意見をお聞かせください。", hira: "そっちょくなごいけんをおきかせください。", en: "Please share your frank opinion." },
  { word: "提案", reading: "ていあん", romaji: "teian", meaning: "proposal, suggestion", partOfSpeech: "noun", tags: ["business"], jp: "業務効率化のための提案を行う。", hira: "ぎょうむこうりつかのためのていあんをおこなう。", en: "Make a proposal for improving operational efficiency." },
  { word: "要求", reading: "ようきゅう", romaji: "youkyuu", meaning: "demand, request", partOfSpeech: "noun", tags: ["business", "politics"], jp: "待遇改善を会社に要求する。", hira: "たいぐうかいぜんをかいしゃにようきゅうする。", en: "Demand improvement of working conditions from the company." },
  { word: "提供", reading: "ていきょう", romaji: "teikyou", meaning: "provision, offering", partOfSpeech: "noun", tags: ["business"], jp: "質の高いサービスを提供する。", hira: "しつのたかいさーびすをていきょうする。", en: "Provide high-quality services." },
  { word: "利用", reading: "りよう", romaji: "riyou", meaning: "use, utilization", partOfSpeech: "noun", tags: ["general"], jp: "図書館の施設を有効に利用する。", hira: "としょかんのしせつをゆうこうにりようする。", en: "Effectively utilize the library facilities." },
  { word: "活用", reading: "かつよう", romaji: "katsuyou", meaning: "practical use, application", partOfSpeech: "noun", tags: ["education", "business"], jp: "学んだ知識を実務で活用する。", hira: "まなんだちしきをじつむでかつようする。", en: "Apply acquired knowledge to practical work." },
  { word: "応用", reading: "おうよう", romaji: "ouyou", meaning: "practical application, adapted use", partOfSpeech: "noun", tags: ["science", "education"], jp: "基本ルールを様々な場面に応用する。", hira: "きほんるーるをさまざまなばめんにおうようする。", en: "Apply basic rules to various situations." },
  { word: "基本", reading: "きほん", romaji: "kihon", meaning: "foundation, basics", partOfSpeech: "noun", tags: ["education"], jp: "何事も基本が最も大切だ。", hira: "なにごともきほんがもっともたいせつだ。", en: "In all things, basics are the most important." },
  { word: "応用", reading: "おうよう", romaji: "ouyou", meaning: "applied use", partOfSpeech: "noun", tags: ["education"], jp: "応用問題に挑戦してみよう。", hira: "おうようもんだいにちょうせんしてみよう。", en: "Let's challenge ourselves with applied questions." },
  { word: "挑戦", reading: "ちょうせん", romaji: "chousen", meaning: "challenge, attempt", partOfSpeech: "noun", tags: ["mind", "growth"], jp: "新しい分野に果敢に挑戦する。", hira: "あたらしいぶんやにかかんにちょうせんする。", en: "Boldly challenge a new field." },
  { word: "克服", reading: "こくふく", romaji: "kokufuku", meaning: "overcoming, conquest", partOfSpeech: "noun", tags: ["growth"], jp: "苦手な科目を努力で克服した。", hira: "にがてなかもくをどりょくでこくふくした。", en: "Overcame a weak subject through effort." },
  { word: "努力", reading: "どりょく", romaji: "doryoku", meaning: "effort, exertion", partOfSpeech: "noun", tags: ["growth", "daily"], jp: "日々の努力が成果につながる。", hira: "ひびのどりょくがせいかにつながる。", en: "Daily efforts lead to achievements." },
  { word: "成果", reading: "せいか", romaji: "seika", meaning: "results, fruits of labor", partOfSpeech: "noun", tags: ["business", "growth"], jp: "長年の研究成果が認められた。", hira: "ながねんのけんきゅうせいかがみとめられた。", en: "Long-standing research results were recognized." },
  { word: "評価", reading: "ひょうか", romaji: "hyouka", meaning: "evaluation, appreciation", partOfSpeech: "noun", tags: ["business", "education"], jp: "彼の誠実な働きぶりは高く評価された。", hira: "かれのせいじつなはたらきぶりはたかくひょうかされた。", en: "His sincere work attitude was highly evaluated." },
  { word: "批判", reading: "ひはん", romaji: "hihan", meaning: "criticism, judgment", partOfSpeech: "noun", tags: ["society", "opinion"], jp: "建設的な批判を受け入れて改善する。", hira: "けんせつてきなひはんをうけいれてかいぜんする。", en: "Accept constructive criticism to make improvements." },
  { word: "改善", reading: "かいぜん", romaji: "kaizen", meaning: "improvement, betterment", partOfSpeech: "noun", tags: ["business", "growth"], jp: "作業環境の改善を図る。", hira: "さぎょうかんきょうのかいぜんをはかる。", en: "Strive for the improvement of the working environment." }
];

// Fix any duplicate words in n3Vocab
const seenN3 = new Set();
const cleanN3 = [];
for (const v of n3Vocab) {
  if (!seenN3.has(v.word)) {
    seenN3.add(v.word);
    cleanN3.push(v);
  }
}

// Add extras if needed to make exactly 100
const extraN3 = [
  { word: "比較", reading: "ひかく", romaji: "hikaku", meaning: "comparison", partOfSpeech: "noun", tags: ["general"], jp: "二つの案を比較して決める。", hira: "ふたつのあんをひかくしてきめる。", en: "Decide after comparing the two proposals." },
  { word: "基準", reading: "きじゅん", romaji: "kijun", meaning: "standard, criterion", partOfSpeech: "noun", tags: ["general"], jp: "明確な基準を設ける。", hira: "めいかくなきじゅんをもうける。", en: "Establish clear criteria." },
  { word: "範囲", reading: "はんい", romaji: "han'i", meaning: "range, scope", partOfSpeech: "noun", tags: ["general"], jp: "試験の出題範囲を確認する。", hira: "しけんのしゅつだいはんいをかくにんする。", en: "Confirm the exam coverage range." },
  { word: "限界", reading: "げんかい", romaji: "genkai", meaning: "limit, boundary", partOfSpeech: "noun", tags: ["general"], jp: "体力の限界まで頑張る。", hira: "たいりょくのげんかいまでがんばる。", en: "Push to the limit of physical stamina." }
];

for (const ex of extraN3) {
  if (cleanN3.length < 100 && !seenN3.has(ex.word)) {
    seenN3.add(ex.word);
    cleanN3.push(ex);
  }
}

const formattedN3 = cleanN3.slice(0, 100).map((v, i) => ({
  id: `vocab-n3-${String(i + 1).padStart(3, '0')}`,
  level: "N3",
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

fs.writeFileSync(path.join(__dirname, '../data/vocabulary/n3.json'), JSON.stringify(formattedN3, null, 2), 'utf8');
console.log(`Wrote ${formattedN3.length} N3 vocabulary records.`);
