import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import type { NextStepsItem } from '@/types/memoryBridge';
import { involvementFromAction } from '@/components/memoryBridge/WhosInvolvedCell';
import type { MeetingSummaryModel } from '@/components/memoryBridge/ExecutiveSummaryPanel';

// Emerald Prestige / exhibit palette (RGB)
const INK: [number, number, number] = [11, 59, 50];
const MOSS: [number, number, number] = [18, 105, 90];
const SOFT: [number, number, number] = [127, 184, 166];
const SURFACE: [number, number, number] = [247, 244, 236];
const RULE: [number, number, number] = [210, 224, 220];
const AMBER: [number, number, number] = [217, 119, 6];

const FOOTER_TEXT =
  'MyRhythm · Confidential — Not medical advice. Prepared for internal review.';

const MARGIN = 36;

function displayDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, 'dd MMM yyyy');
}

function dueIn(iso?: string | null): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  if (Number.isNaN(d.getTime())) return '—';
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
    done: 'Accomplished',
    on_hold: 'Paused',
    cancelled: 'Redirected',
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

function reminderLabel(action: NextStepsItem): string {
  if (action.priority_level === undefined || action.priority_level === null) return 'Gentle';
  if (action.priority_level <= 2) return 'Strong';
  if (action.priority_level >= 4) return 'Gentle';
  return 'Steady';
}

function involvementLine(action: NextStepsItem): string {
  const inv = involvementFromAction(action);
  const parts: string[] = [];
  parts.push(`Does it: ${inv.responsible.name}`);
  if (inv.accountable) parts.push(`Signs it off: ${inv.accountable.name}`);
  if (inv.consulted.length) parts.push(`Ask first: ${inv.consulted.map(p => p.name).join(', ')}`);
  if (inv.informed.length) parts.push(`Keep in loop: ${inv.informed.map(p => p.name).join(', ')}`);
  return parts.join('\n');
}

function involvementDetail(action: NextStepsItem): string {
  const inv = involvementFromAction(action);
  const fmt = (p: { name: string; email?: string | null }) =>
    `${p.name}${p.email ? ` (${p.email})` : ''}`;
  const parts: string[] = [`Does it: ${fmt(inv.responsible)}`];
  if (inv.accountable) parts.push(`Signs it off: ${fmt(inv.accountable)}`);
  if (inv.consulted.length) parts.push(`Ask first: ${inv.consulted.map(fmt).join('; ')}`);
  if (inv.informed.length) parts.push(`Keep in the loop: ${inv.informed.map(fmt).join('; ')}`);
  return parts.join(' · ');
}

function scheduleCell(action: NextStepsItem): string {
  const finish = action.completion_date || action.end_date;
  if (!action.start_date && action.proposed_date) {
    const when = `${displayDate(action.proposed_date)}${action.proposed_time ? ` @ ${action.proposed_time}` : ''}`;
    return `Proposed: ${when}`;
  }
  const lines: string[] = [];
  lines.push(`Start: ${displayDate(action.start_date)}`);
  lines.push(`Due: ${displayDate(finish)}`);
  const rel = dueIn(finish);
  if (rel !== '—') lines.push(rel);
  return lines.join('\n');
}

function isProposedOnly(action: NextStepsItem): boolean {
  return !action.start_date && !!action.proposed_date;
}

function isOverdue(action: NextStepsItem): boolean {
  const finish = action.completion_date || action.end_date;
  if (!finish) return false;
  const d = parseISO(finish);
  if (Number.isNaN(d.getTime())) return false;
  const done = ['done', 'completed', 'cancelled'].includes(action.status || '');
  return !done && differenceInCalendarDays(d, new Date()) < 0;
}

function footer(doc: jsPDF, pageNumber: number) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, h - 30, w - MARGIN, h - 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 130, 128);
  doc.text(FOOTER_TEXT, MARGIN, h - 18);
  doc.text(`Page ${pageNumber}`, w - MARGIN, h - 18, { align: 'right' });
}

function runningHeader(doc: jsPDF, model: MeetingSummaryModel) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...MOSS);
  doc.text('MYRHYTHM · NEXT STEP SUMMARY', MARGIN, 26);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 148, 146);
  doc.text(`${model.title} · ${model.date}`, w - MARGIN, 26, { align: 'right' });
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, 32, w - MARGIN, 32);
}

function sectionTitle(doc: jsPDF, text: string, y: number, accent = MOSS): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text(text, MARGIN, y);
  doc.setDrawColor(...accent);
  doc.setLineWidth(1.4);
  doc.line(MARGIN, y + 4, MARGIN + 34, y + 4);
  return y + 20;
}

