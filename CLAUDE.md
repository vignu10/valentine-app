# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Valentine's Day interactive "Love Adventure Quest" web app built for a specific recipient ("Kullu"). The app presents a series of riddle-based quests with animations, a car surprise mini-game, and a final reveal screen.

## Commands

- `npm run dev` — Start dev server (Next.js)
- `npm run build` — Production build (static export to `./out`)
- `npm start` — Start production server

No test framework is configured. No linter is configured.

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. The build uses `output: 'export'` with `basePath: '/valentine-app'` and `assetPrefix: '/valentine-app'` — all asset references must account for this base path.

## Architecture

**Stack:** Next.js 15 (App Router, static export), React 19, Tailwind CSS 4 (via `@tailwindcss/postcss`), Framer Motion 12, TypeScript 5.

**Single-page app:** Everything runs from `app/page.tsx` as a client component. There are no API routes or server-side data fetching.

**Game flow:** The app progresses through states defined by `GameState` type: `intro` → `quest-1` → `quest-2` → `quest-3` → `complete`. State transitions and persistence are managed in `app/page.tsx` with localStorage via `lib/gameStore.ts`.

**Quest system:** Quest content (riddles, answers, locations) is configured in `lib/questConfig.ts`. Each quest has an answer validation step — answers are matched case-insensitively against an array of accepted strings. Quest 1 has a `hasCarSurprise` flag that triggers an interactive car surprise mini-game (`CarSurprise` component) before advancing to quest 2.

**Key component roles:**
- `components/CarSurprise.tsx` — 3-step interactive car reveal with hotspots triggering animations
- `components/animations/` — RosePetals, Chocolates, Balloons animation components used by CarSurprise
- `components/QuestCard.tsx` — Riddle display and answer input
- `components/FinalReveal.tsx` — End-game celebration screen
- `components/FloatingHearts.tsx` — Background ambient animation

**Styling:** Tailwind CSS 4 with custom component classes defined in `app/globals.css` (`.glass-card`, `.btn-primary`, `.input-field`, `.text-glow`). Three Google Fonts loaded via `next/font`: Playfair Display (display), Dancing Script (script), Inter (sans).

**Types:** All game types are in `types/game.ts`.

**Path alias:** `@/*` maps to the project root.
