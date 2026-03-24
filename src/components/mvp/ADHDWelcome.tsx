import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Timer, Mic, Trophy, ArrowRight } from 'lucide-react';

interface ADHDWelcomeProps {
  onStartJourney: () => void;
}

export function ADHDWelcome({ onStartJourney }: ADHDWelcomeProps) {
  const features = [
    {
      icon: Timer,
      title: 'Focus-Friendly Timers',
      description: 'Pomodoro-style sessions designed for fast-moving minds — work in bursts, rest without guilt'
    },
    {
      icon: Mic,
      title: 'Impulse Capture',
      description: 'Memory Bridge grabs your ideas the moment they spark — voice, text, or tap — so nothing gets lost'
    },
    {
      icon: Zap,
      title: 'Dopamine-Friendly Tasks',
      description: 'Smart chunking breaks big projects into satisfying micro-wins that keep momentum flowing'
    },
    {
      icon: Trophy,
      title: 'Celebration Streaks',
      description: 'Every completed task earns a win. Stack streaks, unlock encouragement, and feel the progress'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full mb-6 shadow-lg">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent">
            Your Fast-Moving Mind Is Your Superpower
          </h1>
          <p className="text-lg text-purple-600 mb-2 italic">
            No shame. No labels. Just tools that actually work for you.
          </p>
          <p className="text-xl text-purple-700 max-w-2xl mx-auto">
            MyRhythm works with your brain, not against it — capturing ideas, chunking tasks, and celebrating every win.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-purple-700">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
            <CardContent className="p-4">
              <p className="text-sm text-purple-600 text-center">
                <strong>Important:</strong> MyRhythm is a life empowerment and productivity app. It is not a medical device and does not provide diagnosis, treatment, or clinical advice.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-purple-500 to-violet-500 border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Empower Your Day. Own Your Rhythm.
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Join thousands of fast-thinking minds using MyRhythm to channel their energy into unstoppable momentum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={onStartJourney}
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-200"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start 7-Day Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
              <p className="text-white/80 text-sm mt-4">
                No credit card charged for 7 days • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
