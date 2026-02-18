import { getAllArticles } from "@/lib/articles";
import { SITE_NAME, SITE_DESCRIPTION, CATEGORIES } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";

export default function Home() {
  const articles = getAllArticles();
  const latestArticles = articles.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-yellow-400">{SITE_NAME}</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {SITE_DESCRIPTION}
        </p>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`/articles?cat=${cat.slug}`}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center hover:border-yellow-400 transition-colors"
            >
              <span className="text-sm font-medium">{cat.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">最新記事</h2>
          <a href="/articles" className="text-sm text-yellow-400 hover:underline">
            すべて見る →
          </a>
        </div>
        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center text-gray-500">
            記事を準備中です。お楽しみに！
          </div>
        )}
      </section>
    </div>
  );
}
