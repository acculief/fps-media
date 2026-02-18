# ゼンゼロ通信 - プロジェクトナレッジ

## プロジェクト概要
- **サイト名**: ゼンゼロ通信
- **コンセプト**: ゼンレスゾーンゼロ（ZZZ）特化の非公式ニュースメディア。公式情報＋海外リーク＋オリジナル編集記事で差別化
- **競合**: 「ゼンレスゾーンゼロ速報まとめ」（zzzsoku.com）は5chまとめ系。当サイトはオリジナル編集記事で差別化
- **URL**: https://zenzeronews.vercel.app
- **技術スタック**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **デプロイ先**: Vercel
- **フォント**: Noto Sans JP
- **テーマ**: ダーク（背景 #030712、アクセント yellow #FACC15）

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
- ファイル名は `zzz-` プレフィックスで統一
- Markdownの処理パイプライン: `remark` → `remark-gfm` → `remark-rehype` → `rehype-raw` → `rehype-stringify`

### 記事のフロントマター（必須）
```yaml
---
title: "記事タイトル"
description: "SEO用の説明文"
category: "news"           # news | leak | character | guide | event
tags: ["タグ1", "タグ2"]
date: "2026-02-18"
thumbnail: "https://..."   # 任意。画像URL
---
```

### カテゴリ一覧
| slug | label | 用途 |
|---|---|---|
| news | ニュース | 公式発表、アプデ、パッチノート |
| leak | リーク・海外情報 | 海外リーク、データマイン、先行情報 |
| character | キャラクター | キャラ評価、ビルド、凸情報 |
| guide | 攻略 | 式輿防衛戦、零号ホロウ等の攻略 |
| event | イベント | イベント攻略、報酬まとめ |

## 記事のスタイルガイド
- 日本語で記述
- `##` で大見出し、`###` で小見出しを使う
- テーブル（GFM形式）でスペックや比較情報をまとめる
- 箇条書きで要点を整理
- `**太字**` で重要ワードを強調
- 画像は `![alt](url)` で埋め込み、直後に `<small>※画像は公式より引用</small>` を添える
- 区切り線 `---` でセクションを分割
- 記事末尾に `<small>&copy; COGNOSPHERE PTE. LTD. 当サイトはゲームの非公式ファンサイトです。</small>` の著作権表記
- リーク情報には必ず「※リーク・噂に基づく情報です」の注意書き

## 画像のリモートパターン（next.config.ts）
新しい画像ホストを使う場合、`next.config.ts` の `images.remotePatterns` に追加が必要。
現在許可済み:
- `static.wikia.nocookie.net` (Fandom Wiki)
- `images.unsplash.com` (Unsplash)
- `fastcdn.hoyoverse.com` (HoYoverse公式CDN)
- `act-webstatic.hoyoverse.com` (HoYoverseイベント)
- `upload-os-bbs.hoyoverse.com` (HoYoLAB)

## 過去にハマったポイント
- **テーブル・太字が表示されない**: `remark-gfm` が必要。素の remark は GFM テーブル記法を処理できない
- **アイキャッチが表示されない**: Next.js の `<Image>` コンポーネントは `next.config.ts` で許可されたドメインの画像しか読み込めない。新しい画像ホストを使う場合は `remotePatterns` に追加すること
- **ArticleCard のサムネイル**: `src/components/ArticleCard.tsx` で `next/image` の `<Image>` を使用。thumbnail が無い記事はSVGのフォールバックアイコン（TVモニターモチーフ）を表示

## ゼンゼロの基本情報（記事作成用）
- **正式名称**: ゼンレスゾーンゼロ / Zenless Zone Zero
- **略称**: ゼンゼロ / ZZZ
- **開発**: HoYoverse (COGNOSPHERE PTE. LTD.)
- **ジャンル**: アクションRPG
- **対応**: PC / PS5 / iOS / Android
- **価格**: 基本プレイ無料
- **現行バージョン**: Ver.2.6（2026年2月時点）
- **舞台**: 新エリドゥ（New Eridu）
- **主要ファクション**: カニンガムヘアーズ、ヴィクトリアハウスキーピング、ベロブルグ重工、カリュドンの息子たち、ホロウ特殊作戦第六課、妄想エンジェル、都市治安局 など

## Git運用
- メインブランチ: `main`
- リモート: GitHub (`acculief/fps-media`)
- デプロイ: mainにpushするとVercelが自動デプロイ
