const fs = require('fs');
const path = require('path');

const n3Grammar = [
  {
    pattern: "〜に関して (ni kanshite)",
    meaning: "regarding; about; in relation to",
    explanation: "Used in formal speech or writing to introduce a subject or topic of discussion.",
    formation: "Noun + に関して / に関する + Noun",
    examples: [{ jp: "この問題に関して、詳しい調査を行います。", hira: "このもんだいにかんして、くわしいちょうさをおこないます。", en: "We will conduct a detailed investigation regarding this issue." }],
    commonMistakes: "More formal than について; do not confuse with に反して (contrary to)."
  },
  {
    pattern: "〜に対して (ni taishite)",
    meaning: "towards; in contrast to; against",
    explanation: "Indicates the target of an action or an attitude, or contrasts two distinct items.",
    formation: "Noun + に対して / に対する + Noun",
    examples: [{ jp: "お客様に対して丁寧な言葉遣いを心がける。", hira: "おきゃくさまにたいしてていねいなことばづかいをこころがける。", en: "Be mindful of polite language towards customers." }],
    commonMistakes: "Do not use にとって when expressing an action directed outward at a person."
  },
  {
    pattern: "〜にとって (ni totte)",
    meaning: "for; from the standpoint of",
    explanation: "Expresses evaluation or judgment from the perspective of the preceding noun.",
    formation: "Noun + にとって",
    examples: [{ jp: "私にとって日本語学習は日課です。", hira: "わたしにとってにほんごがくしゅうはにっかです。", en: "For me, Japanese study is a daily routine." }],
    commonMistakes: "Do not use with direct actions towards someone (use に対して instead)."
  },
  {
    pattern: "〜によって (ni yotte)",
    meaning: "by means of; due to; depending on; by (passive agent)",
    explanation: "Expresses means, cause/reason, variation depending on circumstances, or agent in passive voice.",
    formation: "Noun + によって / による + Noun",
    examples: [{ jp: "努力によって困難を乗り越えた。", hira: "どりょくによってこんなんをのりこえた。", en: "Overcame difficulties by means of effort." }],
    commonMistakes: "Choose correct nuance (cause vs means vs variation) based on context."
  },
  {
    pattern: "〜を通じて / 〜を通して (wo tsuujite / wo tooshite)",
    meaning: "through; via; throughout (a period)",
    explanation: "Indicates a mediator, channel, or continuous time period.",
    formation: "Noun + を通じて / を通して",
    examples: [{ jp: "友人の紹介を通じて新しい仕事を見つけた。", hira: "ゆうじんのしょうかいをつうじてあたらしいしごとをみつけた。", en: "Found a new job through a friend's introduction." }],
    commonMistakes: "Cannot be used for physical passage through a tunnel (use を通って)."
  },
  {
    pattern: "〜おかげで (okage de)",
    meaning: "thanks to; owing to (positive result)",
    explanation: "Expresses gratitude or positive outcome resulting from a cause.",
    formation: "Verb/Adj/Noun plain form + おかげで (Noun + の)",
    examples: [{ jp: "先生のおかげで試験に合格できました。", hira: "せんせいのおかげでしけんにごうかくできました。", en: "Thanks to the teacher, I was able to pass the exam." }],
    commonMistakes: "Do not use for undesirable results unless speaking with strong irony."
  },
  {
    pattern: "〜せいで (sei de)",
    meaning: "because of; on account of (negative blame)",
    explanation: "Attributes blame or a negative outcome to a specific cause or person.",
    formation: "Verb/Adj/Noun plain form + せいで (Noun + の)",
    examples: [{ jp: "台風のせいで電車が止まってしまった。", hira: "たいふうのせいででんしゃがとまってしまった。", en: "Because of the typhoon, the train came to a halt." }],
    commonMistakes: "Do not use when speaking positively of someone's contribution."
  },
  {
    pattern: "〜わりに(は) (wari ni wa)",
    meaning: "considering that; in spite of; unexpectedly",
    explanation: "Indicates that the result is unexpected in comparison with the standard.",
    formation: "Plain form + わりに(は) (Noun + の / な-adj + な)",
    examples: [{ jp: "彼は勉強しなかったわりには良い点を取った。", hira: "かれはべんきょうしなかったわりにはよいてんをとった。", en: "Considering he didn't study, he got a good score." }],
    commonMistakes: "Distinct from にしては; わりに focuses on proportion/balance."
  },
  {
    pattern: "〜にしては (ni shite wa)",
    meaning: "for; considering that it is",
    explanation: "Highlights a surprising quality given a specific known fact or category.",
    formation: "Noun / Verb plain form + にしては",
    examples: [{ jp: "初めてにしてはとても上手に描けている。", hira: "はじめてにしてはとてもじょうずにかけえている。", en: "For a first attempt, it is very well drawn." }],
    commonMistakes: "Noun attaches directly without の (e.g. 子供にしては, not 子供の)."
  },
  {
    pattern: "〜たとたん(に) (ta totan ni)",
    meaning: "the moment that; just as; as soon as",
    explanation: "Indicates that an unexpected action occurred immediately after a trigger.",
    formation: "Verb (た-form) + とたん(に)",
    examples: [{ jp: "窓を開けたとたんに強い風が吹き込んだ。", hira: "まどをあけたとたんにつよいかぜがふきこんだ。", en: "The moment I opened the window, a strong wind blew in." }],
    commonMistakes: "The trailing clause cannot be a planned action or speaker's volitional wish."
  },
  {
    pattern: "〜ばかり (bakari)",
    meaning: "only; nothing but; just constantly doing",
    explanation: "Expresses repeated or exclusive occurrence of an action or item, often with slight reproach.",
    formation: "Noun / Verb (て-form) + ばかり",
    examples: [{ jp: "弟はゲームばかりしている。", hira: "おとうとはげーむばかりしている。", en: "My younger brother does nothing but play video games." }],
    commonMistakes: "Do not confuse with たばかり (just completed recently)."
  },
  {
    pattern: "〜たばかり (ta bakari)",
    meaning: "just recently finished / done",
    explanation: "Indicates that very little psychological or real time has passed since an action occurred.",
    formation: "Verb (た-form) + ばかり",
    examples: [{ jp: "日本に着いたばかりでまだ慣れていません。", hira: "にほんに着いたばかりでまだなれていません。", en: "I have just arrived in Japan and am not yet accustomed to it." }],
    commonMistakes: "Differs from たところ which implies literal minutes ago; たばかり can span weeks."
  },
  {
    pattern: "〜べき / 〜べきではない (beki / beki dewa nai)",
    meaning: "should; ought to / should not",
    explanation: "Expresses moral duty, obligation, or strong common-sense advice.",
    formation: "Verb (dictionary form) + べき (する -> すべき/するべき)",
    examples: [{ jp: "約束は守るべきです。", hira: "やくそくはまもるべきです。", en: "Promises should be kept." }],
    commonMistakes: "Not used for imposing legal statutory rules; reflects moral expectation."
  },
  {
    pattern: "〜わけがない (wake ga nai)",
    meaning: "there is no way that; it is impossible that",
    explanation: "Strong conviction by the speaker that something cannot possibly be true.",
    formation: "Plain form + わけがない (な-adj + な / Noun + の)",
    examples: [{ jp: "そんな嘘を彼が信じるわけがない。", hira: "そんなうそをかれがしんじるわけがない。", en: "There is no way he would believe such a lie." }],
    commonMistakes: "Do not confuse with わけではない (it does not mean that...)."
  },
  {
    pattern: "〜わけではない (wake dewa nai)",
    meaning: "it does not mean that; not necessarily",
    explanation: "Partial negation used to soften an absolute assumption.",
    formation: "Plain form + わけではない",
    examples: [{ jp: "嫌いなわけではないが、今は食べたくない。", hira: "きらいなわけではないが、いまはたべたくない。", en: "It doesn't mean I dislike it, but I don't want to eat right now." }],
    commonMistakes: "Provides partial negation, unlike 全然〜ない which is complete negation."
  },
  {
    pattern: "〜わけにはいかない (wake ni wa ikanai)",
    meaning: "cannot afford to; must not (due to social/moral reasons)",
    explanation: "Speaker wants to do something but cannot due to social duty, ethics, or circumstance.",
    formation: "Verb (dictionary form / ない-form) + わけにはいかない",
    examples: [{ jp: "大事な会議なので休むわけにはいかない。", hira: "だいじなかいぎなのでやすむわけにはいかない。", en: "Since it's an important meeting, I cannot afford to take a day off." }],
    commonMistakes: "Focuses on moral/situational impossibility rather than physical inability."
  },
  {
    pattern: "〜ようとする (you to suru)",
    meaning: "to be about to; to attempt to",
    explanation: "Indicates being on the verge of starting an action or making an attempt.",
    formation: "Verb (volitional form) + とする",
    examples: [{ jp: "出かけようとしたときに電話が鳴った。", hira: "でかけようとしたときにでんわがなった。", en: "The phone rang just as I was about to head out." }],
    commonMistakes: "ようとしない denotes 'shows no intention of doing'."
  },
  {
    pattern: "〜とおり(に) / 〜どおり(に) (toori ni / doori ni)",
    meaning: "in accordance with; just as",
    explanation: "Doing an action in the exact same manner as instructions or expectations.",
    formation: "Verb (dict/た) + とおりに / Noun + どおりに",
    examples: [{ jp: "説明書のとおりに組み立ててください。", hira: "せつめいしょのとおりにくみたててください。", en: "Please assemble it just as instructed in the manual." }],
    commonMistakes: "Noun takes voicing どおり (予定どおり, 計画どおり)."
  },
  {
    pattern: "〜を中心に (wo chuushin ni)",
    meaning: "centering around; focusing on",
    explanation: "Indicates the core subject, group, or geographical focus of an activity.",
    formation: "Noun + を中心に / を中心として",
    examples: [{ jp: "若手社員を中心としたプロジェクトチーム。", hira: "わかてしゃいんをちゅうしんとしたぷろじぇくとちーむ。", en: "A project team centered around young staff members." }],
    commonMistakes: "Must be preceded by the focal group or entity."
  },
  {
    pattern: "〜をはじめ (wo hajime)",
    meaning: "starting with; including primarily",
    explanation: "Presents the most prominent representative example among many items.",
    formation: "Noun + をはじめ(として) / をはじめとする + Noun",
    examples: [{ jp: "東京をはじめとする主要都市で開催される。", hira: "とうきょうをはじめとするしゅようとしでかいさいされる。", en: "Held in major cities starting with Tokyo." }],
    commonMistakes: "The noun before をはじめ must be the prime representative example."
  },
  {
    pattern: "〜において / 〜における (ni oite / ni okeru)",
    meaning: "in; at; during (formal locative)",
    explanation: "Formal equivalent of で to express location, field, or time period.",
    formation: "Noun + において / における + Noun",
    examples: [{ jp: "現代社会における情報技術の役割。", hira: "げんだいしゃかいにおけるじょうほうぎじゅつのやくわり。", en: "The role of information technology in modern society." }],
    commonMistakes: "における modifies following nouns directly; において modifies verbs."
  },
  {
    pattern: "〜に比べて (ni kurabete)",
    meaning: "compared to; in comparison with",
    explanation: "Compares two entities or states with respect to a particular aspect.",
    formation: "Noun + に比べて",
    examples: [{ jp: "去年に比べて今年は降水量が少ない。", hira: "きょねんにくらべてことしはこうすいりょうがすくない。", en: "Compared to last year, precipitation is low this year." }],
    commonMistakes: "Do not confuse with に対して which emphasizes contrast of behaviors or feelings."
  },
  {
    pattern: "〜に従って / 〜につれて (ni shitagatte / ni tsurete)",
    meaning: "as... (progresses); in proportion as",
    explanation: "Indicates that as one change progresses, another concurrent change occurs.",
    formation: "Verb (dictionary form) / Noun + に従って / につれて",
    examples: [{ jp: "標高が高くなるにつれて気温が下がる。", hira: "ひょうこうがたかくなるにつれてきおんがさがる。", en: "As elevation increases, temperature drops." }],
    commonMistakes: "に従って can also mean 'obeying/following rules', whereas につれて cannot."
  },
  {
    pattern: "〜に違いない (ni chigainai)",
    meaning: "must be; there is no doubt that",
    explanation: "Speaker's strong conviction or certainty based on objective clues.",
    formation: "Plain form + に違いない (Noun / な-adj attach without だ)",
    examples: [{ jp: "明かりがついているから、彼は家にいるに違いない。", hira: "あかりがついているから、かれはいえにいるにちがいない。", en: "The light is on, so he must be at home." }],
    commonMistakes: "Do not add だ before に違いない (学生に違いない, not 学生だに違いない)."
  },
  {
    pattern: "〜はずだ / 〜はずがない (hazu da / hazu ga nai)",
    meaning: "is expected to / cannot possibly be",
    explanation: "Expectation based on natural logical calculation, schedule, or fact.",
    formation: "Plain form + はずだ (な-adj + な / Noun + の)",
    examples: [{ jp: "今日届くはずの荷物がまだ来ない。", hira: "きょうとどくはずのにもつがまだこない。", en: "The package that was supposed to arrive today has not come yet." }],
    commonMistakes: "はず expresses logical expectation; べき expresses duty/recommendation."
  },
  {
    pattern: "〜さえ〜ば (sae... ba)",
    meaning: "if only; as long as",
    explanation: "States the one minimum condition needed for a outcome to be fulfilled.",
    formation: "Noun + さえ + Verb (ば-form)",
    examples: [{ jp: "体さえ健康であれば何でもできる。", hira: "からださえけんこうであればなんでもできる。", en: "As long as one's body is healthy, one can do anything." }],
    commonMistakes: "Emphasizes the singular sufficient condition."
  },
  {
    pattern: "〜たびに (tabi ni)",
    meaning: "every time; whenever",
    explanation: "Indicates that whenever condition A occurs, B inevitably accompanies it.",
    formation: "Verb (dictionary form) / Noun + の + たびに",
    examples: [{ jp: "この曲を聴くたびに昔を思い出す。", hira: "このきょくをきくたびにむかしをおもいだす。", en: "Every time I listen to this song, I recall the old days." }],
    commonMistakes: "Cannot be used for routine daily events like 'every morning I brush my teeth'."
  },
  {
    pattern: "〜最中に (saichuu ni)",
    meaning: "right in the middle of; right while",
    explanation: "Indicates that an unexpected interruption happened during an ongoing action.",
    formation: "Verb (ている) / Noun + の + 最中に",
    examples: [{ jp: "食事の最中に急な電話がかかってきた。", hira: "しょくじのさいちゅうにきゅうなでんわがかかってきた。", en: "An urgent call came right in the middle of a meal." }],
    commonMistakes: "Often followed by an unexpected event interrupting the action."
  },
  {
    pattern: "〜間に / 〜間 (aida ni / aida)",
    meaning: "while; during the time that",
    explanation: "間 denotes continuous state throughout; 間に denotes a point action within the period.",
    formation: "Verb (ている/dict) / Noun + の + 間に",
    examples: [{ jp: "留守の間に荷物が届いた。", hira: "るすのあいだににもつがとどいた。", en: "A package arrived while I was away." }],
    commonMistakes: "Use 間に for instantaneous event; 間 for unbroken continuous action."
  },
  {
    pattern: "〜うちに (uchi ni)",
    meaning: "while (before circumstances change); before it becomes",
    explanation: "Doing something while a current favorable condition still holds, or change happening unknowingly.",
    formation: "Verb (dict/ている/ない) / Adj / Noun + の + うちに",
    examples: [{ jp: "温かいうちに召し上がってください。", hira: "あたたかいうちにめしあがってください。", en: "Please eat while it is still warm." }],
    commonMistakes: "Implies a time limit before condition changes (e.g. food cools down)."
  }
];

