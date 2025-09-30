import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, TrendingUp, Heart } from 'lucide-react';

interface ConnectionMoment {
  id: string;
  type: 'milestone' | 'community' | 'streak' | 'support';
  message: string;
  icon: React.ElementType;
}

const moments: ConnectionMoment[] = [
  {
    id: '1',
    type: 'community',
    message: '10 people completed their first recording today - including you!',
    icon: Users
  },
  {
    id: '2',
    type: 'streak',
    message: 'You and 500 others stayed consistent this week 🎉',
    icon: TrendingUp
  },
  {
    id: '3',
    type: 'milestone',
    message: '30-day milestone: You\'re building a lasting rhythm!',
    icon: Sparkles
  },
  {
    id: '4',
    type: 'support',
    message: 'Your support circle sent 3 encouragement messages this week',
    icon: Heart
  }
];

export function ConnectionMoments() {
  const [currentMoment, setCurrentMoment] = useState<ConnectionMoment | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show a random moment every 30 seconds
    const interval = setInterval(() => {
      const randomMoment = moments[Math.floor(Math.random() * moments.length)];
      setCurrentMoment(randomMoment);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 30000);

    // Show first moment after 5 seconds
    setTimeout(() => {
      const randomMoment = moments[Math.floor(Math.random() * moments.length)];
      setCurrentMoment(randomMoment);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!currentMoment) return null;

  const Icon = currentMoment.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <div className="bg-gradient-to-r from-primary/95 to-accent/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg border border-white/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed">
                  {currentMoment.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
