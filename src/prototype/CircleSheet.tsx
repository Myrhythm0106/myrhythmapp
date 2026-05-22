import React, { useState } from 'react';
import { X, Plus, Trash2, Users } from 'lucide-react';
import {
  loadCircle, addMember, removeMember,
  RELATIONSHIP_LABEL, ROLE_LABEL,
  type PrototypeCircleMember, type CircleRelationship, type CircleRole,
} from './prototypeSupportCircle';

interface Props { open: boolean; onClose: () => void; onChange?: () => void; }

const RELATIONSHIPS: CircleRelationship[] = ['partner', 'family', 'friend', 'clinician', 'caregiver', 'other'];
const ROLES: CircleRole[] = ['cheerleader', 'accountability', 'logistics', 'clinical'];

export function CircleSheet({ open, onClose, onChange }: Props) {
  const [members, setMembers] = useState<PrototypeCircleMember[]>(() => loadCircle());
  const [name, setName] = useState('');
  const [rel, setRel] = useState<CircleRelationship>('family');
  const [role, setRole] = useState<CircleRole>('cheerleader');
  const [notify, setNotify] = useState(false);

  if (!open) return null;

  const refresh = () => { setMembers(loadCircle()); onChange?.(); };

  const handleAdd = () => {
    if (!name.trim()) return;
    addMember({ name: name.trim(), relationship: rel, role, notifyByDefault: notify });
    setName(''); setNotify(false);
    refresh();
  };
  const handleRemove = (id: string) => { removeMember(id); refresh(); };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <div className="font-semibold text-slate-900 text-sm">Your Support Circle</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
            Add the people standing with you. We'll suggest looping them in only when it helps —
            never automatic, never noisy.
          </p>

          <div className="space-y-2 mb-5">
            {members.length === 0 && (
              <div className="text-[13px] text-slate-400 italic text-center py-3 border border-dashed border-slate-200 rounded-lg">
                No one in your circle yet.
              </div>
            )}
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{m.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {RELATIONSHIP_LABEL[m.relationship]} · {ROLE_LABEL[m.role]}
                    {m.notifyByDefault && ' · auto-notify'}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(m.id)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
                  aria-label={`Remove ${m.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">Add someone</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (e.g., Sarah, Dr. Patel, Mum)"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm mb-2 bg-white"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                value={rel}
                onChange={(e) => setRel(e.target.value as CircleRelationship)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
              >
                {RELATIONSHIPS.map(r => <option key={r} value={r}>{RELATIONSHIP_LABEL[r]}</option>)}
              </select>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as CircleRole)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
              >
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-[12px] text-slate-600 mb-3">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
              Notify by default for high-priority actions
            </label>
            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="w-full min-h-[44px] rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add to circle
            </button>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 leading-relaxed text-center">
            Prototype only — no real invites are sent.
          </p>
        </div>
      </div>
    </div>
  );
}
