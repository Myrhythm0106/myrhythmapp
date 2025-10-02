import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  Brain,
  Heart,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";

export function UserGuideTimeline() {
  const navigate = useNavigate();
  const [hasRead, setHasRead] = useState(false);

  const timelineMilestones = [
    {
      period: "1 Week",
      icon: <Clock className="h-6 w-6" />,
      color: "from-clarity-teal-500 to-brain-health-500",
      achievements: [
        "Complete your first Memory Bridge recording",
        "Set up your daily calendar routine",
        "Familiarize yourself with the 4 core features",
        "Experience initial organization improvements"
      ]
    },
    {
      period: "1 Month",
      icon: <Brain className="h-6 w-6" />,
      color: "from-memory-emerald-500 to-clarity-teal-500",
      achievements: [
        "Notice reduced cognitive load and stress",
        "Build consistent daily habits with reminders",
        "See patterns in your cognitive health data",
        "Connect with your support circle effectively"
      ]
    },
    {
      period: "3 Months",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-brain-health-500 to-memory-emerald-500",
      achievements: [
        "Significant improvement in task completion",
        "Better memory retention and recall",
        "Stronger support network engagement",
        "Clear progress in cognitive assessments"
      ]
    },
    {
      period: "6 Months",
      icon: <Target className="h-6 w-6" />,
      color: "from-sunrise-amber-500 to-memory-emerald-500",
      achievements: [
        "Mastery of all MyRhythm features",
        "Noticeable cognitive performance gains",
        "Established sustainable daily rhythms",
        "Advanced progress tracking insights"
      ]
    },
    {
      period: "1 Year",
      icon: <Trophy className="h-6 w-6" />,
      color: "from-memory-emerald-600 to-brain-health-600",
      achievements: [
        "Transformative cognitive health improvements",
        "Consistent peak performance patterns",
        "Deep support circle integration",
        "Become a MyRhythm power user"
      ]
    },
    {
      period: "Beyond",
      icon: <Sparkles className="h-6 w-6" />,
      color: "from-brain-health-700 to-clarity-teal-600",
      achievements: [
        "Sustained long-term cognitive wellness",
        "Natural integration into daily life",
        "Help others on their journey",
        "Continued growth and optimization"
      ]
    }
  ];

  const handleComplete = () => {
    // Mark onboarding as complete
    localStorage.setItem('user_guide_completed', 'true');
    localStorage.setItem('onboarding_complete', 'true');
    
    // Navigate to ecosystem
    navigate('/ecosystem');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50 to-clarity-teal-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 bg-clip-text text-transparent mb-4">
            Your Journey Timeline
          </h1>
          <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
            When fully engaged with MyRhythm, here's what you can expect at each milestone
          </p>
        </motion.div>

        {/* Fully Engaged Definition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-12 bg-gradient-to-r from-clarity-teal-50 to-brain-health-50 border-2 border-clarity-teal-200">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-clarity-teal-500 to-brain-health-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brain-health-800 mb-3">
                    What Does "Fully Engaged" Mean?
                  </h3>
                  <ul className="space-y-2 text-brain-health-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-memory-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Using Memory Bridge regularly to capture important conversations and ideas</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-memory-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Checking your calendar daily and completing scheduled tasks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-memory-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Engaging with your support circle for accountability and connection</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-memory-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Tracking your progress and reviewing insights regularly</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-8 mb-12">
          {timelineMilestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Timeline Indicator */}
                    <div className={`w-24 bg-gradient-to-br ${milestone.color} flex flex-col items-center justify-center text-white p-6`}>
                      <div className="mb-2">
                        {milestone.icon}
                      </div>
                      <div className="text-center font-bold text-sm">
                        {milestone.period}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold text-brain-health-800 mb-4">
                        Expected Achievements
                      </h3>
                      <ul className="space-y-3">
                        {milestone.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-memory-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-brain-health-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Acknowledgment & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="space-y-6"
        >
          <Card className="bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 border-2 border-memory-emerald-200">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-memory-emerald-500" />
              <h3 className="text-2xl font-bold text-brain-health-800 mb-2">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-brain-health-700 mb-6 max-w-2xl mx-auto">
                Your transformation starts now. We're excited to be part of your cognitive health journey.
              </p>
              
              <Button
                onClick={handleComplete}
                size="lg"
                className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white px-8 py-6 text-lg"
              >
                Let's Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-brain-health-600">
            <p>Questions? Visit our <a href="/help" className="text-clarity-teal-600 hover:underline">Help Center</a> anytime</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
