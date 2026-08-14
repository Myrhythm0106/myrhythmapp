# MyRhythm PRD (Confidential Preview) — PDF

A shareable Product Requirements Document that conveys the feel, purpose and shape of MyRhythm without disclosing the proprietary mechanics. Written for prospective partners, rehab contacts, advisors and early investors who will sign an NDA; the PDF itself is safe to send ahead of signature.

## What the PDF contains

1. **Cover** — MyRhythm, Founding Edition, "Confidential Preview — Not for distribution", date, prepared-by line.
2. **Confidentiality notice** — one short page stating the document is shared in confidence, that a full disclosure requires a signed NDA, and that a detailed technical/commercial pack is available under NDA.
3. **The problem** — the three failures in plain language: the discharge cliff, the gap between clinically ready and life ready, and the assumption that everyone starts with an ideal brain. Framed so a reader with no brain injury still sees themselves in it.
4. **The definition** — the app that keeps your plan going after the appointment ends or the commitment has been made. Category line: Memory-First Design.
5. **Who it is for** — primary cohort plus the wider audiences (ADHD, dementia/MCI, stress and burnout, focus), and the Support Circle as a second user type.
6. **What the product does** — five to six capability blocks described by outcome, not implementation: capture without having to remember, turn talk into agreed next steps, a plan that fits the day's energy, gentle follow-through, shared progress with the people who matter, and an exportable summary to hand to a clinician.
7. **A day in the life** — one short narrative walkthrough, no screenshots, that gives the feel of using it.
8. **Principles and guardrails** — accessibility floor, three-choices rule, first-person ownership voice, and the non-negotiable non-medical stance (does not diagnose, treat or cure).
9. **Where it sits in the care journey** — the pre-discharge to home continuum at a high level, and why written evidence of follow-through matters to services.
10. **Status and roadmap** — current release stage, what is live now, what is next, expressed in horizons rather than dated engineering commitments.
11. **Business model** — pricing ladder at headline level only; unit economics and forecasts marked "available under NDA".
12. **What is deliberately withheld** — a short honest list (scoring model internals, AI prompt and extraction design, data schema, evidence and research layer, financial model), each labelled as released after NDA. This signals substance without revealing it.
13. **Next steps** — sign NDA, then full product walkthrough and data room access.

## Deliberately excluded

Algorithm and scoring logic, prompt design, database schema, edge function architecture, competitor-by-competitor teardown, revenue forecasts, investor financials, and screenshots of unreleased surfaces.

## Technical notes

- Generated with a one-off Python + ReportLab script under `/tmp`; no changes to app source.
- Brand-matched: brand orange accent, teal secondary, stone text, DejaVu Sans registered for clean typography.
- Every page carries the confidentiality footer per the Document Confidentiality Standard, plus page numbers.
- Output written to `/mnt/documents/MyRhythm-PRD-Confidential-Preview.pdf` and surfaced as a downloadable artifact.
- QA pass: every page rendered to image and inspected for overflow, clipping, spacing and contrast before delivery.

An NDA template is not included in this pass — say the word and I will add a companion one-page mutual NDA PDF.
