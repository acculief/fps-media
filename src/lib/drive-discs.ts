export type DriveDisc = {
  slug: string;
  name: string;
  twoSetEffect: string;
  fourSetEffect: string;
  recommendedAgents: string[];
  category: string; // アタッカー向け/異常向け/サポート向け/撃破向け/防護向け/汎用
};

export const DRIVE_DISCS: DriveDisc[] = [
  // ── アタッカー向け ──
  {
    slug: "woodpecker-electro",
    name: "ウッドペッカー・エレクトロ",
    twoSetEffect: "会心率+8%",
    fourSetEffect: "通常攻撃・回避反撃・強化スキルが会心時、攻撃力+9%（最大3スタック）。",
    recommendedAgents: ["エレン・ジョー", "猫又", "ビリー", "カリン"],
    category: "アタッカー向け",
  },
  {
    slug: "puffer-electro",
    name: "パファー・エレクトロ",
    twoSetEffect: "貫通率+8%",
    fourSetEffect: "終結スキルダメージ+20%。終結スキル発動時に攻撃力+15%。",
    recommendedAgents: ["朱鳶", "浅羽悠真", "「11号」"],
    category: "アタッカー向け",
  },
  {
    slug: "hormone-punk",
    name: "ホルモン・パンク",
    twoSetEffect: "攻撃力+10%",
    fourSetEffect: "接敵・出場時に攻撃力+25%（20秒毎1回発動）。",
    recommendedAgents: ["葉瞬光", "猫又", "「シード」"],
    category: "アタッカー向け",
  },
  {
    slug: "polar-metal",
    name: "極地のヘヴィメタル",
    twoSetEffect: "氷属性ダメージ+10%",
    fourSetEffect: "通常攻撃・ダッシュ攻撃ダメージ+20%。凍結付与時にさらに+20%。",
    recommendedAgents: ["エレン・ジョー"],
    category: "アタッカー向け",
  },
  {
    slug: "inferno-metal",
    name: "炎獄のヘヴィメタル",
    twoSetEffect: "炎属性ダメージ+10%",
    fourSetEffect: "熱傷状態の敵への攻撃時に会心率+28%。",
    recommendedAgents: ["「11号」", "イヴリン"],
    category: "アタッカー向け",
  },
  {
    slug: "thunder-metal",
    name: "霹靂のヘヴィメタル",
    twoSetEffect: "電気属性ダメージ+10%",
    fourSetEffect: "感電状態の敵が存在する時、攻撃力+28%。",
    recommendedAgents: ["浅羽悠真", "「シード」", "アンドー"],
    category: "アタッカー向け",
  },
  {
    slug: "fanged-metal",
    name: "獣牙のヘヴィメタル",
    twoSetEffect: "物理属性ダメージ+10%",
    fourSetEffect: "強撃を付与した時、ターゲットへのダメージ+35%。",
    recommendedAgents: ["猫又", "ダイアリン"],
    category: "アタッカー向け",
  },
  {
    slug: "chaos-metal",
    name: "混沌のヘヴィメタル",
    twoSetEffect: "エーテル属性ダメージ+10%",
    fourSetEffect: "会心ダメージ+20%。侵蝕追加ダメージ時、さらに+5.5%（最大6スタック）。",
    recommendedAgents: ["朱鳶"],
    category: "アタッカー向け",
  },
  {
    slug: "dawn-blossom",
    name: "暁に咲く花",
    twoSetEffect: "通常攻撃与ダメージ+15%",
    fourSetEffect: "通常攻撃ダメージ+20%。強化スキル後にさらに+20%。",
    recommendedAgents: ["猫又", "ビリー"],
    category: "アタッカー向け",
  },
  {
    slug: "pure-white-ode",
    name: "純白の行歌",
    twoSetEffect: "物理属性ダメージ+10%",
    fourSetEffect: "エーテルベール時に会心率+10%、強攻メンバー時に攻撃力+10%。",
    recommendedAgents: ["ダイアリン", "猫又"],
    category: "アタッカー向け",
  },
  {
    slug: "shadow-harmony",
    name: "シャドウハーモニー",
    twoSetEffect: "追加攻撃・ダッシュ攻撃与ダメージ+15%",
    fourSetEffect: "属性一致攻撃時にバフ獲得。攻撃力+4%、会心率+4%（最大3スタック）。",
    recommendedAgents: ["ヒューゴ", "エレン・ジョー"],
    category: "アタッカー向け",
  },
  {
    slug: "folding-sword-song",
    name: "折枝の刀歌",
    twoSetEffect: "会心ダメージ+16%",
    fourSetEffect: "異常掌握115Pt以上で会心ダメージ+30%。凍結付与時に会心率+12%。",
    recommendedAgents: ["星見雅"],
    category: "アタッカー向け",
  },
  // ── 異常向け ──
  {
    slug: "freedom-blues",
    name: "フリーダム・ブルース",
    twoSetEffect: "異常マスタリー+30Pt",
    fourSetEffect: "強化特殊スキル命中時、ターゲットの状態異常耐性-20%。",
    recommendedAgents: ["バーニス", "ジェーン・ドゥ", "月城柳", "グレース"],
    category: "異常向け",
  },
  {
    slug: "chaos-jazz",
    name: "ケイオス・ジャズ",
    twoSetEffect: "異常マスタリー+30Pt",
    fourSetEffect: "炎・電気属性ダメージ+15%。待機時に強化スキル・支援攻撃ダメージ+20%。",
    recommendedAgents: ["バーニス", "月城柳", "グレース"],
    category: "異常向け",
  },
  {
    slug: "flowing-aria",
    name: "流光のアリア",
    twoSetEffect: "エーテル属性ダメージ+10%",
    fourSetEffect: "異常マスタリー+36Pt。敵ブレイク時に与ダメージ+25%。",
    recommendedAgents: ["ビビアン", "アリス"],
    category: "異常向け",
  },
  {
    slug: "phaethons-song",
    name: "パエトーンの歌",
    twoSetEffect: "異常掌握+8%",
    fourSetEffect: "強化特殊スキル発動時に異常マスタリー+45Pt。他メンバー発動時にエーテルダメ+25%。",
    recommendedAgents: ["ビビアン"],
    category: "異常向け",
  },
  // ── サポート向け ──
  {
    slug: "swing-jazz",
    name: "スイング・ジャズ",
    twoSetEffect: "エネルギー自動回復+20%",
    fourSetEffect: "連携スキル・終結スキル発動時に、チーム全体の与ダメージ+15%。",
    recommendedAgents: ["リナ", "ニコ", "蒼角", "ルーシー", "アストラ・ヤオ"],
    category: "サポート向け",
  },
  {
    slug: "moonlit-anthem",
    name: "月光騎士の讃歌",
    twoSetEffect: "エネルギー自動回復+20%",
    fourSetEffect: "支援メンバーの強化スキル発動時、チーム全体の与ダメージ+18%。",
    recommendedAgents: ["アストラ・ヤオ", "リュシア"],
    category: "サポート向け",
  },
  {
    slug: "astral-silence",
    name: "静寂のアストラ",
    twoSetEffect: "攻撃力+10%",
    fourSetEffect: "クイック支援で出場時に「天籟」を獲得し、与ダメージ+8%（最大3スタック）。",
    recommendedAgents: ["アストラ・ヤオ"],
    category: "サポート向け",
  },
  // ── 撃破向け ──
  {
    slug: "shockstar-disco",
    name: "ショックスター・ディスコ",
    twoSetEffect: "衝撃力+6%",
    fourSetEffect: "メインターゲットへのブレイク値+20%。",
    recommendedAgents: ["青衣", "ライカン", "クレタ", "ライト", "アンビー"],
    category: "撃破向け",
  },
  {
    slug: "mountain-ruler",
    name: "大山を統べる者",
    twoSetEffect: "攻撃のブレイク値+6%",
    fourSetEffect: "撃破メンバーのスキル発動時に会心ダメージ+15%。会心率50%以上でさらに+15%。",
    recommendedAgents: ["ライト", "橘福福", "ダイアリン"],
    category: "撃破向け",
  },
  // ── 防護向け ──
  {
    slug: "soul-rock",
    name: "ソウル・ロック",
    twoSetEffect: "防御力+16%",
    fourSetEffect: "HP減少時に被ダメージ-40%（15秒毎1回発動）。",
    recommendedAgents: ["ベン", "セス", "シーザー", "照"],
    category: "防護向け",
  },
  {
    slug: "proto-punk",
    name: "プロト・パンク",
    twoSetEffect: "シールド生成量+15%",
    fourSetEffect: "パリィ・回避支援発動時にチーム全体の与ダメージ+15%。",
    recommendedAgents: ["シーザー", "セス", "ベン", "照"],
    category: "防護向け",
  },
  // ── 汎用 ──
  {
    slug: "cloud-like-mountain",
    name: "雲嶽は我に似たり",
    twoSetEffect: "HP+10%",
    fourSetEffect: "スキル発動時に会心率+4%（最大3スタック）。3スタック時に透徹ダメージ+10%。",
    recommendedAgents: ["儀玄"],
    category: "汎用",
  },
];

// slug → DriveDisc ルックアップマップ
const _slugMap = new Map<string, DriveDisc>();
for (const disc of DRIVE_DISCS) {
  _slugMap.set(disc.slug, disc);
}
export const DRIVE_DISC_MAP: ReadonlyMap<string, DriveDisc> = _slugMap;

// 名前 → DriveDisc ルックアップマップ
const _nameMap = new Map<string, DriveDisc>();
for (const disc of DRIVE_DISCS) {
  _nameMap.set(disc.name, disc);
}
export const DRIVE_DISC_NAME_MAP: ReadonlyMap<string, DriveDisc> = _nameMap;

export function getDriveDiscBySlug(slug: string): DriveDisc | undefined {
  return DRIVE_DISC_MAP.get(slug);
}

export function getAllDriveDiscs(): DriveDisc[] {
  return DRIVE_DISCS;
}

export function getDriveDiscsByCategory(category: string): DriveDisc[] {
  return DRIVE_DISCS.filter((d) => d.category === category);
}

export const DRIVE_DISC_CATEGORIES = [
  "アタッカー向け",
  "異常向け",
  "サポート向け",
  "撃破向け",
  "防護向け",
  "汎用",
] as const;
