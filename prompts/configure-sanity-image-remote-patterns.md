# Implementation Prompt: Configure Sanity Image Remote Patterns in Next.js

## 1. Goal
Fix the Next.js runtime error `Invalid src prop on next/image, hostname "cdn.sanity.io" is not configured under images in your next.config.js` by configuring Sanity CDN (`cdn.sanity.io`) in `next.config.ts` under `images.remotePatterns`.

---

## 2. Skills & References Read
- `AGENTS.md`: Data layer and Next.js guidelines (App Router, Sanity Studio with `next-sanity`, `@sanity/image-url`).
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/references/image.md` & `references/nextjs.md`): Sanity image assets URL structure and `next/image` integration patterns.
- Next.js Documentation on Unconfigured Host: https://nextjs.org/docs/messages/next-image-unconfigured-host

---

## 3. Code & Environment Inspected
- `next.config.ts`: Contains empty `nextConfig: NextConfig = {}`.
- `components/course/course-hero.tsx`: Uses `next/image` with `urlFor(course.coverImage)` generating URLs hosted on `cdn.sanity.io`.
- `app/courses/[slug]/page.tsx`: Course detail page rendering `CourseHero`.

---

## 4. Decisions & Assumptions
1. **Remote Patterns Configuration**:
   - Update `next.config.ts` to add `images.remotePatterns` allowing images from `https://cdn.sanity.io/**`.
2. **Standard Configuration**:
   - Use `{ protocol: "https", hostname: "cdn.sanity.io" }` in `images.remotePatterns`, which supports all Sanity CDN project asset URLs.

---

## 5. Files to Create / Modify
- `next.config.ts`: Add `images.remotePatterns` with `cdn.sanity.io`.

---

## 6. Requirements
- Next.js `<Image />` components must be able to load and optimize images from `cdn.sanity.io` without throwing runtime errors.
- The configuration must conform to Next.js 15+ / 16+ `NextConfig` type definitions.

---

## 7. Security Considerations
- Restrict remote patterns specifically to `cdn.sanity.io` with `https` protocol to avoid opening image optimization endpoints to arbitrary unvetted hostnames.

---

## 8. Acceptance Criteria
- [ ] `next.config.ts` includes `cdn.sanity.io` under `images.remotePatterns`.
- [ ] TypeScript check (`npx tsc --noEmit`) passes with 0 errors.
- [ ] ESLint check (`npm run lint`) passes with 0 errors.
- [ ] Next.js production build (`npm run build`) compiles successfully.
- [ ] Course detail pages (`/courses/[slug]`) and any component rendering Sanity images load without `Invalid src prop` runtime errors.

---

## 9. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 10. Manual Test Steps
1. Restart/run dev server: `npm run dev`.
2. Navigate to `http://localhost:3000/courses/<slug>` (e.g. `nextjs-for-production` or another course with a Sanity cover image).
3. Verify that the course cover image renders properly and no console or runtime error is thrown for `cdn.sanity.io`.
