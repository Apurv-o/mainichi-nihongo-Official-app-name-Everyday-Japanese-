const fs = require('fs');
const path = require('path');

const n5 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n5.json'), 'utf8'));
const n4 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n4.json'), 'utf8'));
const n3 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n3.json'), 'utf8'));
const n2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n2.json'), 'utf8'));
const n1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji/n1.json'), 'utf8'));

const used = new Set([
  ...n5.map(x => x.k),
  ...n4.map(x => x.k),
  ...n3.map(x => x.k),
  ...n2.map(x => x.k),
  ...n1.map(x => x.k)
]);

console.log(`Currently used unique kanji: ${used.size}`);

// Additional Joyo Kanji for N3 (target 150+)
const n3Extra = [
  ["晴", "セイ / は・れる", "sei / ha-reru", "clear weather, fair", "晴天 (seiten - fine weather)", "明日は晴れるといいですね。", "あしたははれるといいですね。", "I hope it will be clear tomorrow."],
  ["曇", "ドン / くも・る", "don / kumo-ru", "cloudy, dim", "曇天 (donten - cloudy weather)", "空が少し曇ってきた。", "そらがすこしくもってきた。", "The sky has become a bit cloudy."],
  ["雪", "セツ / ゆき", "setsu / yuki", "snow", "降雪 (kousetsu - snowfall)", "静かに雪が降り積もる。", "しずかにゆきがふりつもる。", "Snow silently falls and accumulates."],
  ["風", "フウ、フ / かぜ", "fuu, fu / kaze", "wind, style, manner", "台風 (taifuu - typhoon)", "心地よい春の風が吹く。", "ここちよいはるのかぜがふく。", "A pleasant spring breeze blows."],
  ["波", "ハ / なみ", "ha / nami", "waves, billows", "電波 (denpa - radio wave)", "静かな波の音を聞く。", "しずかななみのおとをきく。", "Listen to the sound of gentle waves."],
  ["光", "コウ / ひか・る、ひかり", "kou / hika-ru, hikari", "light, ray", "日光 (nikkou - sunlight)", "部屋に明るい光が差し込む。", "へやにあかるいひかりがさしこむ。", "Bright light shines into the room."],
  ["星", "セイ、ショウ / ほし", "sei, shou / hoshi", "star, spot", "星座 (seiza - constellation)", "夜空に輝く星を見上げる。", "よぞらにかがやくほしをみあげる。", "Look up at the stars shining in the night sky."],
  ["晴", "セイ / は・らす", "sei / ha-rasu", "clear up", "秋晴れ (akibare - clear autumn weather)", "気持ちのいい秋晴れの日。", "きもちのいいあきばれのひ。", "A pleasant, clear autumn day."],
  ["雲", "ウン / くも", "un / kumo", "cloud", "雨雲 (amagumo - rain cloud)", "白い雲が空を流れる。", "しろいくもがそらをながれる。", "White clouds drift across the sky."],
  ["雷", "ライ / かみなり", "rai / kaminari", "thunder, lightning bolt", "落雷 (rakurai - lightning strike)", "遠くで雷の音が響いた。", "とおくでかみなりのあてがひびいた。", "The sound of thunder echoed in the distance."],
  ["電", "デン", "den", "electricity, lightning", "電話 (denwa - telephone)", "電車に乗って通勤する。", "でんしゃにのってつうきんする。", "Commute riding the train."],
  ["車", "シャ / くるま", "sha / kuruma", "car, wheel", "自動車 (jidousha - automobile)", "安全運転を心がける。", "あんぜんうんてんをこころがける。", "Keep safe driving in mind."],
  ["道", "ドウ、トウ / みち", "dou, tou / michi", "road, street, way, path", "道路 (douro - road)", "まっすぐな道を歩く。", "まっすぐなみちをあるく。", "Walk along a straight path."],
  ["通", "ツウ / とお・る、かよ・う", "tsuu / too-ru, kayo-u", "pass through, commute", "通勤 (tsuukin - commuting)", "毎日学校へ通う。", "まいにちがっこうへかよう。", "Commute to school every day."],
  ["歩", "ホ、ブ / ある・く、あゆ・む", "ho, bu / aru-ku, ayu-mu", "walk, counter for steps", "散歩 (sanpo - walk, stroll)", "夕方に公園を歩く。", "ゆうがたにこうえんをあるく。", "Walk in the park in the evening."],
  ["走", "ソウ / はし・る", "sou / hashi-ru", "run", "快走 (kaisou - running smoothly)", "朝の光の中を走る。", "あさのひかりのなかをはしる。", "Run through the morning light."],
  ["止", "シ / と・まる、と・める", "shi / to-maru, to-meru", "stop, halt", "停止 (teishi - suspension)", "赤信号で立ち止まる。", "あかしんごうでたちどまる。", "Stop at the red light."],
  ["立", "リツ / た・つ、た・てる", "ritsu / ta-tsu, ta-teru", "stand up, establish", "独立 (dokuritsu - independence)", "しっかりと大地に立つ。", "しっかりとだいちにたつ。", "Stand firmly on the earth."],
  ["座", "ザ / すわ・る", "za / suwa-ru", "sit, seat, gathering", "正座 (seiza - sitting upright)", "椅子に深く座る。", "いすにふかくすわる。", "Sit deeply in the chair."],
  ["眠", "ミン / ねむ・る、ねむ・い", "min / nemu-ru, nemu-i", "sleep, die", "睡眠 (suimin - sleep)", "十分な睡眠をとる。", "じゅうぶんなすいみんをとる。", "Get sufficient sleep."],
  ["起", "キ / お・きる、お・こす", "ki / o-kiru, o-kosu", "rouse, wake up, get up", "早起き (hayaoki - early rising)", "毎朝六時に起きる。", "まいあさろくじにおきる。", "Wake up at six every morning."],
  ["寝", "シン / ね・る、ね・かす", "shin / ne-ru, ne-kasu", "lie down, sleep", "寝室 (shinshitsu - bedroom)", "夜は早めに寝る。", "よるははやめにねる。", "Go to bed early at night."],
  ["遊", "ユウ / あそ・ぶ", "yuu / aso-bu", "play", "遊園地 (yuuenchi - amusement park)", "休日に友達と楽しく遊ぶ。", "きゅうじつにともだちとたのしくあそぶ。", "Have fun playing with friends on holidays."],
  ["働", "ドウ / はたら・く", "dou / hatara-ku", "work, labor", "労働 (roudou - manual labor)", "社会のために一生懸命働く。", "しゃかいのためにいっしょうけんめいはたらく。", "Work hard for the sake of society."],
  ["買", "バイ / か・う", "bai / ka-u", "buy", "売買 (baibai - buying and selling)", "スーパーで買い物を楽しむ。", "すーぱーでかいものをたのしむ。", "Enjoy shopping at the supermarket."]
];

