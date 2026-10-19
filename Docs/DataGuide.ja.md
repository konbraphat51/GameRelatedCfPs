# データガイド

[English version](DataGuide.md)

学会・ジャーナルのデータはすべて [src/Data/Venues.json](../src/Data/Venues.json) の `venues` キーにあります。`pnpm test` で検証され、不正なデータは CI でデプロイされません。

## 掲載基準 — 学会

以下を**すべて**満たす学会を掲載します。

1. **学術的な**会議・シンポジウム・学会大会・研究会であること (査読または発表形式)。CEDEC・GDC・BitSummit などの産業系イベントは対象外です。
2. **学会全体がゲームを主題とする** (`gameScope: "whole"`) か、**ゲームを扱う明示的なトラック**・サブコミッティ・部会・エリアを持つ (`gameScope: "track"`、`trackName` 必須) こと。
3. 「ゲーム」はデジタル/アナログゲーム、遊び、ゲーミフィケーション、eスポーツ、シリアスゲーム、ゲーム AI、ゲーミングシミュレーション等を指します。経済学・数学の意味での**ゲーム理論**は対象外です。
4. **2027年 (暦年) に開催される回**であること。2027年に開催回がないシリーズ (隔年開催など) は掲載しません。

単独のワークショップは、それ自体の重要度が高く、かつ 2027 年の募集が公開済みの場合のみ掲載します。

## 掲載基準 — ジャーナル

1. 正当で現在も刊行中の、査読付き**学術誌**であること (ハゲタカ誌・休刊誌は対象外)。
2. **誌全体がゲームを主題とする** (`gameScope: "whole"`) か、一般誌の**ゲーム関連特集号** (`gameScope: "track"`、`trackName` に特集名、特集ごとに1レコード) であること。
3. 特集号の締切は、調査日から 2027 年末までのものを記録します。
4. 通年で通常投稿を受け付ける場合は `rollingSubmission: true` とし、締切の近い特集号がない限り **随時募集 (Rolling)** と表示します。定期的な募集でのみ投稿を受け付けるジャーナルは、次回の募集が公開されるまで `rollingSubmission: false`・`cfpPublished: false` とします。
5. ジャーナルには開催日・開催地はありません (`eventStart`・`eventEnd`・`eventDateText`・`location` は null)。`id` に年は付けません。

## レコードのスキーマ

| キー                              | 型                            | 備考                                                    |
| --------------------------------- | ----------------------------- | ------------------------------------------------------- |
| `id`                              | string                        | 一意な kebab-case の ASCII (例: `chi-play-2027`)        |
| `acronym`                         | string                        | 表示タイトル (例: `CHI PLAY 2027`)                      |
| `nameEn` / `nameJa`               | string / string \| null       | 正式名称。`nameJa` は公式の日本語名がある場合のみ       |
| `organizer`                       | string                        | 主催団体 (ジャーナルは出版社)。英語表記                 |
| `region`                          | `domestic` \| `international` | `domestic` = 日本の学会が国内で開催・発行するもの       |
| `venueType`                       | `conference` \| `journal`     | 種別                                                    |
| `gameScope`                       | `whole` \| `track`            | 掲載基準を参照                                          |
| `trackName`                       | string \| null                | ゲームトラック名または特集名。`track` のとき必須        |
| `fields`                          | Field[]                       | 1つ以上の研究分野 (下記)                                |
| `url` / `cfpUrl`                  | string / string \| null       | 公式サイト (可能なら 2027 年版) と募集ページ            |
| `eventStart` / `eventEnd`         | ISO 日付 \| null              | 公式発表がある場合のみ                                  |
| `eventDateText`                   | string \| null                | 「2027年秋」など部分的な情報                            |
| `location`                        | string \| null                | 英語で「City, Country」                                 |
| `rollingSubmission`               | boolean                       | ジャーナルのみ: 通年で通常投稿を受付                    |
| `cfpPublished`                    | boolean                       | `false` の場合 **Unknown** と表示                       |
| `deadlines`                       | `{label, date, note}[]`       | `cfpPublished` なら必須 (随時募集を除く)。`date` は ISO |
| `pastPatternEn` / `pastPatternJa` | string \| null                | 募集未公開の間に表示する前回実績                        |
| `notesEn` / `notesJa`             | string \| null                | 短い備考                                                |
| `sources`                         | string[]                      | 情報を確認した URL (1つ以上)                            |

ルートの `lastUpdated` には最新の調査日を記録します。

## 分野の分類

分野は、その学会・ジャーナルがどの研究コミュニティを対象にしているかを表します。分野横断的なものには**複数**の分野を付けます。CfP に一度だけ登場するトピックではなく、プログラムの相当部分を占める分野をすべて付与してください。

| 分野                | 意味                                                       |
| ------------------- | ---------------------------------------------------------- |
| `hci`               | HCI、プレイヤー体験、ユーザリサーチ                        |
| `ai`                | ゲーム AI、計算知能、ゲームプレイングプログラム、PCG       |
| `graphics`          | CG、アニメーション、リアルタイムレンダリング、VR/AR        |
| `engineering`       | ゲーム工学、ゲーム開発のためのソフトウェア・技術           |
| `game-studies`      | 人文学的ゲーム研究: 文化・歴史・哲学・メディア             |
| `social-science`    | 社会学、コミュニケーション、心理学など (ゲーム理論は除く)  |
| `education`         | ゲームベース学習、教育用ゲーム、ゲームを用いた教育         |
| `serious-games`     | 娯楽以外の目的を持つゲーム                                 |
| `gamification`      | ゲーミフィケーション、非ゲーム文脈でのゲーム要素           |
| `health`            | 健康・医療・ウェルビーイング・リハビリのためのゲーム       |
| `narrative`         | インタラクティブ・ナラティブ、デジタルストーリーテリング   |
| `design-art`        | ゲームデザインの実践、芸術、美学、作品                     |
| `music-audio`       | ゲーム音楽・サウンド                                       |
| `esports`           | eスポーツ、競技ゲーム                                      |
| `simulation-gaming` | シミュレーション&ゲーミング (政策・組織のためのゲーミング) |
| `analog`            | ボードゲーム、伝統的な遊び、遊戯史                         |

## 更新手順

1. 各学会の公式サイトを再確認します (2027年版ページと募集ページを優先)。
2. CfP が公開されたら `cfpPublished: true` にし、`deadlines`・`cfpUrl`・開催日を記入し、`pastPattern*` を null にします。
3. 確認したページを `sources` に追加します。
4. `lastUpdated` を更新します。
5. `pnpm test` と `pnpm build` を実行してからコミットします。
