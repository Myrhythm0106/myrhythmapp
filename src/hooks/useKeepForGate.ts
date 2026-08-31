import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  privacyModeOption,
  usePrivacyMode,
  type PrivacyMode,
} from "@/hooks/usePrivacyMode";

const CONSENT_TEXT =
  "I've chosen how long MyRhythm keeps my recordings and write-ups. My summary and reference codes stay either way.";

/**
 * Gates the very first recording save behind the keep-for choice.
 * `needsChoice()` is true only when the person has never confirmed a mode;
 * `confirmChoice()` writes the profile mode and consent row BEFORE the caller
 * saves the recording, so the retention trigger stamps the chosen clock.
 */
export function useKeepForGate() {
  const { user } = useAuth();
  const { updateMode } = usePrivacyMode();
  const decidedRef = useRef<boolean | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const needsChoice = useCallback(async () => {
    if (!user?.id) return false;
    if (decidedRef.current !== null) return !decidedRef.current;
    const { count } = await supabase
      .from("recording_consent")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    const has = (count ?? 0) > 0;
    decidedRef.current = has;
    return !has;
  }, [user?.id]);

  const confirmChoice = useCallback(
    async (choice: PrivacyMode) => {
      if (!user?.id) return false;
      setConfirming(true);
      const option = privacyModeOption(choice);

      const ok = await updateMode(choice);
      const { error } = await supabase.from("recording_consent").insert({
        user_id: user.id,
        privacy_mode: choice,
        audio_retention_days: option.audioDays,
        transcript_retention_days: option.transcriptDays,
        consent_text: CONSENT_TEXT,
      } as never);

      setConfirming(false);
      if (ok && !error) {
        decidedRef.current = true;
        setAskOpen(false);
        return true;
      }
      return false;
    },
    [user?.id, updateMode]
  );

  const dismiss = useCallback(() => {
    // Closing without choosing keeps the current default; we don't record
    // consent, so they're asked again next time — nothing is silently locked in.
    setAskOpen(false);
  }, []);

  return {
    askOpen,
    openAsk: () => setAskOpen(true),
    needsChoice,
    confirmChoice,
    confirming,
    dismiss,
  };
}

export default useKeepForGate;
