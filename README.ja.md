# Game-Related CfPs 2027

[English version](README.md)

ゲームに関連する国内外の学術会議について、**2027年開催回の論文募集 (CfP)** を一覧できる静的 Web サイトです。GitHub Pages で公開しています: <https://konbraphat51.github.io/GameRelatedCfPs/>

- **学会全体がゲームを主題とするもの** (例: CHI PLAY, FDG, DiGRA, ゲームプログラミングワークショップ) と、**ゲームを扱うトラックを持つもの** (例: CHI の "Games and Play" サブコミッティ) を対象とします。ゲーム _理論_ (経済学) と産業系イベント (例: CEDEC, GDC) は対象外です。
- 判明しているすべての投稿締切と残り日数を表示します。2027年の募集が未公開の学会は **Unknown** と表示し、前回開催時の実績をヒントとして併記します。
- 各学会を1つ以上の研究**分野** (HCI, AI, ゲーム研究, 教育 など) に分類し、分野・地域 (国内/国際)・CfP 状況・ゲームの扱いで絞り込めます。
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

| コマンド         | 用途                                         |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | ホットリロード付き開発サーバを起動           |
| `pnpm build`     | 型チェック後、静的サイトを `dist/` にビルド  |
| `pnpm preview`   | 本番ビルドをローカルで配信                   |
| `pnpm test`      | 単体テスト (データセットの検証を含む) を実行 |
| `pnpm lint`      | ESLint を実行                                |
| `pnpm typecheck` | `vue-tsc` による型チェック                   |
| `pnpm format`    | Prettier で整形                              |

## デプロイ

`main` への push のたびに [.github/workflows/DeployPages.yml](.github/workflows/DeployPages.yml) が lint・テスト・ビルドを行い、GitHub Pages にデプロイします。初回のみリポジトリ設定で **Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。

## データの更新

学会データはすべて [src/Data/Conferences.json](src/Data/Conferences.json) にあります。スキーマ・分野分類・更新手順は [Docs/DataGuide.ja.md](Docs/DataGuide.ja.md) を参照してください。調査メモは [ResearchNotes/](ResearchNotes/) にあります。

## ドキュメント

- [Docs/Architecture.ja.md](Docs/Architecture.ja.md) — コード構成、クラス図・シーケンス図
- [Docs/DataGuide.ja.md](Docs/DataGuide.ja.md) — データスキーマと編集ルール