function paragraph(
  doc: jsPDF,
  text: string,
  y: number,
  maxWidth: number,
  opts?: { size?: number; muted?: boolean; lineHeight?: number }
): number {
  const size = opts?.size ?? 10;
  const lh = opts?.lineHeight ?? size * 1.4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...(opts?.muted ? ([110, 122, 120] as [number, number, number]) : INK));
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach(line => {
    doc.text(line, MARGIN, y);
    y += lh;
  });
  return y;
}

function bulletList(doc: jsPDF, items: string[], y: number, maxWidth: number, numbered = false): number {
  doc.setFontSize(10);
  items.forEach((item, i) => {
    const marker = numbered ? `${i + 1}.` : '•';
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...MOSS);
    doc.text(marker, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(item, maxWidth - 16) as string[];
    lines.forEach((line, idx) => {
      doc.text(line, MARGIN + 16, y + idx * 13);
    });
    y += lines.length * 13 + 5;
  });
  return y;
}

function statBox(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  value: string,
  label: string,
  accent: [number, number, number]
) {
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.6);
  doc.roundedRect(x, y, w, 44, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...accent);
  doc.text(value, x + 10, y + 21);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 122, 120);
  const lines = doc.splitTextToSize(label.toUpperCase(), w - 18) as string[];
  doc.text(lines.slice(0, 2), x + 10, y + 33);
}