// Additional Joyo Kanji for N2 (target 150+)
const n2Extra = [
  ["均", "キン / なら・す", "kin / nara-su", "level, average", "平均 (heikin - average)", "テストの平均点を計算する。", "てすとのへいきんてんをけいさんする。", "Calculate the average test score."],
  ["衡", "コウ", "kou", "equilibrium, scale, weigh", "均衡 (kinkou - equilibrium)", "全体のバランスと均衡を保つ。", "ぜんたいのばらんすときんこうをたもつ。", "Maintain overall balance and equilibrium."],
  ["兼", "ケン / か・ねる", "ken / ka-neru", "concurrently, combine", "兼任 (kennin - concurrent post)", "二つの重要な役職を兼ねる。", "ふたつのじゅうようなやくしょくをかねる。", "Concurrently hold two important posts."],
  ["兼", "ケン / か・ねる", "ken / ka-neru", "combine", "兼用 (ken'you - combined use)", "男女兼用のデザイン。", "だんじょけんようのでざいん。", "Unisex design."],
  ["兼", "ケン / か・ねる", "ken / ka-neru", "concurrent", "兼業 (kengyou - side job)", "本業と兼業を両立する。", "ほんぎょうとけんぎょうをりょうりつする。", "Balance main job and side business."],
  ["兼", "ケン / か・ねる", "ken / ka-neru", "double", "兼用 (ken'you - dual use)", "晴雨兼用傘を使う。", "せいうけんようがさをつかう。", "Use an umbrella for both rain and sun."],
  ["兼", "ケン", "ken", "concurrent", "兼備 (kenbi - possess both)", "知性と美貌を兼備する。", "ちせいとびぼうをけんびする。", "Possess both intelligence and beauty."],
  ["幅", "フク / はば", "fuku / haba", "width, breadth, scale", "大幅 (oohaba - substantial)", "業務の効率が大幅に向上した。", "ぎょうむのこうりつがおおはばにこうじょうした。", "Operational efficiency substantially improved."],
  ["厚", "コウ / あつ・い", "kou / atsu-i", "thick, heavy, kind", "濃厚 (noukou - rich, dense)", "本を厚い辞書で調べる。", "ほんをあついじしょでしらべる。", "Look up in a thick dictionary."],
  ["薄", "ハク / うす・い", "haku / usu-i", "dilute, thin, weak", "希薄 (kihaku - thin, diluted)", "薄い氷の上を慎重に歩く。", "うすいこおりのうえをしんちょうにあるく。", "Walk cautiously over thin ice."],
  ["軟", "ナン / やわら・かい", "nan / yawara-kai", "soft, flexible", "柔軟 (juunan - flexible)", "柔軟な思考で物事に対処する。", "じゅうなんなしこうでものごとについしょする。", "Handle matters with flexible thinking."],
  ["硬", "コウ / かた・い", "kou / kata-i", "stiff, hard", "強硬 (kyoukou - uncompromising)", "硬い決意を胸に秘める。", "かたいけついをむねにひめる。", "Harbor firm determination in one's chest."],
  ["乾", "カン / かわ・く、かわ・かす", "kan / kawa-ku, kawa-kasu", "drought, dry", "乾燥 (kansou - dryness)", "洗濯物が太陽でカラッと乾く。", "せんたくものがたいようでからっとかわく。", "Laundry dries crisply in the sun."],
  ["湿", "シツ / しめ・る、しめ・す", "shitsu / shime-ru, shime-su", "damp, wet, moist", "湿度 (shitsudo - humidity)", "梅雨の季節で空気が湿る。", "つゆのきせつでくうきがしめる。", "The air is damp in the rainy season."],
  ["燥", "ソウ / はしゃ・ぐ", "sou / hasha-gu", "parch, dry up", "乾燥 (kansou - dry, dehydrate)", "冬の乾燥した空気に気をつける。", "ふゆのかんそうしたくうきにきをつける。", "Beware of the dry winter air."],
  ["透", "トウ / す・く、す・かす", "tou / su-ku, su-kasu", "transparent, penetrate", "透明 (toumei - transparent)", "透明度の高い清らかな水。", "とうめいどのたかいきよらかなみず。", "Pure water with high transparency."],
  ["濁", "ダク / にご・る、にご・す", "daku / nigo-ru, nigo-su", "voiced, impurity, muddy", "混濁 (kondaku - turbid, muddy)", "川の水が雨で少し濁る。", "かわのみずがあめですこしにごる。", "River water gets slightly muddy from rain."],
  ["浄", "ジョウ / きよ・める", "jou / kiyo-meru", "clean, purify", "洗浄 (senjou - washing, cleaning)", "水を綺麗に浄化する装置。", "みずをきれいにじょうかするそうち。", "An apparatus that purifies water cleanly."],
  ["汚", "オ / よご・す、きたな・い", "o / yogo-su, kitana-i", "dirty, pollute, defile", "汚染 (osen - pollution)", "大気汚染の防止策を講じる。", "たいきおせんのぼうしさくをこうじる。", "Take measures to prevent air pollution."],
  ["染", "セン / そ・める、し・みる", "sen / so-meru, shi-miru", "dye, color, taint", "感染 (kansen - infection)", "美しい布を藍色に染める。", "うつくしいぬのをあいいろにそめる。", "Dye beautiful cloth in indigo."],
  ["清", "セイ、ショウ / きよ・い", "sei, shou / kiyo-i", "pure, clean, clear", "清潔 (seiketsu - clean, hygienic)", "清らかな心で日々を過ごす。", "きよらかなこころでひびをすごす。", "Spend one's days with a pure mind."],
  ["潔", "ケツ / いさぎよ・い", "ketsu / isagiyo-i", "pure, undefiled, righteous", "簡潔 (kanketsu - concise)", "簡潔に分かりやすくまとめる。", "かんけつにわかりやすくまとめる。", "Summarize concisely and clearly."],
  ["濁", "ダク", "daku", "voiced", "濁音 (dakuon - voiced sound)", "日本語の濁音の発音を学ぶ。", "にほんごのだくおんのはつおんをまなぶ。", "Learn the pronunciation of voiced Japanese sounds."],
  ["澄", "チョウ / す・む、す・ます", "chou / su-mu, su-masu", "lucid, clear, serene", "清澄 (seichou - clear, lucid)", "澄んだ青空がどこまでも広がる。", "すんだあおぞらがどこまでもひろがる。", "Clear blue skies stretch endlessly."],
  ["曇", "ドン", "don", "cloudy", "曇天 (donten - cloudy sky)", "曇天の空を見つめる。", "どんてんのそらをみつめる。", "Gaze upon the cloudy sky."],
  ["霧", "ム / きり", "mu / kiri", "fog, mist", "濃霧 (noumu - dense fog)", "朝の深い霧が立ち込める。", "あさのふかいきりがたちこめる。", "Dense morning mist hangs in the air."],
  ["霜", "ソウ / しも", "sou / shimo", "frost", "初霜 (hatsushimo - first frost)", "冬の朝に草木に霜が降りる。", "ふゆのあさにくさきにしもがおりる。", "Frost forms on trees and grass on winter mornings."],
  ["露", "ロ / つゆ", "ro / tsuyu", "dew", "夜露 (yotsuyu - night dew)", "草花が朝露に濡れている。", "くさばながあさつゆにぬれている。", "Flowering plants are wet with morning dew."],
  ["雷", "ライ", "rai", "thunder", "雷雨 (raiu - thunderstorm)", "激しい雷雨が夕方に通り過ぎた。", "はげしいらいうがゆうがたにとおりすぎた。", "A fierce thunderstorm passed in the evening."],
  ["震", "シン / ふる・える", "shin / furu-eru", "shake, quake, tremble", "地震 (jishin - earthquake)", "地震への備えを日頃から確認する。", "じしんへのそなえをひごろからかくにんする。", "Regularly verify earthquake readiness."],
  ["揺", "ヨウ / ゆ・れる、ゆ・らす", "you / yu-reru, yu-rasu", "swing, shake, vibrate", "動揺 (douyou - disturbance)", "風に揺れる木々の葉を眺める。", "かぜにゆれるきぎのはをながめる。", "Gaze upon leaves of trees swaying in the wind."],
  ["波", "ハ", "ha", "wave", "余波 (yoha - aftermath)", "事件の余波が広がる。", "じけんのよはがひろがる。", "Aftermath of the incident spreads."],
  ["浪", "ロウ", "rou", "wandering, waves, billow", "浪費 (rouhi - waste, dissipation)", "時間とお金を浪費しない。", "じかんとおかねをろうひしない。", "Do not squander time and money."],
  ["沸", "フツ / わ・く、わ・かす", "futsu / wa-ku, wa-kasu", "seethe, boil, ferment", "沸騰 (futtou - boiling)", "お湯をやかんでしっかりと沸かす。", "おゆをやかんでしっかりわかす。", "Boil water thoroughly in the kettle."],
  ["騰", "トウ", "tou", "inflation, rise, leap", "沸騰 (futtou - seething)", "物価が高騰する傾向にある。", "ぶっかがこうとうするけいこうにある。", "Prices tend to inflate steeply."],
  ["溶", "ヨウ / と・ける、と・かす", "you / to-keru, to-kasu", "melt, dissolve, thaw", "溶液 (youeki - solution)", "砂糖が温かいコーヒーに溶ける。", "さとうがあたたかいこーひーにとける。", "Sugar dissolves in warm coffee."],
  ["融", "ユウ", "yuu", "dissolve, melt", "金融 (kin'yuu - financing)", "国際的な金融市場の動きを注視する。", "こくさいてきなきんゆうしじょうのうごきをちゅうしする。", "Closely observe movements in international financial markets."],
  ["液", "エキ", "eki", "fluid, liquid, juice", "液体 (ekitai - liquid)", "透明な液体を試験管に入れる。", "とうめいなえきたいをしけんかん红いれる。", "Pour transparent liquid into a test tube."],
  ["滴", "テキ / しずく、したた・る", "teki / shizuku, shitata-ru", "drip, drop", "水滴 (suiteki - water drop)", "窓ガラスに雨の滴がつく。", "まどがらすにあめのしずくがつく。", "Raindrops form on the window glass."],
  ["湿", "シツ", "shitsu", "damp", "加湿 (kashitsu - humidification)", "加湿器をつけて湿度を保つ。", "かしつきをつけてしつどをたもつ。", "Turn on the humidifier to maintain humidity."],
  ["浸", "シン / ひた・る、ひた・す", "shin / hita-ru, hita-su", "immersed, soak", "浸透 (shintou - permeation)", "新しい文化が人々に浸透する。", "あたらしいぶんかがひとびとにしんとうする。", "New culture permeates through people."],
  ["潤", "ジュン / うるお・う、うるお・す", "jun / uruo-u, uruo-su", "wet, profit, enrich", "潤い (uruoi - moisture, richness)", "豊かな緑が生活に潤いを与える。", "ゆたかなみどりがせいかつにうるおいをあたえる。", "Abundant greenery brings richness to life."],
  ["渇", "カツ / かわ・く", "katsu / kawa-ku", "thirst, dry up", "渇望 (katsubou - craving)", "喉の渇きを冷水で潤す。", "のどのかわきをれいすいでうるおす。", "Quench throat thirst with cold water."],
  ["涯", "ガイ", "gai", "horizon, shore", "生涯 (shougai - one's lifetime)", "生涯をかけて研究に打ち込む。", "しょうがいをかけてけんきゅうにうちこむ。", "Devote one's lifetime to research."],
  ["涯", "ガイ", "gai", "shore", "境涯 (kyougai - circumstance)", "平穏な境涯を送る。", "へいおんなきょうがいをおくる。", "Lead a peaceful life."],
  ["淵", "エン / ふち", "en / fuchi", "abyss, deep water, pool", "深淵 (shin'en - abyss)", "知識の深淵を探求する。", "ちしきのしんえんをたんきゅうする。", "Explore the abyss of knowledge."],
  ["渚", "ショ / なぎさ", "sho / nagisa", "strand, beach, shore", "渚 (nagisa - water's edge)", "波が寄せる渚を素足で歩く。", "なみがよせるなぎさをすあしであるく。", "Walk barefoot on the shore where waves lap."],
  ["滝", "ロウ / たき", "rou / taki", "waterfall, cascade", "瀑布 (bakufu - waterfall)", "山奥の雄大な滝を見に行く。", "やまおくのゆうだいなたきをみにいく。", "Go to see the magnificent waterfall deep in the mountains."],
  ["湧", "ユウ / わ・く", "yuu / wa-ku", "gush, spring forth", "湧水 (yuusui - spring water)", "清らかな湧水を水筒に汲む。", "きよらかなゆうすいをついとうにくむ。", "Fill the flask with pure spring water."],
  ["渦", "カ / うず", "ka / uzu", "whirlpool, eddy, vortex", "渦中 (kachuu - vortex of events)", "激流に大きな渦ができる。", "げきりゅうにおおきなうずができる。", "A big whirlpool forms in the rapid stream."],
  ["潮", "チョウ / しお", "chou / shio", "tide, salt water, opportunity", "満潮 (manchou - high tide)", "潮の満ち引きを観察する。", "しおのみちひきをかんさつする。", "Observe the ebb and flow of tides."],
  ["漂", "ヒョウ / ただよ・う", "hyou / tadayo-u", "drift, float", "漂流 (hyouryuu - drifting)", "心地よい花の香りが漂う。", "ここちよいはなのかおりがただよう。", "A pleasant floral scent wafts through."],
  ["潜", "セン / もぐ・る、ひそ・む", "sen / mogu-ru, hiso-mu", "submerge, hide, lurk", "潜在 (senzai - latency, potential)", "海深く潜って魚を観察する。", "うみふかくもぐってさかなをかんさつする。", "Dive deep into the sea to observe fish."],
  ["漠", "バク", "baku", "vague, desert, obscure", "砂漠 (sabaku - desert)", "広大な砂漠を旅する。", "こうだいなさばくをたびする。", "Travel through the vast desert."],
  ["漠", "バク", "baku", "vast", "漠然 (bakuzen - vague)", "漠然とした不安を解消する。", "ばくぜんとしたふあんをかいしょうする。", "Clear away vague anxieties."],
  ["潟", "セキ / かた", "seki / kata", "lagoon", "干潟 (higata - tidal flat)", "干潟に野鳥が集まる。", "ひがたにやちょうがあつまる。", "Wild birds gather on the tidal flats."],
  ["濁", "ダク / にご・る", "daku / nigo-ru", "muddy", "清濁 (seidaku - good and evil)", "清濁を併せ呑む度量。", "せいだくをあわせのむどりょう。", "Generosity that accepts both the pure and the impure."],
  ["濫", "ラン / みだ・りに", "ran / mida-rini", "overflow, excessive", "氾濫 (hanran - overflowing)", "情報の氾濫に惑わされない。", "じょうほうのはんらんにまどわされない。", "Do not be misled by the overflow of information."],
  ["濯", "タク", "taku", "laundry, wash", "洗濯 (sentaku - washing clothes)", "朝一番に洗濯物を干す。", "あさいちばんにせんたくものをほす。", "Hang the laundry out first thing in the morning."],
  ["瀬", "ライ / せ", "rai / se", "rapids, current, shallows", "早瀬 (hayase - swift current)", "清流の浅瀬を渡る。", "せいりゅうのあさせをわたる。", "Cross the shallows of the clear stream."]
];

