
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPlainText } from "@/utils/empoweringGlossary";
import { cn } from "@/lib/utils";

interface EmpoweringTermProps {
  /** The empowering term key from the glossary */
  term: string;
  /** Optional custom display text (defaults to the term itself) */
  children?: React.ReactNode;
  /** Optional custom plain text override */
  plainText?: string;
  /** Show the dotted underline indicator */
  showIndicator?: boolean;
  /** Additional className for styling */
  className?: string;
  /** Render as inline or block */
  as?: "span" | "div" | "p";
}

/**
 * EmpoweringTerm - Displays empowering language with plain-text tooltips
 * 
 * Hover (desktop) or tap (mobile) to see the SMART plain explanation.
 * This makes the app inclusive for everyone while keeping the empowering feel.
 */
export function EmpoweringTerm({
  term,
  children,
  plainText,
  showIndicator = true,
  className,
  as: Component = "span"
}: EmpoweringTermProps) {
  const explanation = plainText || getPlainText(term);
  
  // If no explanation found, just render the text without tooltip
  if (!explanation) {
    return <Component className={className}>{children || term}</Component>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Component
            className={cn(
              "cursor-help transition-colors",
              showIndicator && "border-b border-dotted border-muted-foreground/50 hover:border-primary",
              className
            )}
            tabIndex={0}
            role="term"
            aria-describedby={`tooltip-${term.replace(/\s+/g, '-')}`}
          >
            {children || term}
          </Component>
        </TooltipTrigger>
        <TooltipContent 
          id={`tooltip-${term.replace(/\s+/g, '-')}`}
          className="max-w-[250px] text-sm"
          sideOffset={5}
        >
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground">📝</span>
            <span>{explanation}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Quick helper for inline empowering status badges
 */
export function EmpoweringStatus({ 
  status, 
  className 
}: { 
  status: "done" | "doing" | "pending" | "not_started" | "on_hold" | "canceled";
  className?: string;
}) {
  const statusMap: Record<string, { term: string; display: string }> = {
    done: { term: "Victory Achieved", display: "Victory Achieved! 🎉" },
    doing: { term: "Building Momentum", display: "Building Momentum 🚀" },
    pending: { term: "Ready to Conquer", display: "Ready to Conquer" },
    not_started: { term: "On Your Radar", display: "On Your Radar" },
    on_hold: { term: "Paused for Now", display: "Paused for Now" },
    canceled: { term: "Paused for Now", display: "Canceled" }
  };

  const mapped = statusMap[status] || { term: status, display: status };

  return (
    <EmpoweringTerm term={mapped.term} className={className}>
      {mapped.display}
    </EmpoweringTerm>
  );
}

/**
 * Quick helper for priority labels
 */
export function EmpoweringPriority({ 
  level, 
  className 
}: { 
  level: 1 | 2 | 3;
  className?: string;
}) {
  const priorityMap: Record<number, { term: string; display: string }> = {
    1: { term: "Power Focus", display: "P1 - Power Focus" },
    2: { term: "Growth Zone", display: "P2 - Growth Zone" },
    3: { term: "Steady Progress", display: "P3 - Steady Progress" }
  };

  const mapped = priorityMap[level] || { term: `P${level}`, display: `P${level}` };

  return (
    <EmpoweringTerm term={mapped.term} className={className}>
      {mapped.display}
    </EmpoweringTerm>
  );
}
