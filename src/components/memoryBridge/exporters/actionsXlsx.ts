import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import type { NextStepsItem } from '@/types/memoryBridge';
import { involvementFromAction } from '@/components/memoryBridge/WhosInvolvedCell';
import type { MeetingSummaryModel } from '@/components/memoryBridge/ExecutiveSummaryPanel';

const EXHIBIT = {
  ink: '0B3B32',
  moss: '12695A',
  soft: '7FB8A6',
  surface: 'F7F4EC',
  paper: 'FFFFFF',
  rule: 'D2E0DC',
  accent: 'F97316',
};

function displayDate(iso?: string | null): string {
  if (!iso) return '-';
  const d = parseISO(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, 'dd MMM yyyy');
}

function dueIn(iso?: string | null): string {
  if (!iso) return '-';
  const d = parseISO(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const days = differenceInCalendarDays(d, new Date());
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}

function statusLabel(status?: string): string {
  const map: Record<string, string> = {
    not_started: 'Ready to Begin',
    doing: 'In My Flow',
    done: 'Accomplished!',
    on_hold: 'Paused Mindfully',
    cancelled: 'Redirected Energy',
    pending: 'Pending',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
    modified: 'Modified',
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
  };
  return map[status || ''] || status || 'Ready to Begin';
}

function priorityLabel(level?: number): string {
  if (level === undefined || level === null) return 'Medium';
  if (level <= 2) return 'High';
  if (level >= 4) return 'Low';
  return 'Medium';
}

function involvementLine(action: NextStepsItem): string {
  const inv = involvementFromAction(action);
  const parts: string[] = [];
  parts.push(`Does it: ${inv.responsible.name}${inv.responsible.email ? ` (${inv.responsible.email})` : ''}`);
  if (inv.accountable) parts.push(`Signs it off: ${inv.accountable.name}${inv.accountable.email ? ` (${inv.accountable.email})` : ''}`);
  if (inv.consulted.length) parts.push(`Ask first: ${inv.consulted.map(p => `${p.name}${p.email ? ` (${p.email})` : ''}`).join('; ')}`);
  if (inv.informed.length) parts.push(`Keep in loop: ${inv.informed.map(p => `${p.name}${p.email ? ` (${p.email})` : ''}`).join('; ')}`);
  return parts.join(' · ');
}

function raciTag(action: NextStepsItem): string {
  const inv = involvementFromAction(action);
  const parts: string[] = [];
  parts.push(`R: ${inv.responsible.name}`);
  if (inv.accountable) parts.push(`A: ${inv.accountable.name}`);
  if (inv.consulted.length) parts.push(`C: ${inv.consulted.map(p => p.name).join(', ')}`);
  if (inv.informed.length) parts.push(`I: ${inv.informed.map(p => p.name).join(', ')}`);
  return parts.join(' · ');
}

function reminderLabel(action: NextStepsItem): string {
  if (action.priority_level === undefined || action.priority_level === null) return 'Gentle';
  if (action.priority_level <= 2) return 'Strong';
  if (action.priority_level >= 4) return 'Gentle';
  return 'Steady';
}

function proposedDisplay(action: NextStepsItem): string {
  if (action.start_date) return '-';
  if (action.proposed_date) {
    return `${displayDate(action.proposed_date)}${action.proposed_time ? ` @ ${action.proposed_time}` : ''}`;
  }
  return '-';
}

export async function buildActionsWorkbook(
  model: MeetingSummaryModel,
  actions: NextStepsItem[]
): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MyRhythm';
  workbook.lastModifiedBy = 'MyRhythm';
  workbook.created = new Date();

  // ---- Executive Summary sheet ----
  const summarySheet = workbook.addWorksheet('Executive Summary');
  summarySheet.pageSetup.orientation = 'landscape';
  summarySheet.pageSetup.fitToPage = true;
  summarySheet.pageSetup.fitToWidth = 1;
  summarySheet.pageSetup.horizontalCentered = true;
  summarySheet.pageSetup.printArea = 'A1:F40';

  summarySheet.mergeCells('A1:F1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'MyRhythm — Next Step Summary';
  titleCell.font = { name: 'Sora', size: 18, bold: true, color: { argb: EXHIBIT.ink } };
  titleCell.alignment = { vertical: 'middle' };

  summarySheet.mergeCells('A2:F2');
  const subtitleCell = summarySheet.getCell('A2');
  subtitleCell.value = `${model.title} · ${model.date}`;
  subtitleCell.font = { name: 'Manrope', size: 11, color: { argb: EXHIBIT.moss } };

  summarySheet.mergeCells('A4:F4');
  summarySheet.getCell('A4').value = 'What this means';
  summarySheet.getCell('A4').font = { name: 'Sora', size: 10, bold: true, color: { argb: EXHIBIT.moss } };

  summarySheet.mergeCells('A5:F8');
  const summaryBody = summarySheet.getCell('A5');
  summaryBody.value = model.summary;
  summaryBody.font = { name: 'Manrope', size: 11, color: { argb: EXHIBIT.ink } };
  summaryBody.alignment = { wrapText: true, vertical: 'top' };

  summarySheet.mergeCells('A10:B10');
  summarySheet.getCell('A10').value = 'Participants';
  summarySheet.getCell('A10').font = { name: 'Sora', size: 10, bold: true, color: { argb: EXHIBIT.moss } };
  summarySheet.mergeCells('A11:B12');
  summarySheet.getCell('A11').value = model.participants.join('\n') || '—';
  summarySheet.getCell('A11').alignment = { wrapText: true, vertical: 'top' };
  summarySheet.getCell('A11').font = { name: 'Manrope', size: 11 };

  summarySheet.mergeCells('C10:D10');
  summarySheet.getCell('C10').value = 'Counts';
  summarySheet.getCell('C10').font = { name: 'Sora', size: 10, bold: true, color: { argb: EXHIBIT.moss } };
  summarySheet.mergeCells('C11:D12');
  summarySheet.getCell('C11').value = [
    `${model.counts.total} actions`,
    `${model.counts.withProposedDate} with proposed dates`,
    `${model.counts.scheduled} scheduled`,
    `${model.counts.complete} complete`,
  ].join('\n');
  summarySheet.getCell('C11').alignment = { wrapText: true, vertical: 'top' };
  summarySheet.getCell('C11').font = { name: 'Manrope', size: 11 };

  summarySheet.mergeCells('E10:F10');
  summarySheet.getCell('E10').value = 'Context';
  summarySheet.getCell('E10').font = { name: 'Sora', size: 10, bold: true, color: { argb: EXHIBIT.moss } };
  summarySheet.mergeCells('E11:F12');
  summarySheet.getCell('E11').value = model.context || '—';
  summarySheet.getCell('E11').alignment = { wrapText: true, vertical: 'top' };
  summarySheet.getCell('E11').font = { name: 'Manrope', size: 11 };

  let row = 14;
  if (model.themes.length) {
    summarySheet.mergeCells(`A${row}:F${row}`);
    summarySheet.getCell(`A${row}`).value = 'Key themes';
    summarySheet.getCell(`A${row}`).font = { name: 'Sora', size: 10, bold: true, color: { argb: EXHIBIT.moss } };
    row++;
    summarySheet.mergeCells(`A${row}:F${row + 1}`);
    summarySheet.getCell(`A${row}`).value = model.themes.join(' · ');
    summarySheet.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'top' };
    summarySheet.getCell(`A${row}`).font = { name: 'Manrope', size: 11 };
    row += 3;
  }

  if (model.decisions.length) {
    summarySheet.mergeCells(`A${row}:F${row}`);
    summarySheet.getCell(`A${row}`).value = 'Decisions captured';
    summarySheet.getCell(`A${row}`).font = { name: 'Sora', size: 10, bold: true, color: { argb: EXHIBIT.moss } };
    row++;
    summarySheet.mergeCells(`A${row}:F${row + 2}`);
    summarySheet.getCell(`A${row}`).value = model.decisions.map((d, i) => `${i + 1}. ${d}`).join('\n');
    summarySheet.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'top' };
    summarySheet.getCell(`A${row}`).font = { name: 'Manrope', size: 11 };
    row += 4;
  }

  if (model.openQuestions.length) {
    summarySheet.mergeCells(`A${row}:F${row}`);
    summarySheet.getCell(`A${row}`).value = 'Open questions';
    summarySheet.getCell(`A${row}`).font = { name: 'Sora', size: 10, bold: true, color: { argb: EXHIBIT.accent } };
    row++;
    summarySheet.mergeCells(`A${row}:F${row + 2}`);
    summarySheet.getCell(`A${row}`).value = model.openQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    summarySheet.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'top' };
    summarySheet.getCell(`A${row}`).font = { name: 'Manrope', size: 11 };
  }

  summarySheet.columns = [
    { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 },
  ];

  // ---- Actions sheet ----
  const sheet = workbook.addWorksheet('Actions');
  sheet.pageSetup.orientation = 'landscape';
  sheet.pageSetup.fitToPage = true;
  sheet.pageSetup.fitToWidth = 1;
  sheet.pageSetup.horizontalCentered = true;
  sheet.pageSetup.printTitlesRow = '1:2';

  const headers = [
    'Priority',
    'Action',
    "I'll know I'm done when",
    'Owner',
    'Owner email',
    "Who's involved",
    'Start date',
    'Finish date',
    'Proposed date',
    'Due in',
    'Status',
    'Reminder level',
    'Reference code',
    'Source conversation',
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.eachCell(cell => {
    cell.font = { name: 'Sora', size: 10, bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXHIBIT.ink } };
    cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
  });
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length },
  };

  const dataRows = actions.map(action => [
    priorityLabel(action.priority_level),
    action.action_text,
    action.success_criteria || '-',
    action.assigned_to || action.owner || 'Me',
    action.owner_email || '-',
    involvementLine(action),
    displayDate(action.start_date),
    displayDate(action.completion_date || action.end_date),
    proposedDisplay(action),
    dueIn(action.completion_date || action.end_date),
    statusLabel(action.status),
    reminderLabel(action),
    action.reference_code || '-',
    action.source_quote || action.transcript_excerpt || '-',
  ]);

  dataRows.forEach((r, i) => {
    const row = sheet.addRow(r);
    row.eachCell(cell => {
      cell.font = { name: 'Manrope', size: 10, color: { argb: EXHIBIT.ink } };
      cell.alignment = { vertical: 'top', wrapText: true };
    });
    if (i % 2 === 1) {
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F7F4EC' } };
      });
    }
  });

  sheet.columns = [
    { width: 10 },
    { width: 42 },
    { width: 36 },
    { width: 18 },
    { width: 24 },
    { width: 48 },
    { width: 12 },
    { width: 12 },
    { width: 16 },
    { width: 11 },
    { width: 16 },
    { width: 14 },
    { width: 16 },
    { width: 42 },
  ];

  // Footer on each printed page
  sheet.headerFooter.oddFooter = '&LConfidential — MyRhythm Next Step Summary&CPage &P of &N&RGenerated by MyRhythm';
  sheet.headerFooter.evenFooter = sheet.headerFooter.oddFooter;

  return workbook;
}

