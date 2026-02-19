import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllDriveDiscs, getDriveDiscBySlug } from "@/lib/drive-discs";
import { lookupAgent } from "@/lib/agents";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllDriveDiscs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const disc = getDriveDiscBySlug(slug);
  if (!disc) return {};
  return {
    title: `${disc.name}｜ドライバディスク`,
    description: `ゼンゼロのドライバディスク「${disc.name}」のセット効果・おすすめエージェントを解説。${disc.category}。`,
    alternates: {
      canonical: `${SITE_URL}/drive-discs/${slug}`,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "アタッカー向け": "text-red-400 bg-red-400/10",
  "異常向け": "text-purple-400 bg-purple-400/10",
  "サポート向け": "text-green-400 bg-green-400/10",
  "撃破向け": "text-orange-400 bg-orange-400/10",
  "防護向け": "text-cyan-400 bg-cyan-400/10",
  "汎用": "text-gray-300 bg-gray-700/30",
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

export default async function DriveDiscDetailPage({ params }: Props) {
  const { slug } = await params;
  const disc = getDriveDiscBySlug(slug);
  if (!disc) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "ドライバディスク",
        item: `${SITE_URL}/drive-discs`,
      },
      { "@type": "ListItem", position: 3, name: disc.name },
    ],
  };

  const schemaLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: disc.name,
    description: `2セット: ${disc.twoSetEffect} / 4セット: ${disc.fourSetEffect}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: `ドライバディスク / ${disc.category}`,
  };

  // Find related discs (same category)
  const allDiscs = getAllDriveDiscs();
  const related = allDiscs
    .filter((d) => d.slug !== disc.slug && d.category === disc.category)
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
        <Link
          href="/drive-discs"
          className="hover:text-white transition-colors"
        >
          ドライバディスク
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-300">{disc.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <span
          className={`inline-block text-xs font-medium px-2.5 py-1 rounded mb-3 ${CATEGORY_COLORS[disc.category] || "text-gray-400 bg-gray-800"}`}
        >
          {disc.category}
        </span>
        <h1 className="text-3xl font-bold">{disc.name}</h1>
      </div>

      {/* Set Effects */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 pl-3 border-l-4 border-yellow-400">
          セット効果
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                2セット
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {disc.twoSetEffect}
            </p>
          </div>
          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                4セット
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {disc.fourSetEffect}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Agents */}
      {disc.recommendedAgents.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 pl-3 border-l-4 border-yellow-400">
            おすすめエージェント
          </h2>
          <div className="flex flex-wrap gap-3">
            {disc.recommendedAgents.map((name) => (
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
            同カテゴリのディスク
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {related.map((d) => (
              <Link
                key={d.slug}
                href={`/drive-discs/${d.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <h3 className="text-sm font-bold mb-2">{d.name}</h3>
                <p className="text-xs text-gray-500">2セット: {d.twoSetEffect}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
