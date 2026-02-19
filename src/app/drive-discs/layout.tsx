import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ドライバディスクデータベース",
  description:
    "ゼンレスゾーンゼロ（ゼンゼロ）のドライバディスク一覧。全セット効果、おすすめエージェント、カテゴリ別の検索ができます。",
  alternates: {
    canonical: `${SITE_URL}/drive-discs`,
  },
};

export default function DriveDiscsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
