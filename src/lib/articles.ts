import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import type { Root, Element, Text } from "hast";
import { visit } from "unist-util-visit";
import { AGENT_MAP } from "./agents";
import { W_ENGINE_NAME_MAP } from "./w-engines";
import { DRIVE_DISC_NAME_MAP } from "./drive-discs";
function hastToString(node: { type: string; value?: string; children?: { type: string; value?: string; children?: unknown[] }[] }): string {
  if (node.type === "text") return node.value ?? "";
  if (node.children) return node.children.map((c) => hastToString(c as typeof node)).join("");
  return "";
}

const articlesDirectory = path.join(process.cwd(), "content/articles");

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  thumbnail?: string;
  content: string;
  toc: TocItem[];
};

export type ArticleMeta = Omit<Article, "content" | "toc"> & {
  readingTime: number;
};

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) return [];
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const readingTime = Math.max(1, Math.ceil(content.replace(/\s+/g, "").length / 500));
      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        category: data.category ?? "",
        tags: data.tags ?? [],
        date: data.date ?? "",
        thumbnail: data.thumbnail,
        readingTime,
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

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      (b.article.date > a.article.date ? 1 : -1)
  );
  return scored.slice(0, limit).map((s) => s.article);
}

export function getReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "").replace(/\s+/g, "");
  return Math.max(1, Math.ceil(text.length / 500));
}

export function getAdjacentArticles(slug: string): {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
} {
  const articles = getAllArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? articles[index - 1] : null,
    next: index < articles.length - 1 ? articles[index + 1] : null,
  };
}

export function getPopularArticles(limit = 5): ArticleMeta[] {
  const all = getAllArticles();
  const scored = all.map((a) => {
    let score = 0;
    // Evergreen content ranks higher
    if (a.category === "guide") score += 3;
    if (a.category === "character") score += 3;
    // Newer articles get a boost
    const daysSince = (Date.now() - new Date(a.date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 14) score += 2;
    else if (daysSince < 30) score += 1;
    // Articles with more tags tend to be comprehensive
    score += Math.min(a.tags.length, 3);
    return { article: a, score };
  });
  scored.sort((a, b) => b.score - a.score || (b.article.date > a.article.date ? 1 : -1));
  return scored.slice(0, limit).map((s) => s.article);
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

export type SeriesInfo = {
  label: string;
  items: { slug: string; name: string }[];
};

export function getArticleSeries(slug: string): SeriesInfo | null {
  const all = getAllArticles();

  if (/^zzz-ver\d+-(?:update|launch)-summary$/.test(slug)) {
    const items = all
      .filter((a) =>
        /^zzz-ver\d+-(?:update|launch)-summary$/.test(a.slug)
      )
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((a) => {
        const m = a.slug.match(/zzz-ver(\d)(\d)/);
        return { slug: a.slug, name: m ? `Ver.${m[1]}.${m[2]}` : a.slug };
      });
    return { label: "バージョンアップデート一覧", items };
  }

  if (slug.endsWith("-build-guide")) {
    const items = all
      .filter((a) => a.slug.endsWith("-build-guide"))
      .sort((a, b) => (a.date > b.date ? -1 : 1))
      .map((a) => ({ slug: a.slug, name: a.tags[0] ?? a.title }));
    return { label: "キャラクタービルドガイド", items };
  }

  return null;
}

function textToId(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function rehypeHeadingIds(toc: TocItem[]) {
  return () => (tree: Root) => {
    const usedIds = new Set<string>();
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "h2" || node.tagName === "h3") {
        const text = hastToString(node as Parameters<typeof hastToString>[0]);
        let id = textToId(text);
        if (!id) id = "heading";
        let uniqueId = id;
        let counter = 1;
        while (usedIds.has(uniqueId)) {
          uniqueId = `${id}-${counter++}`;
        }
        usedIds.add(uniqueId);
        node.properties = node.properties || {};
        node.properties.id = uniqueId;
        toc.push({
          id: uniqueId,
          text,
          level: node.tagName === "h2" ? 2 : 3,
        });
      }
    });
  };
}

