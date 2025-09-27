import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Play, Brain, Sparkles, Users, TrendingUp, Star, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Brain Injury Survivor",
    text: "MyRhythm gave me my confidence back. I can trust my memory again.",
    rating: 5,
    image: "👩‍💼"
  },
  {
    name: "Dr. Jennifer K.",
    role: "Neuropsychologist",
    text: "The most comprehensive cognitive assessment tool I've used.",
    rating: 5,
    image: "👩‍⚕️"
  },
  {
    name: "Michael R.",
    role: "Caregiver",
    text: "Finally, a system that helps both me and my wife navigate memory challenges.",
    rating: 5,
    image: "👨‍🦳"
  }
];

const stats = [
  { number: "94%", label: "Report improved memory confidence", icon: "🧠" },
  { number: "2.3x", label: "Faster task completion", icon: "⚡" },
  { number: "89%", label: "Reduced cognitive fatigue", icon: "🌟" },
  { number: "15k+", label: "Lives transformed", icon: "❤️" }
];

export function AppleHeroSection() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate("/mvp/user-type-selection");
  };

  const handleTryAssessment = () => {
    navigate("/quick-assessment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-brain-health-50/20 relative overflow-hidden">
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-brain-health-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                className="px-6 py-2 font-medium border-memory-emerald-300 text-memory-emerald-700 hover:bg-memory-emerald-50 hover:border-memory-emerald-400 transition-all duration-300"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main Hero */}
          <div className="text-center space-y-12 max-w-5xl mx-auto">
            {/* Trust Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-purple-100 to-brain-health-100 text-brain-health-700 border-0 rounded-full">
                <Star className="w-4 h-4 mr-2 text-sunrise-amber-500 fill-current" />
                FDA Compliant • Clinically Validated • Brain Health Certified
              </Badge>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="block text-gray-900">Empower Your</span>
                <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-brain-health-600 bg-clip-text text-transparent">
                  Memory Journey
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                You have the power to transform challenges into confidence. Take control of your cognitive journey with personalized empowerment.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate("/auth")}
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                onClick={handleTryAssessment}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-brain-health-400 hover:bg-brain-health-50 transition-all duration-300 rounded-full group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:text-brain-health-600" />
                Experience Your Power
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Demo Preview */}
          <div className="mt-20 max-w-4xl mx-auto">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">Experience Your Assessment Preview</h3>
                  <p className="text-gray-600">See how our MYRHYTHM framework adapts to your unique cognitive patterns</p>
                </div>
                
                {/* Mock Assessment Preview */}
                <div className="bg-gradient-to-br from-purple-50 to-brain-health-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-brain-health-500 flex items-center justify-center text-white font-bold text-sm">
                      M
                    </div>
                    <span className="text-sm font-medium text-gray-700">MOMENT OF IMPACT</span>
                  </div>
                  <div className="space-y-3">
                    <p className="font-medium text-gray-900">How would you describe your current memory confidence?</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-transparent hover:border-brain-health-300 transition-colors cursor-pointer">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                        <span className="text-gray-700">I feel confident most of the time</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-brain-health-400 transition-colors">
                        <div className="w-4 h-4 rounded-full bg-brain-health-400 border-2 border-brain-health-400"></div>
                        <span className="text-gray-700">Some days are better than others</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-transparent hover:border-brain-health-300 transition-colors cursor-pointer">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                        <span className="text-gray-700">I struggle with memory daily</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={handleTryAssessment}
                      className="bg-gradient-to-r from-purple-600 to-brain-health-600 hover:from-purple-700 hover:to-brain-health-700"
                    >
                      Take Full Assessment
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Rotating Testimonials */}
          <div className="mt-20">
            <Card className="max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="text-4xl">{testimonials[currentTestimonial].image}</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-center gap-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-sunrise-amber-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>

                {/* Testimonial Dots */}
                <div className="flex justify-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonial ? 'bg-brain-health-500 w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-20">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ready to empower your memory journey?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands who've taken control of their cognitive confidence with MyRhythm
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                size="lg"
                className="px-10 py-5 text-xl font-semibold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full group"
              >
                Start Your Journey
                <Sparkles className="ml-3 h-6 w-6 group-hover:animate-pulse" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-brain-health-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-brain-health-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}