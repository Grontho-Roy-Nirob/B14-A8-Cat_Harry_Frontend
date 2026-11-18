<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StudioSpace — frontend

Single Next.js 16 App Router package (no workspaces). `src/app` routes; `src/components/ui`
are generated shadcn primitives; `src/components/HomePage/{Navbar,Footer}` are mounted on every
route by `src/app/layout.tsx`.

## Backend and env

- `.env` is gitignored but present locally, with real MongoDB / Better Auth secrets and
  `NEXT_PUBLIC_API_URL=http://localhost:8000`.
- Auth lives **in this frontend**, not the separate API: `src/lib/auth.ts` (Better Auth +
  MongoDB via `MONGODB_URI` / `MONGODB_DB`) is exposed by `src/app/api/auth/[...all]/route.ts`;
  the browser uses `src/lib/auth-client.ts` (`BETTER_AUTH_URL`). Don't add another `/api/auth` route.
- The Express API is a separate repo at `../B14-A8-Cat_Harry_Backend` (port 8000).
  `NEXT_PUBLIC_API_URL` is configured but no `src/` code uses it yet — don't assume API calls exist.
- No test runner is configured; don't invent test commands.

## Commands

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint` → plain `eslint` (flat config); `next lint` no longer exists in Next 16.
- Typecheck in order: `npx next typegen`, then `npx tsc --noEmit`. Generated `PageProps` /
  `LayoutProps` don't exist until typegen or a dev/build run.
- Pre-existing failures, not caused by your change: lint reports 2 `react-hooks/set-state-in-effect`
  errors (`src/hooks/use-mobile.ts`, generated `src/components/ui/carousel.tsx`) and 1 unused-import
  warning (`src/app/page.tsx`); `tsc` fails on `.next/{types,dev/types}/validator.ts` ("is not a
  module", `__InvalidParamMatchingKeys`) because of the empty routes below. Add no new errors.

## Non-obvious stack facts

- React Compiler is enabled (`reactCompiler: true`): plain components, no manual
  `useMemo` / `useCallback` for performance.
- shadcn style is `base-nova` on **Base UI** (`@base-ui/react`), not Radix; use part / `render`
  props, never `@radix-ui/*` (`components.json`).
- Class merging: `cn` from the `cn` package, re-exported by `src/lib/utils.ts`; `clsx` and
  `tailwind-merge` are not installed.
- Tailwind v4 only: no `tailwind.config.*` or PostCSS config; the `@tailwindcss/turbopack` loader
  is in `next.config.ts`; design tokens live in `src/app/globals.css` (`@theme inline`, `:root` / `.dark`).
- `@/*` → `src/*`. `<Image>` allows only `images.unsplash.com` and `images.pexels.com` unless you
  add a host to `images.remotePatterns`. Turbopack settings live under top-level `turbopack` in
  `next.config.ts`.

## Next 16 gotchas

- `params`, `searchParams`, `cookies`, `headers` are async-only: `const { id } = await params`.
- `middleware.ts` is deprecated; use `proxy.ts` (Node runtime only).

## Current scaffolding state

- 0-byte placeholders: all `src/app/*/page.tsx` except `/` and `not-found`, `src/lib/api.ts`,
  `src/components/studio/{StudioCard,StudioForm}.tsx`. Unfinished work, not broken files.
