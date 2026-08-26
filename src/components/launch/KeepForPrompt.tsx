import { useEffect, useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePrivacyMode, type PrivacyMode } from "@/hooks/usePrivacyMode";

const CONSENT_TEXT =
  "I've chosen how long MyRhythm keeps my recordings and write-ups. My summary and reference codes stay either way.";

/**
 * Asked once, after the first capture — never during onboarding.
 * A helpful preference, not a legal gate.
 */
export function KeepForPrompt({ hasCaptures }: { hasCaptures: boolean }) {
  const { user } = useAuth();
  const { mode, options, updateMode, saving } = usePrivacyMode();
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<PrivacyMode>("balanced");

  useEffect(() => {
    setChoice(mode);
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id || !hasCaptures) return;

    (async () => {
      const { count } = await supabase
        .from("recording_consent")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (!cancelled && !count) setOpen(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, hasCaptures]);

  const confirm = async () => {
    if (!user?.id) return;
    const option = options.find((o) => o.value === choice)!;

    const ok = await updateMode(choice);
    const { error } = await supabase.from("recording_consent").insert({
      user_id: user.id,
      privacy_mode: choice,
      audio_retention_days: option.audioDays,
      transcript_retention_days: option.transcriptDays,
      consent_text: CONSENT_TEXT,
    } as never);

    if (ok && !error) {
      setOpen(false);
      toast.success("Saved. You can change this any time in Settings.");
    } else {
      toast.error("Couldn't save that — please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal-100">
            <ShieldCheck className="h-6 w-6 text-brand-teal-700" aria-hidden />
          </div>
          <DialogTitle className="text-center">
            How long shall I keep this?
          </DialogTitle>
          <DialogDescription className="text-center">
            Your first capture is saved. Choose what happens to the recording
            afterwards — your summary and reference codes always stay.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {options.map((option) => {
            const selected = option.value === choice;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setChoice(option.value)}
                aria-pressed={selected}
                className={cn(
                  "w-full min-h-[56px] rounded-xl border p-4 text-left transition-all",
                  selected
                    ? "border-brand-teal-500 bg-brand-teal-50/60"
                    : "border-border/60 hover:border-brand-teal-300"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-medium">{option.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {option.blurb}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {option.retentionLine}
                    </p>
                  </div>
                  {selected && (
                    <Check
                      className="h-5 w-5 shrink-0 text-brand-teal-600"
                      aria-hidden
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            onClick={confirm}
            disabled={saving}
            className="w-full min-h-[56px]"
          >
            That's my choice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default KeepForPrompt;
