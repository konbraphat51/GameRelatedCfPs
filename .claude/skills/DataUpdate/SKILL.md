---
name: data-update
description: Bimonthly CfP data refresh for this repository — re-check Unknown/changed venues and discover unlisted game-related conferences, journals and special issues at minimal token cost. Use when handling a "Data update: YYYY-MM" issue or when asked to update/refresh Venues.json or look for new CfPs.
---

# Data update (cost-optimised)

## Cost rules — follow strictly

- **Never Read `src/Data/Venues.json`** (~60k tokens) or the `ResearchNotes/` files. Use the CLIs instead:
  - `pnpm --silent data:known` — one line per venue + the excluded list (~7k tokens; only the scout needs it).
  - `pnpm --silent data:show <id>...` — full records for given ids only.
  - `pnpm --silent data:patch <patch.json>...` — validated writes (see "Patch format").
  - `pnpm --silent data:check` — LLM-free page-change detection; `--accept` records reviewed pages.
  - `pnpm --silent data:peek <url>...` — deadline-related lines of a page with context, Japanese charsets decoded (far cheaper than WebFetch).
- **Only research what `data:check` flags.** Pages whose CfP-relevant text is unchanged are skipped (each page is still force-reviewed every 180 days as "stale").
- **Delegate web research** to the `cfp-checker` and `cfp-scout` subagents (Sonnet). In the main context use no WebFetch/WebSearch; a single `data:peek` to settle a `needs-human` row is fine. Subagents validate their patch with `data:patch --dry-run` and reply with one line per venue; do not ask them for more.
- **Few, full agents.** Each agent carries ~15–20k tokens of fixed overhead, so prefer fewer, larger batches.
- If the `cfp-checker`/`cfp-scout` agent types are not available (the session started before they were added), use `general-purpose` with `model: sonnet` and begin the prompt with: `Read .claude/agents/CfpChecker.md (or CfpScout.md) and follow it exactly; ignore its frontmatter.`
- Run pnpm commands with the **Bash** tool (the README lists a permission allowlist that avoids prompts). Redirect long output to a scratchpad file and read only what you need.

## Procedure

1. `git pull`, then `pnpm --silent data:check > <scratch>/Check.txt` and read that file (a short TSV: `status change id detail url`).
2. Triage the rows. Review `unknown` and `closed` rows of every change kind, and `open` and `rolling` rows only when the change is `changed`, `new` or `stale`. Skip `open`/`rolling` rows that are `thin`/`error`: they are mostly publishers blocking bots (HTTP 403) or script-rendered pages, and new special issues there are covered by the scout's publisher searches.
3. Split the review ids into batches of **at most 15** (one batch when ≤ 15) and start one `cfp-checker` per batch **in the same message** (≤ 3 in parallel), each with:
   `Today is YYYY-MM-DD. Check: id1 id2 ... Write the patch to <scratch>/Patch-N.json.`
4. In the same message, start one `cfp-scout`:
   `Today is YYYY-MM-DD. Write the patch to <scratch>/Discovery.json.`
5. When all agents have replied, write `<scratch>/Date.json` = `{ "lastUpdated": "YYYY-MM-DD" }` and run
   `pnpm --silent data:patch <scratch>/Patch-*.json <scratch>/Discovery.json <scratch>/Date.json`.
   If it is rejected, fix only the reported records (edit the patch file) and re-run; nothing is written on rejection.
   Before applying, glance at new records from the scout (`node -e` one-line summary of id/acronym/deadlines, not the whole file) for scope and duplicates. For `needs-human` rows, one `data:peek` of the reported URL often settles it; otherwise leave them for the report.
6. `pnpm --silent data:check --accept <ids>` with every id reported `unchanged` or `updated`, plus the ids the scout added (run `pnpm --silent data:check <added ids>` first so they have pending snapshots). Do not accept `needs-human` ids, so they are flagged again next time.
7. `pnpm test`, then commit data, snapshots and excluded list together:
   `feat(data): bimonthly data update YYYY-MM` with `Closes #<issue>` when there is an issue. Push only if the user asks.
8. Report to the user in Japanese: counts reviewed / updated / added / excluded, newly published CfPs with their deadlines, and anything marked `needs-human` or `unverified`, plus the subagent token usage.

A research note in `ResearchNotes/` is not needed for routine updates; record exclusions through the patch `exclude` list instead.

## Patch format

```json
{
  "lastUpdated": "2027-01-01",
  "upsert": [{ "id": "existing-id", "cfpPublished": true, "deadlines": [...], "sources": ["https://..."] }],
  "remove": ["cancelled-edition-id"],
  "exclude": [{ "name": "Series", "venueType": "conference", "reason": "...", "recheck": false }]
}
```

- Existing ids: only the given keys are replaced; `sources` are unioned.
- New ids: every key of the record schema in `Docs/DataGuide.md` is required.
- The whole dataset is validated (`VenueValidator`) before anything is written.
