#!/usr/bin/env node
/**
 * 全記事の外部画像をローカル (public/images/) にダウンロードし、
 * 記事の .md ファイル内のURLをローカルパスに書き換えるスクリプト。
 *
 * 使い方:
 *   node scripts/download-images.mjs           # 全画像をダウンロード＆書き換え
 *   node scripts/download-images.mjs --dry-run # 書き換えず一覧だけ表示
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");
const IMAGES_DIR = path.join(process.cwd(), "public/images");
const DRY_RUN = process.argv.includes("--dry-run");
const TIMEOUT_MS = 30_000;

function urlToFilename(url) {
  // URLからファイル名を生成: hash + 拡張子
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 12);
  // URLから拡張子を推測
  const urlPath = new URL(url).pathname;
  let ext = path.extname(urlPath.split("/revision/")[0] || urlPath) || ".png";
  // 拡張子のクリーンアップ
  ext = ext.split("?")[0];
  if (![".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext.toLowerCase())) {
    ext = ".png";
  }
  return `${hash}${ext}`;
}

function extractAllUrls(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const urls = new Map(); // url -> { type, line }

  // サムネイル（frontmatter）
  const thumbMatch = content.match(/^thumbnail:\s*"([^"]+)"/m);
  if (thumbMatch && thumbMatch[1].startsWith("http")) {
    urls.set(thumbMatch[1], { type: "thumbnail" });
  }

  // 本文内の画像 ![alt](url)
  const imgRegex = /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    if (!urls.has(match[1])) {
      urls.set(match[1], { type: "body" });
    }
  }

  return urls;
}

async function downloadImage(url, destPath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "ZenZeroNews-ImageDownloader/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return { ok: true, size: buffer.length };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, error: e.message };
  }
}

function replaceUrlInFile(filePath, oldUrl, newPath) {
  let content = fs.readFileSync(filePath, "utf8");
  // frontmatter thumbnail
  content = content.replace(
    `thumbnail: "${oldUrl}"`,
    `thumbnail: "${newPath}"`
  );
  // markdown images ![alt](url)
  content = content.replaceAll(oldUrl, newPath);
  fs.writeFileSync(filePath, content, "utf8");
}

async function main() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error("記事ディレクトリが見つかりません:", ARTICLES_DIR);
    process.exit(1);
  }

  // public/images/ ディレクトリ作成
  if (!DRY_RUN && !fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md")).sort();

  // 全記事からURL収集
  const urlFileMap = new Map(); // url -> Set<filePath>
  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const urls = extractAllUrls(filePath);
    for (const [url] of urls) {
      if (!urlFileMap.has(url)) urlFileMap.set(url, new Set());
      urlFileMap.get(url).add(filePath);
    }
  }

  const uniqueUrls = [...urlFileMap.keys()];
  console.log(`\n外部画像: ${uniqueUrls.length}件（${files.length}記事から検出）`);

  if (DRY_RUN) {
    console.log("\n[DRY RUN] ダウンロードは行いません\n");
    for (const url of uniqueUrls) {
      const filename = urlToFilename(url);
      const files = [...urlFileMap.get(url)].map((f) => path.basename(f));
      console.log(`  ${filename} ← ${files.join(", ")}`);
      console.log(`    ${url.slice(0, 100)}...`);
    }
    process.exit(0);
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of uniqueUrls) {
    const filename = urlToFilename(url);
    const destPath = path.join(IMAGES_DIR, filename);
    const localPath = `/images/${filename}`;

    // 既にダウンロード済みならスキップ
    if (fs.existsSync(destPath)) {
      skipped++;
      // URLの書き換えだけ実行
      for (const filePath of urlFileMap.get(url)) {
        replaceUrlInFile(filePath, url, localPath);
      }
      continue;
    }

    process.stdout.write(`  ダウンロード中: ${filename} ...`);
    const result = await downloadImage(url, destPath);

    if (result.ok) {
      downloaded++;
      const sizeKB = Math.round(result.size / 1024);
      console.log(` ✓ (${sizeKB}KB)`);
      // 全ての参照ファイルでURLを書き換え
      for (const filePath of urlFileMap.get(url)) {
        replaceUrlInFile(filePath, url, localPath);
      }
    } else {
      failed++;
      console.log(` ✗ (${result.status || result.error})`);
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`完了: ${downloaded}件ダウンロード, ${skipped}件スキップ, ${failed}件失敗`);

  if (failed > 0) {
    console.log("⚠ 失敗した画像は外部URLのまま残っています\n");
    process.exit(1);
  } else {
    console.log("全画像をローカルに保存しました\n");
    process.exit(0);
  }
}

main();
