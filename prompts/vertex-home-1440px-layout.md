# Implementation Prompt: Adjust Main Content Width to 1440px

## Goal
Adjust the Vertex Home Page layout and container structure so that the main content container and header navigation expand to take **~1440px** (`max-w-[1440px]`), providing a spacious, high-resolution desktop presentation matching the design system specifications and user requirements.

---

## Skills and Reference Material Read
- `AGENTS.md`: UI fidelity, responsive layout adaptation, and execution workflow.
- `design/vertex-home.png`: Home page reference layout.
- `design/vertex-designsystem.png`: Design system container scale.

---

## Code and Configuration Inspected
- `app/page.tsx`: Main content wrapper currently set to `max-w-[1180px]`.
- `components/ui/navbar.tsx`: Header container currently set to edge-to-edge with padding.

---

## Decisions & Assumptions
1. **Content Container Width**: Update the main content container in `app/page.tsx` from `max-w-[1180px]` to `max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12`.
2. **Navbar Alignment**: Structure `Navbar` (`components/ui/navbar.tsx`) to contain an inner centered `max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12` container so the brand logo and right-hand actions align with the main content boundaries.
3. **Hero & Course Cards Scaling**: Keep hero text and search bar pleasantly centered with optimal line lengths, while letting the 3-column Course Cards grid and bottom equalizer artwork span the full 1440px grid space cleanly.
4. **Bottom Graphic Scaling**: Update the bottom atmospheric equalizer container to `max-w-[1440px] mx-auto w-full`.

---

## Files to Create / Modify
- `app/page.tsx`: Adjust main content wrapper and sections to `max-w-[1440px]`.
- `components/ui/navbar.tsx`: Wrap navbar inner content in `max-w-[1440px] mx-auto`.

---

## Security Considerations
- Pure layout and styling changes; no security implications.

---

## Acceptance Criteria
- [ ] Main content wrapper in `app/page.tsx` is centered and constrained to `max-w-[1440px]`.
- [ ] Navbar inner contents align with the 1440px content container.
- [ ] 3-column course grid and footer artwork scale across the 1440px width.
- [ ] Mobile and tablet responsiveness remains intact.
- [ ] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Exact Manual Test Steps
1. Run `npm run dev` and navigate to `http://localhost:3000`.
2. Open browser on a 1440px+ wide display (or inspect in DevTools at 1440px / 1920px).
3. Confirm that the navbar contents, hero section, course cards grid, and footer notice span up to ~1440px with balanced padding.
4. Verify responsive collapse when resizing down to tablet and mobile viewports.
