import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { getPopularArticles } from "@/lib/articles";

export default function NotFound() {
  const popular = getPopularArticles(5);

  return (
    <div className="max-w-2xl mx-auto py-16">
      <div className="text-center mb-12">
        <div className="text-gray-700 mb-6">
          <svg
            width="80"
            height="80"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="30"
              height="30"
              rx="6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 9h16l-12 14h16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="10"
              y1="19"
              x2="22"
              y2="19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-yellow-400 mb-2">404</h1>
        <p className="text-xl text-gray-300 mb-2">ページが見つかりません</p>
        <p className="text-gray-500 mb-8">
          お探しのページは削除されたか、URLが変更された可能性があります。
        </p>
        <div className="flex gap-4 justify-center mb-10">
          <Link
            href="/"
            className="bg-yellow-400 text-gray-900 font-semibold px-6 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            {SITE_NAME}トップへ
          </Link>
          <Link
            href="/articles"
            className="border border-gray-700 text-gray-300 px-6 py-2.5 rounded-lg hover:border-gray-500 transition-colors"
          >
            記事一覧
          </Link>
        </div>

        {/* Search form */}
        <form
          action="/search"
          className="relative max-w-md mx-auto"
        >
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            name="q"
            placeholder="記事を検索..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-sm placeholder-gray-600 focus:border-gray-400 focus:outline-none transition-colors"
          />
        </form>
      </div>

      {/* Popular articles */}
      {popular.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-400 mb-4">
            人気の記事
          </h2>
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg divide-y divide-gray-800">
            {popular.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block p-4 hover:bg-gray-800/50 transition-colors group"
              >
                <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors line-clamp-1">
                  {article.title}
                </h3>
                <time className="text-xs text-gray-600 mt-1 block">
                  {article.date}
                </time>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