function rehypeLazyImages() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img") {
        node.properties = node.properties || {};
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
      }
    });
  };
}

function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "a") {
        const href = node.properties?.href;
        if (typeof href === "string" && /^https?:\/\//.test(href)) {
          node.properties = node.properties || {};
          node.properties.target = "_blank";
          node.properties.rel = "noopener nofollow";
        }
      }
    });
  };
}

function rehypeScrollableTables() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (
        node.tagName === "table" &&
        parent &&
        "children" in parent &&
        typeof index === "number"
      ) {
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"] },
          children: [{ ...node }],
        };
        (parent.children as Element[])[index] = wrapper;
      }
    });
  };
}

function rehypeAgentLinks() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || typeof index !== "number") return;
      const text = node.value;
      const regex = /\{\{([^}]+)\}\}/g;
      let match: RegExpExecArray | null;
      const parts: (Text | Element)[] = [];
      let lastIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        // テキスト前半
        if (match.index > lastIndex) {
          parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
        }
        const agentName = match[1];
        const agent = AGENT_MAP.get(agentName);
        if (agent) {
          const iconNode: Element = {
            type: "element",
            tagName: "img",
            properties: {
              src: agent.icon,
              alt: agent.name,
              className: ["agent-icon"],
              width: 20,
              height: 20,
              loading: "lazy",
              decoding: "async",
            },
            children: [],
          };
          const textNode: Text = { type: "text", value: agent.name };
          if (agent.articleSlug) {
            // ビルドガイドリンク
            parts.push({
              type: "element",
              tagName: "a",
              properties: {
                href: `/articles/${agent.articleSlug}`,
                className: ["agent-link"],
              },
              children: [iconNode, textNode],
            });
          } else {
            // リンクなし
            parts.push({
              type: "element",
              tagName: "span",
              properties: { className: ["agent-mention"] },
              children: [iconNode, textNode],
            });
          }
        } else {
          // 未知のエージェント名 → そのまま残す
          parts.push({ type: "text", value: match[0] });
        }
        lastIndex = regex.lastIndex;
      }

      if (parts.length === 0) return; // マッチなし

      // 残りのテキスト
      if (lastIndex < text.length) {
        parts.push({ type: "text", value: text.slice(lastIndex) });
      }

      // 親ノードの children を置換
      (parent.children as (Text | Element)[]).splice(index, 1, ...parts);
    });
  };
}

function rehypeEquipmentLinks() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || typeof index !== "number") return;
      const text = node.value;
      const regex = /\[\[([^\]]+)\]\]/g;
      let match: RegExpExecArray | null;
      const parts: (Text | Element)[] = [];
      let lastIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
        }
        const equipName = match[1];
        const wEngine = W_ENGINE_NAME_MAP.get(equipName);
        const driveDisc = DRIVE_DISC_NAME_MAP.get(equipName);

        if (wEngine) {
          parts.push({
            type: "element",
            tagName: "a",
            properties: {
              href: `/w-engines/${wEngine.slug}`,
              className: ["equipment-link"],
            },
            children: [{ type: "text", value: equipName }],
          });
        } else if (driveDisc) {
          parts.push({
            type: "element",
            tagName: "a",
            properties: {
              href: `/drive-discs/${driveDisc.slug}`,
              className: ["equipment-link"],
            },
            children: [{ type: "text", value: equipName }],
          });
        } else {
          // Unknown equipment → bold text fallback
          parts.push({
            type: "element",
            tagName: "strong",
            properties: {},
            children: [{ type: "text", value: equipName }],
          });
        }
        lastIndex = regex.lastIndex;
      }

      if (parts.length === 0) return;

      if (lastIndex < text.length) {
        parts.push({ type: "text", value: text.slice(lastIndex) });
      }

      (parent.children as (Text | Element)[]).splice(index, 1, ...parts);
    });
  };
}

export async function getArticle(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const toc: TocItem[] = [];

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHeadingIds(toc))
    .use(rehypeLazyImages)
    .use(rehypeExternalLinks)
    .use(rehypeAgentLinks)
    .use(rehypeEquipmentLinks)
    .use(rehypeScrollableTables)
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
    toc,
  };
}
