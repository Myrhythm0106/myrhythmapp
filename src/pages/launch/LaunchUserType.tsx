import React from 'react';
import { JourneySteps } from '@/components/launch/JourneySteps';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Compass, Anchor, Target, BookOpen, Waves, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LaunchPageHeader } from '@/components/launch/LaunchPageHeader';
import { setResumePoint } from '@/launch/onboarding/resumePoint';
import { useLaunchStartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';
import { useAuth } from '@/hooks/useAuth';
import { LaunchFirstWelcome } from '@/components/launch/LaunchFirstWelcome';

/** Everyone MyRhythm is built for — all shown up front so I can see myself straight away. */
const userTypes = [
  {
    id: 'brain-injury',
    title: "I'm rebuilding after a brain injury or brain change",
    definition: 'Brain injury, stroke, long COVID, MS or memory changes — getting back to home, family and work.',
    icon: Compass,
    color: 'bg-launch-ink',
    iconColor: 'text-launch-gold',
  },
  {
    id: 'caregiver',
    title: 'I support someone I care about',
    definition: 'Family carer, partner, adult child or friend — keeping track for them without losing my own day.',
    icon: Anchor,
    color: 'bg-launch-moss',
    iconColor: 'text-launch-cream',
  },
  {
    id: 'everyday',
    title: 'I have too much to hold in my head',
    definition: 'Stress, overwhelm, burnout or ADHD — things slip, and I want to feel on top of them again.',
    icon: Waves,
    color: 'bg-launch-teal',
    iconColor: 'text-launch-cream',
  },
  {
    id: 'executive',
    title: 'I want to stay sharp at work',
    definition: 'Meetings, promises and deadlines — including returning to work — kept and followed through.',
    icon: Target,
    color: 'bg-launch-ember',
    iconColor: 'text-launch-cream',
  },
  {
    id: 'student',
    title: "I'm studying or learning",
    definition: 'Lectures, revision and deadlines — paced for what I remember, not burnout.',
    icon: BookOpen,
    color: 'bg-launch-gold',
    iconColor: 'text-launch-ink',
  },
];

export default function LaunchUserType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const afterSnapshot = searchParams.get('after') === 'snapshot';
  const fromSettings = searchParams.get('from') === 'settings';
  const [picked, setPicked] = React.useState(false);

  React.useEffect(() => {
    if (!afterSnapshot) setResumePoint('/launch/user-type');
  }, [afterSnapshot]);

  const { style, chooseStyle } = useLaunchStartingStyle();
  const { user } = useAuth();
  const firstName = ((user?.user_metadata as { name?: string } | undefined)?.name ?? '').split(' ')[0];

  const finishPersonalisation = () => {
    localStorage.setItem('myrhythm_make_it_yours_seen', '1');
    localStorage.removeItem('myrhythm_intent');
    navigate(fromSettings ? '/launch/settings' : '/launch/home?welcome=1');
  };

  // After choosing who it's for: a short welcome (once), then the questions.
  const continueSetup = () => {
    if (afterSnapshot) {
      finishPersonalisation();
      return;
    }
    if (style === null) {
      setPicked(true);
      return;
    }
    navigate('/launch/assessment?first=1');
  };

  const handleSelect = (userTypeId: string) => {
    localStorage.setItem('myrhythm_user_type', userTypeId);
    localStorage.setItem('myrhythm_starting_point_seen', '1');
    localStorage.setItem('myrhythm_make_it_yours_seen', '1');
    continueSetup();
  };

  const notSure = () => {
    if (!afterSnapshot) localStorage.removeItem('myrhythm_user_type');
    localStorage.setItem('myrhythm_starting_point_seen', '1');
    localStorage.setItem('myrhythm_make_it_yours_seen', '1');
    continueSetup();
  };

  if (picked && user && style === null) {
    return (
      <div className="h-full min-h-0 overflow-y-auto bg-launch-cream-light pt-safe pb-safe px-safe">
        <LaunchFirstWelcome
          name={firstName}
          onChoose={(next) => {
            chooseStyle(next);
            navigate(next === 'explore' ? '/launch/home' : '/launch/assessment?first=1');
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 bg-launch-cream-light flex flex-col pt-safe pb-safe px-safe">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-6 px-4 pb-10">
        <div className="max-w-4xl mx-auto">
          <LaunchPageHeader fallbackPath={fromSettings ? '/launch/settings' : '/launch/register'} />
          {!afterSnapshot && <JourneySteps current={2} canSaveLater className="mb-8" />}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-launch-ink mb-3 font-display">
              {firstName ? `Welcome, ${firstName}. ` : ''}What brings me to MyRhythm?
            </h1>
            <p className="text-lg text-launch-ink-deep max-w-xl mx-auto">
              MyRhythm is for anyone who wants to remember what matters and follow through. I choose the one that fits best — it only changes the words and examples I see.
            </p>
          </motion.div>

          <ul className="grid md:grid-cols-2 gap-3 mb-6" aria-label="Who MyRhythm is for">
            {userTypes.map((type, index) => (
              <motion.li
                key={type.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={index === userTypes.length - 1 ? 'md:col-span-2 md:mx-auto md:w-1/2' : ''}
              >
                <Button
                  variant="outline"
                  className="h-auto min-h-14 w-full whitespace-normal rounded-2xl p-4 text-left transition-all duration-300 border-2 border-launch-gold/30 hover:border-launch-gold hover:shadow-lg bg-launch-ivory"
                  onClick={() => handleSelect(type.id)}
                >
                  <span className="flex w-full items-start gap-4">
                    <span className={`w-11 h-11 ${type.color} rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-launch-gold/30`}>
                      <type.icon className={`h-5 w-5 ${type.iconColor}`} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-launch-ink-deep mb-1 text-lg leading-snug">{type.title}</span>
                      <span className="block text-base font-normal text-launch-ink-deep/80 leading-relaxed">{type.definition}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-launch-ink mt-1" aria-hidden="true" />
                  </span>
                </Button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-3 bg-launch-cream-light border-t border-launch-gold/10">
        <div className="text-center space-y-1">
          <Button
            variant="ghost"
            onClick={notSure}
            className="min-h-14 whitespace-normal text-base text-launch-ink-deep underline underline-offset-4"
          >
            {fromSettings ? 'Back to Settings' : afterSnapshot ? 'Not now — go to Home' : "I'm not sure — carry on"}
          </Button>
          <p className="text-base leading-relaxed text-launch-ink-deep">I can change this any time in Settings.</p>
        </div>
      </div>
    </div>
  );
}
