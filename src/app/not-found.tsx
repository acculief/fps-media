import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-gray-700 mb-6">
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="1" width="30" height="30" rx="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 9h16l-12 14h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="19" x2="22" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        </svg>
      </div>
      <h1 className="text-5xl font-bold text-yellow-400 mb-2">404</h1>
      <p className="text-xl text-gray-300 mb-2">ページが見つかりません</p>
      <p className="text-gray-500 mb-8">
        お探しのページは削除されたか、URLが変更された可能性があります。
      </p>
      <div className="flex gap-4">
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
    </div>
  );
}
