import { getAllArticles, getPopularArticles } from "@/lib/articles";
import { SITE_NAME, SITE_DESCRIPTION, CATEGORIES } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const articles = getAllArticles();
  const [hero, ...rest] = articles;
  const latestArticles = rest.slice(0, 4);
  const popularArticles = getPopularArticles(5);

  const categoryArticles = CATEGORIES.map((cat) => ({
    ...cat,
    articles: articles.filter((a) => a.category === cat.slug).slice(0, 3),
  })).filter((cat) => cat.articles.length > 0);

  const heroCategory = hero
    ? CATEGORIES.find((c) => c.slug === hero.category)
    : undefined;

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {SITE_NAME}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {SITE_DESCRIPTION}
        </p>
      </section>

      {/* Featured Article */}
      {hero && (
        <section className="mb-12">
          <Link
            href={`/articles/${hero.slug}`}
            className="group block bg-gray-900/80 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-200 md:flex"
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
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="1" y="1" width="30" height="30" rx="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 9h16l-12 14h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="p-6 md:w-1/2 md:flex md:flex-col md:justify-center">
              {heroCategory && (
                <span className={`text-xs font-medium ${heroCategory.color}`}>
                  {heroCategory.label}
                </span>
              )}
              <h2 className="text-2xl font-bold mt-2 mb-3 text-gray-100 group-hover:text-white transition-colors">
                {hero.title}
              </h2>
              <p className="text-gray-400 line-clamp-3 mb-4">
                {hero.description}
              </p>
              <time className="text-xs text-gray-500">{hero.date}</time>
            </div>
          </Link>
        </section>
      )}

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">最新記事</h2>
            <Link
              href="/articles"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              すべて見る →
            </Link>
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
            <Link
              key={cat.slug}
              href={`/articles?cat=${cat.slug}`}
              className={`${cat.bg} border ${cat.border} rounded-lg p-4 text-center hover:brightness-125 transition-all duration-200`}
            >
              <span className={`text-sm font-medium ${cat.color}`}>
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      {popularArticles.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">注目記事</h2>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg divide-y divide-gray-800">
            {popularArticles.map((article, i) => {
              const cat = CATEGORIES.find((c) => c.slug === article.category);
              return (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors group"
                >
                  <span className="text-2xl font-bold text-gray-600 w-8 text-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    {cat && (
                      <span className={`text-xs font-medium ${cat.color}`}>
                        {cat.label}
                      </span>
                    )}
                    <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors line-clamp-1 mt-0.5">
                      {article.title}
                    </h3>
                  </div>
                  <time className="text-xs text-gray-600 shrink-0 ml-auto">
                    {article.date}
                  </time>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Category Sections */}
      {categoryArticles.map((cat) => (
        <section key={cat.slug} className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{cat.label}</h2>
            <Link
              href={`/articles?cat=${cat.slug}`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              もっと見る →
            </Link>
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
