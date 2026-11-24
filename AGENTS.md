<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StudioSpace — frontend

Single Next.js 16 App Router package (no workspaces). `src/app` routes; `src/components/ui`
are generated shadcn primitives; `src/components/HomePage/{Navbar,Footer}` and a Toaster are
mounted on every route by `src/app/layout.tsx`. `/` composes the `HomePage/{Banner,Featured,
BrowseCategories,HowItWorks,HostGuarantee}` sections; `Banner` and `featured-studios` are client
components using the repo's Embla-based `components/ui/carousel.tsx`.

## Commands

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint` → plain `eslint` (flat config); `next lint` no longer exists in Next 16.
- Typecheck: `npx next typegen` then `npx tsc --noEmit` (clean after typegen; generated
  `PageProps` / `LayoutProps` don't exist until typegen or a dev/build run).
- No test runner or test script — don't invent test commands.
- Baseline `npm run lint` exits 1 with 2 pre-existing `react-hooks/set-state-in-effect` errors
  (`src/hooks/use-mobile.ts`, generated `src/components/ui/carousel.tsx`), 0 warnings. Add no new errors.

## Backend, data flow and env

- Express API is a separate repo at `../B14-A8-Cat_Harry_Backend` (port 8000); start it separately
  for any data-backed page. There is no API client layer (`src/lib/api.ts` does not exist):
  server components and client components call `fetch(`${NEXT_PUBLIC_API_URL}/...`)` directly,
  usually with `cache: "no-store"`. Shapes are hand-written in
  `src/lib/types/StudioType.ts` (`IStudio`) and `src/lib/types/BookingType.ts` (`IBooking`), not generated.
  Small helpers: `src/lib/data.ts` (`getFeaturedStudios`, React `cache()`-d), `src/lib/studio.ts`
  (`rating` derived from id), `src/lib/booking.ts` (`sortBookingsNewestFirst`).
- Endpoints in use: `GET /studios`, `/featured-studios`, `/studio/:id`, `/my-listings/:email`, `/my-bookings/:email`;
  `POST /add-studio`, `/booking`; `PATCH /studio/:id`, `/my-bookings/:id`,
  `/my-bookings/:id/confirm`; `DELETE /studio/:id`. Backend forces booking `status: "Pending"`
  on POST; invoices show for Confirmed/Completed.
- Host notifications: `BookingCard` POSTs `/booking` twice — a customer record and a copy keyed to
  `studio.ownerEmail` with `isHostNotification: true` and `bookingRef` = customer id.
  `/host-bookings` and `/my-bookings` both read `/my-bookings/:email` and split on
  `isHostNotification`; host confirm/reject PATCHes both ids. Preserve this when touching bookings.
- Auth lives **in this frontend**, not the API: `src/lib/auth.ts` (Better Auth + MongoDB adapter,
  email/password min length 6, Google OAuth) is mounted by `src/app/api/auth/[...all]/route.ts`
  via `toNextJsHandler(auth)`; the browser uses `src/lib/auth-client.ts` (`BETTER_AUTH_URL`).
  Server pages read the session with `auth.api.getSession({ headers: await headers() })`; client
  components use `authClient.useSession()`. `src/proxy.ts` uses the same server-side check to guard
  `/add-studio`, `/my-listings`, `/my-bookings`, `/host-bookings`
  and `/studios/edit/*`, redirecting to `/login`. Public routes and `/api/auth` stay open.
  Never use `middleware.ts` (deprecated in Next
  16). Don't add a second `/api/auth` route.
- Forgot-password is a custom `"use server"` action in `src/components/authentication/route.ts`
  (despite the name, not an API route): two-step flow (email check, then set password). It uses
  Better Auth's internal adapter; the new password must satisfy Better Auth's min/max length **and**
  contain an uppercase + lowercase letter (stricter than signup). It hashes/writes the password and
  deletes existing sessions. No email is sent.
- Invoices are generated client-side with jsPDF (`src/lib/invoice.ts`); they fall back to
  `GET /studio/:id` when a booking lacks host fields.
- `StudioForm` downscales uploaded photos to a base64 data URL ≤90 KB (Express body limit) and
  stores it in `imageUrl`; there is no upload endpoint. Ratings in the grid/detail are derived
  deterministically from the studio id — the API has no rating field.
- `.env` is gitignored but present locally: `MONGODB_URI`, `MONGODB_DB`, `BETTER_AUTH_SECRET`,
  `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_API_URL`,
  `NEXT_PUBLIC_CLIENT_URL`. `NEXT_PUBLIC_API_URL` must be reachable from both browser and Next
  server; `NEXT_PUBLIC_CLIENT_URL` is unused in `src/`. The backend has its own `.env`/`DB_NAME`.

## Non-obvious stack facts

- React Compiler is enabled (`reactCompiler: true`): plain components, no manual
  `useMemo` / `useCallback` for performance.
- Loading states: use `src/components/LoadingStates.tsx` (`LoadingLabel`, `HeroSkeleton`,
  `ContentSkeleton`, `PageLoading`, `FormLoading`) for every route `loading.tsx` and Suspense fallback
  — branded orange spinner plus skeleton blocks, not plain text.
- shadcn style is `base-nova` on **Base UI** (`@base-ui/react`), not Radix; use part / `render`
  props, never `@radix-ui/*` (`components.json`).
- Class merging: `cn` from the `cn` package, re-exported by `src/lib/utils.ts`; `clsx` and
  `tailwind-merge` are not installed.
- Tailwind v4 only: no `tailwind.config.*` or PostCSS config; the `@tailwindcss/turbopack` loader
  is under top-level `turbopack` in `next.config.ts`; tokens live in `src/app/globals.css`
  (`@theme inline`, `:root` / `.dark`, `--brand` → `text-brand` / `bg-brand`).
- `@/*` → `src/*`. `<Image>` allows only `images.unsplash.com` and `images.pexels.com` unless you
  add a host to `images.remotePatterns`.
- Next 16: `params`, `searchParams`, `cookies`, `headers` are async-only:
  `const { id } = await params`.

## Route state

- Implemented: `/`, `/login`, `/register`, `/forgot-password`, `/studios`, `/studios/[id]`,
  `/studios/edit/[id]`, `/add-studio`, `/my-listings`, `/my-bookings`, `/host-bookings`,
  `/not-found`.
