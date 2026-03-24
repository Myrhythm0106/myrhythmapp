

# Reliability → Confidence → Productivity + Exportable Deck

## Three deliverables

### 1. Strengthen the Reliability-Confidence-Productivity narrative

The deck already touches on confidence (Slide 03 step 05, Slide 15) but doesn't explicitly connect the chain: **using MyRhythm → feeling reliable → confidence rebuilds → productivity increases**. This is the core behavioural insight and needs to be a visible thread.

**Changes to `ProductivityInvestorSlides.tsx`:**

- **Slide 15 (Early Evidence):** Add a 4th evidence card — **"Productivity"** with upward arrow: "As reliability builds and confidence returns, users report sustained productivity gains — not through working harder, but through trusting themselves to follow through." This completes the chain: Consistency → Re-engagement → Confidence → Productivity.

- **Slide 10 (How It Works):** Update the "Over time" step from "Confidence compounds" to **"Reliability becomes identity"** with detail: "You keep promises. Others notice. Confidence returns. Productivity follows naturally — not from pressure, but from self-trust."

- **Slide 07 (The Insight):** Add a second paragraph reinforcing the mechanism: "When people feel reliable, confidence returns. When confidence returns, productivity follows. The lever is not efficiency — it is self-trust."

### 2. Generate PDF version

Run a script that converts the 18 slides to a PDF using the existing React components rendered via headless browser (Puppeteer), capturing each slide at 1920x1080 and assembling into a single PDF document. Output to `/home/lovable/MyRhythm_Productivity_Investor_Deck.pdf`.

### 3. Generate Google Slides-compatible PPTX

Create a PPTX file using `pptxgenjs` that replicates the content and visual style of all 18 slides — same colour palette (#f97316 orange, #a855f7 purple, #1a1a2e navy), Inter font family, gradient accents. Each slide recreated with matching layout, stats, and text. Output to `/home/lovable/MyRhythm_Productivity_Investor_Deck.pptx`.

The PPTX will be importable into Google Slides and saveable as PDF from there.

### Files modified
- `src/components/investor/ProductivityInvestorSlides.tsx` — narrative updates (slides 7, 10, 15)

### Files generated
- `/home/lovable/MyRhythm_Productivity_Investor_Deck.pdf`
- `/home/lovable/MyRhythm_Productivity_Investor_Deck.pptx`

