import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Heart, ArrowRight, CheckCircle, Star, Play, Volume2, Eye, Zap, User, UserPlus } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<'individual' | 'family' | null>(null);
  const [showQuickView, setShowQuickView] = useState(true);
  
  const userTypes = [
    {
      id: 'individual' as const,
      icon: Brain,
      title: 'I\'m a Survivor',
      subtitle: 'Living with memory challenges',
      color: 'purple',
      description: 'Built specifically for your recovery journey'
    },
    {
      id: 'family' as const,
      icon: Heart,
      title: 'I\'m Family/Caregiver',
      subtitle: 'Supporting someone I love',
      color: 'teal',
      description: 'Help without taking over their independence'
    }
  ];

  const quickBenefits = [
    { icon: Brain, text: 'Works with memory challenges, not against them', color: 'purple' },
    { icon: Users, text: 'Family support without dependency', color: 'blue' },
    { icon: Heart, text: 'Built by survivors, for survivors', color: 'teal' }
  ];

  return (
    <section className="relative overflow-hidden space-y-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-teal-600/5 rounded-lg" />
      <div className="absolute top-0 right-0 opacity-5">
        <Brain size={300} />
      </div>
      
      <div className="relative z-10 p-6 md:p-10 space-y-8">
        {/* Top Badges - Brain-Friendly Visual */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-sm px-3 py-1">
            <Brain className="h-4 w-4 mr-2" />
            Memory-First Design
          </Badge>
          <Badge className="bg-teal-100 text-teal-700 border border-teal-200 text-sm px-3 py-1">
            <Heart className="h-4 w-4 mr-2" />
            Brain Injury Survivor Built
          </Badge>
        </div>

        {/* Visual-First Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Memory Challenges
            </span>
            <br />
            <span className="text-foreground">
              Don't End Your Story
            </span>
          </h1>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 max-w-4xl">
            <p className="text-xl md:text-2xl text-blue-800 leading-relaxed font-medium">
              🧠 The only app designed for minds recovering from brain injury, stroke, concussion, or memory challenges
            </p>
          </div>
        </div>

        {/* User Type Selection - Brain-Friendly Visual Choice */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">👋 Which describes you?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {userTypes.map((type) => (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedUserType === type.id 
                    ? `border-${type.color}-300 bg-${type.color}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedUserType(type.id)}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`bg-${type.color}-100 p-4 rounded-full w-fit mx-auto`}>
                    <type.icon className={`h-8 w-8 text-${type.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{type.title}</h4>
                    <p className="text-sm text-muted-foreground">{type.subtitle}</p>
                    <p className="text-xs text-muted-foreground mt-2">{type.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Benefits - Visual Icons with Minimal Text */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-emerald-200 max-w-4xl mx-auto">
          <h3 className="text-center font-semibold mb-4 text-emerald-800">✨ Why We're Different</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <div className={`bg-${benefit.color}-100 p-2 rounded-lg`}>
                  <benefit.icon className={`h-5 w-5 text-${benefit.color}-600`} />
                </div>
                <span className="text-sm text-emerald-700 leading-tight">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Features - Brain-Friendly Options */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm">
            <Button variant="outline" size="sm" className="gap-2">
              <Volume2 className="h-4 w-4" />
              Read Aloud
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Larger Text
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Zap className="h-4 w-4" />
              Quick Mode
            </Button>
          </div>
        </div>

        {/* Progressive Disclosure CTA */}
        <div className="text-center space-y-4">
          <Button 
            size="lg" 
            onClick={() => navigate("/onboarding")}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-lg px-8 py-6 shadow-lg"
          >
            🧠 Start Your Memory-First Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="flex justify-center gap-4 text-sm">
            <Button variant="ghost" size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Quick Demo (2 min)
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowQuickView(!showQuickView)}>
              {showQuickView ? 'Show More Details' : 'Show Less'}
            </Button>
          </div>

          {/* Trust Indicators - Visual */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground pt-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              1,000+ survivors
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Family-tested
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Medical approved
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}