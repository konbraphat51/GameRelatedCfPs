# アーキテクチャ

[English version](Architecture.md)

**Venue (掲載媒体)** は 2027 年に開催される学会の回、またはジャーナル (一般誌のゲーム特集号を含む) のいずれかです。本サイトは Vite でビルドする、クライアントのみで動作する Vue 3 シングルページアプリケーションです。データセットはビルド時に同梱される JSON ファイルのため、バックエンドはなく、`dist/` の出力をそのまま GitHub Pages で配信できます。

## ディレクトリ構成

```
src/
├── Main.ts                 エントリポイント: i18n とグローバル CSS を伴って App をマウント
├── App.vue                 ルート: フィルタ・並び順の状態を保持し、ページを構成
├── I18n.ts                 vue-i18n インスタンス、ロケールの保存、Intl ロケール変換
├── Components/             表示用 SFC (それぞれ単一責務)
├── Services/               純粋な TypeScript ロジック (Vue 非依存)
├── Types/                  ドメイン型 (Venue, Deadline, Field, CfpStatus)
├── Locales/                En.ts (主) と Ja.ts の UI メッセージ
├── Data/Venues.json        データセット
└── Styles/Global.css       デザイントークン (ライト/ダーク) と基本スタイル
Tests/                      Vitest 単体テスト (データセット検証を含む)
.github/workflows/          GitHub Pages デプロイ
```

## レイヤ

- **Types** はデータ契約 (`Venue`, `Deadline`, `Field`, `CfpStatus`) を定義します。
- **Services** はそれらの型に対する純粋関数で、単体テストの対象です。
  - `VenueRepository`: 同梱データセットを読み込みます。
  - `VenueValidator`: 全レコードを検査します (テストから呼ばれるため、不正データは CI で失敗します)。
  - `CfpStatusResolver`: 基準日に対する `open` / `rolling` / `unknown` / `closed` と次の締切を求めます。
  - `VenueFilter`: キーワード・種別・地域・状況・ゲームの扱い・分野で絞り込み、並べ替えます。
  - `DateUtility`: ISO 日付とロケールに応じた書式化を扱います。
- **Components** は props を描画しイベントを emit するだけで、状態の所有者は `App.vue` のみです。

## クラス図

```mermaid
classDiagram
  class VenueDataset {
    lastUpdated: string
    venues: Venue[]
  }
  class Venue {
    id: string
    acronym: string
    nameEn: string
    nameJa: string?
    region: Region
    venueType: VenueType
    gameScope: GameScope
    trackName: string?
    fields: Field[]
    eventStart: string?
    eventEnd: string?
    rollingSubmission: boolean
    cfpPublished: boolean
    deadlines: Deadline[]
    pastPatternEn/Ja: string?
    sources: string[]
  }
  class Deadline {
    label: string
    date: string
    note: string?
  }
  class FilterCriteria {
    keyword: string
    venueTypes: VenueType[]
    regions: Region[]
    statuses: CfpStatus[]
    scopes: GameScope[]
    fields: Field[]
  }
  class CfpStatusResolver {
    resolveCfpStatus(venue, today) CfpStatus
    findNextDeadline(venue, today) Deadline?
  }
  class VenueFilter {
    filterVenues(list, criteria, today) Venue[]
    sortVenues(list, sortKey, today) Venue[]
  }
  VenueDataset "1" o-- "*" Venue
  Venue "1" o-- "*" Deadline
  VenueFilter ..> FilterCriteria
  VenueFilter ..> CfpStatusResolver
```

## コンポーネントツリー

```mermaid
graph TD
  App --> AppHeader --> LocaleSwitcher
  App --> SummaryStats
  App --> FilterPanel --> ChipGroup
  App --> VenueList --> VenueCard
  VenueCard --> StatusBadge
  VenueCard --> DeadlineList
  App --> AppFooter
```

## シーケンス: 一覧の絞り込み

```mermaid
sequenceDiagram
  actor User
  participant FilterPanel
  participant App
  participant VenueFilter
  participant VenueList
  User->>FilterPanel: チップを切替 / キーワードを入力
  FilterPanel->>App: emit update:criteria(newCriteria)
  App->>App: criteria.value = newCriteria
  App->>VenueFilter: filterVenues(dataset, criteria, today)
  VenueFilter-->>App: 一致した Venue
  App->>VenueFilter: sortVenues(matches, sortKey, today)
  VenueFilter-->>App: 並べ替え済みの Venue
  App->>VenueList: props.venues
  VenueList-->>User: カードを再描画
```

## 状況の判定規則

上から順に判定します。

| 条件                                                   | 状況      |
| ------------------------------------------------------ | --------- |
| `cfpPublished` かつ本日以降の締切が1つ以上ある         | `open`    |
| `rollingSubmission` (通年で投稿を受け付けるジャーナル) | `rolling` |
| `cfpPublished` が false、または締切がない              | `unknown` |
| すべての締切が本日より前                               | `closed`  |

「次の締切」で並べ替えると、`open` を締切日順に並べ、その後に `rolling`・`closed`・`unknown` が続きます。

「本日」は閲覧者のローカル日付のため、サイトを再ビルドしなくても状況が更新されます。

## 多言語化

既定は英語で、日本語を選ぶと `localStorage` に記憶されます。日本語 UI では日本語名 (`nameJa`) があればそれを表示します。備考と前回実績は、片方の言語が欠けている場合はもう一方にフォールバックします。
