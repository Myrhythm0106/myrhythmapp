// Curated #IChoose pool — empowering, no medical claims.
// Daily rotation = deterministic by day-of-year (statements[dayOfYear % length]).

export const I_CHOOSE_STATEMENTS: string[] = [
  "#IChoose to honour my own pace today.",
  "#IChoose progress over perfection.",
  "#IChoose to celebrate one small win.",
  "#IChoose to be patient with my brain.",
  "#IChoose rest as a form of strength.",
  "#IChoose to ask for help when I need it.",
  "#IChoose to trust my rhythm.",
  "#IChoose to show up — even gently.",
  "#IChoose curiosity over judgement.",
  "#IChoose one clear next step.",
  "#IChoose to notice what's working.",
  "#IChoose softness with myself today.",
  "#IChoose to begin, not to finish.",
  "#IChoose breath before reaction.",
  "#IChoose my voice in my own day.",
  "#IChoose connection over isolation.",
  "#IChoose to let today be enough.",
  "#IChoose calm over urgency.",
  "#IChoose to keep my promises to me.",
  "#IChoose courage in small doses.",
  "#IChoose to receive support.",
  "#IChoose meaning over busyness.",
  "#IChoose presence over pressure.",
  "#IChoose to forgive yesterday.",
  "#IChoose one thing that matters.",
  "#IChoose hope as a daily practice.",
  "#IChoose my recovery, on my terms.",
  "#IChoose to honour the bridge I'm crossing.",
  "#IChoose gratitude, even quietly.",
  "#IChoose to be my own steady person.",
];

export function getDailyStatement(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return I_CHOOSE_STATEMENTS[dayOfYear % I_CHOOSE_STATEMENTS.length];
}

export function getNextStatement(current: string): string {
  const idx = I_CHOOSE_STATEMENTS.indexOf(current);
  const next = (idx + 1) % I_CHOOSE_STATEMENTS.length;
  return I_CHOOSE_STATEMENTS[next];
}

export function todayStorageKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `myrhythm_demo_ichoose_${yyyy}-${mm}-${dd}`;
}
