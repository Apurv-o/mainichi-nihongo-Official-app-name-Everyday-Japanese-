const fs = require('fs');
const path = require('path');

const n2Vocab = [
  { word: "概要", reading: "がいよう", romaji: "gaiyou", meaning: "outline, summary", partOfSpeech: "noun", tags: ["business"], jp: "計画の概要を5分で説明します。", hira: "けいかくのがいようをごふんでせつめいします。", en: "I will explain the outline of the plan in 5 minutes." },
  { word: "把握", reading: "はあく", romaji: "haaku", meaning: "grasp, comprehension", partOfSpeech: "noun", tags: ["business", "mind"], jp: "現状を正確に把握することが肝要だ。", hira: "げんじょうをせいかくにはあくすることがかんようだ。", en: "It is essential to grasp the current situation accurately." },
  { word: "推進", reading: "すいしん", romaji: "suishin", meaning: "propulsion, promotion", partOfSpeech: "noun", tags: ["business", "politics"], jp: "環境保護プロジェクトを推進する。", hira: "かんきょうほごぷろじぇくとをすいしんする。", en: "Promote the environmental protection project." },
  { word: "維持", reading: "いじ", romaji: "iji", meaning: "maintenance, preservation", partOfSpeech: "noun", tags: ["general"], jp: "健康な体型を維持するために走る。", hira: "けんこうなたいけいをいじするためにはしる。", en: "Run to maintain a healthy physique." },
  { word: "確保", reading: "かくほ", romaji: "kakuho", meaning: "securing, guarantee", partOfSpeech: "noun", tags: ["business"], jp: "優秀な人材を確保することが急務だ。", hira: "ゆうしゅうなじんざいをかくほすることがきゅうむだ。", en: "Securing talented human resources is an urgent priority." },
  { word: "考慮", reading: "こうりょ", romaji: "kouryo", meaning: "consideration, taking into account", partOfSpeech: "noun", tags: ["business", "mind"], jp: "周囲の状況を十分に考慮する。", hira: "しゅういのじょうきょうをじゅうぶんにこうりょする。", en: "Take surrounding conditions fully into consideration." },
  { word: "検討", reading: "けんとう", romaji: "kentou", meaning: "examination, investigation", partOfSpeech: "noun", tags: ["business"], jp: "新規事業の可能性を前向きに検討する。", hira: "しんきじぎょうのかのうせいをまえむきにけんとうする。", en: "Positively examine the potential of the new business." },
  { word: "分析", reading: "ぶんせき", romaji: "bunseki", meaning: "analysis", partOfSpeech: "noun", tags: ["science", "business"], jp: "市場データを詳細に分析する。", hira: "しじょうでーたをしょうさいにぶんせきする。", en: "Analyze market data in detail." },
  { word: "対象", reading: "たいしょう", romaji: "taishou", meaning: "target, subject", partOfSpeech: "noun", tags: ["general"], jp: "調査の対象者を無作為に選ぶ。", hira: "ちょうさのたいしょうしゃをむさくいにえらぶ。", en: "Randomly select the subjects of the survey." },
  { word: "傾向", reading: "けいこう", romaji: "keikou", meaning: "tendency, trend", partOfSpeech: "noun", tags: ["society", "business"], jp: "若者の消費傾向に変化が見られる。", hira: "わかもののしょうひけいこうにへんかがみられる。", en: "Changes can be seen in the consumption trends of young people." },
  { word: "要因", reading: "よういん", romaji: "youin", meaning: "primary factor, main cause", partOfSpeech: "noun", tags: ["general"], jp: "業績悪化の要因を究明する。", hira: "ぎょうせきあっかのよういんをきゅうめいする。", en: "Investigate the primary factors behind the performance decline." },
  { word: "背景", reading: "はいけい", romaji: "haikei", meaning: "background, scenery, context", partOfSpeech: "noun", tags: ["society"], jp: "事件の背景には複雑な人間関係があった。", hira: "じけんのはいけいにはふくざつなにんげんかんけいがあった。", en: "There were complex human relationships in the background of the incident." },
  { word: "影響", reading: "えいきょう", romaji: "eikyou", meaning: "influence, effect", partOfSpeech: "noun", tags: ["general"], jp: "為替の変動が輸出に大きな影響を与える。", hira: "かわせのへんどうがゆしゅつにおおきなえいきょうをあたえる。", en: "Fluctuations in foreign exchange have a big effect on exports." },
  { word: "効果", reading: "こうか", romaji: "kouka", meaning: "effectiveness, effect", partOfSpeech: "noun", tags: ["health", "business"], jp: "この薬は痛みを和らげる効果がある。", hira: "このくすりはいたみをやわらげるこうかがある。", en: "This medicine is effective in relieving pain." },
  { word: "効率", reading: "こうりつ", romaji: "kouritsu", meaning: "efficiency", partOfSpeech: "noun", tags: ["business"], jp: "作業の効率を高めるツールを導入する。", hira: "さぎょうのこうりつをたかめるつーるをどうにゅうする。", en: "Introduce tools to enhance work efficiency." },
  { word: "性能", reading: "せいのう", romaji: "seinou", meaning: "performance, efficiency", partOfSpeech: "noun", tags: ["technology"], jp: "新型エンジンの性能をテストする。", hira: "しんがたえんじんのせいのうをてすとする。", en: "Test the performance of the new engine type." },
  { word: "機能", reading: "きのう", romaji: "kinou", meaning: "function, feature", partOfSpeech: "noun", tags: ["technology"], jp: "スマートフォンに新しい機能が追加された。", hira: "すまーとふぉんにあたらしいきのうがついかされた。", en: "A new feature was added to the smartphone." },
  { word: "構造", reading: "こうぞう", romaji: "kouzou", meaning: "structure, construction", partOfSpeech: "noun", tags: ["architecture", "science"], jp: "ビルの耐震構造を強化する。", hira: "びるのたいしんこうぞうをきょうかする。", en: "Reinforce the earthquake-resistant structure of the building." },
  { word: "組織", reading: "そしき", romaji: "soshiki", meaning: "organization, tissue", partOfSpeech: "noun", tags: ["business", "society"], jp: "組織の改革を断行する。", hira: "そしきのかいかくをだんこうする。", en: "Carry out the organizational reform." },
  { word: "制度", reading: "せいど", romaji: "seido", meaning: "system, institution", partOfSpeech: "noun", tags: ["society", "law"], jp: "新しい評価制度が導入された。", hira: "あたらしいひょうかせいどがどうにゅうされた。", en: "A new evaluation system was introduced." },
  { word: "方針", reading: "ほうしん", romaji: "houshin", meaning: "policy, course of action", partOfSpeech: "noun", tags: ["business", "politics"], jp: "今年度の基本方針を発表する。", hira: "こんねんどのきほんほうしんをはっぴょうする。", en: "Announce the basic policy for this fiscal year." },
  { word: "対策", reading: "たいさく", romaji: "taisaku", meaning: "measure, countermeasure", partOfSpeech: "noun", tags: ["general"], jp: "情報漏洩の対策を講じる。", hira: "じょうほうろうえいのたいさくをこうじる。", en: "Take countermeasures against information leakage." },
  { word: "対応", reading: "たいおう", romaji: "taiou", meaning: "response, dealing with", partOfSpeech: "noun", tags: ["business"], jp: "顧客からのクレームに迅速に対応する。", hira: "こきゃくからのくれーむにじんそくにたいおうする。", en: "Promptly respond to customer complaints." },
  { word: "措置", reading: "そち", romaji: "sochi", meaning: "measure, step", partOfSpeech: "noun", tags: ["law", "business"], jp: "緊急の安全措置を取る。", hira: "きんきゅうのあんぜんそちをとる。", en: "Take emergency safety measures." },
  { word: "処置", reading: "しょち", romaji: "shochi", meaning: "medical treatment, handling", partOfSpeech: "noun", tags: ["health"], jp: "傷口に応急処置を施す。", hira: "きずぐちにおうきゅうしょちをほどこす。", en: "Apply first aid treatment to the wound." },
  { word: "処理", reading: "しょり", romaji: "shori", meaning: "processing, disposal", partOfSpeech: "noun", tags: ["technology", "business"], jp: "大量のデータを瞬時に処理する。", hira: "たいりょうのでーたをしゅんじにしょりする。", en: "Process massive amounts of data instantaneously." },
  { word: "処罰", reading: "しょばつ", romaji: "shobatsu", meaning: "punishment, penalty", partOfSpeech: "noun", tags: ["law"], jp: "規則違反者には厳しい処罰が下る。", hira: "きそくいはんしゃにはきびしいしょばつがくだる。", en: "Severe punishments will be meted out to violators of regulations." },
  { word: "制裁", reading: "せいさい", romaji: "seisai", meaning: "sanction, restriction", partOfSpeech: "noun", tags: ["politics", "law"], jp: "経済制裁を発動する。", hira: "けいざいせいさいをはつどうする。", en: "Impose economic sanctions." },
  { word: "制限", reading: "せいげん", romaji: "seigen", meaning: "restriction, limitation", partOfSpeech: "noun", tags: ["general"], jp: "利用時間に制限を設ける。", hira: "りようじかんにせいげんをもうける。", en: "Place restrictions on usage time." },
  { word: "抑制", reading: "よくせい", romaji: "yokusei", meaning: "suppression, restraint", partOfSpeech: "noun", tags: ["mind", "society"], jp: "感情を抑制して冷静に話す。", hira: "かんじょうをよくせいしてれいせいにはなす。", en: "Suppress emotions and speak calmly." },
  { word: "防止", reading: "ぼうし", romaji: "boushi", meaning: "prevention, check", partOfSpeech: "noun", tags: ["safety"], jp: "再発防止策を徹底する。", hira: "さいはつぼうしさくをてっていする。", en: "Thoroughly enforce recurrence prevention measures." },
  { word: "警告", reading: "けいこく", romaji: "keikoku", meaning: "warning, alert", partOfSpeech: "noun", tags: ["safety"], jp: "危険を知らせる警告音が鳴り響いた。", hira: "きけんをしらせるけいこくおんがなりひびいた。", en: "A warning sound alerting to danger resonated." },
  { word: "監督", reading: "かんとく", romaji: "kantoku", meaning: "supervision, director", partOfSpeech: "noun", tags: ["business", "arts"], jp: "映画監督が舞台挨拶に登壇した。", hira: "えいがかんとくがぶあいさつにとうだんした。", en: "The movie director appeared on stage for greetings." },
  { word: "指導", reading: "しどう", romaji: "shidou", meaning: "guidance, coaching", partOfSpeech: "noun", tags: ["education", "sports"], jp: "専門家から適切な指導を受ける。", hira: "せんもんかからてきせつなしどうをうける。", en: "Receive appropriate guidance from an expert." },
  { word: "育成", reading: "いくせい", romaji: "ikusei", meaning: "nurturing, cultivation", partOfSpeech: "noun", tags: ["education", "business"], jp: "次世代のリーダーを育成する。", hira: "じせだいのりーだーをいくせいする。", en: "Nurture leaders of the next generation." },
  { word: "訓練", reading: "くんれん", romaji: "kunren", meaning: "training, drill", partOfSpeech: "noun", tags: ["sports", "emergency"], jp: "厳しい避難訓練を繰り返す。", hira: "きびしいひなんくんれんをくりかえす。", en: "Repeat rigorous evacuation training." },
  { word: "養成", reading: "ようせい", romaji: "yousei", meaning: "training, development", partOfSpeech: "noun", tags: ["education"], jp: "教員の養成講座が開講された。", hira: "きょういんのようせいこうざがかいこうされた。", en: "A teacher training course was inaugurated." },
  { word: "熟練", reading: "じゅくれん", romaji: "jukuren", meaning: "skill, dexterity", partOfSpeech: "noun", tags: ["craft", "work"], jp: "熟練の職人による手作業。", hira: "じゅくれんのしょくにんによるてざぎょう。", en: "Manual work done by a skilled artisan." },
  { word: "獲得", reading: "かくとく", romaji: "kakutoku", meaning: "acquisition, gaining", partOfSpeech: "noun", tags: ["business", "sports"], jp: "新規顧客を獲得するための戦略。", hira: "しんきこきゃくをかくとくするためのせんりゃく。", en: "Strategy for acquiring new customers." },
  { word: "達成", reading: "たっせい", romaji: "tassei", meaning: "achievement, attainment", partOfSpeech: "noun", tags: ["business", "growth"], jp: "年間売上目標を無事に達成した。", hira: "ねんかんうりあげもくひょうをぶじにたっせいした。", en: "Successfully achieved the annual sales target." },
  { word: "発揮", reading: "はっき", romaji: "hakki", meaning: "exhibition, display of power", partOfSpeech: "noun", tags: ["growth", "sports"], jp: "本番で実力を遺憾なく発揮する。", hira: "ほんばんでじつりょくをいかんなくはっきする。", en: "Fully display one's abilities during the actual event." },
  { word: "貢献", reading: "こうけん", romaji: "kouken", meaning: "contribution, services", partOfSpeech: "noun", tags: ["society", "business"], jp: "地域社会の発展に大きく貢献する。", hira: "ちいきしゃかいのはってんにおおきくこうけんする。", en: "Contribute greatly to the development of the local community." },
  { word: "犠牲", reading: "ぎせい", romaji: "gisei", meaning: "sacrifice, victim", partOfSpeech: "noun", tags: ["society"], jp: "多くの犠牲を払って勝利を得た。", hira: "おおくのぎせいをはらってしょうりをえた。", en: "Gained victory at the cost of many sacrifices." },
  { word: "負担", reading: "ふたん", romaji: "futan", meaning: "burden, responsibility", partOfSpeech: "noun", tags: ["economy", "daily"], jp: "費用の負担を公平に分担する。", hira: "ひようのふたんをこうへいにぶんたんする。", en: "Share the financial burden equitably." },
  { word: "責任", reading: "せきにん", romaji: "sekinin", meaning: "responsibility, liability", partOfSpeech: "noun", tags: ["society", "business"], jp: "リーダーとしての責任を果たす。", hira: "りーだーとしてのせきにんをはたす。", en: "Fulfill one's responsibility as a leader." },
  { word: "義務", reading: "ぎむ", romaji: "gimu", meaning: "obligation", partOfSpeech: "noun", tags: ["law"], jp: "法律上の義務を守る。", hira: "ほうりつじょうのぎむをまもる。", en: "Observe legal obligations." },
  { word: "免除", reading: "めんじょ", romaji: "menjo", meaning: "exemption, waiver", partOfSpeech: "noun", tags: ["finance", "law"], jp: "学費の免除制度を利用する。", hira: "がくひのめんじょせいどをりようする。", en: "Make use of the tuition exemption system." },
  { word: "特権", reading: "とっけん", romaji: "tokken", meaning: "privilege, special right", partOfSpeech: "noun", tags: ["society"], jp: "一部の人間にだけ特権を与えるべきではない。", hira: "いちぶのにんげんにだけとっけんをあたえるべきではない。", en: "Special privileges should not be granted only to certain individuals." },
  { word: "平等", reading: "びょうどう", romaji: "byoudou", meaning: "equality, impartiality", partOfSpeech: "na-adjective", tags: ["society"], jp: "すべての人に平等な機会を与える。", hira: "すべてのひとにびょうどうなきかいをあたえる。", en: "Provide equal opportunities to all people." },
  { word: "公平", reading: "こうへい", romaji: "kouhei", meaning: "fairness, justice", partOfSpeech: "na-adjective", tags: ["society"], jp: "公平な審査を心がける。", hira: "こうへいなしんさをこころがける。", en: "Bear in mind fair judging." },
  { word: "偏見", reading: "へんけん", romaji: "henken", meaning: "prejudice, bias", partOfSpeech: "noun", tags: ["mind", "society"], jp: "先入観や偏見を持たずに人と接する。", hira: "せんにゅうかんやへんけんをもたずにひととせっする。", en: "Interact with people without preconceptions or prejudice." },
  { word: "差別", reading: "さべつ", romaji: "sabetsu", meaning: "discrimination, distinction", partOfSpeech: "noun", tags: ["society"], jp: "不当な差別をなくす運動。", hira: "ふとうなさべつをなくすうんどう。", en: "Movement to eliminate unjust discrimination." },
  { word: "調和", reading: "ちょうわ", romaji: "chouwa", meaning: "harmony, concord", partOfSpeech: "noun", tags: ["society", "nature"], jp: "自然と都市の調和を目指す。", hira: "しぜんととしのちょうわをめざす。", en: "Aim for harmony between nature and cities." },
  { word: "対立", reading: "たいりつ", romaji: "tairitsu", meaning: "confrontation, opposition", partOfSpeech: "noun", tags: ["politics", "society"], jp: "二つのグループの間に対立が生じた。", hira: "ふたつのぐるーぷのあいだにたいりつがしょうじた。", en: "Confrontation arose between the two groups." },
  { word: "妥協", reading: "だきょう", romaji: "dakyou", meaning: "compromise, concession", partOfSpeech: "noun", tags: ["business", "politics"], jp: "お互いに歩み寄り妥協点を探る。", hira: "おたがいにあゆみよりだきょうてんをさぐる。", en: "Approach each other and search for a compromise point." },
  { word: "合意", reading: "ごうい", romaji: "goui", meaning: "agreement, consensus", partOfSpeech: "noun", tags: ["business", "politics"], jp: "双方が条件に合意した。", hira: "そうほうがじょうけんにごういした。", en: "Both sides reached an agreement on the terms." },
  { word: "協調", reading: "きょうちょう", romaji: "kyouchou", meaning: "cooperation, conciliation", partOfSpeech: "noun", tags: ["politics", "society"], jp: "国際協調を深めることが重要だ。", hira: "こくさいきょうちょうをふかめることがじゅうようだ。", en: "Deepening international cooperation is important." },
  { word: "独自", reading: "どくじ", romaji: "dokuji", meaning: "original, unique", partOfSpeech: "na-adjective", tags: ["general"], jp: "当社独自の技術を開発する。", hira: "とうしゃどくじのぎじゅつをかいはつする。", en: "Develop our company's unique technology." },
  { word: "特有", reading: "とくゆう", romaji: "tokuyuu", meaning: "characteristic, peculiar to", partOfSpeech: "na-adjective", tags: ["general"], jp: "この地域特有の文化を守る。", hira: "このちいきとくゆうのぶんかをまもる。", en: "Preserve the culture peculiar to this region." },
  { word: "共通", reading: "きょうつう", romaji: "kyoutsuu", meaning: "common, shared", partOfSpeech: "noun", tags: ["general"], jp: "共通の趣味を通じて親しくなる。", hira: "きょうつうのしゅみをとおしてしたしくなる。", en: "Become close through common hobbies." },
  { word: "普遍", reading: "ふへん", romaji: "fuhen", meaning: "universal, omnipresent", partOfSpeech: "na-adjective", tags: ["philosophy"], jp: "普遍的な真理を追求する。", hira: "ふへんてきなしんりをついきゅうする。", en: "Pursue universal truths." },
  { word: "特殊", reading: "とくしゅ", romaji: "tokushu", meaning: "special, unique", partOfSpeech: "na-adjective", tags: ["general"], jp: "特殊な訓練を受けた隊員。", hira: "とくしゅなくんれんをうけたたいいん。", en: "Members who underwent specialized training." },
  { word: "一般的", reading: "いっぱんてき", romaji: "ippanteki", meaning: "general, popular", partOfSpeech: "na-adjective", tags: ["general"], jp: "一般的な常識として知られている。", hira: "いっぱんてきなじょうしきとしてしられている。", en: "It is known as general common sense." },
  { word: "典型的", reading: "てんけいてき", romaji: "tenkeiteki", meaning: "typical, representative", partOfSpeech: "na-adjective", tags: ["general"], jp: "典型的な日本の朝ごはん。", hira: "てんけいてきなにほんのあさごはん。", en: "A typical Japanese breakfast." },
  { word: "抽象的", reading: "ちゅうしょうてき", romaji: "chuushouteki", meaning: "abstract", partOfSpeech: "na-adjective", tags: ["mind"], jp: "抽象的な議論を具体化する。", hira: "ちゅうしょうてきなぎろんをぐたいかする。", en: "Make abstract arguments concrete." },
  { word: "具体的", reading: "ぐたいてき", romaji: "gutaiteki", meaning: "concrete, specific", partOfSpeech: "na-adjective", tags: ["mind"], jp: "具体的な例を挙げて説明する。", hira: "ぐたいてきなれいをあげてせつめいする。", en: "Explain giving concrete examples." },
  { word: "合理的", reading: "ごうりてき", romaji: "gouriteki", meaning: "rational, logical", partOfSpeech: "na-adjective", tags: ["mind"], jp: "合理的な判断に基づき行動する。", hira: "ごうりてきなはんだんにもとづきこうどうする。", en: "Act based on rational judgment." },
  { word: "論理的", reading: "ろんりてき", romaji: "ronriteki", meaning: "logical, coherent", partOfSpeech: "na-adjective", tags: ["mind"], jp: "論理的に文章を組み立てる。", hira: "ろんりてきにぶんしょうをくみたてる。", en: "Construct sentences logically." },
  { word: "客観的", reading: "きゃっかんてき", romaji: "kyakkanteki", meaning: "objective, unbiased", partOfSpeech: "na-adjective", tags: ["mind"], jp: "客観的な視点から物事を見る。", hira: "きゃっかんてきなしてんからものごとをみる。", en: "Look at things from an objective perspective." },
  { word: "主観的", reading: "しゅかんてき", romaji: "shukanteki", meaning: "subjective", partOfSpeech: "na-adjective", tags: ["mind"], jp: "主観的な感想に過ぎない。", hira: "しゅかんてきなかんそうにすぎない。", en: "It is merely a subjective impression." },
  { word: "積極的", reading: "せっきょくてき", romaji: "sekkyokuteki", meaning: "positive, active, proactive", partOfSpeech: "na-adjective", tags: ["mind"], jp: "ボランティア活動に積極的に参加する。", hira: "ぼらんてぃあかつどうにせっきょくてきにさんかする。", en: "Actively participate in volunteer activities." },
  { word: "消極的", reading: "しょうきょくてき", romaji: "shoukyokuteki", meaning: "passive, reluctant", partOfSpeech: "na-adjective", tags: ["mind"], jp: "新しい試みに消極的な態度を取る。", hira: "あたらしいこころみにしょうきょくてきなたいどをとる。", en: "Take a passive attitude toward new trials." },
  { word: "肯定的", reading: "こうていてき", romaji: "kouteiteki", meaning: "affirmative, positive", partOfSpeech: "na-adjective", tags: ["mind"], jp: "提案に対して肯定的な返事をもらった。", hira: "ていあんにたいしてこうていてきなへんじをもらった。", en: "Received an affirmative response to the proposal." },
  { word: "否定的", reading: "ひていてき", romaji: "hiteiteki", meaning: "negative, pessimistic", partOfSpeech: "na-adjective", tags: ["mind"], jp: "彼の意見に否定的な見解を示す。", hira: "かれのいけんにひていてきなけんかいをしめす。", en: "Express a negative view on his opinion." },
  { word: "楽観的", reading: "らっかんてき", romaji: "rakkanteki", meaning: "optimistic", partOfSpeech: "na-adjective", tags: ["mind"], jp: "将来について楽観的な見通しを持つ。", hira: "しょうらいについてらっかんてきなみとおしをもつ。", en: "Have an optimistic outlook on the future." },
  { word: "悲観的", reading: "ひかんてき", romaji: "hikanteki", meaning: "pessimistic, gloomy", partOfSpeech: "na-adjective", tags: ["mind"], jp: "状況を悲観的に捉えすぎるのはよくない。", hira: "じょうきょうをひかんてきにとらえすぎるのはよくない。", en: "Taking the situation too pessimistically is not good." },
  { word: "慎重", reading: "しんちょう", romaji: "shinchou", meaning: "discreet, prudent, cautious", partOfSpeech: "na-adjective", tags: ["mind"], jp: "重大な契約には慎重な検討が必要だ。", hira: "じゅうだいなけいやくにはしんちょうなけんとうがひつようだ。", en: "Careful examination is necessary for important contracts." },
  { word: "軽率", reading: "けいそつ", romaji: "keisotsu", meaning: "rash, thoughtless, careless", partOfSpeech: "na-adjective", tags: ["mind"], jp: "軽率な発言を深く謝罪した。", hira: "けいそつなはつげんをふかくしゃざいした。", en: "Deeply apologized for the rash remarks." },
  { word: "柔軟", reading: "じゅうなん", romaji: "juunan", meaning: "flexible, supple, adaptable", partOfSpeech: "na-adjective", tags: ["mind"], jp: "変化に対して柔軟に対応する。", hira: "へんかにたいしてじゅうなんにたいおうする。", en: "Respond flexibly to changes." },
  { word: "頑固", reading: "がんこ", romaji: "ganko", meaning: "stubborn, obstinate", partOfSpeech: "na-adjective", tags: ["mind"], jp: "自分の意見を曲げない頑固な性格。", hira: "じぶんのいけんをまげないがんこなせいかく。", en: "A stubborn personality that will not bend its own opinion." },
  { word: "謙虚", reading: "けんきょ", romaji: "kenkyo", meaning: "modest, humble", partOfSpeech: "na-adjective", tags: ["personality"], jp: "成功しても謙虚な姿勢を忘れない。", hira: "せいこうしてもけんきょなしせいをわすれない。", en: "Do not forget a humble attitude even after succeeding." },
  { word: "傲慢", reading: "ごうまん", romaji: "gouman", meaning: "arrogant, insolent", partOfSpeech: "na-adjective", tags: ["personality"], jp: "傲慢な態度は反感を買う。", hira: "ごうまんなたいどははんかんをかう。", en: "An arrogant attitude invites antipathy." },
  { word: "寛容", reading: "かんよう", romaji: "kantou", meaning: "tolerant, broad-minded", partOfSpeech: "na-adjective", tags: ["personality"], jp: "他人の失敗に対して寛容であるべきだ。", hira: "たにんのしっぱいについてかんようであるべきだ。", en: "One should be tolerant towards others' mistakes." },
  { word: "厳格", reading: "げんかく", romaji: "genkaku", meaning: "strict, rigorous", partOfSpeech: "na-adjective", tags: ["personality"], jp: "校則が厳格に守られている。", hira: "こうそくがげんかくにまもられている。", en: "School rules are strictly observed." },
  { word: "忠実", reading: "ちゅうじつ", romaji: "chuujitsu", meaning: "faithful, loyal", partOfSpeech: "na-adjective", tags: ["personality"], jp: "原作に忠実な映画化が行われた。", hira: "げんさくにちゅうじつなえいがかをおこなわれた。", en: "A faithful movie adaptation of the original work was made." },
  { word: "誠実", reading: "せいじつ", romaji: "seijitsu", meaning: "sincere, honest", partOfSpeech: "na-adjective", tags: ["personality"], jp: "誠実な人柄が誰からも信頼される。", hira: "せいじつなひとがらリーダーからもて信頼される。", en: "A sincere character that is trusted by everyone." },
  { word: "熱心", reading: "ねっしん", romaji: "nesshin", meaning: "enthusiastic, eager", partOfSpeech: "na-adjective", tags: ["personality"], jp: "日本語の学習に熱心に取り組む。", hira: "にほんごのがくしゅうにねっしんにとりくむ。", en: "Eagerly engage in studying Japanese." },
  { word: "冷淡", reading: "れいたん", romaji: "reitan", meaning: "cold, indifferent", partOfSpeech: "na-adjective", tags: ["personality"], jp: "困っている人に冷淡な態度をとる。", hira: "こまっているひとにれいたんなたいどをとる。", en: "Take an indifferent attitude toward people in trouble." },
  { word: "迅速", reading: "じんそく", romaji: "jinsoku", meaning: "prompt, swift", partOfSpeech: "na-adjective", tags: ["general"], jp: "迅速な避難誘導が行われた。", hira: "じんそくなひなんゆうどうがおこなわれた。", en: "Prompt evacuation guidance was conducted." },
  { word: "緩やか", reading: "ゆるやか", romaji: "yuruyaka", meaning: "gentle, loose, slow", partOfSpeech: "na-adjective", tags: ["general"], jp: "緩やかな坂道をゆっくり登る。", hira: "ゆるやかなさかみちをゆっくりあるく。", en: "Slowly climb a gentle slope." },
  { word: "唐突", reading: "とうとつ", romaji: "toutotsu", meaning: "abrupt, sudden", partOfSpeech: "na-adjective", tags: ["general"], jp: "唐突な質問に驚いて言葉に詰まった。", hira: "とうとつなしつもんにおどろいてことばにつまった。", en: "Surprised by the abrupt question, words failed me." },
  { word: "徐々に", reading: "じょじょに", romaji: "jojoni", meaning: "gradually, step by step", partOfSpeech: "adverb", tags: ["general"], jp: "病状が徐々に快方へ向かっている。", hira: "びょうじょうがじょじょにかいほうへむかっている。", en: "The illness is gradually heading toward recovery." },
  { word: "直ちに", reading: "ただちに", romaji: "tadachini", meaning: "immediately, without delay", partOfSpeech: "adverb", tags: ["general"], jp: "指示を受けたら直ちに行動せよ。", hira: "しじをうけたらただちにこうどうせよ。", en: "Act immediately upon receiving instructions." },
  { word: "直前", reading: "ちょくぜん", romaji: "chokuzen", meaning: "just before", partOfSpeech: "noun", tags: ["time"], jp: "出発の直前に忘れ物に気づいた。", hira: "しゅっぱつのちょくぜんにわすれものにきづいた。", en: "Noticed the forgotten item just before departure." },
  { word: "直後", reading: "ちょくご", romaji: "chokugo", meaning: "immediately after", partOfSpeech: "noun", tags: ["time"], jp: "地震発生の直後に停電した。", hira: "じしんはっせいのちょくごにていでんした。", en: "A blackout occurred immediately after the earthquake hit." },
  { word: "終日", reading: "しゅうじつ", romaji: "shuujitsu", meaning: "all day long, all day", partOfSpeech: "noun", tags: ["time"], jp: "本日は終日雨が降り続いた。", hira: "ほんじつはしゅうじつあめがふりつづいた。", en: "Rain continued falling all day today." },
  { word: "終始", reading: "しゅうし", romaji: "shuushi", meaning: "from beginning to end", partOfSpeech: "adverb", tags: ["time"], jp: "会議は終始穏やかな雰囲気で進んだ。", hira: "かいぎはしゅうしおだやかなふんいきですすんだ。", en: "The meeting proceeded in a peaceful atmosphere from start to finish." },
  { word: "常に", reading: "つねに", romaji: "tsuneni", meaning: "always, constantly", partOfSpeech: "adverb", tags: ["time"], jp: "常に感謝の気持ちを忘れない。", hira: "つねにかんしゃのきもちをわすれない。", en: "Always never forget feelings of gratitude." },
  { word: "絶えず", reading: "たえず", romaji: "taezu", meaning: "unceasingly, incessantly", partOfSpeech: "adverb", tags: ["time"], jp: "絶えず新しい情報を取り入れる。", hira: "たえずあたらしいじょうほうをとりいれる。", en: "Incessantly take in new information." },
  { word: "頻繁", reading: "ひんぱん", romaji: "hinpan", meaning: "frequent, incessant", partOfSpeech: "na-adjective", tags: ["time"], jp: "頻繁にメールをチェックする。", hira: "ひんぱんにめーるをちぇっくする。", en: "Frequently check emails." }
];

