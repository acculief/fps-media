# FPS Navi - プロジェクトナレッジ

## プロジェクト概要
- **サイト名**: FPS Navi
- **URL**: https://fps-navi.vercel.app
- **技術スタック**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **デプロイ先**: Vercel
- **フォント**: Noto Sans JP
- **テーマ**: ダーク（背景 #030712、アクセント cyan #06B6D4）

## ディレクトリ構成
```
content/articles/*.md   # 記事（Markdownファイル）
src/app/                # Next.js App Router
src/app/articles/       # 記事一覧・個別ページ
src/components/         # 共通コンポーネント
src/lib/articles.ts     # 記事読み込み・Markdown処理
src/lib/constants.ts    # サイト設定・カテゴリ定義
```

## 記事の作成方法
- `content/articles/` に `.md` ファイルを置くだけで自動認識される
- ファイル名がそのまま `slug`（URLパス）になる
- Markdownの処理パイプライン: `remark` → `remark-gfm` → `remark-rehype` → `rehype-raw` → `rehype-stringify`

### 記事のフロントマター（必須）
```yaml
---
title: "記事タイトル"
description: "SEO用の説明文"
category: "title"          # recommend | tips | device | title | pc
tags: ["タグ1", "タグ2"]
date: "2026-02-16"
thumbnail: "https://..."   # 任意。画像URL
---
```

### カテゴリ一覧
| slug | label | 用途 |
|---|---|---|
| recommend | おすすめ | ゲームのおすすめ記事 |
| tips | 攻略・上達 | 攻略ガイド、テクニック解説 |
| device | デバイス | マウス、キーボード等のレビュー |
| title | タイトル別 | ゲームタイトルごとのニュース・レビュー |
| pc | PC環境 | PC構成、回線、OS設定など |

## 記事のスタイルガイド（ファミ通風の編集記事）
- 日本語で記述
- `##` で大見出し、`###` で小見出しを使う
- テーブル（GFM形式）でスペックや比較情報をまとめる
- 箇条書きで要点を整理
- `**太字**` で重要ワードを強調
- 画像は `![alt](url)` で埋め込み、直後に `<small>※画像は公式より引用</small>` を添える
- 区切り線 `---` でセクションを分割
- 記事末尾にゲーム/製品の概要セクション（公式サイト、対応プラットフォーム、ジャンル、価格）
- 最後に `<small>&copy; ...</small>` で著作権表記

## 画像のリモートパターン（next.config.ts）
新しい画像ホストを使う場合、`next.config.ts` の `images.remotePatterns` に追加が必要。
現在許可済み:
- `static.wikia.nocookie.net`
- `images.unsplash.com`

## 過去にハマったポイント
- **テーブル・太字が表示されない**: `remark-gfm` が必要。素の remark は GFM テーブル記法（パイプテーブル）を処理できない
- **アイキャッチが表示されない**: Next.js の `<Image>` コンポーネントは `next.config.ts` で許可されたドメインの画像しか読み込めない。新しい画像ホストを使う場合は `remotePatterns` に追加すること
- **ArticleCard のサムネイル**: `src/components/ArticleCard.tsx` で `next/image` の `<Image>` を使用。thumbnail が無い記事はSVGのフォールバックアイコンを表示

## Git運用
- メインブランチ: `main`
- リモート: GitHub (`acculief/fps-media`)
- デプロイ: mainにpushするとVercelが自動デプロイ
