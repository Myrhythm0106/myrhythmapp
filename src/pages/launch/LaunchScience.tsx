import { Link } from "react-router-dom";
import { LaunchQuickActions } from "@/components/launch/LaunchQuickActions";

interface EvidenceSection {
  problem: string;
  stat: string;
  caption: string;
  frame: string;
  source: string;
  featureTitle: string;
  featureBlurb: string;
  featureHref: string;
}

const SECTIONS: EvidenceSection[] = [
  {
    problem: "Conversations fade faster than they should.",
    stat: "~50%",
    caption: "of a conversation can be lost within the first hour",
    frame:
      "The forgetting curve is universal — every brain lets detail slip. Brain injury, fatigue, and cognitive overload steepen the curve. The cost isn't the forgetting itself; it's the names, promises and next steps that go with it.",
    source: "Based on Ebbinghaus forgetting curve research and clinical reviews of post-injury memory [citation to be confirmed]",
    featureTitle: "Memory Bridge",
    featureBlurb:
      "Record any conversation, meeting or appointment. MyRhythm turns it into a searchable record with the decisions, names and next steps pulled out for you.",
    featureHref: "/launch/memory",
  },
  {
    problem: "Some days, choosing what to do next is the hardest part.",
    stat: "~35,000",
    caption: "small decisions the average adult makes in a day",
    frame:
      "Every decision spends energy. After brain injury — or any season of high cognitive load — the energy budget is smaller and every choice costs more. So \"what next?\" can become the heaviest question on the list.",
    source: "Commonly cited decision-load research from Cornell and related studies [citation to be confirmed]",
    featureTitle: "Energy Check + Smart Schedule",
    featureBlurb:
      "A quick Energy Check tunes the day to how you actually feel. Smart Schedule then surfaces just the next right thing — with built-in buffers and a gentle reshuffle when it's too much.",
    featureHref: "/launch/calendar",
  },
  {
    problem: "Goals that matter often never reach today.",
    stat: "~92%",
    caption: "of personal goals are estimated to go uncompleted",
    frame:
      "The will is there. The bridge between a vision and today's action is what's missing — for everyone, and especially when cognitive load is high. MyRhythm makes that bridge the everyday system, not a yearly resolution.",
    source: "Commonly cited goal-completion statistics (e.g. Statistic Brain) [citation to be confirmed]",
    featureTitle: "Vision \u2192 Goals \u2192 Priorities \u2192 Daily Actions",
    featureBlurb:
      "Every task you see today traces back to something that matters. Every win is celebrated through the Capture \u2192 Commit \u2192 Calibrate \u2192 Celebrate loop.",
    featureHref: "/launch/goals",
  },
  {
    problem: "Doing it alone is the hardest part.",
    stat: "2\u20133\u00d7",
    caption: "more likely to follow through when a plan is visible to a trusted person",
    frame:
      "Isolation and invisible effort hurt recovery \u2014 and they hurt anyone trying to keep a hard week on track. When the people who care can see the plan, follow-through stops depending on willpower alone. Around 65% of brain injury survivors report loneliness, and ~40% of caregivers say they don\u2019t know what would actually help.",
    source: "Behavioural follow-through, post-injury loneliness, and caregiver uncertainty figures [citations to be confirmed]",
    featureTitle: "Support Circle + Shared Calendar",
    featureBlurb:
      "Invite family, friends or clinicians into a permissioned view of your plan. Shared calendar invites and gentle nudges turn good intentions into kept commitments \u2014 without handing over control.",
    featureHref: "/launch/support",
  },
];

export default function LaunchScience() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-brain-health-50/20 to-white">
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12 text-center">
          <Link
            to="/launch"
            className="text-sm text-brain-health-600 hover:text-brand-orange-500 underline-offset-4 hover:underline"
          >
            &larr; Back to MyRhythm
          </Link>
          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-brain-health-900">
            The evidence behind MyRhythm
          </h1>
          <p className="mt-4 text-lg text-brain-health-700 max-w-2xl mx-auto">
            These are shared human challenges &mdash; not personal failings.
            Here&apos;s the research, and what we do about it.
          </p>
        </header>

        <div className="space-y-12">
          {SECTIONS.map((s) => (
            <section
              key={s.problem}
              className="rounded-2xl border border-brain-health-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-brain-health-900">
                {s.problem}
              </h2>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
                <span className="text-5xl font-black bg-gradient-to-br from-memory-emerald-500 to-clarity-teal-500 bg-clip-text text-transparent leading-none">
                  {s.stat}
                </span>
                <span className="text-base text-brain-health-700">{s.caption}</span>
              </div>

              <p className="mt-6 text-base text-brain-health-700 leading-relaxed">
                {s.frame}
              </p>
              <p className="mt-3 text-xs italic text-brain-health-500">
                {s.source}
              </p>

              <div className="mt-6 rounded-xl bg-brain-health-50/60 border border-brain-health-100 p-5">
                <p className="text-sm font-semibold text-brand-orange-500 mb-1">
                  What MyRhythm does about it
                </p>
                <p className="text-base font-bold text-brain-health-900">
                  {s.featureTitle}
                </p>
                <p className="text-sm text-brain-health-700 mt-1 leading-relaxed">
                  {s.featureBlurb}
                </p>
                <Link
                  to={s.featureHref}
                  className="inline-block mt-3 text-sm text-brand-orange-500 hover:underline underline-offset-4"
                >
                  Explore the feature &rarr;
                </Link>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-brain-health-200/60 pt-6 text-center">
          <p className="text-sm text-brain-health-700 italic">
            MyRhythm does not diagnose, treat, or cure any condition. It is a
            cognitive continuity and life-rhythm companion, designed to work
            alongside the care you already receive.
          </p>
          <p className="mt-4 text-[3pt] text-brain-health-400 tracking-wide">
            Confidential. For the named recipient only. &copy; MyRhythm. Not a
            medical device. Do not redistribute without written consent.
          </p>
        </footer>
      </div>
    </div>
  );
}
