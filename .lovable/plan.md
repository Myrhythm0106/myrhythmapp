# Update All Strategic Documents with Assistant-First Smart Scheduling

## What Changed

The Smart Scheduling feature has evolved from a basic "calendar sync + energy-aware time blocking" concept into an **Assistant-First Personal Assistant** model powered by CCM and the MYRHYTHM assessment. The new flow is:

**Memory Bridge captures → MYRHYTHM assessment determines cognitive peaks → AI auto-schedules at optimal windows → User confirms via SmartScheduleCard (or auto-accepts) → Calendar syncs with attendees from Support Circle or external email entered.**

Key additions: context-aware attendee suggestions, auto-accept mode, progressive trust model, inline invitations from Support Circle + any email.

## Documents to Update (7 files)

### 1. PRD & IP Documentation (`/mnt/documents/MyRhythm_PRD_IP_Documentation.md`)

**Section 5.2 Smart Scheduling** (lines 858-888): Rewrite to describe the Assistant-First model:

- User flow changes from manual review to: AI auto-proposes schedule → SmartScheduleCard shows summary → user swipes to approve/adjust/dismiss or enables auto-accept
- Add attendee invitation flow (Support Circle + manual email)
- Add `extractMentionedContacts()` as proprietary logic — NLP cross-references action text with Support Circle members
- Update ICS/Google/Outlook attendee integration description

**Section 6.1 The 4C Behaviour Loop** (line 1177): Update "Commit" pillar to reference Assistant-First scheduling with attendee invitations and auto-accept mode

**Section 6.3 Energy-Aware Intelligence Layer** (line 1201): Add reference to SmartScheduleCard and auto-scheduling

### 2. ABI/TBI Investor Deck (`src/components/investor/InvestorSlides.tsx`)

- **Line 313** (Slide 06 — Smart Scheduling feature card): Update description to: "Your AI personal assistant. MYRHYTHM assessment determines your cognitive peaks. Memory Bridge extracts commitments. AI auto-schedules at optimal windows, suggests inviting certain categories of attendees from your Support Circle, and syncs with Google Calendar and Outlook."
- **Line 913** (Slide 20 — MVP): Update to: "Smart Scheduling — MYRHYTHM assessment determines peaks; AI auto-schedules with attendee invitations; invites attendees whose emails have been entered then confirm or auto-accept.  Emails entered will have the option of being saved for easy reference. and SMART showup on the screen if the letters entered by the user match what is stored.  This will be presented SMARTLY and will not impact the user from typing if what is stored does not match what they need."

### 3. Productivity Investor Deck (`src/components/investor/ProductivityInvestorSlides.tsx`)

- **Line 261** (Slide 08 — CCM pillars, Management): Update to include "Assistant-First auto-scheduling with attendee invitations"
- **Line 824** (Slide 17 — MVP features): Update Smart Scheduling description to reflect Assistant-First model with auto-accept and attendee suggestions

### 4. One-Page Pitch (`docs/myrhythm-one-page-pitch.md`)

- **Solution table** (line 18-24): Add Smart Scheduling row: "📅 **Smart Scheduling** | MYRHYTHM assessment determines your peaks. AI auto-schedules commitments from Memory Bridge at optimal times, suggests inviting Support Circle members, syncs with Google Calendar & Outlook."
- **UVP section** (line 32-38): Add bullet: "Uses **Assistant-First scheduling** — AI auto-places commitments at cognitive peak times with attendee invitations"

### 5. Executive Summary (`MyRhythm_Executive Summary_One_Page.md`)

- **UVP section** (line 11): Add Smart Scheduling + memory to the feature list
- **Competitive Advantage** (line 27-30): Add "Assistant-First AI scheduling" as differentiator

### 6. Investment Presentation Deck (`MyRhythm_Investment_Presentation_Deck.md`)

- **Slide 3 Core Features**: Add Smart Scheduling with Assistant-First description
- **Slide 5 or relevant slide**: Reference the scheduling + attendee invitation flow

### 7. Productivity 5-Year Strategy PDF (regenerate)

- Regenerate `/mnt/documents/MyRhythm_Productivity_5_Year_Strategy_v3.pdf` with updated Smart Scheduling section describing:
  - MYRHYTHM assessment → cognitive peak mapping
  - Memory Bridge → action extraction → auto-scheduling
  - SmartScheduleCard confirm/auto-accept flow
  - Attendee invitations (Support Circle + manual email)
  - Progressive trust: review mode → auto-accept as confidence grows
  - Year 1 MVP feature, refined in Year 2 with clinical data

## 5-Year Plan Placement

- **Year 1 (MVP, Months 1-3)**: Smart Scheduling with MYRHYTHM-driven peak detection, SmartScheduleCard review mode, basic attendee invitations from Support Circle, Google Calendar + Outlook sync
- **Year 1 (Post-MVP, Months 4-6)**: Auto-accept mode, advanced NLP contact extraction, progressive trust calibration
- **Year 2**: Clinical dashboard integration for Smart Scheduling data, institutional scheduling workflows
- **Year 3-5**: Rhythmic Intelligence (RI) predictive scheduling, multi-user scheduling coordination

## Consistency Checklist

All documents will use consistent language:

- "Assistant-First Smart Scheduling" as the feature name
- "MYRHYTHM assessment determines cognitive peaks" for the assessment link
- "Memory Bridge captures → AI auto-schedules at optimal windows" for the flow
- "SmartScheduleCard" for the UI (technical docs only)
- "Confirm or auto-accept" for the user interaction model
- "Support Circle + any email" for attendee invitations
- CCM framing throughout — this is the "Commit" phase of the 4C loop