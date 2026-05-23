import React, { useEffect, useState } from 'react';
import { Users, Plus, MessageSquare } from 'lucide-react';
import { loadCircle, initials, ROLE_LABEL, type PrototypeCircleMember } from './prototypeSupportCircle';
import { loadActs } from './prototypeStore';
import { CircleSheet } from './CircleSheet';

const ROLE_TONE: Record<string, string> = {
  cheerleader:    'bg-pink-100 text-pink-800',
  accountability: 'bg-amber-100 text-amber-800',
  logistics:      'bg-sky-100 text-sky-800',
  clinical:       'bg-emerald-100 text-emerald-800',
};

export function CircleRail() {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<PrototypeCircleMember[]>([]);
  const [sharedCount, setSharedCount] = useState(0);

  const refresh = () => {
    setMembers(loadCircle());
    const acts = loadActs();
    setSharedCount(acts.reduce((n, a) => n + ((a.attendees?.length || 0) > 0 ? 1 : 0), 0));
  };
  useEffect(() => { refresh(); }, []);

  return (
    <>
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 leading-tight">Your Support Circle</div>
              <div className="text-[11px] text-slate-500">
                {members.length} {members.length === 1 ? 'person' : 'people'} · {sharedCount} action{sharedCount === 1 ? '' : 's'} shared
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-900 text-slate-700 flex items-center gap-1 transition"
          >
            <Plus className="w-3 h-3" /> Add someone
          </button>
        </div>

        {members.length === 0 ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full text-[12px] text-slate-500 italic py-3 border border-dashed border-slate-200 rounded-lg hover:border-slate-300 transition"
          >
            No one in your circle yet — tap to add a partner, family, or clinician.
          </button>
        ) : (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {members.map(m => (
              <button
                key={m.id}
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-[11px] transition"
              >
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-semibold flex items-center justify-center">
                  {initials(m.name)}
                </span>
                <span className="font-medium text-slate-900">{m.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${ROLE_TONE[m.role] || 'bg-slate-100 text-slate-700'}`}>
                  {ROLE_LABEL[m.role]}
                </span>
              </button>
            ))}
          </div>
        )}

        {members.length > 0 && sharedCount > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" />
            Your circle gets a heads-up — only on the actions you share.
          </div>
        )}
      </div>
      <CircleSheet open={open} onClose={() => { setOpen(false); refresh(); }} onChange={refresh} />
    </>
  );
}
