import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import { CaptureBriefModel, ExportOptions } from '../model/types';

const ORANGE = 'EA580C';
const INK = '111827';
const MUTED = '6B7280';
const FOOTER_TEXT =
  'MyRhythm · Confidential — Not medical advice. v0.1 Founding Edition.';

const h = (text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel]) =>
  new Paragraph({
    heading: level,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: INK, font: 'Calibri' })],
  });

const p = (text: string, opts: { italic?: boolean; color?: string; size?: number } = {}) =>
  new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text,
        italics: opts.italic,
        color: opts.color || INK,
        size: opts.size || 22,
        font: 'Calibri',
      }),
    ],
  });

const bullet = (text: string) =>
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, color: INK, size: 22, font: 'Calibri' })],
  });

const cell = (text: string, opts: { bold?: boolean; head?: boolean; width?: number } = {}) =>
  new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.head ? { fill: ORANGE, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: opts.bold || opts.head,
            color: opts.head ? 'FFFFFF' : INK,
            size: 20,
            font: 'Calibri',
          }),
        ],
      }),
    ],
  });

export async function exportCaptureBriefDocx(model: CaptureBriefModel, opts: ExportOptions) {
  const children: Paragraph[] = [];

  // Cover
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: 'MYRHYTHM · CAPTURE BRIEF', color: ORANGE, bold: true, size: 18, font: 'Calibri' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: model.title, bold: true, size: 48, color: INK, font: 'Calibri' })],
    }),
    p(model.date, { color: MUTED }),
  );
  if (model.participants.length) {
    children.push(p('Participants: ' + model.participants.join(', '), { color: MUTED }));
  }
  if (model.context) {
    children.push(p('Context: ' + model.context, { color: MUTED, italic: true }));
  }

  if (opts.sections.summary) {
    children.push(h('Executive summary', HeadingLevel.HEADING_1));
    children.push(p(model.summary));
    if (model.themes.length) {
      children.push(p('Themes: ' + model.themes.join(' · '), { italic: true, color: MUTED, size: 20 }));
    }
  }

  if (opts.sections.actions && model.actions.length) {
    children.push(h('Action register', HeadingLevel.HEADING_1));
    const sched = !!opts.includeSchedule;
    const tableWidth = 9000;
    const cols = sched
      ? [400, 2400, 900, 1200, 1200, 1200, 900, 800]
      : [400, 3500, 1200, 1300, 1100, 1500];
    const headers = sched
      ? ['#', 'Action', 'Owner', 'Start', 'Due', 'People', 'Reminders', 'Pri']
      : ['#', 'Action', 'Owner', 'Due', 'Priority', 'Confidence'];
    const table = new Table({
      width: { size: tableWidth, type: WidthType.DXA },
      columnWidths: cols,
      rows: [
        new TableRow({
          tableHeader: true,
          children: headers.map((t, i) => cell(t, { head: true, width: cols[i] })),
        }),
        ...model.actions.map((a, i) => {
          if (!sched) {
            return new TableRow({
              children: [
                cell(String(i + 1), { width: cols[0] }),
                cell(a.text, { width: cols[1] }),
                cell(a.owner, { width: cols[2] }),
                cell(a.due || '—', { width: cols[3] }),
                cell(a.priorityLabel, { width: cols[4], bold: true }),
                cell(`${Math.round(a.confidence * 100)}%`, { width: cols[5] }),
              ],
            });
          }
          const top = a.scheduled
            ? { date: a.scheduled.startDate, time: a.scheduled.startTime }
            : a.suggestions?.find(s => s.isRecommended) || a.suggestions?.[0];
          const start = top ? `${top.date} ${top.time}` : '—';
          const dueLabel = a.dueDate?.label || a.dueDate?.date || a.due || '—';
          const people = (a.people || []).filter(p => p.role !== 'none').map(p => `${p.name} (${p.role})`).join(', ') || '—';
          const reminders = (a.scheduled?.reminders || []).map(r => `${r.minutesBefore}m`).join(', ') || '—';
          return new TableRow({
            children: [
              cell(String(i + 1), { width: cols[0] }),
              cell(a.text, { width: cols[1] }),
              cell(a.owner, { width: cols[2] }),
              cell(start, { width: cols[3] }),
              cell(dueLabel, { width: cols[4] }),
              cell(people, { width: cols[5] }),
              cell(reminders, { width: cols[6] }),
              cell(a.priorityLabel, { width: cols[7], bold: true }),
            ],
          });
        }),
      ],
    });
    children.push(new Paragraph({ children: [], spacing: { after: 0 } }));
    // @ts-expect-error - docx accepts Table within children
    children.push(table);
  }

  if (opts.sections.decisions) {
    children.push(h('Decisions & themes', HeadingLevel.HEADING_1));
    if (model.decisions.length) {
      for (const d of model.decisions) children.push(bullet(d));
    } else {
      children.push(p('No explicit decisions detected.', { color: MUTED, italic: true }));
    }
  }

  if (opts.sections.questions) {
    children.push(h('Open questions', HeadingLevel.HEADING_1));
    if (model.openQuestions.length) {
      for (const q of model.openQuestions) children.push(bullet(q));
    } else {
      children.push(p('No unresolved questions detected.', { color: MUTED, italic: true }));
    }
  }

  if (opts.sections.transcript && model.transcript.length) {
    children.push(h('Annotated transcript', HeadingLevel.HEADING_1));
    for (const t of model.transcript) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({ text: t.speaker, bold: true, color: ORANGE, size: 20, font: 'Calibri' }),
          ],
        }),
        p(t.text),
      );
    }
  }

  const doc = new Document({
    creator: 'MyRhythm',
    title: model.title,
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 240 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ORANGE, space: 4 } },
                children: [
                  new TextRun({ text: 'MyRhythm · Capture Brief', color: ORANGE, bold: true, size: 16, font: 'Calibri' }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: FOOTER_TEXT, color: MUTED, size: 14, font: 'Calibri' })],
              }),
            ],
          }),
        },
        children: children as any,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, opts.filename + '.docx');
}
