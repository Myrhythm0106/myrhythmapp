import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type SourceState = "available" | "downloaded" | "retired";

interface SourceRefLineProps {
  referenceCode: string;
  /** Capture this item came from — used to navigate back. */
  recordingId?: string | null;
  state?: SourceState;
  className?: string;
  /** Compact form for dense table rows and calendar chips. */
  compact?: boolean;
}

const STATE_META: Record<
  SourceState,
  { dot: string; label: string; hint: string }
> = {
  available: {
    dot: "bg-teal-500",
    label: "Source available",
    hint: "The original write-up is still here. Tap to open it.",
  },
  downloaded: {
    dot: "bg-amber-500",
    label: "Saved by me",
    hint: "You downloaded this source, so the copy here has been tidied away. The reference stays.",
  },
  retired: {
    dot: "bg-muted-foreground/50",
    label: "Source retired",
    hint: "The recording and write-up have passed their keep-for period. The summary and reference stay.",
  },
};

/**
 * The one place a traceability reference is rendered.
 * Used on calendar events, Next Step rows and capture headers.
 */
export function SourceRefLine({
  referenceCode,
  recordingId,
  state = "available",
  className,
  compact = false,
}: SourceRefLineProps) {
  const navigate = useNavigate();
  const meta = STATE_META[state];
  const canOpen = state === "available" && !!recordingId;

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2 py-0.5 font-mono tracking-tight text-muted-foreground",
        compact ? "text-[10px]" : "text-xs",
        canOpen && "hover:border-primary/50 hover:text-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)}
      />
      {referenceCode}
    </span>
  );

  const wrapped = canOpen ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/launch/memory-bridge?capture=${recordingId}`);
      }}
      className="min-h-[24px] transition-colors"
      aria-label={`Open the source for ${referenceCode}`}
    >
      {content}
    </button>
  ) : (
    <span aria-label={`${referenceCode} — ${meta.label}`}>{content}</span>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{wrapped}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px] text-xs">
          <p className="font-medium">{meta.label}</p>
          <p className="text-muted-foreground">{meta.hint}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SourceRefLine;
