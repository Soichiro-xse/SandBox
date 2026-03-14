// ぽこあポケモン 攻略データベース
// 出典: ゲームエイト, 攻略大百科, ゲーム攻略ティア, hyperT'sブログ 等

const SKILLS_DATA = {
  "もやす": {
    description: "燃えるものに火をつけてくれる。ぐにゃぐにゃねんどをレンガに加工",
    pokemon: ["ヒトカゲ","リザード","リザードン","ヒトモシ","ガーディ","アチャモ","ワカシャモ","ブビィ","ブーバー","コータス","メラルバ","ヒバニー","ラビフット","タンドン","トロッゴン","カルボウ","ロコン","キュウコン","ヒノアラシ","マグマラシ","ブースター","ボルケニオン"]
  },
  "さいばい": {
    description: "植物の成長を早めてくれる",
    pokemon: ["フシギダネ","フシギソウ","フシギバナ","ナゾノクサ","クサイハナ","マダツボミ","ウツドン","サボネア","ノクタス","タマタマ","ナッシー","フクスロー","ツタージャ","ニャオハ","リーフィア"]
  },
  "うるおす": {
    description: "みずおけの水を草木や畑などにかけてくれる",
    pokemon: ["ゼニガメ","カメール","カメックス","ヤドン","ヤドラン","ヤドキング","カラナクシ","ヌメラ","ヌメイル","ウッウ","ラプラス","ルリリ","マリル","マリルリ","キャモメ","ペリッパー","ポッチャマ","ポッタイシ","ハスボー","ハスブレロ","ルンパッパ","ニョロトノ","カイリュー","ケロマツ","ゲコガシラ","ゲッコウガ","シャワーズ"]
  },
  "きをきる": {
    description: "ちいさなまるたをざいもくに加工してくれる",
    pokemon: ["ストライク","ハッサム","カイロス","ヘラクロス","ドリュウズ","キバゴ","オノンド","クロバット","カモネギ","ゾロアーク","アゴジムシ","フクスロー","ゲッコウガ","ココガラ","アオガラス"]
  },
  "けんちく": {
    description: "けんちくするときにリーダーになってくれる",
    pokemon: ["カラカラ","カイロス","ヘラクロス","ドッコラー","ドテッコツ","ローブシン","カモネギ","マリルリ","ワカシャモ","マクノシタ","ハリテヤマ","ワンリキー","ゴーリキー","リオル","バリヤード","カヌチャン"]
  },
  "じならし": {
    description: "ポケセンの建て直しやかいたいひっこし準備でリーダーになる",
    pokemon: ["イワーク","マクノシタ","ハリテヤマ","ウソハチ","ヨーギラス","サナギラス","バンギラス","ナックラー","ビブラーバ","フライゴン"]
  },
  "さがしもの": {
    description: "ダウジングマシンで埋まったものを探してくれる",
    pokemon: ["ポッポ","ピジョン","パラス","パラセクト","コンパン","モルフォン","ビークイン","モグリュー","ドリュウズ","ズバット","クロバット","ペルシアン","コダック","ガーディ","アーボ","ホシガリス","パピモッチ","ドラメシヤ","ドロンチ","ブラッキー"]
  },
  "そらをとぶ": {
    description: "さがし中のポケモンのところに飛んで連れて行ってくれる",
    pokemon: ["リザードン","ポッポ","ピジョン","ホーホー","ヨルノズク","ウッウ","キャモメ","ペリッパー","ペラップ","カイリュー","ビブラーバ","フライゴン","フリーザー","ファイヤー"]
  },
  "テレポート": {
    description: "さがし中のポケモンのところに瞬時に連れて行ってくれる",
    pokemon: ["ヤドキング","タマタマ","ナッシー","ケーシィ","フーディン","ミュウツー","ミュウ"]
  },
  "リサイクル": {
    description: "もえないゴミをてつに、かみのゴミをかみに加工してくれる",
    pokemon: ["ヤブクロン","メタング"]
  },
  "しわける": {
    description: "落ちているものをみんなのボックスに入れてくれる",
    pokemon: ["チラーミィ","ワンリキー","ゴーリキー","タンドン","トロッゴン","バリヤード","キリンリキ","ヨマワル","ドラメシヤ","ドロンチ","エーフィ"]
  },
  "はつでん": {
    description: "キカイに電気を流すことができる",
    pokemon: ["レアコイル","ピチュー","ライチュウ","ビリリダマ","エレキッド","エレブー","メリープ","モコモ","パモ","パモット","カイデン","サンダース","ライコウ"]
  },
  "つぶす": {
    description: "素材を別のものにつくりかえてくれる（コンクリートミキサー等）",
    pokemon: ["イワーク","ローブシン","パモット","ダグトリオ","イシツブテ","ゴローン","ヨーギラス","サナギラス","バンギラス","トリデプス","ガチゴラス"]
  },
  "ちらかす": {
    description: "すみかの周りに素材を落としてくれる（自動収集の要）",
    pokemon: ["フシギバナ","マダツボミ","ウツドン","ノクタス","ミツハニー","イトマル","アリアドス","メリープ","モコモ","メラルバ","キラーメ","ナックラー","チルット","ツタージャ","トリデプス","ガチゴラス"]
  },
  "とりひき": {
    description: "レジでアイテムをこうかんしてくれる",
    pokemon: ["カメックス","ヤドラン","バルキー","サワムラー","エビワラー","カポエラー","ホーホー","ヨルノズク","ニャース","ペルシアン","ピンプク","ポッタイシ","タブンネ","ゾロア","ゾロアーク","ウソッキー","フーディン","ムウマ","イーブイ","グレイシア"]
  },
  "もりあげる": {
    description: "音楽が流れていると踊ってムードを高めてくれる",
    pokemon: ["バルビート","イルミーゼ","ライチュウ","ルリリ","マリル","ピィ","ピッピ","ププリン","プリン","ディグダ","ダグトリオ","ルンパッパ","コロボーシ","コロトック","ペラップ","ホシガリス","ニョロトノ","ニンフィア"]
  },
  "あくび": {
    description: "うるおいの度合いを知ることができる",
    pokemon: ["ヤドン"]
  },
  "ゆめしま": {
    description: "ゆめしまに連れて行ってくれる",
    pokemon: ["フワンテ"]
  },
  "ミツあつめ": {
    description: "あまいミツを特別な家具と交換してくれる",
    pokemon: ["ビークイン"]
  },
  "しゅうのう": {
    description: "アイテムをあずかってくれる",
    pokemon: ["ゴクリン"]
  },
  "ばくはつ": {
    description: "うちあげづつで跳んでいくと爆発して辺りを壊してくれる",
    pokemon: ["ビリリダマ"]
  },
  "コレクター": {
    description: "めずらしいものとアイテムを交換してくれる",
    pokemon: ["コレクレー"]
  },
  "レアもの": {
    description: "ほしのかけらをレアポケメタルに加工してくれる",
    pokemon: ["ポリゴンZ"]
  },
  "かんてい": {
    description: "おおきなおとしものを鑑定してくれる",
    pokemon: ["モジャンボハカセ"]
  },
  "はっこう": {
    description: "光輝いて街全体を照らす",
    pokemon: ["うすチュウ"]
  },
  "ペイント": {
    description: "家具の色を変更してくれる",
    pokemon: ["ドーブルせんせい"]
  },
  "くいしんぼ": {
    description: "食べ物をお供えして仲良くなる",
    pokemon: ["こけカビゴン"]
  },
  "パーティー": {
    description: "料理時のリーダー役",
    pokemon: ["シェフバリス"]
  },
  "DJ": {
    description: "CDで音楽を再生してくれる",
    pokemon: ["アゲ↑ロトム"]
  },
  "しょくにん": {
    description: "巨大建物の建築リーダー。てつののべぼうをデカヌギアに加工",
    pokemon: ["デカヌおやかた"]
  },
  "へんしん": {
    description: "いろいろなものに変身可能",
    pokemon: ["メタモン"]
  }
};

