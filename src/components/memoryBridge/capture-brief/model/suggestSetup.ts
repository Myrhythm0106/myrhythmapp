import { supabase } from '@/integrations/supabase/client';

export interface SetupSuggestion {
  id: string;
  field: 'title' | 'participant' | 'context';
  value: string;
  reason: string;
}

function withinHours(dateStr: string, timeStr: string | null, hours: number): boolean {
  const now = new Date();
  const target = new Date(dateStr);
  if (timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    target.setHours(h, m, 0, 0);
  } else {
    target.setHours(0, 0, 0, 0);
  }
  const diffMs = target.getTime() - now.getTime();
  return diffMs >= 0 && diffMs <= hours * 60 * 60 * 1000;
}

export async function loadSetupSuggestions(userId: string): Promise<SetupSuggestion[]> {
  const suggestions: SetupSuggestion[] = [];

  try {
    // 1. Upcoming calendar events in the next 2 hours
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    const { data: externalEvents } = await supabase
      .from('external_calendar_events')
      .select('title, description, date, time, location')
      .eq('user_id', userId)
      .gte('date', now.slice(0, 10))
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .limit(10);

    const upcomingExternal = (externalEvents || []).filter(e => withinHours(e.date, e.time, 2));
    for (const e of upcomingExternal.slice(0, 2)) {
      if (e.title) {
        suggestions.push({
          id: `cal-title-${e.title}`,
          field: 'title',
          value: e.title,
          reason: 'From your calendar',
        });
      }
      if (e.location) {
        suggestions.push({
          id: `cal-loc-${e.location}`,
          field: 'context',
          value: `Location: ${e.location}`,
          reason: 'From your calendar',
        });
      }
    }

    const { data: localEvents } = await supabase
      .from('calendar_events')
      .select('title, description, date, time, category')
      .eq('user_id', userId)
      .gte('date', now.slice(0, 10))
      .order('date', { ascending: true })
      .limit(10);

    const upcomingLocal = (localEvents || []).filter(e => withinHours(e.date, e.time, 2));
    for (const e of upcomingLocal.slice(0, 2)) {
      if (e.title) {
        suggestions.push({
          id: `local-title-${e.title}`,
          field: 'title',
          value: e.title,
          reason: 'From your calendar',
        });
      }
      if (e.description) {
        suggestions.push({
          id: `local-ctx-${e.description}`,
          field: 'context',
          value: e.description.slice(0, 120),
          reason: 'From your calendar',
        });
      }
    }

    // 2. Recent recording titles (avoid duplicates)
    const { data: recentMeetings } = await supabase
      .from('meeting_recordings')
      .select('meeting_title')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const seenTitles = new Set(suggestions.filter(s => s.field === 'title').map(s => s.value.toLowerCase()));
    for (const m of recentMeetings || []) {
      const title = m.meeting_title;
      if (!title || seenTitles.has(title.toLowerCase())) continue;
      seenTitles.add(title.toLowerCase());
      suggestions.push({
        id: `recent-${title}`,
        field: 'title',
        value: title,
        reason: 'Recent capture',
      });
    }

    // 3. Support circle members as participants
    const { data: supportMembers } = await supabase
      .from('support_circle_members')
      .select('member_name, relationship')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);

    for (const m of supportMembers || []) {
      if (m.member_name) {
        suggestions.push({
          id: `support-${m.member_name}`,
          field: 'participant',
          value: m.relationship ? `${m.member_name} · ${m.relationship}` : m.member_name,
          reason: 'Support Circle',
        });
      }
    }
  } catch (err) {
    console.error('Failed to load setup suggestions:', err);
  }

  return suggestions;
}
