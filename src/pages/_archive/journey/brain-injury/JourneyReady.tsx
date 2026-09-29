import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mic, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JourneyLayout } from '@/components/journey/JourneyLayout';
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation';
import confetti from 'canvas-confetti';

export default function JourneyReady() {
  const navigate = useNavigate();
  const { state, completeJourney } = useJourneyNavigation();
  const [showQuickWin, setShowQuickWin] = useState(false);

  // Celebration confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F97316', '#FB923C', '#FDBA74', '#22C55E', '#4ADE80']
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleGoToDashboard = () => {
    completeJourney();
  };

  const handleTryQuickWin = () => {
    setShowQuickWin(true);
    // Navigate to Memory Bridge with quick record mode
    completeJourney();
    setTimeout(() => {
      navigate('/launch/memory');
    }, 100);
  };

  const getPersonalizedMessage = () => {
    const { energyLevel, profile } = state;
    
    if (energyLevel === 'low') {
      return "We've set things up to be gentle on your energy. Small steps lead to big progress.";
    } else if (energyLevel === 'high') {
      return "You're ready to make the most of your energy! Let's capture your momentum.";
    }
    return "Your personalized experience is ready. Every feature is designed to support you.";
  };

  const userName = state.profile?.name?.split(' ')[0] || 'there';

  return (
    <JourneyLayout
      currentStep={5}
      totalSteps={5}
      showBack={false}
    >
      {/* Celebration Hero */}
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 flex items-center justify-center mb-6 shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Welcome, {userName}! 🎉
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {getPersonalizedMessage()}
        </motion.p>
      </div>

      {/* What's Ready Card */}
      <motion.div
        className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Your toolkit is ready:
        </h2>
        <ul className="space-y-3">
          {[
            'Memory Bridge to capture conversations',
            'Daily Actions to pace your energy',
            'Calendar to stay organized',
            state.hasSupport ? 'Support Circle to keep you connected' : null
          ].filter(Boolean).map((item, index) => (
            <motion.li
              key={index}
              className="flex items-center gap-3 text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <CheckCircle2 className="w-5 h-5 text-memory-emerald-500 flex-shrink-0" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Quick Win Prompt */}
      <motion.div
        className="bg-gradient-to-br from-brand-orange-50 to-amber-50 dark:from-brand-orange-500/10 dark:to-amber-500/10 rounded-2xl p-6 border-2 border-brand-orange-200 dark:border-brand-orange-500/30 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-brand-orange-500 flex items-center justify-center mb-4 shadow-lg">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Quick Win: Record Your First Note
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try Memory Bridge now — just tap and talk for 10 seconds
          </p>
          <Button
            onClick={handleTryQuickWin}
            variant="outline"
            className="h-12 px-6 text-base font-medium rounded-xl border-2 border-brand-orange-500 text-brand-orange-600 hover:bg-brand-orange-50"
          >
            <Play className="w-5 h-5 mr-2" />
            Try It Now
          </Button>
        </div>
      </motion.div>

      {/* Main CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Button
          onClick={handleGoToDashboard}
          className="w-full h-16 text-lg font-semibold rounded-xl bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          Go to My Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>

      {/* Footer Note */}
      <motion.p
        className="text-center text-xs text-muted-foreground mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        You can always adjust settings later in your profile
      </motion.p>
    </JourneyLayout>
  );
}
