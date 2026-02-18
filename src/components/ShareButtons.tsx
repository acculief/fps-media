"use client";

import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
    title + " | ゼンゼロ通信"
  )}&url=${encodeURIComponent(url)}`;

  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  const hatenaUrl = `https://b.hatena.ne.jp/entry/s/${url.replace(/^https?:\/\//, "")}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500">共有:</span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Xで共有する"
        className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-md transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Post
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LINEで共有する"
        className="inline-flex items-center gap-1.5 bg-[#06C755] hover:bg-[#05b34d] text-white text-sm px-3 py-1.5 rounded-md transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
        LINE
      </a>
      <a
        href={hatenaUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="はてなブックマークに追加する"
        className="inline-flex items-center gap-1.5 bg-[#00A4DE] hover:bg-[#0093c7] text-white text-sm px-3 py-1.5 rounded-md transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.47 21.2c-.45.45-1.06.8-1.76.8-.7 0-1.31-.35-1.76-.8-.45-.45-.8-1.06-.8-1.76 0-.7.35-1.31.8-1.76.45-.45 1.06-.8 1.76-.8.7 0 1.31.35 1.76.8.45.45.8 1.06.8 1.76 0 .7-.35 1.31-.8 1.76zM17.18 2h3.73v12.14h-3.73V2zM6.47 13.27c.95-.55 1.6-1.37 1.6-2.86 0-2.4-1.83-3.7-4.62-3.7H0v14.58h3.9c2.94 0 5.07-1.37 5.07-4.12 0-1.85-1-3.26-2.5-3.9zm-3.1-3.83h.52c1 0 1.6.45 1.6 1.32 0 .82-.55 1.37-1.6 1.37h-.52V9.44zm.85 8.7h-.85V14.1h.85c1.15 0 1.76.58 1.76 1.57 0 .9-.6 1.47-1.76 1.47z" />
        </svg>
        B!
      </a>
      <button
        onClick={copyLink}
        aria-label="記事のリンクをコピーする"
        className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-md transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {copied ? "コピーしました" : "リンクをコピー"}
      </button>
    </div>
  );
}
