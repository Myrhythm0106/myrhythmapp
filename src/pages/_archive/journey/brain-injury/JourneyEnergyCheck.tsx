import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Cloud, Moon, Sparkles } from 'lucide-react';
import { JourneyLayout } from '@/components/journey/JourneyLayout';
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation';

type EnergyLevel = 'high' | 'moderate' | 'low';

interface EnergyOption {
  level: EnergyLevel;
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
}

const energyOptions: EnergyOption[] = [
  {
    level: 'high',
    icon: <Sun className="w-8 h-8" />,
    title: "Feeling Strong",
    description: "Ready to take on today",
    colorClass: "text-amber-600",
    bgClass: "bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 hover:border-amber-400"
  },
  {
    level: 'moderate',
    icon: <Cloud className="w-8 h-8" />,
    title: "Steady Pace",
    description: "Taking it one step at a time",
    colorClass: "text-blue-600",
    bgClass: "bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200 hover:border-blue-400"
  },
  {
    level: 'low',
    icon: <Moon className="w-8 h-8" />,
    title: "Conserving Energy",
    description: "Being gentle with myself today",
    colorClass: "text-purple-600",
    bgClass: "bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200 hover:border-purple-400"
  }
];

export default function JourneyEnergyCheck() {
  const navigate = useNavigate();
  const { updateState } = useJourneyNavigation();

  const handleSelect = (level: EnergyLevel) => {
    updateState({ energyLevel: level, currentStep: 3 });
    navigate('/journey/brain-injury/assessment');
  };

  const handleBack = () => {
    navigate('/journey/brain-injury/register');
  };

  return (
    <JourneyLayout
      currentStep={2}
      totalSteps={5}
      onBack={handleBack}
      showBack={true}
    >
      {/* Hero Section */}
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 flex items-center justify-center mb-6 shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          How are you feeling right now?
        </motion.h1>

        <motion.p
          className="text-base text-muted-foreground max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          We'll adjust your experience to match your energy
        </motion.p>
      </div>

      {/* Energy Selection Cards */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {energyOptions.map((option, index) => (
          <motion.button
            key={option.level}
            onClick={() => handleSelect(option.level)}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 ${option.bgClass} active:scale-[0.98]`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-white/60 ${option.colorClass}`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {option.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Reassurance */}
      <motion.p
        className="text-center text-sm text-muted-foreground mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        There's no wrong answer — this helps us support you better
      </motion.p>
    </JourneyLayout>
  );
}
