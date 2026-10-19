# Architecture

[日本語版](Architecture.ja.md)

The site is a client-only Vue 3 single-page application built with Vite. The dataset is a JSON file bundled at build time, so there is no backend and the output in `dist/` can be hosted on GitHub Pages as-is.

## Directory layout

```
src/
├── Main.ts                 Entry point: mounts App with i18n and global CSS
├── App.vue                 Root: owns filter/sort state, composes the page
├── I18n.ts                 vue-i18n instance, locale persistence, Intl locale mapping
├── Components/             Presentational SFCs (one responsibility each)
├── Services/               Pure TypeScript logic (no Vue dependency)
├── Types/                  Domain types (Conference, Deadline, Field, CfpStatus)
├── Locales/                En.ts (primary) and Ja.ts UI messages
├── Data/Conferences.json   The dataset
└── Styles/Global.css       Design tokens (light/dark) and base styles
Tests/                      Vitest unit tests, including dataset validation
.github/workflows/          GitHub Pages deployment
```

## Layers

- **Types** define the data contract (`Conference`, `Deadline`, `Field`, `CfpStatus`).
- **Services** are pure functions over those types and are unit tested:
  - `ConferenceRepository` loads the bundled dataset.
  - `ConferenceValidator` checks every record (used by tests, so bad data fails CI).
  - `CfpStatusResolver` derives `open` / `closed` / `unknown` and the next deadline for a reference date.
  - `ConferenceFilter` filters by keyword, region, status, game scope and fields, and sorts.
  - `DateUtility` handles ISO dates and locale-aware formatting.
- **Components** only render props and emit events; `App.vue` is the single owner of state.

## Class diagram

```mermaid
classDiagram
  class ConferenceDataset {
    lastUpdated: string
    conferences: Conference[]
  }
  class Conference {
    id: string
    acronym: string
    nameEn: string
    nameJa: string?
    region: Region
    gameScope: GameScope
    trackName: string?
    fields: Field[]
    eventStart: string?
    eventEnd: string?
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
    regions: Region[]
    statuses: CfpStatus[]
    scopes: GameScope[]
    fields: Field[]
  }
  class CfpStatusResolver {
    resolveCfpStatus(conference, today) CfpStatus
    findNextDeadline(conference, today) Deadline?
  }
  class ConferenceFilter {
    filterConferences(list, criteria, today) Conference[]
    sortConferences(list, sortKey, today) Conference[]
  }
  ConferenceDataset "1" o-- "*" Conference
  Conference "1" o-- "*" Deadline
  ConferenceFilter ..> FilterCriteria
  ConferenceFilter ..> CfpStatusResolver
```

## Component tree

```mermaid
graph TD
  App --> AppHeader --> LocaleSwitcher
  App --> SummaryStats
  App --> FilterPanel --> ChipGroup
  App --> ConferenceList --> ConferenceCard
  ConferenceCard --> StatusBadge
  ConferenceCard --> DeadlineList
  App --> AppFooter
```

## Sequence: filtering the list

```mermaid
sequenceDiagram
  actor User
  participant FilterPanel
  participant App
  participant ConferenceFilter
  participant ConferenceList
  User->>FilterPanel: toggle a chip / type a keyword
  FilterPanel->>App: emit update:criteria(newCriteria)
  App->>App: criteria.value = newCriteria
  App->>ConferenceFilter: filterConferences(dataset, criteria, today)
  ConferenceFilter-->>App: matching conferences
  App->>ConferenceFilter: sortConferences(matches, sortKey, today)
  ConferenceFilter-->>App: ordered conferences
  App->>ConferenceList: props.conferences
  ConferenceList-->>User: re-rendered cards
```

## Status rules

| Condition                               | Status    |
| --------------------------------------- | --------- |
| `cfpPublished` is false or no deadlines | `unknown` |
| at least one deadline is on/after today | `open`    |
| every deadline is before today          | `closed`  |

"Today" is the viewer's local date, so statuses update without rebuilding the site.

## Localization

English is the default locale; Japanese is selectable and remembered in `localStorage`. Conference names use `nameJa` when the Japanese UI is active and a Japanese name exists. Notes and past-edition hints fall back to the other language when one is missing.