const n2Grammar = [
  {
    pattern: "〜にあたって / 〜に際して (ni atatte / ni saishite)",
    meaning: "on the occasion of; at the time of",
    explanation: "Used in formal situations when facing a major juncture, start of event, or ceremony.",
    formation: "Verb (dict) / Noun + にあたって",
    examples: [{ jp: "新年度の開始にあたり、一言ご挨拶を申し上げます。", hira: "しんねんどのかいしにあたり、ひとことごあいさつをもうしあげます。", en: "On the occasion of the new fiscal year start, I would like to say a few words." }],
    commonMistakes: "Used for positive, prepared occasions; not for accidents or everyday events."
  },
  {
    pattern: "〜を契機に / 〜をきっかけに (wo keiki ni / wo kikkake ni)",
    meaning: "taking advantage of; triggered by; as a turning point",
    explanation: "Indicates an event or circumstance that acted as the decisive catalyst for change.",
    formation: "Noun + を契機に(して)",
    examples: [{ jp: "入院を契機に生活習慣を根本から見直した。", hira: "にゅういんをけいきにせいかつしゅうかんをこんぽんからみなおした。", en: "Using hospitalization as a turning point, I fundamentally reviewed my lifestyle habits." }],
    commonMistakes: "契機 is formal and editorial; きっかけ is standard and conversational."
  },
  {
    pattern: "〜に先立って / 〜に先立ち (ni sakidatte / ni sakidachi)",
    meaning: "prior to; before starting",
    explanation: "Doing a preparatory action before a major main event.",
    formation: "Verb (dict) / Noun + に先立って",
    examples: [{ jp: "映画の公開に先立ち、特別試写会が行われた。", hira: "えいがのこうかいにさきだち、とくべつししゃかいがおこなわれた。", en: "Prior to the public release of the movie, a special preview screening was held." }],
    commonMistakes: "Formal expression; not used for minor trivial actions."
  },
  {
    pattern: "〜を皮切りに (wo kawakiri ni)",
    meaning: "starting with; beginning with (a chain of events)",
    explanation: "Indicates that one event set off a continuous series of similar actions or events in succession.",
    formation: "Noun + を皮切りに(して)",
    examples: [{ jp: "東京公演を皮切りに全国ツアーが始まる。", hira: "とうきょうこうえんをかわきりにぜんこくつあーがはじまる。", en: "The nationwide tour starts beginning with the Tokyo performance." }],
    commonMistakes: "Used when multiple successive events follow one another."
  },
  {
    pattern: "〜次第 (shidai)",
    meaning: "as soon as (immediately upon completion)",
    explanation: "Formal announcement that an action will occur immediately when a condition is fulfilled.",
    formation: "Verb (ます-stem) + 次第",
    examples: [{ jp: "準備が整い次第、ご連絡いたします。", hira: "じゅんびがととのいしだい、ごれんらくいたします。", en: "As soon as preparations are complete, we will contact you." }],
    commonMistakes: "Trailing verb cannot be in past tense (e.g. *届き次第行きました is wrong)."
  },
  {
    pattern: "〜をめぐって (wo megutte)",
    meaning: "concerning; over; surrounding (dispute/debate)",
    explanation: "Indicates the central disputed topic surrounding which debate, conflict, or speculation revolves.",
    formation: "Noun + をめぐって / をめぐる + Noun",
    examples: [{ jp: "遺産相続をめぐって親族間で争いが起きた。", hira: "いさんそうぞくをめぐってしんぞくかんであらそいがおきた。", en: "A dispute arose among relatives over inheritance succession." }],
    commonMistakes: "Requires multiple people or sides interacting/disputing around the topic."
  },
  {
    pattern: "〜にかけては (ni kakete wa)",
    meaning: "when it comes to; in terms of (supreme skill)",
    explanation: "Expresses that the subject has unrivaled talent, knowledge, or confidence in that specific area.",
    formation: "Noun + にかけては",
    examples: [{ jp: "数学の知識にかけては彼の右に出る者はいない。", hira: "すうがくのちしきにかけてはかれのみぎにでるものはいない。", en: "When it comes to mathematical knowledge, nobody surpasses him." }],
    commonMistakes: "Always followed by high praise or strong confidence."
  },
  {
    pattern: "〜にこたえて (ni kotaete)",
    meaning: "in response to; in answer to (expectations/demands)",
    explanation: "Taking an action to meet the hopes, requests, or cheers of others.",
    formation: "Noun + にこたえて / にこたえる + Noun",
    examples: [{ jp: "ファンの声援にこたえてアンコールに応じた。", hira: "ふぁんのせいえんにこたえてあんこーるにおうじた。", en: "Responded to an encore in answer to the fans' cheering." }],
    commonMistakes: "Do not confuse with に答えて (answering a question directly)."
  },
  {
    pattern: "〜に基づいて / 〜に基づき (ni motozuite / ni motozuki)",
    meaning: "based on; on the basis of",
    explanation: "Acting or creating something grounded on specific data, law, fact, or principle.",
    formation: "Noun + に基づいて / に基づく + Noun",
    examples: [{ jp: "最新のデータに基づいて計画を修正する。", hira: "さいしんのでーたにもとづいてけいかくをしゅうせいする。", en: "Revise the plan based on the latest data." }],
    commonMistakes: "に基づき is the literary written continuative form."
  },
  {
    pattern: "〜のもとで / 〜のもとに (no moto de / no moto ni)",
    meaning: "under (the guidance/condition/influence of)",
    explanation: "Acting under someone's guidance or under a prevailing principle/condition.",
    formation: "Noun + のもとで / のもとに",
    examples: [{ jp: "名将の指導のもとで猛練習に励む。", hira: "めいしょうのしどうのもとでもうれんしゅうにはげむ。", en: "Engage in intense practice under the guidance of a renowned coach." }],
    commonMistakes: "のもとで indicates human guidance; のもとに indicates conditions/principles."
  },
  {
    pattern: "〜を契機に / 〜を踏まえて (wo fumaete)",
    meaning: "taking into account; based upon (facts/experiences)",
    explanation: "Considering prior circumstances or feedback as the groundwork for subsequent action.",
    formation: "Noun + を踏まえて",
    examples: [{ jp: "前回の反省を踏まえて対策を強化する。", hira: "ぜんかいのはんせいをふまえてたいさくをきょうかする。", en: "Strengthen countermeasures taking into account reflections from last time." }],
    commonMistakes: "Requires concrete experiential premise or data before を踏まえて."
  },
  {
    pattern: "〜に沿って (ni sotte)",
    meaning: "in accordance with; along (guidelines/path)",
    explanation: "Following a rule, policy, plan, or physical coastline/path without deviating.",
    formation: "Noun + に沿って / に沿う + Noun",
    examples: [{ jp: "基本方針に沿って業務を進めてください。", hira: "きほんほうしんにそってぎょうむをすすめてください。", en: "Please proceed with operations in accordance with the basic policy." }],
    commonMistakes: "Do not deviate from the specified trajectory or guideline."
  },
  {
    pattern: "〜に伴って / 〜に伴い (ni tomonatte / ni tomonai)",
    meaning: "accompanying; as a consequence of; with",
    explanation: "Indicates that one major change brings about another simultaneous change.",
    formation: "Verb (dict) / Noun + に伴って / に伴い",
    examples: [{ jp: "都市開発に伴って交通量が増加した。", hira: "としかいはつにともなってこうつうりょうがぞうかした。", en: "Traffic volume increased accompanying urban development." }],
    commonMistakes: "More formal than につれて; emphasizes cause-and-effect linkage."
  },
  {
    pattern: "〜とともに (to tomo ni)",
    meaning: "together with; as well as; along with the progress of",
    explanation: "Expresses simultaneous actions, mutual companionship, or gradual concurrent progression.",
    formation: "Noun / Verb (dict) + とともに",
    examples: [{ jp: "科学の進歩とともに生活が便利になった。", hira: "かがくのしんぽとともにせいかつがべんりになった。", en: "Along with the progress of science, life has become convenient." }],
    commonMistakes: "Noun attaches with とともに (家族とともに)."
  },
  {
    pattern: "〜に応じて (ni oujite)",
    meaning: "in accordance with; depending on; corresponding to",
    explanation: "Varying actions flexibly according to requirements, capability, or budget.",
    formation: "Noun + に応じて / に応じた + Noun",
    examples: [{ jp: "予算に応じて最適なプランをご提案します。", hira: "よさんにおうじてさいてきなぷらんをごていあんします。", en: "We propose the most suitable plan according to your budget." }],
    commonMistakes: "Focuses on customized adaptation to conditions."
  },
  {
    pattern: "〜に応えて (ni kotaete)",
    meaning: "in response to (demands/wishes)",
    explanation: "Meeting expectations of supporters or requests.",
    formation: "Noun + に応えて",
    examples: [{ jp: "要望に応えて営業時間を延長した。", hira: "ようぼうにこたえてえいぎょうじかんをえんちょうした。", en: "Extended business hours in response to demands." }],
    commonMistakes: "Matches expectation satisfaction."
  },
  {
    pattern: "〜ばかりか / 〜ばかりでなく (bakari ka / bakari denaku)",
    meaning: "not only... but also; let alone",
    explanation: "States that not only fact A is true, but an even greater fact B adds to it.",
    formation: "Plain form + ばかりか (な-adj + な / Noun + である)",
    examples: [{ jp: "彼は英語ばかりかフランス語も堪能だ。", hira: "かれはえいごばかりかふらんすごもたんのうだ。", en: "He is fluent not only in English but also in French." }],
    commonMistakes: "Trailing clause often emphasizes something even more unexpected."
  },
  {
    pattern: "〜のみならず (nomi narazu)",
    meaning: "not only... but also (formal)",
    explanation: "Formal written equivalent of だけでなく expressing expansion beyond one element.",
    formation: "Plain form + のみならず (Noun attaches directly)",
    examples: [{ jp: "国内のみならず海外でも高い評価を得ている。", hira: "こくないのみならずかいがいでもたかいひょうかをえている。", en: "Receives high acclaim not only domestically but also overseas." }],
    commonMistakes: "Written/editorial style."
  },
  {
    pattern: "〜をはじめとして (wo hajime to shite)",
    meaning: "starting with; represented primarily by",
    explanation: "Citing the primary representative item of a group.",
    formation: "Noun + をはじめとして",
    examples: [{ jp: "院長をはじめとしてスタッフ一同努力します。", hira: "いんちょうをはじめとしてすたっふいちどうどりょくします。", en: "The entire staff starting with the hospital director will make every effort." }],
    commonMistakes: "Noun must be the leading figure or prominent exemplar."
  },
  {
    pattern: "〜上(は) / 〜上の (jou wa / jou no)",
    meaning: "from the viewpoint of; in terms of; for reasons of",
    explanation: "Limits the domain of evaluation to a specific standpoint (law, safety, health).",
    formation: "Noun + 上(は) / 上の + Noun",
    examples: [{ jp: "法律上の手続きをすべて完了した。", hira: "ほうりつじょうのてつづきをすべてかんりょうした。", en: "Completed all procedures in terms of law." }],
    commonMistakes: "Attaches directly to kanji compound nouns (健康上, 形式上)."
  },
  {
    pattern: "〜以上(は) (ijou wa)",
    meaning: "now that; as long as; since (moral resolve)",
    explanation: "Since a situation or commitment exists, a natural duty or strong determination follows.",
    formation: "Verb/Adj plain form + 以上(は)",
    examples: [{ jp: "引き受けた以上は最後まで責任を持つ。", hira: "ひきうけたじょうはさいごまでせきにんをもつ。", en: "Since I accepted it, I will take responsibility until the end." }],
    commonMistakes: "Trailing clause must express determination, obligation, or advice."
  },
  {
    pattern: "〜からには (kara ni wa)",
    meaning: "since; now that; as long as (unyielding resolve)",
    explanation: "Expresses resolute obligation or determination resulting from a chosen premise.",
    formation: "Plain form + からには",
    examples: [{ jp: "試合に出るからには絶対に勝ちたい。", hira: "しあいにでるからにはぜったいにかちたい。", en: "Since I am entering the match, I definitely want to win." }],
    commonMistakes: "Followed by strong intentional statements (たい, つもり, べき)."
  },
  {
    pattern: "〜折(に) (ori ni)",
    meaning: "on the occasion of; when (polite/formal)",
    explanation: "Polite formal term for 'at that opportune time' or 'when'.",
    formation: "Verb/Noun + の + 折(に)",
    examples: [{ jp: "上京の折にはぜひお立ち寄りください。", hira: "じょうきょうのおりにはぜひおたちよりください。", en: "When you visit Tokyo, please by all means drop by." }],
    commonMistakes: "Used in formal correspondence and polite conversations."
  },
  {
    pattern: "〜に際して (ni saishite)",
    meaning: "at the time of; when facing",
    explanation: "Used when starting an important action or formal transaction.",
    formation: "Verb (dict) / Noun + に際して",
    examples: [{ jp: "契約の締結に際して書類を確認する。", hira: "けいやくのていけつにさいしてしょるいをかくにんする。", en: "Check documents at the time of concluding the contract." }],
    commonMistakes: "Formal written/business nuance."
  },
  {
    pattern: "〜っこない (kko nai)",
    meaning: "definitely cannot; absolutely impossible to",
    explanation: "Colloquial and strong emotional dismissal of possibility.",
    formation: "Verb (ます-stem) + っこない",
    examples: [{ jp: "一日でこの量を全部覚えられっこない。", hira: "いちにちでこのりょうをぜんぶおぼえられっこない。", en: "There is no way I could possibly memorize this entire volume in one day." }],
    commonMistakes: "Spoken and casual register."
  },
  {
    pattern: "〜かねない (kanenai)",
    meaning: "might well; there is danger of; could possibly (negative result)",
    explanation: "Warns of a risk or bad potential outcome resulting from a current state.",
    formation: "Verb (ます-stem) + かねない",
    examples: [{ jp: "無理を続けると過労で倒れかねない。", hira: "むりをつづけるとかろうでたおれかねない。", en: "If you keep overdoing it, you could collapse from overwork." }],
    commonMistakes: "Used only for undesirable risks; not for happy possibilities."
  },
  {
    pattern: "〜かねる (kaneru)",
    meaning: "cannot do; unable to (polite refusal)",
    explanation: "Expresses hesitation or inability to fulfill a request due to position/rules.",
    formation: "Verb (ます-stem) + かねる",
    examples: [{ jp: "そのご要望にはお応えしかねます。", hira: "そのごようぼうにはおこたえしかねます。", en: "We are unable to accommodate that request." }],
    commonMistakes: "Polite and diplomatic refusal in business contexts."
  },
  {
    pattern: "〜つつある (tsutsu aru)",
    meaning: "in the process of; gradually becoming",
    explanation: "Denotes ongoing gradual progression of continuous change.",
    formation: "Verb (ます-stem) + つつある",
    examples: [{ jp: "景気は緩やかに回復しつつある。", hira: "けいきはゆるやかにかいふくしつつある。", en: "The economy is gradually recovering." }],
    commonMistakes: "Attached to change-of-state verbs; formal written tone."
  },
  {
    pattern: "〜つつ(も) (tsutsu mo)",
    meaning: "while; although (conflicting feelings/actions)",
    explanation: "Doing an action while harboring contradictory feelings or doing simultaneous acts.",
    formation: "Verb (ます-stem) + つつ(も)",
    examples: [{ jp: "体に悪いと知りつつも甘い物を食べてしまう。", hira: "からだにわるいとしりつつもあまいものをたべてしまう。", en: "Although knowing it is bad for health, I end up eating sweets." }],
    commonMistakes: "Emphasizes internal moral or emotional conflict."
  },
  {
    pattern: "〜得ない / 〜得る (enai / eru)",
    meaning: "cannot possibly / is possible to",
    explanation: "Expresses theoretical possibility or impossibility.",
    formation: "Verb (ます-stem) + 得る(える/うる) / 得ない(えない)",
    examples: [{ jp: "そんな事故は常識では考え得ない。", hira: "そんなじこはじょうしきではかんがええない。", en: "Such an accident is unthinkable by common sense." }],
    commonMistakes: "Negative is always pronounced えない (not *うない)."
  }
];

