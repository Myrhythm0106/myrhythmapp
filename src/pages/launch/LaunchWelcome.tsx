import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Users, Brain, Target, Briefcase, BookOpen, HeartHandshake } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { mapToPersona, type Persona } from '@/launch/persona/usePersona';

export default function LaunchWelcome() {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona>('recovery');

  useEffect(() => {
    const direct = localStorage.getItem('myrhythm_user_type');
    let raw: string | null = direct;
    if (!raw) {
      const saved = localStorage.getItem('myrhythm_launch_mode');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          raw = data?.assessmentResults?.userType ?? data?.selectedUserType ?? null;
        } catch { /* noop */ }
      }
    }
    setPersona(mapToPersona(raw));
  }, []);

  const getMessage = () => {
    switch (persona) {
      case 'recovery':
        return {
          headline: 'Your path forward starts now',
          subtitle: "We've shaped MyRhythm around recovery. Your support circle stays close to everything you do.",
          highlights: [
            { icon: Users, text: 'Support circle, front and centre' },
            { icon: Brain, text: 'Memory Bridge for clinical conversations' },
            { icon: Target, text: 'A gentle path to track real progress' },
          ],
        };
      case 'caregiver':
        return {
          headline: "You're not in this alone",
          subtitle: "We'll help you support someone you love, while protecting your own rhythm too.",
          highlights: [
            { icon: HeartHandshake, text: 'Coordinate care without losing your day' },
            { icon: Brain, text: 'Capture appointments accurately, together' },
            { icon: Users, text: 'A switch between self and supporting view' },
          ],
        };
      case 'productivity':
        return {
          headline: "Let's build clear, defended days",
          subtitle: "We've set MyRhythm up for leverage — vision down to the daily focus block, signal over noise.",
          highlights: [
            { icon: Target, text: 'Vision → quarter → week → day' },
            { icon: Briefcase, text: 'Protect deep work on the calendar' },
            { icon: Brain, text: 'Capture meetings as a searchable record' },
          ],
        };
      case 'student':
        return {
          headline: "Let's pace the term well",
          subtitle: "We've set MyRhythm up for study — lectures captured, revision paced, recall protected.",
          highlights: [
            { icon: BookOpen, text: 'Study blocks that respect energy' },
            { icon: Brain, text: 'Capture lectures and revision notes' },
            { icon: Target, text: 'Quietly see which subjects are gaining ground' },
          ],
        };
    }
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
