import React, { useState } from 'react';
import { Shield, X, UserCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface ProvenanceData {
  senderName: string;
  sentAt: string; // ISO or pretty string
  permission: string; // e.g. "Voice capture on your behalf"
  onRevoke?: () => void;
}

/**
 * "Why am I seeing this?" provenance chip.
 * Attaches to every Support Circle-originated capture so the user can
 * see who sent it, when, which permission allowed it, and revoke instantly.
 *
 * Competitive moat: no capture/notes app does this. It is the trust artefact
 * clinicians and regulators look for.
 */
export function ProvenanceChip({ senderName, sentAt, permission, onRevoke }: ProvenanceData) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-200 text-[11px] font-medium text-brand-teal-700 hover:bg-brand-teal-100 transition-colors"
          aria-label="Why am I seeing this?"
        >
          <Shield className="h-3 w-3" />
          From {senderName.split(' ')[0]}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 overflow-hidden" align="start">
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <UserCircle2 className="h-4 w-4 text-brand-teal-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-brain-health-700 leading-relaxed">
              <span className="font-semibold text-brain-health-900">{senderName}</span> sent this on{' '}
              <span className="font-medium">{sentAt}</span>.
            </div>
          </div>
          <div className="text-xs text-brain-health-600 bg-brain-health-50 rounded-lg p-2.5">
            <span className="font-medium text-brain-health-800">Allowed by:</span> {permission}
          </div>
          <div className="text-[10px] text-brain-health-500 italic">
            MyRhythm does not diagnose or treat. Captures are reviewed and accepted by you.
          </div>
        </div>
        {onRevoke && (
          <div className="border-t border-brain-health-100 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-clarity-teal-700 hover:bg-clarity-teal-50"
              onClick={() => {
                onRevoke();
                setOpen(false);
              }}
            >
              <X className="h-3 w-3 mr-1.5" />
              Revoke this permission
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
