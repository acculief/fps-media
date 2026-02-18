import Image from "next/image";
import { ArticleMeta } from "@/lib/articles";
import { CATEGORIES } from "@/lib/constants";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  const category = CATEGORIES.find((c) => c.slug === article.category);

  return (
    <a
      href={`/articles/${article.slug}`}
      className="group bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-colors"
    >
      <div className="relative bg-gray-800 h-44 overflow-hidden">
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <svg width="48" height="48" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="24" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="10" y1="24" x2="18" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14" y1="21" x2="14" y2="24" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="14" cy="12" r="3" fill="currentColor"/>
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        {category && (
          <span className="text-xs text-yellow-400 font-medium">
            {category.label}
          </span>
        )}
        <h3 className="font-bold mt-1 mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2">
          {article.description}
        </p>
        <time className="text-xs text-gray-600 mt-3 block">{article.date}</time>
      </div>
    </a>
  );
}
