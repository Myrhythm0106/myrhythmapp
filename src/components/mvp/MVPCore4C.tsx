import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Brain, Calendar, Heart, Activity, ArrowRight, Sparkles, User, HelpCircle, Mail, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { EditionBadge } from '@/components/launch/EditionBadge';
import { FoundingTrustStrip } from '@/components/launch/FoundingTrustStrip';
import { DayInTheLifeStrip } from '@/components/launch/DayInTheLifeStrip';
import { useNavigate, useLocation } from 'react-router-dom';
import { PainPointImageCard } from './PainPointImageCard';
import preciousMomentsImg from '@/assets/precious-moments.jpg';
import organizedActionImg from '@/assets/organized-action.jpg';
import emotionalLandscapeImg from '@/assets/emotional-landscape.jpg';
import strengthTogetherImg from '@/assets/strength-together.jpg';
import { MVPOnboardingModal } from './MVPOnboardingModal';
import { FeatureExplorationModal } from './FeatureExplorationModal';
import { FloatingRegisterButton } from '@/components/landing/FloatingRegisterButton';
import { useAuth } from '@/hooks/useAuth';
import { TestAccountButton } from '@/components/auth/TestAccountButton';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
export function MVPCore4C() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeFeatureModal, setActiveFeatureModal] = useState<'capture' | 'calendar' | 'calibrate' | 'community' | null>(null);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);
  const { user } = useAuth();
  
  const [heroEmail, setHeroEmail] = useState('');




  const handleHeroEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = heroEmail.trim();
    if (trimmed && trimmed.includes('@')) {
      localStorage.setItem('myrhythm_prefill_email', trimmed);
    }
    navigate('/launch/register');
  };
  
  // Check if we should auto-open the modal on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname === '/mvp/assessment' || params.get('open') === 'onboarding') {
      setIsOnboardingOpen(true);
    }
  }, [location]);
  
  const handleGetStarted = () => {
    navigate("/launch/register");
  };

  const { signOut } = useAuth();
  
  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      navigate('/launch');
    } else {
      navigate('/launch/signin');
    }
  };

  return (
    <div className="public-page min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-brain-health-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-memory-emerald-600" />
              <span className="text-2xl font-bold text-brain-health-900">MyRhythm</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/help/getting-started')}
                variant="ghost"
                size="sm"
                className="text-brain-health-600 hover:text-brain-health-800 hover:bg-brain-health-50"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleAuthAction}
                variant="outline"
                size="sm"
                className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50 hover:text-brain-health-900 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                {user ? 'Sign Out' : 'Log In'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-memory-emerald-500/10 via-brain-health-500/10 to-clarity-teal-500/10 border-b border-brain-health-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald-100/20 via-brain-health-100/20 to-clarity-teal-100/20" />
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
                <span className="bg-gradient-to-r from-memory-emerald-600 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                  EMPOWER YOUR BRAIN.
                </span>
                <br />
                <span className="bg-gradient-to-r from-clarity-teal-600 via-sunrise-amber-500 to-memory-emerald-600 bg-clip-text text-transparent">
                  RECLAIM YOUR POWER.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-brain-health-700 font-semibold max-w-4xl mx-auto">
                Transform cognitive challenges into unstoppable strength.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-6 mt-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-brain-health-800">
                  You're Not Broken. You're <span className="bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">Rebuilding</span>.
                </h2>
                <p className="font-semibold text-sm text-brain-health-700">
                  Your Rhythm
                </p>
                <p className="text-sm font-semibold text-brain-health-800">
                  Founding Member — limited to first 1,000
                </p>
              </div>
              <form
                onSubmit={handleHeroEmailSubmit}
                className="w-full max-w-md flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brain-health-400" />
                  <Input
                    type="email"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email to become a founding member"
                    className="pl-9 h-12 bg-white/90 border-brain-health-200"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white"
                >
                  Become a Founding Member
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
              <p className="text-xs text-brain-health-600">
                Founding spots are limited — join the first 1,000
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate('/launch/register')}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Points with Professional Images */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <PainPointImageCard 
              title="Forgetting important conversations?" 
              imageUrl="/lovable-uploads/a6888d46-3b47-49fa-aeeb-5cfee5c53bc2.png" 
              imageAlt="Woman touching her forehead looking thoughtful and concerned about memory issues" 
              description="Missing precious moments and connections" 
            />
            <PainPointImageCard 
              title="Feeling overwhelmed by simple tasks?" 
              imageUrl="/lovable-uploads/f435bac1-8fc3-474b-add2-1f378bd3ebab.png" 
              imageAlt="Person with head down on desk showing exhaustion and overwhelm" 
              description="When everyday activities feel impossible" 
            />
            <PainPointImageCard 
              title="Struggling to stay organized?" 
              imageUrl="/lovable-uploads/f8374cd9-e953-4247-8410-b9e5c4f403c2.png" 
              imageAlt="Woman overwhelmed throwing papers in air with disorganized workspace" 
              description="Losing track of what matters most" 
            />
          </div>
        </div>
      </section>

      {/* How MyRhythm answers it — numbered strip */}
      <section className="py-16 bg-gradient-to-b from-white to-brain-health-50/30">
        <div className="container mx-auto max-w-6xl px-6">
          <Collapsible open={isAnswersOpen} onOpenChange={setIsAnswersOpen}>
            <div className="text-center mb-6">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50"
                >
                  {isAnswersOpen ? (
                    <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>See how MyRhythm answers this <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              {/* Differentiator block */}
              <div className="max-w-3xl mx-auto text-center mb-10">
                <p className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-brain-health-600">
                  Built for Life Empowerment &mdash; brain injury, memory and cognitive challenges. And Productivity &mdash; useful for anyone carrying a lot.
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-brain-health-900 leading-tight">
                  The gap between clinically ready and life-ready is where people fall.
                </h2>
                <p className="mt-3 text-base md:text-lg text-brain-health-700 leading-relaxed">
                  MyRhythm is shaped for the weeks after the folder closes, and for anyone whose responsibilities outrun their energy.
                </p>
              </div>

              <div className="text-center mb-12">
                <h3 className="text-xl md:text-2xl font-bold text-brain-health-900">
                  Here&apos;s how MyRhythm answers that
                </h3>
                <p className="text-brain-health-700 mt-2">Four quiet shifts that change the week.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { n: '01', icon: null, problem: 'Conversations fade faster than they should.', tagline: 'One conversation you can always find', body: 'Memory Bridge listens so you don\u2019t have to. Record any chat, meeting or appointment and MyRhythm turns it into a searchable record with the decisions, names and next steps pulled out for you.' },
                  { n: '02', icon: Users, problem: 'The people who care often don\u2019t know how to help.', tagline: 'Family, friends, clinicians \u2014 in the loop, on the day', body: 'Whether you\u2019re recovering, caregiving, or just stretched thin, your Support Circle sees the plan with you. Shared calendar invites mean follow-through stops depending on willpower alone.' },
                  { n: '03', icon: null, problem: 'Some days, choosing what to do next is the hardest part.', tagline: 'One calm next step defined daily', body: 'A quick Energy Check tunes the day around how you actually feel. Smart Schedule then surfaces just the next right thing \u2014 with built-in buffers and a gentle reshuffle when it\u2019s too much.' },
                  { n: '04', icon: null, problem: 'Goals that matter often never reach today.', tagline: 'One thread from dream to today', body: 'Vision \u2192 Goals \u2192 Priorities \u2192 Daily Actions, all linked. Every task today traces back to something that matters, and every win is celebrated through the Capture \u2192 Commit \u2192 Calibrate \u2192 Celebrate loop.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.n}
                      className="relative rounded-2xl border border-brain-health-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-5xl font-black bg-gradient-to-br from-memory-emerald-500 to-clarity-teal-500 bg-clip-text text-transparent leading-none">
                          {item.n}
                        </div>
                        {Icon && (
                          <div className="w-10 h-10 rounded-full bg-brand-orange-50 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-brand-orange-500" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-brain-health-900 mb-1">{item.problem}</h3>
                      <p className="text-base font-semibold italic text-memory-emerald-700 mb-2">{item.tagline}</p>
                      <p className="text-sm text-brain-health-700 leading-relaxed">{item.body}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 text-center">
                <a
                  href="/launch/science"
                  className="text-sm text-brain-health-600 hover:text-brand-orange-500 underline-offset-4 hover:underline"
                >
                  The evidence behind this &rarr;
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-brain-health-600">
                <EditionBadge variant="chip" />
                <span className="hidden sm:inline text-brain-health-300">&middot;</span>
                <span className="italic">For recovery. For caregivers. For anyone carrying a lot.</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* Four Core Solutions Section */}
      <section className="py-20 bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/20 to-clarity-teal-50/30">
        <div className="container mx-auto max-w-6xl px-6">
          <FoundingTrustStrip />
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-brain-health-500 mb-3">The Four Core Solutions</p>
            <h2 className="text-3xl md:text-4xl font-bold text-brain-health-900 mb-4">
              Built for every busy brain — and strong enough for the hardest days.
            </h2>
            <p className="text-brain-health-600 max-w-2xl mx-auto text-sm">
              Tap a card to see the facts and what you can expect.
            </p>
          </div>

          {(() => {
            const solutions = [
              {
                id: 'capture' as const,
                eyebrow: '01 · Capture',
                title: 'Your Memory Bridge',
                hook: 'Never lose the conversation that mattered.',
                audience: 'For meetings, doctor visits, school pickups, family plans — anyone who can\'t hold every detail in their head.',
                bullets: ['Records any chat', 'Pulls out names, decisions and next steps', 'Searchable months later'],
                factsEveryday: [
                  'People forget ~50% of new information within an hour, and ~70% within 24 hours (Ebbinghaus).',
                  'Knowledge workers lose ~2 hrs/day to interruptions and context-switching.',
                ],
                factsClinical: [
                  '~40–80% of medical information is forgotten immediately after a consultation; nearly half of what is remembered is remembered incorrectly.',
                ],
                expectations: [
                  'A rolling recorder you can start in one tap',
                  'A plain-English summary per recording',
                  'A follow-up list you can act on',
                ],
                icon: Brain,
                gradient: 'from-memory-emerald-500 to-brain-health-500',
                cardBg: 'from-white to-memory-emerald-50/50',
                border: 'border-memory-emerald-200/50',
                chipBg: 'bg-memory-emerald-50 border-memory-emerald-100 text-memory-emerald-800',
                cta: 'Explore Memory Bridge',
                onCta: () => navigate('/launch/capture'),
              },
              {
                id: 'commit' as const,
                eyebrow: '02 · Commit',
                title: 'Your MyRhythm Calendar',
                hook: 'A day that fits the brain you have today.',
                audience: 'For anyone whose calendar keeps winning against them — new parents, shift workers, founders, students, carers.',
                bullets: ['Energy-aware planning', 'Gentle nudges, not guilt', 'One thread from vision → today'],
                factsEveryday: [
                  'Cognitive performance can swing 20–30% across the day based on chronotype and sleep.',
                  'Task-switching can cost up to 40% of productive time (APA).',
                ],
                factsClinical: [
                  'Cognitive fatigue peaks in the first 6 months after brain injury; ~1 in 3 survivors are readmitted within 90 days of discharge.',
                ],
                expectations: [
                  'Your goals broken into low-effort actions',
                  'Scheduling that works with your energy, not against it',
                  'One quiet view of the week ahead',
                ],
                icon: Calendar,
                gradient: 'from-brain-health-500 to-clarity-teal-500',
                cardBg: 'from-white to-brain-health-50/50',
                border: 'border-brain-health-200/50',
                chipBg: 'bg-brain-health-50 border-brain-health-100 text-brain-health-700',
                cta: 'Explore Calendar',
                onCta: () => navigate('/launch/commit'),
              },
              {
                id: 'calibrate' as const,
                eyebrow: '03 · Calibrate',
                title: 'Mood & Energy Check-ins',
                hook: 'A 20-second check-in. A clearer week.',
                audience: 'For anyone who wants to feel their week instead of just survive it.',
                bullets: ['Mood + energy in one tap', 'Quiet pattern insight', 'No scoring, no streaks to fail'],
                factsEveryday: [
                  'Brief daily self-monitoring is linked with 2–3× better follow-through on personal goals.',
                  'Naming a feeling (“affect labeling”) measurably reduces stress reactivity (Lieberman, UCLA).',
                ],
                factsClinical: [
                  'Up to 1 in 2 stroke survivors experience depression in the first year; early self-monitoring supports earlier support-seeking.',
                ],
                expectations: [
                  'A weekly Lens view of your rhythm',
                  'Gentle flags when patterns shift',
                  'Never a score you can “fail”',
                ],
                icon: Activity,
                gradient: 'from-clarity-teal-500 to-sunrise-amber-500',
                cardBg: 'from-white to-clarity-teal-50/50',
                border: 'border-clarity-teal-200/50',
                chipBg: 'bg-clarity-teal-50 border-clarity-teal-100 text-clarity-teal-800',
                cta: 'Explore Calibrate',
                onCta: () => navigate('/launch/calibrate'),
              },
              {
                id: 'celebrate' as const,
                eyebrow: '04 · Celebrate',
                title: 'Support Community',
                hook: 'No one walks alone.',
                audience: 'For anyone who does better with a small, honest circle — friends, family, colleagues, or a care team.',
                bullets: ['Share wins', 'Ask the circle', 'Encouragement, not advice'],
                factsEveryday: [
                  'Strong social connection is associated with a ~50% lower risk of early mortality (Holt-Lunstad meta-analysis).',
                  'Loneliness roughly doubles the risk of depression.',
                ],
                factsClinical: [
                  'Engaged support circles are linked to lower caregiver burnout and better 12-month recovery outcomes.',
                ],
                expectations: [
                  'A private circle of 1–5 people',
                  'One-tap wins you can share',
                  'Templates for the messages that are hardest to write',
                ],
                icon: Heart,
                gradient: 'from-sunrise-amber-500 to-memory-emerald-500',
                cardBg: 'from-white to-sunrise-amber-50/50',
                border: 'border-sunrise-amber-200/50',
                chipBg: 'bg-sunrise-amber-50 border-sunrise-amber-100 text-sunrise-amber-800',
                cta: 'Explore Community',
                onCta: () => setActiveFeatureModal('community'),
              },
            ];

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-start">
                {solutions.map((s) => {
                  const Icon = s.icon;
                  const isOpen = openCard === s.id;
                  return (
                    <Collapsible
                      key={s.id}
                      open={isOpen}
                      onOpenChange={(o) => setOpenCard(o ? s.id : null)}
                      asChild
                    >
                      <Card
                        className={`group relative overflow-hidden bg-gradient-to-br ${s.cardBg} ${s.border} shadow-md hover:shadow-xl transition-all duration-300 ${isOpen ? 'ring-1 ring-inset ring-brain-health-200 shadow-xl' : ''}`}
                      >
                        <CardHeader className="relative z-10 pb-3 text-left">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-brain-health-500 bg-white/70 border border-brain-health-100 rounded-full px-2 py-1">
                              For every busy brain
                            </span>
                          </div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-brain-health-500 font-medium">
                            {s.eyebrow}
                          </p>
                          <CardTitle className="text-base font-semibold text-brain-health-900 mt-1">
                            {s.title}
                          </CardTitle>
                          <p className="text-sm text-brain-health-700 mt-2 leading-relaxed">
                            {s.hook}
                          </p>
                        </CardHeader>

                        <CardContent className="relative z-10 pt-0 text-left">
                          <CollapsibleTrigger asChild>
                            <button
                              className="group/trigger flex items-center gap-1.5 text-xs text-brain-health-600 hover:text-brain-health-900 mt-1 mb-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brain-health-400 rounded-md"
                              aria-expanded={isOpen}
                            >
                              <span>{isOpen ? 'Hide details' : 'See how it works'}</span>
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            <div className="space-y-4 pt-2 pb-3 border-t border-brain-health-100">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.15em] text-brain-health-500 font-medium mb-1.5 mt-3">Who it's for</p>
                                <p className="text-xs text-brain-health-700 leading-relaxed">{s.audience}</p>
                              </div>

                              <div>
                                <p className="text-[10px] uppercase tracking-[0.15em] text-brain-health-500 font-medium mb-2">What it does for you</p>
                                <ul className="space-y-1.5">
                                  {s.bullets.map((b) => (
                                    <li key={b} className="flex items-start gap-2 text-xs text-brain-health-800">
                                      <Sparkles className="h-3 w-3 mt-0.5 text-brain-health-400 flex-shrink-0" />
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <p className="text-[10px] uppercase tracking-[0.15em] text-brain-health-500 font-medium mb-2">The facts behind it</p>
                                <p className="text-[10px] uppercase tracking-wider text-brain-health-400 mb-1">Everyday brains</p>
                                <div className="flex flex-col gap-1.5 mb-2">
                                  {s.factsEveryday.map((f, i) => (
                                    <span key={i} className={`text-[11px] leading-snug rounded-lg border px-2.5 py-1.5 ${s.chipBg}`}>
                                      {f}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-[10px] uppercase tracking-wider text-brain-health-400 mb-1">Also helpful if…</p>
                                <div className="flex flex-col gap-1.5">
                                  {s.factsClinical.map((f, i) => (
                                    <span key={i} className="text-[11px] leading-snug rounded-lg border border-brain-health-100 bg-white/70 text-brain-health-700 px-2.5 py-1.5">
                                      {f}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-[10px] uppercase tracking-[0.15em] text-brain-health-500 font-medium mb-2">What you can expect</p>
                                <ul className="space-y-1.5">
                                  {s.expectations.map((e) => (
                                    <li key={e} className="flex items-start gap-2 text-xs text-brain-health-800">
                                      <span className={`mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${s.gradient} flex-shrink-0`} />
                                      <span>{e}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CollapsibleContent>

                          <Button
                            size="sm"
                            variant="outline"
                            className={`w-full mt-3 border-brain-health-200 text-brain-health-800 hover:bg-gradient-to-r hover:${s.gradient} hover:text-white hover:border-transparent transition-all`}
                            onClick={s.onCta}
                          >
                            {s.cta}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Collapsible>
                  );
                })}
              </div>
            );
          })()}

          <p className="text-center text-xs text-brain-health-500 mt-8 max-w-2xl mx-auto italic">
            Facts sourced from public research (Ebbinghaus; APA on task-switching; Lieberman on affect labeling; Holt-Lunstad on social connection) and clinical literature summarised in our discharge-bridge references. MyRhythm supports cognitive wellness — it does not diagnose or treat any condition.
          </p>
        </div>
      </section>

      <DayInTheLifeStrip />

      {/* Feel the Difference Section */}
      <section className="py-20 bg-gradient-to-br from-white via-brain-health-50/10 to-memory-emerald-50/10">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brain-health-900 mb-4">
              Feel the Difference
            </h2>
            <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
              Experience the transformation when technology truly understands your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Precious Moments */}
            <div 
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${preciousMomentsImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-memory-emerald-900/80 via-memory-emerald-600/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Never lose precious moments
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Every conversation matters. Every memory is treasured.
                  </p>
                </div>
              </div>
            </div>

            {/* Organized Action */}
            <div 
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${organizedActionImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brain-health-900/80 via-brain-health-600/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Transform overwhelm into clarity
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Feel the calm confidence of being truly organized.
                  </p>
                </div>
              </div>
            </div>

            {/* Emotional Landscape */}
            <div 
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${emotionalLandscapeImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-clarity-teal-900/80 via-clarity-teal-600/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Understand your inner rhythm
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Discover patterns. Find peace. Optimize your wellbeing.
                  </p>
                </div>
              </div>
            </div>

            {/* Strength Together */}
            <div 
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${strengthTogetherImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sunrise-amber-900/80 via-sunrise-amber-600/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    You're never walking alone
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Find your tribe. Share your journey. Celebrate together.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-brain-health-600 font-medium text-lg max-w-3xl mx-auto mb-8">
              This isn't just another app. It's a companion designed for your unique cognitive journey.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={handleGetStarted}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Experience the Difference
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 py-20">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold text-brain-health-900 mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-brain-health-700 mb-8 max-w-2xl mx-auto">
            Start with our personalized assessment to discover your unique rhythm
          </p>
           <Button 
             size="lg"
             className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
             onClick={handleGetStarted}
           >
             <Sparkles className="h-5 w-5 mr-2" />
             Register Now
           </Button>
         </div>
       </section>

        {/* Onboarding Modal */}
        <MVPOnboardingModal isOpen={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />
        
        {/* Feature Exploration Modal */}
        <FeatureExplorationModal
          isOpen={activeFeatureModal !== null}
          onOpenChange={(open) => !open && setActiveFeatureModal(null)}
          feature={activeFeatureModal}
        />
        
        {/* Floating Register Button - only show when modal is closed */}
        {!isOnboardingOpen && <FloatingRegisterButton forceShow={!user} variant="trial" />}

        {/* Developer Test Account - Bottom Left */}
        {!user && (
          <div className="fixed bottom-4 left-4 z-40">
            <TestAccountButton />
          </div>
        )}
      </div>
    );
  }