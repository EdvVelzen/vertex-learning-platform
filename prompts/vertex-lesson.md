# Implementation Prompt: Vertex Lesson Page

## 1. Goal
Implement the **Vertex Lesson Detail Page** (`app/lessons/[slug]/page.tsx`) matching the visual design specification in `design/vertex-lesson.png` and wired to seeded Sanity CMS lesson and course content. The lesson page features:
1. **Header Navigation Bar**: Vertex logo, navigation links ("Courses", "My Learning"), notifications bell, and Clerk learner avatar.
2. **Left Sidebar Navigation (Course Curriculum)**:
   - `← Back to course` link navigating back to the parent course detail page (`/courses/[course-slug]`).
   - Course summary card showing course brand icon / cover image, course title ("Next.js for Production"), and course progress indicator ("35% complete").
   - Module selector & list ("Module 5 of 12") listing all modules with circular number badges, titles, durations, completed checkmarks (modules 1–4), and expandable sub-lessons.
   - Active module tree view (Module 5) with active lesson highlight, "Now playing" orange tag, play button icon, and links to other lessons in the module.
3. **Right Main Content Area**:
   - **Breadcrumbs**: Hierarchical path `All Courses > [Course Title] > [Module Title] > [Lesson Title]`.
   - **Lesson Number Badge**: Pill badge with `LESSON X.Y` (e.g. `LESSON 5.1`).
   - **Header & Actions**: Playfair Display lesson title with bookmark button toggle.
   - **Lesson Summary**: Descriptive overview text.
   - **Metadata Row**: Duration (`1h 28m`), skill level (`Intermediate`), and student count (`3,426 students`).
   - **Embedded Video Player**: 16:9 aspect-ratio video player playing the lesson's video on the page (YouTube, Vimeo, Bunny embeds) with start timestamp support (`?start=seconds`).
   - **Tabs**: `Lesson Content` (active) and `Notes` tabs.
   - **Overview**: Rich text / Portable Text overview description.
   - **"In this lesson you will:"**: Key takeaways list with orange outlined checkmark circle icons.
   - **"Pro Tip" Callout Card**: Warm-tinted callout with lightbulb icon, "Pro Tip" heading, and expert advice text.
   - **"Resources" Section**: 3-column grid of downloadable/external resource cards with document/GitHub icons, titles, descriptions, and external link triggers.
4. **Bottom Previous / Next Lesson Navigation**:
   - Previous lesson CTA button with title & duration (`Server Components \n 1h 42m`).
   - Next lesson CTA button with title & duration (`Authentication \n 1h 18m`).
5. **Responsive Layout**:
   - Two-column layout on desktop (`lg:flex-row`), responsive collapsible layout on tablet and mobile viewports.

---

## 2. Skills & References Read
- `AGENTS.md`: Platform architecture, strict visual reproduction of `design/vertex-lesson.png`, responsive design, server/client boundaries, video embed requirements, and verification workflow.
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`): GROQ query optimization, type-safe data fetching, reverse reference resolution for course hierarchy, and Next.js App Router integration.
- `portable-text-serialization` (`.agents/skills/portable-text-serialization/SKILL.md`): Portable Text rendering standards using `next-sanity` / `@portabletext/react`.
- `design/vertex-lesson.png`: Source of truth for layout, typography, colors, spacing, badges, sidebar hierarchy, tabs, pro tip callout, and resource cards.
- `design/vertex-designsystem.png`: Token reference for colors (`primary-500 #F97316`, `neutral-50 #FAFAFC`, `neutral-900 #0F172A`), fonts (`Playfair Display`, `Inter`), buttons, badges, and progress bars.

---

