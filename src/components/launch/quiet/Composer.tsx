import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineCaptureSheet } from './InlineCaptureSheet';

export function Composer() {
  const [text, setText] = useState('');
  const [capturing, setCapturing] = useState(false);

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white border border-brand-teal-200/50 shadow-sm p-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Note one thing — a thought, a feeling, a moment…"
          className="flex-1 bg-transparent outline-none px-3 py-3 text-sm text-brain-health-800 placeholder:text-brain-health-400"
        />
        <Button
          variant="action"
          size="icon"
          onClick={() => setCapturing(true)}
          aria-label="Capture by voice"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </div>
      <InlineCaptureSheet open={capturing} onClose={() => setCapturing(false)} />
    </div>
  );
}
