import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Brain, Users, Star, CheckCircle, Play, Sparkles, Award, Shield, TrendingUp, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LoginModal } from "@/components/auth/LoginModal";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "MyRhythm transformed my recovery journey. I went from scattered to structured in just weeks.",
      author: "Sarah M.",
      role: "TBI Survivor • Mother of 2",
      avatar: "🧠"
    },
    {
      text: "Finally, a system that works WITH my brain, not against it. My family noticed the difference immediately.",
      author: "Michael R.", 
      role: "Stroke Survivor • Executive",
      avatar: "⚡"
    },
    {
      text: "The MYRHYTHM framework gave me back my confidence. I'm now thriving in ways I never imagined.",
      author: "Emma L.",
      role: "Brain Aneurysm Survivor",
      avatar: "✨"
    }
  ];

  const stats = [
    { number: "94%", label: "See Progress in 7 Days" },
    { number: "2.8x", label: "Faster Recovery" },
    { number: "5★", label: "Family Satisfaction" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToFramework = () => {
    const element = document.getElementById('myrhythm-framework');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartJourney = () => {
    navigate("/auth");
  };

  return (
    <TooltipProvider>
      <section className="relative min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/20 overflow-hidden">
        {/* Apple-level floating elements with sophisticated animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/15 via-blue-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-teal-400/15 via-purple-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-blue-400/15 via-teal-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Floating brain icons */}
          <div className="absolute top-20 left-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}>
            <Brain className="w-8 h-8 text-purple-400/20" />
          </div>
          <div className="absolute top-40 right-1/3 animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }}>
            <Sparkles className="w-6 h-6 text-blue-400/20" />
          </div>
          <div className="absolute bottom-40 left-1/5 animate-bounce" style={{ animationDelay: '4s', animationDuration: '7s' }}>
            <Star className="w-7 h-7 text-teal-400/20" />
          </div>
        </div>

        {/* Apple-level Fixed Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/30 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>7-Day Free Trial</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setShowLoginModal(true)}
                className="hover:bg-purple-50 text-purple-700 font-medium transition-all duration-300 px-6 py-2 rounded-full"
              >
                Login
              </Button>
            </div>
          </div>
        </div>

        {/* Apple-level Main Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Hero Content */}
              <div className="space-y-10">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full border border-purple-200 shadow-sm">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Award-Winning Recovery System</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                      MyRhythm
                    </span>
                    <br />
                    <span className="text-gray-900 text-3xl md:text-5xl lg:text-6xl font-light">
                      Reclaim Your Life
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed max-w-xl">
                    Transform memory challenges into <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">unstoppable momentum</span> with the proven MYRHYTHM framework
                  </p>
                </div>

                {/* Social Proof Numbers - Apple style */}
                <div className="grid grid-cols-3 gap-6 py-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group cursor-pointer">
                      <div className={`text-3xl md:text-4xl font-bold transition-all duration-300 group-hover:scale-110 ${
                        index === 0 ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' :
                        index === 1 ? 'bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent' :
                        'bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent'
                      }`}>
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 font-medium mt-1 leading-tight">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons - Apple level */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleStartJourney}
                    className="text-lg px-10 py-7 h-auto bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 font-semibold rounded-2xl group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      <Play className="w-5 h-5" />
                      <span>Start Your Journey Today</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={scrollToFramework}
                    className="text-lg px-10 py-7 h-auto border-2 border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-300 font-medium rounded-2xl"
                  >
                    See How It Works
                  </Button>
                </div>

                {/* Trust Indicators - Apple level */}
                <div className="flex flex-wrap items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="font-medium">7-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Instant access</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Interactive Demo & Testimonials */}
              <div className="relative space-y-8">
                {/* Live Assessment Preview */}
                <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-200/50 shadow-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Live Assessment Preview
                      </h3>
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Live Demo</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
                        <p className="text-sm font-medium text-gray-800 mb-3">How often do you feel overwhelmed by daily tasks?</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="text-left justify-start hover:bg-purple-50">Often</Button>
                          <Button variant="outline" size="sm" className="text-left justify-start bg-purple-100 border-purple-300">Sometimes</Button>
                        </div>
                      </div>
                      
                      <div className="text-center py-4">
                        <Button 
                          onClick={handleStartJourney}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-300 hover:scale-105 px-6 py-3"
                        >
                          Complete Full Assessment Free
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rotating Testimonials - Apple style */}
                <Card className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-purple-200/50 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">Success Story</span>
                    </div>
                    
                    <div className="space-y-4 transition-all duration-1000">
                      <p className="text-gray-700 italic leading-relaxed font-medium">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">
                          {testimonials[currentTestimonial].avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{testimonials[currentTestimonial].author}</div>
                          <div className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonial indicators */}
                    <div className="flex justify-center gap-2 mt-4">
                      {testimonials.map((_, index) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentTestimonial ? 'bg-purple-600 w-6' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick stats overlay */}
                <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200/50">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-gray-700">15,000+ Lives Transformed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apple-level Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="animate-bounce cursor-pointer" onClick={scrollToFramework}>
            <p className="text-xs text-gray-500 mb-3 font-medium tracking-widest uppercase">Discover Framework</p>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </section>
    </TooltipProvider>
  );
}