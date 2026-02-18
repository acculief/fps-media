import { getAllArticles, getArticlesByCategory } from "@/lib/articles";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";
import Link from "next/link";
import type { Metadata } from "next";

const ARTICLES_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "記事一覧",
  alternates: {
    canonical: `${SITE_URL}/articles`,
  },
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const { cat, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const allArticles = cat ? getArticlesByCategory(cat) : getAllArticles();
  const totalPages = Math.max(
    1,
    Math.ceil(allArticles.length / ARTICLES_PER_PAGE)
  );
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
      <div
        className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible"
        role="tablist"
        aria-label="カテゴリフィルター"
      >
        <Link
          href="/articles"
          role="tab"
          aria-selected={!cat}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors whitespace-nowrap ${
            !cat
              ? "bg-white/10 border-white text-white"
              : "border-gray-700 text-gray-400 hover:border-gray-500"
          }`}
        >
          すべて
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/articles?cat=${c.slug}`}
            role="tab"
            aria-selected={cat === c.slug}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors whitespace-nowrap ${
              cat === c.slug
                ? `${c.bg} ${c.border} ${c.color}`
                : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {c.label}
          </Link>
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
        <nav
          aria-label="ページネーション"
          className="flex items-center justify-center gap-2 mt-12"
        >
          {safePage > 1 ? (
            <Link
              href={buildUrl(safePage - 1)}
              aria-label="前のページへ"
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-gray-500 transition-colors"
            >
              前のページ
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className="px-4 py-2 border border-gray-800 rounded-lg text-sm text-gray-700"
            >
              前のページ
            </span>
          )}

          <ul className="flex items-center gap-1 list-none">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p}>
                <Link
                  href={buildUrl(p)}
                  aria-label={`${p}ページ目`}
                  aria-current={p === safePage ? "page" : undefined}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors ${
                    p === safePage
                      ? "bg-white text-gray-900 font-bold"
                      : "border border-gray-700 hover:border-gray-500"
                  }`}
                >
                  {p}
                </Link>
              </li>
            ))}
          </ul>

          {safePage < totalPages ? (
            <Link
              href={buildUrl(safePage + 1)}
              aria-label="次のページへ"
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-gray-500 transition-colors"
            >
              次のページ
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className="px-4 py-2 border border-gray-800 rounded-lg text-sm text-gray-700"
            >
              次のページ
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
