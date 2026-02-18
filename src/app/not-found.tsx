import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-gray-700 mb-6">
        <svg
          width="80"
          height="80"
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
          <line
            x1="9"
            y1="10"
            x2="12"
            y2="14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="10"
            x2="9"
            y2="14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="10"
            x2="19"
            y2="14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="19"
            y1="10"
            x2="16"
            y2="14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-2">404</h1>
      <p className="text-xl text-gray-300 mb-2">ページが見つかりません</p>
      <p className="text-gray-500 mb-8">
        お探しのページは削除されたか、URLが変更された可能性があります。
      </p>
      <div className="flex gap-4">
        <a
          href="/"
          className="bg-yellow-400 text-gray-900 font-semibold px-6 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          {SITE_NAME}トップへ
        </a>
        <a
          href="/articles"
          className="border border-gray-700 text-gray-300 px-6 py-2.5 rounded-lg hover:border-yellow-400/50 transition-colors"
        >
          記事一覧
        </a>
      </div>
    </div>
  );
}
