
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, Brain, Calendar, Users, TrendingUp, BookOpen, Target, MessageCircle, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

function SubscribeSuccess() {
  const navigate = useNavigate();

  const handleGuidedExperience = () => {
    localStorage.setItem('journey_mode', 'guided');
    navigate("/onboarding/assessment");
  };

  const handleDiscoveryMode = () => {
    localStorage.setItem('journey_mode', 'discovery');
    navigate("/dashboard");
  };

  const handleViewTimeline = () => {
    navigate("/onboarding/life-empowerment-guide");
  };

  const handleHowToGuide = () => {
    navigate("/help/getting-started");
  };

  const handleGoDashboard = () => {
    navigate("/dashboard");
  };

  const handleContactSupport = () => {
    window.open('mailto:support@myrhythm.com?subject=Support Request', '_blank');
  };

  const handleViewHelpCenter = () => {
    navigate("/help");
  };

  return (
    <Preview3Background className="flex items-center justify-center p-4">
      <SurfaceCard variant="glass" className="w-full max-w-4xl shadow-2xl border-0 animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-brain-health-500 via-clarity-teal-500 to-memory-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-brain-health-500/20 animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <div className="space-y-4">
            <CardTitle className="text-4xl font-bold gradient-text-brand mb-4">
              Welcome to MyRhythm!
            </CardTitle>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your subscription is now active. Let's begin your transformative journey to cognitive wellness.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          {/* Feature Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <SurfaceCard variant="subtle" padding="lg" hover className="group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brain-health-500 to-brain-health-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg therapeutic-accent mb-2">Memory Bridge</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Record conversations and meetings with AI-powered action extraction for seamless memory support
                  </p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard variant="subtle" padding="lg" hover className="group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-clarity-teal-500 to-clarity-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg therapeutic-accent mb-2">Smart Calendar</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Intelligent scheduling with cognitive load management and energy optimization
                  </p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard variant="subtle" padding="lg" hover className="group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg therapeutic-accent mb-2">Support Circle</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with family, friends, and care team for collaborative wellness support
                  </p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard variant="subtle" padding="lg" hover className="group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-beacon-500 to-beacon-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg therapeutic-accent mb-2">Progress Tracking</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Monitor your cognitive wellness journey with detailed insights and celebrations
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </div>

          {/* Quick Actions */}
          <SurfaceCard variant="elevated" padding="lg" className="border-brain-health-200/50">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-beacon-500 to-beacon-600 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold gradient-text-brand">
                  Begin Your Journey
                </h3>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={handleGuidedExperience}
                  size="lg"
                  className="group cognitive-enhancement hover:shadow-lg transition-all duration-300 flex-col h-auto py-4"
                >
                  <Target className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Guided Experience</span>
                  <span className="text-xs opacity-80">Step-by-step setup</span>
                </Button>
                <Button 
                  onClick={handleDiscoveryMode}
                  variant="outline" 
                  size="lg"
                  className="group border-brain-health-300 hover:bg-brain-health-50 hover:border-brain-health-400 transition-all duration-300 flex-col h-auto py-4"
                >
                  <Sparkles className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Discovery Mode</span>
                  <span className="text-xs opacity-80">Explore freely</span>
                </Button>
                <Button 
                  onClick={handleHowToGuide}
                  variant="outline" 
                  size="lg"
                  className="group border-brain-health-300 hover:bg-brain-health-50 hover:border-brain-health-400 transition-all duration-300 flex-col h-auto py-4"
                >
                  <BookOpen className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">How-to Guide</span>
                  <span className="text-xs opacity-80">Learn the basics</span>
                </Button>
                <Button 
                  onClick={handleViewTimeline}
                  variant="outline" 
                  size="lg"
                  className="group border-brain-health-300 hover:bg-brain-health-50 hover:border-brain-health-400 transition-all duration-300 flex-col h-auto py-4"
                >
                  <TrendingUp className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">View Timeline</span>
                  <span className="text-xs opacity-80">See your journey</span>
                </Button>
              </div>
              
              <Button 
                onClick={handleGoDashboard}
                variant="default"
                size="lg" 
                className="w-full premium-button text-lg py-6 hover:shadow-xl transition-all duration-300 group"
              >
                Enter MyRhythm Dashboard
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </SurfaceCard>

          {/* Support */}
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Need help getting started on your wellness journey?
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                variant="ghost" 
                size="lg"
                onClick={handleContactSupport}
                className="group hover:bg-brain-health-50 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Contact Support
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={handleViewHelpCenter}
                className="group hover:bg-clarity-teal-50 transition-all duration-300"
              >
                <HelpCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                View Help Center
              </Button>
            </div>
          </div>
        </CardContent>
      </SurfaceCard>
    </Preview3Background>
  );
}

export default SubscribeSuccess;
export { SubscribeSuccess };
