# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── web/                # React+Vite frontend — Dynamic Workforce Operations dashboard
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### Gemini AI Integration

The API server integrates with Google's Gemini LLM via the Google AI Studio SDK (`@google/generative-ai`).

- **Service**: `artifacts/api-server/src/lib/gemini.ts` — lazy-initialized Gemini client using `gemini-2.0-flash` model
- **Routes**: `artifacts/api-server/src/routes/gemini.ts`
  - `POST /api/gemini/generate` — single prompt → text response (`{ prompt: string }`)
  - `POST /api/gemini/chat` — multi-turn chat (`{ messages: ChatMessage[], systemInstruction?: string, withTts?: boolean }`) — when `withTts: true`, server generates TTS audio alongside chat response and returns `{ text, audio, audioMimeType }` in a single round-trip
  - `POST /api/gemini/transcribe` — audio transcription (`{ audio: base64string, mimeType?: string }`) → `{ text: string }`
  - `POST /api/gemini/tts` — text-to-speech via Gemini `gemini-2.5-flash-preview-tts` model (`{ text: string }`) → `{ audio: base64, mimeType: string }` (PCM L16 24kHz)
  - `GET /api/gemini/info` — returns model, project, location, and config status
- **Required secrets**: `GEMINI_API_KEY`, `GOOGLE_PROJECT_ID`, `GOOGLE_LOCATION`

### `artifacts/web` (`@workspace/web`)

React+Vite frontend — Dynamic Workforce Operations dashboard (UKG-style workforce management).

- **Routing** (wouter, configured in `src/main.tsx`):
  - `/` — Cover page with Desktop and Mobile buttons
  - `/desktop` — Full dashboard with back button overlay
  - `/mobile` — Dashboard inside 375×812 phone-shaped frame with notch, home bar, and responsive CSS overrides
