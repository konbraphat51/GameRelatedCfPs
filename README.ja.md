# Game-Related CfPs 2027

[English version](README.md)

ゲームに関連する国内外の学術会議とジャーナルについて、**2027年の論文募集 (CfP)** を一覧できる静的 Web サイトです。GitHub Pages で公開しています: <https://konbraphat51.github.io/GameRelatedCfPs/>

- **学会全体がゲームを主題とするもの** (例: CHI PLAY, FDG, DiGRA, ゲームプログラミングワークショップ) と、**ゲームを扱うトラックを持つもの** (例: ICA のゲーム研究部会) を対象とします。ジャーナルも同様に、ゲーム専門誌 (例: IEEE Transactions on Games, Game Studies) と一般誌のゲーム関連特集号を対象とします。ゲーム _理論_ (経済学) と産業系イベント (例: CEDEC, GDC) は対象外です。
- 判明しているすべての投稿締切と残り日数を表示します。2027年の募集が未公開のものは **Unknown** と表示して前回の実績を併記し、通年で投稿を受け付けるジャーナルは **随時募集** と表示します。
- 各学会・ジャーナルを1つ以上の研究**分野** (HCI, AI, ゲーム研究, 教育 など) に分類し、種別 (学会/ジャーナル)・分野・地域 (国内/国際)・CfP 状況・ゲームの扱いで絞り込めます。
- ★ ボタンで学会・ジャーナルを**お気に入り**に登録できます。お気に入りはブラウザのクッキーに保存され、「お気に入りのみ」フィルタで絞り込めます。
- UI は英語 (既定) と日本語に対応しています。

## セットアップ (初回)

必要環境: Node.js 22 以上, [pnpm](https://pnpm.io/) 10

```sh
git clone https://github.com/konbraphat51/GameRelatedCfPs.git
cd GameRelatedCfPs
pnpm install
pnpm dev
```

Vite が表示する URL (既定では <http://localhost:5173/GameRelatedCfPs/>) を開きます。

## 2回目以降の起動

```sh
pnpm dev
```

## 主要コマンド

| コマンド          | 用途                                            |
| ----------------- | ----------------------------------------------- |
| `pnpm dev`        | ホットリロード付き開発サーバを起動              |
| `pnpm build`      | 型チェック後、静的サイトを `dist/` にビルド     |
| `pnpm preview`    | 本番ビルドをローカルで配信                      |
| `pnpm test`       | 単体テスト (データセットの検証を含む) を実行    |
| `pnpm lint`       | ESLint を実行                                   |
| `pnpm typecheck`  | `vue-tsc` による型チェック                      |
| `pnpm format`     | Prettier で整形                                 |
| `pnpm issue-body` | 本日時点の情報更新 Issue のチェックリストを出力 |

## デプロイ

`main` への push のたびに [.github/workflows/DeployPages.yml](.github/workflows/DeployPages.yml) が lint・テスト・ビルドを行い、GitHub Pages にデプロイします。初回のみリポジトリ設定で **Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。

## 2か月ごとの更新リマインダ

[.github/workflows/DataUpdateIssue.yml](.github/workflows/DataUpdateIssue.yml) が奇数月 (1・3・5・7・9・11月) の1日 00:00 UTC に「Data update: YYYY-MM」Issue を作成します。@konbraphat51 を assignee に設定しメンションするため GitHub から通知が届きます。本文には再確認すべき項目 (Unknown、締切間近、締切済、ジャーナル) がチェックリストで並びます。Actions タブの **Run workflow** から手動実行もできます。公開リポジトリでは 60 日間コミットがないと GitHub がスケジュール実行を停止しますが、各 Issue に従ってデータ更新をコミットすれば継続します。停止した場合は Actions タブから再有効化できます。

## データの更新

データはすべて [src/Data/Venues.json](src/Data/Venues.json) にあります。スキーマ・分野分類・更新手順は [Docs/DataGuide.ja.md](Docs/DataGuide.ja.md) を参照してください。調査メモは [ResearchNotes/](ResearchNotes/) にあります。

## ドキュメント

- [Docs/Architecture.ja.md](Docs/Architecture.ja.md) — コード構成、クラス図・シーケンス図
- [Docs/DataGuide.ja.md](Docs/DataGuide.ja.md) — データスキーマと編集ルール
