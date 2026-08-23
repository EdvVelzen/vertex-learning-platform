# Implementation Prompt: Vertex Home Page

## Goal
Implement the **Vertex Home Page** (`app/page.tsx`) matching the visual design specification in `design/vertex-home.png`. The home page features:
1. **Header Navigation Bar**: Vertex Logo, navigation links ("Courses", "My Learning"), notifications bell icon button, and learner avatar.
2. **Hero Section**: "INTELLIGENT LEARNING" pill badge, large serif headline ("Search your learning in plain English."), descriptive subtitle, primary CTA button ("Explore Courses ->"), and centered interactive search input ("Ask anything about your learning..." with `⌘ K` keyboard shortcut).
3. **All Courses Section**: Section header with "All Courses" title and "View all courses ->" link, responsive 3-column grid of Course Cards (Next.js for Production, Docker Essentials, TypeScript Deep Dive) with top-aligned icons, titles, summaries, and footer metadata (level, duration, modules).
4. **Footer Notice & Artwork**: Centered update notice ("New courses and lessons added every week." with orange star icon and divider lines), and bottom warm gradient equalizer visual effect.

---

## Skills and Reference Material Read
- `AGENTS.md`: Platform architecture, strict UI fidelity without inventing new elements or redesigning, mobile responsiveness, component reuse, and execution workflow.
- `design/vertex-home.png`: Primary source of truth for layout, typography, colors, spacing, card content, search bar styling, and bottom decorative artwork.
- `design/vertex-designsystem.png`: Token reference for colors (`primary-500 #F97316`, `neutral-50 #FAFAFC`, `neutral-900 #0F172A`), typography (`Playfair Display`, `Inter`), buttons, inputs, and cards.

---

## Code and Configuration Inspected
- `app/layout.tsx`: Configured with `Inter` (`--font-inter`) and `Playfair_Display` (`--font-playfair`) fonts, antialiased base styles.
- `app/globals.css`: Theme tokens for colors, font families, radius, and shadows.
- `components/ui/navbar.tsx`: Header navigation bar component.
- `components/ui/logo.tsx`: Vertex faceted V logo brand mark.
- `components/ui/button.tsx`: Primary, secondary, tertiary, text button variants.
- `components/ui/input.tsx`: Search input with icon and shortcut support.
- `components/cards/course-card.tsx`: Course card component with level, duration, and module meta.
- `app/page.tsx`: Current placeholder page to be replaced with the full home page implementation.

---

## Decisions & Assumptions
1. **Layout Structure**: Use a centered container (`max-w-[1140px] mx-auto px-6 sm:px-8`) on top of the neutral background `#FAFAFC` matching `vertex-home.png`.
2. **Navbar Enhancement**: Enhance `Navbar` (`components/ui/navbar.tsx`) to support right-side actions: notifications bell icon button and user avatar, matching the header across all designs (`vertex-home.png`, `vertex-course.png`, `vertex-search.png`, `vertex-lesson.png`).
3. **CourseCard Enhancement**: Enhance `CourseCard` (`components/cards/course-card.tsx`) with an `orientation` prop (`"vertical"` | `"horizontal"`, defaulting to `"vertical"` for grid layouts) so that icons appear cleanly on top of the title and summary as shown in `vertex-home.png`, while maintaining compatibility with the design system showcase.
4. **Interactive Search Input**: The hero search bar will support keyboard shortcut (`⌘ K` / `Ctrl+K` focus) and form submit / Enter key navigation to the search results page (`/search?q=...`).
5. **Bottom Graphic**: Construct the bottom warm atmospheric equalizer graphic using responsive CSS gradient bars with varying heights and soft blur, accurately mirroring the footer artwork in `vertex-home.png`.
6. **Responsive Design**: Ensure desktop layout is an exact reproduction while adapting gracefully down to mobile screens (stacking grid columns, fluid search bar width, wrapping header items).

---

## Files to Create / Modify
- `components/ui/navbar.tsx`: Add notification bell button, user avatar, and navigation styling.
- `components/cards/course-card.tsx`: Support vertical layout with top-positioned brand icons (Next.js, Docker, TypeScript).
- `app/page.tsx`: Full implementation of the Vertex Home Page reproducing `design/vertex-home.png`.
- `app/layout.tsx`: Update metadata title to "Vertex — Intelligent Learning Platform".

---

## Security Considerations
- All rendered data and UI elements are client/server safe with no sensitive keys exposed.
- User input in the search bar is sanitized and safely encoded when navigating.
- Proper accessibility attributes (`aria-label`, button semantics, keyboard focus states).

---

## Acceptance Criteria
- [ ] Header renders the Vertex logo, "Courses" and "My Learning" links, notification bell, and user avatar.
- [ ] Hero section displays the "INTELLIGENT LEARNING" badge, "Search your learning in plain English." serif headline, subtitle, "Explore Courses ->" CTA button, and search input with `⌘ K` shortcut.
- [ ] Search input supports focusing on shortcut (`Cmd+K`/`Ctrl+K`) and navigating to `/search?q=...` on submit.
- [ ] "All Courses" section displays the title, "View all courses ->" link, and 3 course cards ("Next.js for Production", "Docker Essentials", "TypeScript Deep Dive") with accurate icons, descriptions, and footer metadata.
- [ ] Weekly update notice with orange star icon and horizontal dividers is rendered below the cards.
- [ ] Warm orange gradient footer artwork is rendered at the base of the page.
- [ ] Fully responsive on mobile, tablet, and desktop screens.
- [ ] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`) all pass with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Exact Manual Test Steps
1. Run `npm run dev` and navigate to `http://localhost:3000`.
2. Verify top navigation bar contains Vertex logo, "Courses", "My Learning", bell icon, and user avatar.
3. Verify Hero section headline font is Playfair Display bold serif, subtitle is Inter, and "Explore Courses" button is styled in primary orange.
4. Test search input: type a query and press Enter (or click search), verify navigation to search. Test pressing `Cmd+K` (or `Ctrl+K`) to focus the input.
5. Inspect "All Courses" section: confirm 3 cards with Next.js (black "N"), Docker (whale icon), and TypeScript ("TS") logos, with correct levels, durations, and module counts.
6. Verify "New courses and lessons added every week." notice with star icon.
7. Verify bottom orange gradient equalizer visual.
8. Test responsive layout at mobile (<640px), tablet (768px), and desktop (1024px+) viewports.
