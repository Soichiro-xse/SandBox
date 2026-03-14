// ぽこあポケモン 生息地図鑑データ（全212種）
// エリア: パサパサこうやの街、ドンヨリうみべの街、ゴツゴツやまの街、キラキラそらの街、イベント

// 素材アイテムのアイコンマッピング
export const ITEM_ICONS = {
  'みどりのくさ': '🌿',
  'あかいくさ': '🌺',
  'もふもふのくさ': '🧶',
  'はらっぱのはな': '🌸',
  'しろいはな': '🤍',
  'あかいはな': '❤️',
  'あおいはな': '💙',
  'きいろいはな': '💛',
  'コケ': '🍀',
  'すな': '⏳',
  'かわいたつち': '🟫',
  'おおきないし': '🪨',
  'みず': '💧',
  'うみのみず': '🌊',
  'こおり': '🧊',
  'マグマ': '🌋',
  'どろ': '💩',
  'ぬめぬめ': '🫧',
  'どく': '☠️',
  'でんき': '⚡',
  'ほのお': '🔥',
  'やみ': '🌑',
  'あかり': '💡',
  'つきのひかり': '🌕',
  'ほし': '🌟',
  'きり': '🌫️',
  'かぜ': '💨',
  '大きな木': '🌳',
  'きのみの木': '🍒',
  'まるた': '🪵',
  'ほらあな': '🕳️',
  'いせき': '🏛️',
  'かせき': '🦴',
  'きかい': '⚙️',
  'がれき': '🧱',
  'せきたん': '�ite',
  'さく': '🏗️',
  'ゴミぶくろ': '🗑️',
  'てつ': '🔩',
  'サボテン': '🌵',
  'エスパー': '🔮',
  'つるぎ': '⚔️',
  'ともしび': '🕯️',
  'ドラゴン': '🐉',
  'ほうせき': '💎',
  '高いところ': '🏔️',
  'あわ': '🫧',
};

// 生息地の地形タイプアイコン
export const TERRAIN_ICONS = {
  '草むら': '🌿',
  '花畑': '🌸',
  '池': '💧',
  '砂地': '⏳',
  '沼地': '🟤',
  '洞くつ': '🕳️',
  '遺跡': '🏛️',
  '海': '🌊',
  '岩': '🪨',
  'マグマ': '🌋',
  '化石': '🦴',
  '機械': '⚙️',
  'コケ': '🍀',
  'ゴミ': '🗑️',
};

export function getTerrainIcon(habitatName) {
  for (const [key, icon] of Object.entries(TERRAIN_ICONS)) {
    if (habitatName.includes(key)) return icon;
  }
  return '🏕️';
}

export function getItemIcon(itemStr) {
  // itemStr is like "みどりのくさ×4"
  const name = itemStr.replace(/×\d+$/, '').trim();
  return ITEM_ICONS[name] || '📦';
}

export function getHabitatImageUrl(number) {
  const n = parseInt(number, 10);
  return `/habitats/habitat_${n}.png`;
}

export const AREAS = [
  { id: 'pasapasa', name: 'パサパサこうやの街', color: '#e8c170', icon: '🏜️' },
  { id: 'donyori', name: 'ドンヨリうみべの街', color: '#6bb5e0', icon: '🌊' },
  { id: 'gotsugotsu', name: 'ゴツゴツやまの街', color: '#8b7355', icon: '⛰️' },
  { id: 'kirakira', name: 'キラキラそらの街', color: '#c9a0dc', icon: '✨' },
  { id: 'event', name: 'イベント', color: '#ff8a80', icon: '🎉' },
];

