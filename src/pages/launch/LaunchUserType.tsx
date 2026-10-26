import React from 'react';
import { JourneySteps } from '@/components/launch/JourneySteps';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Compass, Anchor, Target, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LaunchPageHeader } from '@/components/launch/LaunchPageHeader';
import { setResumePoint } from '@/launch/onboarding/resumePoint';

const userTypes = [
  {
    id: 'brain-injury',
    title: 'I have had a brain injury or brain change',
    definition:
      'Brain injury, stroke, dementia, long COVID, MS, ADHD — finding your rhythm again, one steady step at a time.',
    icon: Compass,
    color: 'bg-launch-ink',
    iconColor: 'text-launch-gold',
  },
  {
    id: 'caregiver',
    title: 'I support someone with a brain injury or brain change',
    definition:
      'Family carer, spouse, adult child — holding it together for them, without losing your own day.',
    icon: Anchor,
    color: 'bg-launch-moss',
    iconColor: 'text-launch-cream',
  },
  {
    id: 'executive',
    title: 'Protecting my focus at work',
    definition:
      'Busy professional defending deep work, clear thinking and your best hours from the noise.',
    icon: Target,
    color: 'bg-launch-ember',
    iconColor: 'text-launch-cream',
  },
  {
    id: 'student',
    title: 'Studying and learning',
    definition:
      'Student or lifelong learner pacing yourself toward recall and confidence — not burnout.',
    icon: BookOpen,
    color: 'bg-launch-gold',
    iconColor: 'text-launch-ink',
  },
];

export default function LaunchUserType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const afterSnapshot = searchParams.get('after') === 'snapshot';
  const [showOtherChoices, setShowOtherChoices] = React.useState(false);

  React.useEffect(() => {
    if (!afterSnapshot) setResumePoint('/launch/user-type');
  }, [afterSnapshot]);

  const finishPersonalisation = () => {
    localStorage.setItem('myrhythm_make_it_yours_seen', '1');
    localStorage.removeItem('myrhythm_intent');
    navigate('/launch/home?welcome=1');
  };

  const handleSelect = (userTypeId: string) => {
    localStorage.setItem('myrhythm_user_type', userTypeId);
    localStorage.setItem('myrhythm_starting_point_seen', '1');
    localStorage.setItem('myrhythm_make_it_yours_seen', '1');
    if (afterSnapshot) {
      finishPersonalisation();
      return;
    }
    navigate('/launch/assessment?first=1');
  };

  const { style, chooseStyle } = useLaunchStartingStyle();
  const { user } = useAuth();
  const firstName = ((user?.user_metadata as { name?: string } | undefined)?.name ?? '').split(' ')[0];

  if (!afterSnapshot && user && style === null) {
    return (
      <div className="h-full min-h-0 overflow-y-auto bg-launch-cream-light pt-safe pb-safe px-safe">
        <LaunchFirstWelcome
          name={firstName}
          onChoose={(next) => {
            chooseStyle(next);
            if (next === 'explore') navigate('/launch/home');
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 bg-launch-cream-light flex flex-col pt-safe pb-safe px-safe">

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-6 px-4 pb-10">
        <div className="max-w-4xl mx-auto">
          <LaunchPageHeader fallbackPath="/launch/register" />
          {!afterSnapshot && <JourneySteps current={2} canSaveLater className="mb-8" />}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-launch-gold/10 rounded-full mb-4 border border-launch-gold/30">
              <Sparkles className="h-4 w-4 text-launch-ember" />
              <span className="text-sm font-medium text-launch-ink">Personalize Your Experience</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-launch-ink mb-3 font-display">
              What brings you to MyRhythm?
            </h1>
            <p className="text-lg text-launch-ink/70 max-w-xl mx-auto">
              {afterSnapshot
                ? 'Optional — this helps MyRhythm use the right words and examples for you.'
                : 'Choose what fits your life. This helps us use relevant words and examples in your questions and free snapshot.'}
            </p>
          </motion.div>

          {/* User Type Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {userTypes.filter((_, index) => showOtherChoices || index < 2).map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="h-auto min-h-14 w-full whitespace-normal rounded-lg p-5 text-left hover:shadow-lg transition-all duration-300 border-2 border-launch-gold/30 hover:border-launch-gold bg-launch-ivory"
                  onClick={() => handleSelect(type.id)}
                >
                    <span className="flex w-full items-start gap-4">
                      <span className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-launch-gold/30`}>
                        <type.icon className={`h-6 w-6 ${type.iconColor}`} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-launch-ink-deep mb-2 text-lg leading-relaxed">{type.title}</span>
                        <span className="block text-base font-normal text-launch-ink-deep leading-relaxed">{type.definition}</span>
                      </span>
                      <ArrowRight className="h-5 w-5 shrink-0 text-launch-ink mt-1" aria-hidden="true" />
                    </span>
                </Button>
              </motion.div>
            ))}
          </div>
          <Button variant="ghost" className="min-h-14 w-full whitespace-normal text-base text-launch-ink-deep" aria-expanded={showOtherChoices} onClick={() => setShowOtherChoices((value) => !value)}>
            {showOtherChoices ? 'Show fewer choices' : 'Work, study or another starting point'}
          </Button>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="flex-shrink-0 px-4 py-4 bg-launch-cream-light border-t border-launch-gold/10">
        <div className="text-center space-y-1">
          <Button variant="ghost"
            onClick={() => {
              if (afterSnapshot) {
                finishPersonalisation();
                return;
              }
              localStorage.removeItem('myrhythm_user_type');
              localStorage.setItem('myrhythm_starting_point_seen', '1');
              localStorage.setItem('myrhythm_make_it_yours_seen', '1');
              navigate('/launch/assessment?first=1');
            }}
            className="min-h-14 whitespace-normal text-base text-launch-ink-deep underline underline-offset-4"
          >
            {afterSnapshot ? 'Not now — go to Home' : 'Not now — start my questions'}
          </Button>
          <p className="text-base leading-relaxed text-launch-ink-deep">You can change this any time in Settings.</p>
        </div>
      </div>
    </div>
  );
}

