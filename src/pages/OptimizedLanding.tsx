
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  ArrowRight, 
  Heart, 
  Users, 
  Target, 
  Sparkles, 
  CheckCircle,
  Star,
  Calendar,
  MessageSquare,
  Shield
} from "lucide-react";

const OptimizedLanding = () => {
  const navigate = useNavigate();
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-emerald-50">
      {/* Sticky Header with MyRhythm Branding */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showStickyHeader 
          ? 'translate-y-0 bg-white/95 backdrop-blur-sm border-b border-teal-200/50 shadow-sm' 
          : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-teal-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              MyRhythm
            </h1>
          </div>
          <div className="text-sm text-slate-600">
            Memory1st → LEAP Forward
          </div>
        </div>
      </div>

      {/* Fixed Register Button */}
      <div className="fixed top-6 right-6 z-40">
        <Button 
          onClick={handleGetStarted}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-full font-semibold"
        >
          Register Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 via-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  MyRhythm
                </h1>
                <p className="text-slate-600 font-medium">Memory1st → LEAP Forward</p>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
              Find Your Rhythm.<br />
              <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Transform Your Life.
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover personalized strategies for memory wellness, cognitive empowerment, 
              and building the support network you deserve.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-teal-600 via-blue-600 to-emerald-600 hover:from-teal-700 hover:via-blue-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Free assessment • No credit card required</span>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-black text-teal-600 mb-2">10,000+</div>
              <p className="text-slate-600">Lives Transformed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600 mb-2">94%</div>
              <p className="text-slate-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <p className="text-slate-600">4.9/5 User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Cards */}
      <section className="py-16 px-6 bg-gradient-to-r from-orange-50/30 via-red-50/20 to-orange-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              We Understand Your Struggles
            </h3>
            <p className="text-xl text-slate-600">
              You're not alone in this journey. We're here to help.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-red-50/60 hover:shadow-lg transition-all duration-200">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">😔</div>
                <CardTitle className="text-xl text-slate-800">I Can't Remember</CardTitle>
                <p className="text-slate-600">Names, appointments, medications</p>
                <p className="text-sm text-orange-700 italic font-medium mt-2">
                  When memory fails, the feeling of being alone deepens. 
                  <br />You don't have to face this isolation.
                </p>
              </CardHeader>
            </Card>

            <Card className="border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-red-50/60 hover:shadow-lg transition-all duration-200">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">😞</div>
                <CardTitle className="text-xl text-slate-800">I Feel Overwhelmed</CardTitle>
                <p className="text-slate-600">Too much information, not enough clarity</p>
                <p className="text-sm text-orange-700 italic font-medium mt-2">
                  The chaos makes you feel even more isolated.
                  <br />Let us bring order and connection to your world.
                </p>
              </CardHeader>
            </Card>

            <Card className="border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-red-50/60 hover:shadow-lg transition-all duration-200">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">😟</div>
                <CardTitle className="text-xl text-slate-800">I Need Support</CardTitle>
                <p className="text-slate-600">But don't know where to find it</p>
                <p className="text-sm text-orange-700 italic font-medium mt-2">
                  Your support network is waiting to be activated.
                  <br />You're not walking this path alone.
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-teal-50/50 via-blue-50/40 to-emerald-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Your Personalized Solution
            </Badge>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              The MyRhythm Difference
            </h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our LEAP framework transforms your challenges into your greatest strengths
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-2 border-teal-200/50 bg-gradient-to-br from-teal-50/80 to-emerald-50/60 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-teal-800 mb-2">Learn</h4>
              <p className="text-sm text-teal-700">Understand your unique cognitive patterns</p>
            </Card>

            <Card className="text-center p-6 border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-teal-50/60 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-blue-800 mb-2">Empower</h4>
              <p className="text-sm text-blue-700">Build confidence through personalized strategies</p>
            </Card>

            <Card className="text-center p-6 border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/80 to-blue-50/60 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-emerald-800 mb-2">Accelerate</h4>
              <p className="text-sm text-emerald-700">Fast-track your progress with proven methods</p>
            </Card>

            <Card className="text-center p-6 border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-red-50/60 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-orange-800 mb-2">Personalize</h4>
              <p className="text-sm text-orange-700">Tailor everything to your specific needs</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-50/30 via-teal-50/20 to-emerald-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Everything You Need in One Place
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 border-2 border-teal-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-teal-600" />
                <h4 className="font-bold text-slate-800">Personalized Assessment</h4>
              </div>
              <p className="text-slate-600">Deep insights into your cognitive patterns and needs</p>
            </Card>

            <Card className="p-6 border-2 border-blue-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h4 className="font-bold text-slate-800">Daily Planning</h4>
              </div>
              <p className="text-slate-600">Structured routines that work with your rhythm</p>
            </Card>

            <Card className="p-6 border-2 border-emerald-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-emerald-600" />
                <h4 className="font-bold text-slate-800">Support Network</h4>
              </div>
              <p className="text-slate-600">Connect with others who understand your journey</p>
            </Card>

            <Card className="p-6 border-2 border-orange-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-orange-600" />
                <h4 className="font-bold text-slate-800">Goal Tracking</h4>
              </div>
              <p className="text-slate-600">Celebrate progress and build momentum</p>
            </Card>

            <Card className="p-6 border-2 border-red-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-6 w-6 text-red-600" />
                <h4 className="font-bold text-slate-800">Expert Guidance</h4>
              </div>
              <p className="text-slate-600">Access to professionals when you need them</p>
            </Card>

            <Card className="p-6 border-2 border-teal-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-teal-600" />
                <h4 className="font-bold text-slate-800">Secure & Private</h4>
              </div>
              <p className="text-slate-600">Your data is protected with enterprise-grade security</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-100/50 via-blue-100/40 to-emerald-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
            Your Journey Starts Today
          </h3>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands who've transformed their lives with MyRhythm. 
            Your personalized path to cognitive wellness awaits.
          </p>
          
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-teal-600 via-blue-600 to-emerald-600 hover:from-teal-700 hover:via-blue-700 hover:to-emerald-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Begin Your Transformation
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Free Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>7-Day Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OptimizedLanding;
