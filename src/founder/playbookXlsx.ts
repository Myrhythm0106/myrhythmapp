// Playbook ⇄ Google Sheet bridge.
//
// Export: builds a multi-tab .xlsx from src/founder/playbook.ts, merged with
//         whatever progress is currently recorded in the app.
// Import: reads the same workbook back and returns progress rows to upsert.
//
// The contract between the two directions is the `Key` column. Structure
// columns are regenerated on every export — only Status / Value / Note
// travel back into the app.

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  GATES,
  HORIZONS,
  LEGAL_ITEMS,
  METRICS,
  METRICS_STANDARDS_NOTE,
  MVP_CHECKLIST,
  OBJECTIVES,
  PLAN_WEEKS,
  PLAYBOOK_FOOTER,
  PLAYBOOK_KEY_SET,
  PLAYBOOK_STATUSES,
  PLAYBOOK_VERSION,
  RISKS,
  type PlaybookProgressRow,
  type PlaybookStatus,
} from './playbook';

const GOLD = 'FFB78628';
const INK = 'FF111827';
const MUTED = 'FF6B7280';
const IVORY = 'FFFBF7EF';

type Progress = Record<string, PlaybookProgressRow>;

function styleHeader(row: ExcelJS.Row) {
  row.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Calibri', size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GOLD } };
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  });
  row.height = 24;
}

