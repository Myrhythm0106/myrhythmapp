import { useMemo, useState } from "react";
import { Download, ShieldCheck, TimerReset, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioCountdownLineProps {
  recordingId: string;
  filePath: string;
  audioExpiresAt: string | null;
  audioDeletedAt: string | null;
  legalHold?: boolean;
  getUrl: () => Promise<string | null>;
  onChanged?: () => void;
}

function daysLeft(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    )
  );
}

/**
 * The audio countdown line on a capture card — "Audio goes in 3 days",
 * counting down to "today", with Download / Keep it longer / Remove now.
 * Once the audio is gone the write-up, steps and reference stay, and the
 * card confirms the removal date.
 */
export function AudioCountdownLine({
  recordingId,
  filePath,
  audioExpiresAt,
  audioDeletedAt,
  legalHold,
  getUrl,
  onChanged,
}: AudioCountdownLineProps) {
  const [busy, setBusy] = useState(false);

  const state = useMemo(() => {
    if (audioDeletedAt) return { kind: "removed" as const };
    if (!audioExpiresAt) return null;
    const left = daysLeft(audioExpiresAt);
    return { kind: left <= 0 ? ("today" as const) : ("counting" as const), left };
  }, [audioExpiresAt, audioDeletedAt]);

  if (!state || legalHold) return null;

  const download = async () => {
    setBusy(true);
    try {
      const url = await getUrl();
      if (!url) throw new Error("no-url");
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() ?? "recording";
      a.click();
      toast.success("Audio downloading — it's yours to keep.");
    } catch {
      toast.error("Couldn't download the audio just now.");
    } finally {
      setBusy(false);
    }
  };

  const keepLonger = async () => {
    setBusy(true);
    const next = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase
      .from("voice_recordings")
      .update({ audio_expires_at: next } as never)
      .eq("id", recordingId);
    setBusy(false);
    if (error) {
      toast.error("Couldn't keep it longer — please try again.");
      return;
    }
    toast.success("Kept for 7 more days.");
    onChanged?.();
  };

  const removeNow = async () => {
    setBusy(true);
    const { error: storageError } = await supabase.storage
      .from("voice-recordings")
      .remove([filePath]);
    const { error } = await supabase
      .from("voice_recordings")
      .update({ audio_deleted_at: new Date().toISOString() } as never)
      .eq("id", recordingId);
    setBusy(false);
    if (error || storageError) {
      toast.error("Couldn't remove the audio — please try again.");
      return;
    }
    toast.success("Audio removed. Your write-up, steps and reference stay.");
    onChanged?.();
  };

  if (state.kind === "removed") {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-brand-teal-600" aria-hidden />
        Audio removed on {new Date(audioDeletedAt!).toLocaleDateString()} —
        write-up, steps and reference kept.
      </p>
    );
  }

  const label =
    state.kind === "today"
      ? "Audio goes today"
      : `Audio goes in ${state.left} ${state.left === 1 ? "day" : "days"}`;

  return (
    <div
      className={cn(
        "mt-2 flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2",
        state.left !== undefined && state.left <= 1
          ? "border-amber-300 bg-amber-50/70"
          : "border-border/50 bg-muted/30"
      )}
    >
      <p className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
        <TimerReset className="h-3.5 w-3.5 text-brand-teal-600" aria-hidden />
        {label} — write-up, steps and reference stay.
      </p>
      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={download}
          className="h-8 px-2 text-xs"
        >
          <Download className="h-3 w-3 mr-1" aria-hidden />
          Download
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={keepLonger}
          className="h-8 px-2 text-xs"
        >
          Keep it longer
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={removeNow}
          className="h-8 px-2 text-xs text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1" aria-hidden />
          Remove now
        </Button>
      </div>
    </div>
  );
}

export default AudioCountdownLine;
