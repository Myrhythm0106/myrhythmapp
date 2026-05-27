import React, { useState } from 'react';
import { Trash2, ChevronUp, ChevronDown, Clock } from 'lucide-react';

export interface QueuedCapture {
  id: string;
  durationSec: number;
  queuedAt: number;
}

interface Props {
  items: QueuedCapture[];
  onRemove: (id: string) => void;
}

function fmtAge(ts: number) {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function QueuedDrawer({ items, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-30 w-[calc(100%-2rem)] max-w-md">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-amber-50 border border-amber-200 rounded-full px-4 py-2.5 flex items-center justify-between text-sm text-amber-800 shadow-sm min-h-[44px]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {items.length} queued — will sync
        </span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
      {open && (
        <div className="mt-2 bg-white border border-stone-200 rounded-2xl shadow-lg max-h-64 overflow-y-auto divide-y divide-stone-100">
          {items.map((q) => (
            <div key={q.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-stone-800 font-medium">
                  Capture · {q.durationSec}s
                </p>
                <p className="text-xs text-stone-500">{fmtAge(q.queuedAt)}</p>
              </div>
              <button
                onClick={() => onRemove(q.id)}
                className="text-stone-400 hover:text-rose-600 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Remove queued capture"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