const n1Grammar = [
  {
    pattern: "〜ごとき / 〜ごとく (gotoki / gotoku)",
    meaning: "like; as if; the likes of",
    explanation: "Classical comparison or humble/derogatory self-reference ('the likes of me').",
    formation: "Noun + の / Verb plain + ごとき + Noun / ごとく + Verb",
    examples: [{ jp: "光陰矢のごとしと言われるように時間は速い。", hira: "こういんやのごとしといわれるようにじかんははやい。", en: "As the saying 'Time flies like an arrow' goes, time is fast." }],
    commonMistakes: "High literary register; used in rhetorical expressions."
  },
  {
    pattern: "〜極まる / 〜極まりない (kiwamaru / kiwamarinai)",
    meaning: "extremely; exceedingly; to the utmost degree",
    explanation: "States that a state has reached its absolute extreme limit, often for negative attitudes or perils.",
    formation: "な-adj stem + 極まる / 極まりない",
    examples: [{ jp: "彼の態度は失礼極まりない。", hira: "かれのたいどはしつれいきわまりない。", en: "His attitude is rude to the utmost extreme." }],
    commonMistakes: "Extreme emphatic tone for critical evaluations."
  },
  {
    pattern: "〜を皮切りとして (wo kawakiri to shite)",
    meaning: "taking as the inaugural start of",
    explanation: "Denotes the opening milestone triggering successive grand events.",
    formation: "Noun + を皮切りとして",
    examples: [{ jp: "世界選手権を皮切りとして国際大会を転戦する。", hira: "せかいせんしゅけんをかわきりとしてこくさいたいかいをてんせんする。", en: "Starting with the world championship, he will tour international tournaments." }],
    commonMistakes: "Literary and journalistic style."
  },
  {
    pattern: "〜と相まって (to aimatte)",
    meaning: "coupled with; together with; in combination with",
    explanation: "Expresses two or more synergistic factors combining to generate a remarkable effect.",
    formation: "Noun + と相まって",
    examples: [{ jp: "好天と相まって行楽地は大盛況となった。", hira: "こうてんとあいまってみどころはおおせいきょうとなった。", en: "Coupled with fine weather, the tourist spot was a great success." }],
    commonMistakes: "Used when multiple causes combine to multiply the overall outcome."
  },
  {
    pattern: "〜にかこつけて (ni kakotsukete)",
    meaning: "using as a pretext/excuse for",
    explanation: "Using an ostensible reason to conceal one's real underlying objective.",
    formation: "Noun + にかこつけて",
    examples: [{ jp: "出張にかこつけて旧友と観光を楽しんだ。", hira: "しゅっちょうにかこつけてきゅうゆうとかんこうをたのしんだ。", en: "Using a business trip as a pretext, enjoyed sightseeing with an old friend." }],
    commonMistakes: "Carries a critical or self-deprecating nuance."
  },
  {
    pattern: "〜をおいて (wo oite)",
    meaning: "aside from; except for (no other can compare)",
    explanation: "Emphasizes that nobody else or nothing else is qualified or suitable.",
    formation: "Noun + をおいて(〜ない)",
    examples: [{ jp: "この大役を任せられるのは彼をおいて他にいない。", hira: "このたいやくをまかせられるのはかれをおいてほかにいない。", en: "There is no one other than him who can be entrusted with this grand role." }],
    commonMistakes: "Always paired with a negative following phrase (他にいない, 他にない)."
  },
  {
    pattern: "〜ならでは (naredewa)",
    meaning: "distinctive to; unique to; only possible with",
    explanation: "Presents a unique positive attribute that only that entity can provide.",
    formation: "Noun + ならでは(の + Noun)",
    examples: [{ jp: "伝統工芸ならではの繊細な美しさに魅了される。", hira: "でんとうこうげいならではのせんさいなうつくしさにみりょうされる。", en: "Fascinated by the delicate beauty unique to traditional crafts." }],
    commonMistakes: "Always carries high praise or special distinctive value."
  },
  {
    pattern: "〜ずにはおかない (zu ni wa okanai)",
    meaning: "will certainly; inevitably must; cannot help but",
    explanation: "Strong determination that an action will surely be performed, or an emotional reaction is inevitably provoked.",
    formation: "Verb (ない-stem) + ずにはおかない (する -> せずにはおかない)",
    examples: [{ jp: "彼の熱狂的な演技は観客を感動させずにはおかない。", hira: "かれのねっきょうてきなえんぎはかんきゃくをかんどうさせずにはおかない。", en: "His passionate performance never fails to move the audience." }],
    commonMistakes: "Denotes inevitable compelling force."
  },
  {
    pattern: "〜ずにはすまない (zu ni wa sumanai)",
    meaning: "cannot get away without; must inevitably do (social/moral demand)",
    explanation: "Circumstances or conscience demand that an action must be done to resolve the situation.",
    formation: "Verb (ない-stem) + ずにはすまない (する -> せずにはすまない)",
    examples: [{ jp: "これだけの損害を出した以上、謝罪せずにはすまない。", hira: "これだけのそんがいをだしたいじょう、しゃざいせずにはすまない。", en: "Having caused this much damage, one cannot get away without apologizing." }],
    commonMistakes: "Reflects ethical or situational necessity."
  },
  {
    pattern: "〜ないではすまない (nai dewa sumanai)",
    meaning: "must inevitably; cannot avoid doing",
    explanation: "Same meaning as ずにはすまない in a standard colloquial-formal blend.",
    formation: "Verb (ない-form) + ではすまない",
    examples: [{ jp: "本当のことを話さないではすまない状況になった。", hira: "ほんとうのことをはなさないではすまないじょうきょうになった。", en: "It reached a point where I could not avoid telling the truth." }],
    commonMistakes: "Expresses unavoidable situational constraint."
  },
  {
    pattern: "〜をもって (wo motte)",
    meaning: "with; by means of; as of (time limit / formal means)",
    explanation: "Used to declare formal termination as of a date, or action accomplished by means of high effort.",
    formation: "Noun + をもって",
    examples: [{ jp: "本日をもって今年度の営業を終了いたします。", hira: "ほんじつをもってこんねんどのえいぎょうをしゅうりょういたします。", en: "As of today, we conclude this fiscal year's business operations." }],
    commonMistakes: "Extremely formal ceremony or notice wording."
  },
  {
    pattern: "〜ばこそ (ba koso)",
    meaning: "precisely because; only because",
    explanation: "Emphatically highlights the genuine underlying reason for an action that might otherwise be misunderstood.",
    formation: "Verb (ば-form) / Noun+であれば + こそ",
    examples: [{ jp: "子どもの将来を思えばこそ厳しく指導するのです。", hira: "こどものしょうらいをおもえばこそきびしくしどうするのです。", en: "It is precisely because I think of the child's future that I instruct strictly." }],
    commonMistakes: "Used to justify sincere motives."
  },
  {
    pattern: "〜なくして(は) (nakushite wa)",
    meaning: "without; if not for (impossible to achieve)",
    explanation: "Stipulates an indispensable prerequisite without which success cannot occur.",
    formation: "Noun + なくして(は) (〜ない)",
    examples: [{ jp: "皆様の温かいご支援なくして成功はあり得ませんでした。", hira: "みなさまのあたたかいごしえんなくしてせいこうはありえませんでした。", en: "Without everyone's warm support, success would have been impossible." }],
    commonMistakes: "Followed by absolute impossibility or negation."
  },
  {
    pattern: "〜なしに(は) (nashi ni wa)",
    meaning: "without; lacking (cannot proceed)",
    explanation: "States that without a particular factor, a normal outcome is out of reach.",
    formation: "Noun / Verb (こと) + なしに(は)",
    examples: [{ jp: "事前の許可なしに立ち入ることは固く禁じられています。", hira: "じぜんのきょかなしにたちいることはかたくきんじられています。", en: "Entering without advance permission is strictly forbidden." }],
    commonMistakes: "Formal condition requirement."
  },
  {
    pattern: "〜たりとも (taritomo)",
    meaning: "even a single... (not even one)",
    explanation: "Takes the smallest counting unit (one second, one drop) to emphasize zero tolerance or waste.",
    formation: "One + Counter + たりとも (〜ない)",
    examples: [{ jp: "一秒たりとも無駄にしてはならない。", hira: "いちびょうたりともむだにしてはならない。", en: "Not even a single second must be wasted." }],
    commonMistakes: "Always pairs with number 1 (一刻, 一粒, 一円) and negation."
  },
  {
    pattern: "〜きらいがある (kirai ga aru)",
    meaning: "have a tendency to; prone to (undesirable trait)",
    explanation: "Points out an unfavorable inclination or habit in character or behavior.",
    formation: "Verb (dict/ない) / Noun + の + きらいがある",
    examples: [{ jp: "彼は物事を独断で決めてしまうきらいがある。", hira: "かれはものごとをどくだんできめてしまうきらいがある。", en: "He tends to decide things arbitrarily on his own." }],
    commonMistakes: "Used for slight negative habits, not positive virtues."
  },
  {
    pattern: "〜ごとき (gotoki)",
    meaning: "like; such as",
    explanation: "Classical simulative comparison or deprecation.",
    formation: "Noun + のごとき",
    examples: [{ jp: "私のごとき未熟者にお任せいただき恐縮です。", hira: "わたしのごときみじゅくものにおまかせいただききょうしゅくです。", en: "I am humbled that you entrusted this to an inexperienced person like me." }],
    commonMistakes: "Classical humble or figurative tone."
  },
  {
    pattern: "〜しまつだ (shimatsu da)",
    meaning: "ended up in such a sorry state as",
    explanation: "Narrates a deplorable culmination after a sequence of deteriorating events.",
    formation: "Verb plain form + 始末だ",
    examples: [{ jp: "浪費を重ねた挙句に借金を抱える始末だ。", hira: "ろうひをかさねたあげくにしゃっきんをかかえるしまつだ。", en: "After repeated wasteful spending, he ended up saddled with debt." }],
    commonMistakes: "Always narrates an unfortunate, pitiable result."
  },
  {
    pattern: "〜であれ / 〜であろうと (de are / de arou to)",
    meaning: "whether it be... or; no matter what",
    explanation: "Asserts that regardless of the condition or identity, the statement holds universally.",
    formation: "Noun / Question word + であれ",
    examples: [{ jp: "理由が何であれ暴力は決して許されない。", hira: "りゆうがなんであれぼうりょくはけっしてゆるされない。", en: "No matter what the reason may be, violence is never permitted." }],
    commonMistakes: "Formal unconditional assertion."
  },
  {
    pattern: "〜とあれば (to areba)",
    meaning: "if it comes to; if it is for the sake of",
    explanation: "If a special condition or request is present, one is willing to do whatever it takes.",
    formation: "Plain form + とあれば",
    examples: [{ jp: "愛する子どものためとあればどんな苦労もいとわない。", hira: "あいするこどものためとあればどんなくろうもいとわない。", en: "If it is for the sake of beloved children, I spare no hardship." }],
    commonMistakes: "Expresses unwavering readiness to act under that condition."
  },
  {
    pattern: "〜とはいえ (to wa ie)",
    meaning: "though; although it is true that",
    explanation: "Concedes a stated premise while introducing a qualification or reservation.",
    formation: "Plain form + とはいえ",
    examples: [{ jp: "春とはいえ朝夕はまだ肌寒い。", hira: "はるとはいえあさゆうはまだはだざむい。", en: "Although it is spring, mornings and evenings are still chilly." }],
    commonMistakes: "Connective concessive structure."
  },
  {
    pattern: "〜といえども (to iedomo)",
    meaning: "even though; even if it be",
    explanation: "High literary concessive stating that even under exceptional status, rules apply.",
    formation: "Noun / Plain form + といえども",
    examples: [{ jp: "熟練の達人といえども油断は禁物だ。", hira: "じゅくれんのたつじんといえどもゆだんはきんもつだ。", en: "Even for a skilled master, carelessness is strictly prohibited." }],
    commonMistakes: "Classical literary register."
  },
  {
    pattern: "〜と思いきや (to omoikiya)",
    meaning: "contrary to expectations; just when I thought",
    explanation: "Reveals that what was presumed was immediately overturned by an unexpected reality.",
    formation: "Plain form + と思いきや",
    examples: [{ jp: "晴れると思いきや突然激しい雷雨となった。", hira: "はれるとおもいきやとつぜんはげしいらいうとなった。", en: "Just when I thought it would clear up, it suddenly turned into a heavy thunderstorm." }],
    commonMistakes: "Emphasizes sharp unexpected contrast."
  },
  {
    pattern: "〜ないまでも (nai made mo)",
    meaning: "even if not quite... at least",
    explanation: "Concedes that the ideal maximum is not reached, but a reasonable minimum is attained.",
    formation: "Verb (ない-stem) + ないまでも",
    examples: [{ jp: "満点とは言えないまでも、合格点は十分に取れた。", hira: "まんてんとはいえないまでも、ごうかくてんはじゅうぶんにとれた。", en: "Even if not a perfect score, I comfortably achieved a passing grade." }],
    commonMistakes: "Balances compromise with positive partial fulfillment."
  },
  {
    pattern: "〜ならいざしらず (nara iza shirazu)",
    meaning: "if it were... it might be excused, but (unacceptable here)",
    explanation: "Contrasts an exceptional case where something might pass against the unacceptable current reality.",
    formation: "Noun / Plain form + ならいざしらず",
    examples: [{ jp: "素人ならいざしらず、プロがこんなミスをしてはいけない。", hira: "しろうとならいざしらず、ぷろがこんなみすをしてはいけない。", en: "If it were an amateur it might be excusable, but a professional must not make such mistakes." }],
    commonMistakes: "Sharply rebukes current unacceptable standard."
  },
  {
    pattern: "〜にかかわる (ni kakawaru)",
    meaning: "affecting; concerning; having grave bearing on",
    explanation: "Indicates that something has critical stakes concerning life, honor, or survival.",
    formation: "Noun + にかかわる / にかかわる + Noun",
    examples: [{ jp: "命にかかわる病気ではないので安心してください。", hira: "いのちにかかわるびょうきではないのであんしんしてください。", en: "Please rest assured as it is not a disease that threatens life." }],
    commonMistakes: "Used with weighty themes (名誉, 信用, 存亡, 命)."
  },
  {
    pattern: "〜に堪えない (ni taenai)",
    meaning: "cannot bear to; beyond endurance / deeply filled with (gratitude)",
    explanation: "Cannot endure seeing a miserable state, or overwhelmed by profound feelings of joy/gratitude.",
    formation: "Verb (dict) / Noun + に堪えない",
    examples: [{ jp: "皆様のご厚情に感謝の念に堪えません。", hira: "みなさまのごこうじょうにかんしゃのねんにたえません。", en: "I am overwhelmed with deep feelings of gratitude for everyone's kindness." }],
    commonMistakes: "Two nuances: (1) unbearable to witness, (2) overflowing gratitude."
  },
  {
    pattern: "〜に足る (ni taru)",
    meaning: "worthy of; sufficient to; deserving of",
    explanation: "Affirms that a subject fully possesses the qualities or credibility needed.",
    formation: "Verb (dict) / Noun + に足る / に足りる",
    examples: [{ jp: "彼は信頼するに足る誠実な人物だ。", hira: "かれはしんらいするにたるせいじつなじんぶつだ。", en: "He is a sincere person worthy of trust." }],
    commonMistakes: "Formal literary phrasing."
  },
  {
    pattern: "〜まみれ (mamire)",
    meaning: "covered all over with; smeared with (dust/mud/blood)",
    explanation: "Physical surface is unstoppably covered in an undesirable substance.",
    formation: "Noun + まみれ",
    examples: [{ jp: "泥まみれになりながらボールを追いかけた。", hira: "どろまみれになりながらぼーるをおいかけた。", en: "Chased the ball while covered all over in mud." }],
    commonMistakes: "Differs from だらけ in that まみれ implies clinging viscous surface coating (泥, 汗, 血)."
  },
  {
    pattern: "〜をおいて (wo oite)",
    meaning: "except; besides",
    explanation: "Unmatched singular designation.",
    formation: "Noun + をおいて",
    examples: [{ jp: "適任者は彼をおいて他には考えられない。", hira: "てきにんしゃはかれをおいてほかにはかんがえられない。", en: "No other suitable candidate can be thought of besides him." }],
    commonMistakes: "Used in singular superlative assessments."
  }
];

// Helper to format
function formatGrammar(list, level) {
  return list.map((g, i) => ({
    id: `gram-${level.toLowerCase()}-${String(i + 1).padStart(3, '0')}`,
    level: level,
    pattern: g.pattern,
    meaning: g.meaning,
    explanation: g.explanation,
    formation: g.formation,
    examples: g.examples,
    commonMistakes: g.commonMistakes,
    source: "JLPT-aligned Study Reference"
  }));
}

fs.writeFileSync(path.join(__dirname, '../data/grammar/n3.json'), JSON.stringify(formatGrammar(n3Grammar, 'N3'), null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../data/grammar/n2.json'), JSON.stringify(formatGrammar(n2Grammar, 'N2'), null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../data/grammar/n1.json'), JSON.stringify(formatGrammar(n1Grammar, 'N1'), null, 2), 'utf8');

console.log(`Wrote ${n3Grammar.length} N3 grammar records.`);
console.log(`Wrote ${n2Grammar.length} N2 grammar records.`);
console.log(`Wrote ${n1Grammar.length} N1 grammar records.`);