export const POKEMON_NAME_TO_ID = {
  'フシギダネ': 1, 'フシギソウ': 2, 'フシギバナ': 3,
  'ヒトカゲ': 4, 'リザード': 5, 'リザードン': 6,
  'ゼニガメ': 7, 'カメール': 8, 'カメックス': 9,
  'キャタピー': 10, 'トランセル': 11, 'バタフリー': 12,
  'ビードル': 13, 'コクーン': 14, 'スピアー': 15,
  'ポッポ': 16, 'ピジョン': 17, 'ピジョット': 18,
  'コラッタ': 19, 'ラッタ': 20,
  'オニスズメ': 21, 'オニドリル': 22,
  'アーボ': 23, 'アーボック': 24,
  'ピカチュウ': 25, 'ライチュウ': 26,
  'サンド': 27, 'サンドパン': 28,
  'ニドラン♀': 29, 'ニドリーナ': 30, 'ニドクイン': 31,
  'ニドラン♂': 32, 'ニドリーノ': 33, 'ニドキング': 34,
  'ピッピ': 35, 'ピクシー': 36,
  'ロコン': 37, 'キュウコン': 38,
  'プリン': 39, 'プクリン': 40,
  'ズバット': 41, 'ゴルバット': 42,
  'ナゾノクサ': 43, 'クサイハナ': 44, 'ラフレシア': 45,
  'パラス': 46, 'パラセクト': 47,
  'コンパン': 48, 'モルフォン': 49,
  'ディグダ': 50, 'ダグトリオ': 51,
  'ニャース': 52, 'ペルシアン': 53,
  'コダック': 54, 'ゴルダック': 55,
  'マンキー': 56, 'オコリザル': 57,
  'ガーディ': 58, 'ウインディ': 59,
  'ニョロモ': 60, 'ニョロゾ': 61, 'ニョロボン': 62,
  'ケーシィ': 63, 'ユンゲラー': 64, 'フーディン': 65,
  'ワンリキー': 66, 'ゴーリキー': 67, 'カイリキー': 68,
  'マダツボミ': 69, 'ウツドン': 70, 'ウツボット': 71,
  'メノクラゲ': 72, 'ドククラゲ': 73,
  'イシツブテ': 74, 'ゴローン': 75, 'ゴローニャ': 76,
  'ポニータ': 77, 'ギャロップ': 78,
  'ヤドン': 79, 'ヤドラン': 80,
  'コイル': 81, 'レアコイル': 82,
  'カモネギ': 83,
  'ドードー': 84, 'ドードリオ': 85,
  'パウワウ': 86, 'ジュゴン': 87,
  'ベトベター': 88, 'ベトベトン': 89,
  'シェルダー': 90, 'パルシェン': 91,
  'ゴース': 92, 'ゴースト': 93, 'ゲンガー': 94,
  'イワーク': 95,
  'スリープ': 96, 'スリーパー': 97,
  'クラブ': 98, 'キングラー': 99,
  'ビリリダマ': 100, 'マルマイン': 101,
  'タマタマ': 102, 'ナッシー': 103,
  'カラカラ': 104, 'ガラガラ': 105,
  'サワムラー': 106, 'エビワラー': 107,
  'ベロリンガ': 108,
  'ドガース': 109, 'マタドガス': 110,
  'サイホーン': 111, 'サイドン': 112,
  'ラッキー': 113,
  'モンジャラ': 114,
  'ガルーラ': 115,
  'タッツー': 116, 'シードラ': 117,
  'トサキント': 118, 'アズマオウ': 119,
  'ヒトデマン': 120, 'スターミー': 121,
  'バリヤード': 122,
  'ストライク': 123,
  'ルージュラ': 124,
  'エレブー': 125, 'ブーバー': 126,
  'カイロス': 127,
  'ケンタロス': 128,
  'コイキング': 129, 'ギャラドス': 130,
  'ラプラス': 131,
  'メタモン': 132,
  'イーブイ': 133, 'シャワーズ': 134, 'サンダース': 135, 'ブースター': 136,
  'ポリゴン': 137,
  'オムナイト': 138, 'オムスター': 139,
  'カブト': 140, 'カブトプス': 141,
  'プテラ': 142,
  'カビゴン': 143,
  'ミニリュウ': 147, 'ハクリュー': 148, 'カイリュー': 149,
  'チコリータ': 152, 'ベイリーフ': 153, 'メガニウム': 154,
  'ヒノアラシ': 155, 'マグマラシ': 156, 'バクフーン': 157,
  'ワニノコ': 158, 'アリゲイツ': 159, 'オーダイル': 160,
  'オタチ': 161, 'オオタチ': 162,
  'ホーホー': 163, 'ヨルノズク': 164,
  'レディバ': 165, 'レディアン': 166,
  'イトマル': 167, 'アリアドス': 168,
  'クロバット': 169,
  'チョンチー': 170, 'ランターン': 171,
  'ピチュー': 172,
  'ピィ': 173, 'ププリン': 174,
  'トゲピー': 175, 'トゲチック': 176,
  'ネイティ': 177, 'ネイティオ': 178,
  'メリープ': 179, 'モココ': 180, 'デンリュウ': 181,
  'キレイハナ': 182,
  'マリル': 183, 'マリルリ': 184,
  'ウソッキー': 185,
  'ニョロトノ': 186,
  'ハネッコ': 187, 'ポポッコ': 188, 'ワタッコ': 189,
  'エイパム': 190,
  'ヒマナッツ': 191, 'キマワリ': 192,
  'ヤンヤンマ': 193,
  'ウパー': 194, 'ヌオー': 195,
  'エーフィ': 196, 'ブラッキー': 197,
  'ヤミカラス': 198,
  'ヤドキング': 199,
  'ムウマ': 200,
  'アンノーン': 201,
  'ソーナンス': 202,
  'キリンリキ': 203,
  'クヌギダマ': 204, 'フォレトス': 205,
  'ノコッチ': 206,
  'グライガー': 207,
  'ハガネール': 208,
  'ブルー': 209, 'グランブル': 210,
  'ハリーセン': 211,
  'ハッサム': 212,
  'ツボツボ': 213,
  'ヘラクロス': 214,
  'ニューラ': 215,
  'ヒメグマ': 216, 'リングマ': 217,
  'マグマッグ': 218, 'マグカルゴ': 219,
  'ウリムー': 220, 'イノムー': 221,
  'サニーゴ': 222,
  'テッポウオ': 223, 'オクタン': 224,
  'デリバード': 225,
  'マンタイン': 226,
  'エアームド': 227,
  'デルビル': 228, 'ヘルガー': 229,
  'キングドラ': 230,
  'ゴマゾウ': 231, 'ドンファン': 232,
  'ポリゴン2': 233,
  'オドシシ': 234,
  'ドーブル': 235,
  'バルキー': 236, 'カポエラー': 237,
  'ムチュール': 238, 'エレキッド': 239, 'ブビィ': 240,
  'ミルタンク': 241,
  'ハピナス': 242,
  'ヨーギラス': 246, 'サナギラス': 247, 'バンギラス': 248,
  'ミツハニー': 415, 'ビークイン': 416,
  'ホシガリス': 819, 'ヨクバリス': 820,
  'ウールー': 831, 'バイウールー': 832,
  'タンドン': 837, 'トロッゴン': 838, 'セキタンザン': 839,
  'ウッウ': 845,
  'ヌメラ': 704, 'ヌメイル': 705, 'ヌメルゴン': 706,
  'リオル': 447, 'ルカリオ': 448,
  'コロボーシ': 401, 'コロトック': 402,
  'ヒバニー': 813, 'ラビフット': 814, 'エースバーン': 815,
  'ドッコラー': 532, 'ドテッコツ': 533, 'ローブシン': 534,
  'エレキブル': 466, 'ブーバーン': 467,
  'ベロベルト': 463,
  'モグリュー': 529, 'ドリュウズ': 530,
  'メグロコ': 551, 'ワルビル': 552, 'ワルビアル': 553,
  'ダルマッカ': 554, 'ヒヒダルマ': 555,
  'ヤブクロン': 568, 'ダストダス': 569,
  'コアルヒー': 580, 'スワンナ': 581,
  'タマゲタケ': 590, 'モロバレル': 591,
  'プルリル': 592, 'ブルンゲル': 593,
  'バチュル': 595, 'デンチュラ': 596,
  'ギアル': 599, 'ギギアル': 600, 'ギギギアル': 601,
  'シビシラス': 602, 'シビビール': 603, 'シビルドン': 604,
  'リグレー': 605, 'オーベム': 606,
  'ヒトモシ': 607, 'ランプラー': 608, 'シャンデラ': 609,
  'キバゴ': 610, 'オノンド': 611, 'オノノクス': 612,
  'クマシュン': 613, 'ツンベアー': 614,
  'コマタナ': 624, 'キリキザン': 625,
  'モノズ': 633, 'ジヘッド': 634, 'サザンドラ': 635,
  'メラルバ': 636, 'ウルガモス': 637,
  'ヤヤコマ': 661, 'ヒノヤコマ': 662, 'ファイアロー': 663,
  'フラベベ': 669, 'フラエッテ': 670, 'フラージェス': 671,
  'メェークル': 672, 'ゴーゴート': 673,
  'ヤンチャム': 674, 'ゴロンダ': 675,
  'トリミアン': 676,
  'ニャスパー': 677, 'ニャオニクス': 678,
  'ヒトツキ': 679, 'ニダンギル': 680, 'ギルガルド': 681,
  'シュシュプ': 682, 'フレフワン': 683,
  'ペロッパフ': 684, 'ペロリーム': 685,
  'マーイーカ': 686, 'カラマネロ': 687,
  'カメテテ': 688, 'ガメノデス': 689,
  'クズモー': 690, 'ドラミドロ': 691,
  'ウデッポウ': 692, 'ブロスター': 693,
  'エリキテル': 694, 'エレザード': 695,
  'チゴラス': 696, 'ガチゴラス': 697,
  'アマルス': 698, 'アマルルガ': 699,
  'デデンネ': 702,
  'メレシー': 703,
  'オンバット': 714, 'オンバーン': 715,
  'リーフィア': 470, 'グレイシア': 471,
  'ニンフィア': 700,
  'トゲキッス': 468,
  'マニューラ': 461,
  'グライオン': 472,
  'メガヤンマ': 469,
  'ジバコイル': 462,
  'ムウマージ': 429,
  'ドサイドン': 464,
  'エテボース': 424,
  'ハピナス': 242,
  'ポリゴンZ': 474,
  'マンムー': 473,
  'ノコッチ': 206,
};

