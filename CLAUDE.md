# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server
npm run dev

# Production build (runs tsc first, then vite build)
npm run build

# Lint (zero warnings allowed)
npm run lint

# Preview production build
npm run preview
```

There is no test suite in this project.

## Environment Variables

Copy `example.env` to `.env`. The key variable is:
- `VITE_BACKEND_URL` — base URL of the Django backend (e.g. `http://localhost:8000`)

## Architecture

React 18 + TypeScript + Vite SPA. Routing via `react-router-dom` v6 (`src/router.tsx`). UI is built with **shadcn/ui** (Radix UI primitives + Tailwind CSS). The `@` alias resolves to `src/`.

### Directory Layout

```
src/
├── views/           # Page-level components (route targets)
│   └── My/          # Auth-protected creator views (Problems, Collections, Courses, Groups)
├── components/      # Reusable UI components
│   ├── Forms/       # Multi-step create/edit forms (Problem, Collection, Course, Group)
│   ├── Tables/      # TanStack Table-based data tables
│   ├── Cards/       # Card variants per domain entity
│   ├── plate-ui/    # Plate rich-text editor UI primitives (auto-generated)
│   ├── shadcn/      # shadcn/ui component overrides
│   └── ui/          # Base shadcn/ui components
├── services/        # Axios API calls, one file per domain
├── types/
│   ├── apis/        # Request/response type contracts per service
│   ├── models/      # Django model shapes (what the API returns)
│   ├── forms/       # react-hook-form field types
│   └── adapters/    # Type transformation helpers
├── stores/          # Redux Toolkit store
│   └── slices/      # accountSlice — stores username + JWT tokens
├── contexts/        # React contexts (LoginContext, NavSidebar, CourseNavSidebar)
├── hooks/           # Custom hooks
├── constants/       # Shared constant values
├── utilities/       # Pure helper functions
├── layout/          # Layout wrappers
└── lib/plate/       # Plate editor plugin configuration
```

### API Layer

`src/services/index.ts` creates a single axios instance pointing at `VITE_BACKEND_URL`. It automatically attaches the JWT `Bearer` token from `localStorage` on every request and redirects to `/login` on 401.

Each domain has a typed service object (`ProblemService`, `CollectionService`, etc.) that wraps the axios calls and is typed against the interfaces in `src/types/apis/`.

### State Management

- **Redux Toolkit** (`src/stores/slices/accountSlice.ts`): stores auth state (username, accessToken, refreshToken, expiresAt) synced to/from `localStorage`.
- **React Context**: `LoginContext` (global login boolean), `NavSidebarContext`, `CourseNavSidebarContext`, `MyProblemsContext` — local UI state that doesn't need Redux.

### Authentication Flow

Auth state is `null` (loading), `false` (not logged in), or `true` (logged in) in `LoginContext`. The router gates all `/my/*`, `/dashboard`, `/management`, and content-viewing routes behind `isLogin === true`. Unauthenticated users hitting a protected route are redirected to `/login`.

### Rich Text Editor

Problem descriptions use **Plate** (`@udecode/plate-*`). `PlateEditor` is the editable version, `ReadOnlyPlate` for display, and `DetailPlateEditor` for the problem creation form. Plate plugin config lives in `src/lib/plate/`. The `src/components/plate-ui/` directory contains auto-generated Plate component overrides — avoid editing these manually.

### Forms

Multi-step forms (Problem, Collection, Course, Group) live under `src/components/Forms/Create*Form/`. Each is split into tab sections (`GeneralDetail`, `Requirement`, `Scoring`, `ManageGroups`, etc.) with a shared `index.tsx` orchestrating state. All forms use **react-hook-form** + **zod** validation.

### shadcn/ui Components

Run `npx shadcn-ui@latest add <component>` to add new shadcn components. They land in `src/components/ui/`. Do not edit these files directly for one-off styling — extend via Tailwind classes at the usage site.
