import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowRight, 
  Star,
  Heart,
  Target,
  Zap
} from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Cognitive Empowerment",
    description: "Transform memory challenges into confidence with personalized strategies"
  },
  {
    icon: TrendingUp,
    title: "Measurable Progress",
    description: "Track your cognitive improvements with scientifically-backed assessments"
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Join a community guided by cognitive health professionals"
  },
  {
    icon: Target,
    title: "Personalized Journey",
    description: "Get tailored recommendations based on your unique cognitive profile"
  }
];

const testimonials = [
  {
    text: "MyRhythm gave me back my confidence. I can trust my memory again.",
    author: "Sarah M.",
    role: "Brain Injury Survivor"
  },
  {
    text: "The assessment revealed patterns I never noticed. Life-changing insights.",
    author: "Dr. Jennifer K.",
    role: "Neuropsychologist"
  }
];

export default function CongratsPage() {
  const navigate = useNavigate();
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const handleAssessmentChoice = (type: 'brief' | 'comprehensive') => {
    setSelectedAssessment(type);
    navigate(`/mvp/assessment?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-clarity-teal-50/20 to-brain-health-50/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Badge className="px-6 py-2 bg-gradient-to-r from-memory-emerald-100 to-brain-health-100 text-memory-emerald-800 border-0 rounded-full">
              <Star className="w-4 h-4 mr-2 text-sunrise-amber-500 fill-current" />
              Welcome to the MyRhythm Community
            </Badge>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              <span className="block">Congratulations!</span>
              <span className="block bg-gradient-to-r from-memory-emerald-600 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                You're One Step Closer
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              You're about to join <span className="font-semibold text-memory-emerald-700">15,000+ individuals</span> who've transformed their memory challenges into cognitive confidence.
            </p>
          </div>
        </div>

        {/* Why MyRhythm Section */}
        <Card className="border-memory-emerald-200 bg-gradient-to-br from-white to-memory-emerald-50/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-memory-emerald-600" />
              Why MyRhythm Will Transform Your Life
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-memory-emerald-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Assessment Choice */}
        <Card className="border-brain-health-200 bg-gradient-to-br from-white to-brain-health-50/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="h-6 w-6 text-brain-health-600" />
              Choose Your Assessment Experience
            </CardTitle>
            <p className="text-gray-600">
              We want to know more about you to create your personalized cognitive empowerment plan.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Brief Assessment */}
              <div className="border-2 border-memory-emerald-200 rounded-xl p-6 bg-gradient-to-br from-memory-emerald-50/50 to-white hover:border-memory-emerald-300 transition-all cursor-pointer group"
                   onClick={() => handleAssessmentChoice('brief')}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-memory-emerald-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Brief Assessment</h3>
                    <Badge variant="secondary" className="text-xs">3 minutes</Badge>
                  </div>
                  
                  <p className="text-gray-600">
                    Quick insights into your cognitive patterns and personalized recommendations to get started.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="h-4 w-4 text-memory-emerald-500" />
                      Essential cognitive profile
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="h-4 w-4 text-memory-emerald-500" />
                      Starter empowerment plan
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white group-hover:scale-105 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssessmentChoice('brief');
                    }}
                  >
                    Start Brief Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Comprehensive Assessment */}
              <div className="border-2 border-brain-health-200 rounded-xl p-6 bg-gradient-to-br from-brain-health-50/50 to-white hover:border-brain-health-300 transition-all cursor-pointer group relative"
                   onClick={() => handleAssessmentChoice('comprehensive')}>
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-sunrise-amber-500 to-sunrise-amber-600 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-brain-health-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Comprehensive Assessment</h3>
                    <Badge variant="secondary" className="text-xs">10 minutes</Badge>
                  </div>
                  
                  <p className="text-gray-600">
                    Deep cognitive analysis with detailed insights and a complete personalized empowerment strategy.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Brain className="h-4 w-4 text-brain-health-500" />
                      Complete cognitive mapping
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 text-brain-health-500" />
                      Advanced progress tracking
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-brain-health-500" />
                      Expert support recommendations
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white group-hover:scale-105 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssessmentChoice('comprehensive');
                    }}
                  >
                    Start Comprehensive Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-clarity-teal-200 bg-gradient-to-br from-white to-clarity-teal-50/30">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-sunrise-amber-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Footer */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-memory-emerald-500 rounded-full"></div>
              <span>15,000+ Lives Transformed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
              <span>Clinically Validated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-clarity-teal-500 rounded-full"></div>
              <span>GDPR Compliant</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            Your privacy is protected. All data is encrypted and secure. You can withdraw consent at any time.
          </p>
        </div>
      </div>
    </div>
  );
}