// メタモンが覚えるわざ一覧
const METAMON_MOVES = [
  { name: "みずでっぽう", from: "ゼニガメ", effect: "水やり" },
  { name: "このは", from: "フシギダネ", effect: "地面に草を生やす" },
  { name: "いあいぎり", from: "ストライク", effect: "木材を丸太にしたり草花を切れる" },
  { name: "いわくだき", from: "エビワラー", effect: "石や土を砕ける" },
  { name: "たがやす", from: "モグリュー", effect: "野菜を植える畑を作成" },
  { name: "はねる", from: "コイキング", effect: "Rボタンで1段ジャンプ" },
  { name: "かいりき", from: "ゴーリキー", effect: "家具や岩などを押せる" },
  { name: "ころがる", from: "ゴローン", effect: "移動しながらブロックを壊せる、移動速度アップ" },
  { name: "なみのり", from: "ラプラス", effect: "水中でBを押すと泳げる" },
  { name: "モノまね", from: "ゾロア", effect: "モノに擬態できる" },
  { name: "ちょすい", from: "ウパー", effect: "水源を作れる" },
  { name: "かっくう", from: "カイリュー", effect: "高いところから滑空できる" },
  { name: "たきのぼり", from: "ギャラドス", effect: "滝を勢いよく登ることができる" }
];

// 素材加工チェーン
const PROCESSING_CHAINS = [
  {
    id: "wood",
    name: "ざいもく",
    chain: [
      { input: "木（いあいぎりで伐採）", output: "ちいさなまるた", ratio: "1本→1個", skill: null },
      { input: "ちいさなまるた", output: "ざいもく", ratio: "1個→5個", skill: "きをきる", time: "約5分" }
    ],
    tips: "一度に最大50個まで加工可能。枯れ木はみずでっぽうで復活させてから切ると効率的"
  },
  {
    id: "brick",
    name: "レンガ",
    chain: [
      { input: "地面を掘る（いわくだき）", output: "ぐにゃぐにゃねんど", ratio: "ランダム", skill: null },
      { input: "ぐにゃぐにゃねんど", output: "レンガ", ratio: "1個→5個", skill: "もやす", time: "約5分" }
    ],
    tips: "みんなのボックスに入れておくと自動加工される"
  },
  {
    id: "paper",
    name: "かみ",
    chain: [
      { input: "フィールドで拾う", output: "かみのごみ", ratio: "ランダム", skill: null },
      { input: "かみのごみ", output: "かみ", ratio: "1個→5個", skill: "リサイクル", time: "約5分" }
    ],
    tips: "リサイクルポケモンはヤブクロンが序盤おすすめ"
  },
  {
    id: "iron",
    name: "てつ",
    chain: [
      { input: "フィールドで拾う", output: "もえないごみ", ratio: "ランダム", skill: null },
      { input: "もえないごみ", output: "てつ", ratio: "1個→5個", skill: "リサイクル", time: "約5分" }
    ],
    tips: "もえないごみはフィールドのゴミ箱やゴミ山から入手"
  },
  {
    id: "ironbar",
    name: "てつののべぼう",
    chain: [
      { input: "もえないごみ", output: "てつ", ratio: "1個→5個", skill: "リサイクル", time: "約5分" },
      { input: "てつ", output: "てつののべぼう", ratio: "溶鉱炉で加工", skill: "もやす", time: "約5分" }
    ],
    tips: "溶鉱炉の加工は自分で頼む必要あり（自動化不可）"
  },
  {
    id: "glass",
    name: "ガラス",
    chain: [
      { input: "砂浜・地面", output: "すな", ratio: "掘って入手", skill: null },
      { input: "すな", output: "ガラス", ratio: "溶鉱炉で加工", skill: "もやす", time: "約5分" }
    ],
    tips: "ドンヨリうみべの砂浜で大量入手可能"
  },
  {
    id: "concrete",
    name: "コンクリート",
    chain: [
      { input: "いし + みず", output: "コンクリート", ratio: "コンクリートミキサーで加工", skill: "つぶす", time: "約5分" }
    ],
    tips: "コンクリートミキサーを設置して「つぶす」が得意なポケモンに頼む"
  },
  {
    id: "pokemetal",
    name: "ポケメタル",
    chain: [
      { input: "てつののべぼう", output: "ポケメタル", ratio: "溶鉱炉で加工", skill: "もやす", time: "約5分" }
    ],
    tips: "上位家具に必要。てつののべぼうの確保が先"
  },
  {
    id: "dekanugear",
    name: "デカヌギア",
    chain: [
      { input: "てつののべぼう", output: "デカヌギア", ratio: "10個→30個（価値500）", skill: "しょくにん", time: "約10分" }
    ],
    tips: "デカヌおやかたに依頼。高価値の交易品"
  },
  {
    id: "rarepokemetal",
    name: "レアポケメタル",
    chain: [
      { input: "ほしのかけら", output: "レアポケメタル", ratio: "加工", skill: "レアもの", time: "不明" }
    ],
    tips: "ポリゴンZに依頼"
  },
  {
    id: "paint",
    name: "えのぐ",
    chain: [
      { input: "きのみ", output: "えのぐ", ratio: "つぶして加工", skill: "つぶす", time: "約3分" }
    ],
    tips: "つぶすが得意なポケモンにきのみを渡す"
  }
];

