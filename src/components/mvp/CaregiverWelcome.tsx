import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, LineChart, Shield, ArrowRight } from 'lucide-react';

interface CaregiverWelcomeProps {
  onContinue?: () => void;
  onStartJourney?: () => void;
}

export function CaregiverWelcome({ onContinue, onStartJourney }: CaregiverWelcomeProps) {
  const handleClick = () => {
    if (onContinue) onContinue();
    else if (onStartJourney) onStartJourney();
  };
  const features = [
    {
      icon: Users,
      title: 'Stay Connected',
      description: 'Join their Support Circle and see what matters most to your loved one'
    },
    {
      icon: Calendar,
      title: 'Coordinate Care',
      description: 'Shared calendar for appointments, reminders, and daily activities'
    },
    {
      icon: LineChart,
      title: 'Track Progress Together',
      description: 'Celebrate wins together with visual progress tracking and milestones'
    },
    {
      icon: Shield,
      title: 'Self-Care Tools',
      description: 'Manage your own wellness while supporting others—you matter too'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-orange-50 to-neural-magenta-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-orange-500 to-neural-magenta-500 rounded-full mb-6 shadow-lg">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-orange-700 to-neural-magenta-700 bg-clip-text text-transparent">
            Support Your Loved One with Confidence
          </h1>
          <p className="text-lg text-brand-orange-600 mb-2 italic">
            No One Walks Alone—Especially Not Caregivers
          </p>
          <p className="text-xl text-brand-orange-700 max-w-2xl mx-auto">
            MyRhythm helps you stay connected, organized, and empowered as you support someone's cognitive health journey.
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
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-500 to-neural-magenta-500 rounded-full flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-brand-orange-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-brand-orange-700">
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
          <Card className="bg-white/70 backdrop-blur-sm border-brand-orange-200">
            <CardContent className="p-4">
              <p className="text-sm text-brand-orange-600 text-center">
                <strong>Important:</strong> MyRhythm is a support coordination and wellness app, not a medical device.
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
          <Card className="bg-gradient-to-br from-brand-orange-500 to-neural-magenta-500 border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Start Supporting Today
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Join caregivers who've found balance and confidence with MyRhythm's coordinated care tools.
              </p>
              <Button
                onClick={handleClick}
                size="lg"
                className="bg-white text-brand-orange-700 hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                <Heart className="h-5 w-5 mr-2" />
                Begin Your Care Journey
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
