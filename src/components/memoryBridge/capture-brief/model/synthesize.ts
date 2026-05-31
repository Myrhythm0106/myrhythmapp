import { BriefAction, TranscriptTurn } from './types';

const DECISION_VERBS = /\b(decided|agreed|will|going to|chose|resolved|approved|confirmed|committed)\b/i;
const STOPWORDS = new Set([
  'the','and','for','with','that','this','have','from','your','will','about','their','would','could',
  'should','there','what','when','where','they','them','then','than','into','been','were','because',
  'just','very','also','some','more','make','like','only','over','such','still','being','these','those',
  'each','many','much','most','other','here','than','those','said','says','well','okay','yeah','yes','know'
]);

export function extractDecisions(actions: BriefAction[], transcript: string): string[] {
  const fromActions = actions
    .filter(a => a.category === 'decision' || DECISION_VERBS.test(a.text))
    .map(a => a.text);

  const fromTranscript = transcript
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 25 && s.length < 200 && DECISION_VERBS.test(s))
    .slice(0, 8);

  return Array.from(new Set([...fromActions, ...fromTranscript])).slice(0, 10);
}

export function extractOpenQuestions(transcript: string, actions: BriefAction[]): string[] {
  const actionText = actions.map(a => a.text.toLowerCase()).join(' ');
  return transcript
    .split(/(?<=\?)\s+/)
    .map(s => s.trim())
    .filter(s => s.endsWith('?') && s.length > 12 && s.length < 200)
    .filter(q => !actionText.includes(q.toLowerCase().slice(0, 20)))
    .slice(0, 8);
}

export function extractThemes(transcript: string): string[] {
  const words = transcript.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const counts = new Map<string, number>();
  for (const w of words) {
    if (STOPWORDS.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
}

export function parseTranscriptTurns(transcript: string): TranscriptTurn[] {
  if (!transcript) return [];
  // Simple speaker-prefixed parsing: "Name: text"
  const lines = transcript.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const turns: TranscriptTurn[] = [];
  for (const line of lines) {
    const m = line.match(/^([A-Z][\w .'-]{1,40}?):\s*(.+)$/);
    if (m) {
      turns.push({ speaker: m[1], text: m[2] });
    } else if (turns.length) {
      turns[turns.length - 1].text += ' ' + line;
    } else {
      turns.push({ speaker: 'Speaker', text: line });
    }
  }
  return turns;
}

export function buildExecutiveSummary(opts: {
  title: string;
  participants: string[];
  actions: BriefAction[];
  decisions: string[];
  themes: string[];
}): string {
  const owners = Array.from(new Set(opts.actions.map(a => a.owner).filter(Boolean)));
  const high = opts.actions.filter(a => a.priorityLabel === 'High').length;
  const parts: string[] = [];
  parts.push(
    `${opts.title} brought together ${opts.participants.length || 'the'} participant${
      opts.participants.length === 1 ? '' : 's'
    }${opts.participants.length ? ` (${opts.participants.join(', ')})` : ''}.`
  );
  if (opts.themes.length)
    parts.push(`Discussion centred on ${opts.themes.slice(0, 3).join(', ').toLowerCase()}.`);
  if (opts.decisions.length)
    parts.push(`${opts.decisions.length} decision${opts.decisions.length === 1 ? '' : 's'} were captured.`);
  parts.push(
    `${opts.actions.length} action${opts.actions.length === 1 ? '' : 's'} were extracted${
      high ? `, including ${high} marked high priority` : ''
    }${owners.length ? `, with ownership spread across ${owners.length} contributor${owners.length === 1 ? '' : 's'}` : ''}.`
  );
  return parts.join(' ');
}
