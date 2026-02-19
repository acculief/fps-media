"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllWEngines, W_ENGINE_SPECIALTIES } from "@/lib/w-engines";
import type { WEngine } from "@/lib/w-engines";

const RANK_COLORS: Record<string, string> = {
  S: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  A: "text-violet-400 bg-violet-400/10 border-violet-400/30",
  B: "text-blue-400 bg-blue-400/10 border-blue-400/30",
};

const SPECIALTY_COLORS: Record<string, string> = {
  強攻: "text-red-400",
  異常: "text-purple-400",
  撃破: "text-orange-400",
  支援: "text-green-400",
  防護: "text-cyan-400",
  命破: "text-rose-400",
};

function EngineCard({ engine }: { engine: WEngine }) {
  return (
    <Link
      href={`/w-engines/${engine.slug}`}
      className="group block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-800/50 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-sm text-gray-100 group-hover:text-white transition-colors leading-tight">
          {engine.name}
        </h3>
        <span
          className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded border ${RANK_COLORS[engine.rank]}`}
        >
          {engine.rank}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs mb-2">
        <span className={`font-medium ${SPECIALTY_COLORS[engine.specialty] || "text-gray-400"}`}>
          {engine.specialty}
        </span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400">ATK {engine.baseAtk}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400">{engine.advancedStat}</span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {engine.effect}
      </p>
      {engine.motifAgent && (
        <p className="text-xs text-yellow-400/70 mt-2">
          モチーフ: {engine.motifAgent}
        </p>
      )}
    </Link>
  );
}

export default function WEnginesPage() {
  const allEngines = getAllWEngines();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedRank, setSelectedRank] = useState<string>("all");

  const filtered = allEngines.filter((e) => {
    if (selectedSpecialty !== "all" && e.specialty !== selectedSpecialty) return false;
    if (selectedRank !== "all" && e.rank !== selectedRank) return false;
    return true;
  });

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
        <span className="text-gray-300">音動機データベース</span>
      </nav>

      <h1 className="text-2xl font-bold mb-2">音動機データベース</h1>
      <p className="text-gray-500 text-sm mb-6">
        ゼンレスゾーンゼロの音動機一覧。特性・ランク別に検索できます。（{allEngines.length}件）
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Specialty filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedSpecialty("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedSpecialty === "all"
                ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600"
            }`}
          >
            全特性
          </button>
          {W_ENGINE_SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedSpecialty === spec
                  ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Rank filter */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setSelectedRank("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedRank === "all"
                ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600"
            }`}
          >
            全ランク
          </button>
          {(["S", "A"] as const).map((rank) => (
            <button
              key={rank}
              onClick={() => setSelectedRank(rank)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedRank === rank
                  ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600"
              }`}
            >
              {rank}級
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((engine) => (
          <EngineCard key={engine.slug} engine={engine} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          条件に合う音動機が見つかりませんでした。
        </p>
      )}
    </div>
  );
}
