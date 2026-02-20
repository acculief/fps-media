export type AgentInfo = {
  name: string; // 日本語表示名
  icon: string; // /images/agents/xxx.png
  articleSlug?: string; // ビルドガイド記事のslug（あれば）
};

// 正規化済みのエージェント情報
const AGENTS: AgentInfo[] = [
  // ── S級 ──
  { name: "猫又", icon: "/images/agents/nekomata.png" },
  { name: "エレン・ジョー", icon: "/images/agents/ellen.png", articleSlug: "zzz-ellen-joe-build-guide" },
  { name: "ライカン", icon: "/images/agents/lycaon.png" },
  { name: "リナ", icon: "/images/agents/rina.png" },
  { name: "クレタ", icon: "/images/agents/koleda.png" },
  { name: "グレース", icon: "/images/agents/grace.png" },
  { name: "ライト", icon: "/images/agents/lighter.png" },
  { name: "バーニス", icon: "/images/agents/burnice.png", articleSlug: "zzz-burnice-build-guide" },
  { name: "シーザー", icon: "/images/agents/caesar.png" },
  { name: "「11号」", icon: "/images/agents/soldier11.png" },
  { name: "「シード」", icon: "/images/agents/seed.png" },
  { name: "「トリガー」", icon: "/images/agents/trigger.png" },
  { name: "0号・アンビー", icon: "/images/agents/soldier0-anby.png" },
  { name: "オルペウス&「鬼火」", icon: "/images/agents/orpheus.png" },
  { name: "朱鳶", icon: "/images/agents/zhuyuan.png", articleSlug: "zzz-zhu-yuan-build-guide" },
  { name: "青衣", icon: "/images/agents/qingyi.png", articleSlug: "zzz-qingyi-build-guide" },
  { name: "ジェーン・ドゥ", icon: "/images/agents/janedoe.png", articleSlug: "zzz-jane-doe-build-guide" },
  { name: "星見雅", icon: "/images/agents/miyabi.png", articleSlug: "zzz-miyabi-build-guide" },
  { name: "月城柳", icon: "/images/agents/yanagi.png", articleSlug: "zzz-yanagi-build-guide" },
  { name: "浅羽悠真", icon: "/images/agents/harumasa.png" },
  { name: "イヴリン", icon: "/images/agents/evelyn.png" },
  { name: "アストラ・ヤオ", icon: "/images/agents/astra-yao.png" },
  { name: "ヒューゴ", icon: "/images/agents/hugo.png" },
  { name: "ビビアン", icon: "/images/agents/vivian.png" },
  { name: "葉瞬光", icon: "/images/agents/ye-shunguang.png", articleSlug: "zzz-ye-shunguang-build-guide" },
  { name: "橘福福", icon: "/images/agents/ju-fufu.png" },
  { name: "儀玄", icon: "/images/agents/yixuan.png" },
  { name: "アリス", icon: "/images/agents/alice.png" },
  { name: "浮波柚葉", icon: "/images/agents/yuzuha.png" },
  { name: "リュシア", icon: "/images/agents/lucia.png" },
  { name: "イドリー", icon: "/images/agents/yidhari.png" },
  { name: "ダイアリン", icon: "/images/agents/dialyn.png", articleSlug: "zzz-dialyn-build-guide" },
  { name: "照", icon: "/images/agents/zhao.png" },
  { name: "盤岳", icon: "/images/agents/banyue.png" },
  { name: "千夏", icon: "/images/agents/chinatsu.png", articleSlug: "zzz-sunna-build-guide" },
  // ── A級 ──
  { name: "ビリー", icon: "/images/agents/billy.png" },
  { name: "ニコ", icon: "/images/agents/nicole.png" },
  { name: "アンビー", icon: "/images/agents/anby.png" },
  { name: "カリン", icon: "/images/agents/corin.png" },
  { name: "アンドー", icon: "/images/agents/anton.png" },
  { name: "ベン", icon: "/images/agents/ben.png" },
  { name: "蒼角", icon: "/images/agents/soukaku.png" },
  { name: "セス", icon: "/images/agents/seth.png" },
  { name: "ルーシー", icon: "/images/agents/lucy.png" },
  { name: "パイパー", icon: "/images/agents/piper.png" },
  { name: "プルクラ", icon: "/images/agents/pulchra.png" },
  { name: "潘引壺", icon: "/images/agents/pan-yinhu.png" },
  { name: "狛野真斗", icon: "/images/agents/komano-manato.png" },
];

