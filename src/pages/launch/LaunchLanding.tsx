import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  MessageCircleQuestion,
  CalendarClock,
  Sparkles,
  Mic,
  CheckCircle2,
  Compass,
  Trophy,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { EditionBadge } from '@/components/launch/EditionBadge';
import {
  EDITION_NAME,
  EDITION_SHORT,
  EDITION_VERSION,
  EDITION_FOOTER,
} from '@/config/edition';

const questions = [
  {
    icon: MessageCircleQuestion,
    question:
      'Ever walked out of an important conversation already forgetting half of it?',
    reply: "You're not broken. Memory just isn't built for moments that big.",
    recognise: [
      'a hospital discharge that felt like a blur',
      "a doctor's appointment that turned into a folder you haven't opened",
      'a packed week of meetings where you can\'t recall what you actually agreed to',
      "a family update that needs repeating because it didn't stick the first time",
    ],
    tint: 'from-brand-orange-100 to-sunrise-amber-100',
    iconColor: 'text-brand-orange-600',
  },
  {
    icon: CalendarClock,
    question:
      'Do you ever know what matters this week — but not what to actually do on Monday?',
    reply:
      "Big plans rarely survive contact with a normal day. That's where we come in.",
    recognise: [
      'you left somewhere with advice but no plan',
      "you're holding someone else's calendar in your head as well as your own",
      'your to-do list keeps getting longer instead of done',
      'you keep starting fresh on Mondays and losing momentum by Wednesday',
    ],
    tint: 'from-clarity-teal-100 to-memory-emerald-100',
    iconColor: 'text-clarity-teal-700',
  },
  {
    icon: Trophy,
    question:
      'Are you doing the right things, but somehow still losing the wins?',
    reply: 'Progress that isn\'t noticed quietly disappears. We help it stick.',
    recognise: [
      "small improvements aren't getting noticed",
      'the household needs the same reminders again and again',
      "effort at work isn't translating into visible progress",
      "good days happen but you can't tell why",
    ],
    tint: 'from-brain-health-100 to-memory-emerald-100',
    iconColor: 'text-brain-health-700',
  },
];

const fourC = [
  {
    icon: Mic,
    title: 'Capture',
    blurb: 'Speak it once. The moment is kept, not lost.',
    example: 'Record a hospital conversation, family call, or meeting.',
  },
  {
    icon: CheckCircle2,
    title: 'Commit',
    blurb: 'Turn talk into one or two doable next steps.',
    example: 'Auto-suggested actions, sized to your energy.',
  },
  {
    icon: Compass,
    title: 'Calibrate',
    blurb: 'Adjust as the day moves. No guilt, no reset.',
    example: 'Smart Schedule re-flows around real life.',
  },
  {
    icon: Sparkles,
    title: 'Celebrate',
    blurb: 'See the wins you would have otherwise missed.',
    example: 'Daily and weekly momentum, made visible.',
  },
];

const liveNow = [
  'Memory Bridge — record & extract actions',
  '4C daily loop',
  'Smart Schedule with energy badges',
  'Clinical Export (PDF)',
  'GDPR data export',
];

const comingNext = [
  'Anchor digests for your Support Circle',
  'Persona switcher (survivor / carer / professional)',
  'Provider directory & matching',
];

