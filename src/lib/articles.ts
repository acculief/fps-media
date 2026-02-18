import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  thumbnail?: string;
  content: string;
};

export type ArticleMeta = Omit<Article, "content">;

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) return [];
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        category: data.category ?? "",
        tags: data.tags ?? [],
        date: data.date ?? "",
        thumbnail: data.thumbnail,
      };
    });

  return articles.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getRelatedArticles(
  slug: string,
  category: string,
  tags: string[],
  limit = 3
): ArticleMeta[] {
  const all = getAllArticles().filter((a) => a.slug !== slug);

  const scored = all.map((a) => {
    let score = 0;
    if (a.category === category) score += 2;
    for (const tag of tags) {
      if (a.tags.includes(tag)) score += 1;
    }
    return { article: a, score };
  });

  scored.sort((a, b) => b.score - a.score || (b.article.date > a.article.date ? 1 : -1));
  return scored.slice(0, limit).map((s) => s.article);
}

export function getReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "").replace(/\s+/g, "");
  return Math.max(1, Math.ceil(text.length / 600));
}

export function getAllTags(): { tag: string; count: number }[] {
  const articles = getAllArticles();
  const tagMap = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getArticlesByTag(tag: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.tags.includes(tag));
}

export async function getArticle(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    date: data.date ?? "",
    thumbnail: data.thumbnail,
    content: processed.toString(),
  };
}
