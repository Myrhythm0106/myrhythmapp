import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { CaptureBriefModel } from '../model/types';

const BRAND_ORANGE: [number, number, number] = [234, 88, 12];
const INK: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];
const FOOTER_TEXT = 'MyRhythm · Confidential — Not medical advice. v0.1 Founding Edition.';

// Simple keyword list for symptoms / concerns. Not diagnostic — just surfacing what was mentioned.
const SYMPTOM_KEYWORDS = [
  'fatigue', 'tired', 'exhausted', 'sleep', 'insomnia', 'headache', 'pain', 'nausea',
  'dizzy', 'dizziness', 'confusion', 'confused', 'forget', 'forgetting', 'memory',
  'anxiety', 'anxious', 'stress', 'stressed', 'overwhelm', 'overwhelmed', 'low mood',
  'depression', 'sad', 'tearful', 'panic', 'shortness of breath', 'breathless',
  'weakness', 'numbness', 'tingling', 'balance', 'fall', 'fell', 'seizure', 'shaking',
  'vision', 'blurred', 'hearing', 'tinnitus', 'concentration', 'focus', 'brain fog',
  'mood swing', 'irritable', 'anger', 'frustrated',
];

const RED_FLAG_KEYWORDS = [
  'suicide', 'self-harm', 'hurt myself', 'kill myself', 'end it all', 'emergency',
  'ambulance', 'hospital', 'A&E', 'ER', 'chest pain', 'can\'t breathe', 'unconscious',
  'collapsed', 'seizure', 'stroke', 'bleeding', 'blood', 'fallen', 'fall and',
];

function header(doc: jsPDF, title: string) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_ORANGE);
  doc.text('MYRHYTHM · CLINICIAN SUMMARY', 40, 28);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED);
  doc.text(title, doc.internal.pageSize.getWidth() - 40, 28, { align: 'right' });
}

function footer(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(229, 231, 235);
  doc.line(40, h - 36, w - 40, h - 36);
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(FOOTER_TEXT, 40, h - 22);
  doc.text(`Page ${doc.getNumberOfPages()}`, w - 40, h - 22, { align: 'right' });
}

function sectionTitle(doc: jsPDF, text: string, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text(text, 40, y);
  doc.setDrawColor(...BRAND_ORANGE);
  doc.setLineWidth(1.2);
  doc.line(40, y + 4, 80, y + 4);
  return y + 22;
}

function paragraph(doc: jsPDF, text: string, y: number, opts?: { size?: number; muted?: boolean }): number {
  const size = opts?.size ?? 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...(opts?.muted ? MUTED : INK));
  const w = doc.internal.pageSize.getWidth() - 80;
  const lines = doc.splitTextToSize(text, w);
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - 60) {
      footer(doc);
      doc.addPage();
      header(doc, '');
      y = 60;
    }
    doc.text(line, 40, y);
    y += size + 3;
  }
  return y + 4;
}

function findKeywordHits(transcript: string, keywords: string[]): { keyword: string; quote: string }[] {
  const lower = transcript.toLowerCase();
  const hits: { keyword: string; quote: string }[] = [];
  const seen = new Set<string>();
  for (const kw of keywords) {
    if (seen.has(kw)) continue;
    const idx = lower.indexOf(kw.toLowerCase());
    if (idx >= 0) {
      seen.add(kw);
      const start = Math.max(0, idx - 60);
      const end = Math.min(transcript.length, idx + kw.length + 60);
      let quote = transcript.slice(start, end).replace(/\s+/g, ' ').trim();
      if (start > 0) quote = '...' + quote;
      if (end < transcript.length) quote = quote + '...';
      hits.push({ keyword: kw, quote });
    }
  }
  return hits;
}

export async function exportClinicianPdf(model: CaptureBriefModel, filename: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  header(doc, model.date);

  // Cover-ish header
  doc.setFillColor(...BRAND_ORANGE);
  doc.rect(40, 50, 60, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...INK);
  doc.text('Clinician Summary', 40, 90);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text(model.title, 40, 110);
  doc.text(model.date, pageW - 40, 110, { align: 'right' });

  let y = 140;

  // Patient identifier — first name only if available
  const firstName = model.participants[0]?.split(' ')[0] || 'Patient';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text('Prepared for', 40, y);
  doc.setFont('helvetica', 'normal');
  y = paragraph(doc, `${firstName} · generated from a MyRhythm Memory Bridge capture`, y + 14, { muted: true });

  // 1. Symptoms / concerns mentioned
  y = sectionTitle(doc, 'Symptoms & concerns mentioned', y);
  const symptomHits = findKeywordHits(model.rawTranscript, SYMPTOM_KEYWORDS);
  if (symptomHits.length) {
    const body = symptomHits.map(h => [h.keyword, h.quote]);
    autoTable(doc, {
      startY: y,
      margin: { left: 40, right: 40 },
      head: [['Keyword', 'Source quote']],
      body,
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 5, textColor: INK },
      headStyles: { fillColor: BRAND_ORANGE, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: { 0: { cellWidth: 100 } },
      didDrawPage: () => {
        header(doc, model.title);
        footer(doc);
      },
    });
    y = (doc as any).lastAutoTable.finalY + 20;
  } else {
    y = paragraph(doc, 'No specific symptom or concern keywords were detected in this capture.', y, { muted: true });
  }

  // 2. Commitments made / actions agreed
  y = sectionTitle(doc, 'Commitments made & actions agreed', y);
  if (model.actions.length) {
    const body = model.actions.map((a, i) => [
      String(i + 1),
      a.text,
      a.owner,
      a.dueDate?.label || a.due || '—',
      a.priorityLabel,
    ]);
    autoTable(doc, {
      startY: y,
      margin: { left: 40, right: 40 },
      head: [['#', 'Action', 'Owner', 'Due', 'Priority']],
      body,
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 5, textColor: INK },
      headStyles: { fillColor: BRAND_ORANGE, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didDrawPage: () => {
        header(doc, model.title);
        footer(doc);
      },
    });
    y = (doc as any).lastAutoTable.finalY + 20;
  } else {
    y = paragraph(doc, 'No actions were captured.', y, { muted: true });
  }

  // 3. Red flags / open questions
  y = sectionTitle(doc, 'Red flags & open questions', y);
  const redFlagHits = findKeywordHits(model.rawTranscript, RED_FLAG_KEYWORDS);
  if (redFlagHits.length) {
    y = paragraph(doc, 'The following urgent language was detected. This is not a diagnosis or emergency triage — review the full capture.', y, { size: 9 });
    for (const h of redFlagHits) {
      y = paragraph(doc, `• ${h.keyword}: "${h.quote}"`, y, { size: 9 });
    }
  }
  if (model.openQuestions.length) {
    y = paragraph(doc, 'Open questions:', y, { size: 10 });
    for (const q of model.openQuestions) {
      y = paragraph(doc, `• ${q}`, y, { size: 9 });
    }
  }
  if (!redFlagHits.length && !model.openQuestions.length) {
    y = paragraph(doc, 'No red-flag language or unresolved questions were detected.', y, { muted: true });
  }

  // Context
  if (model.context) {
    y = sectionTitle(doc, 'Capture context', y);
    y = paragraph(doc, model.context, y);
  }

  footer(doc);
  const blob = doc.output('blob');
  saveAs(blob, filename + '-clinician.pdf');
}
