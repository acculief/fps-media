import { getAllTags, getArticlesByTag } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `「${decoded}」の記事一覧`,
    description: `ゼンゼロ通信の「${decoded}」に関する記事一覧です。`,
    alternates: {
      canonical: `${SITE_URL}/tags/${encodeURIComponent(decoded)}`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const articles = getArticlesByTag(decoded);
  const tagUrl = `${SITE_URL}/tags/${encodeURIComponent(decoded)}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "タグ一覧", item: `${SITE_URL}/tags` },
      { "@type": "ListItem", position: 3, name: decoded },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `「${decoded}」の記事一覧`,
    url: tagUrl,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 10).map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/articles/${a.slug}`,
        name: a.title,
      })),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <nav
        aria-label="パンくずリスト"
        className="flex items-center gap-2 text-sm text-gray-500 mb-4"
      >
        <Link href="/" className="hover:text-white transition-colors">
          ホーム
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/tags" className="hover:text-white transition-colors">
          タグ一覧
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-600">{decoded}</span>
      </nav>

      <h1 className="text-2xl font-bold mb-2">
        「{decoded}」の記事
      </h1>
      <p className="text-gray-500 text-sm mb-8">{articles.length}件の記事</p>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center text-gray-500">
          このタグの記事はまだありません。
        </div>
      )}
    </div>
  );
}
