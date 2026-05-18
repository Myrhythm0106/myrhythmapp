import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBadge } from '@/components/launch/chrome/IconBadge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { FivePrompt } from '@/data/fivePrompts';

interface Props {
  prompt: FivePrompt;
  value: string;
  onChange: (v: string) => void;
  /** Only used by the 5th F prompt — Future/Faith/Fulfilment/Purpose */
  label?: string;
  onLabelChange?: (label: string) => void;
}

const MAX = 280;

export function FivePromptCard({ prompt, value, onChange, label, onLabelChange }: Props) {
  const filled = value.trim().length > 0;
  const [open, setOpen] = useState(!filled);
  const [editingLabel, setEditingLabel] = useState(false);
  const displayLabel = label ?? prompt.label;

  return (
    <div className="rounded-2xl border border-brain-health-100 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-4 p-5 text-left min-h-[56px]"
      >
        <IconBadge icon={prompt.icon} tone={prompt.tone} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
              {displayLabel}
            </p>
            {prompt.labelOptions && onLabelChange && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setEditingLabel(true); }}
                className="text-[11px] text-brain-health-400 hover:text-brain-health-700 inline-flex items-center gap-1"
              >
                <Pencil className="h-3 w-3" strokeWidth={1.75} />
                rename
              </span>
            )}
          </div>
          <p className="mt-1 text-base font-medium text-brain-health-900 leading-snug">
            {prompt.question}
          </p>
          {filled && !open && (
            <p className="mt-2 text-sm text-brain-health-600 line-clamp-1">
              {value}
            </p>
          )}
        </div>
        <span className="text-brain-health-400 mt-1">
          {open ? <ChevronUp className="h-5 w-5" strokeWidth={1.75} /> : <ChevronDown className="h-5 w-5" strokeWidth={1.75} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 space-y-3">
              {editingLabel && prompt.labelOptions && onLabelChange && (
                <div className="flex flex-wrap gap-2">
                  {prompt.labelOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { onLabelChange(opt); setEditingLabel(false); }}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-full border transition-colors',
                        opt === displayLabel
                          ? 'border-brand-teal-600 bg-brand-teal-50 text-brand-teal-700'
                          : 'border-brain-health-200 text-brain-health-700 hover:border-brain-health-300'
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {prompt.sparks.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onChange(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-brain-health-200 text-brain-health-700 bg-brain-health-50/40 hover:bg-brain-health-50 hover:border-brain-health-300 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value.slice(0, MAX))}
                placeholder="Write a sentence or two — or tap a spark above and rewrite it in your own words."
                rows={3}
                className="resize-none text-base leading-relaxed border-brain-health-200 focus-visible:ring-brand-teal-600/30 focus-visible:border-brand-teal-600"
              />
              <div className="flex justify-between text-xs text-brain-health-500">
                <span>No required fields. Nothing scored.</span>
                <span>{value.length}/{MAX}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
