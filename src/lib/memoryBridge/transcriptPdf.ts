import { jsPDF } from 'jspdf';

/** Builds a tidy, keepable PDF of a conversation transcript and downloads it. */
export function downloadTranscriptPdf(title: string, text: string, when = new Date()) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 56;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageH = doc.internal.pageSize.getHeight();
  let y = margin;
  doc.setFont('helvetica', 'bold').setFontSize(18);
  doc.splitTextToSize(title || 'My conversation', width).forEach((l: string) => { doc.text(l, margin, y); y += 22; });
  doc.setFont('helvetica', 'normal').setFontSize(11).setTextColor(90);
  doc.text(`Transcript · saved ${when.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y);
  y += 28;
  doc.setTextColor(20).setFontSize(12);
  for (const para of text.split(/\n+/)) {
    for (const line of doc.splitTextToSize(para, width) as string[]) {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(line, margin, y); y += 17;
    }
    y += 8;
  }
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i).setFontSize(8).setTextColor(130);
    doc.text(`MyRhythm · Private and confidential · Page ${i} of ${pages}`, margin, pageH - 24);
  }
  const safe = (title || 'conversation').replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 60);
  doc.save(`transcript-${safe}-${when.toISOString().slice(0, 10)}.pdf`);
}
