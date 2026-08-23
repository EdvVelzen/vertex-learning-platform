# Implementation Prompt: Vertex Design System

## Goal
Implement the comprehensive **Vertex Design System** for the Next.js learning platform according to the design specification in `design/vertex-designsystem.png`. This includes defining design tokens (colors, typography, spacing, radius, shadows), configuring Google Fonts (`Playfair Display` and `Inter`), creating reusable UI components (Buttons, Inputs, Select, Badges, Status Indicators, Progress Bar, Cards, Navigation, Breadcrumbs, Pagination), and building an interactive Design System showcase page reproducing all 14 sections from the reference image.

---

## Skills and Reference Material Read
- `AGENTS.md`: Platform architecture, UI reproduction guidelines, Next.js conventions, strict styling without inventing new designs, client/server boundaries.
- `design/vertex-designsystem.png`: Source of truth for visual design, colors, typography, type scale, spacing, radii, shadows, icons, buttons, inputs, badges, status indicators, progress bar, cards, navigation, and principles.

---

## Code and Configuration Inspected
- `package.json`: Next.js 16.3.2, React 19.2.8, Tailwind CSS v4 (`@tailwindcss/postcss`).
- `app/globals.css`: Tailwind v4 import and inline theme setup.
- `app/layout.tsx`: Root layout with font configuration.
- `design/vertex-designsystem.png`: Visual layout with 14 distinct design sections:
  1. **Colors**: Primary (500 `#F97316`, 400 `#FB923C`, 300 `#FDBA74`, 200 `#FED7AA`, 100 `#FFEEE5`), Neutral (900 `#0F172A`, 700 `#334155`, 500 `#64748B`, 300 `#CBD5E1`, 200 `#E2E8F0`, 100 `#F1F5F9`, 50 `#FAFAFC`, White `#FFFFFF`).
  2. **Typography**: Playfair Display (Serif: Elegant • Readable • Timeless), Inter (Sans: Clean • Modern • Highly legible).
  3. **Type Scale**: Display 1 (48/56 Bold), Display 2 (36/44 Bold), Heading 1 (28/36 SemiBold), Heading 2 (22/30 SemiBold), Heading 3 (18/26 Medium), Body Large (16/24 Regular), Body (14/20 Regular), Small (12/16 Regular).
  4. **Spacing System**: Base unit 4px (4, 8, 12, 16, 24, 32, 40, 48, 64).
  5. **Radius & Shadows**: Radii (xs 4px, sm 8px, md 12px, lg 16px, xl 24px, full circle). Shadows (sm, md, lg, xl).
  6. **Icons**: 24x24 grid, 2px stroke width, rounded caps, outline & filled styles (Bell, Search, Play circle, Document, Bookmark, Bar chart, Clock, User, Chevron right).
  7. **Buttons**: Variants (Primary, Secondary, Tertiary, Text) across Default, Hover, Disabled states; 44px height, 12px radius, Inter Medium font.
  8. **Inputs**: Search / Text Input (with search icon & `⌘K` shortcut badge), Select dropdown ("Most Relevant"); 44px height, 12px radius, `#E2E8F0` border, `#FB923C` focus ring.
  9. **Badges / Tags**: Video (`#FFEEE5` bg, `#EA580C` text), Lesson (`#EFF6FF` bg, `#2563EB` text), Popular (`#FFEEE5` bg, `#F97316` text).
  10. **Status / Indicators**: In Progress (orange ring), Completed (green check), Now Playing (orange play), Locked (gray lock).
  11. **Progress Bar**: Orange fill, gray track, with percentage label ("35% complete").
  12. **Cards**: Course Card, Lesson Card (Video), Lesson Card (Lesson), Resource Card.
  13. **Navigation**: Navbar (Vertex Logo + Links: Courses, My Learning), Breadcrumbs (`All Courses > Next.js for Production > Data Fetching & Caching`), Pagination (`< [1] 2 3 ... 8 >`).
  14. **Principles**: Clarity First, Consistency, Focus & Calm, Accessible.

---

