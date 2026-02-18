# ゼンゼロ通信 - プロジェクトナレッジ

## プロジェクト概要
- **サイト名**: ゼンゼロ通信
- **コンセプト**: ゼンレスゾーンゼロ（ZZZ）特化の非公式ニュースメディア。公式情報＋海外速報＋オリジナル編集記事で差別化
- **競合**: 「ゼンレスゾーンゼロ速報まとめ」（zzzsoku.com）は5chまとめ系。当サイトはオリジナル編集記事で差別化
- **URL**: https://zenzeronews.vercel.app (旧: fps-media.vercel.app)
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
| overseas | 海外速報 | 海外コミュニティ発の速報、公式先行情報 |
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
- 海外速報には「※海外コミュニティ発の情報であり、公式発表とは異なる場合があります」の注意書き
- **リーク・データマイン情報は掲載しない**（HoYoverse権利保護のため）

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
- **舞台**: 新エリー都（New Eridu）
- **主要ファクション**: 邪兎屋、ヴィクトリア家政、白祇重工、カリュドーンの子、対ホロウ六課、妄想エンジェル、新エリー都治安局 など

## Git運用
- メインブランチ: `main`
- リモート: GitHub (`acculief/fps-media`)
- デプロイ: mainにpushするとVercelが自動デプロイ

---

## 自走改善マンデート

Claudeは**プロのPdM/マーケター/エンジニア**として、毎セッションでサイトの改善を自走して行う。ユーザーが明確なタスク指示をしなくても、以下のバックログから優先度順に着手してよい。

### 判断基準（優先度）
1. **SEO・流入** — 検索からの発見性を高める施策を最優先
2. **UX・回遊性** — 直帰率低下、PV/セッション向上
3. **コンテンツ品質** — 記事の抜け漏れ修正、著作権表記の統一
4. **技術的健全性** — ビルド警告の解消、パフォーマンス改善
5. **新機能** — ユーザー価値が明確なもののみ

### 自走してよいこと（承認不要）
- 記事のフロントマター・著作権表記の修正
- SEOメタデータの改善（canonical、OGP画像など）
- コンポーネントのUI改善・レスポンシブ対応
- CSSスタイルの改善
- ビルドエラー・警告の修正
- 新しいページ・コンポーネントの追加（サイト体験向上のため）
- 記事コンテンツの新規追加・既存記事の更新

### 確認が必要なこと（承認必要）
- 外部パッケージの追加（npm install）
- next.config.ts の破壊的変更
- デプロイ（git push）
- 外部サービスとの連携（Analytics ID設定など）
- サイト名・ドメイン・ブランディングの変更

### 改善バックログ（優先度順）
未着手のものから順に取り組む。完了したら `[x]` に更新する。

- [x] 関連記事セクション（記事詳細ページ下部）
- [x] 読了時間の表示
- [x] SNSシェアボタン（X/Twitter, リンクコピー）
- [x] ホームページ改善（ヒーロー記事＋カテゴリ別セクション）
- [x] 記事ページにパンくずリスト（構造化データ付き）
- [x] 全記事の著作権表記の統一チェック・修正（全21記事確認済み）
- [x] OGP画像の設定（記事thumbnailをog:image/twitter:imageに設定）
- [x] 記事一覧ページのページネーション（12件/ページ）
- [x] 404ページのカスタムデザイン
- [x] タグ一覧ページ（/tags, /tags/[tag]）＋記事タグのリンク化＋sitemap追加
- [x] RSS/Atomフィード生成（/feed.xml）＋autodiscoveryリンク
- [x] ヘッダーにモバイルメニュー（ハンバーガー）追加
- [x] フッターの充実（カテゴリリンク、タグ一覧、RSS、著作権表記）
- [x] `turbopack.root`警告を解消（next.config.tsに絶対パス設定）
- [x] 記事の目次（Table of Contents）自動生成（3見出し以上で表示）
- [x] canonical URL を全ページに設定
- [x] 画像のlazy loading注入（rehypeカスタムプラグイン）
- [x] Article schema.org に author/keywords 追加
- [x] モバイルメニューのリンククリック時に閉じる修正
- [x] シェアボタン・ページネーションにaria-label追加
- [x] カテゴリフィルターのモバイルUX改善（横スクロール、選択状態の背景色）
- [x] キーボードナビゲーション用focus-visible表示
- [x] captionテキスト(small)のコントラスト改善
- [x] 見出しのscroll-margin-top追加（目次クリック時のヘッダー重なり防止）
- [x] スムーズスクロール追加
- [x] テーブルのモバイル横スクロール対応（rehypeプラグインでdivラッパー注入）
- [x] 記事の「前の記事」「次の記事」ナビゲーション
- [x] 「海外速報」カテゴリの記事作成（DL数まとめ、海外Tier議論）
- [x] サイト内検索（/search、クライアントサイドリアルタイム検索、ハイライト付き）
- [x] ArticleCardに「NEW」バッジ（7日以内の記事に表示）
- [x] 人気記事ランキング（PV連動は不可のため、タグ・カテゴリベースで代替）
- [x] 記事のOGP画像自動生成（Vercel OG Image Generation → next/og ImageResponse）
- [x] PWA対応（manifest.json, dynamic icon/apple-icon, appleWebApp meta）
- [ ] ダークモード/ライトモード切替
- [x] 記事詳細ページにサムネイルヒーロー画像表示
- [x] 前後記事ナビゲーションのカードUI改善（矢印アイコン付き）
- [x] OGP画像の日本語フォント対応（Google Fonts APIで文字サブセット取得）
- [x] ArticleCardに読了時間表示（メタデータから計算）
- [x] 注目記事にサムネイル画像を表示
- [x] 記事h2見出しにアクセントカラー左ボーダー
- [x] 全画像をローカル保存（download-images.mjs、外部CDN依存の排除）
- [x] 画像URL検証スクリプト（check-images.mjs）
- [x] ホームページに統計バー（記事数・カテゴリ数・タグ数）
- [x] タグクラウド（タグ件数に応じたフォントサイズ変動）
- [x] 検索のURL同期（?q=パラメータ対応、シェア可能）
- [x] 検索のESCキー・クリアボタン対応
- [x] ScrollToTopボタン
- [x] WebSite schema.org + SearchAction構造化データ
- [x] サイトマップにカテゴリページURL追加
- [x] コードブロック・インラインコードのスタイリング
- [x] 未使用パッケージ（remark-html）の削除
