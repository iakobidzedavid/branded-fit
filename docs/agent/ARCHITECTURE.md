# MVBP (Multi-Vendor Brand Platform) - Architecture Documentation

**Last Updated:** 2026-06-05  
**Status:** Production Launch & Customer Discovery Phase

---

## 1. Project Overview

The Multi-Vendor Brand Platform (MVBP) is a SaaS solution enabling e-commerce vendors to rapidly generate branded storefronts from domain inputs. The system combines brand extraction, AI-powered storefront generation, and analytics tracking to support product-market fit validation and customer discovery cycles.

### Core Value Proposition
- **For Vendors:** Input domain → extract brand identity → generate live storefront in <10 minutes
- **For Platform:** End-to-end analytics tracking + customer discovery validation → pricing & positioning refinement

### Current Phase
- ✅ Production deployment complete
- 🔄 Customer discovery cycle (≥3 discovery calls with prospects)
- 📊 Analytics pipeline live with funnel + time-series tracking

---

## 2. System Architecture

### 2.1 High-Level Flow

```
User Input (Domain)
    ↓
Brand Extraction Service
    ↓
Storefront Generation Engine
    ↓
Deployment to Live Domain
    ↓
Analytics Event Tracking
    ↓
Admin Dashboard (Funnel + Time-Series)
    ↓
Customer Discovery Feedback Loop
```

### 2.2 Core Components

#### **Frontend Layer**
- **Command Console** (`src/app/console/`)
  - Real-time domain input interface
  - Live brand extraction preview
  - Storefront generation status tracking
  - Event emission to analytics pipeline

- **Storefront Preview** (`src/app/storefront/`)
  - Generated storefront rendering
  - Live domain verification
  - User interaction tracking (clicks, page views, conversions)

- **Admin Analytics Dashboard** (`src/app/admin/analytics/`)
  - Funnel visualization (5 stages)
  - Time-series charts (daily/weekly aggregates)
  - Conversion metrics and drop-off analysis

#### **API Layer**

**Core Processing Endpoints:**
- `POST /api/brand-extraction` — Extract brand identity from domain
- `POST /api/storefront-generation` — Generate storefront HTML/CSS
- `POST /api/deployment` — Deploy to production domain

**Analytics Endpoints:**
- `POST /api/analytics` — Accept event tracking data
  - Captures: `user_id`, `event_type`, `timestamp`, `fidelity_score`, `product_count`, `storefront_url`
  - Events tracked: page_view, user_click, user_publishes_storefront
- `GET /api/admin/analytics` — Retrieve funnel + time-series aggregates
  - Returns 5-stage funnel: domain_entered → brand_extracted → storefront_generated → storefront_previewed → user_clicks_publish
  - Time-series data by day/week

#### **Data Layer**

**Database: Supabase PostgreSQL**

**Key Tables:**

| Table | Purpose | Status |
|-------|---------|--------|
| `analytics_events` | Raw event stream | ✅ Live |
| `analytics_funnels` | Funnel stage aggregates | ✅ Computed |
| `analytics_timeseries` | Daily/weekly conversion metrics | ✅ Computed |
| `users` | User identity & session data | ✅ Live |
| `storefronts` | Generated storefront metadata | ✅ Live |
| `brands` | Extracted brand data | ✅ Live |

**Recent Migrations:**
- `007_add_analytics_pipeline_columns.sql` — Adds `fidelity_score`, `product_count`, `storefront_url` columns to `analytics_events`

---

## 3. Analytics Pipeline

### 3.1 Event Tracking Schema

**Table: `analytics_events`**

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type VARCHAR(50),           -- page_view, user_click, user_publishes_storefront
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  fidelity_score FLOAT,             -- Brand extraction quality (0-1)
  product_count INT,                -- Catalog size
  storefront_url VARCHAR(255),      -- Generated storefront URL
  metadata JSONB                    -- Additional event context
);
```

### 3.2 Funnel Stages

**5-Stage Conversion Funnel:**

1. **domain_entered** — User inputs domain in Command Console
2. **brand_extracted** — Brand extraction completes successfully
3. **storefront_generated** — HTML/CSS generation completes
4. **storefront_previewed** — User previews storefront
5. **user_clicks_publish** — User clicks publish/deploy button

**Computation:** Real-time aggregation via `user_id` distinct counts at each stage

### 3.3 Time-Series Metrics

**Daily Aggregates:**
- Conversions per stage
- Drop-off rate between consecutive stages
- Average `fidelity_score` by day
- Average `product_count` by day

---

## 4. Production Deployment Status

### 4.1 Verification Checklist ✅

- ✅ Live domain input accepted in Command Console
- ✅ Brand extraction completes <5 minutes
- ✅ Storefront generation completes <3 minutes
- ✅ End-to-end cycle: <10 minutes
- ✅ Analytics schema deployed to Supabase
- ✅ Event tracking wired to both Command Console and Storefront Preview
- ✅ Admin dashboard live with funnel + time-series visualization

### 4.2 Deployment Architecture

**Environment:** Supabase (PostgreSQL + Auth + Realtime)  
**Frontend Hosting:** Vercel (Next.js)  
**API Gateway:** Next.js API routes  
**Real-time Events:** Supabase Realtime subscriptions

---

## 5. Customer Discovery & Validation Framework

### 5.1 Target Persona: Maya Chen Profile
- **Role:** E-commerce Operations Lead at mid-market D2C brand
- **Pain Point:** Manual storefront customization takes 2-3 weeks
- **