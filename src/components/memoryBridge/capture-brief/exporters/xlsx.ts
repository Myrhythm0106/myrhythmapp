import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CaptureBriefModel, ExportOptions } from '../model/types';

const ORANGE = 'FFEA580C';
const INK = 'FF111827';
const MUTED = 'FF6B7280';
const FOOTER =
  'MyRhythm · Confidential — Not medical advice. v0.1 Founding Edition.';

function styleHeader(row: ExcelJS.Row) {
  row.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Calibri', size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ORANGE } };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    cell.border = { bottom: { style: 'thin', color: { argb: ORANGE } } };
  });
}

export async function exportCaptureBriefXlsx(model: CaptureBriefModel, opts: ExportOptions) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'MyRhythm';
  wb.created = new Date();

  // ----- Summary -----
  if (opts.sections.summary) {
    const ws = wb.addWorksheet('Summary', { properties: { tabColor: { argb: ORANGE } } });
    ws.columns = [{ width: 24 }, { width: 80 }];
    ws.addRow(['MYRHYTHM · CAPTURE BRIEF']).font = { bold: true, color: { argb: ORANGE }, size: 12 };
    ws.addRow([]);
    const titleRow = ws.addRow(['Title', model.title]);
    titleRow.getCell(2).font = { bold: true, size: 16, color: { argb: INK } };
    ws.addRow(['Date', model.date]);
    ws.addRow(['Participants', model.participants.join(', ')]);
    if (model.context) ws.addRow(['Context', model.context]);
    ws.addRow(['Actions', model.actions.length]);
    ws.addRow(['Decisions', model.decisions.length]);
    ws.addRow(['Open questions', model.openQuestions.length]);
    ws.addRow([]);
    ws.addRow(['Executive summary']).font = { bold: true, color: { argb: ORANGE } };
    const sumRow = ws.addRow(['', model.summary]);
    sumRow.getCell(2).alignment = { wrapText: true, vertical: 'top' };
    sumRow.height = 80;
    if (model.themes.length) {
      ws.addRow([]);
      ws.addRow(['Themes', model.themes.join(' · ')]);
    }
    ws.getColumn(1).font = { bold: true, color: { argb: MUTED } };
    ws.addRow([]);
    ws.addRow([FOOTER]).font = { italic: true, color: { argb: MUTED }, size: 9 };
  }

  // ----- Actions -----
  if (opts.sections.actions) {
    const ws = wb.addWorksheet('Actions', { views: [{ state: 'frozen', ySplit: 1 }] });
    const schedColumns = opts.includeSchedule
      ? [
          { header: 'Start', key: 'start', width: 22 },
          { header: 'Reminders', key: 'reminders', width: 22 },
          { header: 'Due', key: 'dueScheduled', width: 18 },
          { header: 'People', key: 'people', width: 30 },
        ]
      : [];
    ws.columns = [
      { header: '#', key: 'i', width: 6 },
      { header: 'Action', key: 'text', width: 50 },
      { header: 'Owner', key: 'owner', width: 18 },
      { header: 'Due (mentioned)', key: 'due', width: 18 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Confidence', key: 'conf', width: 14 },
      ...schedColumns,
      { header: 'Category', key: 'category', width: 16 },
      { header: 'Source quote', key: 'quote', width: 50 },
    ];
    model.actions.forEach((a, i) => {
      const top = a.scheduled
        ? { date: a.scheduled.startDate, time: a.scheduled.startTime }
        : a.suggestions?.find(s => s.isRecommended) || a.suggestions?.[0];
      ws.addRow({
        i: i + 1,
        text: a.text,
        owner: a.owner,
        due: a.due || '',
        priority: a.priorityLabel,
        conf: a.confidence,
        start: opts.includeSchedule ? (top ? `${top.date} ${top.time}` : '') : undefined,
        reminders: opts.includeSchedule
          ? (a.scheduled?.reminders || []).map(r => `${r.minutesBefore}m`).join(', ')
          : undefined,
        dueScheduled: opts.includeSchedule
          ? (a.dueDate?.label || a.dueDate?.date || '')
          : undefined,
        people: opts.includeSchedule
          ? (a.people || []).filter(p => p.role !== 'none').map(p => `${p.name} (${p.role})`).join(', ')
          : undefined,
        category: a.category || '',
        quote: a.sourceQuote || '',
      });
    });
    styleHeader(ws.getRow(1));
    ws.getColumn('conf').numFmt = '0%';
    ws.eachRow((row, n) => {
      if (n === 1) return;
      row.alignment = { vertical: 'top', wrapText: true };
      if (n % 2 === 0)
        row.eachCell(c => (c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAFAFA' } }));
    });
  }

  // ----- Decisions -----
  if (opts.sections.decisions) {
    const ws = wb.addWorksheet('Decisions');
    ws.columns = [{ header: '#', width: 6 }, { header: 'Decision', width: 100 }];
    model.decisions.forEach((d, i) => ws.addRow([i + 1, d]));
    styleHeader(ws.getRow(1));
    if (model.themes.length) {
      ws.addRow([]);
      ws.addRow(['Themes', model.themes.join(' · ')]).font = { italic: true, color: { argb: MUTED } };
    }
  }

  // ----- Questions -----
  if (opts.sections.questions) {
    const ws = wb.addWorksheet('Open Questions');
    ws.columns = [{ header: '#', width: 6 }, { header: 'Question', width: 100 }];
    model.openQuestions.forEach((q, i) => ws.addRow([i + 1, q]));
    styleHeader(ws.getRow(1));
  }

  // ----- Transcript -----
  if (opts.sections.transcript) {
    const ws = wb.addWorksheet('Transcript');
    ws.columns = [
      { header: 'Speaker', key: 'speaker', width: 22 },
      { header: 'Text', key: 'text', width: 110 },
    ];
    model.transcript.forEach(t => ws.addRow({ speaker: t.speaker, text: t.text }));
    styleHeader(ws.getRow(1));
    ws.eachRow((row, n) => {
      if (n === 1) return;
      row.alignment = { vertical: 'top', wrapText: true };
      row.getCell(1).font = { bold: true, color: { argb: ORANGE } };
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), opts.filename + '.xlsx');
}
