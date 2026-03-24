

## Integrating CCM (Collaborative Cognitive Management) into the LEAP Framework

### The Fit

**LEAP** = the external brand identity (Life Empowerment and Productivity) — what users see.
**CCM** = the internal methodology engine (Collaborative Cognitive Management) — how it works.

This is a natural pairing: LEAP is the *what*, CCM is the *how*. "Collaborative" captures the Support Circle, caregiver involvement, Memory Bridge watchers, and shared calendars — features already built into the codebase. It also removes the clinical weight of "Continuation" while keeping the cognitive focus.

### Where CCM Lives

| Surface | How CCM appears |
|---------|----------------|
| User-facing app | Subtle — "Powered by Collaborative Cognitive Management" in about/settings, not on every screen |
| Welcome screens | Not mentioned — users see LEAP language (support, inspire, remind, encourage, empower) |
| Investor/strategy PDFs | Prominent — CCM is the proprietary methodology, the defensible IP layer |
| WHO/Insurer briefs | Central — CCM maps to reimbursement frameworks (RTM, REHAB 2030) as the clinical-adjacent model |
| Founder's story | "The CCM methodology was born from lived experience" |

### CCM's Three Pillars (Updated)

1. **Collaborative** — Support Circles, caregiver dashboards, shared Memory Bridge items, watcher accountability
2. **Cognitive** — Rhythmic Intelligence (RI), energy-aware scheduling, Memory Bridge capture, pattern recognition
3. **Management** — Task chunking, smart scheduling, calendar sync, progress tracking, celebration streaks

### Impact on the Approved Plan

The previously approved plan (neurodiverse user flows + strategy PDFs) remains unchanged except:

- **`MyRhythm_5_Year_Strategy_v5.pdf`** — CCM is redefined as "Collaborative Cognitive Management" throughout. The three pillars update from User/Caregiver/Clinical to Collaborative/Cognitive/Management. Positioned as the proprietary methodology powering the LEAP platform.
- **`MyRhythm_WHO_Insurer_Executive_Brief_v2.pdf`** — Same reframing. CCM as the methodology that maps to institutional frameworks.
- **Welcome screens** (ADHD, Long COVID, MS Cognitive) — No change. They use LEAP empowerment language. CCM stays behind the scenes.
- **Existing codebase references** — `memory/brand/cognitive-continuation-management` context and any in-app references to "Cognitive Continuation Management" will be updated to "Collaborative Cognitive Management."
- **Investor slides** (`InvestorSlides.tsx`) — CCM pillar descriptions updated to reflect the Collaborative/Cognitive/Management framing.

### Files Affected (in addition to the previously approved plan)

- `src/components/investor/InvestorSlides.tsx` — Update CCM pillar names and descriptions
- Strategy and brief PDFs — CCM redefined throughout
- Any component referencing "Cognitive Continuation Management" (will search and update)

