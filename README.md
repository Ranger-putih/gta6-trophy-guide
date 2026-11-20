# GTA VI Trophy Guide — All 55 Trophies, Roadmap & Tracker

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun)
[![Bounty: gta6-trophy-guide-01](https://img.shields.io/badge/bounty-gta6--trophy--guide--01-orange)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Play on make.fun](https://img.shields.io/badge/play-make.fun-green)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for the **55 official Grand Theft Auto VI trophies** on PlayStation 5
(1 platinum, 2 gold, 6 silver, 46 bronze), built for the
[make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **All 55 trophies** with their official name, description and grade, each with a guide
  written in our own words (2–4 sentences: what to do, where, how, and whether it can be missed),
  plus its sources cited beside it.
- **Roadmap to the platinum** in five phases: story → stranger missions → activities & challenges →
  collectibles → cleanup and 100% completion.
- **Missable warnings**: 3 trophies are flagged MISSABLE and listed up front; the rest are
  repeatable and safe to clean up after the story.
- **Tracker**: tick trophies off, progress is saved in the browser (localStorage) with a progress
  bar and per-grade counts; export progress as JSON and import it back.
- **Filters**: by grade, by kind (story / missable / collectibles / activities / other), by earned
  status, and a search box.
- **Spoiler setting**: “Hide story spoilers” hides the name, description and guide of story
  trophies you have not earned yet.
- **Fully offline**: plain static files, no network requests, no external assets, no Rockstar logo
  or artwork. Open it and it works.

## Honest note

The game had not released when this guide was written. Every guide is derived from the official
trophy description plus general GTA knowledge, and says so where a detail is still unconfirmed.
No guide text is copied from another guide site, wiki or forum — sources (Official trophy
description, Exophase, PSNProfiles) are cited beside each trophy.

## Open it offline

```sh
node serve.ts
# then open http://localhost:8080
```

Or open `app/index.html` directly in a desktop browser. No build step, no dependencies.

## Hand it in (make.fun)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library.

## Screenshots

Real renders of the app in Chromium, in `screenshots/` (see `shots.json` for the views):

1. `1-checklist.jpg` — main checklist view
2. `2-roadmap.jpg` — roadmap and missable section
3. `3-detail.jpg` — trophy detail with guide and sources

## License

MIT — see [LICENSE](LICENSE). This is an unofficial fan-made guide, not affiliated with or
endorsed by Rockstar Games. Grand Theft Auto and GTA are trademarks of Rockstar Games.