export async function exportActionsXlsx(
  model: MeetingSummaryModel,
  actions: NextStepsItem[],
  filename?: string
) {
  const workbook = await buildActionsWorkbook(model, actions);
  const blob = await workbook.xlsx.writeBuffer();
  const safeName = (filename || `${model.title.replace(/[^a-z0-9]+/gi, '_').slice(0, 40)}_MyRhythm_Next_Steps`).replace(/^_+|_+$/g, '');
  saveAs(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${safeName}.xlsx`);
}

export function exportActionsCsv(model: MeetingSummaryModel, actions: NextStepsItem[], filename?: string) {
  const rows = [
    ['MyRhythm — Next Step Summary'],
    [`${model.title} · ${model.date}`],
    ['What this means', model.summary],
    [],
    [
      'Priority',
      'Action',
      "I'll know I'm done when",
      'Owner',
      'Owner email',
      "Who's involved",
      'Start date',
      'Finish date',
      'Proposed date',
      'Due in',
      'Status',
      'Reminder level',
      'Reference code',
      'Source conversation',
    ],
    ...actions.map(action => [
      priorityLabel(action.priority_level),
      action.action_text,
      action.success_criteria || '',
      action.assigned_to || action.owner || 'Me',
      action.owner_email || '',
      involvementLine(action),
      displayDate(action.start_date),
      displayDate(action.completion_date || action.end_date),
      proposedDisplay(action),
      dueIn(action.completion_date || action.end_date),
      statusLabel(action.status),
      reminderLabel(action),
      action.reference_code || '',
      action.source_quote || action.transcript_excerpt || '',
    ]),
  ];

  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const safeName = (filename || `${model.title.replace(/[^a-z0-9]+/gi, '_').slice(0, 40)}_MyRhythm_Next_Steps`).replace(/^_+|_+$/g, '');
  saveAs(blob, `${safeName}.csv`);
}