// 自動化コンボ
const AUTOMATION_COMBOS = [
  {
    name: "基本自動収集ライン",
    description: "ちらかすポケモンが素材を落とし、しわけるポケモンがボックスに整理",
    required: [
      { role: "ちらかす", pokemon: ["メリープ","ミツハニー","マダツボミ","ナックラー","ツタージャ"], note: "素材を落とす役" },
      { role: "しわける", pokemon: ["チラーミィ","ゴーリキー","トロッゴン","エーフィ"], note: "拾ってボックスに入れる役" }
    ],
    facility: "みんなのボックス",
    tips: "ちらかすポケモンの近くにみんなのボックスを設置。しわけるポケモンも近くに住まわせる"
  },
  {
    name: "ざいもく自動加工ライン",
    description: "ちいさなまるたをみんなのボックスに入れると自動でざいもくに加工",
    required: [
      { role: "きをきる", pokemon: ["ストライク","ハッサム","カモネギ","ドリュウズ"], note: "まるた→ざいもく加工" }
    ],
    facility: "みんなのボックス",
    tips: "ちいさなまるたをボックスに入れておくと勝手に加工してくれる"
  },
  {
    name: "レンガ自動加工ライン",
    description: "ぐにゃぐにゃねんどをみんなのボックスに入れると自動でレンガに加工",
    required: [
      { role: "もやす", pokemon: ["ヒトカゲ","アチャモ","ブーバー","コータス"], note: "ねんど→レンガ加工" }
    ],
    facility: "みんなのボックス",
    tips: "みんなのボックスに素材を入れておくだけでOK"
  },
  {
    name: "かみ自動加工ライン",
    description: "かみのごみをみんなのボックスに入れると自動でかみに加工",
    required: [
      { role: "リサイクル", pokemon: ["ヤブクロン","メタング"], note: "ごみ→かみ加工" }
    ],
    facility: "みんなのボックス",
    tips: "リサイクルポケモンが少ないので確保が重要"
  },
  {
    name: "完全自動収集+加工コンボ",
    description: "収集→整理→加工を全自動化する最強レイアウト",
    required: [
      { role: "ちらかす", pokemon: ["メリープ","ミツハニー","フシギバナ"], note: "素材ドロップ" },
      { role: "しわける", pokemon: ["チラーミィ","エーフィ"], note: "自動整理" },
      { role: "きをきる/もやす/リサイクル", pokemon: ["ストライク","ヒトカゲ","ヤブクロン"], note: "自動加工" }
    ],
    facility: "みんなのボックス（複数設置推奨）",
    tips: "まっさらな街に専用の素材収集エリアを作ると効率的。各ポケモンの住処を近くに配置すること"
  },
  {
    name: "畑自動化ライン",
    description: "スプリンクラー+さいばいポケモンで野菜を自動栽培",
    required: [
      { role: "さいばい", pokemon: ["フシギダネ","ナゾノクサ","ニャオハ","リーフィア"], note: "成長促進" },
      { role: "うるおす", pokemon: ["ゼニガメ","ポッチャマ","シャワーズ"], note: "水やり" }
    ],
    facility: "スプリンクラー（上下左右5マス=36ブロック対応）",
    tips: "スプリンクラーは畑の中心に設置。さいばいポケモンを近くに住まわせると成長がさらに早い"
  }
];

// おねがいごとデータ
const QUESTS_DATA = {
  "パサパサこうやの街": [
    { pokemon: "モジャンボ", quest: "プロローグ - モジャンボに出会う", reward: "ストーリー開始", items: [] },
    { pokemon: "フシギダネ", quest: "フシギダネと友達になる", reward: "このは習得", items: [] },
    { pokemon: "ゼニガメ", quest: "ポケセンから西の岩をいわくだきで破壊して先に進む", reward: "みずでっぽう習得", items: [] },
    { pokemon: "エビワラー", quest: "石を2個渡す", reward: "いわくだき習得 → ダウジング機能解放", items: ["いし×2"] },
    { pokemon: "モグリュー", quest: "水漏れ岩をいわくだきで壊して水路を作る", reward: "たがやす習得", items: [] },
    { pokemon: "ストライク", quest: "ストライクと友達になる", reward: "いあいぎり習得", items: [] },
    { pokemon: "ヤドン", quest: "ストライクと友達になってから達成", reward: "あくび関連", items: [] },
    { pokemon: "コイキング", quest: "コイキングと友達になる", reward: "はねる習得", items: [] },
    { pokemon: "フクスロー", quest: "報告するとまないたのレシピ入手", reward: "まないたレシピ", items: ["ちいさなまるた（材木加工用）"] },
    { pokemon: "全体", quest: "あくびで雨をふらせよう", reward: "ストーリー進行", items: [] }
  ],
  "ゴツゴツやまの街": [
    { pokemon: "全体", quest: "パソコンを復旧する", reward: "ストーリー進行", items: [] },
    { pokemon: "ゴーリキー", quest: "ゴーリキーと友達になる", reward: "かいりき習得", items: [] },
    { pokemon: "ゴローン", quest: "ゴローンと友達になる", reward: "ころがる習得", items: [] },
    { pokemon: "全体", quest: "パーティーを開こう", reward: "ストーリー進行", items: [] }
  ],
  "ドンヨリうみべの街": [
    { pokemon: "全体", quest: "ゲートに突入する", reward: "ストーリー進行", items: [] },
    { pokemon: "ラプラス", quest: "ラプラスと友達になる", reward: "なみのり習得", items: [] },
    { pokemon: "ヤブクロン", quest: "ヤブクロンと友達になる", reward: "リサイクル利用可能", items: [] },
    { pokemon: "ゾロア", quest: "ゾロアと友達になる", reward: "モノまね習得", items: [] },
    { pokemon: "ウパー", quest: "ウパーと友達になる", reward: "ちょすい習得", items: [] },
    { pokemon: "全体", quest: "街を明るくしよう", reward: "ストーリー進行", items: [] }
  ],
  "キラキラうきしまの街": [
    { pokemon: "全体", quest: "環境レベルを上げる", reward: "ストーリー進行", items: [] },
    { pokemon: "カイリュー", quest: "カイリューと友達になる", reward: "かっくう習得", items: [] },
    { pokemon: "ギャラドス", quest: "ギャラドスと友達になる", reward: "たきのぼり習得", items: [] },
    { pokemon: "全体", quest: "巨大ビルを建築しよう", reward: "ストーリークリア", items: [] }
  ]
};

// 入団チャレンジ
const CHALLENGE_DATA = [
  { stage: 1, badge: "1つめのバッジ", items: ["ざいもく×10","いし×10"], tips: "序盤で達成可能" },
  { stage: 2, badge: "2つめのバッジ", items: ["レンガ×10","かみ×5"], tips: "もやす・リサイクルポケモンが必要" },
  { stage: 3, badge: "3つめのバッジ", items: ["てつ×10","ガラス×5"], tips: "溶鉱炉が必要" },
  { stage: 4, badge: "4つめのバッジ", items: ["てつののべぼう×5","コンクリート×10"], tips: "溶鉱炉+コンクリートミキサー" },
  { stage: 5, badge: "5つめのバッジ", items: ["ポケメタル×5","えのぐ×10"], tips: "上位素材。きのみのつぶしが必要" },
  { stage: 6, badge: "6つめのバッジ", items: ["デカヌギア×5","レアポケメタル×3"], tips: "しょくにん・レアもの必要" },
  { stage: 7, badge: "7つめのバッジ", items: ["上位素材各種"], tips: "詳細は攻略サイト参照" },
  { stage: 8, badge: "8つめのバッジ", items: ["上位素材各種"], tips: "詳細は攻略サイト参照" },
  { stage: 9, badge: "最終バッジ", items: ["最上位素材各種"], tips: "全ストーリークリア後推奨" }
];

