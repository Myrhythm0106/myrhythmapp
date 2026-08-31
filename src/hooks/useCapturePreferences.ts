import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * "Help me remember to capture" — three choices, no more.
 *
 * Kept on the person's schedule preferences row so the same help follows them
 * to any device they sign in on.
 */
export interface CapturePreferences {
  /** Ask me when a meeting starts */
  capturePromptEnabled: boolean;
  /** Finish on its own after quiet time */
  autoFinishEnabled: boolean;
  /** 5 / 10 / 20 minutes of quiet before it wraps up */
  quietFinishMinutes: number;
  /** Let my Support Circle start a capture for me */
  companionCaptureEnabled: boolean;
}

export const CAPTURE_DEFAULTS: CapturePreferences = {
  capturePromptEnabled: true,
  autoFinishEnabled: true,
  quietFinishMinutes: 10,
  companionCaptureEnabled: false,
};

export const QUIET_FINISH_CHOICES = [5, 10, 20] as const;

const LOCAL_KEY = 'myrhythm:capture-prefs:v1';

function readLocal(): CapturePreferences {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return CAPTURE_DEFAULTS;
    return { ...CAPTURE_DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return CAPTURE_DEFAULTS;
  }
}

function writeLocal(prefs: CapturePreferences) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(prefs));
  } catch {
    /* noop */
  }
}

export function useCapturePreferences() {
  const { user } = useAuth();
  // Hydrate instantly from the last known answer so nothing flickers.
  const [prefs, setPrefs] = useState<CapturePreferences>(() => readLocal());
  const [rowId, setRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from('user_schedule_preferences')
        .select(
          'id, capture_prompt_enabled, auto_finish_enabled, quiet_finish_minutes, companion_capture_enabled',
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;
      if (data) {
        setRowId(data.id);
        const next: CapturePreferences = {
          capturePromptEnabled: data.capture_prompt_enabled ?? CAPTURE_DEFAULTS.capturePromptEnabled,
          autoFinishEnabled: data.auto_finish_enabled ?? CAPTURE_DEFAULTS.autoFinishEnabled,
          quietFinishMinutes: data.quiet_finish_minutes ?? CAPTURE_DEFAULTS.quietFinishMinutes,
          companionCaptureEnabled:
            data.companion_capture_enabled ?? CAPTURE_DEFAULTS.companionCaptureEnabled,
        };
        setPrefs(next);
        writeLocal(next);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const update = useCallback(
    async (patch: Partial<CapturePreferences>): Promise<boolean> => {
      const previous = prefs;
      const next = { ...prefs, ...patch };
      setPrefs(next);
      writeLocal(next);

      if (!user?.id) return true;
      setSaving(true);

      const payload = {
        capture_prompt_enabled: next.capturePromptEnabled,
        auto_finish_enabled: next.autoFinishEnabled,
        quiet_finish_minutes: next.quietFinishMinutes,
        companion_capture_enabled: next.companionCaptureEnabled,
      };

      let error = null;
      if (rowId) {
        ({ error } = await supabase
          .from('user_schedule_preferences')
          .update(payload)
          .eq('id', rowId));
      } else {
        const { data, error: insertError } = await supabase
          .from('user_schedule_preferences')
          .insert({ user_id: user.id, preference_type: 'general', ...payload })
          .select('id')
          .single();
        error = insertError;
        if (data) setRowId(data.id);
      }

      setSaving(false);
      if (error) {
        console.warn('useCapturePreferences: could not save', error);
        setPrefs(previous);
        writeLocal(previous);
        return false;
      }
      return true;
    },
    [prefs, rowId, user?.id],
  );

  return { prefs, loading, saving, update };
}
