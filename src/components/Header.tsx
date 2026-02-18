"use client";

import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";

const CATEGORIES = [
  { slug: "news", label: "ニュース", color: "hover:text-yellow-400" },
  { slug: "overseas", label: "海外速報", color: "hover:text-cyan-400" },
  { slug: "character", label: "キャラクター", color: "hover:text-rose-400" },
  { slug: "guide", label: "攻略", color: "hover:text-emerald-400" },
  { slug: "event", label: "イベント", color: "hover:text-violet-400" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-yellow-400 tracking-tight"
        >
          <svg
            width="28"
            height="28"
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
              strokeWidth="2"
            />
            <line
              x1="10"
              y1="24"
              x2="18"
              y2="24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="14"
              y1="21"
              x2="14"
              y2="24"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="14" cy="12" r="3" fill="currentColor" />
          </svg>
          {SITE_NAME}
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`/articles?cat=${cat.slug}`}
              className={`text-gray-300 ${cat.color} transition-colors`}
            >
              {cat.label}
            </a>
          ))}
          <a
            href="/search"
            aria-label="記事を検索"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
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
          </a>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="メニュー"
        >
          {open ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-gray-800 bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`/articles?cat=${cat.slug}`}
                onClick={() => setOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-sm text-gray-300 hover:bg-gray-900 ${cat.color} transition-colors`}
              >
                {cat.label}
              </a>
            ))}
            <div className="border-t border-gray-800 mt-1 pt-2 flex flex-col gap-1">
              <a
                href="/search"
                onClick={() => setOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm text-gray-400 hover:bg-gray-900 hover:text-white transition-colors block"
              >
                記事を検索
              </a>
              <a
                href="/tags"
                onClick={() => setOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm text-gray-400 hover:bg-gray-900 hover:text-white transition-colors block"
              >
                タグ一覧
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
