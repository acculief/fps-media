import type { MetadataRoute } from "next";
import { getAllArticles, getAllTags, getArticlesByTag } from "@/lib/articles";
import { SITE_URL, CATEGORIES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const tags = getAllTags();

  const articleEntries = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tagEntries = tags.map(({ tag }) => {
    const tagArticles = getArticlesByTag(tag);
    const latestDate = tagArticles.length > 0
      ? new Date(tagArticles[0].date)
      : new Date();
    return {
      url: `${SITE_URL}/tags/${encodeURIComponent(tag)}`,
      lastModified: latestDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    };
  });

  const categoryEntries = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/articles?cat=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...categoryEntries,
    ...articleEntries,
    ...tagEntries,
  ];
}
