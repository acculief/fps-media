"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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
      <mark className="bg-amber-400/20 text-amber-300">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const RECENT_SEARCHES_KEY = "zzn-recent-searches";
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  const trimmed = q.trim();
  if (!trimmed) return;
  const recent = getRecentSearches().filter((s) => s !== trimmed);
  recent.unshift(trimmed);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export function SearchBox({ articles }: { articles: SearchableArticle[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const updateUrl = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (trimmed) {
        router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
      } else {
        router.replace("/search", { scroll: false });
      }
    },
    [router]
  );

  useEffect(() => {
    const timer = setTimeout(() => updateUrl(query), 300);
    return () => clearTimeout(timer);
  }, [query, updateUrl]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const popularTags = useMemo(() => {
    const tagCount = new Map<string, number>();
    articles.forEach((a) =>
      a.tags.forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1))
    );
    return [...tagCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [articles]);

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
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="記事タイトル、タグ、キーワードで検索..."
          autoFocus
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3.5 text-base placeholder-gray-600 focus:border-gray-400 focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="検索をクリア"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
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
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              onClick={() => { saveRecentSearch(query.trim()); }}
              className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-300">
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
            </Link>
          ))}
        </div>
      )}

      {!query.trim() && (
        <div className="py-8">
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-400">最近の検索</h2>
                <button
                  onClick={() => {
                    clearRecentSearches();
                    setRecentSearches([]);
                  }}
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  クリア
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-700 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <h2 className="text-sm font-bold text-gray-400 mb-4">
            人気のキーワード
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-white hover:border-gray-600 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
          <p className="text-center text-gray-600 text-sm">
            キーワードを入力するか、タグをクリックして検索
          </p>
        </div>
      )}
    </div>
  );
}
