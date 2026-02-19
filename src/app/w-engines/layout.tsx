import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "音動機データベース",
  description:
    "ゼンレスゾーンゼロ（ゼンゼロ）の音動機（W-Engine）一覧。S級・A級の全音動機の性能、おすすめエージェント、特性別の検索ができます。",
  alternates: {
    canonical: `${SITE_URL}/w-engines`,
  },
};

export default function WEnginesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
