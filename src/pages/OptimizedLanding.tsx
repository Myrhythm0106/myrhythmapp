
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Calendar, Brain, Heart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function OptimizedLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-blue-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      {/* Header */}
      <header className="relative z-20 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
            MyRhythm
          </span>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/auth')}
          className="border-emerald-300/30 text-emerald-100 hover:bg-emerald-800/30 hover:border-emerald-300/50"
        >
          Sign In
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-800/30 backdrop-blur-sm border border-emerald-500/20 px-6 py-3 rounded-full">
            <Zap className="h-5 w-5 text-emerald-300" />
            <span className="text-emerald-200 font-bold text-lg">By Brain Injury Survivor, For All Survivors</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-blue-300 bg-clip-text text-transparent">
                Cognitive Journey
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              Whether recovering from brain injury, optimizing cognitive performance, or supporting a loved one—
              <span className="font-semibold text-white"> MyRhythm adapts to your unique needs</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleLearnMore}
              className="border-2 border-emerald-300/30 text-emerald-100 hover:bg-emerald-800/20 hover:border-emerald-300/50 font-semibold px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              Explore Features
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-16 space-y-4">
            <p className="text-emerald-200/80 text-sm uppercase tracking-wider font-medium">
              Trusted by survivors, families, and healthcare professionals
            </p>
            <div className="flex justify-center items-center gap-8 text-emerald-300/60">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">1,000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span className="text-sm">Family-Focused</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span className="text-sm">Clinical-Grade</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Preview Section */}
      <section id="features-section" className="relative z-10 py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                Everything You Need in One Place
              </h2>
              <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
                From daily planning to long-term recovery tracking, MyRhythm grows with you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-emerald-800/20 to-teal-800/20 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-400/30 transition-colors">
                <Calendar className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Smart Planning</h3>
                <p className="text-emerald-100/70">
                  AI-powered scheduling that adapts to your energy levels and cognitive patterns
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-800/20 to-blue-800/20 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-8 hover:border-teal-400/30 transition-colors">
                <Brain className="h-12 w-12 text-teal-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Progress Tracking</h3>
                <p className="text-teal-100/70">
                  Visual insights into your recovery journey with clinical-grade metrics
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-800/20 to-emerald-800/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/30 transition-colors">
                <Users className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Care Team Support</h3>
                <p className="text-blue-100/70">
                  Connect with family, caregivers, and healthcare providers seamlessly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              Ready to Transform Your Journey?
            </h2>
            <p className="text-xl text-emerald-100/80">
              Join thousands who have already started their path to cognitive wellness
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free Today
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
