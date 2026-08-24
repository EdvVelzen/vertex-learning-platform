# Implementation Prompt: Vertex Course Page

## 1. Goal
Implement the **Vertex Course Detail Page** (`app/courses/[slug]/page.tsx`) matching the visual design specification in `design/vertex-course.png` and wired to seeded Sanity CMS course content. The course page features:
1. **Header Navigation Bar**: Vertex logo, navigation links ("Courses", "My Learning"), notifications bell, and Clerk learner avatar.
2. **Breadcrumb Navigation**: "All Courses" link > current course title.
3. **Hero Section**:
   - Course cover / brand icon card (black square with stylized "N" logo for Next.js or dynamic course image).
   - "POPULAR" badge (light orange background, bold uppercase, displayed when course is popular).
   - Large serif course title (Playfair Display) and course summary.
   - Metadata row displaying level (e.g., "Intermediate"), total course duration (e.g., "18h 24m"), module count (e.g., "12 modules"), and student count (e.g., "2.1k students").
   - Action buttons: Primary CTA ("Continue Learning ->") linking to the next/first lesson, and Secondary CTA ("Bookmark").
4. **"What you'll learn" Section**:
   - Section heading in Playfair Display.
   - 2x2 grid of learning outcome cards with orange outlined icons (`layers`, `database`, `gauge`, `cloud`, etc.), titles, and descriptions sourced from Sanity `learningOutcomes`.
5. **"Course Content" Section**:
   - Section header with total module count and total course duration (`X modules • Xh Xm`).
   - Accordion list of course modules with circular module index badges, module titles, summaries, module durations, expand/collapse chevrons, and detailed lesson breakdowns.
   - "Show all X modules" expandable toggle when modules exceed the initial preview count.
6. **Bottom Progress Bar & Sticky Footer**:
   - Floating / sticky progress card showing "Your Progress" (e.g. "35% complete"), an orange progress bar, and a "Continue Learning ->" CTA button.
   - Bottom warm gradient atmospheric visual matching the platform design language.

---

## 2. Skills & References Read
- `AGENTS.md`: Platform architecture, strict visual reproduction of `design/vertex-course.png`, responsive design, server/client boundaries, and verification workflow.
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`): GROQ query optimization, type-safe data fetching, and Next.js App Router integration.
- `portable-text-serialization` (`.agents/skills/portable-text-serialization/SKILL.md`): Portable Text rendering standards.
- `design/vertex-course.png`: Source of truth for layout, typography, colors, spacing, badge styles, and card aesthetics.
- `design/vertex-designsystem.png`: Token reference for colors (`primary-500 #F97316`, `neutral-50 #FAFAFC`, `neutral-900 #0F172A`), fonts (`Playfair Display`, `Inter`), buttons, badges, and progress bars.

---

## 3. Code & Environment Inspected
- `sanity/lib/queries.ts`: `COURSE_BY_SLUG_QUERY` and `COURSE_SLUGS_QUERY` for fetching course hierarchy, learning outcomes, modules, and lessons.
- `sanity/lib/types.ts`: `CourseDetail`, `Module`, `LessonSummary`, `LearningOutcome`, `Category`, `Instructor` types.
- `sanity/lib/client.ts`: Sanity client configured for server-side data fetching with token auth and published perspective.
- `components/ui/navbar.tsx`: Header navigation component with Clerk auth state support.
- `components/ui/breadcrumbs.tsx`: Breadcrumb component with Chevron separators.
- `components/ui/button.tsx`: Primary, secondary, tertiary button variants.
- `components/ui/badge.tsx`: Popular badge pill styling.
- `components/ui/progress-bar.tsx`: Progress bar component.
- Sanity CMS: Seeded with 10 courses, 120 lessons, 5 instructors, and 6 categories.

---

## 4. Decisions & Assumptions
1. **Routing & Server Component Architecture**:
   - Create `app/courses/[slug]/page.tsx` as an async Next.js Server Component that fetches course details from Sanity via `COURSE_BY_SLUG_QUERY`.
   - Implement `generateStaticParams` using `COURSE_SLUGS_QUERY` to support static generation for all seeded courses.
   - Support slug aliasing in `COURSE_BY_SLUG_QUERY` so `/courses/nextjs-for-production` seamlessly resolves to `nextjs-app-router-in-depth` (or matches exact slug).
   - If a course is not found, return `notFound()` from `next/navigation`.
2. **Component Breakdown**:
   - `components/course/course-hero.tsx`: Course metadata, brand icon/cover image, popular badge, and primary action buttons.
   - `components/course/what-youll-learn.tsx`: 2x2 grid displaying learning outcomes with mapped Lucide icons (`Layers`, `Database`, `Gauge`, `Cloud`, `Shield`, `Rocket`, `Workflow`, `Sparkles`, `Code`, `Puzzle`).
   - `components/course/course-curriculum.tsx`: Interactive client component for expanding/collapsing module accordions, listing individual lessons with durations, preview badges, and a "Show all modules" expand toggle.
   - `components/course/course-progress-bar.tsx`: Bottom sticky progress bar with learner progress indication and "Continue Learning" CTA.
