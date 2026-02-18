import { getAllTags } from "@/lib/articles";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "タグ一覧",
  description:
    "ゼンゼロ通信の全タグ一覧。バージョン、キャラクター、攻略カテゴリなどから記事を探せます。",
  alternates: {
    canonical: `${SITE_URL}/tags`,
  },
};

function getTagSize(count: number, maxCount: number): string {
  if (maxCount <= 1) return "text-sm";
  const ratio = Math.log(count) / Math.log(maxCount);
  if (ratio > 0.8) return "text-lg font-bold text-white";
  if (ratio > 0.55) return "text-base font-semibold text-gray-200";
  if (ratio > 0.3) return "text-sm font-medium text-gray-300";
  return "text-sm text-gray-400";
}

export default function TagsPage() {
  const tags = getAllTags();
  const maxCount = tags.length > 0 ? tags[0].count : 1;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">タグ一覧</h1>
      <p className="text-gray-500 text-sm mb-8">
        タグから記事を探す（{tags.length}件のタグ）
      </p>
      <div className="flex flex-wrap gap-3 items-center">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className={`group flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 hover:border-gray-600 hover:bg-gray-800/50 transition-colors ${getTagSize(count, maxCount)}`}
          >
            <span className="group-hover:text-white transition-colors">
              #{tag}
            </span>
            <span className="text-xs text-gray-600 bg-gray-800 group-hover:bg-gray-700 px-2 py-0.5 rounded-full transition-colors">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
