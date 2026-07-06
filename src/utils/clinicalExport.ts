import jsPDF from 'jspdf';
import { EDITION_FOOTER } from '@/config/edition';

export interface ClinicalExportItem {
  date: string;
  title: string;
  detail?: string;
  category?: 'capture' | 'action' | 'medication' | 'note';
}

export interface ClinicalExportData {
  patientName: string;
  dateOfBirth?: string;
  dateRangeLabel: string;
  summary?: string;
  items: ClinicalExportItem[];
}

const PRIMARY = '#0D9488';
const STONE_900 = '#1C1917';
const STONE_500 = '#78716C';

export function buildClinicalExportPdf(data: ClinicalExportData): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  let y = 56;

  // Header band
  doc.setFillColor(PRIMARY);
  doc.rect(0, 0, pageWidth, 6, 'F');

  doc.setTextColor(STONE_900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MyRhythm — Clinical Summary', marginX, y);
  y += 22;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(STONE_500);
  doc.text(`Prepared by the patient. Not a clinical record.`, marginX, y);
  y += 24;

  // Patient block
  doc.setTextColor(STONE_900);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient', marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.patientName, marginX + 80, y);
  y += 16;

  if (data.dateOfBirth) {
    doc.setFont('helvetica', 'bold');
    doc.text('Date of birth', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.dateOfBirth, marginX + 80, y);
    y += 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('Period', marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.dateRangeLabel, marginX + 80, y);
  y += 24;

  // Summary
  if (data.summary) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Summary', marginX, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth - marginX * 2);
    doc.text(summaryLines, marginX, y);
    y += summaryLines.length * 13 + 16;
  }

  // Items
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(STONE_900);
  doc.text('Captured items', marginX, y);
  y += 16;
  doc.setFontSize(10);

  for (const item of data.items) {
    if (y > pageHeight - 80) {
      doc.addPage();
      y = 56;
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(STONE_900);
    const head = `${item.date}  •  ${item.title}`;
    const headLines = doc.splitTextToSize(head, pageWidth - marginX * 2);
    doc.text(headLines, marginX, y);
    y += headLines.length * 13;
    if (item.detail) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(STONE_500);
      const detailLines = doc.splitTextToSize(item.detail, pageWidth - marginX * 2 - 12);
      doc.text(detailLines, marginX + 12, y);
      y += detailLines.length * 12 + 4;
    }
    y += 6;
  }

  // Footer on every page (per Document Confidentiality Standard)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(3); // 3pt per standard
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(STONE_500);
    const footer =
      `CONFIDENTIAL — Prepared by patient via MyRhythm. Not a clinical record. MyRhythm does not diagnose, treat, or cure any condition.  ·  ${EDITION_FOOTER}`;
    doc.text(footer, pageWidth / 2, pageHeight - 12, { align: 'center' });
  }

  return doc;
}

export function downloadClinicalExportPdf(data: ClinicalExportData, filename = 'myrhythm-clinical-summary.pdf') {
  const doc = buildClinicalExportPdf(data);
  doc.save(filename);
}

// ---------------------------------------------------------------------------
// Discharge Handover variant — companion to the Discharge Bridge Kit.
// See docs/discharge-bridge-kit.md §3c.
// ---------------------------------------------------------------------------

export interface DischargeHandoverData {
  patientName: string;
  dischargeDateLabel: string;
  supportCircle: string[];
  weekPlanItems: string[];
  clinicianName?: string;
}

export function buildDischargeHandoverPdf(data: DischargeHandoverData): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  let y = 56;

  doc.setFillColor(PRIMARY);
  doc.rect(0, 0, pageWidth, 6, 'F');

  doc.setTextColor(STONE_900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MyRhythm — Discharge Handover', marginX, y);
  y += 22;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(STONE_500);
  doc.text('Prepared by the patient. Not a clinical record.', marginX, y);
  y += 24;

  doc.setTextColor(STONE_900);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient', marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.patientName || '—', marginX + 90, y);
  y += 16;

  doc.setFont('helvetica', 'bold');
  doc.text('Discharge date', marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.dischargeDateLabel || '—', marginX + 90, y);
  y += 16;

  if (data.clinicianName) {
    doc.setFont('helvetica', 'bold');
    doc.text('Clinician', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.clinicianName, marginX + 90, y);
    y += 16;
  }
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Support Circle', marginX, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const circle = data.supportCircle.length ? data.supportCircle : ['(none invited yet)'];
  circle.forEach((name) => {
    doc.text(`• ${name}`, marginX + 12, y);
    y += 13;
  });
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('First-week plan', marginX, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const items = data.weekPlanItems.length ? data.weekPlanItems : ['(no days completed yet)'];
  items.forEach((line) => {
    const wrapped = doc.splitTextToSize(`• ${line}`, pageWidth - marginX * 2 - 12);
    doc.text(wrapped, marginX + 12, y);
    y += wrapped.length * 13;
  });

  // Confidentiality footer (per Document Confidentiality Standard)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(STONE_500);
    const footer =
      `CONFIDENTIAL — Prepared by patient via MyRhythm. Not a clinical record. MyRhythm does not diagnose, treat, or cure any condition.  ·  ${EDITION_FOOTER}`;
    doc.text(footer, pageWidth / 2, pageHeight - 12, { align: 'center' });
  }

  return doc;
}

