import { getAllTags } from "@/lib/articles";

export const metadata = {
  title: "タグ一覧",
  description:
    "ゼンゼロ通信の全タグ一覧。バージョン、キャラクター、攻略カテゴリなどから記事を探せます。",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">タグ一覧</h1>
      <p className="text-gray-500 text-sm mb-8">
        タグから記事を探す（{tags.length}件）
      </p>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <a
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="group flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 hover:border-yellow-400/50 transition-colors"
          >
            <span className="text-sm group-hover:text-yellow-400 transition-colors">
              {tag}
            </span>
            <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
              {count}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