/** Adds Status / Value / Note columns and a dropdown on Status. */
function addTrackingValidation(ws: ExcelJS.Worksheet, statusCol: string, firstRow: number, lastRow: number) {
  for (let r = firstRow; r <= lastRow; r++) {
    ws.getCell(`${statusCol}${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`"${PLAYBOOK_STATUSES.join(',')}"`],
    };
  }
}

function track(progress: Progress, key: string) {
  const p = progress[key];
  return [p?.status ?? '', p?.value ?? '', p?.note ?? ''];
}

function finish(ws: ExcelJS.Worksheet) {
  ws.addRow([]);
  ws.addRow([PLAYBOOK_FOOTER]).font = { italic: true, color: { argb: MUTED }, size: 9 };
}

export async function buildPlaybookWorkbook(progress: Progress): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'MyRhythm';
  wb.created = new Date();

  /* ---------------- README ---------------- */
  {
    const ws = wb.addWorksheet('README', { properties: { tabColor: { argb: GOLD } } });
    ws.columns = [{ width: 26 }, { width: 110 }];
    ws.addRow([`MYRHYTHM PLAYBOOK ${PLAYBOOK_VERSION}`]).font = { bold: true, size: 14, color: { argb: GOLD } };
    ws.addRow(['MVP → 5 years. H0 (Launch Plan) is the live horizon.']).font = { color: { argb: INK } };
    ws.addRow([]);
    const rows: Array<[string, string]> = [
      ['How to use this', 'Work in this sheet. Fill the Status, Value and Note columns. Everything else is generated.'],
      ['Two-way sync', 'Download from /founder/playbook, edit here, upload the same file back. Rows are matched on Key.'],
      ['Key column', 'Never edit or delete a Key. A row with an unknown Key is ignored on upload.'],
      ['Status values', PLAYBOOK_STATUSES.join(' · ')],
      ['Tabs', 'Horizons · Gates · 20-Week Plan · MVP Checklist · IP & Legal · Objectives & KRs · Metrics · Risks'],
      ['Order of truth', 'This sheet is the working surface. The app is the record and the data-room view.'],
      ['Claim discipline', 'Confidence, identity, behaviour and quality of life only. No clinical outcome language anywhere.'],
      ['Review ritual', 'Monday 30 minutes: update Status, fill the week Value, write one Note per slipped row.'],
    ];
    rows.forEach(([k, v]) => {
      const r = ws.addRow([k, v]);
      r.getCell(1).font = { bold: true, color: { argb: MUTED } };
      r.getCell(2).alignment = { wrapText: true, vertical: 'top' };
    });
    finish(ws);
  }

  /* ---------------- Horizons ---------------- */
  {
    const ws = wb.addWorksheet('Horizons', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
      { header: 'Key', width: 8 }, { header: 'Horizon', width: 24 }, { header: 'Window', width: 18 },
      { header: 'The question', width: 38 }, { header: 'Outcome', width: 60 },
      { header: 'Exit gate', width: 34 }, { header: 'Gate date', width: 14 },
      { header: 'Status', width: 14 }, { header: 'Value', width: 16 }, { header: 'Note', width: 40 },
    ];
    styleHeader(ws.getRow(1));
    HORIZONS.forEach(h =>
      ws.addRow([h.key, h.name, h.window, h.question, h.outcome, h.exitGate, h.gateDate, ...track(progress, h.key)]),
    );
    addTrackingValidation(ws, 'H', 2, ws.rowCount);
    finish(ws);
  }

  /* ---------------- Gates ---------------- */
  {
    const ws = wb.addWorksheet('Gates', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
      { header: 'Key', width: 10 }, { header: 'Horizon', width: 10 }, { header: 'Gate', width: 24 },
      { header: 'Date', width: 14 }, { header: 'Pass condition', width: 90 },
      { header: 'Status', width: 14 }, { header: 'Value', width: 16 }, { header: 'Note', width: 40 },
    ];
    styleHeader(ws.getRow(1));
    GATES.forEach(g => {
      const r = ws.addRow([g.key, g.horizon, g.name, g.date, g.passCondition, ...track(progress, g.key)]);
      r.getCell(5).alignment = { wrapText: true, vertical: 'top' };
    });
    addTrackingValidation(ws, 'F', 2, ws.rowCount);
    finish(ws);
  }

  /* ---------------- 20-Week Plan ---------------- */
  {
    const ws = wb.addWorksheet('20-Week Plan', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
      { header: 'Key', width: 8 }, { header: 'Week', width: 7 }, { header: 'Dates', width: 18 },
      { header: 'Theme', width: 32 }, { header: 'Outcomes', width: 80 },
      { header: 'Target', width: 22 }, { header: 'Owner', width: 18 },
      { header: 'Status', width: 14 }, { header: 'Value', width: 16 }, { header: 'Note', width: 40 },
    ];
    styleHeader(ws.getRow(1));
    PLAN_WEEKS.forEach(w => {
      const r = ws.addRow([
        w.key, w.week, w.dates, w.theme, w.outcomes.map(o => `• ${o}`).join('\n'),
        w.target, w.owner, ...track(progress, w.key),
      ]);
      r.getCell(5).alignment = { wrapText: true, vertical: 'top' };
      r.height = 48;
    });
    addTrackingValidation(ws, 'H', 2, ws.rowCount);
    finish(ws);
  }

  /* ---------------- MVP Checklist ---------------- */
  {
    const ws = wb.addWorksheet('MVP Checklist', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
      { header: 'Key', width: 9 }, { header: 'Group', width: 20 }, { header: 'Item', width: 48 },
      { header: 'Done means', width: 70 }, { header: 'Owner', width: 18 }, { header: 'Due', width: 14 },
      { header: 'Status', width: 14 }, { header: 'Value', width: 16 }, { header: 'Note', width: 40 },
    ];
    styleHeader(ws.getRow(1));
    MVP_CHECKLIST.forEach(c => {
      const r = ws.addRow([c.key, c.group, c.item, c.doneLine, c.owner, c.due, ...track(progress, c.key)]);
      r.getCell(4).alignment = { wrapText: true, vertical: 'top' };
    });
    addTrackingValidation(ws, 'G', 2, ws.rowCount);
    finish(ws);
  }

  /* ---------------- IP & Legal ---------------- */
  {
    const ws = wb.addWorksheet('IP & Legal', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
      { header: 'Key', width: 9 }, { header: 'Area', width: 18 }, { header: 'Action', width: 52 },
      { header: 'Why it matters', width: 66 }, { header: 'Owner', width: 14 },
      { header: 'Indicative cost', width: 18 }, { header: 'Due', width: 14 },
      { header: 'Status', width: 14 }, { header: 'Value', width: 16 }, { header: 'Note', width: 40 },
    ];
    styleHeader(ws.getRow(1));
    LEGAL_ITEMS.forEach(l => {
      const r = ws.addRow([l.key, l.area, l.action, l.why, l.owner, l.cost, l.due, ...track(progress, l.key)]);
      r.getCell(4).alignment = { wrapText: true, vertical: 'top' };
    });
    addTrackingValidation(ws, 'H', 2, ws.rowCount);
    ws.addRow([]);
    ws.addRow(['Costs are indicative and not legal advice. Confirm current fees with the relevant registry or a solicitor.'])
      .font = { italic: true, color: { argb: MUTED }, size: 9 };
    finish(ws);
  }

  /* ---------------- Objectives & KRs ---------------- */
  {
    const ws = wb.addWorksheet('Objectives & KRs', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
      { header: 'Key', width: 12 }, { header: 'Horizon', width: 10 }, { header: 'Type', width: 12 },
      { header: 'Objective / Key result', width: 62 }, { header: 'Baseline', width: 14 },
      { header: 'Target', width: 14 }, { header: 'Due', width: 14 },
      { header: 'Status', width: 14 }, { header: 'Value', width: 16 }, { header: 'Note', width: 40 },
    ];
    styleHeader(ws.getRow(1));
    OBJECTIVES.forEach(o => {
      const or = ws.addRow([o.key, o.horizon, 'Objective', o.objective, '', '', '', ...track(progress, o.key)]);
      or.getCell(4).font = { bold: true, color: { argb: INK } };
      or.eachCell(c => (c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: IVORY } }));
      o.keyResults.forEach(kr =>
        ws.addRow([kr.key, o.horizon, 'Key result', kr.kr, kr.baseline, kr.target, kr.due, ...track(progress, kr.key)]),
      );
      ws.addRow(['', o.horizon, 'Bets', o.bets.join(' · ')]).getCell(4).font = { color: { argb: MUTED }, italic: true };
      ws.addRow(['', o.horizon, 'Not doing', o.nonBets.join(' · ')]).getCell(4).font = { color: { argb: MUTED }, italic: true };
    });
    addTrackingValidation(ws, 'H', 2, ws.rowCount);
    finish(ws);
  }

  /* ---------------- Metrics ---------------- */
  {
    const ws = wb.addWorksheet('Metrics', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
      { header: 'Key', width: 10 }, { header: 'Block', width: 14 }, { header: 'Metric', width: 34 },
      { header: 'Definition', width: 58 }, { header: 'Claim domain', width: 18 },
      { header: 'Standard / reference', width: 42 },
      { header: 'Status', width: 14 }, { header: 'Value', width: 16 }, { header: 'Note', width: 40 },
    ];
    styleHeader(ws.getRow(1));
    METRICS.forEach(m => {
      const r = ws.addRow([m.key, m.block, m.metric, m.definition, m.domain, m.standardRef, ...track(progress, m.key)]);
      r.getCell(4).alignment = { wrapText: true, vertical: 'top' };
    });
    addTrackingValidation(ws, 'G', 2, ws.rowCount);
    ws.addRow([]);
    const note = ws.addRow([METRICS_STANDARDS_NOTE]);
    note.getCell(1).alignment = { wrapText: true, vertical: 'top' };
    note.font = { italic: true, color: { argb: MUTED }, size: 9 };
    finish(ws);
  }

  /* ---------------- Risks ---------------- */
  {
    const ws = wb.addWorksheet('Risks', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = [
      { header: 'Key', width: 8 }, { header: 'Risk', width: 44 }, { header: 'Trigger', width: 50 },
      { header: 'Response', width: 62 },
      { header: 'Status', width: 14 }, { header: 'Value', width: 16 }, { header: 'Note', width: 40 },
    ];
    styleHeader(ws.getRow(1));
    RISKS.forEach(r => {
      const row = ws.addRow([r.key, r.risk, r.trigger, r.response, ...track(progress, r.key)]);
      row.getCell(4).alignment = { wrapText: true, vertical: 'top' };
    });
    addTrackingValidation(ws, 'E', 2, ws.rowCount);
    finish(ws);
  }

  return wb;
}

export async function downloadPlaybookXlsx(progress: Progress) {
  const wb = await buildPlaybookWorkbook(progress);
  const buf = await wb.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);
  saveAs(
    new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `MyRhythm_Playbook_${stamp}.xlsx`,
  );
}

/* ------------------------------------------------------------------ */
/* Import                                                             */
/* ------------------------------------------------------------------ */

export interface PlaybookImportResult {
  rows: PlaybookProgressRow[];
  matched: number;
  ignored: string[];
}

function cellText(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    const o = v as any;
    if (typeof o.text === 'string') return o.text.trim();
    if (Array.isArray(o.richText)) return o.richText.map((t: any) => t.text).join('').trim();
    if (o.result !== undefined) return String(o.result).trim();
    return '';
  }
  return String(v).trim();
}

const HORIZON_FOR: Record<string, string> = {};
HORIZONS.forEach(h => (HORIZON_FOR[h.key] = h.key));
GATES.forEach(g => (HORIZON_FOR[g.key] = g.horizon));
OBJECTIVES.forEach(o => {
  HORIZON_FOR[o.key] = o.horizon;
  o.keyResults.forEach(kr => (HORIZON_FOR[kr.key] = o.horizon));
});

export async function parsePlaybookXlsx(file: File): Promise<PlaybookImportResult> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());

  const byKey = new Map<string, PlaybookProgressRow>();
  const ignored: string[] = [];

  wb.eachSheet(ws => {
    // Find the header row (first row containing a "Key" cell).
    let headerRow = 0;
    let cols: Record<string, number> = {};
    for (let r = 1; r <= Math.min(ws.rowCount, 10); r++) {
      const map: Record<string, number> = {};
      ws.getRow(r).eachCell((cell, c) => {
        const h = cellText(cell.value).toLowerCase();
        if (h) map[h] = c;
      });
      if (map['key'] && (map['status'] || map['value'] || map['note'])) {
        headerRow = r;
        cols = map;
        break;
      }
    }
    if (!headerRow) return;

    for (let r = headerRow + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const key = cellText(row.getCell(cols['key']).value);
      if (!key) continue;
      if (!PLAYBOOK_KEY_SET.has(key)) {
        ignored.push(key);
        continue;
      }
      const status = cols['status'] ? cellText(row.getCell(cols['status']).value) : '';
      const value = cols['value'] ? cellText(row.getCell(cols['value']).value) : '';
      const note = cols['note'] ? cellText(row.getCell(cols['note']).value) : '';
      if (!status && !value && !note) continue;
      byKey.set(key, {
        horizon: HORIZON_FOR[key] ?? 'H0',
        item_key: key,
        status: (PLAYBOOK_STATUSES as string[]).includes(status) ? (status as PlaybookStatus) : null,
        value: value || null,
        note: note || null,
      });
    }
  });

  const rows = Array.from(byKey.values());
  return { rows, matched: rows.length, ignored: Array.from(new Set(ignored)) };
}
