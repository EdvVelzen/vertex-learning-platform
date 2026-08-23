# Implementation Prompt: Add Clerk Authentication

## 1. Goal
Integrate Clerk Authentication into Vertex using the Clerk CLI linked to application `app_3IJMXiUu3tv5kaS5cxcfKcoYoKD`. Set up `@clerk/nextjs`, configure `ClerkProvider` in `app/layout.tsx`, create `proxy.ts` (Next.js 16 convention) with `clerkMiddleware` and the proxy matcher, update `components/ui/navbar.tsx` with `<Show>`, `SignInButton`, `SignUpButton`, and `UserButton`, and verify the integration with `clerk doctor`.

---

## 2. Skills & References Read
- `clerk-setup` (`.agents/skills/clerk-setup/SKILL.md`)
- `clerk-cli` (`.agents/skills/clerk-cli/SKILL.md`)
- `clerk-nextjs-patterns` (`.agents/skills/clerk-nextjs-patterns/SKILL.md`)
- `clerk` (`.agents/skills/clerk/SKILL.md`)
- `AGENTS.md` (Rules and architectural decisions)
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` (Next.js 16 proxy convention)

---

## 3. Code & Environment Inspected
- `package.json`: Next.js 16.3.2, React 19.2.8, Tailwind CSS v4, Lucide React.
- `app/layout.tsx`: RootLayout currently does not include `ClerkProvider`.
- `components/ui/navbar.tsx`: Contains placeholder learner profile avatar and navigation items. Needs real Clerk authentication controls.
- Workspace: Existing Next.js 16 project; package manager is `npm`. No `components.json` (shadcn not used).

---

## 4. Decisions & Assumptions
1. **Clerk Application**: Use target Clerk app `app_3IJMXiUu3tv5kaS5cxcfKcoYoKD`.
2. **CLI Workflow**:
   - Check if `clerk` CLI is installed and update/install as needed.
   - Run `clerk auth login` to ensure authentication.
   - Run `clerk init --app app_3IJMXiUu3tv5kaS5cxcfKcoYoKD`.
3. **Provider Placement**:
   - `ClerkProvider` must wrap the app children **inside `<body>`** in `app/layout.tsx` (not wrapping `<html>`).
4. **Proxy & Routing (Next.js 16)**:
   - Next.js 16 introduces `proxy.ts` (or `middleware.ts`). We will configure `proxy.ts` with `clerkMiddleware`.
   - The matcher will include:
     ```ts
     matcher: [
       '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
       '/(api|trpc)(.*)',
       '/__clerk/:path*',
     ]
     ```
   - Routes will default to public browsing per `AGENTS.md` rules.
5. **Navbar Controls**:
   - Use `@clerk/nextjs` components: `<Show when="signed-out">` wrapping `SignInButton` and `SignUpButton`, and `<Show when="signed-in">` wrapping `UserButton`.
   - Maintain the existing design aesthetic and responsive layout.

---

## 5. Files to Touch / Create
- `package.json` (Add `@clerk/nextjs`)
- `.env.local` (Configured via `clerk init` / `clerk env pull`)
- `app/layout.tsx` (Wrap body children with `ClerkProvider`)
- `proxy.ts` (Create with `clerkMiddleware` and matcher)
- `components/ui/navbar.tsx` (Add Clerk auth buttons and user button)

---

## 6. Security Considerations
- `CLERK_SECRET_KEY` remains strictly server-side and must never be exposed to client-side code or committed into git.
- Only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is exposed to the browser.
- Respect private dataset & API boundaries.

---

## 7. Acceptance Criteria
- [ ] Clerk CLI is installed and updated.
- [ ] `@clerk/nextjs` is installed.
- [ ] `.env.local` contains valid Clerk publishable and secret keys for `app_3IJMXiUu3tv5kaS5cxcfKcoYoKD`.
- [ ] `app/layout.tsx` wraps children inside `<body>` with `<ClerkProvider>`.
- [ ] `proxy.ts` is in place with `clerkMiddleware` and the proper matcher including `'/__clerk/:path*'`.
- [ ] `components/ui/navbar.tsx` renders sign-in/sign-up when signed out, and `UserButton` when signed in.
- [ ] `clerk doctor` passes without critical errors.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` succeed with no errors.

---

## 8. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `clerk doctor`

---

## 9. Manual Test Steps
1. Run `npm run dev` and navigate to `http://localhost:3000`.
2. Verify the navbar displays "Sign in" and "Sign up" buttons when signed out.
3. Click "Sign up" / "Sign in" to test the Clerk modal / auth flow.
4. Once signed in, verify the user avatar / `UserButton` is displayed in the navbar.
5. Click `UserButton` to inspect user profile management actions and sign out.
