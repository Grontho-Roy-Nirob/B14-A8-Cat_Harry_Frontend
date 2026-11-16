<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StudioSpace — frontend

Next.js App Router UI for a studio-booking app. The API is a separate repo at
`../B14-A8-Cat_Harry_Backend` (default `NEXT_PUBLIC_API_URL=http://localhost:8000`);
there are no server actions or route handlers yet. `.env` is gitignored but already
present locally.

## Commands

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint` — plain `eslint` (flat config). `next lint` no longer exists in Next 16.
- Typecheck: `npx next typegen && npx tsc --noEmit`
- No test runner is configured. Do not invent test commands.

## Non-obvious stack facts

- React Compiler is enabled (`reactCompiler: true`): write plain components, don't add
  `useMemo`/`useCallback` for performance.
- shadcn components in `src/components/ui/` are generated for the `base-nova` style on
  **Base UI** (`@base-ui/react`), not Radix. Follow Base UI's part/`render` props when
  customizing; importing `@radix-ui/*` is wrong here.
- Merge classes with `cn` from the `cn` package (re-exported by `src/lib/utils.ts`).
  `clsx` and `tailwind-merge` are not installed.
- Tailwind v4 only: no `tailwind.config.*` and no PostCSS config. The CSS pipeline is the
  `@tailwindcss/turbopack` loader rule in `next.config.ts`; design tokens live in
  `src/app/globals.css` (`@theme inline` plus `:root`/`.dark` vars).
- `@/*` maps to `src/*`.
- `<Image>` only accepts `images.unsplash.com` and `images.pexels.com` (see
  `next.config.ts`). Add a host to `images.remotePatterns` before using another domain.

## Next 16 gotchas

- `params`, `searchParams`, `cookies`, and `headers` are async-only:
  `async function Page({ params }: PageProps<"/studios/[id]">) { const { id } = await params }`
- Prefer generated `PageProps<...>` / `LayoutProps<...>` over hand-written prop types;
  they exist only after typegen (or a dev/build run).
- Turbopack is the default; bundler settings live under top-level `turbopack` in `next.config.ts`.
- Middleware is now `proxy.ts` with an exported `proxy` function (Node runtime only).
- Version-matched docs are bundled at `node_modules/next/dist/docs/` — check them before
  relying on remembered APIs.

## Current scaffolding state

- Most routes, plus `src/lib/api.ts` and `src/components/studio/*`, are 0-byte placeholders
  to be implemented, not broken files.
- Consequently `npx tsc --noEmit` fails on `.next/**/types/validator.ts` ("is not a module")
  until those routes export something. `npm run lint` already fails on scaffold code
  (`react-hooks/set-state-in-effect` in `src/hooks/use-mobile.ts`, unused `Image` in
  `src/app/page.tsx`). Just ensure your change adds no new errors.
