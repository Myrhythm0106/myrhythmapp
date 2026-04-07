

# Add Confidentiality Footer to All Strategic Documents

## Footer Text

Every page/sheet/slide of every document related to the app gets:

```
Confidential – Not for Distribution
© 2026 Annabel Aaron. All rights reserved.
```

## Document Inventory

### Markdown Files (14 files) — Add as final line
| # | File |
|---|------|
| 1 | `docs/myrhythm-one-page-pitch.md` |
| 2 | `docs/v0.1-features.md` |
| 3 | `docs/v0.1-friends-family-testing-guide.md` |
| 4 | `docs/v0.1-testing-plan.md` |
| 5 | `docs/v0.2-complete-testing-guide.md` |
| 6 | `MyRhythm_Executive Summary_One_Page.md` |
| 7 | `MyRhythm_500K_Marketing_Strategy_2025.md` |
| 8 | `MyRhythm_Investor_Presentation_Script.md` |
| 9 | `MyRhythm_Investment_Presentation_Deck.md` |
| 10 | `MyRhythm_Justification_and_Commercials_Document.md` |
| 11 | `MyRhythm_Revenue_Strategy_500K_Plan.md` |
| 12 | `MyRhythm_Value_Proposition_USP_Document.md` |
| 13 | `MyRhythm_Operational_Execution_Plan.md` |
| 14 | `MyRhythm_Executive_Strategy_Overview.md` |
| 15 | `/mnt/documents/MyRhythm_PRD_IP_Documentation.md` |
| 16 | `/mnt/documents/MyRhythm_CCM_Deck_Design_Philosophy.md` |
| 17 | All 9 files in `strategic-documents/` |

For markdown: append a horizontal rule and the footer in italics at the bottom of each file.

### Excel Files (2 files) — Add footer row + sheet header/footer
| # | File |
|---|------|
| 1 | `/mnt/documents/MyRhythm_LEAP_OS_5Year_Execution_Plan.xlsx` |
| 2 | `/mnt/documents/MyRhythm_LEAP_OS_Financial_Model_v2.xlsx` |

For Excel: add the confidentiality text as a print footer on every sheet, and as a merged row at the bottom of each sheet's data area.

### PDF Files — Regenerate latest versions only
| # | File | Method |
|---|------|--------|
| 1 | `/mnt/documents/MyRhythm_Productivity_5_Year_Strategy_v10.pdf` | Regenerate via ReportLab with footer on every page |
| 2 | `/mnt/documents/MyRhythm_PRD_IP_Documentation.pdf` | Regenerate from updated markdown |
| 3 | `/mnt/documents/MyRhythm_5_Year_Strategy_v5.pdf` | Regenerate with footer |
| 4 | `/mnt/documents/MyRhythm_WHO_Insurer_Executive_Brief.pdf` | Regenerate with footer |

Older PDF versions (v1-v9, etc.) will NOT be regenerated — they are superseded.

### PPTX Files (2 files) — Add footer to every slide
| # | File |
|---|------|
| 1 | `/mnt/documents/MyRhythm_CCM_Investor_Deck_v2.pptx` |
| 2 | `MyRhythm_Productivity_Investor_Deck_v2.pptx` |

For PPTX: add the confidentiality text as a text box at the bottom of every slide.

## What Won't Be Changed
- `README.md`, `package.json`, config files — not strategic documents
- Older PDF versions — superseded by latest
- Source code files — not documents
- `90_Day_Brain_Health_Quotes_MyRhythm.md`, `Daily_Action_Plan_2025_Detailed.md`, `MEMORY_PARTNER_DECISION_LOG.md` — internal working notes, not presentation documents (will include if you want)

## Technical Approach
- Markdown: simple append
- Excel: openpyxl to add print headers/footers and visible footer rows
- PDFs: regenerate using ReportLab scripts with a page footer callback
- PPTX: unpack, add footer text box to each slide, repack

