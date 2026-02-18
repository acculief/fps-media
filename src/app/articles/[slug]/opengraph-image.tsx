import { ImageResponse } from "next/og";
import { getArticle, getAllArticles } from "@/lib/articles";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
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
          }}
        >
          {SITE_NAME}
        </div>
      ),
      { ...size }
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
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: categoryColor,
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
                fontSize: 24,
                fontWeight: 700,
                border: `2px solid ${categoryColor}`,
                borderRadius: 8,
                padding: "4px 16px",
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
          <h1
            style={{
              color: "#f3f4f6",
              fontSize: article.title.length > 40 ? 42 : 52,
              fontWeight: 700,
              lineHeight: 1.3,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {article.title}
          </h1>
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
            {/* Z logo */}
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
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {SITE_NAME}
            </span>
          </div>
          <span
            style={{
              color: "#6b7280",
              fontSize: 22,
            }}
          >
            {article.date}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
