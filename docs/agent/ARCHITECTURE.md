# Architecture Documentation

**Project:** Analytics, Sales Enablement & Unit Economics Validation  
**Last Updated:** 2026-06-05  
**Status:** In Development

---

## Table of Contents

1. [Overview](#overview)
2. [Core Modules](#core-modules)
3. [Data Layer](#data-layer)
4. [API Endpoints](#api-endpoints)
5. [Frontend Architecture](#frontend-architecture)
6. [Analytics & Instrumentation](#analytics--instrumentation)
7. [Business Logic & Models](#business-logic--models)
8. [Operational Documentation](#operational-documentation)
9. [Deployment & Build](#deployment--build)

---

## Overview

This project implements a comprehensive analytics and sales enablement system with unit economics validation for a SaaS platform. The architecture supports:

- **Event tracking** across multiple touchpoints (Command Console, Storefront Preview)
- **Analytics dashboards** with funnel and time-series visualization
- **Unit economics modeling** for pricing validation
- **Sales collateral** based on discovery insights
- **Real-time event ingestion** and processing

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+, React, TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Node.js, PostgreSQL |
| Database | PostgreSQL with Prisma ORM |
| Authentication | Password-gated admin routes |

---

## Core Modules

### 1. Database & Migrations

**Status:** Fully implemented (Migrations 005–008)

**Location:** `prisma/migrations/`

**Key Table: `analytics_events`**

```sql
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  store_id VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  properties JSONB,
  -- Additional columns for enrichment and analysis
  page_path VARCHAR(255),
  referrer VARCHAR(255),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX ON (event_name, timestamp),
  INDEX ON (user_id, timestamp),
  INDEX ON (store_id, timestamp)
);
```

**Key Characteristics:**
- JSONB support for flexible event properties
- Composite indexes on common query patterns
- Timestamp-based partitioning ready
- ~150–200 byte base record size

---

## Data Layer

### Database Schema

**Core Tables:**
- `analytics_events` — All user and system events
- `users` — User accounts and authentication
- `stores` — Store configurations (linked to users)
- Additional tables per Prisma schema

**Connection:**
- PostgreSQL database via Prisma ORM
- Environment configuration via `.env.local`
- Connection pooling for production deployments

### Data Flow

```
User Action
    ↓
Event Capture (Client/Server)
    ↓
POST /api/analytics
    ↓
Validation & Enrichment
    ↓
PostgreSQL INSERT
    ↓
Analytics Dashboard Query & Visualization
```

---

## API Endpoints

### Analytics Events Ingestion

**Endpoint:** `POST /api/analytics`

**Purpose:** Ingest user events from frontend and backend sources

**Request Body:**
```json
{
  "event_name": "string (required)",
  "user_id": "string (optional)",
  "session_id": "string (optional)",
  "store_id": "string (optional)",
  "properties": {
    "key": "value"
  },
  "page_path": "string (optional)",
  "referrer": "string (optional)",
  "device_type": "string (optional)",
  "browser": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "eventId": "number",
  "message": "Event recorded"
}
```

**Implementation Status:** ✅ Complete

**Validation:**
- Required field checks for `event_name`
- Optional enrichment from request headers
- Error handling for database failures
- Rate limiting ready (not yet enforced)

---

## Frontend Architecture

### Page Structure

#### Command Console (`/`)

**Purpose:** Main interface for store management and configuration

**Components:**
- Store selection and navigation
- Event instrumentation for user actions
- Real-time feedback and status displays

**Analytics Events Tracked:**
- `console_view` — Page load
- `console_action` — Button clicks, form submissions
- `console_navigation` — Route changes

**Implementation:** ✅ Instrumented

---

#### Storefront Preview (`/store/:storeId`)

**Purpose:** Live preview of store configuration with mock storefront

**Key Features:**
- Demo store support (`storeId === "demo"`)
- Mock product catalog from `DEMO_STORE` constant
- Real-time configuration preview

**Analytics Events Tracked:**
- `storefront_view` — Page load (with `store_id`)
- `product_view` — Product viewing
- `product_interaction` — Clicks, hovers
- `add_to_cart` — Cart operations

**Mock Data:**
```typescript
const DEMO_STORE = {
  storeId: "demo",
  storeName: "Demo Store",
  products: [
    { id: "1", name: "Product A", price: 29.99 },
    { id: "2", name: "Product B", price: 49.99 },
    // ...
  ]
};
```

**Implementation:** ✅ Demo store with event tracking

---

#### Admin Analytics Dashboard (`/admin/analytics`)

**Purpose:** Real-time visualization of platform analytics

**Features:**
- **Funnel Charts:** User journey visualization (view → interact → purchase)
- **Time-Series Charts:** Event trends over time (daily, weekly, monthly)
- **Filter Controls:** By store, date range, event type
- **Key Metrics Display:** Total events, unique users, conversion rates

**Build Size:** 220 kB (includes Recharts bundle)

**Password Protection:** ✅ Implemented (`ADMIN_PASSWORD` env var