import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { loadCircle } from './prototypeSupportCircle';
import { CircleSheet } from './CircleSheet';

export function CircleChip() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const refresh = () => setCount(loadCircle().length);
  useEffect(() => { refresh(); }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Your Support Circle"
        className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 bg-white text-slate-600 flex items-center gap-1 transition"
      >
        <Users className="w-3 h-3" />
        circle {count > 0 && <span className="font-semibold text-slate-900">{count}</span>}
      </button>
      <CircleSheet open={open} onClose={() => { setOpen(false); refresh(); }} onChange={refresh} />
    </>
  );
}
