import type { DailyAction, Goal } from '@/contexts/DailyActionsContext';
import type { SupportMember } from '@/hooks/use-support-circle';
import type { ContinuityThreadRow } from './types';

export type ReportMode = 'personal' | 'clinical';
export type WindowDays = 30 | 60 | 90;

export type CompletionStatus = 'completed' | 'partial' | 'not-met';

export interface WeekBucket {
  weekStart: string; // yyyy-mm-dd
  weekEnd: string;
  completed: number;
  partial: number;
  notMet: number;
  total: number;
}

export interface GoalRow {
  id: string;
  title: string;
  status: CompletionStatus;
  progress: number;
}

export interface FollowThroughItem {
  id: string;
  title: string;
  source: 'daily_action' | 'extracted_action' | 'goal';
  status: CompletionStatus;
  date?: string;
  supportMemberNames?: string[];
}

export interface SupportCircleMetric {
  member: SupportMember;
  actionsInvolved: number;
  notesLeft: number;
}

export interface ContinuityReport {
  generatedAt: string;
  mode: ReportMode;
  windowDays: WindowDays;
  startDate: string;
  endDate: string;
  userName: string;
  includeDob?: boolean;

  // Hero
  committedTotal: number;
  completedCount: number;
  partialCount: number;
  notMetCount: number;
  followThroughRate: number; // 0-1

  // Ribbon
  weekBuckets: WeekBucket[];

  // Goals
  goals: GoalRow[];
  goalsMet: number;
  goalsPartial: number;
  goalsNotMet: number;

  // Support Circle
  supportCircleMetrics: SupportCircleMetric[];
  supportCircleSize: number;
  actionsWithSupport: number;

  // Agreed items (from documents / Bridge Kit)
  agreedItems: FollowThroughItem[];
  agreedItemsCompleted: number;
  agreedItemsPartial: number;
  agreedItemsNotMet: number;

  // Rhythm
  daysActive: number;
  captureCount: number;
  calibrateCount: number;
  energyPattern: { date: string; band: string }[];

  // Narrative
  topWins: string[];
  carryForward: string[];
  memberNote?: string;
}

export interface BuildContinuityReportInput {
  userName: string;
  mode: ReportMode;
  windowDays: WindowDays;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  dailyActions: DailyAction[];
  goals: Goal[];
  extractedActions: any[];
  supportMembers: SupportMember[];
  supportNotes: any[];
  documentImports: any[];
  continuityHistory: ContinuityThreadRow[];
  growthStates?: any[];
  memberNote?: string;
  includeDob?: boolean;
}

function statusForDailyAction(a: DailyAction): CompletionStatus {
  if (a.status === 'completed') return 'completed';
  if (a.status === 'skipped') return 'not-met';
  // pending: treat as not-met for a retrospective report
  return 'not-met';
}

function statusForGoal(g: Goal): CompletionStatus {
  if (g.status === 'completed' || (g.progress_percentage ?? 0) >= 100) return 'completed';
  const p = g.progress_percentage ?? 0;
  if (p >= 40) return 'partial';
  return 'not-met';
}

function statusForExtractedAction(a: any): CompletionStatus {
  const s = (a.status ?? '').toLowerCase();
  if (s === 'completed' || a.completion_date) return 'completed';
  if (s === 'in_progress' || s === 'in-progress') return 'partial';
  if (s === 'cancelled' || s === 'dropped') return 'not-met';
  // scheduled/pending without completion = not yet met
  if (a.scheduled_date || a.proposed_date) return 'not-met';
  return 'not-met';
}

function inWindow(isoDate: string, start: string, end: string): boolean {
  return isoDate >= start && isoDate <= end;
}

