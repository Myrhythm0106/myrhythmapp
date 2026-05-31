import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { CaptureBriefModel, ExportOptions } from '../model/types';

const BRAND_ORANGE: [number, number, number] = [234, 88, 12]; // tailwind orange-600
const INK: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];
const FOOTER_TEXT =
  'MyRhythm · Confidential — Not medical advice. v0.1 Founding Edition.';

function header(doc: jsPDF, title: string) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_ORANGE);
  doc.text('MYRHYTHM · CAPTURE BRIEF', 40, 28);
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

function ensureSpace(doc: jsPDF, y: number, needed = 80): number {
  const h = doc.internal.pageSize.getHeight();
  if (y + needed > h - 50) {
    footer(doc);
    doc.addPage();
    header(doc, '');
    return 60;
  }
  return y;
}

function sectionTitle(doc: jsPDF, text: string, y: number): number {
  y = ensureSpace(doc, y, 50);
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
    y = ensureSpace(doc, y, size + 4);
    doc.text(line, 40, y);
    y += size + 3;
  }
  return y + 4;
}

export async function exportCaptureBriefPdf(model: CaptureBriefModel, opts: ExportOptions) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // ===== Cover =====
  header(doc, model.date);
  doc.setFillColor(...BRAND_ORANGE);
  doc.rect(40, 90, 60, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...INK);
  const titleLines = doc.splitTextToSize(model.title, pageW - 80);
  doc.text(titleLines, 40, 130);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text('Capture Brief', 40, 160 + titleLines.length * 28);

  let y = 200 + titleLines.length * 28;
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  if (model.participants.length) {
    doc.setFont('helvetica', 'bold');
    doc.text('Participants', 40, y);
    doc.setFont('helvetica', 'normal');
    y = paragraph(doc, model.participants.join(', '), y + 14);
  }
  if (model.context) {
    doc.setFont('helvetica', 'bold');
    doc.text('Context', 40, y);
    y = paragraph(doc, model.context, y + 14);
  }

  // Stats row
  const stats = [
    { label: 'Actions', value: String(model.actions.length) },
    { label: 'Decisions', value: String(model.decisions.length) },
    { label: 'Open questions', value: String(model.openQuestions.length) },
  ];
  y += 10;
  stats.forEach((s, i) => {
    const x = 40 + i * 160;
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(x, y, 150, 56, 6, 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...BRAND_ORANGE);
    doc.text(s.value, x + 12, y + 28);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(s.label.toUpperCase(), x + 12, y + 46);
  });
  y += 80;

  // ===== Sections =====
  if (opts.sections.summary) {
    y = sectionTitle(doc, 'Executive summary', y);
    y = paragraph(doc, model.summary, y);
    if (model.themes.length) {
      y = paragraph(doc, 'Themes: ' + model.themes.join(' · '), y, { size: 9, muted: true });
    }
  }

  if (opts.sections.actions && model.actions.length) {
    y = sectionTitle(doc, 'Action register', y);
    autoTable(doc, {
      startY: y,
      margin: { left: 40, right: 40 },
      head: [['#', 'Action', 'Owner', 'Due', 'Priority', 'Conf.']],
      body: model.actions.map((a, i) => [
        String(i + 1),
        a.text,
        a.owner,
        a.due || '—',
        a.priorityLabel,
        `${Math.round(a.confidence * 100)}%`,
      ]),
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 6, textColor: INK },
      headStyles: { fillColor: BRAND_ORANGE, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 70 },
        3: { cellWidth: 70 },
        4: { cellWidth: 50 },
        5: { cellWidth: 40, halign: 'right' },
      },
      didDrawPage: () => {
        header(doc, model.title);
        footer(doc);
      },
    });
    y = (doc as any).lastAutoTable.finalY + 20;
  }

  if (opts.sections.decisions && (model.decisions.length || model.themes.length)) {
    y = sectionTitle(doc, 'Decisions & themes', y);
    if (model.decisions.length) {
      for (const d of model.decisions) {
        y = ensureSpace(doc, y, 24);
        doc.setFillColor(...BRAND_ORANGE);
        doc.circle(44, y - 3, 1.8, 'F');
        y = paragraph(doc, '   ' + d, y);
      }
    } else {
      y = paragraph(doc, 'No explicit decisions detected.', y, { muted: true });
    }
  }

  if (opts.sections.questions) {
    y = sectionTitle(doc, 'Open questions', y);
    if (model.openQuestions.length) {
      for (const q of model.openQuestions) {
        y = ensureSpace(doc, y, 24);
        doc.setTextColor(...BRAND_ORANGE);
        doc.setFont('helvetica', 'bold');
        doc.text('?', 40, y);
        y = paragraph(doc, '   ' + q, y);
      }
    } else {
      y = paragraph(doc, 'No unresolved questions detected.', y, { muted: true });
    }
  }

  if (opts.sections.transcript && model.transcript.length) {
    y = sectionTitle(doc, 'Annotated transcript', y);
    for (const turn of model.transcript) {
      y = ensureSpace(doc, y, 32);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...BRAND_ORANGE);
      doc.text(turn.speaker, 40, y);
      y += 12;
      y = paragraph(doc, turn.text, y);
    }
  }

  footer(doc);
  const blob = doc.output('blob');
  saveAs(blob, opts.filename + '.pdf');
}
