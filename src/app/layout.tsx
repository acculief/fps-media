import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, CATEGORIES } from "@/lib/constants";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
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
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-2xl font-bold text-yellow-400 tracking-tight">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="24" height="17" rx="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="10" y1="24" x2="18" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="21" x2="14" y2="24" stroke="currentColor" strokeWidth="2"/>
            <circle cx="14" cy="12" r="3" fill="currentColor"/>
          </svg>
          {SITE_NAME}
        </a>
        <nav className="hidden md:flex gap-6 text-sm">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`/articles?cat=${cat.slug}`}
              className="hover:text-yellow-400 transition-colors"
            >
              {cat.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        &copy; 2026 {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
