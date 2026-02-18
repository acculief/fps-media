#!/usr/bin/env node
/**
 * 全記事の画像URL（サムネイル＋本文内）を検証するスクリプト。
 * 壊れたURLがあれば一覧表示し、exit code 1 で終了する。
 *
 * 使い方:
 *   node scripts/check-images.mjs          # 全チェック
 *   node scripts/check-images.mjs --quick  # サムネイルのみ（高速）
 */

import fs from "fs";
import path from "path";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");
const QUICK = process.argv.includes("--quick");
const TIMEOUT_MS = 10_000;

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "ZenZeroNews-ImageChecker/1.0" },
    });
    clearTimeout(timer);
    return { url, status: res.status, ok: res.ok };
  } catch (e) {
    clearTimeout(timer);
    return { url, status: 0, ok: false, error: e.message };
  }
}

function extractUrls(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const urls = [];

  // サムネイル（frontmatter）
  const thumbMatch = content.match(/^thumbnail:\s*"([^"]+)"/m);
  if (thumbMatch) {
    urls.push({ url: thumbMatch[1], type: "thumbnail" });
  }

  // 本文内の画像 ![alt](url)
  if (!QUICK) {
    const imgRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      urls.push({ url: match[1], type: "body" });
    }
  }

  return urls;
}

async function main() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error("記事ディレクトリが見つかりません:", ARTICLES_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  console.log(
    `\n画像URLチェック開始（${files.length}記事, ${QUICK ? "サムネイルのみ" : "全画像"}）\n`
  );

  const allResults = [];

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const urls = extractUrls(filePath);
    if (urls.length === 0) continue;

    // 同一記事内のURLを並列チェック
    const results = await Promise.all(
      urls.map(async ({ url, type }) => {
        const result = await checkUrl(url);
        return { file, type, ...result };
      })
    );

    for (const r of results) {
      const icon = r.ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
      if (!r.ok) {
        console.log(`${icon} [${r.status || "ERR"}] ${r.file} (${r.type})`);
        console.log(`  ${r.url}`);
        if (r.error) console.log(`  Error: ${r.error}`);
      }
      allResults.push(r);
    }
  }

  const total = allResults.length;
  const broken = allResults.filter((r) => !r.ok);

  console.log(`\n─────────────────────────────────`);
  console.log(`チェック完了: ${total}件中 ${broken.length}件が壊れています`);

  if (broken.length > 0) {
    console.log(`\n壊れた画像URL一覧:`);
    for (const r of broken) {
      console.log(`  - ${r.file} (${r.type}): ${r.url}`);
    }
    console.log("");
    process.exit(1);
  } else {
    console.log("全画像URLが正常です\n");
    process.exit(0);
  }
}

main();