- **Font**: DM Sans (loaded via Google Fonts in page.css)
- **Colors**: #13352C (dark green), #78CFB8 (teal accent), #3C3939 (dark chip selected), #3AD6C5 (shortcut icon teal)
- **CSS**: Custom CSS in `src/styles/page.css` (no Tailwind)
- **Key components** (all in `src/App.tsx`, exported as `Dashboard`):
  - `Nav` — sticky nav with Bryte logo SVG in search bar, mic icon, notification/help icons
  - `Header` — page title, time, location selector
  - `Shortcuts` — "Employee details" button with teal-filled calendar/person SVG
  - `Tagline` — summary text
  - `MetricsCard` — 4-column metrics (hours, cost, coverage, open shifts)
  - `ComplianceSection` — accordion with filter chips, insight cards with avatar images (pravatar.cc); supports AI-triggered filtering by department (`<<FILTER_DEPT:Name>>`) or employee (`<<FILTER_EMP:Name>>`) and category filtering from hot topics/suggestions. Shows "All (N)" + "FilterName (N) [X]" chips when active. Only one filter active at a time; X clears all filters. Department aliases (e.g. "Front End" → "Frontend") and case-insensitive employee matching supported. Category filter driven by `TOPIC_CATEGORY_MAP`: "Most critical issues"/"What should I fix first?" → Meal break, "What needs my attention?"/"coverage gaps" → All.
  - `StaffingSection` — 2-column layout: left (issue cards with avatars per dept), right (insights list with accept/dismiss per dept)
  - `VoiceSnippet` — floating pill at bottom-right with mic, fire/hot-topics, expand, end button; fire icon toggles a hot topics overlay with preset questions that trigger AI voice responses when clicked
  - `BrytePanel` — fixed right-side panel (360px) with two-mode footer:
    - **Text mode**: warm tan border (#EBDCCD), textarea ("Search or ask Bryte"), attach (+) button, purple gradient voice-mode circle (40×40 with wave icon), disclaimer at 14px
    - **Voice mode (tap-to-speak model)**: Card with rounded top corners (12px) and #EBDCCD border (top/left/right only), white bg, containing "Search or ask Bryte" label + icons row (attachment, sound/volume, mic/stop, close X). Status label "Listening..." shown above card when active. Icons: attachment-icon.svg, volume-down.svg, mic-idle.svg (tap), mic-animated.svg (listening, purple gradient), close-voice.svg
    - Voice mode starts in idle (tap-to-speak) state — no auto-start listening. User must tap mic to begin. After AI response + TTS, returns to idle state. `handleVoiceCancel` cancels and returns to idle without exiting voice mode. `handleTapToSpeak` starts listening directly.
    - Voice mode uses MediaRecorder + server-side Gemini transcription (`POST /api/gemini/transcribe`) + server-side Gemini TTS (`POST /api/gemini/tts`) played via HTMLAudioElement; `footerModeRef` guards prevent mic reactivation after exiting voice mode
    - **Anti-duplicate guards**: `processingRef` (VoiceSnippet) blocks overlapping send cycles; `sendingRef` (BrytePanel) blocks concurrent requests; `lastSentTextRef`+`lastSendTimeRef` dedup prevents identical consecutive messages within 10s; `isListeningRef` prevents parallel recorder sessions; `scheduleRestart`/`schedulePanelRestart` centralize restart timer management to prevent timer overlap; `schedulePanelRestart` gated on `!isMicMutedRef.current` to prevent restart after cancel
    - SVG assets in `public/images/`: mic-on.svg, mic-off.svg, sound-on.svg, sound-off.svg, send-filled.svg, voice-mode.svg, mic-idle.svg, mic-animated.svg, volume-down.svg, attachment-icon.svg, close-voice.svg, mic-ellipse.svg
  - `BryteStar` — complex multi-path gradient star SVG component
- **DWO Voice Data — Bakery v2** (`src/lib/dwo-voice-data.ts`): Real-time insight card data module with:
  - 1 live insight card: Maria Garcia missed meal break window (high urgency, expires 11:35am, 30min to act)
  - Two compliance paths: Accept (waiver, $18.50 premium pay) or Dismiss (send on break now, 1pm deadline)
  - 5 employees (Maria Garcia, James Okafor, Priya Nair, Kenji Tanaka, Sofia Reyes) — Saturday 8a–4p Baker shift
  - Progressive disclosure insights for Maria (level1–level6: summary → context → pattern → policy → action → risk)
  - Policies: CA meal break (§512, §226.7), waiver mechanics, immediate break requirements
  - Staffing intelligence: 3 adjustments (shorten James OT, Kenji early start, Priya extension), oven certification gap
  - 25 pre-built voice query/response pairs via `matchVoiceQuery()` covering compliance + staffing
  - Functions: `matchVoiceQuery()`, `getEmployeeById()`, `getCard()`, `getPendingCards()`, `resolveDetail()`
- **DWO Voice Data — Frontend v2** (`src/lib/dwo-voice-data-frontend.ts`): Real-time insight card data module with:
  - 3 live insight cards: Eliza meal break (high urgency, 3min expiry), Tom break compliance (medium, early clock-in), Sam minor hours (high, legal obligation)
  - 3 employees (Eliza Thompson, Tom Jones, Sam Adams) — all Saturday 7a–3p Bagger shift
  - Progressive disclosure insights per employee (level1–level6: summary → context → pattern → policy → action → risk)
  - Policies: CA meal break (§512), minor work hours (§1285–1312), early clock-in break adjustment
  - Staffing intelligence: 4 adjustments when Sam goes home (Jordan shortened, Sam Rivera extended, Ava +1hr, Alex cross-dept move)
  - 29 pre-built voice query/response pairs via `matchFrontendQuery()` covering compliance + staffing
  - Card action explanations (Acknowledge, Accept, Dismiss) with legal consequences
- **Unified Voice Matching**: `matchAllVoiceQueries()` in App.tsx chains `matchVoiceQuery()` (Bakery) then `matchFrontendQuery()` (Front End). Both VoiceSnippet and BrytePanel use this unified function before falling back to Gemini API.
- **System Instructions**: Both voice and chat system prompts include full data for both Bakery and Front End departments (employees, violations, staffing, insights) for AI follow-up questions
- **Avatar images**: All use `https://i.pravatar.cc/64?imgXX` URLs
- **Share/Feedback icons**: Compliance cards use edit/pen feedback icon; staffing insights use detailed chat/edit SVG

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
