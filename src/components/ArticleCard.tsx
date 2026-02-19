import Image from "next/image";
import Link from "next/link";
import { ArticleMeta } from "@/lib/articles";
import { CATEGORIES } from "@/lib/constants";

function isNew(dateStr: string): boolean {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

function relativeDate(dateStr: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "今日";
  if (days === 1) return "昨日";
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
  return `${Math.floor(days / 365)}年前`;
}

export function ArticleCard({ article }: { article: ArticleMeta }) {
  const category = CATEGORIES.find((c) => c.slug === article.category);
  const fresh = isNew(article.date);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group bg-gray-900/80 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-200"
    >
      <div className="relative bg-gray-800 h-44 overflow-hidden">
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="30" height="30" rx="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 9h16l-12 14h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
        {category && (
          <span className={`absolute bottom-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded ${category.bg} ${category.border} border ${category.color}`}>
            {category.label}
          </span>
        )}
        {fresh && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
            NEW
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-2 text-gray-100 group-hover:text-white transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
          <time dateTime={article.date} title={article.date}>{relativeDate(article.date)}</time>
          <span aria-label={`読了時間約${article.readingTime}分`}>約{article.readingTime}分</span>
        </div>
      </div>
    </Link>
  );
}
