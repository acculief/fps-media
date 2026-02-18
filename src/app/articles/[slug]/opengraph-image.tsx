import { ImageResponse } from "next/og";
import { getArticle, getAllArticles } from "@/lib/articles";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "記事のサムネイル画像";

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const uniqueChars = [...new Set(text)].join("");
    const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(uniqueChars)}`;
    const css = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    }).then((r) => r.text());
    const match = css.match(
      /src:\s*url\((.+?)\)\s+format\('(?:truetype|opentype)'\)/
    );
    if (!match?.[1]) return null;
    return await fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    const fallbackFont = await loadFont(SITE_NAME + "Z");
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#030712",
            color: "#FACC15",
            fontSize: 48,
            fontWeight: 700,
            fontFamily: '"Noto Sans JP"',
          }}
        >
          {SITE_NAME}
        </div>
      ),
      {
        ...size,
        fonts: fallbackFont
          ? [{ name: "Noto Sans JP", data: fallbackFont, weight: 700 as const, style: "normal" as const }]
          : [],
      }
    );
  }

  const category = CATEGORIES.find((c) => c.slug === article.category);
  const categoryColor =
    {
      news: "#FACC15",
      overseas: "#22d3ee",
      character: "#fb7185",
      guide: "#34d399",
      event: "#a78bfa",
    }[article.category] ?? "#FACC15";

  const maxLen = 60;
  const displayTitle =
    article.title.length > maxLen
      ? article.title.slice(0, maxLen) + "..."
      : article.title;

  const allText = [displayTitle, category?.label ?? "", SITE_NAME, article.date, "Z"].join("");
  const fontData = await loadFont(allText);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#030712",
          padding: "60px 80px",
          position: "relative",
          overflow: "hidden",
          fontFamily: '"Noto Sans JP", sans-serif',
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}88)`,
            display: "flex",
          }}
        />

        {/* Subtle glow */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${categoryColor}08 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Category */}
        {category && (
          <div
            style={{
              display: "flex",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                color: categoryColor,
                fontSize: 22,
                fontWeight: 700,
                border: `2px solid ${categoryColor}40`,
                borderRadius: 8,
                padding: "6px 20px",
                backgroundColor: `${categoryColor}10`,
              }}
            >
              {category.label}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#f3f4f6",
              fontSize: displayTitle.length > 30 ? 42 : 52,
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {displayTitle}
          </div>
        </div>

        {/* Footer: site name + date */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: "#0a0a0a",
                border: "2px solid #FACC15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FACC15",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              Z
            </div>
            <span
              style={{
                color: "#FACC15",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {SITE_NAME}
            </span>
          </div>
          <span
            style={{
              color: "#6b7280",
              fontSize: 20,
            }}
          >
            {article.date}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Noto Sans JP", data: fontData, weight: 700 as const, style: "normal" as const }]
        : [],
    }
  );
}
