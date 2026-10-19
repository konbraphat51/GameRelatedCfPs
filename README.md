# Game-Related CfPs 2027

[日本語版はこちら](README.ja.md)

A static website that lists the **2027 calls for papers (CfPs)** of academic conferences related to games, both in Japan and internationally. The site is published on GitHub Pages: <https://konbraphat51.github.io/GameRelatedCfPs/>

- Covers academic conferences whose **whole scope is games** (e.g. CHI PLAY, FDG, DiGRA, Game Programming Workshop) and conferences that have a **dedicated game track** (e.g. the "Games and Play" subcommittee of CHI). Game _theory_ (economics) and industry events (e.g. CEDEC, GDC) are out of scope.
- Shows every known submission deadline with the remaining days; conferences whose 2027 CfP is not yet published are marked **Unknown**, with a hint from the previous edition.
- Each conference is classified into one or more research **fields** (HCI, AI, game studies, education, …) and can be filtered by field, region (Japan / international), CfP status and game focus.
- UI in English (default) and Japanese.

## Setup (first time)

Requirements: Node.js 22+ and [pnpm](https://pnpm.io/) 10.

```sh
git clone https://github.com/konbraphat51/GameRelatedCfPs.git
cd GameRelatedCfPs
pnpm install
pnpm dev
```

Open the URL printed by Vite (by default <http://localhost:5173/GameRelatedCfPs/>).

## Running again

```sh
pnpm dev
```

## Important CLIs

| Command          | Purpose                                             |
| ---------------- | --------------------------------------------------- |
| `pnpm dev`       | Start the development server with hot reload        |
| `pnpm build`     | Type-check and build the static site into `dist/`   |
| `pnpm preview`   | Serve the production build locally                  |
| `pnpm test`      | Run unit tests, including validation of the dataset |
| `pnpm lint`      | Run ESLint                                          |
| `pnpm typecheck` | Run `vue-tsc` type checking                         |
| `pnpm format`    | Format all files with Prettier                      |

## Deployment

Every push to `main` runs [.github/workflows/DeployPages.yml](.github/workflows/DeployPages.yml), which lints, tests, builds and deploys to GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** once.

## Updating the data

All conference data lives in [src/Data/Conferences.json](src/Data/Conferences.json). See [Docs/DataGuide.md](Docs/DataGuide.md) for the schema, the field taxonomy and the update procedure. Research notes are kept in [ResearchNotes/](ResearchNotes/).

## Documentation

- [Docs/Architecture.md](Docs/Architecture.md) — code structure, class and sequence diagrams
- [Docs/DataGuide.md](Docs/DataGuide.md) — dataset schema and editing rules