export function buildActionsPdf(model: MeetingSummaryModel, actions: NextStepsItem[]): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const contentW = pageW - MARGIN * 2;

  // ---------- Page 1: cover + executive summary ----------
  runningHeader(doc, model);

  let y = 66;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...INK);
  doc.text('Next Step Summary', MARGIN, y);
  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...MOSS);
  doc.text(`${model.title} · ${model.date}`, MARGIN, y);
  y += 16;

  const refCode = actions.find(a => a.reference_code)?.reference_code;
  doc.setFontSize(8.5);
  doc.setTextColor(120, 130, 128);
  const metaBits = [
    model.participants.length ? `Participants: ${model.participants.join(', ')}` : null,
    refCode ? `Reference: ${refCode}` : null,
    `Generated: ${format(new Date(), 'dd MMM yyyy')}`,
  ].filter(Boolean) as string[];
  y = paragraph(doc, metaBits.join('  ·  '), y, contentW, { size: 8.5, muted: true, lineHeight: 12 });
  y += 4;

  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, pageW - MARGIN, y);
  y += 22;

  // Counts strip
  const proposedCount = actions.filter(isProposedOnly).length;
  const overdueCount = actions.filter(isOverdue).length;
  const boxW = (contentW - 12 * 4) / 5;
  const stats: Array<[string, string, [number, number, number]]> = [
    [String(model.counts.total), 'Total actions', INK],
    [String(model.counts.scheduled), 'In the diary', MOSS],
    [String(proposedCount), 'Dates proposed', AMBER],
    [String(overdueCount), 'Overdue', overdueCount > 0 ? AMBER : SOFT],
    [String(model.counts.complete), 'Complete', MOSS],
  ];
  stats.forEach((s, i) => statBox(doc, MARGIN + i * (boxW + 12), y, boxW, s[0], s[1], s[2]));
  y += 62;

  // Summary
  y = sectionTitle(doc, 'Executive summary', y);
  y = paragraph(doc, model.summary || 'No summary available for this conversation.', y, contentW, { size: 10.5 });
  y += 12;

  if (model.context) {
    y = sectionTitle(doc, 'Context', y);
    y = paragraph(doc, model.context, y, contentW);
    y += 12;
  }

  // Two-column block: themes / decisions
  const colW = (contentW - 24) / 2;
  if (model.themes.length || model.decisions.length) {
    const startY = y;
    let leftY = startY;
    let rightY = startY;
    if (model.themes.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...MOSS);
      doc.text('KEY THEMES', MARGIN, leftY);
      leftY += 14;
      model.themes.forEach(t => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...INK);
        const lines = doc.splitTextToSize(`• ${t}`, colW) as string[];
        lines.forEach(l => {
          doc.text(l, MARGIN, leftY);
          leftY += 12.5;
        });
      });
    }
    if (model.decisions.length) {
      const x = MARGIN + colW + 24;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...MOSS);
      doc.text('DECISIONS CAPTURED', x, rightY);
      rightY += 14;
      model.decisions.forEach((d, i) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...INK);
        const lines = doc.splitTextToSize(`${i + 1}. ${d}`, colW) as string[];
        lines.forEach(l => {
          doc.text(l, x, rightY);
          rightY += 12.5;
        });
      });
    }
    y = Math.max(leftY, rightY) + 10;
  }

  if (model.openQuestions.length) {
    y = sectionTitle(doc, 'Open questions', y, AMBER);
    y = bulletList(doc, model.openQuestions, y, contentW, true);
  }

  footer(doc, 1);

  // ---------- Actions exhibit ----------
  doc.addPage('a4', 'landscape');
  runningHeader(doc, model);

  let tableStartY = 52;
  tableStartY = sectionTitle(doc, 'Actions', tableStartY);

  const body = actions.map(action => [
    action.reference_code || '—',
    `${action.action_text}${action.success_criteria ? `\nDone when: ${action.success_criteria}` : ''}`,
    `${action.assigned_to || action.owner || 'Me'}${action.owner_email ? `\n${action.owner_email}` : ''}`,
    involvementLine(action),
    scheduleCell(action),
    `${statusLabel(action.status)}\n${priorityLabel(action.priority_level)} priority`,
    reminderLabel(action),
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [['Ref', 'Action', 'Owner', "Who's involved", 'Schedule', 'Status', 'Reminder']],
    body: body.length ? body : [['—', 'No actions captured for this conversation.', '—', '—', '—', '—', '—']],
    margin: { left: MARGIN, right: MARGIN, top: 52, bottom: 44 },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 6,
      lineColor: RULE,
      lineWidth: 0.5,
      textColor: INK,
      valign: 'top',
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: INK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 7,
    },
    alternateRowStyles: { fillColor: SURFACE },
    columnStyles: {
      0: { cellWidth: 62 },
      1: { cellWidth: 216 },
      2: { cellWidth: 104 },
      3: { cellWidth: 128 },
      4: { cellWidth: 90 },
      5: { cellWidth: 74 },
      6: { cellWidth: 50 },
    },
    didParseCell: data => {
      if (data.section !== 'body') return;
      const action = actions[data.row.index];
      if (!action) return;
      if (data.column.index === 4 && isProposedOnly(action)) {
        data.cell.styles.textColor = AMBER;
        data.cell.styles.fontStyle = 'bold';
      }
      if (data.column.index === 4 && isOverdue(action)) {
        data.cell.styles.textColor = AMBER;
      }
    },
    didDrawPage: () => {
      runningHeader(doc, model);
      footer(doc, doc.getNumberOfPages());
    },
  });

  // ---------- Appendix ----------
  const detailed = actions.filter(
    a => (a.action_text?.length || 0) > 140 || a.source_quote || a.transcript_excerpt
  );
  if (detailed.length) {
    doc.addPage('a4', 'landscape');
    runningHeader(doc, model);
    let ay = 52;
    ay = sectionTitle(doc, 'Appendix — full detail and source', ay);

    const pageH = doc.internal.pageSize.getHeight();
    detailed.forEach(action => {
      const blockLines: string[] = [];
      blockLines.push(`${action.reference_code || '—'} · ${action.action_text}`);
      if (action.success_criteria) blockLines.push(`I'll know I'm done when: ${action.success_criteria}`);
      blockLines.push(involvementDetail(action));
      const source = action.source_quote || action.transcript_excerpt;
      if (source) blockLines.push(`From the conversation: “${source}”`);

      const textWidth = contentW - 38;
      const wrapped = blockLines.flatMap(l => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        return doc.splitTextToSize(l, textWidth) as string[];
      });
      const needed = wrapped.length * 12 + 18;
      if (ay + needed > pageH - 60) {
        footer(doc, doc.getNumberOfPages());
        doc.addPage('a4', 'landscape');
        runningHeader(doc, model);
        ay = 52;
      }

      doc.setDrawColor(...SOFT);
      doc.setLineWidth(1.5);
      doc.line(MARGIN, ay - 8, MARGIN, ay - 8 + needed - 10);

      wrapped.forEach((line, i) => {
        doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
        doc.setFontSize(i === 0 ? 9.5 : 9);
        doc.setTextColor(...(i === 0 ? INK : ([90, 104, 101] as [number, number, number])));
        doc.text(line, MARGIN + 12, ay);
        ay += 12;
      });
      ay += 12;
    });
    footer(doc, doc.getNumberOfPages());
  }

  return doc;
}

function safeName(model: MeetingSummaryModel, filename?: string): string {
  return (
    filename || `${model.title.replace(/[^a-z0-9]+/gi, '_').slice(0, 40)}_MyRhythm_Next_Steps`
  ).replace(/^_+|_+$/g, '');
}

export function exportActionsPdf(
  model: MeetingSummaryModel,
  actions: NextStepsItem[],
  filename?: string
) {
  const doc = buildActionsPdf(model, actions);
  saveAs(doc.output('blob'), `${safeName(model, filename)}.pdf`);
}
