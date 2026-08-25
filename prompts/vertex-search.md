# Implementation Prompt: Vertex Search Page with Sanity Content

## 1. Goal

Implement and polish the **Vertex Search Page** (`/search`), fully wired with live Sanity content and matching `design/vertex-search.png` down to typography, spacing, badge variants, and interactive behaviors (video moment timestamps, topic matching, sort dropdown, `⌘ K` keyboard shortcut, empty states, and catalog redirect banner).

---

## 2. Skills & References Read

- `AGENTS.md`: Sections 1 (Platform Scope), 2 (Workflow Loop), 3 (UI Fidelity), 4 (Skills), 5 (Architecture & Boundaries), 6 (Tech Stack), 7 (Decisions), 8 (Content Modeling), 9 (Video Pipeline), 10 (Search Config), 11 (Search Behavior), 12 (Gotchas), 13 (Checks), 14 (Guidelines).
- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md` and `references/nextjs-agent.md`).
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`).
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`).
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`).
- Visual design reference: `design/vertex-search.png`.

---

## 3. Code & Configuration Inspected

- **Visual Design Reference**: `design/vertex-search.png`
  - Top header: `SEARCH RESULTS` pill badge, serif heading `Results for "data fetching"` with orange quoted query, subtitle `Found 28 results across 8 courses`.
  - Search input: Centered with search icon, placeholder/value, and `⌘ K` shortcut pill.
  - Results bar: Count `28 results` on left, dropdown `Most Relevant v` on right.
  - Video cards (`LessonVideoCard`): 16:9 thumbnail on left with play button and duration pill (e.g. `12:45`), course icon + course title + orange `VIDEO` badge on top right, title, summary, `Lesson X.Y • Module Name` on bottom left, and `Watch from MM:SS >` in orange on bottom right linking to `/lessons/[slug]?start=[seconds]`.
  - Lesson cards (`LessonCard`): Left takeaway box with icon, 3 bulleted key points, and dark circular checkmark badge; right side has course icon + course title + lavender/indigo `LESSON` badge, title, summary, `Module X` label, and `View lesson [external-icon] >` in orange on bottom right linking to `/lessons/[slug]`.
  - Bottom banner (`CantFindBanner`): Peach banner with orange search icon, "Can't find what you're looking for?", description, and white "Browse all courses ->" button.
- **Data & Sanity Integration**:
  - `lib/search.ts`: Hybrid search querying Sanity for video moments (chapters first, then transcript chunks) and lesson topics, calculating relevance scores, mapping course modules and lesson indices, and supporting sorting.
  - `app/api/search/route.ts`: Server route handling search with caching and fallback.
  - `app/search/page.tsx`: Server component extracting `q` and `sort` searchParams and rendering `SearchResultsClient`.
  - `components/search/search-results-client.tsx`: Client component managing state, sort dropdown, loading skeletons, result cards, and empty state.
  - `components/cards/lesson-video-card.tsx` & `components/cards/lesson-card.tsx`: Card components.
  - `components/ui/badge.tsx`: Badge component supporting `video`, `lesson`, `popular`, and `neutral` variants.
  - `studio/schemaTypes/`: Schemas for `course`, `lesson`, `video`, `instructor`, `category`, and `sanity.agentContext`.

---

## 4. Decisions & Assumptions

1. **Pixel-Perfect Alignment with `design/vertex-search.png`**:
   - `Badge` component: Update `lesson` variant to lavender/indigo (`bg-[#EEF2FF] text-[#6366F1]` / `bg-[#EDE9FE]/70 text-[#6D28D9]`) matching the screenshot.
   - `LessonCard` component: Update the left preview checkmark circle to dark slate `bg-[#475569] text-white` with crisp check icon matching the screenshot. Ensure module label (e.g. `Module 5`) is cleanly rendered.
   - `LessonVideoCard` component: Ensure course icons (Next.js black N, React blue atom, Node.js green JS, JavaScript yellow JS) and thumbnail placeholders/images render with high fidelity.
   - `SearchResultsClient`: Maintain smooth transitions and client-side sort updates without page reloads while keeping URL in sync.
