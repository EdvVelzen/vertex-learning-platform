# Implementation Prompt: Intelligent Search with Sanity Context MCP

## 1. Goal

Implement the intelligent search experience for **Vertex**, connecting the Sanity Context MCP over server-side HTTP, the Next.js server-side search API route (`/api/search`), and the search results page (`/search`) supporting both video moment results and lesson topic results according to `design/vertex-search.png` and `AGENTS.md`.

---

## 2. Skills & References Read

- `AGENTS.md`: Sections 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14.
- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md` and `references/nextjs-agent.md`).
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`).
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`).
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`).
- Visual design reference: `design/vertex-search.png`.

---

## 3. Code & Configuration Inspected

- **Design Reference**: `design/vertex-search.png` — verified layout, orange quote styling for search query in serif heading, results count, `⌘ K` keyboard shortcut, sort dropdown, horizontal 2-column cards on desktop with video thumbnail overlays and key points preview boxes, and bottom fallback banner.
- **Sanity Data & Queries**: `sanity/lib/queries.ts`, `sanity/lib/types.ts`, `sanity/lib/client.ts`, `sanity/env.ts`.
- **UI Components**: `components/cards/lesson-video-card.tsx`, `components/cards/lesson-card.tsx`, `components/course/course-icon.tsx`, `components/lesson/video-embed.tsx`, `components/home/hero-search.tsx`, `components/ui/navbar.tsx`.
- **Existing Routes**: `app/lessons/[slug]/page.tsx` (already supports `startSeconds` query param), `app/courses/[slug]/page.tsx`, `app/courses/page.tsx`, `app/page.tsx`.
- **Studio Schemas**: `studio/schemaTypes/` — currently defines `course`, `lesson`, `instructor`, `category`. We will add `video` and `sanity.agentContext`.
- **Environment**: `.env.local` has `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, and Clerk keys.

---

## 4. Decisions & Assumptions

1. **Architecture & Boundaries**:
   - The browser never receives Sanity read/write tokens or LLM credentials.
   - The search API route `/api/search` connects to the Sanity Context MCP HTTP endpoint (`https://api.sanity.io/v2026-03-03/context/mcp/:projectId/:dataset`) with `Authorization: Bearer ${SANITY_API_READ_TOKEN}`.
   - Caches initial schema context via `/initial-context` to minimize latency.
   - Provides a fast, grounded hybrid search pipeline: queries Sanity via GROQ (text token wildcard matching with OR across titles, notes, keyPoints, video chapters, and video transcript chunks) and uses LLM / MCP semantic ranking to produce clean, structured results.
2. **Video & Agent Context Data Modeling**:
   - Define `video` document schema (`_id`, `url`, `chapters: [{ startSeconds, label }]`, `chunks: [{ startSeconds, text }]`) and `sanity.agentContext` schema in Sanity Studio.
   - Seed `video` documents and `sanity.agentContext` configuration using the existing video metadata in `scripts/seed/videos.json` and lesson notes so that video moments and chapter timestamps are available to search.
3. **Card Types & Layout**:
   - **Video Result Card (`LessonVideoCard`)**: Updated to match `vertex-search.png` with a left 16:9 thumbnail preview container containing play overlay and timestamp badge (e.g. `12:45`), course icon + course title, `VIDEO` badge, title, summary, lesson/module label, and "Watch from MM:SS >" action that opens `/lessons/[slug]?start=[seconds]`.
   - **Lesson Result Card (`LessonCard`)**: Updated to match `vertex-search.png` with a left preview box containing document icon and bulleted key takeaways, course icon + course title, `LESSON` badge, title, summary, module label, and "View lesson >" action that opens `/lessons/[slug]`.
4. **Search Page Experience**:
   - `/search?q=...` renders the complete design: serif title `Results for "<query>"`, found count `Found X results across Y courses`, prefilled search input with `⌘ K` shortcut, `28 results` count, sort control (`Most Relevant`, `Duration: Short to Long`, `Duration: Long to Short`, `Newest`), ranked cards, and bottom "Can't find what you're looking for?" banner.

