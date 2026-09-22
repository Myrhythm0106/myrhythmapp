import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Brain,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  HelpCircle,
  Link2,
  LockKeyhole,
  Mic2,
  User,
  Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EditionBadge } from '@/components/launch/EditionBadge';
import { MVPOnboardingModal } from './MVPOnboardingModal';
import { useAuth } from '@/hooks/useAuth';
import preciousMomentsImg from '@/assets/precious-moments-black-couple.png';
import organizedActionImg from '@/assets/organized-action-black-woman.png';
import emotionalLandscapeImg from '@/assets/emotional-landscape.jpg';
import strengthTogetherImg from '@/assets/strength-together.jpg';

type Chapter = {
  number: string;
  marker: string;
  title: string;
  promise: string;
  description: string;
  image: string;
  alt: string;
  detailTitle: string;
  details: string[];
  align: 'left' | 'right';
  accent: 'ember' | 'teal' | 'gold';
};

const chapters: Chapter[] = [
  {
    number: '01',
    marker: 'THE MOMENT',
    title: 'The conversation stays with me.',
    promise: 'Conversation or report',
    description:
      'Memory Bridge keeps the original conversation or report safe, creates a clear write-up and brings the important decisions and commitments into view—without asking me to remember everything at once.',
    image: emotionalLandscapeImg,
    alt: 'A person reviewing notes outdoors after an important conversation',
    detailTitle: 'What I can expect',
    details: [
      'I can record a conversation or upload a report.',
      'I review the write-up before anything reaches my diary.',
      'I choose whether to keep the audio, the write-up, the actions, or all three.',
    ],
    align: 'left',
    accent: 'ember',
  },
  {
    number: '02',
    marker: 'THE DECISION',
    title: 'The meaning becomes a next step.',
    promise: 'Verify my next steps',
    description:
      'Names, decisions and actions are organised into a professional summary. I stay in control: I can edit the wording, owner, priority and dates before I accept it.',
    image: organizedActionImg,
    alt: 'A Black professional with a natural Afro reviewing clear next steps at her desk',
    detailTitle: 'Why verification matters',
    details: [
      'Each action keeps a simple note of which conversation it came from.',
      'Priority, start date and finish date remain changeable.',
      'Nothing is treated as agreed until I have reviewed it.',
    ],
    align: 'right',
    accent: 'teal',
  },
  {
    number: '03',
    marker: 'THE TIME',
    title: 'The plan enters my real life.',
    promise: 'Place it into my schedule',
    description:
      'A next step becomes useful when it has a place in the day. MyRhythm helps me choose a realistic time, add the right level of reminder and send it to my calendar.',
    image: preciousMomentsImg,
    alt: 'A Black couple sharing a calm moment at home with time protected for what matters',
    detailTitle: 'Designed for real schedules',
    details: [
      'Suggestions can reflect my energy and brain-health rhythm.',
      'I can always choose a different time when life or another person requires it.',
      'Google Calendar, Outlook, Apple Calendar and standard calendar files are supported.',
    ],
    align: 'left',
    accent: 'gold',
  },
  {
    number: '04',
    marker: 'THE PERSON',
    title: 'The right person can stay connected.',
    promise: 'Loop in someone I trust—if I choose',
    description:
      'A family member, friend or professional can receive only the action or update I choose to share. Support remains permission-based, practical and personal.',
    image: strengthTogetherImg,
    alt: 'A small group of trusted people connecting in warm evening light',
    detailTitle: 'My choice stays central',
    details: [
      'I choose who is invited and what they can see.',
      'A supporter can encourage follow-through without receiving my whole account.',
      'My diary keeps each action connected to the conversation it came from.',
    ],
    align: 'right',
    accent: 'teal',
  },
];