export const habitats = [
  // ========== パサパサこうやの街 ==========
  {
    id: 1, number: '001', name: '緑の草むら', area: 'pasapasa',
    items: ['みどりのくさ×4'],
    pokemon: [
      { name: 'フシギダネ', condition: null },
      { name: 'ヒトカゲ', condition: null },
      { name: 'ゼニガメ', condition: null },
      { name: 'ナゾノクサ', condition: null },
      { name: 'イシツブテ', condition: null },
      { name: 'リザードン', condition: '珍しい' },
    ]
  },
  {
    id: 2, number: '002', name: '木かげの草むら', area: 'pasapasa',
    items: ['大きな木×1', 'みどりのくさ×4'],
    pokemon: [
      { name: 'マダツボミ', condition: null },
      { name: 'ストライク', condition: null },
      { name: 'ハッサム', condition: '珍しい' },
      { name: 'ホシガリス', condition: null },
      { name: 'カイロス', condition: null },
      { name: 'ヘラクロス', condition: null },
    ]
  },
  {
    id: 3, number: '003', name: '岩かげの草むら', area: 'pasapasa',
    items: ['みどりのくさ×4', 'おおきないし×1'],
    pokemon: [
      { name: 'ドッコラー', condition: null },
      { name: 'ワンリキー', condition: null },
      { name: 'ドテッコツ', condition: '珍しい' },
    ]
  },
  {
    id: 4, number: '004', name: 'うるおう草むら', area: 'pasapasa',
    items: ['みどりのくさ×4', 'みず×2'],
    pokemon: [
      { name: 'ゼニガメ', condition: null },
      { name: 'ヌメイル', condition: '珍しい' },
      { name: 'ウッウ', condition: null },
      { name: 'カメール', condition: null },
      { name: 'カメックス', condition: '珍しい' },
    ]
  },
  {
    id: 5, number: '005', name: '波打ちぎわの草むら', area: 'pasapasa',
    items: ['みどりのくさ×4', 'うみのみず×2'],
    pokemon: [
      { name: 'ヤドン', condition: null },
      { name: 'ヤドラン', condition: '珍しい' },
      { name: 'ヤドキング', condition: '珍しい' },
    ]
  },
  {
    id: 6, number: '006', name: '高台の草むら', area: 'pasapasa',
    items: ['みどりのくさ×4', '高いところ×1'],
    pokemon: [
      { name: 'ポッポ', condition: null },
      { name: 'ホーホー', condition: null },
      { name: 'ピジョン', condition: null },
      { name: 'ヨルノズク', condition: '夜' },
    ]
  },
  {
    id: 7, number: '007', name: '照らされた草むら', area: 'pasapasa',
    items: ['みどりのくさ×4', 'あかり×1'],
    pokemon: [
      { name: 'コンパン', condition: null },
      { name: 'モルフォン', condition: '珍しい' },
    ]
  },
  {
    id: 8, number: '008', name: 'きれいな花畑', area: 'pasapasa',
    items: ['はらっぱのはな×4', 'はらっぱのはな×4'],
    pokemon: [
      { name: 'ポッポ', condition: null },
      { name: 'ホーホー', condition: null },
      { name: 'ミツハニー', condition: null },
      { name: 'ブビィ', condition: null },
      { name: 'イーブイ', condition: '珍しい' },
      { name: 'ピジョン', condition: null },
    ]
  },
  {
    id: 9, number: '009', name: '木かげの花畑', area: 'pasapasa',
    items: ['きのみの木×1', 'はらっぱのはな×4'],
    pokemon: [
      { name: 'ヌメラ', condition: '雨' },
      { name: 'ナゾノクサ', condition: null },
      { name: 'クサイハナ', condition: null },
    ]
  },
  {
    id: 10, number: '010', name: '赤い草むら', area: 'pasapasa',
    items: ['あかいくさ×4'],
    pokemon: [
      { name: 'ヒバニー', condition: null },
      { name: 'コロボーシ', condition: null },
      { name: 'リオル', condition: '珍しい' },
    ]
  },
  {
    id: 11, number: '011', name: '木かげの赤い草むら', area: 'pasapasa',
    items: ['大きな木×1', 'あかいくさ×4'],
    pokemon: [
      { name: 'コロボーシ', condition: null },
      { name: 'コロトック', condition: '珍しい' },
      { name: 'ヒバニー', condition: null },
    ]
  },
  {
    id: 12, number: '012', name: '岩かげの赤い草むら', area: 'pasapasa',
    items: ['あかいくさ×4', 'おおきないし×1'],
    pokemon: [
      { name: 'ダルマッカ', condition: null },
      { name: 'ヒヒダルマ', condition: '珍しい' },
    ]
  },
  {
    id: 13, number: '013', name: 'コケまみれ', area: 'pasapasa',
    items: ['コケ×4'],
    pokemon: [
      { name: 'ヨーギラス', condition: null },
      { name: 'サナギラス', condition: '珍しい' },
    ]
  },
  {
    id: 14, number: '014', name: '木の下のコケ', area: 'pasapasa',
    items: ['大きな木×1', 'コケ×4'],
    pokemon: [
      { name: 'パラス', condition: null },
      { name: 'パラセクト', condition: '珍しい' },
      { name: 'タマゲタケ', condition: null },
    ]
  },
  {
    id: 15, number: '015', name: '白い花畑', area: 'pasapasa',
    items: ['しろいはな×4'],
    pokemon: [
      { name: 'フラベベ', condition: null },
      { name: 'フラエッテ', condition: null },
    ]
  },
  {
    id: 16, number: '016', name: '赤い花畑', area: 'pasapasa',
    items: ['あかいはな×4'],
    pokemon: [
      { name: 'フラベベ', condition: null },
      { name: 'フラエッテ', condition: null },
    ]
  },
  {
    id: 17, number: '017', name: '青い花畑', area: 'pasapasa',
    items: ['あおいはな×4'],
    pokemon: [
      { name: 'フラベベ', condition: null },
      { name: 'フラエッテ', condition: null },
    ]
  },
  {
    id: 18, number: '018', name: '黄色い花畑', area: 'pasapasa',
    items: ['きいろいはな×4'],
    pokemon: [
      { name: 'フラベベ', condition: null },
      { name: 'フラエッテ', condition: null },
      { name: 'ヒマナッツ', condition: null },
      { name: 'キマワリ', condition: '珍しい' },
    ]
  },
  {
    id: 19, number: '019', name: '石ころだらけ', area: 'pasapasa',
    items: ['おおきないし×4'],
    pokemon: [
      { name: 'イシツブテ', condition: null },
      { name: 'ゴローン', condition: null },
      { name: 'サンド', condition: null },
    ]
  },
  {
    id: 20, number: '020', name: '石ころと草', area: 'pasapasa',
    items: ['おおきないし×2', 'みどりのくさ×2'],
    pokemon: [
      { name: 'サンド', condition: null },
      { name: 'サンドパン', condition: '珍しい' },
      { name: 'ディグダ', condition: null },
    ]
  },
  {
    id: 21, number: '021', name: 'さらさらの砂地', area: 'pasapasa',
    items: ['すな×4'],
    pokemon: [
      { name: 'メグロコ', condition: null },
      { name: 'ワルビル', condition: '珍しい' },
      { name: 'ディグダ', condition: null },
    ]
  },
  {
    id: 22, number: '022', name: '木かげの砂地', area: 'pasapasa',
    items: ['大きな木×1', 'すな×4'],
    pokemon: [
      { name: 'メグロコ', condition: null },
      { name: 'カラカラ', condition: null },
      { name: 'ガラガラ', condition: '珍しい' },
    ]
  },
  {
    id: 23, number: '023', name: '岩かげの砂地', area: 'pasapasa',
    items: ['すな×4', 'おおきないし×1'],
    pokemon: [
      { name: 'ヨーギラス', condition: null },
      { name: 'バンギラス', condition: '珍しい' },
    ]
  },
  {
    id: 24, number: '024', name: 'サボテンと砂地', area: 'pasapasa',
    items: ['サボテン×1', 'すな×4'],
    pokemon: [
      { name: 'メグロコ', condition: null },
      { name: 'ワルビアル', condition: '珍しい' },
    ]
  },
  {
    id: 25, number: '025', name: 'かわいた大地', area: 'pasapasa',
    items: ['かわいたつち×4'],
    pokemon: [
      { name: 'ヒトカゲ', condition: null },
      { name: 'ガーディ', condition: null },
      { name: 'ウインディ', condition: '珍しい' },
    ]
  },
  {
    id: 26, number: '026', name: '木かげのかわいた大地', area: 'pasapasa',
    items: ['大きな木×1', 'かわいたつち×4'],
    pokemon: [
      { name: 'エイパム', condition: null },
      { name: 'エテボース', condition: '珍しい' },
    ]
  },
  {
    id: 27, number: '027', name: '水辺のかわいた大地', area: 'pasapasa',
    items: ['かわいたつち×4', 'みず×2'],
    pokemon: [
      { name: 'ウパー', condition: null },
      { name: 'ヌオー', condition: '珍しい' },
    ]
  },
  {
    id: 28, number: '028', name: '柵のある草むら', area: 'pasapasa',
    items: ['みどりのくさ×4', 'さく×1'],
    pokemon: [
      { name: 'メェークル', condition: null },
      { name: 'ゴーゴート', condition: '珍しい' },
      { name: 'ウールー', condition: null },
    ]
  },
  {
    id: 29, number: '029', name: '柵のある花畑', area: 'pasapasa',
    items: ['はらっぱのはな×4', 'さく×1'],
    pokemon: [
      { name: 'ウールー', condition: null },
      { name: 'バイウールー', condition: '珍しい' },
      { name: 'ケンタロス', condition: null },
      { name: 'ミルタンク', condition: null },
    ]
  },
  {
    id: 30, number: '030', name: '小さな池', area: 'pasapasa',
    items: ['みず×4'],
    pokemon: [
      { name: 'コダック', condition: null },
      { name: 'ニョロモ', condition: null },
      { name: 'マリル', condition: null },
    ]
  },
  {
    id: 31, number: '031', name: '草むらの池', area: 'pasapasa',
    items: ['みず×4', 'みどりのくさ×2'],
    pokemon: [
      { name: 'ニョロモ', condition: null },
      { name: 'ニョロゾ', condition: null },
      { name: 'コイキング', condition: null },
      { name: 'マリルリ', condition: '珍しい' },
    ]
  },
  {
    id: 32, number: '032', name: 'あぶくの出る池', area: 'pasapasa',
    items: ['みず×4', 'あわ×2'],
    pokemon: [
      { name: 'コダック', condition: null },
      { name: 'ゴルダック', condition: '珍しい' },
    ]
  },
  {
    id: 33, number: '033', name: 'がけっぷちの池', area: 'pasapasa',
    items: ['みず×4', '高いところ×1'],
    pokemon: [
      { name: 'コイキング', condition: null },
      { name: 'ギャラドス', condition: '珍しい' },
    ]
  },
  {
    id: 34, number: '034', name: 'つめたい池', area: 'pasapasa',
    items: ['みず×4', 'こおり×2'],
    pokemon: [
      { name: 'パウワウ', condition: null },
      { name: 'ジュゴン', condition: '珍しい' },
    ]
  },
  {
    id: 35, number: '035', name: 'どろどろの沼地', area: 'pasapasa',
    items: ['どろ×4'],
    pokemon: [
      { name: 'ベトベター', condition: null },
      { name: 'ヤブクロン', condition: null },
      { name: 'ベトベトン', condition: '珍しい' },
    ]
  },
  {
    id: 36, number: '036', name: '草むらの沼地', area: 'pasapasa',
    items: ['どろ×4', 'みどりのくさ×2'],
    pokemon: [
      { name: 'ヤブクロン', condition: null },
      { name: 'ダストダス', condition: '珍しい' },
    ]
  },
  {
    id: 37, number: '037', name: 'ぬめぬめの沼地', area: 'pasapasa',
    items: ['どろ×4', 'ぬめぬめ×2'],
    pokemon: [
      { name: 'ヌメラ', condition: null },
      { name: 'ヌメルゴン', condition: '珍しい' },
    ]
  },
  {
    id: 38, number: '038', name: 'がれきのやま', area: 'pasapasa',
    items: ['がれき×4'],
    pokemon: [
      { name: 'ドッコラー', condition: null },
      { name: 'ローブシン', condition: '珍しい' },
    ]
  },
  {
    id: 39, number: '039', name: '木の実のなる木', area: 'pasapasa',
    items: ['きのみの木×4'],
    pokemon: [
      { name: 'ホシガリス', condition: null },
      { name: 'ヨクバリス', condition: '珍しい' },
    ]
  },
  {
    id: 40, number: '040', name: 'くらい洞くつ', area: 'pasapasa',
    items: ['ほらあな×1'],
    pokemon: [
      { name: 'ズバット', condition: null },
      { name: 'ゴルバット', condition: null },
      { name: 'イワーク', condition: '珍しい' },
    ]
  },
  {
    id: 41, number: '041', name: 'ひかる洞くつ', area: 'pasapasa',
    items: ['ほらあな×1', 'あかり×1'],
    pokemon: [
      { name: 'ズバット', condition: null },
      { name: 'メレシー', condition: '珍しい' },
    ]
  },
  {
    id: 42, number: '042', name: 'ネバネバの洞くつ', area: 'pasapasa',
    items: ['ほらあな×1', 'ぬめぬめ×2'],
    pokemon: [
      { name: 'ベトベター', condition: null },
      { name: 'ツボツボ', condition: '珍しい' },
    ]
  },
  {
    id: 43, number: '043', name: '石炭のある場所', area: 'pasapasa',
    items: ['せきたん×4'],
    pokemon: [
      { name: 'タンドン', condition: null },
      { name: 'トロッゴン', condition: null },
      { name: 'セキタンザン', condition: '珍しい' },
    ]
  },
  {
    id: 44, number: '044', name: 'マグマだまり', area: 'pasapasa',
    items: ['マグマ×4'],
    pokemon: [
      { name: 'マグマッグ', condition: null },
      { name: 'マグカルゴ', condition: '珍しい' },
      { name: 'ブーバー', condition: null },
    ]
  },
  {
    id: 45, number: '045', name: '石の上のマグマ', area: 'pasapasa',
    items: ['マグマ×4', 'おおきないし×2'],
    pokemon: [
      { name: 'ブーバー', condition: null },
      { name: 'ブーバーン', condition: '珍しい' },
    ]
  },
  {
    id: 46, number: '046', name: 'パサパサの化石', area: 'pasapasa',
    items: ['かせき×1', 'すな×4'],
    pokemon: [
      { name: 'オムナイト', condition: null },
      { name: 'カブト', condition: null },
      { name: 'プテラ', condition: '珍しい' },
    ]
  },
  {
    id: 47, number: '047', name: 'ゴミ捨て場', area: 'pasapasa',
    items: ['ゴミぶくろ×4'],
    pokemon: [
      { name: 'ヤブクロン', condition: null },
      { name: 'ベトベター', condition: null },
      { name: 'コイル', condition: null },
    ]
  },
  {
    id: 48, number: '048', name: '機械のゴミ捨て場', area: 'pasapasa',
    items: ['ゴミぶくろ×4', 'きかい×2'],
    pokemon: [
      { name: 'コイル', condition: null },
      { name: 'ビリリダマ', condition: null },
      { name: 'レアコイル', condition: '珍しい' },
    ]
  },
  {
    id: 49, number: '049', name: 'ふしぎな遺跡', area: 'pasapasa',
    items: ['いせき×1'],
    pokemon: [
      { name: 'ネイティ', condition: null },
      { name: 'ネイティオ', condition: '珍しい' },
      { name: 'リグレー', condition: '夜' },
    ]
  },
  {
    id: 50, number: '050', name: 'ひかる遺跡', area: 'pasapasa',
    items: ['いせき×1', 'あかり×1'],
    pokemon: [
      { name: 'アンノーン', condition: null },
      { name: 'ネイティオ', condition: '珍しい' },
    ]
  },
  // ========== ドンヨリうみべの街 ==========
  {
    id: 51, number: '051', name: 'ドンヨリの草むら', area: 'donyori',
    items: ['みどりのくさ×4'],
    pokemon: [
      { name: 'チコリータ', condition: null },
      { name: 'ワニノコ', condition: null },
      { name: 'ヒノアラシ', condition: null },
      { name: 'オタチ', condition: null },
    ]
  },
  {
    id: 52, number: '052', name: '海辺の草むら', area: 'donyori',
    items: ['みどりのくさ×4', 'うみのみず×2'],
    pokemon: [
      { name: 'メノクラゲ', condition: null },
      { name: 'シェルダー', condition: null },
      { name: 'ドククラゲ', condition: '珍しい' },
    ]
  },
  {
    id: 53, number: '053', name: '浜辺の砂地', area: 'donyori',
    items: ['すな×4', 'うみのみず×2'],
    pokemon: [
      { name: 'クラブ', condition: null },
      { name: 'キングラー', condition: '珍しい' },
      { name: 'サニーゴ', condition: null },
    ]
  },
  {
    id: 54, number: '054', name: 'うみべの岩場', area: 'donyori',
    items: ['おおきないし×4', 'うみのみず×2'],
    pokemon: [
      { name: 'カメテテ', condition: null },
      { name: 'ガメノデス', condition: '珍しい' },
    ]
  },
  {
    id: 55, number: '055', name: 'うみべの花畑', area: 'donyori',
    items: ['はらっぱのはな×4', 'うみのみず×2'],
    pokemon: [
      { name: 'シュシュプ', condition: null },
      { name: 'フレフワン', condition: '珍しい' },
      { name: 'ペロッパフ', condition: null },
      { name: 'ペロリーム', condition: '珍しい' },
    ]
  },
  {
    id: 56, number: '056', name: '海の水たまり', area: 'donyori',
    items: ['うみのみず×4'],
    pokemon: [
      { name: 'タッツー', condition: null },
      { name: 'シードラ', condition: null },
      { name: 'トサキント', condition: null },
    ]
  },
  {
    id: 57, number: '057', name: '深い海の水たまり', area: 'donyori',
    items: ['うみのみず×4', 'みず×2'],
    pokemon: [
      { name: 'クズモー', condition: null },
      { name: 'ドラミドロ', condition: '珍しい' },
      { name: 'ウデッポウ', condition: null },
      { name: 'ブロスター', condition: '珍しい' },
    ]
  },
  {
    id: 58, number: '058', name: '草むらの海', area: 'donyori',
    items: ['うみのみず×4', 'みどりのくさ×2'],
    pokemon: [
      { name: 'プルリル', condition: null },
      { name: 'ブルンゲル', condition: '珍しい' },
      { name: 'マンタイン', condition: null },
    ]
  },
  {
    id: 59, number: '059', name: 'こおりの海', area: 'donyori',
    items: ['うみのみず×4', 'こおり×2'],
    pokemon: [
      { name: 'ラプラス', condition: '珍しい' },
      { name: 'テッポウオ', condition: null },
      { name: 'オクタン', condition: '珍しい' },
    ]
  },
  {
    id: 60, number: '060', name: 'ドンヨリの池', area: 'donyori',
    items: ['みず×4'],
    pokemon: [
      { name: 'コアルヒー', condition: null },
      { name: 'スワンナ', condition: '珍しい' },
      { name: 'チョンチー', condition: null },
    ]
  },
  {
    id: 61, number: '061', name: 'ひかる池', area: 'donyori',
    items: ['みず×4', 'あかり×1'],
    pokemon: [
      { name: 'チョンチー', condition: null },
      { name: 'ランターン', condition: '珍しい' },
    ]
  },
  {
    id: 62, number: '062', name: 'がけっぷちの海', area: 'donyori',
    items: ['うみのみず×4', '高いところ×1'],
    pokemon: [
      { name: 'キャモメ', condition: null },
      { name: 'ペリッパー', condition: '珍しい' },
    ]
  },
  {
    id: 63, number: '063', name: 'じめじめの洞くつ', area: 'donyori',
    items: ['ほらあな×1', 'みず×2'],
    pokemon: [
      { name: 'ゴース', condition: null },
      { name: 'ゴースト', condition: null },
      { name: 'ゲンガー', condition: '珍しい' },
    ]
  },
  {
    id: 64, number: '064', name: 'ドンヨリの洞くつ', area: 'donyori',
    items: ['ほらあな×1'],
    pokemon: [
      { name: 'ズバット', condition: null },
      { name: 'クロバット', condition: '珍しい' },
    ]
  },
  {
    id: 65, number: '065', name: 'ドンヨリの沼地', area: 'donyori',
    items: ['どろ×4'],
    pokemon: [
      { name: 'アーボ', condition: null },
      { name: 'アーボック', condition: '珍しい' },
    ]
  },
  {
    id: 66, number: '066', name: '毒の沼地', area: 'donyori',
    items: ['どろ×4', 'どく×2'],
    pokemon: [
      { name: 'ドガース', condition: null },
      { name: 'マタドガス', condition: '珍しい' },
    ]
  },
  {
    id: 67, number: '067', name: 'ドンヨリの化石', area: 'donyori',
    items: ['かせき×1', 'うみのみず×4'],
    pokemon: [
      { name: 'オムスター', condition: '珍しい' },
      { name: 'カブトプス', condition: '珍しい' },
    ]
  },
  {
    id: 68, number: '068', name: '霧の草むら', area: 'donyori',
    items: ['みどりのくさ×4', 'きり×2'],
    pokemon: [
      { name: 'ヤミカラス', condition: '夜' },
      { name: 'ムウマ', condition: '夜' },
    ]
  },
  {
    id: 69, number: '069', name: '月夜の草むら', area: 'donyori',
    items: ['みどりのくさ×4', 'つきのひかり×1'],
    pokemon: [
      { name: 'ピッピ', condition: '夜' },
      { name: 'ピクシー', condition: '珍しい' },
      { name: 'プリン', condition: null },
      { name: 'プクリン', condition: '珍しい' },
    ]
  },
  {
    id: 70, number: '070', name: 'ドンヨリの赤い草', area: 'donyori',
    items: ['あかいくさ×4'],
    pokemon: [
      { name: 'ヤンチャム', condition: null },
      { name: 'ゴロンダ', condition: '珍しい' },
    ]
  },
  {
    id: 71, number: '071', name: '機械だらけ', area: 'donyori',
    items: ['きかい×4'],
    pokemon: [
      { name: 'ギアル', condition: null },
      { name: 'ギギアル', condition: null },
      { name: 'ギギギアル', condition: '珍しい' },
    ]
  },
  {
    id: 72, number: '072', name: '電気の機械', area: 'donyori',
    items: ['きかい×4', 'でんき×2'],
    pokemon: [
      { name: 'ビリリダマ', condition: null },
      { name: 'マルマイン', condition: '珍しい' },
      { name: 'バチュル', condition: null },
    ]
  },
  {
    id: 73, number: '073', name: 'モフモフの草むら', area: 'donyori',
    items: ['もふもふのくさ×4'],
    pokemon: [
      { name: 'トリミアン', condition: null },
      { name: 'ブルー', condition: null },
      { name: 'グランブル', condition: '珍しい' },
    ]
  },
  {
    id: 74, number: '074', name: 'エスパーの場所', area: 'donyori',
    items: ['エスパー×4'],
    pokemon: [
      { name: 'ケーシィ', condition: null },
      { name: 'ユンゲラー', condition: null },
      { name: 'ニャスパー', condition: null },
      { name: 'ニャオニクス', condition: '珍しい' },
    ]
  },
  {
    id: 75, number: '075', name: '不思議な電気', area: 'donyori',
    items: ['でんき×4'],
    pokemon: [
      { name: 'ピカチュウ', condition: null },
      { name: 'ピチュー', condition: '珍しい' },
      { name: 'メリープ', condition: null },
    ]
  },
  {
    id: 76, number: '076', name: '強い電気', area: 'donyori',
    items: ['でんき×4', 'きかい×2'],
    pokemon: [
      { name: 'メリープ', condition: null },
      { name: 'モココ', condition: null },
      { name: 'デンリュウ', condition: '珍しい' },
      { name: 'エレブー', condition: null },
    ]
  },
  {
    id: 77, number: '077', name: '雷の草むら', area: 'donyori',
    items: ['みどりのくさ×4', 'でんき×2'],
    pokemon: [
      { name: 'エリキテル', condition: null },
      { name: 'エレザード', condition: '珍しい' },
      { name: 'シビシラス', condition: null },
    ]
  },
  {
    id: 78, number: '078', name: 'シビれる草むら', area: 'donyori',
    items: ['みどりのくさ×4', 'でんき×4'],
    pokemon: [
      { name: 'シビシラス', condition: null },
      { name: 'シビビール', condition: null },
      { name: 'シビルドン', condition: '珍しい' },
    ]
  },
  {
    id: 79, number: '079', name: 'ともしびの場所', area: 'donyori',
    items: ['ともしび×4'],
    pokemon: [
      { name: 'ヒトモシ', condition: null },
      { name: 'ランプラー', condition: null },
      { name: 'シャンデラ', condition: '珍しい' },
    ]
  },
  {
    id: 80, number: '080', name: '剣の場所', area: 'donyori',
    items: ['つるぎ×1'],
    pokemon: [
      { name: 'ヒトツキ', condition: null },
      { name: 'ニダンギル', condition: null },
      { name: 'ギルガルド', condition: '珍しい' },
    ]
  },
  // ========== ゴツゴツやまの街 ==========
  {
    id: 81, number: '081', name: 'ゴツゴツの草むら', area: 'gotsugotsu',
    items: ['みどりのくさ×4'],
    pokemon: [
      { name: 'キバゴ', condition: null },
      { name: 'オノンド', condition: null },
      { name: 'オノノクス', condition: '珍しい' },
    ]
  },
  {
    id: 82, number: '082', name: '鉄の草むら', area: 'gotsugotsu',
    items: ['みどりのくさ×4', 'てつ×2'],
    pokemon: [
      { name: 'コマタナ', condition: null },
      { name: 'キリキザン', condition: '珍しい' },
    ]
  },
  {
    id: 83, number: '083', name: 'ゴツゴツの池', area: 'gotsugotsu',
    items: ['みず×4'],
    pokemon: [
      { name: 'ニョロモ', condition: null },
      { name: 'ニョロボン', condition: '珍しい' },
      { name: 'ニョロトノ', condition: '珍しい' },
    ]
  },
  {
    id: 84, number: '084', name: 'ゴツゴツの花畑', area: 'gotsugotsu',
    items: ['はらっぱのはな×4'],
    pokemon: [
      { name: 'ヤヤコマ', condition: null },
      { name: 'ヒノヤコマ', condition: null },
      { name: 'ファイアロー', condition: '珍しい' },
    ]
  },
  {
    id: 85, number: '085', name: 'ゴツゴツの砂地', area: 'gotsugotsu',
    items: ['すな×4'],
    pokemon: [
      { name: 'モグリュー', condition: null },
      { name: 'ドリュウズ', condition: '珍しい' },
    ]
  },
  {
    id: 86, number: '086', name: 'ゴツゴツの洞くつ', area: 'gotsugotsu',
    items: ['ほらあな×1'],
    pokemon: [
      { name: 'ズバット', condition: null },
      { name: 'スリープ', condition: null },
      { name: 'スリーパー', condition: '珍しい' },
    ]
  },
  {
    id: 87, number: '087', name: '鉄の洞くつ', area: 'gotsugotsu',
    items: ['ほらあな×1', 'てつ×2'],
    pokemon: [
      { name: 'イワーク', condition: null },
      { name: 'ハガネール', condition: '珍しい' },
    ]
  },
  {
    id: 88, number: '088', name: 'ゴツゴツの化石', area: 'gotsugotsu',
    items: ['かせき×1', 'おおきないし×4'],
    pokemon: [
      { name: 'チゴラス', condition: null },
      { name: 'ガチゴラス', condition: '珍しい' },
      { name: 'アマルス', condition: null },
      { name: 'アマルルガ', condition: '珍しい' },
    ]
  },
  {
    id: 89, number: '089', name: 'まっくらの洞くつ', area: 'gotsugotsu',
    items: ['ほらあな×1', 'やみ×2'],
    pokemon: [
      { name: 'モノズ', condition: null },
      { name: 'ジヘッド', condition: null },
      { name: 'サザンドラ', condition: '珍しい' },
    ]
  },
  {
    id: 90, number: '090', name: 'ゴツゴツの赤い草', area: 'gotsugotsu',
    items: ['あかいくさ×4'],
    pokemon: [
      { name: 'ポニータ', condition: null },
      { name: 'ギャロップ', condition: '珍しい' },
    ]
  },
  {
    id: 91, number: '091', name: 'ゴツゴツのマグマ', area: 'gotsugotsu',
    items: ['マグマ×4'],
    pokemon: [
      { name: 'メラルバ', condition: null },
      { name: 'ウルガモス', condition: '珍しい' },
    ]
  },
  {
    id: 92, number: '092', name: '岩と鉄', area: 'gotsugotsu',
    items: ['おおきないし×4', 'てつ×2'],
    pokemon: [
      { name: 'サイホーン', condition: null },
      { name: 'サイドン', condition: null },
      { name: 'ドサイドン', condition: '珍しい' },
    ]
  },
  {
    id: 93, number: '093', name: 'こおりの場所', area: 'gotsugotsu',
    items: ['こおり×4'],
    pokemon: [
      { name: 'ウリムー', condition: null },
      { name: 'イノムー', condition: null },
      { name: 'マンムー', condition: '珍しい' },
    ]
  },
  {
    id: 94, number: '094', name: 'つめたい岩場', area: 'gotsugotsu',
    items: ['おおきないし×4', 'こおり×2'],
    pokemon: [
      { name: 'クマシュン', condition: null },
      { name: 'ツンベアー', condition: '珍しい' },
      { name: 'デリバード', condition: null },
    ]
  },
  {
    id: 95, number: '095', name: 'つめたい草むら', area: 'gotsugotsu',
    items: ['みどりのくさ×4', 'こおり×2'],
    pokemon: [
      { name: 'ニューラ', condition: null },
      { name: 'マニューラ', condition: '珍しい' },
    ]
  },
  {
    id: 96, number: '096', name: 'ゴツゴツの高台', area: 'gotsugotsu',
    items: ['みどりのくさ×4', '高いところ×1'],
    pokemon: [
      { name: 'グライガー', condition: null },
      { name: 'グライオン', condition: '珍しい' },
      { name: 'エアームド', condition: null },
    ]
  },
  {
    id: 97, number: '097', name: '暗い草むら', area: 'gotsugotsu',
    items: ['みどりのくさ×4', 'やみ×2'],
    pokemon: [
      { name: 'デルビル', condition: '夜' },
      { name: 'ヘルガー', condition: '珍しい' },
    ]
  },
  {
    id: 98, number: '098', name: 'まっくらの花畑', area: 'gotsugotsu',
    items: ['はらっぱのはな×4', 'やみ×2'],
    pokemon: [
      { name: 'ロコン', condition: null },
      { name: 'キュウコン', condition: '珍しい' },
    ]
  },
  {
    id: 99, number: '099', name: '丸太の場所', area: 'gotsugotsu',
    items: ['まるた×4'],
    pokemon: [
      { name: 'クヌギダマ', condition: null },
      { name: 'フォレトス', condition: '珍しい' },
    ]
  },
  {
    id: 100, number: '100', name: 'ゴツゴツの遺跡', area: 'gotsugotsu',
    items: ['いせき×1'],
    pokemon: [
      { name: 'リグレー', condition: '夜' },
      { name: 'オーベム', condition: '珍しい' },
    ]
  },
  // ========== キラキラそらの街 ==========
  {
    id: 101, number: '101', name: 'キラキラの草むら', area: 'kirakira',
    items: ['みどりのくさ×4'],
    pokemon: [
      { name: 'ミニリュウ', condition: null },
      { name: 'ハクリュー', condition: null },
      { name: 'カイリュー', condition: '珍しい' },
    ]
  },
  {
    id: 102, number: '102', name: 'キラキラの池', area: 'kirakira',
    items: ['みず×4'],
    pokemon: [
      { name: 'トゲピー', condition: null },
      { name: 'トゲチック', condition: null },
      { name: 'トゲキッス', condition: '珍しい' },
    ]
  },
  {
    id: 103, number: '103', name: 'キラキラの花畑', area: 'kirakira',
    items: ['はらっぱのはな×4'],
    pokemon: [
      { name: 'イーブイ', condition: null },
      { name: 'エーフィ', condition: '昼' },
      { name: 'ブラッキー', condition: '夜' },
    ]
  },
  {
    id: 104, number: '104', name: '木漏れ日の花畑', area: 'kirakira',
    items: ['大きな木×1', 'はらっぱのはな×4'],
    pokemon: [
      { name: 'イーブイ', condition: null },
      { name: 'リーフィア', condition: null },
      { name: 'ニンフィア', condition: '珍しい' },
    ]
  },
  {
    id: 105, number: '105', name: 'こおりの花畑', area: 'kirakira',
    items: ['はらっぱのはな×4', 'こおり×2'],
    pokemon: [
      { name: 'イーブイ', condition: null },
      { name: 'グレイシア', condition: null },
    ]
  },
  {
    id: 106, number: '106', name: 'みずべの花畑', area: 'kirakira',
    items: ['はらっぱのはな×4', 'みず×2'],
    pokemon: [
      { name: 'イーブイ', condition: null },
      { name: 'シャワーズ', condition: null },
    ]
  },
  {
    id: 107, number: '107', name: '電気の花畑', area: 'kirakira',
    items: ['はらっぱのはな×4', 'でんき×2'],
    pokemon: [
      { name: 'イーブイ', condition: null },
      { name: 'サンダース', condition: null },
    ]
  },
  {
    id: 108, number: '108', name: '炎の花畑', area: 'kirakira',
    items: ['はらっぱのはな×4', 'マグマ×2'],
    pokemon: [
      { name: 'イーブイ', condition: null },
      { name: 'ブースター', condition: null },
    ]
  },
  {
    id: 109, number: '109', name: 'キラキラの高台', area: 'kirakira',
    items: ['みどりのくさ×4', '高いところ×1'],
    pokemon: [
      { name: 'オンバット', condition: null },
      { name: 'オンバーン', condition: '珍しい' },
    ]
  },
  {
    id: 110, number: '110', name: 'キラキラの岩場', area: 'kirakira',
    items: ['おおきないし×4'],
    pokemon: [
      { name: 'ゴマゾウ', condition: null },
      { name: 'ドンファン', condition: '珍しい' },
    ]
  },
  {
    id: 111, number: '111', name: '月夜のキラキラ', area: 'kirakira',
    items: ['みどりのくさ×4', 'つきのひかり×1'],
    pokemon: [
      { name: 'ピィ', condition: '夜' },
      { name: 'ププリン', condition: '夜' },
      { name: 'ムチュール', condition: '珍しい' },
    ]
  },
  {
    id: 112, number: '112', name: '星空のキラキラ', area: 'kirakira',
    items: ['みどりのくさ×4', 'ほし×2'],
    pokemon: [
      { name: 'デデンネ', condition: null },
      { name: 'ピカチュウ', condition: null },
      { name: 'ライチュウ', condition: '珍しい' },
    ]
  },
  {
    id: 113, number: '113', name: 'キラキラの洞くつ', area: 'kirakira',
    items: ['ほらあな×1'],
    pokemon: [
      { name: 'ヒメグマ', condition: null },
      { name: 'リングマ', condition: '珍しい' },
    ]
  },
  {
    id: 114, number: '114', name: '宝石の洞くつ', area: 'kirakira',
    items: ['ほらあな×1', 'ほうせき×2'],
    pokemon: [
      { name: 'メレシー', condition: null },
      { name: 'ラッキー', condition: '珍しい' },
      { name: 'ハピナス', condition: '珍しい' },
    ]
  },
  {
    id: 115, number: '115', name: 'キラキラの遺跡', area: 'kirakira',
    items: ['いせき×1'],
    pokemon: [
      { name: 'バリヤード', condition: null },
      { name: 'ソーナンス', condition: null },
    ]
  },
  {
    id: 116, number: '116', name: 'キラキラの機械', area: 'kirakira',
    items: ['きかい×4'],
    pokemon: [
      { name: 'ポリゴン', condition: null },
      { name: 'ポリゴン2', condition: '珍しい' },
      { name: 'ポリゴンZ', condition: '珍しい' },
    ]
  },
  {
    id: 117, number: '117', name: 'エスパーのキラキラ', area: 'kirakira',
    items: ['エスパー×4'],
    pokemon: [
      { name: 'フーディン', condition: '珍しい' },
      { name: 'ルージュラ', condition: null },
    ]
  },
  {
    id: 118, number: '118', name: 'キラキラの赤い草', area: 'kirakira',
    items: ['あかいくさ×4'],
    pokemon: [
      { name: 'バルキー', condition: null },
      { name: 'サワムラー', condition: '珍しい' },
      { name: 'エビワラー', condition: '珍しい' },
      { name: 'カポエラー', condition: '珍しい' },
    ]
  },
  {
    id: 119, number: '119', name: 'モフモフの花畑', area: 'kirakira',
    items: ['もふもふのくさ×4', 'はらっぱのはな×4'],
    pokemon: [
      { name: 'カビゴン', condition: '珍しい' },
      { name: 'ガルーラ', condition: '珍しい' },
    ]
  },
  {
    id: 120, number: '120', name: 'ドラゴンの場所', area: 'kirakira',
    items: ['ドラゴン×4'],
    pokemon: [
      { name: 'ミニリュウ', condition: null },
      { name: 'キングドラ', condition: '珍しい' },
    ]
  },
  // ========== イベント ==========
  {
    id: 210, number: '210', name: 'ハネッコの草むら', area: 'event',
    items: ['みどりのくさ×4', 'かぜ×2'],
    pokemon: [
      { name: 'ハネッコ', condition: null },
      { name: 'ポポッコ', condition: null },
      { name: 'ワタッコ', condition: '珍しい' },
    ]
  },
  {
    id: 211, number: '211', name: 'マーイーカの海', area: 'event',
    items: ['うみのみず×4', 'やみ×2'],
    pokemon: [
      { name: 'マーイーカ', condition: null },
      { name: 'カラマネロ', condition: '珍しい' },
    ]
  },
  {
    id: 212, number: '212', name: 'レディバの木', area: 'event',
    items: ['大きな木×1', 'あかいくさ×4'],
    pokemon: [
      { name: 'レディバ', condition: null },
      { name: 'レディアン', condition: '珍しい' },
    ]
  },
];