2. **Search Grounding & Dual Retrieval**:
   - Search is grounded strictly in Sanity data: never invent courses, lessons, durations, or timestamps.
   - Two-stage timestamp resolution: check video `chapters` first for clean table-of-contents hits, fall back to timestamped `chunks` if no chapter matches.
   - Lesson topics match title, notes (via `pt::text(notes)`), and `keyPoints`.
   - Results are ranked by specificity with exact title matches receiving highest relevance score.
3. **Security & Boundary Enforcement**:
   - Private tokens and backend logic remain server-only (`lib/search.ts` and `app/api/search/route.ts`).
   - The browser only receives public fields and formatted search results.

---

## 5. Files to Touch & Create

- `components/ui/badge.tsx`: Refine `lesson` variant colors to match lavender/indigo styling in `vertex-search.png`.
- `components/cards/lesson-card.tsx`: Refine checkmark circle styling (`bg-[#475569] text-white`), module label typography, and spacing.
- `components/cards/lesson-video-card.tsx`: Refine course badge typography, play button hover transitions, and breadcrumb layout.
- `components/search/search-results-client.tsx`: Verify exact layout, padding, sort select styling, and responsiveness.
- `components/search/search-bar.tsx`: Ensure `⌘ K` keyboard listener and focus handling works seamlessly.
- `components/search/cant-find-banner.tsx`: Match colors and button styling to design.
- `app/search/page.tsx`: Verify metadata and searchParams handling.
- `lib/search.ts`: Ensure robust GROQ queries and graceful fallback when offline or dataset is missing optional fields.

---

## 6. Requirements & Acceptance Criteria

1. **Visual Accuracy**: Search page matches `design/vertex-search.png` in layout, colors, typography (serif title, orange quoted query), badges, cards, and responsive states.
2. **Video Moments & Deep Linking**: Video search results link to `/lessons/[slug]?start=[seconds]` and display the formatted timestamp (e.g., `12:45`).
3. **Lesson Topic Cards**: Lesson search results display key takeaways bullet points, dark checkmark indicator, module label, and link to `/lessons/[slug]`.
4. **Interactive Controls**:
   - Search input supports keyboard submission and `⌘ K` / `Ctrl+K` shortcut focus.
   - Sort dropdown (`Most Relevant`, `Duration: Short to Long`, `Duration: Long to Short`) reorders results immediately.
5. **Empty State & Banner**: If no results match, display clear empty state message and the "Can't find what you're looking for?" banner linking to `/courses`.
6. **Code Quality & Checks**: TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js production build (`npm run build`) must all pass.

---

## 7. Checks to Run

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`

---

## 8. Exact Manual Test Steps

1. Start development server with `npm run dev`.
2. Open browser at `http://localhost:3000/search?q=data+fetching`.
3. Verify the header displays:
   - Pill badge: `SEARCH RESULTS`
   - Title: `Results for "data fetching"` with orange quoted query
   - Count: `Found X results across Y courses`
   - Centered search input with `⌘ K` shortcut badge
4. Verify the results list:
   - Total count display on the left (e.g., `28 results` or actual count from Sanity)
   - Sort select on the right with options: `Most Relevant`, `Duration: Short to Long`, `Duration: Long to Short`
   - Video result cards with 16:9 thumbnail preview, duration timestamp, orange `VIDEO` badge, course icon/title, module breadcrumb, and `Watch from MM:SS >` button
   - Lesson result cards with key points takeaway box, dark checkmark circle, lavender `LESSON` badge, course icon/title, module label, and `View lesson >` button
5. Click on `Watch from 12:45 >` on a video result card; verify navigation to `/lessons/[slug]?start=...` with the video player ready at that timestamp.
6. Click on `View lesson >` on a lesson result card; verify navigation to `/lessons/[slug]`.
7. Change the sort dropdown to "Duration: Short to Long" and verify cards re-order instantly.
8. Enter a new search query (e.g., "authentication" or "state management") and press Enter; verify results update accordingly.
9. Enter a query with no matches (e.g., "xyznonexistent") and verify the empty state and bottom "Can't find what you're looking for?" banner with "Browse all courses ->" button.
