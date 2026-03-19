# 🛡️ GigShield
### AI-Powered Parametric Income Protection for India's Gig Delivery Workers

> *"GigShield doesn't estimate losses — it mirrors real earnings from unaffected peers and protects gig workers before, during, and after disruptions."*

**Hackathon:** Guidewire DEVTrails 2026
**Team:** [Your Team Name]
**Persona:** Food Delivery Partners — Zomato & Swiggy (Hyderabad)
**Platform:** Progressive Web App (Mobile-first)
**Phase 1 Prototype:** [🔗 Live Demo](https://your-demo-link-here.com)
**Demo Video:** [▶️ Watch on YouTube](https://your-video-link-here.com)

---

## 📋 Table of Contents
1. [The Problem](#1-the-problem)
2. [Our Solution](#2-our-solution)
3. [Persona & Scenarios](#3-persona--scenarios)
4. [Application Workflow](#4-application-workflow)
5. [Weekly Premium Model](#5-weekly-premium-model)
6. [Parametric Triggers](#6-parametric-triggers)
7. [Web vs Mobile Decision](#7-web-vs-mobile-decision)
8. [AI/ML Integration Plan](#8-aiml-integration-plan)
9. [Tech Stack](#9-tech-stack)
10. [Development Plan](#10-development-plan)
11. [Unique Differentiators](#11-unique-differentiators)
12. [Constraints Compliance](#12-constraints-compliance)

---

## 1. The Problem

India has over **15 million platform-based gig delivery workers** on Zomato, Swiggy, and similar platforms. A Zomato delivery partner in Hyderabad earns approximately **₹600–800/day** and **₹4,500–5,500/week** — but only when they can actually work.

External disruptions they cannot control — heavy monsoon rain, dangerous heat, AQI spikes, zone curfews, or platform outages — can wipe out **20–30% of monthly earnings** overnight. When this happens:

- ❌ No employer to fall back on
- ❌ No ESIC or government safety net
- ❌ No insurance product designed for their work pattern
- ❌ No way to recover lost wages

**They bear the full financial loss. Every single time.**

---

## 2. Our Solution

**GigShield** is a parametric income insurance platform that:

1. **Predicts** disruptions before they happen using AI weather forecasting
2. **Detects** disruptions in real-time via 5 automated API triggers
3. **Calculates** lost income fairly using our **Income Mirror** engine — peer earnings comparison, not flat payouts
4. **Pays** the worker directly to their UPI wallet in under 90 seconds, automatically
5. **Catches fraud** using a Graph Neural Network that detects GPS spoofing and coordinated fake claims

> ⚠️ **Coverage scope: LOSS OF INCOME ONLY.** GigShield strictly excludes health, life, accident, or vehicle repair coverage.

---

## 3. Persona & Scenarios

### Primary Persona: Ramesh, Zomato Delivery Partner, Hyderabad

| Attribute | Detail |
|-----------|--------|
| Age | 28 |
| Platform | Zomato (full-time) |
| Daily earnings | ₹720 on active days |
| Weekly earnings | ₹4,800 (6-day week) |
| Working hours | 11 AM–3 PM (lunch) + 6 PM–10 PM (dinner) |
| Primary zone | Old City, Hyderabad — High Risk |
| Payment | Weekly UPI transfer from Zomato |

### Real Disruption Scenarios

| Scenario | Disruption | Trigger Condition | Income Lost | GigShield Response |
|----------|-----------|-------------------|-------------|-------------------|
| S1 | Heavy monsoon rain | Rainfall > 35mm/hr for 2+ hrs | ₹380/shift | Income Mirror payout auto-triggered |
| S2 | Extreme heat | Temp > 44°C for 3+ hrs, 11AM–4PM | ₹290/shift | Coverage window activates |
| S3 | Severe AQI | AQI > 300 for 4+ hrs | ₹340/shift | Parametric trigger fires |
| S4 | Zone curfew | Any official zone closure | 100% of shift | Full shift coverage |
| S5 | Platform outage | Order velocity drops >80% for 2+ hrs | ₹250/shift | Velocity signal triggers claim |

---

## 4. Application Workflow

```
[WORKER ONBOARDING]
  Opens PWA → OTP login → Earnings Simulator shows personalised risk
  → Risk profile generated → Weekly premium quoted → Policy purchased
           ↓
[ACTIVE COVERAGE WEEK]
  5 API signals polled every 10 min per zone
  (Weather · AQI · GPS Cluster · Order Velocity · Social Signals)
  Predictive model runs 48-hr forecast
  If risk > 65%: Worker notified, coverage pre-armed
           ↓
[DISRUPTION DETECTED]
  Parametric threshold crossed
  Income Mirror queries peer cohort earnings in adjacent zones
  Ghost earnings calculated → Payout = Ghost earnings × 80%
           ↓
[FRAUD CHECK]
  GNN scores each claim (0–1 fraud probability)
  > 0.72 → Auto-blocked | 0.55–0.72 → Flagged | < 0.55 → Proceed
  Trust Score < 70 → Selfie verification before release
           ↓
[INSTANT PAYOUT]
  Razorpay API fires UPI transfer < 90 seconds
  Push notification sent to worker
  Claim logged in both worker and insurer dashboards
```

---

## 5. Weekly Premium Model

GigShield uses a **weekly pricing model** matching the Zomato/Swiggy weekly payout cycle. Every Sunday at midnight, the XGBoost model recalculates the premium for the upcoming week.

### Premium Formula

```
Weekly Premium = Base Rate × Zone Risk Multiplier × Trust Modifier × Forecast Multiplier

Base Rate:             ₹35/week
Zone Risk Multiplier:  0.6 (Green zone) → 1.0 (Amber) → 1.8 (Red)
Trust Modifier:        0.85 (score 90+) → 1.0 (70–90) → 1.15 (below 70)
Forecast Multiplier:   0.9 (calm week ahead) → 1.3 (severe forecast)
```

### Sample Pricing Table

| Worker Profile | Zone | Trust Score | Weekly Premium | Max Weekly Payout |
|---|---|---|---|---|
| New partner | Old City (Red) | 70 | ₹65 | ₹1,100 |
| 6-month partner | Banjara Hills (Amber) | 82 | ₹42 | ₹1,200 |
| 2-year veteran | Hitech City (Green) | 94 | ₹21 | ₹1,350 |
| Average partner | Secunderabad (Amber) | 78 | ₹38 | ₹1,200 |

### Key Rules
- Premium is **weekly** — no monthly or annual lock-in
- Workers can **pause** any week with no penalty
- Max payout capped at ₹1,350/week (~28% of average weekly earnings)
- **8% of every premium** goes to the zone-level Mutual Aid Pool reserve

---

## 6. Parametric Triggers

All 5 triggers fire **automatically** — no claim action required from the worker.

| # | Trigger | API Source | Threshold | Disruption Type |
|---|---------|-----------|-----------|----------------|
| T1 | Heavy rainfall | OpenWeatherMap (free tier) | > 35mm/hr sustained 2+ hrs | Environmental |
| T2 | Extreme heat | OpenWeatherMap (free tier) | > 44°C for 3+ hrs, 11AM–4PM | Environmental |
| T3 | Severe AQI | AQI India API (free tier) | AQI > 300 for 4+ hrs | Environmental |
| T4 | Zone curfew/strike | Government alert feed (mock) | Any official zone closure | Social |
| T5 | Platform outage | Zomato velocity API (mock) | Order drop > 80% for 2+ hrs | Platform |

**Income Mirror replaces flat payouts:** When a trigger fires, GigShield queries peer worker earnings in adjacent unaffected zones. Payout = peer median earnings × hours affected × 80% coverage ratio.

---

## 7. Web vs Mobile Decision

**Decision: Progressive Web App (PWA) — Mobile-first**

| Factor | Rationale |
|--------|-----------|
| Device | 94% of delivery partners use Android smartphones |
| No app store friction | Shareable via WhatsApp link — zero download barrier |
| Offline support | Service worker caches coverage status for low-connectivity zones |
| Push notifications | Critical for disruption alerts and payout confirmations |
| Single codebase | One React PWA serves worker mobile + insurer desktop dashboard |
| Cost | No Play Store fees or approval delays |

---

## 8. AI/ML Integration Plan

### 8.1 Dynamic Weekly Premium — XGBoost
**Runs:** Every Sunday midnight + on new worker signup
**Input features:** Zone risk score, claim history, trust score, 7-day forecast severity, activity level
**Output:** Weekly premium ₹18–₹65
**Phase 1:** Rule-based formula | **Phase 2:** Full XGBoost trained on synthetic data

### 8.2 Income Mirror — Peer Earnings Regression
**Runs:** Seconds after a parametric trigger fires
**How:** PostGIS spatial query → peer cohort in adjacent zones → percentile regression → ghost earnings → payout
**Why it matters:** Fair, proportional payouts. Fraud-proof. No flat amounts.

### 8.3 Predictive Disruption Alerts
**Runs:** Every 6 hours on 48-hr weather forecast
**Model:** XGBoost classifier (weather features → order volume drop correlation)
**Output:** Disruption probability per zone per 2-hr window
**Action:** Probability > 0.65 → push notification + pre-arm trigger

### 8.4 Fraud Detection — Progressive Approach
| Phase | Method | Capability |
|-------|--------|-----------|
| Phase 1 | Trust score rules | Activity gap detection, claim frequency limits |
| Phase 2 | Isolation Forest | Anomaly detection on GPS + timing patterns |
| Phase 3 | GraphSAGE GNN (PyTorch Geometric) | GPS spoofing, coordinated fraud rings, ghost workers |

### 8.5 Zone Risk Heatmap
**Data:** 3-year IMD rainfall + AQI India + curfew incident logs
**Output:** Risk score 0–100 per zone, updated weekly
**Used for:** Premium adjustment + insurer dashboard visualisation

---

## 9. Tech Stack

### Frontend
| Component | Technology |
|-----------|-----------|
| Worker PWA | React 18 + Vite |
| Maps & Heatmap | Leaflet.js + GeoJSON |
| UI | Tailwind CSS |
| Charts | Recharts |
| Push Notifications | Web Push API |

### Backend
| Component | Technology |
|-----------|-----------|
| API Server | Node.js + Express |
| ML Service | FastAPI (Python) |
| Database | PostgreSQL + PostGIS (Supabase free tier) |
| Event Bus | Redis Pub/Sub |
| Auth | Firebase Auth (mobile OTP) |

### AI/ML
| Model | Library | Phase |
|-------|---------|-------|
| Premium calculation | XGBoost | Phase 2 |
| Disruption prediction | XGBoost classifier | Phase 2 |
| Anomaly detection | Isolation Forest (scikit-learn) | Phase 2 |
| Fraud GNN | PyTorch Geometric (GraphSAGE) | Phase 3 |
| Income Mirror | Percentile regression (scipy) | Phase 2 |

### Integrations
| Service | Tool | Mode |
|---------|------|------|
| Weather | OpenWeatherMap API | Live (free tier) |
| Air Quality | AQI India API | Live (free tier) |
| Platform data | Zomato-style velocity API | Mock / simulated |
| Payment | Razorpay | Test mode sandbox |
| Social alerts | Government closure feed | Mock |

### Hosting (all free tier)
| Component | Platform |
|-----------|---------|
| Frontend | Vercel |
| Backend | Railway |
| ML service | Render |
| Database | Supabase |

---

## 10. Development Plan

### Phase 1 — Ideation & Foundation ✅ Current (March 4–20)
- [x] Persona research and scenario definition
- [x] Tech stack decision and repo setup
- [x] README documentation
- [x] Earnings Simulator prototype
- [x] Zone Risk Heatmap prototype
- [x] Worker onboarding flow (static)
- [ ] 2-minute strategy video

### Phase 2 — Automation & Protection (March 21 – April 4)
- [ ] Worker registration with Firebase OTP
- [ ] XGBoost premium model (trained on synthetic data)
- [ ] 5 parametric triggers wired to OpenWeatherMap + AQI + 3 mock APIs
- [ ] Income Mirror engine (peer cohort query + regression)
- [ ] Zero-touch claim flow end-to-end
- [ ] Predictive disruption alerts (48-hr forecast + push notification)
- [ ] Razorpay sandbox payout integration
- [ ] Policy management UI

### Phase 3 — Scale & Optimise (April 5–17)
- [ ] GNN fraud detection (PyTorch Geometric GraphSAGE)
- [ ] Worker Trust Score system
- [ ] Mutual Aid Pool reserve logic
- [ ] Worker dashboard (earnings protected, claims, active policy)
- [ ] Insurer dashboard (loss ratio, zone heatmap, fraud flags, predictions)
- [ ] 5-minute final demo video (full disruption simulation)
- [ ] Final pitch deck PDF

---

## 11. Unique Differentiators

### Income Mirror
Every other insurance product pays a flat amount. GigShield queries what unaffected peer workers **actually earned** in the same zone during the same window, and pays proportionally. This is fairer, fraud-proof, and actuarially defensible.

### Predictive Protection
GigShield activates coverage **before rain starts**. At 65%+ disruption probability, the worker is notified and coverage is pre-armed. Insurance becomes preventive, not reactive.

### Mutual Aid Pool
8% of every premium builds a zone-level community reserve. During catastrophic multi-day events, the pool auto-releases a supplementary payout (up to 1.5× base). Gig workers protecting gig workers — culturally resonant with India's chit fund tradition.

### Zone Intelligence Layer
Every Hyderabad delivery zone has a live Risk Score (0–100) driving premiums, coverage limits, and alerts. The insurer dashboard shows a live heatmap — real underwriting intelligence, not just a UI.

---

## 12. Constraints Compliance

| Constraint | Status | Detail |
|-----------|--------|--------|
| Persona: Food delivery only | ✅ Compliant | Zomato/Swiggy, Hyderabad |
| Coverage: Income loss only | ✅ Compliant | No health, accident, or vehicle features |
| Weekly pricing model | ✅ Compliant | Premium recalculated every Sunday |
| No annual lock-in | ✅ Compliant | Workers can pause any week, no penalty |

---

## 📁 Repository Structure

```
gigshield/
├── README.md                  ← This file (Phase 1 submission)
├── prototype/                 ← Phase 1 prototype
│   └── index.html             ← Interactive demo (Simulator + Heatmap + Onboarding)
├── frontend/                  ← React PWA (Phase 2+)
├── backend/                   ← Node.js API server (Phase 2+)
├── ml-service/                ← FastAPI + XGBoost + PyTorch (Phase 2+)
└── docs/
    └── architecture.md
```

---

*Built for Guidewire DEVTrails 2026. Coverage scope: income loss from external disruptions only. All platform API integrations use mock/simulated data for demonstration purposes.*
