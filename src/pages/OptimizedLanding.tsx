import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Users, Calendar, Target, Shield, Clock, Star, Zap } from "lucide-react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { QuickLogout } from "@/components/testing/QuickLogout";

export default function OptimizedLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // TEMPORARILY DISABLED FOR DEMO - If user is already authenticated, redirect to dashboard
  // React.useEffect(() => {
  //   if (user) {
  //     console.log('🔄 OptimizedLanding: User authenticated, redirecting to dashboard');
  //     navigate('/dashboard');
  //   } else {
  //     console.log('✅ OptimizedLanding: No user, showing landing page');
  //   }
  // }, [user, navigate]);

  const handleGetStarted = () => {
    console.log('🚀 OptimizedLanding: Get started clicked, navigating to auth');
    navigate('/auth');
  };

  const handleStartFree = () => {
    console.log('🆓 OptimizedLanding: Start free clicked, navigating to dashboard');
    navigate('/dashboard');
  };

  return (
    <Preview3Background>
      <QuickLogout />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 max-w-4xl">
          <Badge 
            variant="outline" 
            className="mb-4 px-4 py-2 bg-gradient-to-r from-memory-emerald-100 to-brain-health-100 border-memory-emerald-300 text-memory-emerald-700 font-medium"
          >
            <Clock className="w-4 h-4 mr-2" />
            🚀 Start Your 7-Day Free Trial Today
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            <span className="bg-gradient-to-r from-memory-emerald-600 via-memory-emerald-700 to-brain-health-600 bg-clip-text text-transparent">
              Reclaim Your Memory,
            </span>
            <br />
            <span className="bg-gradient-to-r from-brain-health-700 to-memory-emerald-600 bg-clip-text text-transparent">
              Rebuild Your Life
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Join thousands who've transformed brain fog into mental clarity with our proven cognitive recovery system
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          <Card className="p-8 text-center space-y-6 border-memory-emerald-200/60 bg-gradient-to-br from-white via-memory-emerald-50/20 to-brain-health-50/25 hover:shadow-elegant transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-memory-emerald-800">Immediate Relief</h3>
            <p className="text-gray-700 leading-relaxed font-medium">
              Start feeling clearer within your first session with our daily empowerment rituals
            </p>
          </Card>

          <Card className="p-8 text-center space-y-6 border-brain-health-200/60 bg-gradient-to-br from-white via-brain-health-50/20 to-memory-emerald-50/25 hover:shadow-elegant transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brain-health-500 to-memory-emerald-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-brain-health-800">Proven System</h3>
            <p className="text-gray-700 leading-relaxed font-medium">
              Our PACT framework has helped 10,000+ people rebuild their cognitive strength
            </p>
          </Card>

          <Card className="p-8 text-center space-y-6 border-sunrise-amber-200/60 bg-gradient-to-br from-white via-sunrise-amber-50/20 to-brain-health-50/25 hover:shadow-elegant transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sunrise-amber-500 to-brain-health-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-sunrise-amber-800">Never Alone</h3>
            <p className="text-gray-700 leading-relaxed font-medium">
              Connect with others on the same journey and build your support network
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="p-10 text-center space-y-8 max-w-2xl w-full bg-gradient-to-br from-memory-emerald-50/40 via-brain-health-50/30 to-sunrise-amber-50/20 border-memory-emerald-200/50 shadow-glow">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-memory-emerald-700 to-brain-health-700 bg-clip-text text-transparent">
            Ready to Transform Your Life?
          </h2>
          <p className="text-lg text-gray-700 font-medium">
            Join thousands who've already discovered their rhythm and transformed their daily experience.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 shadow-elegant hover:shadow-glow transition-all text-white"
            >
              Start Your 7-Day Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleStartFree}
              size="lg"
              className="w-full py-4 text-lg font-semibold border-2 border-brain-health-400 text-brain-health-700 hover:bg-gradient-to-r hover:from-brain-health-50 hover:to-memory-emerald-50 hover:border-memory-emerald-400 hover:text-memory-emerald-700 transition-all"
            >
              Try MyRhythm Free (Limited Features)
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brain-health-600" />
              <span className="font-medium">No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-memory-emerald-600" />
              <span className="font-medium">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-sunrise-amber-600" />
              <span className="font-medium">Instant Access</span>
            </div>
          </div>
        </Card>

        {/* Social Proof */}
        <div className="text-center space-y-6 max-w-3xl">
          <div className="flex justify-center space-x-1 text-sunrise-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-current" />
            ))}
          </div>
          <blockquote className="text-xl italic text-gray-800 leading-relaxed font-medium">
            "MyRhythm gave me my life back. Within a week, I felt like myself again and completely transformed how I approach my daily routine."
          </blockquote>
          <cite className="text-memory-emerald-700 font-semibold">
            — Sarah M., Verified User
          </cite>
          <p className="text-sm text-gray-600 font-medium">4.9/5 from 2,847 users</p>
        </div>
      </div>
    </Preview3Background>
  );
}