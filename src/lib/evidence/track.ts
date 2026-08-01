/**
 * Evidence layer — two separate streams, on purpose.
 *
 * 1. `trackSurface`  → public.analytics_events (identified, founder-only reads)
 *    Used to decide Keep / Fix / Cut on features.
 *
 * 2. `logResearch`   → public.research_events via a security-definer RPC
 *    De-identified. Only writes when the person has switched research
 *    contribution on. Shape and rhythm travel; words never do.
 *
 * See docs/research-data-charter.md and docs/evidence-decision-system.md.
 */
import { supabase } from '@/integrations/supabase/client';

/** Canonical surface names. Keep this list short and stable. */
export const SURFACES = {
  capture: 'capture',
  commit: 'commit',
  calibrate: 'calibrate',
  celebrate: 'celebrate',
  memoryBridge: 'memory_bridge',
  calendar: 'calendar',
  supportCircle: 'support_circle',
  documentImport: 'document_import',
  planning: 'planning',
  assessment: 'assessment',
  payment: 'payment',
} as const;

export type Surface = (typeof SURFACES)[keyof typeof SURFACES];

function sessionId(): string {
  try {
    let id = sessionStorage.getItem('session_id');
    if (!id) {
      id = `session_${Date.now()}`;
      sessionStorage.setItem('session_id', id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

/**
 * Record a product-usage event. Never throws, never blocks the UI.
 * `data` must contain no free text the person wrote — counts and enums only.
 */
export async function trackSurface(
  surface: Surface,
  action: string,
  data: Record<string, string | number | boolean> = {}
): Promise<void> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    await supabase.from('analytics_events').insert({
      user_id: auth?.user?.id ?? null,
      event_type: `${surface}.${action}`,
      event_data: { surface, action, ...data },
      page_url: window.location.pathname,
      user_agent: navigator.userAgent,
      session_id: sessionId(),
    });
  } catch (err) {
    // Analytics must never break a user flow.
    console.debug('trackSurface skipped', err);
  }
}

export type ResearchBands = {
  personaBand?: string | null;
  stageBand?: string | null;
  ageBand?: string | null;
  monthsSinceEventBand?: string | null;
};

/**
 * Contribute one de-identified data point. The database refuses the write
 * unless the person's consent row says `granted = true`, so this is safe to
 * call unconditionally.
 */
export async function logResearch(
  metric: string,
  value: number | null = 1,
  bands: ResearchBands = {}
): Promise<void> {
  try {
    await supabase.rpc('log_research_event', {
      _metric: metric,
      _metric_value: value,
      _persona_band: bands.personaBand ?? null,
      _stage_band: bands.stageBand ?? null,
      _age_band: bands.ageBand ?? null,
      _months_since_event_band: bands.monthsSinceEventBand ?? null,
    });
  } catch (err) {
    console.debug('logResearch skipped', err);
  }
}

/** Coarse banding helpers — never store the raw number. */
export function ageBand(age?: number | null): string | null {
  if (age == null) return null;
  if (age < 25) return 'under-25';
  if (age < 40) return '25-39';
  if (age < 55) return '40-54';
  if (age < 70) return '55-69';
  return '70-plus';
}

export function monthsSinceEventBand(months?: number | null): string | null {
  if (months == null) return null;
  if (months < 3) return '0-3m';
  if (months < 12) return '3-12m';
  if (months < 36) return '1-3y';
  if (months < 120) return '3-10y';
  return '10y-plus';
}

/** Both streams at once — the common case for a core-surface action. */
export async function recordAction(
  surface: Surface,
  action: string,
  opts: { data?: Record<string, string | number | boolean>; bands?: ResearchBands; value?: number } = {}
): Promise<void> {
  await Promise.all([
    trackSurface(surface, action, opts.data),
    logResearch(`${surface}.${action}`, opts.value ?? 1, opts.bands ?? {}),
  ]);
}
