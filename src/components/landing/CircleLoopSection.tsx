import React from 'react';
import { Mic, Shield, Check, Mail } from 'lucide-react';

const FRAMES = [
  {
    icon: Mic,
    title: 'Your circle captures',
    body: 'A trusted family member or carer sends a voice note on your behalf — only when you have given them permission.',
    accent: 'bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200',
  },
  {
    icon: Shield,
    title: 'Provenance shown',
    body: 'Every capture arrives with a chip: who sent it, when, and which permission allowed it. Revoke in one tap.',
    accent: 'bg-brand-orange-50 text-brand-orange-700 border-brand-orange-200',
  },
  {
    icon: Check,
    title: 'You accept',
    body: 'Nothing enters your day until you say yes. Captures save instantly; one tap to undo. You stay sovereign.',
    accent: 'bg-memory-emerald-50 text-memory-emerald-700 border-memory-emerald-200',
  },
  {
    icon: Mail,
    title: 'Weekly digest',
    body: 'A Sunday summary closes the loop: who sent what, how often, and a shortcut to adjust permissions.',
    accent: 'bg-brain-health-50 text-brain-health-700 border-brain-health-200',
  },
];

/**
 * Landing page section that makes the Consent Capture moat visible in 5 seconds.
 * No other capture/notes app on the market shows this loop.
 */
export function CircleLoopSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-brand-teal-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-teal-100 text-brand-teal-700 text-xs font-semibold uppercase tracking-wide">
            Consent Capture
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brain-health-900">
            The only capture loop built around your consent.
          </h2>
          <p className="text-base md:text-lg text-brain-health-600 max-w-2xl mx-auto">
            Voice notes are a commodity. <span className="font-semibold">Consent-gated proxy capture</span> with
            attribution, accept/decline, and a revocable permission trail is not.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {FRAMES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="relative bg-white rounded-2xl border border-brain-health-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-brain-health-900 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${f.accent} mb-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-brain-health-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-brain-health-600 leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-brain-health-500 mt-8 max-w-xl mx-auto">
          MyRhythm does not diagnose, treat, or fix any condition. It is a daily-life support tool that puts you in control of who can act on your behalf.
        </p>
      </div>
    </section>
  );
}
