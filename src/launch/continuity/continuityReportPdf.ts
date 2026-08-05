import jsPDF from 'jspdf';
import { EDITION_FOOTER } from '@/config/edition';
import type { ContinuityReport, WindowDays } from './buildContinuityReport';

const INK = '#064e3b';
const MOSS = '#0d7a5f';
const GOLD = '#c9a84c';
const CREAM = '#f5f0e0';
const STONE_500 = '#78716C';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function windowLabel(days: WindowDays): string {
  return days === 30 ? '30-Day' : days === 60 ? '60-Day' : '90-Day';
}

export function buildContinuityReportPdf(data: ContinuityReport): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  let y = 56;

  const isClinical = data.mode === 'clinical';

  // Top accent bar
  doc.setFillColor(GOLD);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Meta strip
  doc.setFillColor(CREAM);
  doc.rect(0, 6, pageWidth, 44, 'F');
  doc.setTextColor(INK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(
    `${windowLabel(data.windowDays)} Continuity Report · ${formatDate(data.startDate)} → ${formatDate(data.endDate)}`,
    marginX,
    32,
  );
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(STONE_500);
  doc.text(
    `Generated ${formatDate(data.generatedAt)} · Prepared by ${data.userName}`,
    pageWidth - marginX,
    32,
    { align: 'right' },
  );

  y = 72;

  // Title
  doc.setTextColor(INK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(
    isClinical ? `${windowLabel(data.windowDays)} Continuity Report` : `My first ${data.windowDays} days`,
    marginX,
    y,
  );
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(STONE_500);
  doc.text(
    'A life-readiness snapshot prepared by the user. Not a clinical or medical record.',
    marginX,
    y,
  );
  y += 14;
  doc.text('MyRhythm does not diagnose, treat, or cure any condition.', marginX, y);
  y += 26;

  // Hero band
  doc.setFillColor(INK);
  doc.rect(marginX, y, pageWidth - marginX * 2, 110, 'F');
  doc.setTextColor(CREAM);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('FOLLOW-THROUGH RATE', marginX + 18, y + 24);

  doc.setFontSize(64);
  doc.setFont('helvetica', 'bold');
  doc.text(`${Math.round(data.followThroughRate * 100)}`, marginX + 18, y + 84);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(`${CREAM}99`);
  doc.text('/100', marginX + 86, y + 84);

  doc.setFontSize(10);
  doc.setTextColor(CREAM);
  doc.text(
    `${data.completedCount} of ${data.committedTotal} commitments carried through`,
    marginX + 18,
    y + 102,
  );

  // Hero right: breakdown
  const rightX = pageWidth / 2 + 24;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BREAKDOWN', rightX, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Completed: ${data.completedCount}`, rightX, y + 42);
  doc.text(`Partially met: ${data.partialCount}`, rightX, y + 58);
  doc.text(`Not met: ${data.notMetCount}`, rightX, y + 74);
  doc.text(`Support circle size: ${data.supportCircleSize}`, rightX, y + 90);

  y += 130;

  const section = (title: string) => {
    if (y > pageHeight - 90) {
      doc.addPage();
      y = 56;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(MOSS);
    doc.text(title, marginX, y);
    y += 14;
    doc.setTextColor(INK);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
  };

  const para = (text: string) => {
    if (y > pageHeight - 70) {
      doc.addPage();
      y = 56;
    }
    const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
    doc.text(lines, marginX, y);
    y += lines.length * 13 + 6;
  };

  // Goals
  if (data.goals.length) {
    section('Goals');
    if (isClinical) {
      para(`Met: ${data.goalsMet} · Partially met: ${data.goalsPartial} · Not met: ${data.goalsNotMet}`);
      data.goals.forEach(g => {
        const label = g.status === 'completed' ? 'Met' : g.status === 'partial' ? 'Partially met' : 'Not met';
        para(`• ${g.title} — ${label} (${g.progress}%)`);
      });
    } else {
      para(`${data.goalsMet} met · ${data.goalsPartial} partially met · ${data.goalsNotMet} still building`);
      data.goals
        .filter(g => g.status === 'completed' || g.status === 'partial')
        .forEach(g => para(`• ${g.title}`));
    }
  }

  // Support Circle
  if (data.supportCircleSize > 0) {
    section('Support Circle involvement');
    para(`${data.supportCircleSize} people in the loop · ${data.actionsWithSupport} actions had someone alongside them.`);
    data.supportCircleMetrics.forEach(m => {
      para(`• ${m.member.name} — involved in ${m.actionsInvolved} action(s), ${m.notesLeft} note(s)`);
    });
  }

  // Agreed items
  if (data.agreedItems.length) {
    section('Follow-through on agreed items');
    para(`${data.agreedItemsCompleted} completed · ${data.agreedItemsPartial} partial · ${data.agreedItemsNotMet} not yet met.`);
    data.agreedItems.forEach(i => {
      const label = i.status === 'completed' ? 'Carried through' : i.status === 'partial' ? 'Partially met' : 'Not yet met';
      para(`• ${i.title} — ${label}`);
    });
  }

  // Rhythm
  section('Rhythm');
  para(`${data.daysActive} active days · ${data.captureCount} captures · ${data.calibrateCount} calibrate check-ins.`);
  if (data.energyPattern.length) {
    para(`Recent energy pattern: ${data.energyPattern.map(e => `${e.date}: ${e.band}`).join(', ')}`);
  }

  // Wins / carry-forward
  if (data.topWins.length) {
    section('Wins carrying forward');
    data.topWins.forEach(w => para(`• ${w}`));
  }
  if (data.carryForward.length) {
    section('Still carrying forward');
    data.carryForward.forEach(c => para(`• ${c}`));
  }
  if (data.memberNote) {
    section('What I would like help with');
    para(data.memberNote);
  }

  // Boundary footer
  y += 10;
  doc.setDrawColor(GOLD);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 14;
  doc.setFontSize(9);
  doc.setTextColor(STONE_500);
  doc.setFont('helvetica', 'italic');
  para(
    'This report reflects confidence, identity, behaviour, and quality of life only. It does not measure cognitive function, clinical improvement, or medical outcomes.',
  );

  // 3pt confidentiality footer on every page
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

export function downloadContinuityReportPdf(data: ContinuityReport, filename?: string) {
  const label = data.mode === 'clinical' ? 'clinical' : 'personal';
  buildContinuityReportPdf(data).save(filename ?? `myrhythm-continuity-${label}-${data.windowDays}.pdf`);
}
