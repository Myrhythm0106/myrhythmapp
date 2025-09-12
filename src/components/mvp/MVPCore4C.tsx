import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Calendar, Heart, Activity, ArrowRight, Sparkles, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PainPointImageCard } from './PainPointImageCard';
import preciousMomentsImg from '@/assets/precious-moments.jpg';
import organizedActionImg from '@/assets/organized-action.jpg';
import emotionalLandscapeImg from '@/assets/emotional-landscape.jpg';
import strengthTogetherImg from '@/assets/strength-together.jpg';
import { MVPOnboardingModal } from './MVPOnboardingModal';
import { FeatureExplorationModal } from './FeatureExplorationModal';
import { FloatingRegisterButton } from '@/components/landing/FloatingRegisterButton';
import { useAuth } from '@/contexts/AuthContext';
import { TestAccountButton } from '@/components/auth/TestAccountButton';

export function MVPCore4C() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeFeatureModal, setActiveFeatureModal] = useState<'capture' | 'calendar' | 'calibrate' | 'community' | null>(null);
  const { user } = useAuth();
  
  // Check if we should auto-open the modal on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname === '/mvp/assessment' || params.get('open') === 'onboarding') {
      setIsOnboardingOpen(true);
    }
  }, [location]);
  
  const handleGetStarted = () => {
    navigate('/mvp-payment');
  };

  const handleAuthAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="public-page min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-brain-health-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-memory-emerald-600" />
              <span className="text-2xl font-bold text-brain-health-900">MyRhythm</span>
            </div>
            <Button
              onClick={handleAuthAction}
              variant="outline"
              size="sm"
              className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50 hover:text-brain-health-900 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              {user ? 'Dashboard' : 'Log In'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-memory-emerald-500/10 via-brain-health-500/10 to-clarity-teal-500/10 border-b border-brain-health-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald-100/20 via-brain-health-100/20 to-clarity-teal-100/20" />
        <div className="relative max-w-6xl mx-auto px-6 py-20">
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
                  onClick={() => navigate('/mvp-payment')}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Register Now
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Points with Professional Images */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <PainPointImageCard 
              title="Forgetting important conversations?" 
              imageUrl="/lovable-uploads/a6888d46-3b47-49fa-aeeb-5cfee5c53bc2.png" 
              imageAlt="Woman touching her forehead looking thoughtful and concerned about memory issues" 
              description="Missing precious moments and connections" 
            />
            <PainPointImageCard 
              title="Feeling overwhelmed by simple tasks?" 
              imageUrl="/lovable-uploads/f435bac1-8fc3-474b-add2-1f378bd3ebab.png" 
              imageAlt="Person with head down on desk showing exhaustion and overwhelm" 
              description="When everyday activities feel impossible" 
            />
            <PainPointImageCard 
              title="Struggling to stay organized?" 
              imageUrl="/lovable-uploads/f8374cd9-e953-4247-8410-b9e5c4f403c2.png" 
              imageAlt="Woman overwhelmed throwing papers in air with disorganized workspace" 
              description="Losing track of what matters most" 
            />
          </div>
        </div>
      </section>

      {/* Four Core Solutions Section */}
      <section className="py-20 bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/20 to-clarity-teal-50/30">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brain-health-900 mb-4">
              Four Core Solutions for Your Journey
            </h2>
            <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
              A complete system designed specifically for cognitive wellness and memory empowerment
            </p>
          </div>

          {/* Compact 4-card grid - MVP style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Capture */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-memory-emerald-50/50 border-memory-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="relative z-10 pb-4">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-brain-health-900 text-center">
                  Capture — Your Memory Bridge
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-brain-health-700 mb-4 text-center text-sm">
                  Never lose precious moments. Intelligent capture system for conversations, appointments, and memories.
                </p>
                <Button 
                  size="sm"
                  className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white" 
                  onClick={() => setActiveFeatureModal('capture')}
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
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-brain-health-900 text-center">
                  Commit — Your MyRhythm Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-brain-health-700 mb-4 text-center text-sm">
                  Transform overwhelm into organized action. Adapts to your energy and cognitive patterns.
                </p>
                <Button 
                  size="sm"
                  className="w-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white" 
                  onClick={() => setActiveFeatureModal('calendar')}
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
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-clarity-teal-500 to-sunrise-amber-500 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-brain-health-900 text-center">
                  Calibrate — Mood & Energy Check-ins
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-brain-health-700 mb-4 text-center text-sm">
                  Track your emotional landscape and energy levels. Understand patterns to optimize your rhythm.
                </p>
                <Button 
                  size="sm"
                  className="w-full bg-gradient-to-r from-clarity-teal-500 to-sunrise-amber-500 hover:from-clarity-teal-600 hover:to-sunrise-amber-600 text-white" 
                  onClick={() => setActiveFeatureModal('calibrate')}
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
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-brain-health-900 text-center">
                  Celebrate — Support Community
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-brain-health-700 mb-4 text-center text-sm">
                  Find strength together. Share wins, ask questions, and get encouragement — you're not walking alone.
                </p>
                <Button 
                  size="sm"
                  className="w-full bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 hover:from-sunrise-amber-600 hover:to-memory-emerald-600 text-white" 
                  onClick={() => setActiveFeatureModal('community')}
                >
                  Explore Community
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-sunrise-amber-500/10 to-memory-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          </div>

          {/* Supporting Text */}
          <div className="text-center mt-12">
            <p className="text-brain-health-600 font-medium max-w-2xl mx-auto">
              The complete MyRhythm system - Capture memories and conversations, Commit to your rhythm and follow through, Calibrate your well being and Celebrate with your community.
            </p>
          </div>
        </div>
      </section>

      {/* Feel the Difference Section */}
      <section className="py-20 bg-gradient-to-br from-white via-brain-health-50/10 to-memory-emerald-50/10">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brain-health-900 mb-4">
              Feel the Difference
            </h2>
            <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
              Experience the transformation when technology truly understands your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Precious Moments */}
            <div 
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${preciousMomentsImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-memory-emerald-900/80 via-memory-emerald-600/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Never lose precious moments
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Every conversation matters. Every memory is treasured.
                  </p>
                </div>
              </div>
            </div>

            {/* Organized Action */}
            <div 
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${organizedActionImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brain-health-900/80 via-brain-health-600/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Transform overwhelm into clarity
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Feel the calm confidence of being truly organized.
                  </p>
                </div>
              </div>
            </div>

            {/* Emotional Landscape */}
            <div 
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${emotionalLandscapeImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-clarity-teal-900/80 via-clarity-teal-600/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Understand your inner rhythm
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Discover patterns. Find peace. Optimize your wellbeing.
                  </p>
                </div>
              </div>
            </div>

            {/* Strength Together */}
            <div 
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${strengthTogetherImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sunrise-amber-900/80 via-sunrise-amber-600/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    You're never walking alone
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    Find your tribe. Share your journey. Celebrate together.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-brain-health-600 font-medium text-lg max-w-3xl mx-auto mb-8">
              This isn't just another app. It's a companion designed for your unique cognitive journey.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={handleGetStarted}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Experience the Difference
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 py-20">
        <div className="container mx-auto max-w-6xl px-6 text-center">
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
             Register Now
           </Button>
         </div>
       </section>

        {/* Onboarding Modal */}
        <MVPOnboardingModal isOpen={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />
        
        {/* Feature Exploration Modal */}
        <FeatureExplorationModal
          isOpen={activeFeatureModal !== null}
          onOpenChange={(open) => !open && setActiveFeatureModal(null)}
          feature={activeFeatureModal}
        />
        
        {/* Floating Register Button - only show when modal is closed */}
        {!isOnboardingOpen && <FloatingRegisterButton forceShow={!user} variant="trial" />}

        {/* Developer Test Account - Bottom Left */}
        {!user && (
          <div className="fixed bottom-4 left-4 z-40">
            <TestAccountButton />
          </div>
        )}
      </div>
    );
  }