import { getAllTags, getArticlesByTag } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `「${decoded}」の記事一覧`,
    description: `ゼンゼロ通信の「${decoded}」に関する記事一覧です。`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const articles = getArticlesByTag(decoded);

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-yellow-400 transition-colors">
          ホーム
        </a>
        <span>/</span>
        <a href="/tags" className="hover:text-yellow-400 transition-colors">
          タグ一覧
        </a>
        <span>/</span>
        <span className="text-gray-600">{decoded}</span>
      </nav>

      <h1 className="text-2xl font-bold mb-2">
        「{decoded}」の記事
      </h1>
      <p className="text-gray-500 text-sm mb-8">{articles.length}件の記事</p>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center text-gray-500">
          このタグの記事はまだありません。
        </div>
      )}
    </div>
  );
}
