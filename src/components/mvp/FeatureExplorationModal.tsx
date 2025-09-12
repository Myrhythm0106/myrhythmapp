import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Calendar, Activity, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureExplorationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  feature: 'capture' | 'calendar' | 'calibrate' | 'community' | null;
}

const featureDetails = {
  capture: {
    title: 'Capture — Your Memory Bridge',
    icon: Brain,
    color: 'from-memory-emerald-500 to-brain-health-500',
    description: 'Never lose precious moments. Intelligent capture system for conversations, appointments, and memories.',
    detailedDescription: 'Perfect for those moments when your memory needs support. Our intelligent capture system helps you record and organize important conversations, appointments, and memories so nothing precious gets lost.',
    benefits: [
      'Voice recording with intelligent transcription',
      'Automatic conversation summaries',
      'Memory prompts and reminders',
      'Secure, private storage',
      'Easy search and retrieval',
      'Integration with your daily rhythm'
    ]
  },
  calendar: {
    title: 'Commit — Your MyRhythm Calendar',
    icon: Calendar,
    color: 'from-brain-health-500 to-clarity-teal-500',
    description: 'Transform overwhelm into organized action. Your calendar that adapts to your energy and cognitive patterns throughout the day.',
    detailedDescription: 'Say goodbye to overwhelming schedules. Our adaptive calendar system understands your cognitive patterns and energy levels, helping you organize tasks when you\'re most capable.',
    benefits: [
      'Energy-aware scheduling',
      'Cognitive load balancing',
      'Flexible task management',
      'Gentle reminder system',
      'Progress celebration',
      'Personalized rhythm optimization'
    ]
  },
  calibrate: {
    title: 'Calibrate — Mood & Energy Check-ins',
    icon: Activity,
    color: 'from-clarity-teal-500 to-sunrise-amber-500',
    description: 'Personalized wellness tracking that understands your unique rhythm and helps optimize your daily patterns.',
    detailedDescription: 'Understand your emotional landscape and energy levels throughout the day. Our gentle check-in system helps you recognize patterns and optimize your personal rhythm.',
    benefits: [
      'Daily mood and energy tracking',
      'Pattern recognition insights',
      'Personalized wellness recommendations',
      'Gentle, non-judgmental approach',
      'Progress visualization',
      'Rhythm optimization suggestions'
    ]
  },
  community: {
    title: 'Celebrate — Support Community',
    icon: Heart,
    color: 'from-sunrise-amber-500 to-memory-emerald-500',
    description: 'Connect with your support circle and build meaningful accountability partnerships.',
    detailedDescription: 'You don\'t have to walk this journey alone. Build meaningful connections with others who understand your challenges and celebrate your victories together.',
    benefits: [
      'Private support circles',
      'Shared celebration of wins',
      'Gentle accountability system',
      'Safe, judgment-free space',
      'Peer encouragement',
      'Family and caregiver involvement'
    ]
  }
};

export function FeatureExplorationModal({ isOpen, onOpenChange, feature }: FeatureExplorationModalProps) {
  const navigate = useNavigate();
  
  if (!feature || !featureDetails[feature]) {
    return null;
  }

  const details = featureDetails[feature];
  const Icon = details.icon;

  const handleRegisterNow = () => {
    onOpenChange(false);
    navigate("/mvp/assessment-flow?type=brief&flow=register");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-brain-health-50/30">
        <DialogHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${details.color} flex items-center justify-center shadow-lg`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-brain-health-900">
            {details.title}
          </DialogTitle>
          <p className="text-lg text-brain-health-700 font-medium">
            {details.description}
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <Card className="border-brain-health-200/50 bg-white/50">
            <CardContent className="p-6">
              <p className="text-brain-health-700 leading-relaxed mb-6">
                {details.detailedDescription}
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-brain-health-900 mb-3">What you can expect to experience:</h4>
                <div className="grid gap-2">
                  {details.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${details.color}`} />
                      <span className="text-brain-health-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-brain-health-600 font-medium">
              Ready to experience the difference?
            </p>
            <Button 
              onClick={handleRegisterNow}
              size="lg"
              className={`bg-gradient-to-r ${details.color} hover:opacity-90 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-full`}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Register Now - 7 Day Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-brain-health-500">
              No commitment. Cancel anytime. Start your journey today.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}