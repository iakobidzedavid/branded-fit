# Architecture Documentation

**Project:** Branded Fit  
**Last Updated:** 2026-06-08  
**Status:** v0 Drift Fixes + Analytics Seeding + Competitive Intelligence

---

## 1. Project Overview

Branded Fit is a next-generation swag and merchandise platform designed to help companies build brand loyalty through curated, personalized product experiences. The platform combines funnel analytics, competitive positioning, and a demo storefront to enable data-driven merchandise campaigns.

**Core Value Proposition:**
- Defensible advantage: Integrated funnel analytics + personalization + brand-fit matching
- Target: Mid-market B2B companies (50–5000 employees) seeking employee/customer swag solutions
- Competitive differentiation: Real-time funnel visibility + brand authenticity + conversion optimization

---

## 2. Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Charts/Visualization:** Recharts (funnel, time-series, bar charts)
- **UI Components:** Custom + Shadcn/ui patterns
- **Deployment:** Vercel (production-ready)

### Backend
- **API:** Next.js API routes (`src/app/api/`)
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth (JWT-based)
- **Data Layer:** Supabase client (JavaScript)

### Development
- **Package Manager:** npm
- **Testing:** TypeScript type checking (`tsc --noEmit`)
- **Build:** Next.js native (`npm run build`)
- **Version Control:** Git

---

## 3. Database Schema

### Core Tables

#### `users`
Stores user accounts and authentication metadata.
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `stores`
Represents brand/company storefronts.
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- name (TEXT)
- description (TEXT)
- theme_color (TEXT) — hex code for brand color
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `products`
Product catalog for each store.
```sql
- id (UUID, PK)
- store_id (UUID, FK → stores)
- name (TEXT)
- description (TEXT)
- price (DECIMAL)
- image_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `analytics_events`
Funnel and user behavior tracking.
```sql
- id (UUID, PK)
- store_id (UUID, FK → stores)
- session_id (UUID) — groups events by user session
- event_type (TEXT) — 'view', 'add_to_cart', 'checkout_start', 'purchase'
- product_id (UUID, FK → products, NULLABLE)
- timestamp (TIMESTAMP)
- user_agent (TEXT, NULLABLE)
- ip_address (TEXT, NULLABLE)
```

**Seeded Data (36 test events):**
- 3 mock stores (3 sessions each)
- 10 funnel sessions across ~2.5 days
- Events: view → add_to_cart → checkout_start → purchase
- Drop-off patterns for funnel visualization

---

## 4. Folder Structure

```
branded-fit/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Landing/home
│   │   ├── command-console/
│   │   │   └── page.tsx               # Command palette interface (FIXED: CTA copy)
│   │   ├── storefront/
│   │   │   └── [storeId]/
│   │   │       └── page.tsx           # Demo storefront (live-product drift fixed)
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx           # Analytics dashboard (seeded data, static route)
│   │   │   └── [other admin routes]
│   │   └── api/
│   │       ├── admin/
│   │       │   └── analytics/
│   │       │       ├── route.ts       # GET /api/admin/analytics (funnel data)
│   │       │       └── events/
│   │       │           └── route.ts   # GET /api/admin/analytics/events (time-series)
│   │       └── [other API routes]
│   ├── components/
│   │   ├── FunnelChart.tsx            # Horizontal bar chart (new)
│   │   ├── TimeSeriesChart.tsx        # Line chart over time (new)
│   │   ├── AnalyticsDashboard.tsx     # Main dashboard layout (new)
│   │   └── [other reusable components]
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client config
│   │   ├── analytics.ts               # Analytics query helpers
│   │   └── [utility functions]
│   └── types/
│       ├── index.ts                   # Shared TypeScript definitions
│       └── [domain-specific types]
├── supabase/
│   ├── migrations/
│   │   └── [migration files]
│   └── seed.sql                       # Seeded analytics_events (36 test events)
├── public/
│   └── [static assets]
├── .env.local                         # Environment variables (Supabase)
├── tsconfig.json                      # TypeScript config (strict mode)
├── next.config.js                     # Next.js config
├── package.json
└── README.md
```

---

## 5. Key Routes & Features

### Public Routes
- **`/`** — Landing page (value prop, CTA to demo)
- **`/command-console`** —