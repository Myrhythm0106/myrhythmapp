import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

/**
 * Tables this user owns directly via `user_id`. Add to this list when new
 * user-owned tables are introduced. Tables behind RLS will silently return
 * empty arrays if the caller lacks access — that is intentional.
 */
const USER_OWNED_TABLES = [
  'profiles',
  'daily_actions',
  'mood_entries',
  'gratitude_entries',
  'goals',
  'voice_recordings',
  'extracted_actions',
  'support_circle_members',
  'memory_entries',
  'subscriptions',
] as const;

const RATE_LIMIT_KEY = 'mr:gdpr-export-last';
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000;

export function canRequestExport(): { ok: boolean; nextAvailable?: Date } {
  if (typeof window === 'undefined') return { ok: true };
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return { ok: true };
  const lastMs = Number(last);
  if (Number.isNaN(lastMs)) return { ok: true };
  const elapsed = Date.now() - lastMs;
  if (elapsed >= RATE_LIMIT_MS) return { ok: true };
  return { ok: false, nextAvailable: new Date(lastMs + RATE_LIMIT_MS) };
}

function markRequested() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
  }
}

export async function gatherUserData(userId: string): Promise<Record<string, any[]>> {
  const result: Record<string, any[]> = {};
  await Promise.all(
    USER_OWNED_TABLES.map(async (table) => {
      try {
        const { data } = await supabase
          .from(table as any)
          .select('*')
          .eq('user_id', userId);
        result[table] = data || [];
      } catch {
        result[table] = [];
      }
    })
  );
  return result;
}

function buildSummaryPdf(userId: string, email: string, bundle: Record<string, any[]>): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 56;

  doc.setFillColor('#0D9488');
  doc.rect(0, 0, pageWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MyRhythm — Your Data Summary', 48, y);
  y += 22;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#78716C');
  doc.text(`Generated for ${email}`, 48, y);
  y += 14;
  doc.text(`User ID: ${userId}`, 48, y);
  y += 14;
  doc.text(`Date: ${new Date().toLocaleString()}`, 48, y);
  y += 24;

  doc.setTextColor('#1C1917');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Records included in this export', 48, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  for (const [table, rows] of Object.entries(bundle)) {
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 56;
    }
    doc.text(`${table}`, 48, y);
    doc.text(String(rows.length), pageWidth - 48, y, { align: 'right' });
    y += 16;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(3);
    doc.setTextColor('#78716C');
    doc.text(
      'CONFIDENTIAL — Personal data export. You are the data controller for this file.',
      pageWidth / 2,
      pageHeight - 12,
      { align: 'center' }
    );
  }
  return doc;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportUserData(userId: string, email: string) {
  const bundle = await gatherUserData(userId);

  // JSON file
  const json = JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      user_id: userId,
      email,
      data: bundle,
    },
    null,
    2
  );
  downloadBlob(new Blob([json], { type: 'application/json' }), 'myrhythm-data-export.json');

  // PDF summary
  const pdf = buildSummaryPdf(userId, email, bundle);
  pdf.save('myrhythm-data-summary.pdf');

  markRequested();
}
