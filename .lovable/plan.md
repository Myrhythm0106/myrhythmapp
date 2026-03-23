

## Update 5-Year Strategy PDF — Timeline Shift + Text Wrapping

### Changes

**1. Shift timeline to start April 2026 (US-first)**

All year references shift forward by ~1 year:

| Current | Updated |
|---------|---------|
| 2025–2030 | 2026–2031 |
| Year 1 — 2025: Foundation & Validation (UK) | Year 1 — 2026/27: US Launch & Validation (April 2026 start) |
| Year 2 — 2026: US Launch | Year 2 — 2027/28: Scale & International |
| Year 3 — 2027 | Year 3 — 2028/29 |
| Year 4 — 2028 | Year 4 — 2029/30 |
| Year 5 — 2029-2030 | Year 5 — 2030/31 |

The cover page subtitle becomes **"April 2026 – March 2031"**. Year 1 starts in the US (not UK), reflecting the US-first strategy. All quarterly milestones, funding rounds, and KPI tables shift accordingly.

**2. Fix text wrapping in tables**

The root cause of text merging/overflow is that cell content is plain strings, not `Paragraph` objects. Plain strings don't wrap — they overflow into adjacent cells.

Fix: Convert all table cell data to `Paragraph` objects with a cell-specific style that has proper word wrapping and controlled `fontSize=8`. This applies to every `tbl()` call in the script (~15 tables). Update the `tbl()` helper function to auto-wrap any string cell into a `Paragraph`.

### Technical detail

- Modify the `tbl()` function to auto-convert string cells: `Paragraph(str(cell), cell_style)` where `cell_style` has `wordWrap='CJK'` and appropriate leading
- Adjust column widths where needed to give more space to text-heavy columns
- Update all date references, milestone labels, revenue targets, and copyright footer

### File changed
- `/tmp/strategy_pdf.py` — rewrite with shifted timeline + Paragraph-wrapped table cells
- Output: `/mnt/documents/MyRhythm_5_Year_Strategy_v2.pdf`

