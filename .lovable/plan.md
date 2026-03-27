

# Add Provider Directory / Marketplace to 5-Year Strategy

## Concept

A **Provider Directory** within MyRhythm where clinics, neurologists, neuropsychologists, and other brain health / memory specialists can advertise and promote their services to users. This creates a new revenue stream (listing fees, promoted placements) and builds a two-sided marketplace connecting patients with qualified providers.

The app already has a `LocalServicesCard` and `localServicesData.ts` with hardcoded services — this evolves into a self-service provider marketplace.

## What Changes

### 1. Productivity 5-Year Strategy PDF (v5)

Add a new section: **"Provider Directory & Marketplace"** woven into the roadmap:

- **Year 1 (Post-MVP, Months 4-6)**: Curated directory — MyRhythm lists vetted clinics, neurologists, neuropsychologists, and brain health professionals. Free listings to seed the directory. Users discover providers by category and location.
- **Year 2**: Self-service provider portal — professionals create profiles, add credentials, specialities (TBI, ABI, memory rehabilitation, neuropsychology), and service descriptions. Paid promoted listings and featured placements introduced as a new revenue stream.
- **Year 3-5**: Full marketplace — providers advertise directly to users based on cognitive profile and location. Appointment booking integration. Verified credentials badge. Provider analytics dashboard (impressions, enquiries). This becomes a significant B2B revenue channel alongside clinical licensing.

New revenue line item: **Provider Directory fees** (listing subscriptions from £29-£199/month depending on tier and visibility).

### 2. Productivity Investor Deck (`ProductivityInvestorSlides.tsx`)

- **Slide 20 (Post-MVP)**: Add "Provider Directory — Clinics and specialists advertise brain health services to users" to the Post-MVP list
- **Revenue slide** (if applicable): Reference provider listing fees as an additional B2B revenue stream

### 3. One-Page Pitch (`docs/myrhythm-one-page-pitch.md`)

- **Business Model / Future B2B section**: Add provider directory listing fees as a revenue stream
- **Roadmap**: Reference provider marketplace in Phase 2-3

### 4. Executive Summary (`MyRhythm_Executive Summary_One_Page.md`)

- **Business Model section**: Add provider advertising/directory as a revenue channel

### 5. PRD (`/mnt/documents/MyRhythm_PRD_IP_Documentation.md`)

- Add a new subsection describing the Provider Directory feature, its evolution from curated to self-service, and how it connects users with memory and brain health specialists

## Revenue Model for Provider Directory

| Tier | Price | Features |
|------|-------|----------|
| Basic Listing | Free | Name, address, specialities, contact |
| Professional | £49/month | Enhanced profile, photos, credentials, priority in search |
| Premium | £149/month | Featured placement, analytics dashboard, direct messaging |

## Files

| File | Action |
|------|--------|
| `/mnt/documents/MyRhythm_Productivity_5_Year_Strategy_v5.pdf` | Regenerate with Provider Directory section |
| `src/components/investor/ProductivityInvestorSlides.tsx` | Add to Post-MVP slide |
| `docs/myrhythm-one-page-pitch.md` | Add to Business Model |
| `MyRhythm_Executive Summary_One_Page.md` | Add to revenue channels |
| `/mnt/documents/MyRhythm_PRD_IP_Documentation.md` | Add Provider Directory subsection |