// レシピデータ（主要なもの）
const RECIPES_DATA = [
  { name: "てつのだい", materials: [{ item: "てつののべぼう", count: 2 }], category: "家具" },
  { name: "キャンバス", materials: [{ item: "ざいもく", count: 1 }, { item: "かみ", count: 1 }], category: "家具" },
  { name: "しゅうのうボックス", materials: [{ item: "ざいもく", count: 1 }], category: "家具" },
  { name: "ビッグしゅうのうボックス", materials: [{ item: "ポケメタル", count: 3 }], category: "家具" },
  { name: "ほしくさのテーブル", materials: [{ item: "いし", count: 1 }, { item: "はっぱ", count: 1 }], category: "家具" },
  { name: "木のテーブル", materials: [{ item: "ざいもく", count: 1 }], category: "家具" },
  { name: "オフィスのテーブル", materials: [{ item: "ポケメタル", count: 2 }, { item: "ガラス", count: 2 }], category: "家具" },
  { name: "ナチュラルなベッド", materials: [{ item: "ざいもく", count: 2 }, { item: "わた", count: 2 }], category: "家具" },
  { name: "たきび", materials: [{ item: "じょうぶなえだ", count: 1 }, { item: "いし", count: 1 }], category: "おくがい" },
  { name: "スプリンクラー", materials: [{ item: "てつ", count: 1 }], category: "べんり" },
  { name: "木のすきましきり", materials: [{ item: "ざいもく", count: 2 }], category: "たてもの" },
  { name: "みんなのボックス", materials: [{ item: "ざいもく", count: 3 }], category: "べんり" },
  { name: "コンクリートミキサー", materials: [{ item: "てつ", count: 3 }], category: "べんり" },
  { name: "溶鉱炉", materials: [{ item: "いし", count: 5 }, { item: "レンガ", count: 3 }], category: "べんり" },
  { name: "まないた", materials: [{ item: "ざいもく", count: 1 }], category: "べんり" },
  { name: "カベかけかがみ", materials: [{ item: "ガラス", count: 2 }], category: "家具" }
];

// エリア情報
const AREAS = ["パサパサこうやの街", "ゴツゴツやまの街", "ドンヨリうみべの街", "キラキラうきしまの街", "まっさらな街"];

