import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, CATEGORIES } from "@/lib/constants";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              inLanguage: "ja",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-bold text-yellow-400 mb-3">
              {SITE_NAME}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              『ゼンレスゾーンゼロ』の最新情報をお届けする非公式ファンサイト。公式アプデ、海外速報、キャラ評価、攻略情報をまとめています。
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 mb-3">カテゴリ</h3>
            <ul className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/articles?cat=${cat.slug}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 mb-3">リンク</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/articles"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  記事一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  タグ一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  サイト内検索
                </Link>
              </li>
              <li>
                <Link
                  href="/feed.xml"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  RSS フィード
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          <p>&copy; 2026 {SITE_NAME}. All rights reserved.</p>
          <p className="mt-1">
            当サイトはゲームの非公式ファンサイトです。&copy; COGNOSPHERE PTE.
            LTD.
          </p>
        </div>
      </div>
    </footer>
  );
}
