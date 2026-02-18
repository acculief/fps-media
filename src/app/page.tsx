import { getAllArticles } from "@/lib/articles";
import { SITE_NAME, SITE_DESCRIPTION, CATEGORIES } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";
import Image from "next/image";

export default function Home() {
  const articles = getAllArticles();
  const [hero, ...rest] = articles;
  const latestArticles = rest.slice(0, 4);

  const categoryArticles = CATEGORIES.map((cat) => ({
    ...cat,
    articles: articles.filter((a) => a.category === cat.slug).slice(0, 3),
  })).filter((cat) => cat.articles.length > 0);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-yellow-400">{SITE_NAME}</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {SITE_DESCRIPTION}
        </p>
      </section>

      {/* Featured Article */}
      {hero && (
        <section className="mb-12">
          <a
            href={`/articles/${hero.slug}`}
            className="group block bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-colors md:flex"
          >
            <div className="relative bg-gray-800 h-56 md:h-auto md:w-1/2 overflow-hidden">
              {hero.thumbnail ? (
                <Image
                  src={hero.thumbnail}
                  alt={hero.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full min-h-56 flex items-center justify-center text-gray-700">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="4"
                      width="24"
                      height="17"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="10"
                      y1="24"
                      x2="18"
                      y2="24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="14"
                      y1="21"
                      x2="14"
                      y2="24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="14" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-6 md:w-1/2 md:flex md:flex-col md:justify-center">
              <span className="text-xs text-yellow-400 font-medium">
                {CATEGORIES.find((c) => c.slug === hero.category)?.label}
              </span>
              <h2 className="text-2xl font-bold mt-2 mb-3 group-hover:text-yellow-400 transition-colors">
                {hero.title}
              </h2>
              <p className="text-gray-400 line-clamp-3 mb-4">
                {hero.description}
              </p>
              <time className="text-xs text-gray-600">{hero.date}</time>
            </div>
          </a>
        </section>
      )}

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">最新記事</h2>
            <a
              href="/articles"
              className="text-sm text-yellow-400 hover:underline"
            >
              すべて見る →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
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

      {/* Category Sections */}
      {categoryArticles.map((cat) => (
        <section key={cat.slug} className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{cat.label}</h2>
            <a
              href={`/articles?cat=${cat.slug}`}
              className="text-sm text-yellow-400 hover:underline"
            >
              もっと見る →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cat.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
