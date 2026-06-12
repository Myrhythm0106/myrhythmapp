import jsPDF from 'jspdf';
import { EDITION_FOOTER } from '@/config/edition';
import type { ContinuitySummary } from './buildContinuitySummary';

const PRIMARY = '#0D9488';
const STONE_900 = '#1C1917';
const STONE_500 = '#78716C';
const ORANGE = '#EA7C3A';

export function buildContinuitySummaryPdf(data: ContinuitySummary): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  let y = 56;

  // Header band
  doc.setFillColor(ORANGE);
  doc.rect(0, 0, pageWidth, 6, 'F');

  doc.setTextColor(STONE_900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MyRhythm — Continuity Summary', marginX, y);
  y += 22;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(STONE_500);
  doc.text(
    'A life-readiness snapshot prepared by the user. Not a clinical or medical record.',
    marginX,
    y,
  );
  y += 14;
  doc.text(
    'MyRhythm does not diagnose, treat, or cure any condition.',
    marginX,
    y,
  );
  y += 24;

  // Identity block
  doc.setTextColor(STONE_900);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared by', marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.userName, marginX + 100, y);
  y += 16;

  doc.setFont('helvetica', 'bold');
  doc.text('Period', marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.periodLabel, marginX + 100, y);
  y += 16;

  doc.setFont('helvetica', 'bold');
  doc.text('Generated', marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(data.generatedAt).toLocaleString(), marginX + 100, y);
  y += 24;

  const section = (title: string) => {
    if (y > pageHeight - 80) {
      doc.addPage();
      y = 56;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(PRIMARY);
    doc.text(title, marginX, y);
    y += 14;
    doc.setTextColor(STONE_900);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
  };

  const para = (text: string) => {
    const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
    doc.text(lines, marginX, y);
    y += lines.length * 13 + 6;
  };

  if (data.vision) {
    section('Current vision');
    para(data.vision);
  }

  if (data.topPriorities.length) {
    section('Top priorities');
    data.topPriorities.forEach((p, i) => para(`${i + 1}. ${p}`));
  }

  if (data.personaMix.length) {
    section('Mode mix (last 14 days)');
    para(data.personaMix.map(m => `${m.label} ${m.pct}%`).join('  ·  '));
  }

  if (data.energyPattern.length) {
    section('Energy pattern');
    para(data.energyPattern.map(e => `${e.date}: ${e.band}`).join(',  '));
  }

  if (typeof data.commitCompletionRate === 'number') {
    section('Commitment follow-through');
    para(`${Math.round(data.commitCompletionRate * 100)}% of committed actions completed in this period.`);
  }

  if (data.topWins.length) {
    section('Recent wins');
    data.topWins.forEach(w => para(`• ${w}`));
  }

  if (data.carryForward.length) {
    section('Carrying forward');
    data.carryForward.forEach(c => para(`• ${c}`));
  }

  if (data.supportCircle.length) {
    section('Support circle');
    data.supportCircle.forEach(m =>
      para(`• ${m.name} — ${m.role}${data.includeContactDetails ? '' : ' (contact details withheld)'}`),
    );
  }

  // Footer (per Document Confidentiality Standard — 3pt)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(STONE_500);
    const footer = `CONFIDENTIAL — Prepared by user via MyRhythm. Not a clinical record. MyRhythm does not diagnose, treat, or cure any condition.  ·  ${EDITION_FOOTER}`;
    doc.text(footer, pageWidth / 2, pageHeight - 12, { align: 'center' });
  }

  return doc;
}

export function downloadContinuitySummaryPdf(
  data: ContinuitySummary,
  filename = 'myrhythm-continuity-summary.pdf',
) {
  buildContinuitySummaryPdf(data).save(filename);
}

export function downloadContinuitySummaryJson(
  data: ContinuitySummary,
  filename = 'myrhythm-continuity-summary.json',
) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
