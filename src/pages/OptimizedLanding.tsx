import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Users, Calendar, Target, Shield, Clock } from "lucide-react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { QuickLogout } from "@/components/testing/QuickLogout";

export default function OptimizedLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      console.log('🔄 OptimizedLanding: User authenticated, redirecting to dashboard');
      navigate('/dashboard');
    } else {
      console.log('✅ OptimizedLanding: No user, showing landing page');
    }
  }, [user, navigate]);

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
        <div className="text-center space-y-4 max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            <Clock className="w-4 h-4 mr-2" />
            7-Day Free Trial - No Credit Card Required
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-brain-health-600 bg-clip-text text-transparent">
            Reclaim Your Memory,
            <br />
            Rebuild Your Life
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands who've transformed brain fog into mental clarity with our proven cognitive recovery system
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <Brain className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Immediate Relief</h3>
              <p className="text-muted-foreground">
                Start feeling clearer within your first session with our daily empowerment rituals
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-brain-health-500/20 hover:border-brain-health-500/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <Target className="w-12 h-12 mx-auto text-brain-health-600" />
              <h3 className="text-xl font-semibold">Proven System</h3>
              <p className="text-muted-foreground">
                Our PACT framework has helped 10,000+ people rebuild their cognitive strength
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-secondary" />
              <h3 className="text-xl font-semibold">Never Alone</h3>
              <p className="text-muted-foreground">
                Connect with others on the same journey and build your support network
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 max-w-lg w-full">
          <div className="space-y-4">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="w-full py-6 text-lg bg-gradient-to-r from-primary to-brain-health-600 hover:from-primary/90 hover:to-brain-health-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Your 7-Day Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleStartFree}
              size="lg"
              className="w-full py-4 text-base border-2"
            >
              Try MyRhythm Free (Limited Features)
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              No Credit Card
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Cancel Anytime
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center space-y-4 max-w-2xl">
          <p className="text-sm text-muted-foreground">
            "MyRhythm gave me my life back. Within a week, I felt like myself again." - Sarah M.
          </p>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-500 text-lg">★</span>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 2,847 users</span>
          </div>
        </div>
      </div>
    </Preview3Background>
  );
}