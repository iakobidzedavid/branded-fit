# Project Architecture Documentation

**Last Updated:** 2026-06-14  
**Status:** Pilot Validation & Analytics Instrumentation Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Core Systems](#core-systems)
4. [API Layer](#api-layer)
5. [Analytics & Instrumentation](#analytics--instrumentation)
6. [Authentication & Authorization](#authentication--authorization)
7. [Database Layer](#database-layer)
8. [Deployment & Environment](#deployment--environment)
9. [Known Issues & Resolutions](#known-issues--resolutions)
10. [Session Work Summary](#session-work-summary)

---

## Project Overview

**Project Name:** Brand Drop Pilot  
**Current Phase:** Pilot Validation & Analytics Instrumentation  
**Primary Goal:** Validate brand-fidelity NPS, provisioning speed perception, $24K WTP, warm-intro conversion, use-case fit, and storefront impact through structured discovery calls with key prospects (Vanta, Linear, Census, Hex, Mercury).

### Key Capabilities
- **Command Console:** Role-based interface for managing brand drops and prospect outreach
- **Storefront:** Customer-facing portal for discovering and engaging with brands
- **Analytics Dashboard:** Admin panel with funnel tracking and event instrumentation
- **Discovery Call Framework:** Production-ready validation system for pilot assumptions

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  Command Console  │  Storefront  │  Admin Analytics         │
└────────┬──────────────────────────────────────────────────┬─┘
         │                                                   │
         ▼                                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  /api/analytics   │  /api/auth  │  /api/brands  │  REST... │
└────────┬──────────────────────────────────────────────────┬─┘
         │                                                   │
         ▼                                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                 │
├─────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL  │  Analytics Events  │  Auth Tables  │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Systems

### 1. **Command Console**
- **Purpose:** Internal tool for managing brand drops and coordinating prospect outreach
- **Location:** `src/app/console/*`
- **Features:**
  - Role-based access control
  - Brand drop management
  - Prospect tracking
  - Event emission for analytics
- **Status:** Production-ready with instrumentation

### 2. **Storefront**
- **Purpose:** Customer-facing interface for brand discovery and engagement
- **Location:** `src/app/storefront/*`
- **Features:**
  - Brand browsing and filtering
  - Prospect engagement tracking
  - Event emission for conversion funnel
- **Status:** Instrumented with event emitters

### 3. **Admin Analytics Dashboard**
- **Purpose:** Monitor pilot KPIs and conversion funnels in real-time
- **Location:** `src/app/admin/analytics`
- **Features:**
  - Conversion funnel visualization (Visits → Engagement → MQL → SQL)
  - Auth-gated access via custom cookie authentication
  - Real-time event processing
  - Test data seeding capability
- **Status:** Fully implemented and verified

---

## API Layer

### Analytics Endpoint

**Endpoint:** `POST /api/analytics`

**Purpose:** Centralized event ingestion for all client-side instrumentation

**Request Schema:**
```typescript
{
  event_type: string;        // "visit" | "engagement" | "mql" | "sql"
  session_id?: string;       // Client session identifier (fallback for user_id)
  user_id?: string;          // Authenticated user ID
  payload?: Record<string, any>; // Event-specific metadata
  timestamp: ISO8601;        // Server-generated on receipt
}
```

**Response:**
```typescript
{
  success: boolean;
  event_id: string;          // Unique event identifier
  stored_at: ISO8601;
}
```

**Implementation Details:**
- ✅ `session_id` field support (fallback resolution for user tracking)
- ✅ `payload` field support (extensible event metadata)
- ✅ Builds without errors
- ✅ Integrated with both Command Console and Storefront

### Other Key Endpoints
- `POST /api/auth/login` — Custom cookie-based authentication
- `POST /api/auth/logout` — Session termination
- `GET /api/brands` — Brand discovery (public or authenticated)
- `POST /api/brands` — Brand creation (authenticated, role-gated)

---

## Analytics & Instrumentation

### Event Types

| Event Type | Source | Trigger | Status |
|-----------|--------|---------|--------|
| `visit` | Storefront | Page load / brand discovery | ✅ Instrumented |
| `engagement` | Storefront/Console | User interaction | ✅ Instrumented |
| `mql` | API/Console | Manual qualification | ✅ Instrumented |
| `sql` | API/Console | Sales handoff | ✅ Instrumented |

### Funnel Visualization

**Location:** `src/components/FunnelChart.tsx`

**Implemented Features:**
- Real-time event aggregation across all sources
- Multi-stage funnel rendering (Visits → Engagements → MQLs → SQLs)
- Conversion rate calculations between stages
- Test data seeding for validation

**Dashboard:** `/admin/analytics`
-