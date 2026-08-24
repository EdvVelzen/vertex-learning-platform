# Implementation Prompt: Render Course Cover Images in Catalog & Home Pages

## 1. Goal
Fix the course cards on the **All Courses** page (`app/courses/page.tsx`) and the **Home** page (`app/page.tsx`) so that they display the Sanity CMS `coverImage` using `next/image` and `urlFor()` when present on a course, while maintaining the styled technology/brand badge fallbacks when no cover image asset exists.

---

## 2. Skills & References Read
- `AGENTS.md`: UI fidelity, standalone Sanity Studio data access via Next.js server components, `next-sanity`, `@sanity/image-url`.
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/references/image.md` & `references/nextjs.md`): Schema image references, `urlFor` image URL builder, responsive image sizing, and `next/image` integration.
- `design/vertex-home.png` & `design/vertex-course.png`: Card visual standards, 14px border radius, square thumbnail container.

---

## 3. Code & Environment Inspected
- `app/courses/page.tsx`: Fetches courses via `COURSES_QUERY` (which already includes `coverImage`), but unconditionally renders hardcoded letter/emoji badges (N, 🐳, TS) instead of checking `course.coverImage`.
- `app/page.tsx`: Contains `getCourseIcon()` which checks course slug/title keywords and renders hardcoded icons without checking `course.coverImage?.asset`.
- `components/cards/course-card.tsx`: Accepts an `icon` React node to render in the card header.
- `sanity/lib/image.ts`: Configured `urlFor` image helper with project ID and dataset.
- `next.config.ts`: Already configured with `cdn.sanity.io` in `images.remotePatterns`.

---

## 4. Decisions & Assumptions
1. **Reusable Component `CourseIcon`**:
   - Create `components/course/course-icon.tsx` to standardize thumbnail and badge rendering across all course listings.
   - Priority order:
     1. If `course.coverImage?.asset` is defined, render an optimized `<Image />` via `urlFor(course.coverImage).width(112).height(112).url()` inside a `w-14 h-14 rounded-[14px] overflow-hidden` container.
     2. If no `coverImage?.asset`, render the existing stylized brand/technology icon (Next.js "N", Docker whale, TypeScript "TS", AI, Python "Py", PostgreSQL "PG", or the first letter of the course title).
2. **Catalog & Home Page Integration**:
   - Replace the custom icon generation logic in `app/courses/page.tsx` and `app/page.tsx` with `<CourseIcon course={course} />`.
   - Ensure the layout, aspect ratio, border radius (`rounded-[14px]`), and hover states match the design system and existing styling.

---

## 5. Files to Create / Modify
- `components/course/course-icon.tsx`: New component to render cover image or fallback icon.
- `app/courses/page.tsx`: Update course mapping to pass `<CourseIcon course={course} />` to `CourseCard`.
- `app/page.tsx`: Update course mapping to pass `<CourseIcon course={course} />` to `CourseCard`.

---

## 6. Requirements
- The All Courses page (`/courses`) and Home page (`/`) must display Sanity cover images when available on courses.
- If a course does not have a cover image in Sanity, it must gracefully fallback to the styled technology/brand badge or initial letter.
- Image assets must be loaded from Sanity CDN and optimized via `next/image`.
- Responsive layout, typography, and card dimensions must remain consistent with the design specifications.

---

## 7. Security Considerations
- Images are served strictly through the approved Sanity CDN remote pattern (`cdn.sanity.io`).
- All image URLs are generated server-side using the type-safe `urlFor` builder.

---

## 8. Acceptance Criteria
- [ ] Courses with Sanity `coverImage` assets render their image in `CourseCard` on `/courses` and `/`.
- [ ] Courses without `coverImage` display the appropriate technology badge fallback.
- [ ] TypeScript check (`npx tsc --noEmit`) passes with 0 errors.
- [ ] ESLint check (`npm run lint`) passes with 0 errors.
- [ ] Production build (`npm run build`) passes cleanly.

---

## 9. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 10. Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000/courses` and verify that courses with cover images in Sanity show their image in the 56x56px thumbnail container.
3. Open `http://localhost:3000/` and verify the featured course cards display cover images when available.
4. Click through to a course detail page (`/courses/[slug]`) and verify continuity between the catalog thumbnail and hero cover image.
