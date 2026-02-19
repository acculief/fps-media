"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllDriveDiscs, DRIVE_DISC_CATEGORIES } from "@/lib/drive-discs";
import type { DriveDisc } from "@/lib/drive-discs";

const CATEGORY_COLORS: Record<string, string> = {
  "アタッカー向け": "text-red-400",
  "異常向け": "text-purple-400",
  "サポート向け": "text-green-400",
  "撃破向け": "text-orange-400",
  "防護向け": "text-cyan-400",
  "汎用": "text-gray-300",
};

function DiscCard({ disc }: { disc: DriveDisc }) {
  return (
    <Link
      href={`/drive-discs/${disc.slug}`}
      className="group block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-800/50 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-sm text-gray-100 group-hover:text-white transition-colors leading-tight">
          {disc.name}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium ${CATEGORY_COLORS[disc.category] || "text-gray-400"}`}
        >
          {disc.category}
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-xs text-yellow-400/70 mb-0.5">2セット</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {disc.twoSetEffect}
          </p>
        </div>
        <div>
          <p className="text-xs text-yellow-400/70 mb-0.5">4セット</p>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {disc.fourSetEffect}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function DriveDiscsPage() {
  const allDiscs = getAllDriveDiscs();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered =
    selectedCategory === "all"
      ? allDiscs
      : allDiscs.filter((d) => d.category === selectedCategory);

  return (
    <div>
      <nav
        aria-label="パンくずリスト"
        className="flex items-center gap-2 text-sm text-gray-500 mb-4"
      >
        <Link href="/" className="hover:text-white transition-colors">
          ホーム
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-300">ドライバディスクデータベース</span>
      </nav>

      <h1 className="text-2xl font-bold mb-2">ドライバディスクデータベース</h1>
      <p className="text-gray-500 text-sm mb-6">
        ゼンレスゾーンゼロのドライバディスク（装備）セット効果一覧。カテゴリ別に検索できます。（{allDiscs.length}件）
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 mb-6 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
              : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600"
          }`}
        >
          すべて
        </button>
        {DRIVE_DISC_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((disc) => (
          <DiscCard key={disc.slug} disc={disc} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          条件に合うディスクが見つかりませんでした。
        </p>
      )}
    </div>
  );
}
