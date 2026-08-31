import { saveAs } from 'file-saver';
import { format, parseISO } from 'date-fns';
import type { NextStepsItem } from '@/types/memoryBridge';
import { involvementFromAction } from '@/components/memoryBridge/WhosInvolvedCell';
import type { MeetingSummaryModel } from '@/components/memoryBridge/ExecutiveSummaryPanel';

// Emerald Prestige palette (pptxgenjs wants hex without '#')
const INK = '0B3B32';
const MOSS = '12695A';
const SOFT = '7FB8A6';
const SURFACE = 'F7F4EC';
const RULE = 'D2E0DC';
const ACCENT = 'F97316';
const WHITE = 'FFFFFF';

const FOOTER = 'MyRhythm · Confidential — Not medical advice. Prepared for internal review.';

function displayDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = parseISO(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, 'dd MMM yyyy');
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

function ownerName(action: NextStepsItem): string {
  return involvementFromAction(action).responsible.name;
}

const ROWS_PER_SLIDE = 6;

/**
 * Board-ready slide deck (.pptx) that imports cleanly into Google Slides
 * (File → Import slides, or open the file in Google Drive).
 */
export async function exportActionsPptx(
  meeting: MeetingSummaryModel,
  actions: NextStepsItem[],
): Promise<void> {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE';
  pptx.title = meeting.title || 'MyRhythm — Next Step Summary';
  pptx.author = 'MyRhythm';

  const addFooter = (slide: ReturnType<typeof pptx.addSlide>) => {
    slide.addText(FOOTER, {
      x: 0.5, y: 7.08, w: 12.33, h: 0.32,
      fontSize: 9, color: SOFT, align: 'left',
    });
  };

  // ---- Slide 1: Title ----
  {
    const s = pptx.addSlide();
    s.background = { color: INK };
    s.addText('MYRHYTHM', { x: 0.6, y: 0.55, w: 6, h: 0.4, fontSize: 13, bold: true, color: SOFT, charSpacing: 4 });
    s.addText(meeting.title || 'Next Step Summary', {
      x: 0.6, y: 1.9, w: 12.1, h: 1.6, fontSize: 40, bold: true, color: WHITE,
    });
    s.addText(
      [
        { text: `${meeting.date || ''}`, options: { fontSize: 18, color: SURFACE } },
        ...(meeting.participants?.length
          ? [{ text: `\nWith ${meeting.participants.join(', ')}`, options: { fontSize: 15, color: SOFT } }]
          : []),
      ],
      { x: 0.6, y: 3.7, w: 12.1, h: 1.1 },
    );
    s.addText(
      [
        { text: `${meeting.counts.total} next steps`, options: { bold: true, color: WHITE } },
        { text: `  ·  ${meeting.counts.scheduled} scheduled  ·  ${meeting.counts.complete} accomplished`, options: { color: SOFT } },
      ],
      { x: 0.6, y: 5.1, w: 12.1, h: 0.5, fontSize: 16 },
    );
    if (actions[0]?.reference_code) {
      s.addText(`Reference ${actions[0].reference_code.split('-A')[0]}`, {
        x: 0.6, y: 6.7, w: 6, h: 0.35, fontSize: 11, color: SOFT,
      });
    }
    addFooter(s);
  }

  // ---- Slide 2: Executive Summary ----
  {
    const s = pptx.addSlide();
    s.background = { color: SURFACE };
    s.addText('EXECUTIVE SUMMARY', { x: 0.6, y: 0.5, w: 12, h: 0.4, fontSize: 13, bold: true, color: MOSS, charSpacing: 3 });
    s.addText(meeting.summary || 'No summary recorded for this conversation.', {
      x: 0.6, y: 1.0, w: 12.1, h: 1.8, fontSize: 16, color: INK, valign: 'top', lineSpacingMultiple: 1.25,
    });

    let y = 3.0;
    const section = (heading: string, items: string[], bulletColor: string) => {
      if (!items.length) return;
      const shown = items.slice(0, 4);
      s.addText(heading.toUpperCase(), { x: 0.6, y, w: 12, h: 0.32, fontSize: 12, bold: true, color: MOSS, charSpacing: 2 });
      y += 0.38;
      s.addText(
        shown.map(t => ({ text: t, options: { bullet: { code: '2022', indent: 12 }, fontSize: 13.5, color: INK, paraSpaceAfter: 3 } })),
        { x: 0.6, y, w: 12.1, h: shown.length * 0.36, valign: 'top', color: bulletColor },
      );
      y += shown.length * 0.36 + 0.14;
    };
    section('Key themes', meeting.themes || [], INK);
    section('Decisions', meeting.decisions || [], INK);
    section('Open questions', meeting.openQuestions || [], INK);
    addFooter(s);
  }

  // ---- Slides 3+: Actions table (native table, chunked) ----
  const chunks: NextStepsItem[][] = [];
  for (let i = 0; i < actions.length; i += ROWS_PER_SLIDE) {
    chunks.push(actions.slice(i, i + ROWS_PER_SLIDE));
  }
  if (chunks.length === 0) chunks.push([]);

  chunks.forEach((chunk, ci) => {
    const s = pptx.addSlide();
    s.background = { color: WHITE };
    s.addText(
      chunks.length > 1 ? `NEXT STEPS (${ci + 1} OF ${chunks.length})` : 'NEXT STEPS',
      { x: 0.6, y: 0.5, w: 12, h: 0.4, fontSize: 13, bold: true, color: MOSS, charSpacing: 3 },
    );

    const header = ['Priority', 'Action', 'Owner', 'Start', 'Finish', 'Status'].map(h => ({
      text: h,
      options: { bold: true, color: WHITE, fill: { color: INK }, fontSize: 12, valign: 'middle' as const, margin: 6 },
    }));

    const rows = chunk.map(a => {
      const proposed = !a.start_date && a.proposed_date;
      return [
        { text: priorityLabel(a.priority_level), options: { fontSize: 11.5, color: INK, margin: 6 } },
        {
          text: [
            { text: a.action_text || '—', options: { fontSize: 12, color: INK, bold: true, breakLine: true } },
            ...(a.success_criteria
              ? [{ text: `✓ I'll know I'm done when… ${a.success_criteria}`, options: { fontSize: 10.5, color: MOSS, italic: true } }]
              : []),
          ],
          options: { margin: 6 },
        },
        { text: ownerName(a), options: { fontSize: 11.5, color: INK, margin: 6 } },
        {
          text: proposed ? `${displayDate(a.proposed_date)} (proposed)` : displayDate(a.start_date),
          options: { fontSize: 11.5, color: proposed ? ACCENT : INK, margin: 6 },
        },
        { text: displayDate(a.completion_date || a.end_date), options: { fontSize: 11.5, color: INK, margin: 6 } },
        { text: statusLabel(a.status), options: { fontSize: 11.5, color: MOSS, bold: true, margin: 6 } },
      ];
    });

    if (rows.length) {
      s.addTable([header, ...rows] as never, {
        x: 0.6, y: 1.05, w: 12.13,
        colW: [1.1, 4.93, 1.6, 1.6, 1.2, 1.7],
        border: { type: 'solid', pt: 0.75, color: RULE },
        rowH: 0.55,
        autoPage: false,
        valign: 'middle',
      });
    } else {
      s.addText('No next steps recorded yet.', { x: 0.6, y: 1.4, w: 12, h: 0.5, fontSize: 16, color: SOFT });
    }
    addFooter(s);
  });

  const blob = await pptx.write({ outputType: 'blob' });
  const safeTitle = (meeting.title || 'next-steps').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase();
  saveAs(blob as Blob, `myrhythm-${safeTitle}-slides.pptx`);
}
