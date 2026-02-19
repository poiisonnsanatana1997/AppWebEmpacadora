# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AgroSmart / AppWebEmpacadora** — A React + TypeScript web application for managing packing house operations: inbound orders (`OrdenesEntrada`), inventory (`Inventario`), customer orders (`PedidosCliente`), classification (`Clasificacion`), and related reports.

The backend is an ASP.NET API at `localhost:57664` (dev) or `http://100.48.215.40/apiempacadora/api` (prod).

## Common Commands

```bash
# Development
npm run dev               # Start dev server at localhost:3000

# Build
npm run build             # TypeScript check + Vite build (default mode)
npm run build:dev         # Build with development env
npm run build:prod        # Build for production (same as npm run deploy)
npm run build:staging     # Build for staging

# Preview built output
npm run preview
npm run preview:prod

# Lint
npm run lint
```

No test runner is configured in this project.

## Architecture

### Layer Structure

```
src/
├── api/            # Axios instance (axios.ts) + auth endpoint (auth.ts)
├── config/         # environment.ts — single source of truth for all env vars
├── contexts/       # AuthContext.tsx — authentication state
├── services/       # API calls organized by domain
├── hooks/          # Custom React hooks organized by domain
├── components/     # UI components organized by domain + ui/ for shared primitives
├── pages/          # Route-level components
├── types/          # TypeScript interfaces organized by domain
├── utils/          # Helpers: logger, errorHandler, formatters, dateUtils, etc.
├── schemas/        # Zod validation schemas
└── lib/            # utils.ts (cn()), api.ts
```

### Key Architectural Patterns

**Service → Hook → Component flow:**
- `services/*.service.ts` — plain async functions calling `api` (Axios instance); handle PDF/Excel generation too
- `hooks/<Domain>/use*.ts` — wrap service calls, manage loading/error state; some use TanStack React Query, others use local state
- `components/<Domain>/` — consume hooks; each domain folder has Table, Modal, Header, Indicators sub-components
- `pages/*.tsx` — compose domain components, receive route params

**Environment config** (`src/config/environment.ts`):
- All `import.meta.env.*` access goes through this file
- In dev, `api.baseUrl` is `/api` (Vite proxies to localhost:57664)
- In production, it uses `VITE_API_BASE_URL`
- App base path: `/` in dev, `/empacadora` in prod (configured via `VITE_APP_BASENAME`)

**Authentication** (`src/contexts/AuthContext.tsx`):
- JWT token stored in `localStorage` with expiration timestamp
- Token validated on mount and every 5 minutes; auto-logout on expiry
- Axios request interceptor attaches `Authorization: Bearer <token>`
- 401 responses: only clear session if token is genuinely expired (not just permission issues)

**Routing** (`src/App.tsx`):
- All routes except `/login` are wrapped in `<PrivateRoute>` which enforces authentication and renders `<Layout>`
- Layout uses `SidebarApp` (collapsible sidebar with navigation)

**UI stack:**
- `src/components/ui/` — shadcn/ui components (Radix UI primitives + Tailwind)
- MUI `DataGrid` used in some tables
- TanStack Table via `useDataTable` hook for custom tables
- `cn()` from `src/lib/utils.ts` for conditional Tailwind classes

**Logging** (`src/utils/logger.ts`):
- Environment-aware levels: `debug` in dev, `error` in prod
- Use `logApiCall()`, `logAuthEvent()`, `logError()` helpers — avoid raw `console.log`

**Code splitting** (vite.config.ts):
- `vendor` chunk: react, react-dom
- `ui` chunk: Radix UI components

### Domain Modules

Each domain follows the same structure. Current domains:
- `OrdenesEntrada` — inbound orders (largest: 32KB service)
- `PedidosCliente` — customer orders
- `Inventario` — inventory / tarimas (pallets)
- `Clasificacion` — order classification
- `Productos`, `Proveedores`, `Clientes`, `Usuarios`, `Sucursales`

### Path Alias

`@` maps to `src/`. Use `@/components/...`, `@/services/...`, etc.

## Environment Files

| File | Purpose |
|---|---|
| `.env.development` | Dev: API at `/api` (proxied), log level `debug` |
| `.env.production` | Prod: API at `http://100.48.215.40/apiempacadora/api`, log level `error` |

## Deployment

- Target: IIS on Windows Server
- `public/web.config` handles SPA routing (URL rewrite to `index.html`)
- `deploy-iis.ps1` — PowerShell script for IIS deployment
- Base path in production: `/empacadora/`
