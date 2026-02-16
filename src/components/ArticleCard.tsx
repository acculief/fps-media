import { ArticleMeta } from "@/lib/articles";
import { CATEGORIES } from "@/lib/constants";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  const category = CATEGORIES.find((c) => c.slug === article.category);

  return (
    <a
      href={`/articles/${article.slug}`}
      className="group bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-400/50 transition-colors"
    >
      <div className="bg-gray-800 h-40 flex items-center justify-center text-gray-600">
        <span className="text-4xl">🎮</span>
      </div>
      <div className="p-4">
        {category && (
          <span className="text-xs text-cyan-400 font-medium">
            {category.label}
          </span>
        )}
        <h3 className="font-bold mt-1 mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
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
