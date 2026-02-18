import { Suspense } from "react";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import { SearchBox } from "@/components/SearchBox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事を検索",
  alternates: {
    canonical: `${SITE_URL}/search`,
  },
};

export default function SearchPage() {
  const articles = getAllArticles().map((a) => ({
    ...a,
    categoryLabel:
      CATEGORIES.find((c) => c.slug === a.category)?.label ?? a.category,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">記事を検索</h1>
      <Suspense>
        <SearchBox articles={articles} />
      </Suspense>
    </div>
  );
}
