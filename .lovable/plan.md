

# Interactive Gantt Chart Roadmap Page

## What We're Building
A new `/launch/roadmap` page with an interactive Gantt chart showing the MVP timeline (April-June 2026) and Full Launch timeline (April-December 2026). The page will include export to CSV (Google Sheets compatible), PDF download, and a shareable link.

## Page Structure

```text
+------------------------------------------+
|  LaunchLayout Header                     |
+------------------------------------------+
|  ROADMAP HERO                            |
|  "MyRhythm CCM Roadmap"                 |
|  [Download CSV] [Download PDF] [Share]   |
+------------------------------------------+
|  PHASE TABS: [MVP] [Full Launch] [All]   |
+------------------------------------------+
|  INTERACTIVE GANTT CHART                 |
|  ┌─────────────────────────────────┐     |
|  │ Apr  May  Jun  Jul  Aug ... Dec │     |
|  │ ████ Auth & Onboarding         │     |
|  │  ████ LEAP Core Features       │     |
|  │   ███ Stripe Integration       │     |
|  │      ████ Clinical Pilots      │     |
|  │        ██████ Scale & Growth   │     |
|  └─────────────────────────────────┘     |
+------------------------------------------+
|  MILESTONE CARDS (below chart)           |
|  Key dates with status indicators        |
+------------------------------------------+
```

## Technical Approach

### 1. Create roadmap data file
**`src/data/roadmapData.ts`** — All milestone/task data with dates, phases, dependencies, status, and colors. Dates: April-December 2026.

### 2. Create Gantt chart component
**`src/components/roadmap/GanttChart.tsx`** — Pure CSS/div-based horizontal bar chart (no external charting library needed). Each task is a colored bar positioned by start/end date. Hover shows details. Click expands subtasks. Responsive with horizontal scroll on mobile.

### 3. Create export utilities
**`src/components/roadmap/roadmapExports.ts`**:
- **CSV export**: Generates Google Sheets-compatible CSV with task name, phase, start date, end date, status, dependencies. Uses `Blob` + download link.
- **PDF export**: Uses `react-to-print` (already in project) to render the chart as a printable PDF.
- **Share**: Copies the `/launch/roadmap` URL to clipboard with toast confirmation.

### 4. Create the page
**`src/pages/launch/LaunchRoadmap.tsx`** — Uses `LaunchLayout`, renders hero section, phase filter tabs, `GanttChart`, milestone cards, and action buttons (CSV, PDF, Share).

### 5. Add route
Update **`src/App.tsx`** to add `/launch/roadmap` route wrapped in `LaunchModeProvider`.

### 6. Add navigation link
Update **`src/components/launch/LaunchNav.tsx`** or dashboard to include a link to the roadmap page.

## Roadmap Content (2026 Dates)

**MVP Phase (Apr 1 - Jun 30, 2026)**
- Auth & User Onboarding (Apr 1-18)
- LEAP Core: Memory Bridge + Scheduling (Apr 14 - May 16)
- 3-Tier Subscription UI (May 5-23)
- Stripe Payment Integration (May 19 - Jun 6)
- Beta Testing & QA (Jun 2-20)
- Soft Launch: 50 Founding Members (Jun 23-30)

**Full Launch Phase (Jul 1 - Dec 31, 2026)**
- Clinical Partnership Pilots (Jul 1 - Aug 15)
- Support Circle Features (Jul 14 - Aug 29)
- Brain Games & Cognitive Tools (Aug 4 - Sep 19)
- Analytics Dashboard (Sep 1 - Oct 3)
- B2B Enterprise Features (Oct 1 - Nov 14)
- Marketing & Growth Push (Nov 1 - Dec 12)
- £500K ARR Target (Dec 31)

## Export Formats
- **CSV**: Standard comma-separated with headers — opens directly in Google Sheets via File > Import
- **PDF**: Print-optimized layout via `react-to-print`
- **Share**: Clipboard copy of page URL

## Files to Create/Edit
| File | Action |
|------|--------|
| `src/data/roadmapData.ts` | Create — task/milestone data |
| `src/components/roadmap/GanttChart.tsx` | Create — interactive chart |
| `src/components/roadmap/RoadmapExports.ts` | Create — CSV/PDF/share utils |
| `src/components/roadmap/MilestoneCards.tsx` | Create — key date cards |
| `src/pages/launch/LaunchRoadmap.tsx` | Create — page component |
| `src/App.tsx` | Edit — add route |

