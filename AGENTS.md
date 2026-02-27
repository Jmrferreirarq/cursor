# AGENTS.md

## Cursor Cloud specific instructions

### Overview

FA-360 is a React + Vite + TypeScript SPA for architecture studio management. All user data is stored in browser `localStorage` (no database required). The optional Vercel serverless API (`api/`) handles proposal short-link storage via Upstash Redis.

### Project structure

| Path | Description |
|---|---|
| `app/` | React SPA (Vite + TypeScript + Tailwind + shadcn/ui) |
| `api/` | Vercel serverless functions (proposal short links) |
| `api/_cors.ts` | Shared CORS utility used by all API endpoints |
| `vercel.json` | Vercel deployment config (includes security headers) |

### Commands

| Command | What it does |
|---|---|
| `cd app && npm run dev` | Dev server at `http://localhost:5173` |
| `cd app && npm run build` | `tsc -b && vite build` → `app/dist/` |
| `cd app && npm run test` | Vitest — 28 unit tests |
| `cd app && npm run test:watch` | Vitest in watch mode |
| `cd app && npm run lint` | ESLint (exits code 1 due to pre-existing errors) |
| `cd app && npm run preview` | Serve production build |
| `vercel --prod --yes` | Deploy to Vercel |

### Important notes

- **Tests**: Vitest is configured with 28 tests across 3 suites (`localStorage`, `proposalPayload`, `i18n`). Test files live next to source in `__tests__/` folders.
- **i18n**: PT/EN translations in `app/src/locales/`. Pages using `t()`: Dashboard, Settings, Projects, Clients, 404. Toggle in navbar.
- **PWA**: `vite-plugin-pwa` generates a Service Worker via Workbox. The `manifest.json` is in `app/public/`. Icon PNGs referenced in manifest do not exist yet (only `favicon.svg` exists).
- **Code splitting**: All 33+ pages use `React.lazy()` in `App.tsx`. Vendor chunks: `react`, `radix`, `motion`, `charts`.
- **Data**: `DataContext` provides full CRUD (`add/update/delete` for clients, projects, proposals). Data persists to `localStorage` with versioning (`_version` field + `migrate()` function in `localStorage.ts`).
- **Security**: API CORS is restricted to specific origins in `api/_cors.ts`. Add new allowed origins there. Security headers set in `vercel.json`.
- **`.env`**: Copy `app/.env.example` → `app/.env`. Optional for local dev. API endpoints need `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel environment only).
- **ESLint**: Exits code 1 due to ~152 pre-existing lint errors (unused vars, setState-in-effect). Not introduced by recent changes.
- **Deployment**: Vercel project `cursor` at `https://cursor-blond-two.vercel.app`.
