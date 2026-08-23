# Implementation Prompt: Standalone Sanity Studio Workspace & Server-Only Read Layer

## 1. Goal
Refactor the Sanity architecture into two decoupled parts per Sanity best practices and `AGENTS.md`:
1. **Standalone Sanity Studio Workspace (`studio/`)**: A dedicated Vite-powered Studio app holding the content schemas (`course`, `module`, `lesson`, `instructor`, `category`, and supporting objects), custom desk structure, and Sanity CLI/TypeGen configuration.
2. **Server-Only Read Data Layer (`web` / Next.js)**: A server-only Sanity client, fetch helpers, and typed GROQ queries inside the web app, with the embedded Studio route (`app/studio/[[...tool]]/page.tsx`) removed and zero tokens exposed to the browser.

---

## 2. Skills & References Read
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)
- `references/project-structure.md` (`.agents/skills/sanity-best-practices/references/project-structure.md`)
- `references/nextjs.md` (`.agents/skills/sanity-best-practices/references/nextjs.md`)
- `references/typegen.md` (`.agents/skills/sanity-best-practices/references/typegen.md`)
- `references/schema.md` (`.agents/skills/sanity-best-practices/references/schema.md`)
- `references/groq.md` (`.agents/skills/sanity-best-practices/references/groq.md`)
- `AGENTS.md` (Sections 1, 5, 6, 7, 8, 12, 13)

---

## 3. Code & Environment Inspected
- Current setup has schemas, `sanity.config.ts`, and `app/studio/[[...tool]]/page.tsx` mixed into the Next.js app root.
- `AGENTS.md` Section 5 strictly mandates:
  > "The project is two standalone workspaces in one repo. Build it this way and do not embed the Studio inside Next.js. Keeping them separate is what preserves independent deploys, Studio auto updates, and TypeGen."
- `AGENTS.md` Section 6 & 12:
  > "Do not use... an embedded Studio, a public dataset, a client side token, or a separate backend framework."
- Dependencies: `sanity`, `@sanity/vision`, `next-sanity`, `@sanity/icons`, `@sanity/image-url`.

---

## 4. Decisions & Assumptions
1. **Studio Workspace (`studio/`)**:
   - Standalone directory containing:
     - `package.json`: Studio dependencies (`sanity`, `@sanity/vision`, `@sanity/icons`, `react`, `react-dom`, `styled-components`, `typescript`).
     - `sanity.config.ts`: Studio configuration referencing schemas and structure.
     - `sanity.cli.ts`: CLI config targeting project `k877xljb` / `production`, with TypeGen enabled to scan `../sanity/lib/queries.ts` and output `../sanity.types.ts`.
     - `tsconfig.json`: TypeScript configuration for Studio.
     - `schemaTypes/`: All 5 schemas (`course`, `lesson`, `instructor`, `category`, `module`) and object types (`learningOutcome`, `resource`, `blockContent`).
     - `structure.ts`: Desk structure with icons from `@sanity/icons`.
2. **Web Data Layer (`sanity/` in Next.js)**:
   - Remove embedded Studio route: `app/studio/[[...tool]]/page.tsx`.
   - Remove Studio configuration and schemas from Next.js root.
   - Retain server-only data layer:
     - `sanity/env.ts`: Project ID, Dataset, API version, server token.
     - `sanity/lib/client.ts`: Server client with `token`, `useCdn`, and `perspective: 'published'`.
     - `sanity/lib/live.ts`: `defineLive` with `serverToken` and `browserToken: undefined`.
     - `sanity/lib/queries.ts`: Typed GROQ queries with `defineQuery`.
     - `sanity/lib/image.ts`: Image URL builder helper.
     - `sanity/lib/types.ts`: TypeScript entity & query result interfaces.
3. **Workspace Scripts**:
   - Update root `package.json` to provide clear commands:
     - `npm run dev`: Runs Next.js web dev server.
     - `npm run dev:studio`: Runs standalone Studio dev server.
     - `npm run build`: Builds Next.js web app.
     - `npm run build:studio`: Builds standalone Studio.
     - `npm run typegen`: Extracts schema and generates TypeScript types.

---

## 5. Files to Touch / Create / Remove
- **Create**:
  - `studio/package.json`
  - `studio/sanity.config.ts`
  - `studio/sanity.cli.ts`
  - `studio/tsconfig.json`
  - `studio/structure.ts`
  - `studio/schemaTypes/index.ts`
  - `studio/schemaTypes/documents/course.ts`
  - `studio/schemaTypes/documents/lesson.ts`
  - `studio/schemaTypes/documents/instructor.ts`
  - `studio/schemaTypes/documents/category.ts`
  - `studio/schemaTypes/objects/module.ts`
  - `studio/schemaTypes/objects/learningOutcome.ts`
  - `studio/schemaTypes/objects/resource.ts`
  - `studio/schemaTypes/objects/blockContent.ts`
- **Remove**:
  - `app/studio/[[...tool]]/page.tsx` (and `app/studio` folder)
  - `sanity.config.ts` (from web root)
  - `sanity.cli.ts` (from web root)
  - `sanity/schemaTypes/` (from web root)
  - `sanity/structure.ts` (from web root)
- **Update**:
  - `package.json` (add studio scripts)
  - `.env.example` (clarify Studio vs Web env variables)

---

## 6. Security Considerations
- Zero Sanity tokens exist in client-side bundles.
- Web app data fetching is purely server-side via `sanity/lib/client.ts` and `sanity/lib/live.ts`.
- Studio runs on its own port with authenticated Sanity login and credentials.

---

## 7. Acceptance Criteria
- [ ] Standalone Studio workspace is created at `studio/` with its own `package.json`, `sanity.config.ts`, `sanity.cli.ts`, and full schema definitions.
- [ ] Embedded Studio route (`app/studio/`) is completely removed from Next.js.
- [ ] Web workspace data layer (`sanity/lib/`) is clean, server-only, and token-safe.
- [ ] Scripts in `package.json` allow running both web and studio independently.
- [ ] `npm run build` in web succeeds with 0 errors.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.

---

## 8. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## 9. Manual Test Steps
1. Navigate to `studio/` and verify `npm run dev` starts the standalone Studio on port 3333.
2. In the root, run `npm run dev` and verify the web app starts on port 3000.
3. Verify `http://localhost:3000/studio` returns 404 (confirming it is not embedded).
4. Run `npm run build` to verify the web app builds cleanly.
