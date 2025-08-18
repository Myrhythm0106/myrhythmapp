import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Calendar, Heart, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MVPCore4C() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/mvp/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-memory-emerald-600" />
              <span className="text-2xl font-bold text-brain-health-900">MyRhythm</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-memory-emerald-500/10 via-brain-health-500/10 to-clarity-teal-500/10 border-b border-brain-health-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald-100/20 via-brain-health-100/20 to-clarity-teal-100/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
                <span className="bg-gradient-to-r from-memory-emerald-600 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                  EMPOWER YOUR BRAIN.
                </span>
                <br />
                <span className="bg-gradient-to-r from-clarity-teal-600 via-sunrise-amber-500 to-memory-emerald-600 bg-clip-text text-transparent">
                  RECLAIM YOUR POWER.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-brain-health-700 font-semibold max-w-4xl mx-auto">
                Transform cognitive challenges into unstoppable strength with science-backed tools designed for your journey.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-6 mt-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-brain-health-800">
                  You're Not Broken. You're <span className="bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">Rebuilding</span>.
                </h2>
                <p className="font-semibold text-sm text-brain-health-700">
                  Your Rhythm
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                onClick={handleGetStarted}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start your journey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core C's Section */}
      <section className="py-20 bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/20 to-clarity-teal-50/30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brain-health-900 mb-4">
              Four Core C's for Your Journey
            </h2>
            <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
              A complete system designed specifically for cognitive wellness and memory empowerment
            </p>
          </div>

          {/* 2x2 Grid for 4 C's */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Capture */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-memory-emerald-50/50 border-memory-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="relative z-10 pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-brain-health-900 text-center">
                  Capture — Your Memory Bridge
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-brain-health-700 mb-6 text-center">
                  Never lose precious moments. Intelligent capture system for conversations, appointments, and memories.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white" 
                  onClick={handleGetStarted}
                >
                  Explore Capture
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-memory-emerald-500/10 to-brain-health-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>

            {/* Commit */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-brain-health-50/50 border-brain-health-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="relative z-10 pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-brain-health-900 text-center">
                  Commit — Your MyRhythm Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-brain-health-700 mb-6 text-center">
                  Transform overwhelm into organized action. Adapts to your energy and cognitive patterns.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white" 
                  onClick={handleGetStarted}
                >
                  Explore Calendar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-brain-health-500/10 to-clarity-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>

            {/* Calibrate */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-clarity-teal-50/50 border-clarity-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="relative z-10 pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-clarity-teal-500 to-sunrise-amber-500 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-brain-health-900 text-center">
                  Calibrate — Mood & Energy Check-ins
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-brain-health-700 mb-6 text-center">
                  Track your emotional landscape and energy levels. Understand patterns to optimize your rhythm.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-clarity-teal-500 to-sunrise-amber-500 hover:from-clarity-teal-600 hover:to-sunrise-amber-600 text-white" 
                  onClick={handleGetStarted}
                >
                  Explore Calibrate
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-clarity-teal-500/10 to-sunrise-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>

            {/* Celebrate */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-sunrise-amber-50/50 border-sunrise-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="relative z-10 pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-brain-health-900 text-center">
                  Celebrate — Memory Bank & Gratitude
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-brain-health-700 mb-6 text-center">
                  Build unshakeable confidence. Track progress, store wins, cultivate gratitude.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 hover:from-sunrise-amber-600 hover:to-memory-emerald-600 text-white" 
                  onClick={handleGetStarted}
                >
                  Explore Gratitude
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-sunrise-amber-500/10 to-memory-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          </div>

          {/* Supporting Text */}
          <div className="text-center mt-12">
            <p className="text-brain-health-600 font-medium max-w-2xl mx-auto">
              The complete MyRhythm system — <span className="font-bold">Capture</span> memories, <span className="font-bold">Commit</span> to your rhythm, <span className="font-bold">Calibrate</span> your wellbeing, and <span className="font-bold">Celebrate</span> with support.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-brain-health-900 mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-brain-health-700 mb-8 max-w-2xl mx-auto">
            Start with our personalized assessment to discover your unique rhythm
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
            onClick={handleGetStarted}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start Your Assessment
          </Button>
        </div>
      </section>
    </div>
  );
}