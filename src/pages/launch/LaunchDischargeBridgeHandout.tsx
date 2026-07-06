import React, { useEffect } from 'react';
import { QrCode, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DISCLAIMER_TEXT } from '@/config/appDescription';

/**
 * Print-optimised one-pager for the Discharge Bridge Kit.
 * See docs/discharge-bridge-kit.md §3a and §5 for locked copy.
 *
 * A4 / US Letter, one page. Clinician-hand-out artefact.
 * Deliberately not wrapped in LaunchLayout — this route is meant to be printed.
 */
export default function LaunchDischargeBridgeHandout() {
  useEffect(() => {
    document.title = 'MyRhythm — First 30 Days Home';
  }, []);

  const bullets: { title: string; body: string }[] = [
    {
      title: 'Someone knows.',
      body: 'Invite one person to your Support Circle before you leave the ward.',
    },
    {
      title: 'Capture, don\u2019t remember.',
      body: 'Small voice notes. Your future self reads them back.',
    },
    {
      title: 'One thing tomorrow.',
      body: 'Commit to one thing. Not five. Not the whole week.',
    },
    {
      title: 'Check in with yourself.',
      body: 'How did that feel? Green, amber, or red. That\u2019s the whole check-in.',
    },
    {
      title: 'Celebrate small.',
      body: 'Share one win with your Circle every week.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <div className="print:hidden max-w-3xl mx-auto px-6 pt-6 flex items-center justify-between">
        <p className="text-sm text-stone-600">
          Preview of the printed one-pager. Use your browser\u2019s Print dialog to save as PDF or print A4.
        </p>
        <Button onClick={() => window.print()} className="rounded-xl">
          <Printer className="h-4 w-4 mr-2" strokeWidth={1.75} />
          Print
        </Button>
      </div>

      <article
        className="max-w-3xl mx-auto px-10 py-12 print:px-14 print:py-16"
        style={{ minHeight: '11in' }}
      >
        <header className="border-b border-stone-200 pb-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-700">
            MyRhythm \u00b7 Discharge Bridge Kit
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">First 30 Days Home</h1>
          <p className="mt-2 text-lg italic text-stone-700">You don\u2019t walk this alone.</p>
        </header>

        <ol className="mt-8 space-y-5">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-lg font-semibold">{b.title}</p>
                <p className="text-base text-stone-700 leading-relaxed">{b.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex items-end justify-between gap-6 border-t border-stone-200 pt-6">
          <div>
            <p className="text-sm text-stone-600">Start your first 30 days at</p>
            <p className="text-lg font-semibold">myrhythmapp.com/subscribe</p>
          </div>
          <div
            aria-label="QR code to myrhythmapp.com/subscribe"
            className="w-24 h-24 border-2 border-stone-900 flex items-center justify-center"
          >
            {/* Placeholder QR — replace with generated QR in v0.2 */}
            <QrCode className="w-16 h-16 text-stone-900" strokeWidth={1.5} />
          </div>
        </div>

        <footer className="mt-10 text-[10px] leading-relaxed text-stone-500">
          {DISCLAIMER_TEXT}
        </footer>
      </article>

      <style>{`
        @media print {
          @page { size: A4; margin: 0.5in; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}