## Decisions & Assumptions
1. **Dependencies**: Add `lucide-react`, `clsx`, and `tailwind-merge` for standard utility class composition and clean icon rendering matching the 24x24px / 2px stroke icon spec.
2. **Tailwind CSS 4 Theme Configuration**: Configure `@theme` in `app/globals.css` with semantic color names (`--color-primary-*`, `--color-neutral-*`), font families (`--font-serif`, `--font-sans`), border radius variables, and shadow definitions matching the design spec.
3. **Fonts**: Use Next.js `next/font/google` in `app/layout.tsx` to load `Playfair_Display` and `Inter` with CSS variables `--font-playfair` and `--font-inter`.
4. **Component Architecture**: Build modular, accessible, and type-safe components in `components/ui/` and `components/cards/` with Tailwind CSS classes.
5. **Showcase Page**: Present the complete Vertex Design System showcase on the home page (`app/page.tsx`), formatted to match the 14-section visual reference layout with desktop precision and mobile responsiveness.

---

## Files to Create / Modify
- `package.json`: Add `clsx`, `tailwind-merge`, `lucide-react`.
- `lib/utils.ts`: Class name merging utility `cn()`.
- `app/globals.css`: Theme tokens (colors, type scale, shadows, radius, base styles).
- `app/layout.tsx`: Configure `Inter` and `Playfair_Display` fonts and application metadata.
- `components/ui/logo.tsx`: Vertex brand mark & typography component.
- `components/ui/button.tsx`: Primary, Secondary, Tertiary, and Text button variants with sizes, icon support, hover and disabled states.
- `components/ui/input.tsx`: Text and search input with icon and shortcut badge support.
- `components/ui/select.tsx`: Styled dropdown select component.
- `components/ui/badge.tsx`: Video, Lesson, and Popular badges.
- `components/ui/status-indicator.tsx`: In Progress, Completed, Now Playing, Locked indicators.
- `components/ui/progress-bar.tsx`: Progress bar component with label.
- `components/ui/breadcrumbs.tsx`: Hierarchical breadcrumbs component.
- `components/ui/pagination.tsx`: Pagination component with active/hover states.
- `components/ui/navbar.tsx`: Header navigation bar with logo and nav items.
- `components/cards/course-card.tsx`: Course card with thumbnail, title, description, level, duration, and module count.
- `components/cards/lesson-video-card.tsx`: Video lesson result card with badge, title, description, lesson meta, and "Watch from mm:ss" CTA.
- `components/cards/lesson-card.tsx`: Topic lesson card with badge, title, description, module meta, and "View lesson" CTA.
- `components/cards/resource-card.tsx`: Resource document card with icon, title, description, file type/size meta, and open link CTA.
- `app/page.tsx`: Full interactive Design System showcase implementing sections 01 through 14.

---

## Security Considerations
- All components are presentational and safe for client/server usage.
- No sensitive credentials, tokens, or external unsafe scripts are used.
- Types and props are strictly validated via TypeScript interfaces.

---

## Acceptance Criteria
- [ ] Tailwind v4 tokens for colors, typography, spacing, radius, and shadows accurately reflect `design/vertex-designsystem.png`.
- [ ] Fonts `Playfair Display` and `Inter` are properly loaded and styled for Display, Heading, Body, and Small scales.
- [ ] All UI components (Button, Input, Select, Badge, StatusIndicator, ProgressBar, Breadcrumbs, Pagination, Cards, Navbar) are implemented with faithful styling and proper states.
- [ ] The showcase page at `app/page.tsx` renders sections 01 to 14 cleanly and faithfully.
- [ ] `npm run lint` and `npx tsc --noEmit` and `npm run build` pass with 0 errors.

---

## Checks to Run
- `npm install` (install dependencies)
- `npx tsc --noEmit` (TypeScript type check)
- `npm run lint` (ESLint check)
- `npm run build` (Next.js production build check)

---

## Exact Manual Test Steps
1. Execute `npm run dev` to start the Next.js development server.
2. Navigate to `http://localhost:3000` in the browser.
3. Review Section 01 (Colors) and confirm palette swatch hex values (`#F97316`, `#FB923C`, `#0F172A`, `#E2E8F0`, etc.).
4. Review Section 02 & 03 (Typography & Type Scale) and confirm serif headings (Playfair Display) and sans body text (Inter).
5. Review Section 04 & 05 (Spacing, Radius & Shadows).
6. Review Section 06 (Icons) outline and filled styles.
7. Review Section 07 (Buttons) across Primary, Secondary, Tertiary, Text in default, hover, and disabled states.
8. Review Section 08 (Inputs & Select).
9. Review Section 09, 10, 11 (Badges, Status Indicators, Progress Bar).
10. Review Section 12 (Course Card, Lesson Card Video, Lesson Card Topic, Resource Card).
11. Review Section 13 & 14 (Navigation, Breadcrumbs, Pagination, Principles).
