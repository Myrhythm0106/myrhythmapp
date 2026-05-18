import React, { useEffect, useMemo, useState } from 'react';
import { Save, Volume2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { fivePrompts } from '@/data/fivePrompts';
import { speechService } from '@/utils/speechSynthesis';

interface Props {
  answers: Record<string, string>;
  futureLabel: string;
  statement: string;
  onStatementChange: (v: string) => void;
  onSave: () => void;
  lastSaved?: string | null;
}

function stitch(answers: Record<string, string>, futureLabel: string): string {
  return fivePrompts
    .filter((p) => answers[p.id]?.trim())
    .map((p) => {
      if (p.id === 'future' && futureLabel && futureLabel !== 'Future') {
        const a = answers[p.id].trim().replace(/\.$/, '');
        return `For my sense of ${futureLabel.toLowerCase()}, ${a}.`;
      }
      return p.stitch(answers[p.id]);
    })
    .join(' ');
}

export function VisionStatementComposer({
  answers,
  futureLabel,
  statement,
  onStatementChange,
  onSave,
  lastSaved,
}: Props) {
  const suggested = useMemo(() => stitch(answers, futureLabel), [answers, futureLabel]);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    // If the user hasn't typed their own version yet, mirror the stitched one.
    if (!statement.trim() && suggested) {
      onStatementChange(suggested);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggested]);

  const handleSave = () => {
    onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  const empty = !statement.trim();

  return (
    <div className="rounded-2xl border border-brain-health-100 bg-white p-5 md:p-6 space-y-4">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
          Your vision, in one paragraph
        </p>
        <p className="mt-1 text-sm text-brain-health-600">
          Edit freely. This is yours — change a word, a sentence, or the whole thing.
        </p>
      </div>

      <Textarea
        value={statement}
        onChange={(e) => onStatementChange(e.target.value)}
        placeholder="Fill in a prompt or two above and a draft will appear here."
        rows={6}
        className="resize-none text-base leading-relaxed border-brain-health-200 focus-visible:ring-brand-teal-600/30 focus-visible:border-brand-teal-600"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handleSave}
          disabled={empty}
          className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white min-h-[44px]"
        >
          {justSaved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {justSaved ? 'Saved' : 'Save vision'}
        </Button>
        <Button
          variant="outline"
          onClick={() => statement && speakText(statement)}
          disabled={empty}
          className="min-h-[44px]"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Read aloud
        </Button>
        {lastSaved && (
          <span className="text-xs text-brain-health-500 ml-auto">
            Last saved {lastSaved}
          </span>
        )}
      </div>
    </div>
  );
}
