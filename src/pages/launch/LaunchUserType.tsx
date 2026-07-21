import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Anchor, Target, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LaunchPageHeader } from '@/components/launch/LaunchPageHeader';
import { LaunchQuickActions } from '@/components/launch/LaunchQuickActions';

const userTypes = [
  {
    id: 'brain-injury',
    title: 'Rebuilding after a brain change',
    definition:
      'Brain injury, stroke, dementia, long COVID, MS — finding your rhythm again, one steady step at a time.',
    icon: Compass,
    color: 'bg-launch-ink',
    iconColor: 'text-launch-gold',
  },
  {
    id: 'caregiver',
    title: 'Caring for someone I love',
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

  const handleSelect = (userTypeId: string) => {
    localStorage.setItem('myrhythm_user_type', userTypeId);
    navigate('/launch/assessment');
  };


  return (
    <div className="min-h-screen h-screen bg-launch-cream-light flex flex-col overflow-hidden">

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <LaunchPageHeader fallbackPath="/launch/register" />

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
              We'll tailor your experience based on your unique needs
            </p>
          </motion.div>

          {/* User Type Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-launch-gold/50 bg-launch-ivory"
                  onClick={() => handleSelect(type.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-launch-gold/30`}>
                        <type.icon className={`h-6 w-6 ${type.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-launch-ink mb-2 text-lg">{type.title}</h3>
                        <p className="text-base text-launch-ink/70 leading-relaxed">{type.definition}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-launch-gold mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="flex-shrink-0 px-4 py-4 pb-8 bg-launch-cream-light border-t border-launch-gold/10">
        <div className="text-center space-y-1">
          <button
            onClick={() => {
              localStorage.setItem('myrhythm_user_type', 'brain-injury');
              navigate('/launch/assessment');
            }}
            className="text-sm text-launch-ink/70 hover:text-launch-ink underline underline-offset-4"
          >
            I'm not sure yet — show me around
          </button>
          <p className="text-xs text-launch-ink/40">You can change this any time in Settings.</p>
        </div>
      </div>
      <LaunchQuickActions />
    </div>
  );
}

