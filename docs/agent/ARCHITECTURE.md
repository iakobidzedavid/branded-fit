# Architecture Documentation

## Project Overview
**Project Name:** MVBP (Minimum Viable Brand & Products)  
**Current Phase:** Step 24 - Founder Decision Gate  
**Last Updated:** 2026-06-14  
**Status:** Production-Ready Analytics & Discovery Validation Complete

---

## System Architecture

### High-Level Component Flow

```
User Input (Domain)
    ↓
Command Console (Frontend)
    ↓
Orchestration Pipeline (Backend)
    ├─→ Brandfetch API (Brand Extraction)
    ├─→ Printify API (Product Generation)
    └─→ Shopify API (Storefront Creation)
    ↓
Analytics Event Emitters
    ├─→ Supabase (Event Persistence)
    └─→ Conversion Funnel Dashboard
    ↓
Landing Page + Verification UI
```

### Core Services & Integrations

#### 1. **Frontend Layer**
- **Command Console**: Primary user interface for domain submission
- **Landing Page**: Marketing & product information with analytics verification section
- **Dashboard**: Conversion funnel visualization (real event data with sample-size transparency)

**Technology Stack:**
- Framework: Next.js (React)
- Hosting: Vercel
- State Management: Client-side hooks
- Analytics Integration: Custom event emitters

#### 2. **Backend Orchestration Pipeline**
- **Entry Point:** `src/app/api/orchestrate/route.ts`
- **Pipeline Architecture:** Three-stage sequential processing

**Stage 1: Brand Extraction**
- Service: Brandfetch API
- Input: Domain name
- Output: Brand metadata (name, logo, colors, description)
- Event: `brand_extraction_completed`

**Stage 2: Product Generation**
- Service: Printify API
- Input: Brand metadata
- Output: Product catalog with designs
- Dependency: Successful Stage 1 completion

**Stage 3: Storefront Creation**
- Service: Shopify API
- Input: Products + brand styling
- Output: Live Shopify storefront
- Event: `storefront_generation_completed`
- Configuration: Uses `SHOPIFY_STORE_NAME` environment variable

**SLA:** End-to-end completion within 10 minutes

#### 3. **Data Persistence Layer**
- **Database:** Supabase PostgreSQL
- **Event Schema:** Standardized event logging with timestamps
- **Key Events Tracked:**
  - `domain_submitted` → Brand extraction initiated
  - `brand_extraction_completed` → Brand data persisted
  - `storefront_generation_completed` → Storefront live

**Validation Status:** ≥5 real test events collected and verified in production

#### 4. **Analytics & Monitoring**
- **Event Emitters:** Active on Command Console
- **Dashboard:** Conversion funnel rendering real production data
- **Metrics Transparency:** Sample size clearly displayed on all metrics
- **Verification Framework:** Complete step-by-step procedures documented

---

## Data Models

### Event Schema (Supabase)
```
{
  event_id: UUID (Primary Key)
  event_type: VARCHAR (domain_submitted | brand_extraction_completed | storefront_generation_completed)
  user_session_id: VARCHAR
  domain_submitted: VARCHAR
  timestamp: TIMESTAMP
  payload: JSONB (varies by event type)
  metadata: JSONB (user_agent, ip_country, etc.)
}
```

### Landing Page Data Model
- **Removed Fields:** Campaign tracker, prospect counts, draft status labels
- **Current Fields:** 
  - Product features with real event data
  - Analytics verification results
  - Sample-size transparency on all metrics
  - Pricing information (Growth tier: $24K)

---

## Validation & Testing Results

### Analytics Instrumentation (Step 24)
- ✅ Production environment active
- ✅ Event emitters functional on Command Console
- ✅ ≥5 real test events collected
- ✅ Supabase persistence verified
- ✅ Dashboard rendering with real data
- ✅ Screenshots documented

### Discovery Call Validation (Step 21)
- **Target Audience:** Series B-D People Ops decision-makers
- **Participants:** Vanta, Linear, Census, Hex, Mercury (5 companies)
- **Framework:** 29-field discovery tracker with 6-assumption validation scorecard
- **Validation Output:** CONFIRM/REFUTE/GRAY assessment matrix

### Landing Page Drift Remediation (Step 23-24)
- ✅ 6 drift violations fixed
- ✅ Draft status labels removed
- ✅ Early Access labels removed
- ✅ Campaign tracker removed
- ✅ Prospect count references removed
- ✅ Analytics verification section added
- ✅ Real event data integrated
- ✅ Sample-size transparency implemented

### End-to-End Pipeline Deployment (Step 7 + Step 22)
- ✅ Command Console deployed to Vercel
- ✅ Orchestration pipeline wired: Brandfetch → Printify → Shopify
- ✅ HTTP 200 status verification passed
- ✅ Domain input functional
- ✅ Storefront generation within 10-minute SLA

---

## Deployment Status

### Production Environment
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **API Integrations:** 
  - Brandfetch (active)
  - Printify (active)
  - Shopify (active)
- **Environment Variables:** Properly configured for production

### Configuration Management
- **SHOPIFY_STORE_NAME:** Configured from environment
- **API Keys:** Secured in environment variables
- **Event Logging:** Live and validated

---

## Key Decision Gate (Step 24)

### GO/NO-GO Criteria for Growth Tier ($24K / Year 1)

**Validated Inputs:**
1. ✅ Production analytics instrumentation live with ≥5 test events
2. ✅ 5 discovery calls completed with Series B-D decision-makers
3. ✅ Landing page aligned to product reality (drift remediation complete)
4. ✅ End-to-end pipeline functional with 10-