// エイリアス → 正規名のマッピング
const ALIASES: Record<string, string> = {
  // フルネーム / 英語名 → 正規名
  "猫宮又奈": "猫又",
  "ネコミヤ": "猫又",
  "Nekomata": "猫又",
  "Ellen Joe": "エレン・ジョー",
  "エレン": "エレン・ジョー",
  "Von Lycaon": "ライカン",
  "Lycaon": "ライカン",
  "Rina": "リナ",
  "Koleda": "クレタ",
  "Grace": "グレース",
  "Lighter": "ライト",
  "Burnice": "バーニス",
  "Caesar": "シーザー",
  "キング・シーザー": "シーザー",
  "Soldier 11": "「11号」",
  "11号": "「11号」",
  "Seed": "「シード」",
  "シード": "「シード」",
  "Trigger": "「トリガー」",
  "トリガー": "「トリガー」",
  "Soldier 0": "0号・アンビー",
  "0号アンビー": "0号・アンビー",
  "オルペウス": "オルペウス&「鬼火」",
  "Orpheus": "オルペウス&「鬼火」",
  "鬼火": "オルペウス&「鬼火」",
  "朱鸢": "朱鳶",
  "シュエン": "朱鳶",
  "Zhu Yuan": "朱鳶",
  "チンイー": "青衣",
  "Qingyi": "青衣",
  "Jane Doe": "ジェーン・ドゥ",
  "ジェーン": "ジェーン・ドゥ",
  "Miyabi": "星見雅",
  "ほしみ みやび": "星見雅",
  "みやび": "星見雅",
  "Yanagi": "月城柳",
  "つきしろ やなぎ": "月城柳",
  "柳": "月城柳",
  "Harumasa": "浅羽悠真",
  "あさば はるまさ": "浅羽悠真",
  "悠真": "浅羽悠真",
  "Evelyn": "イヴリン",
  "Astra Yao": "アストラ・ヤオ",
  "アストラ": "アストラ・ヤオ",
  "Hugo": "ヒューゴ",
  "Vivian": "ビビアン",
  "Ye Shunguang": "葉瞬光",
  "よう・しゅんこう": "葉瞬光",
  "瞬光": "葉瞬光",
  "Ju Fufu": "橘福福",
  "きつ ふくふく": "橘福福",
  "福福": "橘福福",
  "Yixuan": "儀玄",
  "ぎげん": "儀玄",
  "Alice": "アリス",
  "Yuzuha": "浮波柚葉",
  "うきなみ ゆずは": "浮波柚葉",
  "柚葉": "浮波柚葉",
  "Lucia": "リュシア",
  "Yidhari": "イドリー",
  "Dialyn": "ダイアリン",
  "Zhao": "照",
  "しょう": "照",
  "Banyue": "盤岳",
  "ばんがく": "盤岳",
  "Sunna": "千夏",
  "ちなつ": "千夏",
  "Billy": "ビリー",
  "Nicole": "ニコ",
  "ニコ・デマラ": "ニコ",
  "Anby": "アンビー",
  "アンビー・デマラ": "アンビー",
  "Corin": "カリン",
  "Anton": "アンドー",
  "Ben": "ベン",
  "Soukaku": "蒼角",
  "そうかく": "蒼角",
  "Seth": "セス",
  "Lucy": "ルーシー",
  "Piper": "パイパー",
  "Pulchra": "プルクラ",
  "Pan Yinhu": "潘引壺",
  "パン・インフー": "潘引壺",
  "Komano Manato": "狛野真斗",
  "こまの まと": "狛野真斗",
  "真斗": "狛野真斗",
};

// 名前 → AgentInfo のルックアップマップを構築
const _map = new Map<string, AgentInfo>();
for (const agent of AGENTS) {
  _map.set(agent.name, agent);
}
for (const [alias, canonical] of Object.entries(ALIASES)) {
  const agent = _map.get(canonical);
  if (agent) _map.set(alias, agent);
}

export const AGENT_MAP: ReadonlyMap<string, AgentInfo> = _map;

/** 名前（正規名またはエイリアス）からエージェント情報を取得 */
export function lookupAgent(name: string): AgentInfo | undefined {
  return AGENT_MAP.get(name);
}