// ===================================================
// 生息地図鑑データ（実ゲームの番号付き生息地）
// area: パサパサこうやの街 / ドンヨリうみべの街 / ゴツゴツやまの街 / キラキラうきしまの街
// pokemon[].cond: "" = 全時間・全天候 / "夜" / "朝・昼・夕" / "晴・曇" / "雨"
// ===================================================
const HABITATS_DATA = [
  // ========== パサパサこうやの街 (No.001–049) ==========
  {no:"001",area:"パサパサこうやの街",name:"緑の草むら",materials:"みどりのくさ×4",pokemon:[{name:"フシギダネ",rarity:"★",cond:""},{name:"ヒトカゲ",rarity:"★",cond:"晴・曇"},{name:"ゼニガメ",rarity:"★",cond:""},{name:"ナゾノクサ",rarity:"★",cond:"夜"},{name:"イシツブテ",rarity:"★",cond:""},{name:"リザードン",rarity:"★★★",cond:""}]},
  {no:"002",area:"パサパサこうやの街",name:"木かげの草むら",materials:"大きな木×1・みどりのくさ×4",pokemon:[{name:"ストライク",rarity:"★",cond:""},{name:"マダツボミ",rarity:"★",cond:""},{name:"ハッサム",rarity:"★",cond:""},{name:"ホシガリス",rarity:"★",cond:""},{name:"カイロス",rarity:"★★",cond:""},{name:"ヘラクロス",rarity:"★★",cond:""}]},
  {no:"003",area:"パサパサこうやの街",name:"岩かげの草むら",materials:"みどりのくさ×4・おおきないし×1",pokemon:[{name:"ドッコラー",rarity:"★",cond:""},{name:"ワンリキー",rarity:"★",cond:""},{name:"ドテッコツ",rarity:"★★",cond:""}]},
  {no:"004",area:"パサパサこうやの街",name:"うるおう草むら",materials:"みどりのくさ×4・みず×2",pokemon:[{name:"ゼニガメ",rarity:"★",cond:""},{name:"ウッウ",rarity:"★",cond:""},{name:"ヌメイル",rarity:"★",cond:"雨"},{name:"カメール",rarity:"★★",cond:""},{name:"カメックス",rarity:"★★★",cond:""}]},
  {no:"005",area:"パサパサこうやの街",name:"波打ちぎわの草むら",materials:"みどりのくさ×4・うみのみず×2",pokemon:[{name:"ヤドン",rarity:"★",cond:""},{name:"ヤドラン",rarity:"★★★",cond:""},{name:"ヤドキング",rarity:"★★★",cond:""}]},
  {no:"006",area:"パサパサこうやの街",name:"高台の草むら",materials:"みどりのくさ×4・高いところ×1",pokemon:[{name:"ポッポ",rarity:"★",cond:"朝・昼・夕"},{name:"ホーホー",rarity:"★",cond:"夜"},{name:"ピジョン",rarity:"★★",cond:"朝・昼・夕"},{name:"ヨルノズク",rarity:"★★",cond:"夜"}]},
  {no:"007",area:"パサパサこうやの街",name:"照らされた草むら",materials:"草×4・明かり×1",pokemon:[{name:"コンパン",rarity:"★",cond:"夜"},{name:"モルフォン",rarity:"★★",cond:"夜"}]},
  {no:"008",area:"パサパサこうやの街",name:"きれいな花畑",materials:"はらっぱのはな×4",pokemon:[{name:"ポッポ",rarity:"★",cond:"朝・昼・夕"},{name:"ホーホー",rarity:"★",cond:"夜"},{name:"ミツハニー",rarity:"★",cond:""},{name:"ブビィ",rarity:"★",cond:""},{name:"イーブイ",rarity:"★",cond:""},{name:"ピジョン",rarity:"★★",cond:"朝・昼・夕"}]},
  {no:"009",area:"パサパサこうやの街",name:"木かげの花畑",materials:"きのみの木×1・はらっぱのはな×4",pokemon:[{name:"ヌメラ",rarity:"★",cond:"雨"},{name:"ノクタス",rarity:"★★",cond:"夜"}]},
  {no:"010",area:"パサパサこうやの街",name:"うるおう花畑",materials:"はらっぱのはな×4・みず×2",pokemon:[{name:"イルミーゼ",rarity:"★★",cond:""},{name:"バルビート",rarity:"★★",cond:""}]},
  {no:"011",area:"パサパサこうやの街",name:"花いっぱいの景色",materials:"はらっぱのはな×8",pokemon:[{name:"ビークイン",rarity:"★",cond:""},{name:"フシギソウ",rarity:"★★",cond:""}]},
  {no:"012",area:"パサパサこうやの街",name:"高台の花畑",materials:"はらっぱのはな×4・高いところ×1",pokemon:[{name:"パラス",rarity:"★",cond:""}]},
  {no:"013",area:"パサパサこうやの街",name:"花に囲まれたお墓",materials:"はらっぱのはな×4・はかいし×1",pokemon:[{name:"カラカラ",rarity:"★",cond:""},{name:"ガラガラ",rarity:"★★",cond:""}]},
  {no:"014",area:"パサパサこうやの街",name:"フラワーガーデン",materials:"いけがき×4・はらっぱのはな×4",pokemon:[{name:"パラス",rarity:"★",cond:""},{name:"パラセクト",rarity:"★★",cond:""}]},
  {no:"015",area:"パサパサこうやの街",name:"フレッシュ野菜畑",materials:"野菜畑×8",pokemon:[{name:"モグリュー",rarity:"★",cond:""},{name:"モクロー",rarity:"★",cond:""},{name:"ドリュウズ",rarity:"★★",cond:""}]},
  {no:"016",area:"パサパサこうやの街",name:"あたたかな風に乗って",materials:"たきび×3",pokemon:[{name:"フワンテ",rarity:"★",cond:""}]},
  {no:"017",area:"パサパサこうやの街",name:"キャンプセット",materials:"たきび×1・ほしくさのテーブル×1・ほしくさのこしかけ×1",pokemon:[{name:"リザード",rarity:"★★",cond:"晴・曇"}]},
  {no:"018",area:"パサパサこうやの街",name:"修行の滝",materials:"イス×1・みず×2・たき×1",pokemon:[{name:"バルキー",rarity:"★",cond:""}]},
  {no:"019",area:"パサパサこうやの街",name:"腹ペコダイニング",materials:"イス×1・つくえ×1・皿にのせた食べ物×1",pokemon:[{name:"ゴクリン",rarity:"★",cond:""}]},
  {no:"020",area:"パサパサこうやの街",name:"ピクニックな食卓",materials:"イス×2・つくえ×1・バスケット×1",pokemon:[{name:"ピチュー",rarity:"★",cond:""},{name:"ピカチュウ",rarity:"★",cond:""}]},
  {no:"021",area:"パサパサこうやの街",name:"はなやかな机",materials:"イス×1・つくえ×1・いちりんざし×1",pokemon:[{name:"ウツドン",rarity:"★★",cond:""},{name:"ウツボット",rarity:"★★★",cond:"晴・曇"}]},
  {no:"022",area:"パサパサこうやの街",name:"緑のベンチ",materials:"いけがき×2・イス（長いもの）×1",pokemon:[{name:"フシギダネ",rarity:"★",cond:""},{name:"フシギソウ",rarity:"★★",cond:""}]},
  {no:"023",area:"パサパサこうやの街",name:"照らされたベンチ",materials:"イス（長いもの）×1・がいとう×1",pokemon:[{name:"コンパン",rarity:"★",cond:"夜"}]},
  {no:"024",area:"パサパサこうやの街",name:"ジムの休けい所",materials:"サンドバッグ×1・イス×1",pokemon:[{name:"エビワラー",rarity:"★",cond:""}]},
  {no:"025",area:"パサパサこうやの街",name:"かけこみ救急所",materials:"イス×1・つくえ×1・きゅうきゅうばこ×1",pokemon:[{name:"サワムラー",rarity:"★",cond:""}]},
  {no:"026",area:"パサパサこうやの街",name:"ジムの救急所",materials:"つくえ×1・サンドバッグ×1・きゅうきゅうばこ×1",pokemon:[{name:"カポエラー",rarity:"★",cond:""}]},
  {no:"027",area:"パサパサこうやの街",name:"道案内のカンバン",materials:"やじるしかんばん×1・木のみち×3",pokemon:[{name:"カラナクシ",rarity:"★★",cond:""}]},
  {no:"028",area:"パサパサこうやの街",name:"大きな荷物をのせて",materials:"にぐるま×1・木ばこ×2",pokemon:[{name:"ドテッコツ",rarity:"★",cond:""}]},
  {no:"029",area:"パサパサこうやの街",name:"木こりの作業場",materials:"まるたのイス×1・にぐるま×1・きりかぶ×1・まるたのテーブル×1",pokemon:[{name:"キバゴ",rarity:"★",cond:""},{name:"オノンド",rarity:"★",cond:""},{name:"オノノクス",rarity:"★★",cond:""}]},
  {no:"030",area:"パサパサこうやの街",name:"ぬいぐるみとおやすみ",materials:"ベッド×1・にんぎょう×1",pokemon:[{name:"フワンテ",rarity:"★",cond:""},{name:"ゴンベ",rarity:"★★",cond:""},{name:"ヤドラン",rarity:"★★",cond:""},{name:"ヤドキング",rarity:"★★",cond:""}]},
  {no:"031",area:"パサパサこうやの街",name:"やさしい光でおやすみ",materials:"ベッド×1・つくえ×1・ほそながキャンドル×1",pokemon:[{name:"ホーホー",rarity:"★",cond:"夜"},{name:"ヨルノズク",rarity:"★",cond:"夜"}]},
  {no:"032",area:"パサパサこうやの街",name:"お墓にお供えもの",materials:"はかいし×1・ほそながキャンドル×2・皿にのせた食べ物×1",pokemon:[{name:"ヒトモシ",rarity:"★",cond:""},{name:"ランプラー",rarity:"★★",cond:""}]},
  {no:"033",area:"パサパサこうやの街",name:"ブキミなお墓にお供えもの",materials:"あやしいキャンドル×2・はかいし×1・皿にのせた食べ物×1",pokemon:[{name:"ヒトモシ",rarity:"★",cond:""},{name:"ランプラー",rarity:"★",cond:""},{name:"シャンデラ",rarity:"★★",cond:""}]},
  {no:"036",area:"パサパサこうやの街",name:"日かげでプカプカ水遊び",materials:"ビニールボート×1・ビーチパラソル×1・みず×2",pokemon:[{name:"カメックス",rarity:"★★",cond:""}]},
  {no:"037",area:"パサパサこうやの街",name:"さらさらな草むら",materials:"かれたみどりのくさ×4・さらさらいわ×1",pokemon:[{name:"イワーク",rarity:"★",cond:""}]},
  {no:"038",area:"パサパサこうやの街",name:"工場の物置き",materials:"がいとう×1・そうさばん×1・ドラムかん×1・からまりコード×1",pokemon:[{name:"コイル",rarity:"★",cond:""}]},
  {no:"041",area:"パサパサこうやの街",name:"あまごいスポット",materials:"てるてるポワルン（雨）×2・皿にのせた食べ物×1",pokemon:[{name:"ヌメラ",rarity:"★",cond:"雨"}]},
  {no:"042",area:"パサパサこうやの街",name:"にほんばれスポット",materials:"てるてるポワルン（晴れ）×2・皿にのせた食べ物×1",pokemon:[{name:"サボネア",rarity:"★",cond:"晴"}]},
  {no:"047",area:"パサパサこうやの街",name:"木かげでぐっすりカビゴン",materials:"大きな木×1・いねむりベッド×1",pokemon:[{name:"ゴンベ",rarity:"★",cond:""},{name:"カビゴン",rarity:"★★",cond:""}]},
  // ========== ドンヨリうみべの街 (No.050–096) ==========
  {no:"050",area:"ドンヨリうみべの街",name:"黄色の草むら",materials:"きいろのくさ×4",pokemon:[{name:"イトマル",rarity:"★",cond:""},{name:"アゴジムシ",rarity:"★",cond:""},{name:"アリアドス",rarity:"★★",cond:""}]},
  {no:"051",area:"ドンヨリうみべの街",name:"木かげの黄色の草むら",materials:"大きな木×1・きいろのくさ×4",pokemon:[{name:"ズバット",rarity:"★",cond:"夜"},{name:"マクノシタ",rarity:"★",cond:""},{name:"ハリテヤマ",rarity:"★★",cond:""}]},
  {no:"052",area:"ドンヨリうみべの街",name:"高台の黄色の草むら",materials:"きいろのくさ×4・高いところ×1",pokemon:[{name:"キャモメ",rarity:"★",cond:"朝・昼・夕"},{name:"ペリッパー",rarity:"★★",cond:"朝・昼・夕"},{name:"クロバット",rarity:"★★★",cond:"夜"}]},
  {no:"053",area:"ドンヨリうみべの街",name:"うるおう黄色の草むら",materials:"きいろのくさ×4・みず×2",pokemon:[{name:"ルリリ",rarity:"★",cond:""},{name:"ポッチャマ",rarity:"★",cond:""},{name:"マリル",rarity:"★★",cond:""},{name:"ポッタイシ",rarity:"★★",cond:""}]},
  {no:"054",area:"ドンヨリうみべの街",name:"沼地の草むら",materials:"きいろのくさ×4・どろみず×2",pokemon:[{name:"ウパー（パルデア）",rarity:"★",cond:""}]},
  {no:"055",area:"ドンヨリうみべの街",name:"草むらの自販機",materials:"きいろのくさ×4・じどうはんばいき×1",pokemon:[{name:"メリープ",rarity:"★★",cond:""}]},
  {no:"056",area:"ドンヨリうみべの街",name:"すずしげな花畑",materials:"うみべのはな×4",pokemon:[{name:"パモ",rarity:"★",cond:""},{name:"ゾロア",rarity:"★",cond:""},{name:"ゾロアーク",rarity:"★★",cond:""}]},
  {no:"057",area:"ドンヨリうみべの街",name:"南国気分",materials:"おおきなヤシの木×1・うみべのはな×4",pokemon:[{name:"クサイハナ",rarity:"★",cond:""},{name:"タマタマ",rarity:"★",cond:""},{name:"ナッシー",rarity:"★★★",cond:""}]},
  {no:"058",area:"ドンヨリうみべの街",name:"風の花畑",materials:"風力はつでんマシン×1・うみべのはな×4",pokemon:[{name:"キャモメ",rarity:"★",cond:""},{name:"ペリッパー",rarity:"★★",cond:""}]},
  {no:"059",area:"ドンヨリうみべの街",name:"ビーチの木かげ",materials:"おおきなヤシの木×1・ビーチチェア×1",pokemon:[{name:"タマタマ",rarity:"★",cond:""},{name:"ナッシー",rarity:"★★",cond:""}]},
  {no:"060",area:"ドンヨリうみべの街",name:"トロピカルシーサイド",materials:"おおきなヤシの木×1・いけがき×4・うみのみず×2",pokemon:[{name:"ラプラス",rarity:"★",cond:""}]},
  {no:"061",area:"ドンヨリうみべの街",name:"お休みどころ",materials:"だんボールのはこ×1・ほしくさのベッド×1",pokemon:[{name:"ニャース",rarity:"★",cond:""}]},
  {no:"062",area:"ドンヨリうみべの街",name:"おかたづけをしよう",materials:"だんボールのはこ×1・おもちゃ×2",pokemon:[{name:"ガーディ",rarity:"★",cond:""},{name:"ルリリ",rarity:"★",cond:""}]},
  {no:"063",area:"ドンヨリうみべの街",name:"ゴミ集積所",materials:"ゴミ入れ×1・かんばん×1・ゴミぶくろ×1",pokemon:[{name:"ヤブクロン",rarity:"★",cond:""}]},
  {no:"064",area:"ドンヨリうみべの街",name:"ゴミ箱がいっぱい",materials:"ゴミばこ×4",pokemon:[{name:"レアコイル",rarity:"★★",cond:""},{name:"エレキュー",rarity:"★★",cond:""}]},
  {no:"065",area:"ドンヨリうみべの街",name:"ゴミ捨て場",materials:"でんちゅう×1・ゴミぶくろ×1",pokemon:[{name:"クロバット",rarity:"★★",cond:"夜"}]},
  {no:"066",area:"ドンヨリうみべの街",name:"公園のベンチ",materials:"イス（長いもの）×1・ゴミばこ×1",pokemon:[{name:"ズバット",rarity:"★",cond:"夜"},{name:"ビリリダマ",rarity:"★",cond:""},{name:"マルマイン",rarity:"★★★",cond:""}]},
  {no:"067",area:"ドンヨリうみべの街",name:"腹ペコレストラン",materials:"イス×1・メニューボード×1・つくえ×1・皿にのせた食べ物×1",pokemon:[{name:"パモット",rarity:"★",cond:""},{name:"パモ",rarity:"★",cond:""}]},
  {no:"069",area:"ドンヨリうみべの街",name:"ピヨピヨごはん",materials:"木のすばこ×1・つくえ×1・皿にのせた食べ物×1",pokemon:[{name:"アチャモ",rarity:"★",cond:""},{name:"バシャーモ",rarity:"★★★",cond:""}]},
  {no:"070",area:"ドンヨリうみべの街",name:"カフェスペース",materials:"イス×2・はち植えの木×1・カウンターのだい×2・メニューボード×1",pokemon:[{name:"パモット",rarity:"★",cond:""},{name:"パーモット",rarity:"★",cond:""}]},
  {no:"075",area:"ドンヨリうみべの街",name:"お着がえスペース",materials:"クローゼット×1・かがみ×1",pokemon:[{name:"チラーミィ",rarity:"★",cond:""}]},
  {no:"076",area:"ドンヨリうみべの街",name:"おめかし中は見ないで",materials:"ついたて×2・クローゼット×1・ドレッサー×1",pokemon:[{name:"チラーミィ",rarity:"★",cond:""}]},
  {no:"077",area:"ドンヨリうみべの街",name:"毛糸で編み物",materials:"イス×1・つくえ×1・あみものキット×1",pokemon:[{name:"メリープ",rarity:"★",cond:""},{name:"モコモ",rarity:"★★",cond:""}]},
  {no:"078",area:"ドンヨリうみべの街",name:"温泉の洗い場",materials:"シャワー×1・イス×1・おんせん×2",pokemon:[{name:"コダック",rarity:"★",cond:""},{name:"ゴルダック",rarity:"★★",cond:""}]},
  {no:"079",area:"ドンヨリうみべの街",name:"リゾートでご飯のしたく",materials:"おおきなヤシの木×1・イス×1・皿にのせた食べ物×1・たきび×1",pokemon:[{name:"ガーディ",rarity:"★",cond:""},{name:"アチャモ",rarity:"★",cond:""},{name:"ワカシャモ",rarity:"★★",cond:""}]},
  {no:"080",area:"ドンヨリうみべの街",name:"荷づくりできたよ",materials:"にぐるま×1・だんボールのはこ×2",pokemon:[{name:"カモネギ",rarity:"★",cond:""},{name:"マクノシタ",rarity:"★",cond:""},{name:"ハリテヤマ",rarity:"★★",cond:""}]},
  {no:"081",area:"ドンヨリうみべの街",name:"完治までおやすみ",materials:"ベッド×1・ナチュラルなチェスト×1・きゅうきゅうばこ×1",pokemon:[{name:"ラッキー",rarity:"★",cond:""},{name:"ピカチュウ",rarity:"★★",cond:""}]},
  {no:"082",area:"ドンヨリうみべの街",name:"目覚ましベッドスペース",materials:"ベッド×1・つくえ×1・めざましどけい×1",pokemon:[{name:"ピンプク",rarity:"★",cond:""}]},
  {no:"084",area:"ドンヨリうみべの街",name:"自販機セット",materials:"ゴミ入れ×1・じどうはんばいき×1",pokemon:[{name:"エレキッド",rarity:"★",cond:""}]},
  {no:"085",area:"ドンヨリうみべの街",name:"ミニゲームコーナー",materials:"アーケードゲームマシン×1・イス×1・パンチングマシーン×1",pokemon:[{name:"レアコイル",rarity:"★",cond:""}]},
  {no:"087",area:"ドンヨリうみべの街",name:"火力はつでん所",materials:"ドラムかん×1・火力はつでんマシン×1",pokemon:[{name:"ワカシャモ",rarity:"★",cond:""},{name:"バシャーモ",rarity:"★★",cond:""}]},
  {no:"089",area:"ドンヨリうみべの街",name:"あやしい書さい",materials:"ほんだな×1・シックなソファ×1・ナチュラルなテーブル×1・ほそながキャンドル×1",pokemon:[{name:"ゴース",rarity:"★",cond:"夜"}]},
  {no:"090",area:"ドンヨリうみべの街",name:"ふなのりごっこ",materials:"たる×2・ふねのハンドル×1・うちあげづつ×2",pokemon:[{name:"ビリリダマ",rarity:"★",cond:""},{name:"マルマイン",rarity:"★",cond:""}]},
  {no:"091",area:"ドンヨリうみべの街",name:"レジでお会計",materials:"つくえ×2・レジ×1",pokemon:[{name:"ニャース",rarity:"★",cond:""},{name:"タブンネ",rarity:"★",cond:""},{name:"ピンプク",rarity:"★",cond:""}]},
  {no:"092",area:"ドンヨリうみべの街",name:"グルメなお供え物",materials:"おそなえのだい×1",pokemon:[{name:"こけカビゴン",rarity:"★",cond:""}]},
  {no:"093",area:"ドンヨリうみべの街",name:"ピカチュウスペース",materials:"ピカチュウソファ×1・ピカチュウにんぎょう×1",pokemon:[{name:"ミミッキュ",rarity:"★",cond:""}]},
  // ========== ゴツゴツやまの街 (No.097–136) ==========
  {no:"097",area:"ゴツゴツやまの街",name:"赤い草むら",materials:"あかいくさ×4",pokemon:[{name:"ヒバニー",rarity:"★",cond:""},{name:"コロボーシ",rarity:"★",cond:""},{name:"リオル",rarity:"★",cond:""},{name:"コロトック",rarity:"★★",cond:""},{name:"エースバーン",rarity:"★★★",cond:""}]},
  {no:"098",area:"ゴツゴツやまの街",name:"木かげの赤い草むら",materials:"大きな木×1・あかいくさ×4",pokemon:[{name:"ディグダ",rarity:"★",cond:""},{name:"ダグトリオ",rarity:"★★",cond:""},{name:"ウソハチ",rarity:"★",cond:""},{name:"ウソッキー",rarity:"★★",cond:""}]},
  {no:"099",area:"ゴツゴツやまの街",name:"三角木かげに岩と草むら",materials:"さんかくの木×1・あかいくさ×4・おおきないし×1",pokemon:[{name:"フクスロー",rarity:"★",cond:""}]},
  {no:"100",area:"ゴツゴツやまの街",name:"うるおう赤い草むら",materials:"あかいくさ×4・みず×2",pokemon:[{name:"ハスボー",rarity:"★",cond:""},{name:"ハスブレロ",rarity:"★★",cond:""}]},
  {no:"101",area:"ゴツゴツやまの街",name:"高台の赤い草むら",materials:"あかいくさ×4・高いところ×1",pokemon:[{name:"ヤミカラス",rarity:"★",cond:"夜"},{name:"ペラップ",rarity:"★",cond:"朝・昼・夕"},{name:"ドンカラス",rarity:"★★",cond:"夜"}]},
  {no:"102",area:"ゴツゴツやまの街",name:"草むらトレーニング場",materials:"どのう×2・あかいくさ×4",pokemon:[{name:"ゴーリキー",rarity:"★",cond:""}]},
  {no:"103",area:"ゴツゴツやまの街",name:"ゆうがな花畑",materials:"いわばのはな×4",pokemon:[{name:"ピィ",rarity:"★",cond:"夜"},{name:"ピッピ",rarity:"★",cond:"夜"},{name:"パピモッチ",rarity:"★",cond:"朝・昼・夕"},{name:"バウッツェル",rarity:"★★",cond:"朝・昼・夕"}]},
  {no:"104",area:"ゴツゴツやまの街",name:"木かげのゆうがな花畑",materials:"さんかくの木×1・いわばのはな×4",pokemon:[{name:"ヤミカラス",rarity:"★",cond:"夜"},{name:"ウルガモス",rarity:"★★★",cond:""}]},
  {no:"105",area:"ゴツゴツやまの街",name:"うるおうゆうがな花畑",materials:"いわばのはな×4・みず×2",pokemon:[{name:"アーボ",rarity:"★",cond:""},{name:"アーボック",rarity:"★★",cond:""},{name:"ニョロトノ",rarity:"★★",cond:""}]},
  {no:"106",area:"ゴツゴツやまの街",name:"花畑の切り株ステージ",materials:"いわばのはな×4・きりかぶ×1・キノコのランプ×2",pokemon:[{name:"ププリン",rarity:"★",cond:""},{name:"プリン",rarity:"★",cond:""},{name:"ニョロトノ",rarity:"★★",cond:""}]},
  {no:"108",area:"ゴツゴツやまの街",name:"うきうきな水たまり",materials:"うきくさ×4・みず×2",pokemon:[{name:"ハスボー",rarity:"★",cond:""},{name:"ルンパッパ",rarity:"★★",cond:""}]},
  {no:"109",area:"ゴツゴツやまの街",name:"コケまみれ",materials:"コケ×4",pokemon:[{name:"ヨーギラス",rarity:"★",cond:""}]},
  {no:"110",area:"ゴツゴツやまの街",name:"コケまみれの岩",materials:"コケ×4・こけいわ×1",pokemon:[{name:"ゴローン",rarity:"★",cond:""}]},
  {no:"111",area:"ゴツゴツやまの街",name:"コケむす温泉",materials:"コケ×4・おんせん×1",pokemon:[{name:"コータス",rarity:"★",cond:""}]},
  {no:"112",area:"ゴツゴツやまの街",name:"露天風呂",materials:"ゆぐち×1・おんせん×2",pokemon:[{name:"ラビフット",rarity:"★",cond:""}]},
  {no:"115",area:"ゴツゴツやまの街",name:"掘って燃やして",materials:"ておしぐるま×1・ようこうろ×1・やまほりどうぐ×1",pokemon:[{name:"ブーバー",rarity:"★",cond:""}]},
  {no:"118",area:"ゴツゴツやまの街",name:"荷物置き場でつまみ食い",materials:"たる×1・木ばこ×1・ランタン×1・皿にのせた食べ物×1",pokemon:[{name:"ディグダ",rarity:"★",cond:""}]},
  {no:"120",area:"ゴツゴツやまの街",name:"パクパクパン工房",materials:"パンがま×1・カウンターのだい×1・皿にのせた食べ物×1",pokemon:[{name:"パピモッチ",rarity:"★",cond:"朝・昼・夕"},{name:"バウッツェル",rarity:"★★",cond:"朝・昼・夕"}]},
  {no:"123",area:"ゴツゴツやまの街",name:"さえずりのリサイタル",materials:"とまり木×1・スタンドマイク×1",pokemon:[{name:"ペラップ",rarity:"★",cond:"朝・昼・夕"}]},
  {no:"125",area:"ゴツゴツやまの街",name:"リズムに合わせてワンツー",materials:"サンドバッグ×1・つくえ×1・CDプレイヤー×1",pokemon:[{name:"ゴーリキー",rarity:"★",cond:""},{name:"リオル",rarity:"★",cond:""}]},
  {no:"127",area:"ゴツゴツやまの街",name:"プチ博物館",materials:"しきり×1・てんじだい×1・おとしもの×1",pokemon:[{name:"コレクレー",rarity:"★",cond:""}]},
  {no:"128",area:"ゴツゴツやまの街",name:"さわやかロッカールーム",materials:"オフィスのロッカー×2・はち植えの木×1・イス×1・パンチングマシーン×1",pokemon:[{name:"エースバーン",rarity:"★★",cond:""}]},
  {no:"130",area:"ゴツゴツやまの街",name:"ふみきり",materials:"せんろ×1・しゃだんき×1",pokemon:[{name:"トロッゴン",rarity:"★",cond:""},{name:"タンドン",rarity:"★",cond:""}]},
  // ========== キラキラうきしまの街 (No.137–145) ==========
  {no:"137",area:"キラキラうきしまの街",name:"ピンクの草むら",materials:"ピンクのくさ×4",pokemon:[{name:"ナックラー",rarity:"★",cond:""},{name:"チルット",rarity:"★",cond:""},{name:"ヨマワル",rarity:"★",cond:"夜"},{name:"ビブラーバ",rarity:"★★",cond:""},{name:"フライゴン",rarity:"★★",cond:""}]},
  {no:"138",area:"キラキラうきしまの街",name:"木かげのピンクの草むら",materials:"大きな木×1・ピンクのくさ×4",pokemon:[{name:"ニャオハ",rarity:"★",cond:""},{name:"サナギラス",rarity:"★",cond:""},{name:"ドラメシヤ",rarity:"★",cond:""}]},
  {no:"139",area:"キラキラうきしまの街",name:"うるおうピンクの草むら",materials:"ピンクのくさ×4・みず×2",pokemon:[{name:"ケロマツ",rarity:"★",cond:""},{name:"ゲコガシラ",rarity:"★★",cond:""}]},
  {no:"140",area:"キラキラうきしまの街",name:"高台のピンクの草むら",materials:"ピンクのくさ×4・高いところ×1",pokemon:[{name:"アオガラス",rarity:"★",cond:""},{name:"カイデン",rarity:"★",cond:""}]},
  {no:"142",area:"キラキラうきしまの街",name:"フワフワな花畑",materials:"うきしまのはな×4",pokemon:[{name:"ロコン",rarity:"★",cond:""},{name:"ムウマ",rarity:"★",cond:"夜"},{name:"ココガラ",rarity:"★",cond:""}]},
  {no:"143",area:"キラキラうきしまの街",name:"木かげのフワフワな花畑",materials:"大きな木×1・うきしまのはな×4",pokemon:[{name:"キリンリキ",rarity:"★",cond:""}]},
  {no:"144",area:"キラキラうきしまの街",name:"うるおうフワフワな花畑",materials:"うきしまのはな×4・みず×2",pokemon:[{name:"ミニリュウ",rarity:"★",cond:""}]},
  {no:"145",area:"キラキラうきしまの街",name:"水辺の小舟",materials:"カヌー×1・うきくさ×2・みず×2・高いところ×1",pokemon:[{name:"カイリュー",rarity:"★",cond:""}]},
  // ========== 釣り生息地 ==========
  {no:"184",area:"ドンヨリうみべの街",name:"釣り堀",materials:"つりざお×1・イス×1・みず×1",pokemon:[{name:"ヤドラン",rarity:"★★",cond:""},{name:"ヤドキング",rarity:"★★",cond:""}]},
  {no:"185",area:"ドンヨリうみべの街",name:"海釣り",materials:"つりざお×1・イス×1・うみのみず×1",pokemon:[{name:"コイキング",rarity:"★",cond:""}]},
];

