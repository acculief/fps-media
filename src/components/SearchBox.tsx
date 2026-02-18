"use client";

import { useState, useMemo } from "react";

type SearchableArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  thumbnail?: string;
  categoryLabel: string;
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-400/20 text-yellow-400">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchBox({ articles }: { articles: SearchableArticle[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.categoryLabel.toLowerCase().includes(q)
    );
  }, [query, articles]);

  return (
    <div>
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          width="20"
          height="20"
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="記事タイトル、タグ、キーワードで検索..."
          autoFocus
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3.5 text-base placeholder-gray-600 focus:border-yellow-400 focus:outline-none transition-colors"
        />
      </div>

      {query.trim() && (
        <p className="text-sm text-gray-500 mb-6">
          {results.length > 0
            ? `${results.length}件の記事が見つかりました`
            : "該当する記事が見つかりませんでした"}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((article) => (
            <a
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-yellow-400/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-yellow-400">
                  {article.categoryLabel}
                </span>
                <time className="text-xs text-gray-600">{article.date}</time>
              </div>
              <h3 className="font-bold mb-1 text-base">
                {highlightMatch(article.title, query.trim())}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {highlightMatch(article.description, query.trim())}
              </p>
              {article.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {!query.trim() && (
        <div className="text-center text-gray-600 py-12">
          キーワードを入力すると記事を検索できます
        </div>
      )}
    </div>
  );
}
