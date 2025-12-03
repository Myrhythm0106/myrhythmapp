import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Mic, ListTodo, Sparkles, ArrowRight } from 'lucide-react';

interface CognitiveSupportWelcomeProps {
  onStartJourney: () => void;
}

export function CognitiveSupportWelcome({ onStartJourney }: CognitiveSupportWelcomeProps) {
  const features = [
    {
      icon: Zap,
      title: 'ADHD-Friendly',
      description: 'Visual reminders, Pomodoro timers, and one-tap capture for racing minds'
    },
    {
      icon: Mic,
      title: 'Memory Assist',
      description: 'Never lose a thought with Memory Bridge voice capture and AI organization'
    },
    {
      icon: ListTodo,
      title: 'Executive Function Support',
      description: 'Break down tasks, set priorities, and celebrate progress at your own pace'
    },
    {
      icon: Sparkles,
      title: 'Flexible Structure',
      description: 'Choose guided routines or explorer mode—your brain, your rules'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-clarity-teal-50 to-brain-health-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-clarity-teal-500 to-brain-health-500 rounded-full mb-6 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-clarity-teal-700 to-brain-health-700 bg-clip-text text-transparent">
            Your Brain Works Differently—And That's Your Superpower
          </h1>
          <p className="text-lg text-clarity-teal-600 mb-2 italic">
            No One Walks Alone with ADHD, Memory Challenges, or Cognitive Differences
          </p>
          <p className="text-xl text-clarity-teal-700 max-w-2xl mx-auto">
            MyRhythm is built for minds that think outside the box—with tools that actually work for you.
          </p>
        </motion.div>

        {/* Value Props */}
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
                        <div className="w-12 h-12 bg-gradient-to-br from-clarity-teal-500 to-brain-health-500 rounded-full flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-clarity-teal-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-clarity-teal-700">
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
          <Card className="bg-white/70 backdrop-blur-sm border-clarity-teal-200">
            <CardContent className="p-4">
              <p className="text-sm text-clarity-teal-600 text-center">
                <strong>Important:</strong> MyRhythm is a cognitive wellness and productivity app, not a medical device or diagnostic tool.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-clarity-teal-500 to-brain-health-500 border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Start Your Cognitive Wellness Journey
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Join others embracing their unique cognitive style with MyRhythm's flexible tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = '/launch/register?userType=cognitive-optimization'}
                  size="lg"
                  className="bg-white text-clarity-teal-700 hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-200"
                >
                  <Brain className="h-5 w-5 mr-2" />
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
