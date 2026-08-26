import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type PrivacyMode = "light_touch" | "balanced" | "full_record";

export interface PrivacyModeOption {
  value: PrivacyMode;
  title: string;
  blurb: string;
  audioDays: number;
  transcriptDays: number;
  retentionLine: string;
}

export const PRIVACY_MODES: PrivacyModeOption[] = [
  {
    value: "light_touch",
    title: "Light touch",
    blurb: "Keep my steps. Let the recording go straight away.",
    audioDays: 0,
    transcriptDays: 7,
    retentionLine: "Audio removed after processing · write-up kept 7 days",
  },
  {
    value: "balanced",
    title: "Balanced",
    blurb: "Keep everything for a month, then tidy it up for me.",
    audioDays: 30,
    transcriptDays: 30,
    retentionLine: "Audio and write-up kept 30 days",
  },
  {
    value: "full_record",
    title: "Full record",
    blurb: "Keep the full record for a year. I may need to look back.",
    audioDays: 365,
    transcriptDays: 365,
    retentionLine: "Audio and write-up kept 12 months",
  },
];

export function privacyModeOption(mode: PrivacyMode | null | undefined) {
  return PRIVACY_MODES.find((m) => m.value === mode) ?? PRIVACY_MODES[1];
}

export function usePrivacyMode() {
  const { user } = useAuth();
  const [mode, setMode] = useState<PrivacyMode>("balanced");
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
        .from("profiles")
        .select("privacy_mode")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelled) {
        const value = (data as { privacy_mode?: PrivacyMode } | null)
          ?.privacy_mode;
        if (value) setMode(value);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const updateMode = useCallback(
    async (next: PrivacyMode) => {
      if (!user?.id) return false;
      setSaving(true);
      const previous = mode;
      setMode(next);

      const { error } = await supabase
        .from("profiles")
        .update({ privacy_mode: next } as never)
        .eq("id", user.id);

      setSaving(false);
      if (error) {
        setMode(previous);
        return false;
      }
      return true;
    },
    [mode, user?.id]
  );

  return {
    mode,
    option: privacyModeOption(mode),
    options: PRIVACY_MODES,
    loading,
    saving,
    updateMode,
  };
}