3. **Helper Utilities**:
   - Create `lib/formatters.ts` (or duration helper) to format seconds/minutes into human-readable strings (e.g. `18h 24m`, `45m`, `1h 12m`) and student counts (e.g. `2.1k`, `18.2k`).
4. **Visual Fidelity**:
   - Match exact fonts (`Playfair Display` for course headline and section titles, `Inter` for body/metadata).
   - Use exact theme colors (`#FAFAFC` background, `#F97316` primary orange, `#EA580C` hover, neutral borders and badges).
   - Implement the bottom warm gradient equalizer visual at the base of the page.
   - Fully responsive down to mobile viewports (stacking columns, adjusting accordion padding).

---

## 5. Files to Create / Modify
- `sanity/lib/queries.ts`: Refine `COURSE_BY_SLUG_QUERY` to include slug alias fallback and ensure all module/lesson fields are projected.
- `lib/formatters.ts`: Helper functions for duration formatting and number abbreviation.
- `components/course/course-hero.tsx`: Course hero component.
- `components/course/what-youll-learn.tsx`: Learning outcomes section component.
- `components/course/course-curriculum.tsx`: Module accordion and lesson list component.
- `components/course/course-progress-bar.tsx`: Floating progress bar component.
- `app/courses/[slug]/page.tsx`: Course Detail page server component integrating Sanity data.
- `app/courses/page.tsx`: Catalog overview page so navigation to `/courses` renders courses cleanly.

---

## 6. Requirements
- Reproduce the exact layout, typography, colors, and states from `design/vertex-course.png`.
- Wire the page with real data fetched from Sanity CMS via server-side client.
- Ensure all interactive elements (accordion expansion, "Show all modules", bookmark toggle, lesson links, continue learning CTA) function properly.
- Keep server and client boundaries clean: data fetching on the server, UI interactions in client subcomponents.
- Fully responsive across desktop, tablet, and mobile screens.

---

## 7. Security Considerations
- Read token is kept exclusively on the server in `sanity/env.ts` / `sanity/lib/client.ts`.
- No client components receive or expose CMS private tokens or API secrets.
- Input slug parameter is safely validated with GROQ parameters.

---

## 8. Acceptance Criteria
- [ ] Navigating to `/courses/nextjs-for-production` or `/courses/nextjs-app-router-in-depth` loads the course page with real Sanity data.
- [ ] Breadcrumbs render "All Courses > [Course Title]".
- [ ] Hero section displays course title in Playfair Display, summary, popular badge (if popular), level, formatted duration, module count, student count, and CTA buttons.
- [ ] "What you'll learn" section renders the 4 learning outcome cards with corresponding orange icons and descriptions.
- [ ] "Course Content" section displays the list of modules with circular numbers, titles, summaries, durations, and expandable lesson list.
- [ ] Modules expand/collapse on click to reveal lesson items with duration and free preview indicators.
- [ ] "Show all X modules" button toggles viewing all modules when more than 6 exist.
- [ ] Bottom sticky progress bar displays learner progress and "Continue Learning" button.
- [ ] Responsive design functions smoothly on mobile, tablet, and desktop viewports.
- [ ] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass with 0 errors.

---

## 9. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 10. Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000/courses/nextjs-for-production` (or `http://localhost:3000/courses/nextjs-app-router-in-depth`).
3. Verify the page layout matches `design/vertex-course.png` exactly:
   - Header with Logo, "Courses", "My Learning", Bell, and User Avatar.
   - Breadcrumbs: "All Courses > Next.js for Production".
   - Hero section with Next.js icon card, "POPULAR" badge, Playfair Display title, summary, meta stats (Intermediate, 18h 24m, 12 modules, 2.1k students), "Continue Learning" and "Bookmark" buttons.
   - "What you'll learn" container with 4 cards with orange icons (`App Router Foundations`, `Data Fetching & Caching`, `Performance Optimization`, `Deployment & Scaling`).
   - "Course Content" section with module count and duration header, numbered module cards with durations and chevrons.
   - Click a module to expand and verify individual lessons are revealed with durations and preview flags.
   - Click "Show all modules" and verify list expands/collapses.
   - Inspect the bottom sticky progress bar with 35% progress and "Continue Learning" CTA.
4. Test navigating from `/` (Home page) by clicking the "Next.js for Production" card.
5. Test responsive viewports on mobile (375px), tablet (768px), and desktop (1280px+).