// ポケモンのタイプ情報
export const POKEMON_TYPES = {
  1: ['くさ', 'どく'], 2: ['くさ', 'どく'], 3: ['くさ', 'どく'],
  4: ['ほのお'], 5: ['ほのお'], 6: ['ほのお', 'ひこう'],
  7: ['みず'], 8: ['みず'], 9: ['みず'],
  10: ['むし'], 11: ['むし'], 12: ['むし', 'ひこう'],
  16: ['ノーマル', 'ひこう'], 17: ['ノーマル', 'ひこう'], 18: ['ノーマル', 'ひこう'],
  25: ['でんき'], 26: ['でんき'],
  27: ['じめん'], 28: ['じめん'],
  37: ['ほのお'], 38: ['ほのお'],
  41: ['どく', 'ひこう'], 42: ['どく', 'ひこう'],
  43: ['くさ', 'どく'], 44: ['くさ', 'どく'], 45: ['くさ', 'どく'],
  48: ['むし', 'どく'], 49: ['むし', 'どく'],
  54: ['みず'], 55: ['みず'],
  66: ['かくとう'], 67: ['かくとう'], 68: ['かくとう'],
  74: ['いわ', 'じめん'], 75: ['いわ', 'じめん'], 76: ['いわ', 'じめん'],
  79: ['みず', 'エスパー'], 80: ['みず', 'エスパー'],
  92: ['ゴースト', 'どく'], 93: ['ゴースト', 'どく'], 94: ['ゴースト', 'どく'],
  123: ['むし', 'ひこう'], 127: ['むし'], 129: ['みず'], 130: ['みず', 'ひこう'],
  131: ['みず', 'こおり'], 133: ['ノーマル'],
  134: ['みず'], 135: ['でんき'], 136: ['ほのお'],
  143: ['ノーマル'], 147: ['ドラゴン'], 148: ['ドラゴン'], 149: ['ドラゴン', 'ひこう'],
  152: ['くさ'], 155: ['ほのお'], 158: ['みず'],
  175: ['フェアリー'], 176: ['フェアリー', 'ひこう'],
  179: ['でんき'], 180: ['でんき'], 181: ['でんき'],
  196: ['エスパー'], 197: ['あく'],
  246: ['いわ', 'じめん'], 247: ['いわ', 'じめん'], 248: ['いわ', 'あく'],
  447: ['かくとう'], 448: ['かくとう', 'はがね'],
  468: ['フェアリー', 'ひこう'],
  470: ['くさ'], 471: ['こおり'], 700: ['フェアリー'],
  532: ['かくとう'], 533: ['かくとう'], 534: ['かくとう'],
  610: ['ドラゴン'], 611: ['ドラゴン'], 612: ['ドラゴン'],
  633: ['あく', 'ドラゴン'], 634: ['あく', 'ドラゴン'], 635: ['あく', 'ドラゴン'],
  704: ['ドラゴン'], 705: ['ドラゴン'], 706: ['ドラゴン'],
  813: ['ほのお'], 814: ['ほのお'], 815: ['ほのお'],
  819: ['ノーマル'], 820: ['ノーマル'],
  837: ['いわ'], 838: ['いわ', 'ほのお'], 839: ['いわ', 'ほのお'],
  845: ['ひこう', 'みず'],
};

export const TYPE_COLORS = {
  'ノーマル': '#A8A878',
  'ほのお': '#F08030',
  'みず': '#6890F0',
  'でんき': '#F8D030',
  'くさ': '#78C850',
  'こおり': '#98D8D8',
  'かくとう': '#C03028',
  'どく': '#A040A0',
  'じめん': '#E0C068',
  'ひこう': '#A890F0',
  'エスパー': '#F85888',
  'むし': '#A8B820',
  'いわ': '#B8A038',
  'ゴースト': '#705898',
  'ドラゴン': '#7038F8',
  'あく': '#705848',
  'はがね': '#B8B8D0',
  'フェアリー': '#EE99AC',
};
