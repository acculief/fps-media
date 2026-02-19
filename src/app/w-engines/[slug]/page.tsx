import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllWEngines, getWEngineBySlug } from "@/lib/w-engines";
import { lookupAgent } from "@/lib/agents";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllWEngines().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engine = getWEngineBySlug(slug);
  if (!engine) return {};
  return {
    title: `${engine.name}｜音動機`,
    description: `ゼンゼロの音動機「${engine.name}」の性能・効果・おすすめエージェントを解説。${engine.rank}級${engine.specialty}タイプ。`,
    alternates: {
      canonical: `${SITE_URL}/w-engines/${slug}`,
    },
  };
}

const RANK_COLORS: Record<string, string> = {
  S: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  A: "text-violet-400 bg-violet-400/10 border-violet-400/30",
  B: "text-blue-400 bg-blue-400/10 border-blue-400/30",
};

const SPECIALTY_COLORS: Record<string, string> = {
  強攻: "text-red-400 bg-red-400/10",
  異常: "text-purple-400 bg-purple-400/10",
  撃破: "text-orange-400 bg-orange-400/10",
  支援: "text-green-400 bg-green-400/10",
  防護: "text-cyan-400 bg-cyan-400/10",
  命破: "text-rose-400 bg-rose-400/10",
};

function AgentLink({ name }: { name: string }) {
  const agent = lookupAgent(name);
  if (!agent) return <span className="text-gray-300">{name}</span>;

  const inner = (
    <span className="inline-flex items-center gap-1.5">
      <Image
        src={agent.icon}
        alt={agent.name}
        width={24}
        height={24}
        className="rounded-full"
      />
      <span>{agent.name}</span>
    </span>
  );

  if (agent.articleSlug) {
    return (
      <Link
        href={`/articles/${agent.articleSlug}`}
        className="text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        {inner}
      </Link>
    );
  }
  return <span className="text-gray-200 font-medium">{inner}</span>;
}

export default async function WEngineDetailPage({ params }: Props) {
  const { slug } = await params;
  const engine = getWEngineBySlug(slug);
  if (!engine) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "音動機",
        item: `${SITE_URL}/w-engines`,
      },
      { "@type": "ListItem", position: 3, name: engine.name },
    ],
  };

  const schemaLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: engine.name,
    description: engine.effect,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: `音動機 / ${engine.specialty}`,
  };

  // Find related engines (same specialty, same rank)
  const allEngines = getAllWEngines();
  const related = allEngines
    .filter(
      (e) =>
        e.slug !== engine.slug &&
        (e.specialty === engine.specialty || e.rank === engine.rank)
    )
    .slice(0, 6);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="パンくずリスト"
        className="flex items-center gap-2 text-sm text-gray-500 mb-6"
      >
        <Link href="/" className="hover:text-white transition-colors">
          ホーム
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/w-engines" className="hover:text-white transition-colors">
          音動機
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-300">{engine.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded border ${RANK_COLORS[engine.rank]}`}
          >
            {engine.rank}級
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded ${SPECIALTY_COLORS[engine.specialty] || "text-gray-400 bg-gray-800"}`}
          >
            {engine.specialty}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{engine.name}</h1>
        {engine.motifAgent && (
          <p className="text-sm text-gray-400">
            モチーフエージェント: <AgentLink name={engine.motifAgent} />
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 pl-3 border-l-4 border-yellow-400">
          基本性能
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">ランク</p>
            <p className="font-bold">{engine.rank}級</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">特性</p>
            <p className="font-bold">{engine.specialty}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">基礎攻撃力</p>
            <p className="font-bold">{engine.baseAtk}</p>
          </div>
          <div className="col-span-2 md:col-span-3">
            <p className="text-xs text-gray-500 mb-1">上級ステータス</p>
            <p className="font-bold">{engine.advancedStat}</p>
          </div>
        </div>
      </div>

      {/* Effect */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 pl-3 border-l-4 border-yellow-400">
          パッシブ効果
        </h2>
        <p className="text-gray-300 leading-relaxed">{engine.effect}</p>
      </div>

      {/* Recommended Agents */}
      {engine.recommendedAgents.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 pl-3 border-l-4 border-yellow-400">
            おすすめエージェント
          </h2>
          <div className="flex flex-wrap gap-3">
            {engine.recommendedAgents.map((name) => (
              <div
                key={name}
                className="bg-gray-800 rounded-lg px-4 py-2.5"
              >
                <AgentLink name={name} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4 pl-3 border-l-4 border-yellow-400">
            関連音動機
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {related.map((e) => (
              <Link
                key={e.slug}
                href={`/w-engines/${e.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold">{e.name}</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded border ${RANK_COLORS[e.rank]}`}
                  >
                    {e.rank}
                  </span>
                </div>
                <span
                  className={`text-xs ${SPECIALTY_COLORS[e.specialty]?.split(" ")[0] || "text-gray-400"}`}
                >
                  {e.specialty}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
