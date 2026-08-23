# Implementation Prompt: Sanity Content Model, Studio & Data Layer

## 1. Goal
Implement the core Sanity CMS content model and Studio authoring environment for Vertex, including the 5 foundational schemas (`course`, `module`, `lesson`, `instructor`, `category`) and supporting objects (`learningOutcome`, `resource`, `blockContent`). Set up the custom Studio structure, configure the server-side read client with token authentication for private datasets, and implement the GROQ data fetching layer.

---

## 2. Skills & References Read
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)
- `references/schema.md` (`.agents/skills/sanity-best-practices/references/schema.md`)
- `references/groq.md` (`.agents/skills/sanity-best-practices/references/groq.md`)
- `references/nextjs.md` (`.agents/skills/sanity-best-practices/references/nextjs.md`)
- `content-modeling-best-practices` (`.agents/skills/content-modeling-best-practices/SKILL.md`)
- `AGENTS.md` (Sections 5, 6, 7, 8, 12, 13, 14)

---

## 3. Code & Environment Inspected
- `sanity.config.ts`: Configured with `@sanity/vision` and `structureTool`, mounted at `/studio`.
- `sanity/env.ts`: Reads `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`.
- `sanity/schemaTypes/index.ts`: Currently empty (`types: []`).
- `sanity/structure.ts`: Minimal structure resolver with `S.documentTypeListItems()`.
- `sanity/lib/client.ts`: Uses `createClient` from `next-sanity`.
- `sanity/lib/live.ts`: Uses `defineLive` from `next-sanity/live`.
- `.env.local`: Configured with Sanity project ID `k877xljb` and dataset `production`.
- Package dependencies: `sanity@^5.31.2`, `next-sanity@^13.3.3`, `@sanity/image-url@^2.1.1`, `@sanity/icons@^3.8.0`.

---

## 4. Decisions & Assumptions
1. **Schema Modularity**:
   - Split schemas into separate files under `sanity/schemaTypes/documents/` (`course.ts`, `lesson.ts`, `instructor.ts`, `category.ts`) and `sanity/schemaTypes/objects/` (`module.ts`, `learningOutcome.ts`, `resource.ts`, `blockContent.ts`).
   - Use `defineType`, `defineField`, and `defineArrayMember` throughout.
2. **Schema Shapes (per `AGENTS.md` Section 8)**:
   - **Course (`course`)**: Document with `title`, `slug`, `summary`, `coverImage`, `level` (`Beginner`, `Intermediate`, `Advanced`, `All Levels`), `price`, `isPopular`, `studentCount`, `learningOutcomes` (array of `learningOutcome`), `instructor` (reference to `instructor`), `category` (reference to `category`), and `modules` (ordered array of embedded `module` objects).
   - **Module (`module`)**: Embedded object (not a separate document) with `title`, `summary`, and `lessons` (ordered array of references to `lesson`).
   - **Lesson (`lesson`)**: Document with `title`, `slug`, `videoUrl` (url), `thumbnail` (image), `duration` (number in seconds), `isFreePreview` (boolean), `studentCount` (number), `notes` (Portable Text `blockContent`), `keyPoints` (array of strings), `proTip` (text), and `resources` (array of `resource` objects). Parent course is derived via reverse references (`*[_type == "course" && references(^._id)][0]`).
   - **Instructor (`instructor`)**: Document with `name`, `slug`, `photo` (image), `expertise` (string), and `bio` (text).
   - **Category (`category`)**: Document with `title`, `slug`, and `description` (text).
   - **Objects**:
     - `learningOutcome`: `{ icon, title, description }`
     - `resource`: `{ type, title, description, url }` with type selector (`code`, `pdf`, `link`, `repo`, `docs`)
     - `blockContent`: Portable Text array with headings (H2, H3), blockquotes, lists (bullet, number), and decorators (strong, em, code, link).
3. **Studio Custom Structure (`sanity/structure.ts`)**:
   - Group items into Courses, Lessons, Instructors, and Categories with dedicated icons from `@sanity/icons`.
