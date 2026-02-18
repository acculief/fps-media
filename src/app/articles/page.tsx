import { getAllArticles, getArticlesByCategory } from "@/lib/articles";
import { CATEGORIES } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata = {
  title: "記事一覧",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const articles = cat ? getArticlesByCategory(cat) : getAllArticles();
  const currentCategory = CATEGORIES.find((c) => c.slug === cat);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {currentCategory ? `${currentCategory.label}の記事` : "記事一覧"}
      </h1>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <a
          href="/articles"
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            !cat
              ? "border-yellow-400 text-yellow-400"
              : "border-gray-700 text-gray-400 hover:border-gray-500"
          }`}
        >
          すべて
        </a>
        {CATEGORIES.map((c) => (
          <a
            key={c.slug}
            href={`/articles?cat=${c.slug}`}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              cat === c.slug
                ? "border-yellow-400 text-yellow-400"
                : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {c.label}
          </a>
        ))}
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center text-gray-500">
          このカテゴリの記事はまだありません。
        </div>
      )}
    </div>
  );
}
