# Data Guide

[日本語版](DataGuide.ja.md)

All conference data lives in [src/Data/Conferences.json](../src/Data/Conferences.json). `pnpm test` validates it, and CI refuses to deploy invalid data.

## Inclusion criteria

A conference is listed when **all** of the following hold:

1. It is an **academic** conference, symposium or society meeting (peer-reviewed or presentation-based). Industry events such as CEDEC, GDC or BitSummit are excluded.
2. Either the **whole conference is about games** (`gameScope: "whole"`), or it has an **explicit game track**, subcommittee, division or area (`gameScope: "track"`, with `trackName`).
3. "Games" means digital/analog games, play, gamification, esports, serious games, game AI, gaming simulation, etc. **Game theory** in the economic/mathematical sense is excluded.
4. Its edition is **held in calendar year 2027**. Series with no 2027 edition (e.g. biennial ones) are omitted.

Standalone workshops are listed only when they are significant on their own and their 2027 call is published.

## Record schema

| Key                               | Type                          | Notes                                                           |
| --------------------------------- | ----------------------------- | --------------------------------------------------------------- |
| `id`                              | string                        | Unique kebab-case ASCII, e.g. `chi-play-2027`                   |
| `acronym`                         | string                        | Display title, e.g. `CHI PLAY 2027`                             |
| `nameEn` / `nameJa`               | string / string \| null       | Full names; `nameJa` only when an official Japanese name exists |
| `organizer`                       | string                        | Organising society, in English                                  |
| `region`                          | `domestic` \| `international` | `domestic` = organised in Japan by a Japanese society           |
| `gameScope`                       | `whole` \| `track`            | See inclusion criteria                                          |
| `trackName`                       | string \| null                | Required when `gameScope` is `track`                            |
| `fields`                          | Field[]                       | One or more research fields (see below)                         |
| `url` / `cfpUrl`                  | string / string \| null       | Official site (2027 page if available) and CfP page             |
| `eventStart` / `eventEnd`         | ISO date \| null              | Only when officially announced                                  |
| `eventDateText`                   | string \| null                | Partial information such as "Autumn 2027"                       |
| `location`                        | string \| null                | "City, Country" in English                                      |
| `cfpPublished`                    | boolean                       | `false` → shown as **Unknown**                                  |
| `deadlines`                       | `{label, date, note}[]`       | Required (non-empty) when `cfpPublished` is true; `date` is ISO |
| `pastPatternEn` / `pastPatternJa` | string \| null                | Hint from the previous edition while the CfP is unpublished     |
| `notesEn` / `notesJa`             | string \| null                | Short remarks                                                   |
| `sources`                         | string[]                      | At least one URL the information was verified from              |

`lastUpdated` at the root records the date of the latest research pass.

## Field taxonomy

Fields describe the research communities a conference serves. Interdisciplinary conferences get **several** fields; assign every field that a substantial share of the programme belongs to, not every topic mentioned once in the CfP.

| Field               | Meaning                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| `hci`               | Human–computer interaction, player experience, user research              |
| `ai`                | Game AI, computational intelligence, game-playing programs, PCG           |
| `graphics`          | Computer graphics, animation, real-time rendering, VR/AR                  |
| `engineering`       | Game engineering, software/technology for game development                |
| `game-studies`      | Humanities-oriented game studies: culture, history, philosophy, media     |
| `social-science`    | Sociology, communication, psychology, economics of play (not game theory) |
| `education`         | Game-based learning, educational games, teaching with games               |
| `serious-games`     | Games with purposes beyond entertainment                                  |
| `gamification`      | Gamification and game elements in non-game contexts                       |
| `health`            | Games for health, medicine, well-being, rehabilitation                    |
| `narrative`         | Interactive narrative and digital storytelling                            |
| `design-art`        | Game design practice, art, aesthetics, creative works                     |
| `music-audio`       | Game music, sound and audio                                               |
| `esports`           | Esports and competitive gaming                                            |
| `simulation-gaming` | Simulation & gaming / gaming simulation for policy and organisations      |
| `analog`            | Board games, traditional games, play history                              |

## Update procedure

1. Re-check each conference's official site; prefer the 2027 page and the CfP page.
2. When a CfP appears, set `cfpPublished: true`, fill `deadlines`, `cfpUrl` and event dates, and clear the `pastPattern*` hints.
3. Add the page you verified to `sources`.
4. Update `lastUpdated`.
5. Run `pnpm test` and `pnpm build`, then commit.
