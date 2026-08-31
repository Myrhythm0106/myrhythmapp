import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
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
import { usePrivacyMode, type PrivacyMode } from "@/hooks/usePrivacyMode";

interface KeepForPromptProps {
  open: boolean;
  /** Called with the chosen mode after the choice has been saved. */
  onConfirm: (mode: PrivacyMode) => void;
  /** Optional escape hatch — treated as "keep the current default". */
  onDismiss?: () => void;
}

/**
 * "How long shall I keep this?" — asked once, after the person stops their
 * first recording and before anything is saved, so the very first capture
 * carries the retention clock they actually chose.
 */
export function KeepForPrompt({ open, onConfirm, onDismiss }: KeepForPromptProps) {
  const { mode, options, saving } = usePrivacyMode();
  const [choice, setChoice] = useState<PrivacyMode | null>(null);

  const effectiveChoice = choice ?? mode;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onDismiss?.();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal-100">
            <ShieldCheck className="h-6 w-6 text-brand-teal-700" aria-hidden />
          </div>
          <DialogTitle className="text-center">
            How long shall I keep this?
          </DialogTitle>
          <DialogDescription className="text-center">
            Lovely — that's recorded. Before I save it, choose what happens to
            the audio afterwards. Your summary and reference codes always stay.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {options.map((option) => {
            const selected = option.value === effectiveChoice;
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
            onClick={() => onConfirm(effectiveChoice)}
            disabled={saving}
            className="w-full min-h-[56px]"
          >
            That's my choice — save it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default KeepForPrompt;
