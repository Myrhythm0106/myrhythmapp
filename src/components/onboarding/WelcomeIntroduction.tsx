import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Users, ArrowRight, Sparkles, Target, Trophy, Star, Zap } from "lucide-react";

interface WelcomeIntroductionProps {
  onGetStarted: () => void;
}

export function WelcomeIntroduction({ onGetStarted }: WelcomeIntroductionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-clarity-teal-50 to-memory-emerald-50 relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.04'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Hero Header */}
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-brain-health-500 via-clarity-teal-500 to-memory-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-neural-pulse">
                <Brain className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-text-brand leading-tight">
              Welcome to MyRhythm
            </h1>
            
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your personalized journey to cognitive excellence and memory empowerment begins here. 
              Discover the transformative power of your unique rhythm.
            </p>

            {/* Premium Trust Indicators */}
            <div className="flex justify-center items-center gap-8 flex-wrap pt-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-beacon-500" />
                <span className="text-sm font-medium text-brain-health-700">Evidence-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-memory-emerald-500" />
                <span className="text-sm font-medium text-brain-health-700">Award-Winning</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-clarity-teal-500" />
                <span className="text-sm font-medium text-brain-health-700">10,000+ Members</span>
              </div>
            </div>
          </div>

          {/* Premium Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="premium-card group hover:shadow-2xl transition-all duration-500 border-0">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-18 h-18 bg-gradient-to-br from-brain-health-500 to-brain-health-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-9 w-9 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold therapeutic-accent">Personalized Goals</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI-powered goal setting that adapts to your unique cognitive profile and lifestyle preferences for sustainable growth.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card group hover:shadow-2xl transition-all duration-500 border-0">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-18 h-18 bg-gradient-to-br from-clarity-teal-500 to-clarity-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-9 w-9 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold therapeutic-accent">Advanced Brain Training</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Cutting-edge cognitive exercises and memory enhancement techniques backed by neuroscience research.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card group hover:shadow-2xl transition-all duration-500 border-0">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-18 h-18 bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-9 w-9 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold therapeutic-accent">Expert Community</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with cognitive wellness experts and a supportive community of individuals on transformative journeys.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Journey Preview */}
          <Card className="premium-card max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-background via-brain-health-50/50 to-clarity-teal-50/50">
            <CardContent className="p-10 space-y-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="h-6 w-6 text-beacon-500" />
                  <h2 className="text-3xl font-bold gradient-text-brand">Your Transformation Journey</h2>
                  <Sparkles className="h-6 w-6 text-beacon-500" />
                </div>
                <p className="text-lg text-muted-foreground">Three simple steps to cognitive excellence</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brain-health-500 to-brain-health-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg therapeutic-accent">Intelligent Assessment</h4>
                    <p className="text-muted-foreground">AI-powered evaluation to understand your unique cognitive profile and needs</p>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-clarity-teal-500 to-clarity-teal-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg therapeutic-accent">Personalized Strategy</h4>
                    <p className="text-muted-foreground">Custom-built plan that adapts to your goals, lifestyle, and cognitive preferences</p>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg therapeutic-accent">Guided Excellence</h4>
                    <p className="text-muted-foreground">Begin your transformative journey with expert guidance and community support</p>
                  </div>
                </div>
              </div>

              {/* Premium Trust Badge */}
              <div className="text-center pt-6 border-t border-brain-health-200/50">
                <div className="flex justify-center items-center gap-6 flex-wrap text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-beacon-500" />
                    <span>4.9/5 success rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-clarity-teal-500" />
                    <span>5-minute setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-memory-emerald-500" />
                    <span>Scientifically proven</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium CTA */}
          <div className="space-y-6">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="premium-button text-xl px-16 py-8 font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 group"
            >
              <Target className="h-6 w-6 mr-4 group-hover:scale-110 transition-transform" />
              Start My Transformation Journey
              <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Free assessment • No commitment • 10,000+ successful transformations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}