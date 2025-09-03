
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowRight, Sparkles, Trophy, Target, Users, TrendingUp, Star, Zap } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/start");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-clarity-teal-50 to-memory-emerald-50 relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.03'%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-8">
          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-brain-health-500 via-clarity-teal-500 to-memory-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-neural-pulse">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold gradient-text-brand mb-2">
                  MyRhythm
                </h1>
                <p className="text-brain-health-600 font-medium text-lg">Memory1st → LEAP Forward</p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Transform Your 
                <span className="gradient-text-brand"> Cognitive Wellness</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join thousands who have discovered their unique rhythm with our revolutionary, 
                evidence-based approach to memory wellness and brain health optimization.
              </p>
            </div>

            {/* Premium Trust Indicators */}
            <div className="flex justify-center items-center gap-8 mt-8 flex-wrap">
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
        </div>

        {/* Premium Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="premium-card group hover:shadow-xl transition-all duration-500 border-0">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brain-health-500 to-brain-health-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl therapeutic-accent">
                LEAP Framework
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our evidence-based 8-step system that adapts to your unique cognitive profile:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-brain-health-500 to-brain-health-600 rounded-full"></div>
                  <span className="font-semibold text-brain-health-700">L</span>earning your patterns
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600 rounded-full"></div>
                  <span className="font-semibold text-clarity-teal-700">E</span>mpowering your strengths
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600 rounded-full"></div>
                  <span className="font-semibold text-memory-emerald-700">A</span>ccelerating progress
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-beacon-500 to-beacon-600 rounded-full"></div>
                  <span className="font-semibold text-beacon-700">P</span>ersonalizing your journey
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card group hover:shadow-xl transition-all duration-500 border-0">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-clarity-teal-500 to-clarity-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl therapeutic-accent">
                Advanced Toolkit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Comprehensive suite of tools designed for optimal cognitive wellness:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600 rounded-full"></div>
                  <span className="text-memory-emerald-700">AI-powered assessments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-brain-health-500 to-brain-health-600 rounded-full"></div>
                  <span className="text-brain-health-700">Personalized brain training</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600 rounded-full"></div>
                  <span className="text-clarity-teal-700">Progress analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-beacon-500 to-beacon-600 rounded-full"></div>
                  <span className="text-beacon-700">Expert community</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card group hover:shadow-xl transition-all duration-500 border-0 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl therapeutic-accent">
                Proven Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join a community experiencing real transformation:
              </p>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 rounded-lg p-3">
                  <div className="text-2xl font-bold therapeutic-accent">87%</div>
                  <div className="text-sm text-muted-foreground">Improved memory recall</div>
                </div>
                <div className="bg-gradient-to-r from-clarity-teal-50 to-memory-emerald-50 rounded-lg p-3">
                  <div className="text-2xl font-bold therapeutic-accent">92%</div>
                  <div className="text-sm text-muted-foreground">Enhanced daily confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium CTA Section */}
        <div className="text-center">
          <Card className="premium-card max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-background via-brain-health-50/50 to-clarity-teal-50/50">
            <CardContent className="p-12">
              <div className="space-y-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Zap className="h-8 w-8 text-beacon-500" />
                  <h3 className="text-3xl font-bold gradient-text-brand">
                    Transform Your Life Today
                  </h3>
                  <Zap className="h-8 w-8 text-beacon-500" />
                </div>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join an exclusive community of individuals committed to cognitive excellence. 
                  Your journey to enhanced memory, sharper focus, and greater confidence starts with one click.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto pt-6">
                  <Button 
                    onClick={handleGetStarted}
                    size="lg"
                    className="premium-button text-xl px-12 py-6 hover:shadow-2xl transition-all duration-300 group flex-1 sm:flex-none"
                  >
                    <Target className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                    Begin Your Journey
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <div className="text-center sm:text-left">
                    <div className="text-sm text-muted-foreground">
                      Free assessment • No commitment
                    </div>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="pt-8 border-t border-brain-health-200/50">
                  <div className="flex justify-center items-center gap-6 flex-wrap text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-beacon-500" />
                      <span>4.9/5 user rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-clarity-teal-500" />
                      <span>10,000+ active members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-memory-emerald-500" />
                      <span>Evidence-based approach</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
