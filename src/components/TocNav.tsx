"use client";

import { useState } from "react";
import type { TocItem } from "@/lib/articles";

export function TocNav({ items }: { items: TocItem[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      aria-label="目次"
      className="bg-gray-900 border border-gray-800 rounded-lg mb-10"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left"
        aria-expanded={expanded}
        aria-controls="toc-list"
      >
        <span className="text-sm font-bold text-gray-300">目次</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 md:hidden ${
            expanded ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <ol
        id="toc-list"
        className={`space-y-1.5 px-5 pb-5 ${
          expanded ? "block" : "hidden"
        } md:block`}
      >
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${item.id}`}
              className="text-sm text-gray-400 hover:text-white transition-colors leading-relaxed"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
