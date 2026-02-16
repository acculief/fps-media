import { getArticle, getAllArticles } from "@/lib/articles";
import { CATEGORIES } from "@/lib/constants";
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

  return (
    <article className="max-w-3xl mx-auto">
      {category && (
        <a
          href={`/articles?cat=${category.slug}`}
          className="text-sm text-cyan-400 hover:underline"
        >
          {category.label}
        </a>
      )}
      <h1 className="text-3xl font-bold mt-2 mb-4">{article.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <time>{article.date}</time>
        {article.tags.length > 0 && (
          <div className="flex gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-800 px-2 py-0.5 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
