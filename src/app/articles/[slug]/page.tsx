import {
  getArticle,
  getAllArticles,
  getRelatedArticles,
  getReadingTime,
  getAdjacentArticles,
} from "@/lib/articles";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";
import { ShareButtons } from "@/components/ShareButtons";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { TocNav } from "@/components/TocNav";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const url = `${SITE_URL}/articles/${slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      url,
      ...(article.thumbnail ? { images: [{ url: article.thumbnail }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      ...(article.thumbnail ? { images: [article.thumbnail] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const category = CATEGORIES.find((c) => c.slug === article.category);
  const readingTime = getReadingTime(article.content);
  const { prev, next } = getAdjacentArticles(slug);
  const relatedArticles = getRelatedArticles(
    slug,
    article.category,
    article.tags
  );
  const articleUrl = `${SITE_URL}/articles/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    ...(article.thumbnail ? { image: article.thumbnail } : {}),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: article.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: SITE_URL,
      },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.label,
              item: `${SITE_URL}/articles?cat=${category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: article.title,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: article.title,
            },
          ]),
    ],
  };

  return (
    <>
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <article className="max-w-3xl mx-auto">
        <nav
          aria-label="パンくずリスト"
          className="flex items-center gap-2 text-sm text-gray-500 mb-4"
        >
          <Link href="/" className="hover:text-white transition-colors">
            ホーム
          </Link>
          <span aria-hidden="true">/</span>
          {category && (
            <>
              <Link
                href={`/articles?cat=${category.slug}`}
                className="hover:text-white transition-colors"
              >
                {category.label}
              </Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span className="text-gray-600 truncate max-w-xs">
            {article.title}
          </span>
        </nav>
        {category && (
          <span
            className={`inline-block text-xs font-medium px-2.5 py-1 rounded ${category.bg} ${category.border} border ${category.color} mb-3`}
          >
            {category.label}
          </span>
        )}
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
          <time dateTime={article.date}>{article.date}</time>
          <span>約{readingTime}分で読めます</span>
        </div>
        {article.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="bg-gray-800 px-2.5 py-1 rounded text-xs text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Hero Thumbnail */}
        {article.thumbnail && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-10 bg-gray-800">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Table of Contents */}
        {article.toc.length >= 3 && <TocNav items={article.toc} />}

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Buttons */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <ShareButtons url={articleUrl} title={article.title} />
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <nav
            aria-label="前後の記事"
            className="mt-10 pt-6 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {prev ? (
              <Link
                href={`/articles/${prev.slug}`}
                className="group flex items-center gap-3 bg-gray-900/60 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <div className="min-w-0">
                  <span className="text-xs text-gray-600 block">前の記事</span>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors line-clamp-2 mt-0.5 block">
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/articles/${next.slug}`}
                className="group flex items-center gap-3 bg-gray-900/60 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors sm:flex-row-reverse sm:text-right"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <div className="min-w-0">
                  <span className="text-xs text-gray-600 block">次の記事</span>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors line-clamp-2 mt-0.5 block">
                    {next.title}
                  </span>
                </div>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="text-xl font-bold mb-6">関連記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