function weekBucketsForWindow(start: string, end: string, items: { date?: string; status: CompletionStatus }[]): WeekBucket[] {
  const buckets: WeekBucket[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  let cursor = new Date(startDate);

  while (cursor <= endDate) {
    const weekStart = cursor.toISOString().slice(0, 10);
    const weekEndDate = new Date(cursor);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weekEnd = weekEndDate > endDate ? endDate.toISOString().slice(0, 10) : weekEndDate.toISOString().slice(0, 10);

    const inWeek = items.filter(i => i.date && i.date >= weekStart && i.date <= weekEnd);
    const completed = inWeek.filter(i => i.status === 'completed').length;
    const partial = inWeek.filter(i => i.status === 'partial').length;
    const notMet = inWeek.filter(i => i.status === 'not-met').length;

    buckets.push({
      weekStart,
      weekEnd,
      completed,
      partial,
      notMet,
      total: inWeek.length,
    });

    cursor.setDate(cursor.getDate() + 7);
  }

  return buckets;
}

export function buildContinuityReport(input: BuildContinuityReportInput): ContinuityReport {
  const { mode, windowDays, startDate, endDate } = input;

  // Daily actions
  const windowedActions = input.dailyActions.filter(a => inWindow(a.date, startDate, endDate));
  const dailyFollowThrough: FollowThroughItem[] = windowedActions.map(a => ({
    id: a.id,
    title: a.title,
    source: 'daily_action',
    status: statusForDailyAction(a),
    date: a.date,
    supportMemberNames: (a.watchers ?? []).filter(Boolean),
  }));

  // Goals
  const windowedGoals = input.goals.filter(g => {
    const created = g.created_at?.slice(0, 10);
    const target = g.target_date;
    return (created && inWindow(created, startDate, endDate)) || (target && inWindow(target, startDate, endDate));
  });
  const goalRows: GoalRow[] = windowedGoals.map(g => ({
    id: g.id,
    title: g.title,
    status: statusForGoal(g),
    progress: g.progress_percentage ?? 0,
  }));

  // Extracted actions (Memory Bridge / document import)
  const extractedRows: FollowThroughItem[] = (input.extractedActions ?? []).map(a => {
    const date = a.scheduled_date || a.proposed_date || a.start_date || a.created_at?.slice(0, 10);
    return {
      id: a.id,
      title: a.action_text,
      source: 'extracted_action',
      status: statusForExtractedAction(a),
      date,
      supportMemberNames: (a.assigned_watchers ?? []).filter(Boolean),
    };
  }).filter(i => !i.date || inWindow(i.date, startDate, endDate));

  // Agreed items = extracted actions that came from an imported document
  const agreedItems = extractedRows.filter(i => {
    const source = (input.extractedActions ?? []).find((e: any) => e.id === i.id);
    return source?.source_type === 'document_import' || source?.source_type === 'discharge_summary';
  });

  // Combine all follow-through items for hero and ribbon
  const allItems: FollowThroughItem[] = [
    ...dailyFollowThrough,
    ...goalRows.map<FollowThroughItem>(g => ({
      id: g.id,
      title: g.title,
      source: 'goal',
      status: g.status,
      date: undefined,
    })),
    ...extractedRows,
  ];

  const committedTotal = allItems.length;
  const completedCount = allItems.filter(i => i.status === 'completed').length;
  const partialCount = allItems.filter(i => i.status === 'partial').length;
  const notMetCount = allItems.filter(i => i.status === 'not-met').length;
  const followThroughRate = committedTotal ? completedCount / committedTotal : 0;

  // Week-by-week ribbon
  const ribbonItems = allItems.map(i => ({ date: i.date, status: i.status }));
  const weekBuckets = weekBucketsForWindow(startDate, endDate, ribbonItems);

  // Support Circle metrics
  const memberMap = new Map<string, SupportCircleMetric>();
  for (const m of input.supportMembers) {
    memberMap.set(m.id, { member: m, actionsInvolved: 0, notesLeft: 0 });
  }
  for (const note of input.supportNotes ?? []) {
    const metric = memberMap.get(note.support_member_id);
    if (metric) metric.notesLeft += 1;
  }
  for (const item of allItems) {
    for (const name of item.supportMemberNames ?? []) {
      const metric = Array.from(memberMap.values()).find(m => m.member.name === name);
      if (metric) metric.actionsInvolved += 1;
    }
  }
  const supportCircleMetrics = Array.from(memberMap.values());
  const actionsWithSupport = allItems.filter(i => (i.supportMemberNames ?? []).length > 0).length;

  // Rhythm
  const historyInWindow = input.continuityHistory.filter(h => h.thread_date >= startDate && h.thread_date <= endDate);
  const daysActive = new Set(historyInWindow.map(h => h.thread_date)).size;
  const captureCount = input.extractedActions?.length ?? 0;
  const calibrateCount = historyInWindow.length;
  const energyPattern = historyInWindow
    .filter(h => h.snapshot?.energyBand)
    .map(h => ({ date: h.thread_date, band: h.snapshot.energyBand }))
    .slice(0, 14);

  // Wins / carry-forward from continuity thread
  const wins = new Set<string>();
  const carry = new Set<string>();
  for (const h of historyInWindow) {
    (h.snapshot?.lastWins ?? []).forEach(w => wins.add(w));
    (h.carry_forward ?? []).forEach((c: any) => carry.add(typeof c === 'string' ? c : c.label));
  }

  return {
    generatedAt: new Date().toISOString(),
    mode,
    windowDays,
    startDate,
    endDate,
    userName: input.userName,
    includeDob: input.includeDob,

    committedTotal,
    completedCount,
    partialCount,
    notMetCount,
    followThroughRate,

    weekBuckets,

    goals: goalRows,
    goalsMet: goalRows.filter(g => g.status === 'completed').length,
    goalsPartial: goalRows.filter(g => g.status === 'partial').length,
    goalsNotMet: goalRows.filter(g => g.status === 'not-met').length,

    supportCircleMetrics,
    supportCircleSize: input.supportMembers.length,
    actionsWithSupport,

    agreedItems,
    agreedItemsCompleted: agreedItems.filter(i => i.status === 'completed').length,
    agreedItemsPartial: agreedItems.filter(i => i.status === 'partial').length,
    agreedItemsNotMet: agreedItems.filter(i => i.status === 'not-met').length,

    daysActive,
    captureCount,
    calibrateCount,
    energyPattern,

    topWins: Array.from(wins).slice(0, 5),
    carryForward: Array.from(carry).slice(0, 8),
    memberNote: input.memberNote,
  };
}
