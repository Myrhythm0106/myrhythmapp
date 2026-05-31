import { supabase } from '@/integrations/supabase/client';
import { smartScheduler } from '@/utils/smartScheduler';
import type {
  ActionDueDate,
  ActionReminder,
  BriefAction,
  MentionedSupportMember,
  PersonPick,
  SchedulingSuggestion,
} from './types';

// ---- Date intent detection ----------------------------------------------

const DATE_PATTERNS: RegExp[] = [
  /\btoday\b/i,
  /\btomorrow\b/i,
  /\bnext (?:week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  /\bby (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  /\bin \d+ (?:day|days|week|weeks)\b/i,
  /\b\d{1,2}(?:st|nd|rd|th)? (?:of )?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w* \d{1,2}\b/i,
  /\b\d{4}-\d{2}-\d{2}\b/,
  /\b\d{1,2}\s*(?:am|pm)\b/i,
  /\bat \d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/i,
];

function hasDateMention(text: string): { matched: boolean; label?: string } {
  if (!text) return { matched: false };
  for (const p of DATE_PATTERNS) {
    const m = text.match(p);
    if (m) return { matched: true, label: m[0] };
  }
  return { matched: false };
}

// ---- Support members -----------------------------------------------------

export async function loadSupportMembers(userId: string): Promise<MentionedSupportMember[]> {
  const { data, error } = await supabase
    .from('support_circle_members')
    .select('id, member_name, member_email, relationship, permissions, status')
    .eq('user_id', userId)
    .eq('status', 'active');
  if (error) return [];
  return (data || []).map((m: any) => ({
    id: m.id,
    name: m.member_name || 'Member',
    email: m.member_email || undefined,
    relationship: m.relationship || undefined,
    hasCalendarPermission: Boolean(m.permissions?.calendar),
    hasActionsPermission: Boolean(m.permissions?.actions),
  }));
}

// ---- Default reminders by priority ---------------------------------------

export function defaultReminders(
  priority: number,
  due?: string,
  start?: string,
): ActionReminder[] {
  const urgent = priority >= 4;
  const dueSoon = due && start
    ? (new Date(due).getTime() - new Date(start).getTime()) / 86400000 <= 2
    : false;

  if (urgent || dueSoon) {
    return [
      { minutesBefore: 60, channel: 'push' },
      { minutesBefore: 8 * 60, channel: 'push' }, // morning-of-ish proxy
    ];
  }
  if (priority >= 3) return [{ minutesBefore: 30, channel: 'push' }];
  return [{ minutesBefore: 15, channel: 'push' }];
}

// ---- Due date resolver ---------------------------------------------------

export function resolveDueDate(
  action: BriefAction,
  topSuggestion?: SchedulingSuggestion,
): ActionDueDate | undefined {
  if (action.dateMentionedInMeeting && action.mentionedDateLabel) {
    // We don't parse the freeform date here — keep label, leave actual date as suggestion date
    const fallbackDate = topSuggestion?.date || todayISO();
    return {
      date: fallbackDate,
      source: 'meeting',
      locked: true,
      label: `${action.mentionedDateLabel} (from meeting)`,
    };
  }
  if (!topSuggestion) return undefined;
  // AI: start + 2 day buffer
  const d = new Date(topSuggestion.date);
  d.setDate(d.getDate() + 2);
  const iso = d.toISOString().slice(0, 10);
  return {
    date: iso,
    source: 'ai',
    locked: false,
    label: `${formatDateLabel(iso)} (AI suggested)`,
  };
}

// ---- People pick resolver ------------------------------------------------

export function resolvePeoplePicks(
  action: BriefAction,
  members: MentionedSupportMember[],
): PersonPick[] {
  const text = action.text.toLowerCase();
  const picks: PersonPick[] = [];
  for (const m of members) {
    const nameParts = m.name.toLowerCase().split(/\s+/);
    const mentioned = nameParts.some(p => p.length > 2 && text.includes(p));
    if (mentioned) {
      picks.push({
        memberId: m.id,
        name: m.name,
        email: m.email,
        role: m.hasCalendarPermission ? 'invite' : (m.hasActionsPermission ? 'watch' : 'none'),
        pre: 'mentioned',
        canInvite: m.hasCalendarPermission,
        canWatch: m.hasActionsPermission,
      });
    }
  }
  return picks;
}

// ---- Main enrichment -----------------------------------------------------

export async function enrichWithSchedulingSuggestions(
  actions: BriefAction[],
  rawTranscript: string,
): Promise<{ actions: BriefAction[]; supportMembers: MentionedSupportMember[] }> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return { actions, supportMembers: [] };

  const supportMembers = await loadSupportMembers(userId);

  const enriched = await Promise.all(
    actions.map(async (a) => {
      const haystack = `${a.text} ${a.due || ''} ${a.sourceQuote || ''}`;
      const mention = hasDateMention(haystack);
      const next: BriefAction = {
        ...a,
        dateMentionedInMeeting: mention.matched,
        mentionedDateLabel: mention.label,
      };

      // Generate suggestions only when no explicit date
      if (!mention.matched) {
        try {
          const raw = await smartScheduler.generateSmartSuggestions(
            {
              id: a.id,
              action_text: a.text,
              priority_level: a.priority,
            } as any,
            userId,
            [],
          );
          next.suggestions = raw.slice(0, 3).map((s, i) => ({
            id: `${a.id}-s${i}`,
            date: s.date,
            time: s.time,
            confidence: s.confidence,
            reason: shortReason(s.reason),
            energyMatch: s.energyMatch,
            conflictLevel: s.conflictLevel,
            isRecommended: i === 0,
          }));
        } catch {
          next.suggestions = [];
        }
      } else {
        next.suggestions = [];
      }

      next.dueDate = resolveDueDate(next, next.suggestions?.[0]);
      next.people = resolvePeoplePicks(next, supportMembers);
      return next;
    }),
  );

  return { actions: enriched, supportMembers };
}

// ---- Helpers -------------------------------------------------------------

function shortReason(r: string): string {
  // Trim emojis + trailing exclamations, keep one sentence
  return r.replace(/[!🔥🌅📈⚡🎯💜☀️🌙🚀]/g, '').replace(/\s+/g, ' ').trim();
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateLabel(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return iso;
  }
}

export function validatePostpone(newStartISO: string, dueISO?: string): { ok: boolean; warning?: string } {
  if (!dueISO) return { ok: true };
  if (new Date(newStartISO) > new Date(dueISO)) {
    return {
      ok: false,
      warning: 'This pushes past your deadline — extend Due or pick a sooner Start.',
    };
  }
  return { ok: true };
}
