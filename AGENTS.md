# AGENTS.md

## Cursor Cloud specific instructions

### Overview

FA-360 is a React + Vite + TypeScript SPA for architecture studio management. All user data is stored in browser `localStorage` (no database required). The optional Vercel serverless API (`api/`) handles proposal short-link storage via Upstash Redis.

### Project structure

| Path | Description |
|---|---|
| `app/` | React SPA (Vite + TypeScript + Tailwind + shadcn/ui) |
| `api/` | Vercel serverless functions (proposal short links) |
| `vercel.json` | Vercel deployment config |

### Running the app

- **Dev server:** `cd app && npm run dev` (serves at `http://localhost:5173`)
- **Build:** `cd app && npm run build` (runs `tsc -b && vite build`, output in `app/dist/`)
- **Lint:** `cd app && npm run lint` (ESLint; pre-existing warnings exist in the codebase)
- **Preview:** `cd app && npm run preview` (serves the production build)

### Important notes

- There is **no test framework** configured. No automated tests exist.
- The `.env` file in `app/` is created from `app/.env.example`. It contains branding variables (`VITE_APP_NAME`, etc.) and is optional for local development — the app works without it.
- The API endpoints (`api/`) require Vercel KV (Upstash Redis) credentials (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) which are only available in the Vercel environment. The core app is fully functional without these.
- ESLint exits with code 1 due to pre-existing lint errors (unused vars, setState-in-effect warnings). This is expected and not a blocker.
- Deployment target is Vercel project `cursor` at `https://cursor-blond-two.vercel.app`. Deploy with `vercel --prod --yes`.
