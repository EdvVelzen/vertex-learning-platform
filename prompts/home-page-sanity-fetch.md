# Implementation Prompt: Wire Home Page Courses to Sanity Content

## 1. Goal
Refactor the **Vertex Home Page** (`app/page.tsx`) so that the courses rendered in the "All Courses" section are fetched dynamically from the seeded Sanity CMS dataset instead of being hardcoded, preserving the visual fidelity of `design/vertex-home.png` and keeping client interactivity cleanly separated.

---

## 2. Skills & References Read
- `AGENTS.md`: Data layer rules (server-side Sanity client with token, server component boundaries, strict visual design reproduction, non-breaking changes).
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`): Server-side GROQ queries, next-sanity fetch patterns, and type safety.
- `design/vertex-home.png`: Layout, typography, spacing, course card design, search input, and atmospheric equalizer styling.

---

## 3. Code & Environment Inspected
- `app/page.tsx`: Currently a client component (`"use client"`) with hardcoded course cards.
- `sanity/lib/queries.ts`: `FEATURED_COURSES_QUERY` and `COURSES_QUERY` for fetching courses with module counts, durations, and levels.
- `sanity/lib/client.ts`: Server-only Sanity client.
- `sanity/lib/types.ts`: `CourseSummary` type definition.
- `lib/formatters.ts`: Utilities for `formatDuration`, `formatLevel`, `formatStudentCount`.
- `components/cards/course-card.tsx`: Course card component supporting vertical layout and custom icons.

---

## 4. Decisions & Assumptions
1. **Server Component Architecture**:
   - Convert `app/page.tsx` into an async Next.js Server Component that fetches courses from Sanity CMS using `FEATURED_COURSES_QUERY` (or top courses from `COURSES_QUERY`).
   - Extract the client-side search input functionality (`Cmd+K` keyboard shortcut, input state, routing on submit) into a client component `components/home/hero-search.tsx`.
2. **Dynamic Course Card Rendering**:
   - Map over the fetched Sanity courses to render each `CourseCard` with its live `title`, `summary`, formatted `level`, formatted `totalDuration`, and `moduleCount`.
   - Wrap each card with a Next.js `Link` pointing to `/courses/${course.slug.current}`.
   - Maintain brand icons (Next.js "N", Docker whale, TypeScript "TS", or image cover/initial fallback) based on course title/slug.
3. **Visual & Behavioral Consistency**:
   - Maintain the exact layout, header, hero typography (`Playfair Display`), "INTELLIGENT LEARNING" badge, divider with star notice, and bottom warm gradient equalizer visual effect from `design/vertex-home.png`.

---

## 5. Files to Create / Modify
- `components/home/hero-search.tsx`: Client component for interactive search bar with `⌘ K` keyboard shortcut and submit navigation.
- `app/page.tsx`: Server component fetching featured courses from Sanity and rendering the dynamic course grid.

---

## 6. Requirements
- The "All Courses" section on the home page must render real course data fetched from Sanity CMS.
- The home page must remain a Server Component, with client interactivity isolated in `HeroSearch`.
- Each course card must link to its corresponding course page (`/courses/[slug]`).
- Visual design must match `design/vertex-home.png` exactly.

---

## 7. Security Considerations
- Sanity CMS reads execute on the server using `client.fetch`. No tokens are exposed to the client bundle.
- User input in `HeroSearch` is sanitized and URL-encoded.

---

## 8. Acceptance Criteria
- [ ] `app/page.tsx` fetches courses directly from Sanity via `client.fetch(FEATURED_COURSES_QUERY)`.
- [ ] Course cards display real titles, summaries, levels, durations, and module counts from Sanity.
- [ ] Clicking any course card navigates to `/courses/[slug]`.
- [ ] Hero search input retains `⌘ K` shortcut and redirects to `/search?q=...` or `/courses`.
- [ ] Visual fidelity matches `design/vertex-home.png`.
- [ ] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass with 0 errors.

---

## 9. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 10. Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000/`.
3. Inspect "All Courses" section: verify cards reflect live Sanity course content (Next.js, Docker, TypeScript).
4. Click on the "Next.js for Production" card (or "Next.js App Router in Depth") and confirm navigation to the course detail page.
5. Press `Cmd+K` (or `Ctrl+K`) and test searching.
6. Verify responsive layout on mobile, tablet, and desktop viewports.
