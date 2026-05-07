import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { I_CHOOSE_STATEMENTS } from '@/data/iChooseStatements';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (s: string) => void;
  onUseTodays: () => void;
}

export function IChoosePickerSheet({ open, onClose, onPick, onUseTodays }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose your #IChoose for today</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end mb-2">
          <Button variant="ghost" size="sm" onClick={() => { onUseTodays(); onClose(); }}>
            Use today's
          </Button>
        </div>
        <div className="space-y-2">
          {I_CHOOSE_STATEMENTS.map((s) => (
            <button
              key={s}
              onClick={() => { onPick(s); onClose(); }}
              className="w-full text-left rounded-2xl border border-brand-teal-100 hover:border-brand-orange-300 hover:bg-brand-orange-50/40 px-4 py-3 text-sm text-brain-health-800 transition-colors min-h-[56px]"
            >
              {s}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