// Additional Joyo Kanji for N1 (target 150+)
const n1Extra = [
  ["懇", "コン / ねんご・ろ", "kon / nengo-ro", "sociable, kind, courteous", "懇談 (kondan - informal talk)", "親しく懇談する機会を設ける。", "したしくこんだんするきかいをもうける。", "Set up an opportunity for cordial conversation."],
  ["懇", "コン", "kon", "earnest", "懇願 (kongan - earnest entreaty)", "計画の見直しを懇願する。", "けいかくのみなおしをこんがんする。", "Earnestly plead for revision of the plan."],
  ["懇", "コン", "kon", "friendly", "懇親 (konshin - social gathering)", "懇親会で交流を深める。", "こんしんかいでこうりゅうをふかめる。", "Deepen exchanges at the social gathering."],
  ["懇", "コン", "kon", "polite", "懇切 (konsetsu - kind, detailed)", "懇切丁寧に説明する。", "こんせつていねいにせつめいする。", "Explain in a kind and detailed manner."],
  ["慶", "ケイ / よろこ・び", "kei / yoroko-bi", "rejoice, congratulate", "慶賀 (keiga - celebration)", "創立記念日を慶賀する。", "そうりつきねんびをけいがする。", "Celebrate the founding anniversary."],
  ["弔", "チョウ / とむら・う", "chou / tomura-u", "condolences, mourn", "慶弔 (keichou - congratulations and condolences)", "慶弔の礼儀を正しく学ぶ。", "けいちょうのれいぎをただしくまなぶ。", "Learn proper etiquette for celebrations and condolences."],
  ["弔", "チョウ", "chou", "mourn", "弔意 (choui - condolence)", "深く弔意を表する。", "ふかくちょういをつひょうする。", "Express deep condolences."],
  ["悼", "トウ / いた・む", "tou / ita-mu", "grieve, lament, mourn", "追悼 (tsuitou - memorial, mourning)", "亡き友人を追悼する。", "なきゆうじんをついとうする。", "Mourn a deceased friend."],
  ["悔", "カイ / く・いる、くや・しい", "kai / ku-iru, kuya-shii", "repent, regret", "後悔 (koukai - regret)", "後悔のないように全力で挑む。", "こうかいのないようにぜんりょくでいどむ。", "Challenge with all might so as not to have regrets."],
  ["憾", "カン", "kan", "remorse, regret", "遺憾 (ikan - regrettable)", "遺憾の意を公式に表明する。", "いかんのいをこうしきにひょうめいする。", "Formally express feelings of regret."],
  ["慄", "リツ / おのの・く", "ritsu / onono-ku", "shudder, tremble", "戦慄 (senritsu - shuddering)", "あまりの恐怖に戦慄する。", "あまりのきょうふにせんりつする。", "Shudder in sheer terror."],
  ["憧", "ショウ / あこが・れる", "shou / akoga-reru", "yearn after, admire", "憧憬 (shoukei - admiration)", "都会の暮らしに憧れる。", "とかいのくらしにあこがれる。", "Yearn after city life."],
  ["憐", "レン / あわ・れむ", "ren / awa-remu", "pity, have mercy", "憐憫 (renbin - pity, compassion)", "困窮する人に憐憫の情を寄せる。", "こんきゅうするひとにれんびんのじょうをよせる。", "Extend feelings of compassion to people in distress."],
  ["憫", "ビン / あわ・れむ", "bin / awa-remu", "pity, sympathize", "憐憫 (renbin - sympathy)", "深い慈悲と憐憫の心を持つ。", "ふかいじひとれんびんのこころをもつ。", "Possess a heart of deep mercy and compassion."],
  ["愉", "ユ / たの・しい", "yu / tano-shii", "pleasure, delight", "愉快 (yukai - pleasant, delightful)", "愉快な仲間と楽しい時間を過ごす。", "ゆかいななかまとたのしいじかんをすごす。", "Spend fun time with pleasant companions."],
  ["憬", "ケイ / あこが・れる", "kei / akoga-reru", "yearn for, aspire", "憧憬 (shoukei - yearning)", "遥かなる理想への憧憬を抱く。", "はるかなるりそうへのしょうけいをいだく。", "Harbor yearning toward distant ideals."],
  ["惧", "ク / おそ・れる", "ku / oso-reru", "dread, fear", "危惧 (kigu - apprehension)", "環境の悪化を深刻に危惧する。", "かんきょうのあっかをしんこくにきぐする。", "Deeply apprehend environmental deterioration."],
  ["慄", "リツ", "ritsu", "tremble", "慄然 (ritsuzen - terrified)", "冷酷な現実に慄然とする。", "れいこくなげんじつにりつぜんとする。", "Struck with horror at the cruel reality."],
  ["慨", "ガイ", "gai", "sigh, lament", "感慨 (kankai - deep emotion)", "感慨深い思いで昔を振り返る。", "かんかいぶかいおもいでむかしをふりかえる。", "Look back on the past with deep emotion."],
  ["憤", "フン / いきどお・る", "fun / ikidoo-ru", "be aroused, indignant", "憤慨 (fungai - indignation)", "不正行為に強く憤慨する。", "ふせいこういにつよくふんがいする。", "Strongly indignant at malpractice."],
  ["慨", "ガイ", "gai", "indignant", "憤慨 (fungai - resentment)", "理不尽な対応に激しく憤慨する。", "りふじんなたいおうにはげしくふんがいする。", "Vigorously resent unreasonable treatment."],
  ["惰", "ダ", "da", "lazy, sluggish", "怠惰 (taida - laziness)", "怠惰な生活を改める。", "たいだなせいかつをあらためる。", "Reform a lazy lifestyle."],
  ["怠", "タイ / おこた・る、なま・ける", "tai / okota-ru, nama-keru", "neglect, lazy", "怠慢 (taiman - negligence)", "職務怠慢を厳しく戒める。", "しょくむたいまんをきびしくいましめる。", "Strictly admonish negligence of duty."],
  ["悛", "シュン / あらた・める", "shun / arata-meru", "amend, repent", "改悛 (kaishun - repentance)", "過ちを認めて改悛の情を示す。", "あやまちをみとめてかいしゅんのじょうをしめす。", "Acknowledge mistakes and show genuine repentance."],
  ["悸", "キ", "ki", "palpitation, pulsation", "動悸 (douki - heart palpitation)", "緊張のあまり激しい動悸がする。", "きんちょうのあまりはげしいどうきがする。", "Experience intense heart palpitations from extreme tension."],
  ["悶", "モン / もだ・える", "mon / moda-eru", "be in agony, worry", "悶々 (monmon - in anguish)", "一人で悶々と悩み続ける。", "ひとりでもんもんとなやみつづける。", "Continue worrying in solitude and anguish."],
  ["懲", "チョウ / こ・りる、こ・らす", "chou / ko-riru, ko-rasu", "penalize, chastise", "懲戒 (choukai - disciplinary punishment)", "規律違反に対して厳正な懲戒を行う。", "きりついはんにたいしてげんせいなちょうかいをおこなう。", "Conduct strict disciplinary action against regulation breaches."],
  ["戒", "カイ / いまし・める", "kai / imashi-meru", "commandment, admonish", "警戒 (keikai - vigilance)", "油断を戒めて集中する。", "ゆだんをいましめてしゅうちゅうする。", "Admonish against carelessness and stay focused."],
  ["戒", "カイ", "kai", "warning", "戒律 (kairitsu - religious precept)", "厳しい戒律を忠実に守る。", "きびしいかいりつをちゅうじつにまもる。", "Faithfully keep strict religious precepts."],
  ["懲", "チョウ", "chou", "punish", "懲罰 (choubatsu - punishment)", "悪質な行為に懲罰を下す。", "あくしつなこういにちょうばつをくだす。", "Mete out punishment for malicious acts."],
  ["鬱", "ウツ", "utsu", "luxuriant, depressed", "暗鬱 (an'utsu - gloomy)", "暗鬱な空気を吹き飛ばす明るい笑顔。", "あんうつなくうきをふきとばすあかるいえがお。", "A bright smile that blows away the gloomy atmosphere."],
  ["怨", "エン、オン / うら・む", "en, on / ura-mu", "grudge, resentment", "怨嗟 (ensa - bitter complaint)", "他者に対する怨念を捨てる。", "たしゃにたいするおんねんをすてる。", "Cast away deep grudges against others."],
  ["恨", "コン / うら・む、うら・めしい", "kon / ura-mu, ura-meshii", "regret, grudge, resent", "悔恨 (kaikon - remorse)", "過去の過ちへの悔恨の涙。", "かこのあやまちへのかいこんのなみだ。", "Tears of remorse for past mistakes."],
  ["憾", "カン", "kan", "regret", "遺憾 (ikan - deploring)", "誠に遺憾な事態が発生した。", "まことにいかんなじたいがはっせいした。", "A truly regrettable situation occurred."],
  ["慕", "ボ / した・う", "bo / shita-u", "pining, yearn for, adore", "敬慕 (keibo - love and respect)", "尊敬する恩師を深く慕う。", "そんけいするおんしをふかくしたう。", "Deeply adore and respect one's revered teacher."],
  ["憑", "ヒョウ / つ・く、たの・む", "hyou / tsu-ku, tano-mu", "possessed, depend on", "憑依 (hyoui - spirit possession)", "何かに憑かれたように夢中で描く。", "なにかにつかれたようにむちゅうでえがく。", "Draw engrossed as if possessed by something."],
  ["慧", "ケイ、エ", "kei, e", "wise, shrewd", "知慧 (chie - wisdom)", "研ぎ澄まされた慧眼を持つ批評家。", "とぎすまされたけいがんをもつひひょうか。", "A critic possessing a sharpened discerning eye."],
  ["捷", "ショウ", "shou", "victory, fast, agile", "俊捷 (shunshou - nimble, agile)", "迅速かつ敏捷に行動する。", "じんそくかつびんしょうにこうどうする。", "Act promptly and with agility."],
  ["慄", "リツ", "ritsu", "shiver", "戦慄 (senritsu - trembling)", "冷徹な真実に思わず戦慄した。", "れいてつなしんじつにおもわずせんりつした。", "Involuntarily trembled at the ruthless truth."],
  ["憊", "ハイ", "hai", "exhausted, fatigued", "疲憊 (hihai - extreme exhaustion)", "心身ともに疲憊した状態。", "しんしんともにひはいしたじょうたい。", "A state of extreme exhaustion in both mind and body."],
  ["憚", "タン / はばか・る", "tan / habaka-ru", "hesitate, fear", "忌憚 (kitan - reserve, hesitation)", "忌憚のないご意見をお聞かせください。", "きたんのないごいけんをおきかせください。", "Please share your frank, unreserved opinion."],
  ["恍", "コウ", "kou", "unclear, senile, entranced", "恍惚 (koukotsu - ecstasy, trance)", "素晴らしい演奏に恍惚となる。", "すばらしいえんそうにこうこつとなる。", "Entranced by the magnificent musical performance."],
  ["惚", "コツ / ほ・れる、ぼ・ける", "kotsu / ho-reru, bo-keru", "fall in love with, grow senile", "恍惚 (koukotsu - rapture)", "美しい夕焼けに見惚れる。", "うつくしいゆうやけにみほれる。", "Enchanted by the beautiful sunset."],
  ["憫", "ビン", "bin", "pity", "憐憫 (renbin - pity)", "人々の苦しみに深く同情する。", "ひとびとのくるしみにふかくどうじょうする。", "Deeply sympathize with people's sufferings."],
  ["愉", "ユ", "yu", "delight", "愉快 (yukai - pleasant)", "軽妙なトークで人々を愉快にさせる。", "けいみょうなとーくでひとびとをゆかいにさせる。", "Delight people with witty and light conversation."],
  ["惺", "セイ", "sei", "realize, clear", "惺々 (seisei - alert, lucid)", "澄み渡る心で惺々とした境地に至る。", "すみわたるこころでせいせいとしたきょうちにいたる。", "Attain a lucid and serene state with a clear mind."],
  ["謐", "ヒツ", "hitsu", "peaceful, quiet", "静謐 (seihitsu - stillness, tranquility)", "古寺の静謐な空気に包まれる。", "こじのせいひつなくうきにつつまれる。", "Enveloped in the peaceful stillness of an ancient temple."],
  ["傲", "ゴウ", "gou", "proud", "傲岸 (gougan - haughty)", "傲岸不遜な態度を改める。", "ごうがんふそんなたいどをあらためる。", "Mend a haughty and arrogant demeanor."],
  ["僻", "ヘキ / ひが・む", "heki / higa-mu", "prejudice, rural, bias", "僻地 (hekichi - remote area)", "医療が届きにくい僻地を支援する。", "いりょうがとどきにくいへきちをしえんする。", "Support remote regions where medical access is difficult."],
  ["侃", "カン", "kan", "strong, straight, outspoken", "侃々 (kankan - outspoken)", "侃々諤々の熱い議論を交わす。", "かんかんがくがくのあついぎろんをかわす。", "Engage in heated, outspoken and spirited debate."]
];

function appendExtras(dataset, extras, level) {
  for (const row of extras) {
    const k = row[0];
    if (used.has(k)) continue;
    used.add(k);
    dataset.push({
      k, lvl: level, h: row[1], r: row[2], m: row[3], ex: row[4], s_jp: row[5], s_hira: row[6], s_en: row[7],
      source: "JLPT-aligned Study Reference"
    });
  }
}

appendExtras(n3, n3Extra, 'N3');
appendExtras(n2, n2Extra, 'N2');
appendExtras(n1, n1Extra, 'N1');

fs.writeFileSync(path.join(__dirname, '../data/kanji/n3.json'), JSON.stringify(n3, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../data/kanji/n2.json'), JSON.stringify(n2, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../data/kanji/n1.json'), JSON.stringify(n1, null, 2), 'utf8');

console.log(`Final Counts:`);
console.log(`N5: ${n5.length}`);
console.log(`N4: ${n4.length}`);
console.log(`N3: ${n3.length}`);
console.log(`N2: ${n2.length}`);
console.log(`N1: ${n1.length}`);
console.log(`Total: ${n5.length + n4.length + n3.length + n2.length + n1.length}`);
