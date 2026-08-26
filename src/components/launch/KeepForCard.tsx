import { Check, HardDrive } from "lucide-react";
import { toast } from "sonner";
import { LaunchCard } from "@/components/launch/LaunchCard";
import { cn } from "@/lib/utils";
import { usePrivacyMode, type PrivacyMode } from "@/hooks/usePrivacyMode";

/**
 * "How long shall I keep this?" — the person's retention preference.
 * Deliberately framed as a helpful choice, not a legal barrier.
 */
export function KeepForCard() {
  const { mode, options, loading, saving, updateMode } = usePrivacyMode();

  const handleSelect = async (next: PrivacyMode) => {
    if (next === mode || saving) return;
    const ok = await updateMode(next);
    toast[ok ? "success" : "error"](
      ok ? "Saved. New recordings will follow this." : "Couldn't save that"
    );
  };

  return (
    <LaunchCard className="bg-launch-ivory border-launch-gold/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <HardDrive className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">How long I keep things</h3>
          <p className="text-xs text-gray-500">
            Your summary and reference codes always stay
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const selected = option.value === mode;
          return (
            <button
              key={option.value}
              type="button"
              disabled={loading || saving}
              onClick={() => handleSelect(option.value)}
              aria-pressed={selected}
              className={cn(
                "w-full min-h-[56px] rounded-xl border p-4 text-left transition-all",
                "disabled:opacity-60",
                selected
                  ? "border-launch-gold bg-white shadow-sm"
                  : "border-border/60 bg-white/50 hover:border-launch-gold/50"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{option.title}</p>
                  <p className="text-sm text-gray-600">{option.blurb}</p>
                  <p className="text-xs text-gray-500">{option.retentionLine}</p>
                </div>
                {selected && (
                  <Check
                    className="h-5 w-5 shrink-0 text-launch-gold"
                    aria-hidden
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        You can change this at any time. Nothing is removed without your summary
        and reference staying behind, so your calendar always makes sense.
      </p>
    </LaunchCard>
  );
}

export default KeepForCard;
