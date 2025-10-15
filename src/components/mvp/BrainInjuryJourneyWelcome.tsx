import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Mic, Calendar, LineChart, Target, CheckCircle, ArrowRight } from 'lucide-react';

interface BrainInjuryJourneyWelcomeProps {
  onStartJourney: () => void;
}

export function BrainInjuryJourneyWelcome({ onStartJourney }: BrainInjuryJourneyWelcomeProps) {
  const journeySteps = [
    {
      icon: Target,
      title: "Take Control",
      description: "Complete a brief assessment to understand your unique cognitive patterns. You decide what areas to focus on."
    },
    {
      icon: Mic,
      title: "Capture Your Thoughts",
      description: "Record conversations, ideas, or reminders with one tap. Your AI assistant organizes everything for you."
    },
    {
      icon: Calendar,
      title: "Plan Your Day",
      description: "Get personalized daily plans based on your energy levels and goals. You're in charge of your schedule."
    },
    {
      icon: LineChart,
      title: "Track Your Progress",
      description: "See your cognitive improvements over time. Celebrate every win, no matter how small."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-clarity-teal-50 to-memory-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full mb-6 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brain-health-700 to-clarity-teal-700 bg-clip-text text-transparent">
            You're the CEO of Your Recovery
          </h1>
          <p className="text-xl text-brain-health-700 max-w-2xl mx-auto">
            MyRhythm puts you in control of your cognitive health journey. No appointments, no waiting—just tools that work when you need them.
          </p>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-brain-health-800">
                Why Brain Injury Survivors Choose MyRhythm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-memory-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-brain-health-900 mb-1">Independence</h3>
                    <p className="text-sm text-brain-health-700">
                      Manage your daily life without constant reminders from others. You're in charge.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-memory-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-brain-health-900 mb-1">Clarity</h3>
                    <p className="text-sm text-brain-health-700">
                      Record conversations and get AI-generated summaries. Never lose important information again.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-memory-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-brain-health-900 mb-1">Confidence</h3>
                    <p className="text-sm text-brain-health-700">
                      Track your progress and see proof that you're improving. Every small win matters.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-memory-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-brain-health-900 mb-1">Control</h3>
                    <p className="text-sm text-brain-health-700">
                      You decide what to work on, when to work on it, and how to measure success.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Journey Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-brain-health-800">
            Your Journey in 4 Simple Steps
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {journeySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
                          <step.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-brain-health-600">Step {index + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-brain-health-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-brain-health-700">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Join thousands of brain injury survivors who've regained their independence with MyRhythm.
              </p>
              <Button
                onClick={onStartJourney}
                size="lg"
                className="bg-white text-brain-health-700 hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                <Brain className="h-5 w-5 mr-2" />
                Start Your Journey Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-white/80 text-sm mt-4">
                7-day free trial • No credit card required • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
