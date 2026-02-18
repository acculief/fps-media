export const SITE_NAME = "ゼンゼロ通信";
export const SITE_DESCRIPTION =
  "『ゼンレスゾーンゼロ（ゼンゼロ）』の最新情報をお届けする非公式ニュースメディア。公式アップデート、海外速報、キャラ評価、攻略情報をわかりやすくまとめています。";
export const SITE_URL = "https://zenzeronews.vercel.app";

export const CATEGORIES = [
  { slug: "news", label: "ニュース", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  { slug: "overseas", label: "海外速報", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
  { slug: "character", label: "キャラクター", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/30" },
  { slug: "guide", label: "攻略", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
  { slug: "event", label: "イベント", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/30" },
] as const;