// Clean duplicates
const seenN2 = new Set();
const cleanN2 = [];
for (const v of n2Vocab) {
  if (!seenN2.has(v.word)) {
    seenN2.add(v.word);
    cleanN2.push(v);
  }
}

// Extra N2 words if needed
const extraN2 = [
  { word: "稀", reading: "まれ", romaji: "mare", meaning: "rare, seldom", partOfSpeech: "na-adjective", tags: ["general"], jp: "このような現象は非常に稀だ。", hira: "このようなげんしょうはひじょうにまれだ。", en: "Such phenomena are extremely rare." },
  { word: "頻度", reading: "ひんど", romaji: "hindo", meaning: "frequency", partOfSpeech: "noun", tags: ["general"], jp: "点検の頻度を増やす。", hira: "てんけんのひんどをふやす。", en: "Increase inspection frequency." }
];

for (const ex of extraN2) {
  if (cleanN2.length < 100 && !seenN2.has(ex.word)) {
    seenN2.add(ex.word);
    cleanN2.push(ex);
  }
}

const formattedN2 = cleanN2.slice(0, 100).map((v, i) => ({
  id: `vocab-n2-${String(i + 1).padStart(3, '0')}`,
  level: "N2",
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

fs.writeFileSync(path.join(__dirname, '../data/vocabulary/n2.json'), JSON.stringify(formattedN2, null, 2), 'utf8');
console.log(`Wrote ${formattedN2.length} N2 vocabulary records.`);
