import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { clearAllDemo } from './prototypeDemoSeed';

export function DemoDataPill() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  const handleClear = () => {
    if (!confirm('Clear demo data and start fresh? You can re-seed by reloading any screen.')) return;
    clearAllDemo();
    window.location.reload();
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-3 px-3 py-2 rounded-full bg-amber-50 border border-amber-200 text-[12px] text-amber-900">
      <span className="inline-flex items-center gap-1.5">
        <Sparkles className="w-3 h-3" />
        Brain-injury sample loaded — explore freely
      </span>
      <button
        onClick={handleClear}
        className="text-[11px] font-medium underline hover:no-underline"
      >
        Clear & start fresh
      </button>
      <button
        onClick={() => setHidden(true)}
        className="w-5 h-5 rounded-full hover:bg-amber-100 flex items-center justify-center"
        aria-label="Hide"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
