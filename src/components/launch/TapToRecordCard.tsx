import React, { useMemo, useState } from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Button } from '@/components/ui/button';
import { Copy, Check, Smartphone, Mic } from 'lucide-react';
import { toast } from 'sonner';

/**
 * "Tap to record" — no app can bind an iPhone Back Tap or an Android gesture
 * by itself, but it can hand the phone one stable link that those gestures
 * open. This card gives that link plus plain-language setup steps.
 */
export function TapToRecordCard() {
  const [copied, setCopied] = useState(false);

  const recordLink = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/launch/memory?record=1`;
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(recordLink);
      setCopied(true);
      toast.success('Link copied. Paste it into your phone shortcut.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("I couldn't copy it — press and hold the link to copy it by hand.");
    }
  };

  return (
    <LaunchCard className="bg-launch-ivory border-launch-gold/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-launch-teal/15 flex items-center justify-center shrink-0">
          <Mic className="h-5 w-5 text-launch-teal" />
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-launch-ink">Tap to record</h3>
            <p className="text-sm text-launch-ink/70 mt-1">
              Set my phone up once, and three taps on the back of it starts a recording —
              no searching, nothing to remember.
            </p>
          </div>

          <div className="rounded-lg border border-launch-ink/10 bg-white/70 p-3">
            <p className="text-xs uppercase tracking-wide text-launch-ink/50 mb-1">My recording link</p>
            <p className="text-sm font-mono break-all text-launch-ink/80">{recordLink}</p>
            <Button
              type="button"
              variant="outline"
              onClick={copy}
              className="mt-3 min-h-11 w-full sm:w-auto"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied' : 'Copy my link'}
            </Button>
          </div>

          <div className="space-y-3 text-sm text-launch-ink/80">
            <div>
              <p className="font-medium text-launch-ink flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> iPhone — three taps on the back
              </p>
              <ol className="list-decimal ml-5 mt-1 space-y-1">
                <li>Open the <strong>Shortcuts</strong> app, tap <strong>+</strong>, add the action <strong>Open URL</strong>.</li>
                <li>Paste the link above and name the shortcut <strong>Record</strong>.</li>
                <li>Go to <strong>Settings → Accessibility → Touch → Back Tap → Triple Tap</strong> and choose <strong>Record</strong>.</li>
              </ol>
            </div>

            <div>
              <p className="font-medium text-launch-ink flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Android — one tap from the home screen
              </p>
              <ol className="list-decimal ml-5 mt-1 space-y-1">
                <li>Press and hold the MyRhythm icon, then drag <strong>Capture</strong> onto the home screen.</li>
                <li>Or add the link above to your assistant routine or a Quick Settings tile.</li>
              </ol>
            </div>
          </div>

          <p className="text-xs text-launch-ink/55">
            The first time it opens, my phone asks once for microphone access — after that it just starts.
          </p>
        </div>
      </div>
    </LaunchCard>
  );
}
