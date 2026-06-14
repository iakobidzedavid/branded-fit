# Architecture Documentation

## Project Overview
**Project Name:** Command Console & Analytics Platform  
**Status:** Series B-D Product Development  
**Last Updated:** 2026-06-14  
**Current Sprint:** Assumption Validation & Product Instrumentation

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │  Command Console │  │   Storefront Preview Component   │ │
│  │  (Next.js App)   │  │   (Product Instrumentation)      │ │
│  └────────┬─────────┘  └──────────────┬───────────────────┘ │
│           │                           │                      │
│           └───────────────┬───────────┘                      │
│                           │                                  │
│                    Event Emitters                           │
│                    (Real-time)                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Analytics Layer                           │
│  ┌──────────────────────────────────────────────────────────┐│
│  │         /api/analytics Endpoint (HTTP 201)              ││
│  │  • Receives conversion-funnel events                    ││
│  │  • Real-time event collection & validation             ││
│  │  • Database persistence                                ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               Data & Visualization Layer                     │
│  ┌──────────────────────────────────────────────────────────┐│
│  │            Analytics Dashboard                          ││
│  │  • Funnel Rendering: domain_submitted → conversion     ││
│  │  • Real-time metrics display                           ││
│  │  • Customer behavior analytics                         ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Build Status & Compilation

### Current State
- **TypeScript Compilation:** ✓ No errors
- **Next.js Production Build:** ✓ Compiled successfully
- **Production Readiness:** Ready for deployment

---

## Core Components

### 1. Command Console
- **Technology Stack:** Next.js, React, TypeScript
- **Purpose:** Primary user interface for product management
- **Features:**
  - Real-time event emission
  - Analytics instrumentation
  - Customer persona management
  
### 2. Storefront Preview
- **Technology Stack:** React Component, TypeScript
- **Purpose:** Product preview & live instrumentation
- **Features:**
  - Live event tracking
  - Real-time analytics data collection
  - Conversion funnel instrumentation

### 3. Analytics Endpoint
- **Endpoint:** `/api/analytics`
- **Method:** POST
- **Response Code:** HTTP 201 (Created)
- **Purpose:** 
  - Collects real conversion-funnel data
  - Validates event structure
  - Persists to analytics database

### 4. Analytics Dashboard
- **Purpose:** Visualization of conversion metrics
- **Key Metrics Tracked:**
  - Event: `domain_submitted`
  - Conversion events (downstream)
  - Funnel completion rates
- **Data Source:** `/api/analytics` endpoint

---

## Product Definition

### Target Customer Personas (Series B-D)

#### Persona 1: Maya Chen
- **Title:** VP People Operations, Mid-Market SaaS (50-200 employees)
- **Key Characteristics:**
  - Building team culture at scale
  - Focus on retention & engagement metrics
  - Tech-forward, data-driven
  - Budget authority: $24K-$36K annually
- **Psychographics:** Values efficiency, team alignment, measurable ROI

#### Persona 2: James Rodriguez
- **Title:** Operations Manager, Growth-Stage Startup (20-50 employees)
- **Key Characteristics:**
  - Rapid team expansion phase
  - Manual process pain points
  - Early adopter, risk-tolerant
  - Budget: $2K-$4.8K annually (Growth tier)
- **Psychographics:** Seeks simplicity, community, quick implementation

#### Persona 3: Sarah Kapoor
- **Title:** Chief People Officer, Enterprise (200+ employees)
- **Key Characteristics:**
  - Strategic talent & culture leader
  - Compliance & governance requirements
  - Enterprise software experienced
  - Budget: $36K+ annually
- **Psychographics:** Demands customization, integration, executive reporting

---

## Validation & Discovery Framework

### Step 21: Discovery Call Validation Framework
**Purpose:** Validate 6 gray assumptions across responding prospects

#### Call Structure
- **Duration:** 45-60 minutes (structured agenda)
- **Participants:** Vanta, Linear, Census, Hex, Mercury (5+ companies)
- **Documentation:** 29-field tracker system

#### Validation Criteria
1. **Brand-Fidelity NPS**
   - Target: ≥4/5
   - Measurement: Post-discovery NPS score
   
2. **Growth-Tier WTP (Willingness to Pay)**
   - Pricing Ladder (Van Westendorp): $2K / $4.8K / $24K / $36K
   - Testing: $24K acceptance validation
   - Method: Van Westendorp pricing ladder analysis

3. **Warm Introduction Acceptance**
   - Measurement: Yes/No on follow-up call
   - Target: ≥60% positive responses

#### Scoring Methodology
- **CONFIRM:** Assumption validated by 3+ respondents
- **GRAY:** Mixed signals or