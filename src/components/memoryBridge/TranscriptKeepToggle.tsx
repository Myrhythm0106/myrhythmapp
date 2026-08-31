import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranscriptKeepToggleProps {
  recordingId: string;
  keepTranscript: boolean;
  onChanged?: () => void;
}

/**
 * Lets the owner keep the full transcript indefinitely — the same way
 * their Next Steps and summary are always kept. When off, the transcript
 * follows the normal write-up retention clock.
 */
export function TranscriptKeepToggle({
  recordingId,
  keepTranscript,
  onChanged,
}: TranscriptKeepToggleProps) {
  const [saving, setSaving] = useState(false);

  const toggle = async (next: boolean) => {
    setSaving(true);
    const { error } = await supabase
      .from("voice_recordings")
      .update({ keep_transcript: next } as never)
      .eq("id", recordingId);
    setSaving(false);

    if (error) {
      toast.error("Couldn't update that. Please try again.");
      return;
    }
    toast.success(
      next
        ? "Full transcript kept — it stays like your Next Steps."
        : "Transcript will follow your usual keep-for setting."
    );
    onChanged?.();
  };

  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
      <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <label
        htmlFor={`keep-transcript-${recordingId}`}
        className="cursor-pointer select-none"
      >
        Keep the full transcript, like my Next Steps
      </label>
      <Switch
        id={`keep-transcript-${recordingId}`}
        checked={keepTranscript}
        disabled={saving}
        onCheckedChange={toggle}
        aria-label="Keep the full transcript"
        className="scale-90"
      />
    </div>
  );
}
