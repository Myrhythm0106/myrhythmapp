import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Brain, Calendar, Heart, Activity, ArrowRight, Sparkles, User, HelpCircle, Mail, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { EditionBadge } from '@/components/launch/EditionBadge';
import { FoundingTrustStrip } from '@/components/launch/FoundingTrustStrip';
import { DayInTheLifeStrip } from '@/components/launch/DayInTheLifeStrip';
import { useNavigate, useLocation } from 'react-router-dom';
import { PainPointImageCard } from './PainPointImageCard';
import preciousMomentsImg from '@/assets/precious-moments.jpg';
import organizedActionImg from '@/assets/organized-action.jpg';
import emotionalLandscapeImg from '@/assets/emotional-landscape.jpg';
import strengthTogetherImg from '@/assets/strength-together.jpg';
import { MVPOnboardingModal } from './MVPOnboardingModal';
import { FeatureExplorationModal } from './FeatureExplorationModal';
import { FloatingRegisterButton } from '@/components/landing/FloatingRegisterButton';
import { useAuth } from '@/hooks/useAuth';
import { TestAccountButton } from '@/components/auth/TestAccountButton';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
export function MVPCore4C() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeFeatureModal, setActiveFeatureModal] = useState<'capture' | 'calendar' | 'calibrate' | 'community' | null>(null);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);
  const { user } = useAuth();
  
  const [heroEmail, setHeroEmail] = useState('');




  const handleHeroEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = heroEmail.trim();
    if (trimmed && trimmed.includes('@')) {
      localStorage.setItem('myrhythm_prefill_email', trimmed);
    }
    navigate('/launch/register');
  };
  
  // Check if we should auto-open the modal on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname === '/mvp/assessment' || params.get('open') === 'onboarding') {
      setIsOnboardingOpen(true);
    }
  }, [location]);
  
  const handleGetStarted = () => {
    navigate("/launch/register");
  };

  const { signOut } = useAuth();
  
  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      navigate('/launch');
    } else {
      navigate('/launch/signin');
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
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/help/getting-started')}
                variant="ghost"
                size="sm"
                className="text-brain-health-600 hover:text-brain-health-800 hover:bg-brain-health-50"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleAuthAction}
                variant="outline"
                size="sm"
                className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50 hover:text-brain-health-900 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                {user ? 'Sign Out' : 'Log In'}
              </Button>
            </div>
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
                Transform cognitive challenges into unstoppable strength.
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
                <p className="text-sm font-semibold text-brain-health-800">
                  Founding Member — limited to first 1,000
                </p>
              </div>
              <form
                onSubmit={handleHeroEmailSubmit}
                className="w-full max-w-md flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brain-health-400" />
                  <Input
                    type="email"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email to become a founding member"
                    className="pl-9 h-12 bg-white/90 border-brain-health-200"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white"
                >
                  Become a Founding Member
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
              <p className="text-xs text-brain-health-600">
                Founding spots are limited — join the first 1,000
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate('/launch/register')}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Your Journey
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

      {/* How MyRhythm answers it — numbered strip */}
      <section className="py-16 bg-gradient-to-b from-white to-brain-health-50/30">
        <div className="container mx-auto max-w-6xl px-6">
          <Collapsible open={isAnswersOpen} onOpenChange={setIsAnswersOpen}>
            <div className="text-center mb-6">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50"
                >
                  {isAnswersOpen ? (
                    <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>See how MyRhythm answers this <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              {/* Differentiator block */}
              <div className="max-w-3xl mx-auto text-center mb-10">
                <p className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-brain-health-600">
                  Built for Life Empowerment &mdash; brain injury, memory and cognitive challenges. And Productivity &mdash; useful for anyone carrying a lot.
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-brain-health-900 leading-tight">
                  The gap between clinically ready and life-ready is where people fall.
                </h2>
                <p className="mt-3 text-base md:text-lg text-brain-health-700 leading-relaxed">
                  MyRhythm is shaped for the weeks after the folder closes, and for anyone whose responsibilities outrun their energy.
                </p>
              </div>

              <div className="text-center mb-12">
                <h3 className="text-xl md:text-2xl font-bold text-brain-health-900">
                  Here&apos;s how MyRhythm answers that
                </h3>
                <p className="text-brain-health-700 mt-2">Four quiet shifts that change the week.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { n: '01', icon: null, problem: 'Conversations fade faster than they should.', tagline: 'One conversation you can always find', body: 'Memory Bridge listens so you don\u2019t have to. Record any chat, meeting or appointment and MyRhythm turns it into a searchable record with the decisions, names and next steps pulled out for you.' },
                  { n: '02', icon: Users, problem: 'The people who care often don\u2019t know how to help.', tagline: 'Family, friends, clinicians \u2014 in the loop, on the day', body: 'Whether you\u2019re recovering, caregiving, or just stretched thin, your Support Circle sees the plan with you. Shared calendar invites mean follow-through stops depending on willpower alone.' },
                  { n: '03', icon: null, problem: 'Some days, choosing what to do next is the hardest part.', tagline: 'One calm next step defined daily', body: 'A quick Energy Check tunes the day around how you actually feel. Smart Schedule then surfaces just the next right thing \u2014 with built-in buffers and a gentle reshuffle when it\u2019s too much.' },
                  { n: '04', icon: null, problem: 'Goals that matter often never reach today.', tagline: 'One thread from dream to today', body: 'Vision \u2192 Goals \u2192 Priorities \u2192 Daily Actions, all linked. Every task today traces back to something that matters, and every win is celebrated through the Capture \u2192 Commit \u2192 Calibrate \u2192 Celebrate loop.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.n}
                      className="relative rounded-2xl border border-brain-health-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-5xl font-black bg-gradient-to-br from-memory-emerald-500 to-clarity-teal-500 bg-clip-text text-transparent leading-none">
                          {item.n}
                        </div>
                        {Icon && (
                          <div className="w-10 h-10 rounded-full bg-brand-orange-50 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-brand-orange-500" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-brain-health-900 mb-1">{item.problem}</h3>
                      <p className="text-base font-semibold italic text-memory-emerald-700 mb-2">{item.tagline}</p>
                      <p className="text-sm text-brain-health-700 leading-relaxed">{item.body}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 text-center">
                <a
                  href="/launch/science"
                  className="text-sm text-brain-health-600 hover:text-brand-orange-500 underline-offset-4 hover:underline"
                >
                  The evidence behind this &rarr;
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-brain-health-600">
                <EditionBadge variant="chip" />
                <span className="hidden sm:inline text-brain-health-300">&middot;</span>
                <span className="italic">For recovery. For caregivers. For anyone carrying a lot.</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* Four Core Solutions Section */}
      <section className="py-20 bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/20 to-clarity-teal-50/30">
        <div className="container mx-auto max-w-6xl px-6">
          <FoundingTrustStrip />
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
                  onClick={() => navigate('/launch/capture')}
                >
                  Explore Memory Bridge
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
                  onClick={() => navigate('/launch/commit')}
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
                  onClick={() => navigate('/launch/calibrate')}
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
            <p className="text-xs text-brain-health-500 mt-4 tracking-wide uppercase">
              Operating layer: Cognitive Continuity
            </p>
          </div>

          {/* Prominent CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center p-8 bg-gradient-to-br from-memory-emerald-500/10 via-brain-health-500/10 to-clarity-teal-500/10 rounded-3xl border border-memory-emerald-200/50">
              <h3 className="text-2xl md:text-3xl font-bold text-brain-health-900 mb-3">
                Ready to Transform Your Journey?
              </h3>
              <p className="text-brain-health-700 mb-6 max-w-lg">
                Start your 7-day free trial today. No commitment, cancel anytime.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-10 py-6 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" 
                onClick={() => navigate('/launch/register')}
              >
                <Sparkles className="h-6 w-6 mr-3" />
                Start 7-Day Free Trial
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              <p className="text-sm text-brain-health-500 mt-4">
                ✓ No charge until trial ends &nbsp;•&nbsp; ✓ Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <DayInTheLifeStrip />

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