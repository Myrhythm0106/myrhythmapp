import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';

export default function LaunchLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 flex flex-col overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center min-h-[60vh]">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-brand-teal-500 via-brand-emerald-500 to-brand-blue-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 max-w-lg">
            Your Brain-Friendly
            <span className="bg-gradient-to-r from-brand-emerald-600 to-brand-teal-600 bg-clip-text text-transparent"> Life Assistant</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-600 max-w-md mb-8">
            Transform conversations into actions. Build momentum with your support circle by your side.
          </p>

          {/* CTA Button */}
          <LaunchButton
            size="lg"
            onClick={() => navigate('/launch/register')}
            className="gap-3 px-10"
          >
            Start 7-Day Free Trial
            <ArrowRight className="h-5 w-5" />
          </LaunchButton>

          {/* Trust Signal */}
          <p className="text-sm text-gray-500 mt-6">
            No credit card charged for 7 days • Cancel anytime
          </p>
        </div>

        {/* Value Props */}
        <div className="px-6 pb-12">
          <div className="max-w-md mx-auto grid gap-4">
            <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald-100 flex items-center justify-center flex-shrink-0">
                <Brain className="h-5 w-5 text-brand-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Memory Bridge</h3>
                <p className="text-sm text-gray-600">Record conversations, we extract the actions</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Support Circle</h3>
                <p className="text-sm text-gray-600">Family, friends, and care team connected</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Growth Mindset</h3>
                <p className="text-sm text-gray-600">Celebrate every victory, build momentum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center pb-8">
          <button 
            onClick={() => navigate('/auth')}
            className="text-sm text-brand-emerald-600 hover:text-brand-emerald-700 font-medium"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
