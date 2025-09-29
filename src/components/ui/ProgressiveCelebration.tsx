import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProgressiveCelebrationProps {
  milestone: 'first_recording' | 'first_action' | 'first_schedule' | 'week_complete' | 'month_complete';
  onContinue?: () => void;
  className?: string;
}

export function ProgressiveCelebration({ 
  milestone, 
  onContinue,
  className = ""
}: ProgressiveCelebrationProps) {
  const getMilestoneConfig = () => {
    switch (milestone) {
      case 'first_recording':
        return {
          icon: Sparkles,
          title: "First Recording Complete!",
          message: "You've taken the first step in your Memory1st journey. Your voice has been captured and is ready for AI analysis.",
          achievement: "Voice Capture Master",
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-purple-50"
        };
      case 'first_action':
        return {
          icon: CheckCircle2,
          title: "First Action Extracted!",
          message: "Amazing! MyRhythm has identified your first actionable commitment. This is where transformation begins.",
          achievement: "Action Identifier",
          color: "from-emerald-500 to-green-500",
          bgColor: "bg-emerald-50"
        };
      case 'first_schedule':
        return {
          icon: TrendingUp,
          title: "First Smart Schedule!",
          message: "Incredible progress! You've scheduled your first action with AI assistance. Your personal assistant is working perfectly.",
          achievement: "Smart Scheduler",
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50"
        };
      case 'week_complete':
        return {
          icon: Star,
          title: "One Week Strong!",
          message: "Seven days of consistent progress with MyRhythm. You're building powerful habits for lifelong success.",
          achievement: "Weekly Champion",
          color: "from-amber-500 to-orange-500",
          bgColor: "bg-amber-50"
        };
      case 'month_complete':
        return {
          icon: Star,
          title: "One Month Milestone!",
          message: "30 days of empowered living with MyRhythm. You've proven the power of consistency and smart assistance.",
          achievement: "Monthly Legend",
          color: "from-violet-500 to-purple-600",
          bgColor: "bg-violet-50"
        };
      default:
        return {
          icon: Sparkles,
          title: "Great Progress!",
          message: "Keep up the amazing work!",
          achievement: "Progress Maker",
          color: "from-blue-500 to-purple-500",
          bgColor: "bg-blue-50"
        };
    }
  };

  const config = getMilestoneConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="max-w-md w-full"
      >
        <Card className={`${config.bgColor} border-0 shadow-2xl overflow-hidden`}>
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="relative"
            >
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mx-auto`}>
                <IconComponent className="h-10 w-10 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-2 border-dashed border-current/30 rounded-full"
              />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{config.message}</p>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${config.color} text-white text-sm font-medium`}
            >
              <Star className="h-4 w-4 mr-2" />
              Achievement Unlocked: {config.achievement}
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <Button
                onClick={onContinue}
                className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white shadow-lg`}
                size="lg"
              >
                Continue Your Journey
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}