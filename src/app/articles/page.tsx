import { getAllArticles, getArticlesByCategory } from "@/lib/articles";
import { CATEGORIES } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";

const ARTICLES_PER_PAGE = 12;

export const metadata = {
  title: "記事一覧",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const { cat, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const allArticles = cat ? getArticlesByCategory(cat) : getAllArticles();
  const totalPages = Math.max(1, Math.ceil(allArticles.length / ARTICLES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const articles = allArticles.slice(
    (safePage - 1) * ARTICLES_PER_PAGE,
    safePage * ARTICLES_PER_PAGE
  );
  const currentCategory = CATEGORIES.find((c) => c.slug === cat);

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (cat) params.set("cat", cat);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/articles${qs ? `?${qs}` : ""}`;
  };

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

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-12">
          {safePage > 1 ? (
            <a
              href={buildUrl(safePage - 1)}
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-yellow-400/50 transition-colors"
            >
              前のページ
            </a>
          ) : (
            <span className="px-4 py-2 border border-gray-800 rounded-lg text-sm text-gray-700">
              前のページ
            </span>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={buildUrl(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors ${
                  p === safePage
                    ? "bg-yellow-400 text-gray-900 font-bold"
                    : "border border-gray-700 hover:border-yellow-400/50"
                }`}
              >
                {p}
              </a>
            ))}
          </div>

          {safePage < totalPages ? (
            <a
              href={buildUrl(safePage + 1)}
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-yellow-400/50 transition-colors"
            >
              次のページ
            </a>
          ) : (
            <span className="px-4 py-2 border border-gray-800 rounded-lg text-sm text-gray-700">
              次のページ
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