## 3. Code & Environment Inspected
- `sanity/lib/queries.ts`: `LESSON_BY_SLUG_QUERY` and `LESSON_SLUGS_QUERY` for fetching lesson details, key points, pro tips, notes, resources, and reverse-referenced parent course modules and lessons.
- `sanity/lib/types.ts`: `LessonDetail`, `Resource`, `Module`, `CourseDetail`, `LessonSummary` types.
- `sanity/lib/client.ts`: Sanity client configured for server-side data fetching with token auth and published perspective.
- `components/ui/navbar.tsx`: Header navigation component with Clerk auth integration.
- `components/ui/breadcrumbs.tsx`: Breadcrumb component with Chevron separators.
- `components/ui/badge.tsx`: Pill badge styles (`video`, `lesson`, `popular`, `neutral`).
- `components/ui/button.tsx`: Primary, secondary, tertiary button variants.
- `components/cards/resource-card.tsx`: Resource download/link card component.
- `components/course/course-icon.tsx`: Course brand thumbnail / icon component.
- `lib/formatters.ts`: Duration formatting and number abbreviation helpers.
- `scripts/seed/seed.ndjson` & `scripts/seed/videos.json`: Seeded lesson records containing YouTube video URLs, keyPoints, proTips, notes, and resources.

---

## 4. Decisions & Assumptions
1. **Routing & Server Component Architecture**:
   - Create `app/lessons/[slug]/page.tsx` as an async Next.js Server Component that fetches lesson data from Sanity via `LESSON_BY_SLUG_QUERY`.
   - Support `generateStaticParams` using `LESSON_SLUGS_QUERY` plus aliases.
   - If a lesson is not found, call `notFound()` from `next/navigation`.
   - Parse `searchParams` (`start`, `t`, or `startSeconds`) and pass to the video embed component so timestamped search result links start playback at the specified second.
2. **Video Player & Embed Implementation**:
   - Create `components/lesson/video-embed.tsx` to handle provider embeds (YouTube, Vimeo, Bunny Stream) inside a responsive 16:9 container (`aspect-video`) with `rounded-[16px]` and dark background.
   - Transform standard YouTube watch URLs (`https://www.youtube.com/watch?v=ID` or `https://youtu.be/ID`) into `https://www.youtube.com/embed/ID?autoplay=0&start=START_SECONDS`.
   - Provide clean poster/thumbnail fallback when videoUrl is loading or unavailable.
3. **Sidebar Course Curriculum Component**:
   - Create `components/lesson/lesson-sidebar.tsx` (Client Component) to allow learners to collapse/expand modules, browse the curriculum, see completed checkmarks for previous modules, and navigate to other lessons.
   - Automatically determine the current module index and lesson index in the module (e.g. `Module 5`, `Lesson 5.1`).
4. **Lesson Content & Tab Components**:
   - Create `components/lesson/lesson-content.tsx` to render the lesson header, metadata row, tabs (`Lesson Content` / `Notes`), Overview Portable Text, Key Points checklist, Pro Tip callout, and Resources grid.
   - Render Portable Text blocks with custom styling for paragraphs, headings, code snippets, and lists.
5. **Previous & Next Lesson Resolution**:
   - Create `components/lesson/lesson-navigation.tsx` to compute previous and next lessons across all modules in the course and render the bottom navigation footer.
6. **Visual Fidelity**:
   - Match exact fonts (`Playfair Display` for lesson title, `Inter` for body/metadata).
   - Match exact theme colors (`#FAFAFC` page background, `#F97316` primary orange, `#EA580C` dark orange, `#FFF9F5` pro tip background with `#FED7AA` border).
   - Fully responsive down to mobile viewports (stack sidebar above or below on mobile, full width on desktop).

---

## 5. Files to Create / Modify
- `sanity/lib/queries.ts`: Update `LESSON_BY_SLUG_QUERY` to project complete course details (coverImage, level, module durations) and add slug aliases for seed data consistency.
- `sanity/lib/types.ts`: Ensure `LessonDetail` and `Resource` types accurately reflect all projected fields.
- `components/lesson/video-embed.tsx`: Embed component for YouTube, Vimeo, and Bunny with timestamp seek support.
- `components/lesson/lesson-sidebar.tsx`: Course curriculum sidebar with module accordion, active lesson tree, and completed checkmarks.
- `components/lesson/lesson-content.tsx`: Main lesson content component with tabs, Portable Text overview, key points, pro tip, and resources.
- `components/lesson/lesson-navigation.tsx`: Bottom previous/next lesson navigation bar.
- `app/lessons/[slug]/page.tsx`: Lesson detail page Server Component integrating Sanity data fetching, metadata, and 2-column layout.