---

## 5. Files to Touch & Create

- **Dependencies**:
  - `package.json`: Install `ai`, `@ai-sdk/openai`, `@ai-sdk/mcp`, `zod`, `react-markdown`
- **Studio Schemas**:
  - `studio/schemaTypes/documents/video.ts`: Define `video` document schema
  - `studio/schemaTypes/documents/agentContext.ts`: Define `sanity.agentContext` document schema
  - `studio/schemaTypes/index.ts`: Export `video` and `agentContext`
- **Sanity Types & Queries**:
  - `sanity/lib/types.ts`: Add `VideoDocument`, `AgentContextDocument`, `SearchResult`, `VideoSearchResult`, `LessonSearchResult`, `SearchApiResponse`
  - `sanity/lib/queries.ts`: Add GROQ search queries for lessons, courses, and video chapters/chunks
- **Search API & Logic**:
  - `lib/search.ts`: Search execution logic connecting Sanity Context MCP / GROQ queries / fallback ranking
  - `app/api/search/route.ts`: Server route handling search requests with caching and validation
- **Components & UI**:
  - `components/cards/lesson-video-card.tsx`: Full pixel-match update with left media container and right content
  - `components/cards/lesson-card.tsx`: Full pixel-match update with left key points box and right content
  - `components/search/search-bar.tsx`: Search input component with `⌘ K` shortcut listener
  - `components/search/search-results-client.tsx`: Interactive results container with sorting, loading skeletons, and empty state
  - `components/search/cant-find-banner.tsx`: Reusable bottom banner
- **Pages**:
  - `app/search/page.tsx`: Full search results page with metadata and search params handling
- **Environment & Seeds**:
  - `.env.example`: Include `OPENAI_API_KEY`, `SANITY_CONTEXT_MCP_URL`
  - `scripts/seed/seed-video-data.mjs`: Script to seed `video` documents and agent context into Sanity dataset

---

## 6. Requirements & Acceptance Criteria

1. **Grounded Search**: Search only returns real courses and lessons from the dataset. No hallucinated content, duration, or timestamps.
2. **Video Moment Linking**: Clicking a video result or "Watch from MM:SS >" opens `/lessons/[slug]?start=[seconds]`, where the video player embeds and seeks to that exact second.
3. **Lesson Linking**: Clicking a lesson result or "View lesson >" opens `/lessons/[slug]`.
4. **UI Fidelity**: Visual hierarchy, colors, typography, badges, and responsive layouts match `design/vertex-search.png`.
5. **Security**: All tokens and API keys remain on the server; the browser never receives private Sanity tokens.
6. **Code Quality**: Passes TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js production build (`npm run build`).

---

## 7. Checks to Run

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`

---

## 8. Manual Test Steps

1. Start development server with `npm run dev`.
2. Visit home page `/` and enter "data fetching" into the hero search input; submit the form.
3. Verify navigation to `/search?q=data+fetching`.
4. Inspect the search header: verify the pill `SEARCH RESULTS`, the title `Results for "data fetching"` (with orange query text), and the count `Found ... results across ... courses`.
5. Verify video results appear with video thumbnail, duration badge, course badge, lesson label, module name, and "Watch from MM:SS >".
6. Click "Watch from 12:45 >" (or any video result) and verify navigation to `/lessons/[slug]?start=[seconds]` where the lesson video player loads with the start timestamp.
7. Click "View lesson >" on a lesson result and verify navigation to `/lessons/[slug]`.
8. Change the sort dropdown to "Duration" or "Newest" and verify reordering.
9. Enter a query with no matches (e.g. "qwertyuiop") and verify the empty state and bottom "Can't find what you're looking for?" banner with "Browse all courses ->" button.
