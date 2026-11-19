# SentinelGrid Frontend

Premium cybersecurity SaaS frontend for the SentinelGrid platform. Built with React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + GSAP.

## Stack

| Library | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite 6 | Build tool |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion 11 | Declarative animations, page transitions |
| GSAP 3 + ScrollTrigger | Scroll-driven animations, counters, parallax |
| Lenis | Smooth inertial scrolling (landing page) |
| Lucide React | Icon system |
| Recharts | Dashboard data charts |
| Axios | HTTP client |
| React Router v6 | Client-side routing |

## Quick Start

### 1. Prerequisites
- Node.js 18+
- The SentinelGrid FastAPI backend running on `http://localhost:8000`

### 2. Install

```bash
cd frontend
npm install --legacy-peer-deps
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env if your backend runs on a different port
```

### 4. Start the dev server

```bash
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:8000` automatically.

### 5. Production build

```bash
npm run build
# Output: dist/
```

## Project Structure

```
frontend/
├── src/
│   ├── animations/       # Framer Motion variants + GSAP utilities
│   ├── components/
│   │   ├── layout/       # LandingNavbar, AppShell, PageTransition
│   │   ├── sections/     # Hero, Capabilities, HowItWorks, FinalCTA
│   │   └── ui/           # Button, Card, Badge, Input, Modal, EmptyState
│   ├── context/
│   │   ├── AuthContext.tsx   # JWT auth state + login/logout
│   │   └── CursorContext.tsx # Custom cursor state + component
│   ├── hooks/
│   │   ├── useMagnet.ts      # Magnetic hover effect
│   │   └── useCardTilt.ts    # 3D perspective tilt on cards
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── auth/             # LoginPage, RegisterPage (2-step)
│   │   ├── dashboard/        # DashboardPage
│   │   ├── assets/           # AssetsPage (CRUD + verification)
│   │   ├── scans/            # ScansPage (history + request)
│   │   ├── organization/     # OrganizationPage
│   │   └── intelligence/     # IntelligencePage (roadmap)
│   ├── services/api.ts        # Centralised axios client + all endpoints
│   ├── styles/globals.css     # Design tokens + global styles
│   ├── types/index.ts         # TypeScript interfaces (mirrors Pydantic schemas)
│   ├── App.tsx                # Router + route guards
│   └── main.tsx               # Entry point + Lenis init
└── ...config files
```

## Features

### Landing Page
- Animated canvas network background (node mesh)
- GSAP entrance animations (opacity + translateY stagger)
- Scroll progress indicator
- Frosted-glass navbar on scroll
- Core capabilities section with 3D tilt cards
- How-it-works section showing real API endpoints
- Final CTA + footer

### Authentication
- **Login page**: split-layout, JWT auth, password visibility toggle
- **Register page**: 2-step flow — Step 1 creates organisation (tenant), Step 2 creates user account and auto-logs in

### Dashboard
- Live stats fetched from `/api/v1/assets/` and `/api/v1/scans/`
- Animated metric cards with Recharts pie chart for asset type distribution
- Recent scan history panel

### Asset Management
- Full CRUD: create, read, update, delete
- Search + filter by type / verification status
- DNS ownership verification flow (generate token → place TXT record → verify)
- 3D tilt cards with cursor-following spotlight

### Scan Intelligence
- Real scan history from `/api/v1/scans/`
- Request scan modal (only verified domains/web apps shown)
- Honest roadmap panel for planned features (no fake CVE data)

### Design System
- Custom cursor: dot + ring with lerp smoothing + hover states
- Magnetic button effects
- 3D card tilt with mouse-tracking spotlight
- Scroll-triggered reveals (Framer Motion `whileInView`)
- Colour tokens: `#080B10` bg, `#35D6E8` cyan, `#638CFF` blue
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code/metrics)

## Backend Constraints

| Limitation | Frontend Handling |
|---|---|
| No forgot-password endpoint | Link omitted |
| Scans always `pending` (no scanner engine) | Honest pending state shown |
| No vulnerability findings | Roadmap panel in Intelligence page |
| No user-per-tenant listing | Org page shows current user only |
| IP address assets cannot be scanned | Filtered out in scan request modal |

## Notes

- JWT is stored in `localStorage` (backend has no cookie auth endpoints)
- The `GET /api/v1/tenants/` endpoint returns ALL tenants with no auth — noted as a known security concern in the backend, not addressed in frontend
- Backend must have CORS configured to accept `http://localhost:5173` during development
