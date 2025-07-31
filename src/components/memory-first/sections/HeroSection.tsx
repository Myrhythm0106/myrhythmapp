import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SpeechButton } from "@/components/ui/SpeechButton";
import { Brain, Users, Heart, ArrowRight, CheckCircle, Star, Play, Volume2, Eye, Zap, User, UserPlus, Stethoscope } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<'individual' | 'family' | 'cognitive-optimization' | 'wellness' | 'colleague' | 'professional' | null>(null);
  const [showQuickView, setShowQuickView] = useState(true);
  const [textSize, setTextSize] = useState('medium');
  const [simpleMode, setSimpleMode] = useState(false);

  const handleTextToSpeech = () => {
    const textToRead = "MyRhythm. Memory Challenges Don't End Your Story. The only authentic app designed for minds recovering from brain injury, stroke, concussion, or memory challenges.";
    // SpeechButton will handle the actual speech
  };

  const handleLargerText = () => {
    const sizes = ['medium', 'large', 'xl'];
    const currentIndex = sizes.indexOf(textSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    setTextSize(nextSize);
    
    // Apply to document root
    document.documentElement.style.setProperty('--text-scale', 
      nextSize === 'large' ? '1.1' : nextSize === 'xl' ? '1.2' : '1'
    );
  };

  const handleSimpleMode = () => {
    setSimpleMode(!simpleMode);
    if (!simpleMode) {
      document.body.classList.add('simple-mode');
    } else {
      document.body.classList.remove('simple-mode');
    }
  };

  const handleShowDemo = () => {
    window.open('https://www.youtube.com/watch?v=demolink', '_blank');
  };
  
  const userTypes = [{
    id: 'individual' as const,
    icon: Brain,
    title: 'I\'m a Survivor',
    subtitle: 'Living with memory challenges',
    color: 'purple',
    description: 'Built specifically for your recovery journey'
  }, {
    id: 'family' as const,
    icon: Heart,
    title: 'I\'m Family/Caregiver',
    subtitle: 'Supporting someone I love',
    color: 'teal',
    description: 'Help without taking over their independence'
  }, {
    id: 'cognitive-optimization' as const,
    icon: Brain,
    title: 'Cognitive Enhancement',
    subtitle: 'Optimizing mental performance',
    color: 'blue',
    description: 'Enhance your cognitive abilities and mental clarity'
  }, {
    id: 'wellness' as const,
    icon: Users,
    title: 'General Wellness',
    subtitle: 'Overall mental health focus',
    color: 'green',
    description: 'Supporting your overall mental wellness journey'
  }, {
    id: 'professional' as const,
    icon: Stethoscope,
    title: 'Medical Professional',
    subtitle: 'Healthcare provider',
    color: 'rose',
    description: 'Supporting patients with cognitive challenges'
  }, {
    id: 'colleague' as const,
    icon: UserPlus,
    title: 'Colleague',
    subtitle: 'Supporting workplace wellness',
    color: 'indigo',
    description: 'Help colleagues navigate cognitive challenges'
  }];
  const quickBenefits = [{
    icon: Brain,
    text: 'Works with memory challenges, not against them',
    color: 'purple'
  }, {
    icon: Users,
    text: 'Family support without dependency',
    color: 'blue'
  }, {
    icon: Heart,
    text: 'Built by survivors, for survivors',
    color: 'teal'
  }];
  return <section className="relative overflow-hidden space-y-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-teal-600/5 rounded-lg" />
      <div className="absolute top-0 right-0 opacity-5">
        <Brain size={300} />
      </div>
      
      <div className="relative z-10 p-6 md:p-10 space-y-8">
        {/* Top Section with Login and Badges */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 text-sm px-4 py-2 shadow-lg">
              <Brain className="h-4 w-4 mr-2" />
              Memory-First Design
            </Badge>
            <Badge className="bg-gradient-to-r from-teal-600 to-teal-700 text-white border-0 text-sm px-4 py-2 shadow-lg">
              <Heart className="h-4 w-4 mr-2" />
              Brain Injury Survivor Built
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Already have an account?</span>
            <Button variant="outline" onClick={() => navigate("/auth")} className="gap-2">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>

        {/* Visual-First Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              MyRhythm
            </span>
            <br />
            <span className="text-foreground text-lg md:text-xl lg:text-2xl">
              Memory Challenges Don't End Your Story
            </span>
          </h1>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 max-w-4xl">
            <p className="text-xl md:text-2xl text-blue-800 leading-relaxed font-medium">🧠 The only authentic app designed for minds recovering from brain injury, stroke, concussion, or memory challenges</p>
          </div>
        </div>

        {/* User Type Selection - Brain-Friendly Visual Choice */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">👋 Which describes you?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {userTypes.map(type => <Card key={type.id} className={`cursor-pointer transition-all hover:shadow-lg border-2 ${selectedUserType === type.id ? `border-${type.color}-300 bg-${type.color}-50` : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedUserType(type.id)}>
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
              </Card>)}
          </div>
        </div>

        {/* Quick Benefits - Visual Icons with Minimal Text */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-emerald-200 max-w-4xl mx-auto">
          <h3 className="text-center font-semibold mb-4 text-emerald-800">✨ Why We're Different</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickBenefits.map((benefit, index) => <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <div className={`bg-${benefit.color}-100 p-2 rounded-lg`}>
                  <benefit.icon className={`h-5 w-5 text-${benefit.color}-600`} />
                </div>
                <span className="text-sm text-emerald-700 leading-tight">{benefit.text}</span>
              </div>)}
          </div>
        </div>

        {/* Brain-Friendly Accessibility Features - Redesigned */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl border border-emerald-200 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-emerald-800 flex items-center justify-center gap-2">
              <Brain className="h-5 w-5" />
              Brain-Friendly Features
            </h3>
            <p className="text-sm text-emerald-700">Designed to work with your brain, not against it</p>
            <div className="flex flex-wrap justify-center gap-3">
              <SpeechButton 
                text="MyRhythm. Memory Challenges Don't End Your Story. The only authentic app designed for minds recovering from brain injury, stroke, concussion, or memory challenges."
                variant="outline"
                showLabel={true}
                className="gap-2 px-4 py-3 bg-white/80 hover:bg-white border-emerald-300 text-emerald-700 hover:text-emerald-800"
              />
              <Button 
                variant="outline" 
                onClick={handleLargerText}
                className="gap-2 px-4 py-3 bg-white/80 hover:bg-white border-blue-300 text-blue-700 hover:text-blue-800"
              >
                <Eye className="h-4 w-4" />
                {textSize === 'medium' ? 'Larger Text' : textSize === 'large' ? 'Extra Large' : 'Normal Text'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSimpleMode}
                className="gap-2 px-4 py-3 bg-white/80 hover:bg-white border-purple-300 text-purple-700 hover:text-purple-800"
              >
                <Zap className="h-4 w-4" />
                {simpleMode ? 'Normal Mode' : 'Simple Mode'}
              </Button>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure CTA */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/onboarding")}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-lg block mx-auto"
            >
              <span className="hidden sm:inline">🧠 Start Your Memory-First Journey</span>
              <span className="sm:hidden">🧠 Start Journey</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {selectedUserType === 'family' && (
              <Button 
                size="lg"
                variant="outline" 
                onClick={() => navigate("/onboarding?type=family")}
                className="border-2 border-teal-300 text-teal-700 hover:bg-teal-50 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-lg block mx-auto mt-4"
              >
                <Heart className="mr-2 h-5 w-5" />
                I'm a Family Member/Caregiver
              </Button>
            )}
          </div>
          
          <div className="flex justify-center gap-4 text-sm">
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleShowDemo}>
              <Play className="h-4 w-4" />
              Quick Demo (2 min)
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowQuickView(!showQuickView)}>
              {showQuickView ? 'Show More Details' : 'Show Less'}
            </Button>
          </div>

          {!showQuickView && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-gray-200 max-w-4xl mx-auto space-y-4">
              <h4 className="font-semibold text-lg text-gray-800">Why MyRhythm Works</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">📊 Proven Results</h5>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>95% reduction</strong> in missed appointments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>78% improvement</strong> in daily task completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>85% of families</strong> report reduced stress</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">🧠 Memory-First Design</h5>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Visual cues replace complex text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Automatic reminders and prompts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Family support without dependency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Trust Indicators - Visual */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground pt-4">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              1,000+ survivors
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Family-tested
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Medical approved
            </span>
          </div>
        </div>
      </div>
    </section>;
}