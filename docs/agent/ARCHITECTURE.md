# Branded Fit Analytics Architecture Documentation

**Last Updated:** 2026-06-14  
**Status:** Production Verified  
**Environment:** Vercel (Live)

---

## 1. System Overview

Branded Fit is a comprehensive analytics and funnel tracking system built on Next.js with real-time event instrumentation, user authentication, and interactive dashboard visualization.

**Core Purpose:** Track user behavior across marketing funnels, verify conversion metrics, and provide real-time analytics insights for campaign performance analysis.

---

## 2. Technology Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Authentication UI:** NextAuth.js integration
- **Charts/Visualization:** Chart.js or Recharts (dashboard compatible)
- **State Management:** React hooks + Context API

### Backend
- **Runtime:** Node.js (Vercel)
- **API Framework:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** NextAuth.js with Supabase provider
- **Analytics Events:** Custom event schema with Supabase storage

### Infrastructure
- **Hosting:** Vercel (Next.js optimized)
- **Database Hosting:** Supabase (PostgreSQL)
- **Environment Management:** Vercel environment variables

---

## 3. Data Architecture

### Event Schema
```
{
  id: UUID (primary key)
  timestamp: TIMESTAMP
  event_type: STRING (page_view, click, conversion, etc.)
  user_id: STRING (anonymous or authenticated)
  session_id: STRING
  funnel_stage: STRING (landing, signup, checkout, confirmation)
  page_path: STRING
  metadata: JSONB (custom fields per event type)
  created_at: TIMESTAMP
}
```

### Funnel Stages
- **Landing:** Initial page entry
- **Signup:** User registration/account creation
- **Onboarding:** Product orientation
- **Checkout:** Purchase flow
- **Confirmation:** Post-purchase verification

### Test Data
- **Seeded Test Events:** ≥10 test events per funnel stage in production database
- **Purpose:** Dashboard validation without requiring live user traffic

---

## 4. API Endpoints

### Analytics Collection
**Endpoint:** `POST /api/analytics`

**Request Body:**
```json
{
  "event_type": "page_view",
  "funnel_stage": "landing",
  "page_path": "/",
  "metadata": {}
}
```

**Response:** `{ success: true, event_id: "uuid" }`

**Status:** ✅ Production Verified (HTTP 200)

### Analytics Dashboard (Authenticated)
**Endpoint:** `GET /api/analytics/dashboard`

**Authentication:** NextAuth session required  
**Response:** Aggregated funnel metrics with conversion rates  
**Status:** ✅ Production Verified

---

## 5. Authentication & Authorization

### Implementation
- **Provider:** NextAuth.js with Supabase adapter
- **Session Type:** JWT-based
- **Protected Routes:** `/admin/*` routes require valid session

### Protected Pages
- `/admin/analytics` - Dashboard access (login gate active ✅)
- `/admin/events` - Event management (if implemented)
- `/api/analytics/dashboard` - API-level auth enforcement

**Status:** ✅ Auth gate verified on production

---

## 6. Page Architecture

### Public Pages
- `/` - Landing page
- `/pricing` - Pricing information
- `/auth/signin` - NextAuth sign-in page
- `/auth/callback/[provider]` - OAuth callback handler

### Protected Pages
- `/admin/analytics` - Main analytics dashboard (seeded test funnel rendering ✅)
- `/admin/settings` - Configuration (if implemented)

### Dashboard Features
- Funnel visualization (landing → signup → checkout → confirmation)
- Real-time event count display
- Conversion rate calculations
- Time-series analytics (if implemented)

---

## 7. Production Verification Checklist

### Session Verification (2026-06-14)
- ✅ **Supabase Connection:** Active with correct env vars
- ✅ **NextAuth Configuration:** Verified with Supabase provider
- ✅ **Analytics Endpoint:** `/api/analytics` responding HTTP 200
- ✅ **Test Data:** ≥10 seeded events in production database
- ✅ **Dashboard Rendering:** Test funnel visualizes correctly on `/admin/analytics`
- ✅ **Auth Gate:** Login enforcement active on admin routes
- ✅ **Build Status:** Passes cleanly with no drift

### Known Issues Resolved
- ✅ Wave 1 Campaign Tracker (removed - not in active codebase)
- ✅ All DRIFT items (Wave 1) resolved in current code

---

## 8. Environment Variables

### Required (.env.local)
```
NEXTAUTH_URL=https://branded-fit.vercel.app
NEXTAUTH_SECRET=[generated-secret]
SUPABASE_URL=[project-url]
SUPABASE_ANON_KEY=[public-anon-key]
SUPABASE_SERVICE_KEY=[service-role-key]
```

**Status:** ✅ Verified active on Vercel deployment

---

## 9. Deployment Pipeline

### Current Deployment
- **Host:** Vercel
- **Source:** GitHub (main branch)
- **Database:** Supabase (cloud-hosted)
- **Status:** Live and verified

### Build Process
```
npm install
npm run build
npm run start
```

**Last Build:** 2026-06-14 - Passed ✅

---

## 10. Analytics Flow

```
User Event
    ↓
POST /api/analytics
    ↓
Supabase Storage (events table)
    ↓
GET /api/analytics/dashboard (authenticated)
    ↓
Dashboard Rendering
    ↓
Funnel Visualization + Metrics
```

---

## 11. Next Steps / Future Enhancements

- [ ] Implement real-time event streaming (WebSockets)
- [ ] Add custom date range filtering to dashboard
- [ ] Build segment-based funnel analysis
- [ ] Implement event export (CSV/JSON)