import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Users, Brain, Target } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';

export default function LaunchWelcome() {
  const navigate = useNavigate();
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('myrhythm_launch_mode');
    if (saved) {
      const data = JSON.parse(saved);
      setAssessmentResults(data.assessmentResults);
    }
  }, []);

  const isRecovery = assessmentResults?.userType === 'recovery';
  const isCaregiver = assessmentResults?.userType === 'caregiver';

  const getMessage = () => {
    if (isRecovery) {
      return {
        headline: "Your Path Forward Starts Now",
        subtitle: "We've customized MyRhythm for your recovery journey. Your support circle will be central to everything you do.",
        highlights: [
          { icon: Users, text: "Support Circle front and center" },
          { icon: Brain, text: "Memory Bridge for capturing conversations" },
          { icon: Target, text: "My Path Forward to track your progress" },
        ],
      };
    }
    if (isCaregiver) {
      return {
        headline: "You're Not Alone in This",
        subtitle: "We'll help you support your loved one while taking care of yourself too.",
        highlights: [
          { icon: Users, text: "Connect with their care team" },
          { icon: Brain, text: "Track appointments and tasks together" },
          { icon: Target, text: "Celebrate every win" },
        ],
      };
    }
    return {
      headline: "Let's Build Your Momentum",
      subtitle: "We've set up MyRhythm to help you crush your goals, from big-picture yearly vision to daily wins.",
      highlights: [
        { icon: Target, text: "Year → Month → Week → Day planning" },
        { icon: Brain, text: "Memory Bridge captures action items" },
        { icon: Users, text: "Accountability partners keep you on track" },
      ],
    };
  };

  const content = getMessage();

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 flex flex-col overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-center">
        {/* Celebration Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg animate-bounce">
          <Sparkles className="h-10 w-10 text-white" />
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center max-w-lg">
          {content.headline}
        </h1>
        
        <p className="text-lg text-gray-600 text-center max-w-md mb-10">
          {content.subtitle}
        </p>

        {/* Personalized Highlights */}
        <div className="space-y-4 mb-10 max-w-md w-full">
          {content.highlights.map((highlight, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-emerald-100 flex items-center justify-center flex-shrink-0">
                <highlight.icon className="h-6 w-6 text-brand-emerald-600" />
              </div>
              <p className="font-medium text-gray-900">{highlight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="flex-shrink-0 px-6 py-4 pb-8 bg-gradient-to-t from-memory-emerald-50 via-memory-emerald-50/95 to-transparent">
        <div className="flex flex-col items-center">
          {/* CTA */}
          <LaunchButton
            size="lg"
            onClick={() => navigate('/launch/home')}
            className="gap-3 px-10"
          >
            Let's Begin
            <ArrowRight className="h-5 w-5" />
          </LaunchButton>

          {/* Skip to auth if needed */}
          <button 
            onClick={() => navigate('/auth')}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Sign in to existing account
          </button>
        </div>
      </div>
    </div>
  );
}