function StoryChapter({ chapter }: { chapter: Chapter }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const copyFirst = chapter.align === 'left';
  const markerColour =
    chapter.accent === 'ember'
      ? 'bg-launch-ember'
      : chapter.accent === 'gold'
        ? 'bg-launch-gold'
        : 'bg-launch-teal';

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 36 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid items-center gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-24"
    >
      <div
        className={`relative md:col-span-7 ${copyFirst ? 'md:order-2' : 'md:order-1'}`}
      >
        <div className={`absolute top-4 z-20 md:-top-5 ${copyFirst ? 'left-4 md:-left-7' : 'right-4 md:-right-7'}`}>
          <span className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-launch-cream-light ${markerColour} font-worksans text-sm font-bold text-primary-foreground shadow-lg`}>
            {chapter.number}
          </span>
          <span
            className={`absolute top-1/2 hidden h-px w-10 -translate-y-1/2 bg-launch-gold md:block ${copyFirst ? 'right-full' : 'left-full'}`}
            aria-hidden="true"
          />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-launch-cream shadow-[0_30px_70px_-42px_hsl(var(--launch-ink-deep)/0.55)] md:aspect-[5/4]">
          <motion.img
            src={chapter.image}
            alt={chapter.alt}
            className="h-full w-full object-cover"
            whileHover={reduceMotion ? undefined : { scale: 1.025 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className={`md:col-span-5 ${copyFirst ? 'md:order-1' : 'md:order-2'}`}>
        <p className="mb-5 flex items-center gap-3 font-worksans text-xs font-bold uppercase tracking-normal text-launch-moss">
          <span className={`h-px w-9 ${markerColour}`} aria-hidden="true" />
          {chapter.marker}
        </p>
        <p className="mb-4 font-worksans text-sm font-semibold text-launch-teal">
          {chapter.promise}
        </p>
        <h2 className="font-instrument text-4xl leading-[1.05] text-launch-ink-deep md:text-5xl">
          {chapter.title}
        </h2>
        <p className="mt-6 max-w-xl font-worksans text-lg leading-8 text-launch-ink-deep/75">
          {chapter.description}
        </p>

        <Collapsible open={open} onOpenChange={setOpen} className="mt-7 border-t border-launch-gold/30 pt-3">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="min-h-14 w-full justify-between rounded-md px-0 text-left text-launch-ink-deep hover:bg-launch-cream hover:text-launch-ink-deep"
            >
              <span>{chapter.detailTitle}</span>
              <ChevronDown className={`h-5 w-5 text-launch-teal transition-transform ${open ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-3 pb-4 pt-2">
              {chapter.details.map((detail) => (
                <li key={detail} className="flex gap-3 font-worksans text-sm leading-6 text-launch-ink-deep/75">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-launch-teal" aria-hidden="true" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </motion.article>
  );
}

export function MVPCore4C() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname === '/mvp/assessment' || params.get('open') === 'onboarding') {
      setIsOnboardingOpen(true);
    }
  }, [location]);

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      navigate('/launch');
      return;
    }
    navigate('/launch/signin');
  };

  const handleFoundingAction = () => {
    navigate(user ? '/subscribe' : '/launch/register');
  };

  return (
    <div className="launch-theme public-page min-h-screen bg-launch-cream-light text-launch-ink-deep">
      <nav className="sticky top-0 z-50 border-b border-launch-gold/30 bg-launch-cream-light/90 backdrop-blur-xl" aria-label="Main navigation">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Button
            variant="ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
            className="flex min-h-14 items-center gap-3 rounded-md px-0 text-left hover:bg-transparent"
            aria-label="MyRhythm, return to top"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-launch-gold/30 bg-launch-ivory">
              <Brain className="h-5 w-5 text-launch-teal" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-instrument text-2xl leading-none text-launch-ink-deep">MyRhythm</span>
              <span className="mt-1 block font-worksans text-[9px] font-semibold uppercase tracking-normal text-launch-moss">Memory-First Design™</span>
            </span>
          </Button>
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              onClick={() => navigate('/help/getting-started')}
              variant="ghost"
              size="icon"
              className="text-launch-moss hover:bg-launch-cream hover:text-launch-ink-deep"
              aria-label="Help"
              title="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleAuthAction}
              variant="ghost"
              className="min-h-14 px-3 text-launch-ink-deep hover:bg-launch-cream hover:text-launch-ink-deep md:px-5"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user ? 'Sign out' : 'Log in'}</span>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative min-h-[calc(100svh-72px)] overflow-hidden border-b border-launch-gold/30">
          <div className="absolute inset-0">
            <img
              src="/lovable-uploads/a6888d46-3b47-49fa-aeeb-5cfee5c53bc2.png"
              alt="A woman pausing thoughtfully beside her notes and laptop"
              className="h-full w-full object-cover object-[68%_center] md:object-[72%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-launch-cream-light via-launch-cream-light/95 to-launch-cream-light/50 md:via-launch-cream-light/85 md:to-launch-cream-light/10" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-launch-cream-light via-transparent to-transparent" aria-hidden="true" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100svh-72px)] max-w-7xl items-center px-5 pb-32 pt-14 md:px-8 md:pb-36 md:pt-20">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <EditionBadge variant="chip" />
              <p className="mt-8 font-worksans text-xs font-bold uppercase tracking-normal text-launch-teal">
                From what was said to what happens next
              </p>
              <h1 className="mt-5 font-instrument text-5xl leading-[0.98] text-launch-ink-deep sm:text-6xl md:text-7xl lg:text-[5.75rem]">
                The app that keeps your plans and actions going after your appointment or conversation ends.
              </h1>
              <p className="mt-7 max-w-2xl font-worksans text-lg leading-8 text-launch-ink-deep/80 md:text-xl">
                MyRhythm turns conversations and reports into clear, traceable next steps—then helps those steps find a realistic place in my day.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  onClick={handleFoundingAction}
                  className="min-h-16 rounded-md bg-launch-teal px-8 font-worksans font-bold text-primary-foreground shadow-[0_18px_40px_-20px_hsl(var(--launch-ink-deep)/0.6)] hover:bg-launch-ink"
                >
                  Become a Founding Member
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <p className="max-w-xs font-worksans text-sm leading-6 text-launch-ink-deep/70">
                  £10/month for life · limited to 500 founding places
                </p>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pb-5 text-launch-ink-deep/65" aria-hidden="true">
            <span className="font-worksans text-[10px] font-bold uppercase tracking-normal">Follow the thread</span>
            <ArrowDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" />
          </div>
        </section>

        <section className="relative overflow-hidden" aria-labelledby="continuity-heading">
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <header className="mx-auto max-w-3xl pb-8 pt-24 text-center md:pb-12 md:pt-32">
              <p className="font-worksans text-xs font-bold uppercase tracking-normal text-launch-teal">One connected journey</p>
              <h2 id="continuity-heading" className="mt-5 font-instrument text-4xl leading-tight text-launch-ink-deep md:text-6xl">
                Nothing important should disappear between remembering and doing.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl font-worksans text-lg leading-8 text-launch-ink-deep/70">
                The 4C loop quietly carries each moment through Capture, Commit, Calibrate and Celebrate—without making my day feel like a system to manage.
              </p>
            </header>

            {chapters.map((chapter) => (
              <StoryChapter key={chapter.number} chapter={chapter} />
            ))}
          </div>
        </section>

        <section className="border-y border-launch-gold/30 bg-launch-cream py-20 md:py-28" aria-labelledby="continuity-sequence-heading">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <p className="font-worksans text-xs font-bold uppercase tracking-normal text-launch-teal">The continuity sequence</p>
                <h2 id="continuity-sequence-heading" className="mt-5 font-instrument text-4xl leading-tight text-launch-ink-deep md:text-5xl">
                  One thread. From the original conversation, through follow-through, to the day it's done.
                </h2>
                <p className="mt-6 font-worksans text-lg leading-8 text-launch-ink-deep/70">
                  I can return to the original conversation, see what I agreed, know when it is due, decide who can help, and see each step through to done. The record stays coherent even when the audio does not.
                </p>
              </div>

              <div className="relative pl-12 md:pl-16">
                <div className="absolute bottom-6 left-5 top-6 w-px bg-launch-gold" aria-hidden="true" />
                {[
                  { icon: Mic2, label: 'Conversation or report', colour: 'bg-launch-ember' },
                  { icon: FileText, label: 'Verify my next steps', colour: 'bg-launch-teal' },
                  { icon: CalendarCheck, label: 'Place them into my real schedule', colour: 'bg-launch-gold' },
                  { icon: Users, label: 'Loop in someone I trust—if I choose', colour: 'bg-launch-teal' },
                  { icon: Link2, label: 'Return to the original conversation at any time', colour: 'bg-launch-ink' },
                  { icon: CheckCircle2, label: 'Follow through—and mark it complete', colour: 'bg-launch-gold' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="relative mb-3 flex min-h-20 items-center border-b border-launch-gold/30 bg-launch-ivory px-5 py-4 last:mb-0 last:border-b-0">
                      <span className={`absolute -left-[43px] flex h-10 w-10 items-center justify-center rounded-full ${item.colour} text-primary-foreground shadow-sm`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-worksans text-base font-semibold text-launch-ink-deep md:text-lg">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-launch-ink-deep py-20 text-primary-foreground md:py-28">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-launch-teal/10" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-worksans text-xs font-bold uppercase tracking-normal text-launch-gold">Made for real cognitive load</p>
              <h2 className="mt-5 font-instrument text-4xl leading-tight md:text-5xl">
                Useful when life is full. Reassuring when memory or energy is harder.
              </h2>
              <p className="mt-6 font-worksans text-lg leading-8 text-primary-foreground/75">
                MyRhythm is designed for people rebuilding confidence after brain injury, navigating memory change, living with ADHD or stress—and for anyone whose responsibilities outrun the space in their head.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-md border border-primary-foreground/15 bg-primary-foreground/15 sm:grid-cols-3">
              {[
                { icon: Clock3, title: 'Less to hold', text: 'Important details have somewhere reliable to live.' },
                { icon: LockKeyhole, title: 'My control', text: 'I review, edit, share and retain on my terms.' },
                { icon: Brain, title: 'My rhythm', text: 'Timing guidance adapts, but never takes away my choice.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-launch-ink-deep p-6">
                    <Icon className="h-6 w-6 text-launch-teal" aria-hidden="true" />
                    <h3 className="mt-6 font-worksans text-lg font-bold">{item.title}</h3>
                    <p className="mt-3 font-worksans text-sm leading-6 text-primary-foreground/70">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-launch-cream-light py-24 text-center md:py-32">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <EditionBadge variant="inline" />
            <h2 className="mt-6 font-instrument text-4xl leading-tight text-launch-ink-deep md:text-6xl">
              I do not need to hold the whole plan in my head.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl font-worksans text-lg leading-8 text-launch-ink-deep/70">
              Founding Members help shape a simpler standard for turning important moments into meaningful follow-through.
            </p>
            <p className="mt-8 font-worksans text-sm font-semibold text-launch-ink-deep">
              Founding Edition · £10/month for life · 500 places
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-launch-gold/30 bg-launch-cream px-5 py-8 font-worksans text-sm text-launch-ink-deep/65">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>MyRhythm supports planning, memory and follow-through. It does not diagnose or treat any condition.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="link" onClick={() => navigate('/privacy')} className="min-h-11 px-0 text-launch-ink-deep/65">Privacy</Button>
            <Button variant="link" onClick={() => navigate('/launch/science')} className="min-h-11 px-0 text-launch-ink-deep/65">Evidence</Button>
          </div>
        </div>
      </footer>

      <MVPOnboardingModal isOpen={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />
    </div>
  );
}
