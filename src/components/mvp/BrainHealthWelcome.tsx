import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Zap, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

interface BrainHealthWelcomeProps {
  onStartJourney: () => void;
}

export function BrainHealthWelcome({ onStartJourney }: BrainHealthWelcomeProps) {
  const features = [
    {
      icon: Target,
      title: 'Peak Performance',
      description: 'Track cognitive patterns and optimize daily routines for maximum mental clarity'
    },
    {
      icon: TrendingUp,
      title: 'Memory Enhancement',
      description: 'Capture and organize thoughts effortlessly with AI-powered tools'
    },
    {
      icon: Zap,
      title: 'Stress Resilience',
      description: 'Build mental fitness through guided exercises and mindfulness practices'
    },
    {
      icon: BookOpen,
      title: 'Lifelong Learning',
      description: 'Stay sharp with brain-friendly tools designed for cognitive wellness'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-purple-50 to-neural-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neural-purple-500 to-neural-blue-500 rounded-full mb-6 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neural-purple-700 to-neural-blue-700 bg-clip-text text-transparent">
            Optimize Your Cognitive Wellness
          </h1>
          <p className="text-lg text-neural-indigo-600 mb-2 italic">
            No One Walks Alone in Brain Health
          </p>
          <p className="text-xl text-neural-indigo-700 max-w-2xl mx-auto">
            Whether you're looking to sharpen focus, boost memory, or maintain mental clarity—MyRhythm adapts to your goals.
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
                        <div className="w-12 h-12 bg-gradient-to-br from-neural-purple-500 to-neural-blue-500 rounded-full flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neural-indigo-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-neural-indigo-700">
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
          <Card className="bg-white/70 backdrop-blur-sm border-neural-purple-200">
            <CardContent className="p-4">
              <p className="text-sm text-neural-indigo-600 text-center">
                <strong>Important:</strong> MyRhythm is a cognitive wellness and productivity app, not a medical device.
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
          <Card className="bg-gradient-to-br from-neural-purple-500 to-neural-blue-500 border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Start Your Brain Health Journey
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Join others optimizing their cognitive wellness with MyRhythm's science-backed approach.
              </p>
              <Button
                onClick={onStartJourney}
                size="lg"
                className="bg-white text-neural-purple-700 hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                <Brain className="h-5 w-5 mr-2" />
                Begin Optimization
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