4. **Server-Side Read Client & Data Layer**:
   - `SANITY_API_READ_TOKEN` stays strictly server-side.
   - Client is configured to use `SANITY_API_READ_TOKEN` on the server while keeping browser client tokenless.
   - Create `sanity/lib/queries.ts` containing strongly-typed GROQ queries using `defineQuery` for:
     - `COURSES_QUERY` & `COURSE_BY_SLUG_QUERY`
     - `LESSON_BY_SLUG_QUERY` (with reverse course lookup, module resolution, and previous/next navigation)
     - `INSTRUCTORS_QUERY` & `INSTRUCTOR_BY_SLUG_QUERY` (with associated courses)
     - `CATEGORIES_QUERY` & `CATEGORY_BY_SLUG_QUERY` (with associated courses)
   - Create `sanity/lib/types.ts` with TypeScript interfaces representing all document types and query responses.
5. **Environment Configuration**:
   - Update `.env.example` to document `SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION`.

---

## 5. Files to Touch / Create
- `sanity/schemaTypes/objects/blockContent.ts` (Create)
- `sanity/schemaTypes/objects/learningOutcome.ts` (Create)
- `sanity/schemaTypes/objects/resource.ts` (Create)
- `sanity/schemaTypes/objects/module.ts` (Create)
- `sanity/schemaTypes/documents/category.ts` (Create)
- `sanity/schemaTypes/documents/instructor.ts` (Create)
- `sanity/schemaTypes/documents/lesson.ts` (Create)
- `sanity/schemaTypes/documents/course.ts` (Create)
- `sanity/schemaTypes/index.ts` (Update: register all schemas)
- `sanity/structure.ts` (Update: custom Studio structure with icons)
- `sanity/env.ts` (Update: export server token helper)
- `sanity/lib/client.ts` (Update: server-side token & CDN configuration)
- `sanity/lib/live.ts` (Update: serverToken configuration)
- `sanity/lib/queries.ts` (Create: GROQ queries for catalog, courses, lessons, instructors, categories)
- `sanity/lib/types.ts` (Create: TypeScript type definitions for Sanity data)
- `.env.example` (Update: include Sanity environment variables)

---

## 6. Security Considerations
- `SANITY_API_READ_TOKEN` must never be prefixed with `NEXT_PUBLIC_` and must never be exposed to the client bundle.
- In `sanity/lib/live.ts`, `browserToken` is omitted so client bundle remains tokenless.
- Server data access runs exclusively in Server Components or API routes.

---

## 7. Acceptance Criteria
- [ ] All 5 schemas (`course`, `module`, `lesson`, `instructor`, `category`) and 3 object types are implemented using `defineType`, `defineField`, and `defineArrayMember`.
- [ ] Field shapes, validations, slugs, and relations match the specifications in `AGENTS.md` Section 8.
- [ ] Studio structure in `sanity/structure.ts` organizes the document types cleanly with `@sanity/icons`.
- [ ] `sanity/schemaTypes/index.ts` cleanly exports all types into `sanity.config.ts`.
- [ ] `sanity/lib/client.ts` and `sanity/lib/live.ts` support server-side token authentication for private datasets.
- [ ] `sanity/lib/queries.ts` contains typed GROQ queries for courses, lessons (with reverse course lookup), instructors, and categories.
- [ ] `sanity/lib/types.ts` provides complete TypeScript types for schema entities and query payloads.
- [ ] `.env.example` contains documented Sanity env variables.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` succeed with no errors.

---

## 8. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 9. Manual Test Steps
1. Run `npm run dev` and navigate to `http://localhost:3000/studio`.
2. Verify the Studio loads with custom structure showing Courses, Lessons, Instructors, and Categories.
3. Test creating a Category, Instructor, Lesson, and Course in the Studio.
4. Verify embedded Modules inside Course can reference created Lessons.
5. Verify Studio input validations (required fields, slugs, price min, duration, etc.) and preview formats.
