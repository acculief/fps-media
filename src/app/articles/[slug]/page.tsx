import {
  getArticle,
  getAllArticles,
  getRelatedArticles,
  getReadingTime,
} from "@/lib/articles";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";
import { ShareButtons } from "@/components/ShareButtons";
import { notFound } from "next/navigation";
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
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      url: `${SITE_URL}/articles/${slug}`,
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
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <article className="max-w-3xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-yellow-400 transition-colors">
            ホーム
          </a>
          <span>/</span>
          {category && (
            <>
              <a
                href={`/articles?cat=${category.slug}`}
                className="hover:text-yellow-400 transition-colors"
              >
                {category.label}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-gray-600 truncate max-w-xs">
            {article.title}
          </span>
        </nav>
        <h1 className="text-3xl font-bold mt-2 mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <time dateTime={article.date}>{article.date}</time>
          <span>約{readingTime}分で読めます</span>
          {article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {article.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="bg-gray-800 px-2 py-0.5 rounded text-xs hover:bg-gray-700 hover:text-yellow-400 transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}
        </div>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Buttons */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <ShareButtons url={articleUrl} title={article.title} />
        </div>
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