export default function LaunchLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${EDITION_NAME} — Bridge the discharge cliff. Reclaim your rhythm.`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';
    meta?.setAttribute(
      'content',
      'MyRhythm Founding Edition turns important conversations into a calm, doable plan — so progress sticks and momentum returns.',
    );
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc) meta.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50">
      {/* Utility strip */}
      <div className="w-full border-b border-brain-health-100/60 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <EditionBadge variant="chip" />
            <span className="hidden sm:inline text-[11px] text-stone-500 truncate">
              Shaped with our founding members · {EDITION_VERSION}
            </span>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-medium text-brain-health-700 hover:text-brain-health-900"
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-orange-500 via-sunrise-amber-500 to-brand-orange-400 shadow-lg mb-6">
              <Brain className="h-8 w-8 text-white" aria-hidden="true" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
              When life gets loud,
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-brand-orange-600 via-sunrise-amber-600 to-clarity-teal-600 bg-clip-text text-transparent">
                {' '}your rhythm gets lost.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto">
              MyRhythm turns the conversations that matter — at the hospital, at home, at work —
              into a calm, doable plan you can actually follow on a Monday.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
              <LaunchButton
                size="lg"
                onClick={() => navigate('/launch/register')}
                className="gap-2 px-8 min-h-[56px] bg-brand-orange-500 hover:bg-brand-orange-600"
              >
                Join the Founding Cohort
                <ArrowRight className="h-5 w-5" />
              </LaunchButton>
              <button
                onClick={() => navigate('/launch/settings/edition')}
                className="min-h-[56px] px-6 rounded-full border border-brain-health-200 bg-white/70 backdrop-blur text-brain-health-800 font-medium hover:bg-white"
              >
                See what's inside {EDITION_VERSION}
              </button>
            </div>

            <p className="mt-5 text-sm text-stone-500 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />No card for 7 days</span>
              <span aria-hidden>·</span>
              <span>Cancel anytime</span>
              <span aria-hidden>·</span>
              <span>Your data stays yours</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Question triptych */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
              Does any of this sound familiar?
            </h2>
            <p className="mt-3 text-stone-600 max-w-xl mx-auto">
              If you nod at even one of these, you're in the right place.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {questions.map((q, i) => {
              const Icon = q.icon;
              return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="bg-white/70 backdrop-blur border border-brain-health-100 rounded-3xl shadow-sm p-6 flex flex-col"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${q.tint} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${q.iconColor}`} aria-hidden="true" />
                  </div>
                  <p className="text-lg font-semibold text-stone-900 leading-snug">
                    {q.question}
                  </p>
                  <p className="mt-3 text-stone-600 italic">{q.reply}</p>
                  <div className="mt-5 pt-4 border-t border-brain-health-100/70">
                    <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-2">
                      You might recognise this if…
                    </p>
                    <ul className="space-y-1.5 text-sm text-stone-600">
                      {q.recognise.map((line, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-brand-orange-400 mt-1.5">·</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4C loop */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
              A gentle daily loop, built for cognitive continuity.
            </h2>
            <p className="mt-3 text-stone-600 max-w-2xl mx-auto">
              Four small steps. One quiet rhythm. The same loop whether today is heavy or light.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {fourC.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="bg-white/70 backdrop-blur border border-brain-health-100 rounded-3xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-brand-orange-600">
                      0{i + 1}
                    </span>
                    <Icon className="h-5 w-5 text-clarity-teal-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">{c.title}</h3>
                  <p className="text-sm text-stone-600 mt-1">{c.blurb}</p>
                  <p className="text-xs text-stone-500 mt-3 italic">{c.example}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency strip */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur border border-brain-health-100 rounded-3xl shadow-sm p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400">
                Full transparency
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                What's in the {EDITION_SHORT}.
              </h2>
            </div>
            <EditionBadge variant="chip" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-memory-emerald-700 mb-3">
                Live in {EDITION_VERSION}
              </p>
              <ul className="space-y-2">
                {liveNow.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-stone-700 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-memory-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-brain-health-700 mb-3">
                Coming after v1.1
              </p>
              <ul className="space-y-2">
                {comingNext.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-stone-600 text-sm">
                    <Sparkles className="h-4 w-4 text-brain-health-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => navigate('/launch/settings/edition')}
              className="text-sm font-medium text-clarity-teal-700 hover:text-clarity-teal-900 inline-flex items-center gap-1"
            >
              Read the full {EDITION_VERSION} features <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-stone-500 inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              MyRhythm does not diagnose, treat, or cure any condition.
            </p>
          </div>
        </div>
      </section>

      {/* Founding proof band */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-brand-orange-500 via-sunrise-amber-500 to-brand-orange-600 text-white p-6 sm:p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-2xl font-bold">873 spots remaining</p>
              <p className="text-white/90 text-sm mt-1">
                Founding pricing locked for life · Direct line to the founder via in-app feedback
              </p>
            </div>
            <LaunchButton
              size="lg"
              onClick={() => navigate('/launch/register')}
              className="bg-white text-brand-orange-700 hover:bg-white/90 min-h-[56px] px-6 gap-2"
            >
              Claim your spot <ArrowRight className="h-5 w-5" />
            </LaunchButton>
          </div>
        </div>
      </section>

      {/* Final CTA footer */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Reclaim your rhythm — one small loop at a time.
          </h2>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <LaunchButton
              size="lg"
              onClick={() => navigate('/launch/register')}
              className="gap-2 px-8 min-h-[56px] bg-brand-orange-500 hover:bg-brand-orange-600"
            >
              Join the Founding Cohort
              <ArrowRight className="h-5 w-5" />
            </LaunchButton>
            <button
              onClick={() => navigate('/auth')}
              className="text-sm font-medium text-brain-health-700 hover:text-brain-health-900 min-h-[44px] px-2"
            >
              Already a member? Sign in
            </button>
          </div>
          <div className="mt-10 pt-6 border-t border-brain-health-100/70 flex flex-col items-center gap-2">
            <EditionBadge variant="footer" />
            <p className="text-[10px] text-stone-400">
              {EDITION_FOOTER} · Confidential — shared in trust with founding members.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