---

## 6. Requirements
- Reproduce the exact layout, typography, colors, and interactive states from `design/vertex-lesson.png`.
- Wire the page with real data fetched from Sanity CMS via the server-side client.
- Embed and play the lesson video on the site itself without directing the learner away.
- Support deep linking with start seconds query parameter (`?start=seconds`).
- Keep server and client boundaries clean: data fetching on the server, UI interactions in client subcomponents.
- Fully responsive across desktop, tablet, and mobile screens.

---

## 7. Security Considerations
- Sanity read token is kept exclusively on the server in `sanity/lib/client.ts`.
- No CMS private tokens or API secrets are exposed to client components.
- Video iframe embeds sanitize URLs and use secure sandbox/allow attributes (`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share`).

---

## 8. Acceptance Criteria
- [ ] Navigating to `/lessons/nextjs-app-router-in-depth-caching-and-revalidation` (or `/lessons/caching-and-revalidation` / `/lessons/data-fetching-and-caching`) loads the lesson page with real Sanity data.
- [ ] Breadcrumbs render `All Courses > [Course Title] > [Module Title] > [Lesson Title]`.
- [ ] Left sidebar renders `← Back to course`, course icon/title, progress bar, module counter ("Module 5 of 12"), numbered module accordion with completed checkmarks, and active lesson with "Now playing" indicator.
- [ ] Header renders `LESSON 5.1` badge, Playfair Display title, bookmark button, summary, and metadata row (duration, level, student count).
- [ ] Video player renders responsive 16:9 iframe embed playing the lesson's YouTube/Vimeo video with start timestamp support.
- [ ] Tabs allow switching between `Lesson Content` and `Notes`.
- [ ] Overview section renders Portable Text notes content.
- [ ] "In this lesson you will:" section renders key points with orange checkmark icons.
- [ ] "Pro Tip" callout renders with lightbulb icon and expert tip text.
- [ ] "Resources" section renders resource cards with links that open in new tabs.
- [ ] Bottom navigation renders Previous Lesson and Next Lesson CTA buttons with titles and durations.
- [ ] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass with 0 errors.

---

## 9. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 10. Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000/lessons/nextjs-app-router-in-depth-caching-and-revalidation` (or `/lessons/caching-and-revalidation`).
3. Verify the page matches `design/vertex-lesson.png` exactly:
   - Header with Logo, "Courses", "My Learning", Bell, and User Avatar.
   - Left sidebar with `← Back to course` link, course icon ("N"), progress ("35% complete"), module list (modules 1–4 completed with checkmark icons, module 5 active with orange badge and "Now playing" lesson).
   - Breadcrumbs: `All Courses > Next.js for Production > Data Fetching & Caching > Data Fetching & Caching`.
   - `LESSON 5.1` badge and Playfair Display title with bookmark button.
   - Meta row: `1h 28m`, `Intermediate`, `3,426 students`.
   - Video player: Embedded video playing on the page.
   - Tabs: `Lesson Content` (active) and `Notes`.
   - Overview text, "In this lesson you will:" with 4 checkmark items, Pro Tip callout box with lightbulb, and 3 Resources cards.
   - Bottom navigation: "← Previous Lesson" (Server Components / 1h 42m) and "Next Lesson →" (Authentication / 1h 18m).
4. Test clicking `← Back to course` to verify it navigates to `/courses/nextjs-app-router-in-depth`.
5. Test clicking another lesson in the sidebar to verify navigation between lessons.
6. Test deep-link start seconds: `http://localhost:3000/lessons/nextjs-app-router-in-depth-caching-and-revalidation?start=60` and verify the video starts at 1 minute.
7. Test responsive viewports on mobile (375px), tablet (768px), and desktop (1280px+).
