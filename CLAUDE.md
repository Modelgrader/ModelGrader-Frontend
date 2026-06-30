# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # TypeScript compile + Vite build
npm run lint       # ESLint (0 warnings allowed)
npm run preview    # Preview production build
```

No test suite is configured.

## Architecture

React 18 + TypeScript SPA built with Vite. UI uses **shadcn/ui** (Radix UI primitives + Tailwind CSS). Routes are defined in [src/router.tsx](src/router.tsx) using React Router v6. Auth-gated routes are conditionally rendered based on `isLogin` from `LoginContext`.

### Key directories

- **`src/views/`** — page-level components, mirroring route structure. `My/` subdirectory holds authenticated CRUD views (Problems, Courses, Collections, Groups).
- **`src/components/`** — shared/reusable UI components.
- **`src/services/`** — one file per resource (e.g. `Problem.service.ts`, `Auth.service.ts`). All use the shared axios instance from `src/services/index.ts`.
- **`src/stores/`** — Redux Toolkit store. Currently has `accountSlice` for user account state.
- **`src/contexts/`** — React contexts, notably `LoginContext` which drives auth-gated routing.
- **`src/hooks/`** — custom hooks.
- **`src/types/`** — shared TypeScript types.

### API client

`src/services/index.ts` exports a configured axios instance that reads `VITE_BACKEND_URL` from the environment, attaches the Bearer token from `localStorage` on every request, and redirects to `/login` on 401.

All service files should import this shared client rather than creating their own axios instances.

### Environment

Requires `VITE_BACKEND_URL` set (e.g. in `.env.local`) pointing to the backend API.
