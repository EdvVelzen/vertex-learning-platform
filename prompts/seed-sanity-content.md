# Implementation Prompt: Seed Sanity Content Model & Dataset

## 1. Goal
Seed the Sanity CMS `production` dataset using the provided `scripts/seed/seed.ndjson` and `scripts/seed/videos.json` files without generating synthetic content or modifying the source seed files. Import all documents and image assets using the Sanity CLI, align Studio schemas and Next.js data layer projections with the seed content structure, and verify the resulting document counts and reference integrity.

---

## 2. Skills & References Read
- `sanity-migration` (`.agents/skills/sanity-migration/SKILL.md`)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)
- `references/schema.md` (`.agents/skills/sanity-best-practices/references/schema.md`)
- `references/groq.md` (`.agents/skills/sanity-best-practices/references/groq.md`)
- `AGENTS.md` (Sections 5, 8, 9, 12, 13, 14)

---

## 3. Code & Environment Inspected
- `scripts/seed/seed.ndjson`: 141 documents (6 categories, 5 instructors, 120 lessons, 10 courses). References external image assets (`_sanityAsset: "image@https://..."`), embedded modules, key points, learning outcomes, resources, and Portable Text notes/bios.
- `scripts/seed/videos.json`: 120 video metadata entries mapping 1:1 to lesson slugs, containing YouTube video IDs, durations, channels, and search queries.
- `studio/sanity.cli.ts` & `studio/sanity.config.ts`: Configured with project ID `k877xljb` and dataset `production`.
- `studio/schemaTypes/`: Document schemas (`category.ts`, `course.ts`, `instructor.ts`, `lesson.ts`) and object schemas (`module.ts`, `learningOutcome.ts`, `resource.ts`, `blockContent.ts`).
- `sanity/lib/queries.ts` & `sanity/lib/types.ts`: Application GROQ queries and TypeScript type definitions.
- Sanity CLI: Authenticated as Administrator on project `k877xljb`.

---

## 4. Decisions & Assumptions
1. **Zero Modification to Seed Files**:
   - `scripts/seed/seed.ndjson` and `scripts/seed/videos.json` will remain completely untouched.
2. **Schema Alignment for Seeded Data**:
   - **`course.ts`**: Update `popular` field (and/or `isPopular` alias) to match the seeded `"popular": true|false` property; add lowercase skill level options (`beginner`, `intermediate`, `advanced`, `all-levels`) alongside capitalized options so validation passes for imported courses.
   - **`lesson.ts`**: Update `freePreview` field (and/or `isFreePreview` alias) to match the seeded `"freePreview": true|false` property.
   - **`instructor.ts`**: Update `expertise` to an array of strings (`type: 'array', of: [{ type: 'string' }]`) and `bio` to Portable Text (`type: 'blockContent'` or array of blocks) matching the seed structure.
3. **Data Layer Compatibility**:
   - Update `sanity/lib/queries.ts` to use `coalesce(isPopular, popular, false)` and `coalesce(isFreePreview, freePreview, false)` ensuring robust forward and backward compatibility.
   - Update `sanity/lib/types.ts` to support `expertise: string[] | string` and `bio?: PortableTextBlock[] | string`.
4. **Sanity CLI Import**:
   - Run `npx sanity datasets import ../scripts/seed/seed.ndjson production --replace` from the `studio` workspace.
   - The Sanity CLI will automatically fetch and upload remote `_sanityAsset` URLs into Sanity image assets.
5. **Verification**:
   - Execute GROQ count queries to verify exact counts:
     - `category`: 6
     - `instructor`: 5
     - `lesson`: 120
     - `course`: 10
     - Total content documents: 141

---

## 5. Files to Touch / Create
- `studio/schemaTypes/documents/course.ts` (Align `popular` and `level` values)
- `studio/schemaTypes/documents/lesson.ts` (Align `freePreview`)
- `studio/schemaTypes/documents/instructor.ts` (Align `expertise` array and `bio` blockContent)
- `sanity/lib/types.ts` (Update TypeScript interfaces)
- `sanity/lib/queries.ts` (Update query projections)

---

## 6. Requirements
- Seed Sanity dataset `production` from `scripts/seed/seed.ndjson` and `scripts/seed/videos.json`.
- Use the Sanity CLI dataset import.
- Verify document counts after import.
- Do not modify `scripts/seed/seed.ndjson` or `scripts/seed/videos.json`.

---

## 7. Security Considerations
- Sanity CLI executes authenticated operations using active session credentials.
- No write tokens or private keys are exposed to client-side code.
- Dataset access rules and environment variables remain secure.

---

## 8. Acceptance Criteria
- [ ] Sanity dataset import finishes with 0 errors and all assets processed.
- [ ] Document counts in Sanity match the seed files:
  - 6 categories
  - 5 instructors
  - 120 lessons
  - 10 courses
  - 141 total content documents
- [ ] All lesson video URLs, durations, and thumbnails match `videos.json` and `seed.ndjson`.
- [ ] Studio schemas validate all imported documents without warnings or errors.
- [ ] Type check and lint pass cleanly in both `studio` and `web` workspaces.

---

## 9. Checks to Run
- `npm run --prefix studio typegen` or schema validation check
- `npx sanity datasets import ../scripts/seed/seed.ndjson production --replace` (in `studio`)
- `npx sanity documents query "*[_type in ['category','instructor','lesson','course']]{ _type }"` (in `studio`)
- `npx tsc --noEmit` in root
- `npm run lint` in root

---

## 10. Manual Test Steps
1. Execute the Sanity CLI import command.
2. Query document counts via GROQ:
   - `count(*[_type == "category"])` -> 6
   - `count(*[_type == "instructor"])` -> 5
   - `count(*[_type == "lesson"])` -> 120
   - `count(*[_type == "course"])` -> 10
3. Query a sample course with references to inspect populated modules, lessons, instructors, and categories.
4. Run `npm run build` and `npm run dev:studio` to ensure the Studio loads and renders the imported documents.
