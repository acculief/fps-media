"use client";

import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";

const CATEGORIES = [
  { slug: "news", label: "ニュース" },
  { slug: "leak", label: "リーク・海外情報" },
  { slug: "character", label: "キャラクター" },
  { slug: "guide", label: "攻略" },
  { slug: "event", label: "イベント" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
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
        <nav className="hidden md:flex gap-6 text-sm">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`/articles?cat=${cat.slug}`}
              className="hover:text-yellow-400 transition-colors"
            >
              {cat.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors"
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
                className="py-2.5 px-3 rounded-lg text-sm hover:bg-gray-900 hover:text-yellow-400 transition-colors"
              >
                {cat.label}
              </a>
            ))}
            <div className="border-t border-gray-800 mt-1 pt-2">
              <a
                href="/tags"
                className="py-2.5 px-3 rounded-lg text-sm text-gray-400 hover:bg-gray-900 hover:text-yellow-400 transition-colors block"
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
