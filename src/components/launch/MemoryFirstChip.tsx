import React, { useState } from 'react';
import { MEMORY_FIRST_DESIGN_EXPLAINER } from '@/config/appDescription';

/**
 * Memory-First Design™ signature chip.
 * See mem://brand/memory-first-design.
 *
 * Appears near the logo on /launch/welcome only. Not a functional label —
 * this is a brand signature. Tap/hover reveals the short explainer.
 */
export function MemoryFirstChip() {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        aria-label="Memory-First Design — what this means"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-teal-200/70 bg-teal-50/60 text-[10px] tracking-[0.14em] uppercase font-medium text-teal-800 hover:bg-teal-50 transition-colors min-h-[28px]"
      >
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-teal-500"
        />
        Memory-First Design
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute top-full left-0 mt-2 z-30 w-72 p-3 rounded-md border border-stone-200 bg-white shadow-lg text-[11px] leading-relaxed text-stone-600 normal-case tracking-normal font-normal"
        >
          {MEMORY_FIRST_DESIGN_EXPLAINER}
        </span>
      )}
    </span>
  );
}
