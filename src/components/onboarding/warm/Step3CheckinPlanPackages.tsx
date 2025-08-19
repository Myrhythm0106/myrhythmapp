import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Check, Star, Zap, Crown } from 'lucide-react';

interface CheckInData {
  energy: number;
  stress: number;
  focus: number;
  memoryConfidence: number;
  sleepQuality: number;
}

interface Step3CheckinPlanPackagesProps {
  persona: string;
  intents: string[];
  onComplete: (checkIn: CheckInData, selectedPackage: 'starter' | 'plus' | 'pro', selectedPath: 'guided' | 'explorer') => void;
}

export function Step3CheckinPlanPackages({ persona, intents, onComplete }: Step3CheckinPlanPackagesProps) {
  const [checkIn, setCheckIn] = useState<CheckInData>({
    energy: 5,
    stress: 5,
    focus: 5,
    memoryConfidence: 5,
    sleepQuality: 5
  });
  
  const [showResults, setShowResults] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'plus' | 'pro'>('starter');
  const [selectedPath, setSelectedPath] = useState<'guided' | 'explorer' | null>(null);

  const checkInItems = [
    { key: 'energy' as keyof CheckInData, label: 'Energy level', lowLabel: 'Exhausted', highLabel: 'Energized' },
    { key: 'stress' as keyof CheckInData, label: 'Stress level', lowLabel: 'Overwhelmed', highLabel: 'Calm' },
    { key: 'focus' as keyof CheckInData, label: 'Focus ability', lowLabel: 'Scattered', highLabel: 'Sharp' },
    { key: 'memoryConfidence' as keyof CheckInData, label: 'Memory confidence', lowLabel: 'Worried', highLabel: 'Confident' },
    { key: 'sleepQuality' as keyof CheckInData, label: 'Sleep quality', lowLabel: 'Poor', highLabel: 'Excellent' }
  ];

  const handleSliderChange = (key: keyof CheckInData, value: number[]) => {
    setCheckIn(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSubmitCheckIn = () => {
    setShowResults(true);
  };

  const getPersonalizedRecommendations = () => {
    const recommendations = [];
    
    if (checkIn.energy <= 3) {
      recommendations.push("Let's start with gentle energy-building routines");
    }
    if (checkIn.stress >= 7) {
      recommendations.push("We'll focus on stress management techniques");
    }
    if (checkIn.focus <= 4) {
      recommendations.push("Short focus sessions will help rebuild concentration");
    }
    if (checkIn.memoryConfidence <= 4) {
      recommendations.push("Memory capture tools will boost your confidence");
    }
    if (checkIn.sleepQuality <= 4) {
      recommendations.push("Sleep optimization will be a priority");
    }

    if (recommendations.length === 0) {
      recommendations.push("You're in a good place - let's build on your strengths");
    }

    return recommendations.slice(0, 3);
  };

  const packages = [
    {
      id: 'starter' as const,
      name: 'Starter',
      price: 'Free',
      icon: Zap,
      color: 'border-memory-emerald-200 bg-memory-emerald-50',
      buttonColor: 'bg-memory-emerald-600 hover:bg-memory-emerald-700',
      features: [
        'Daily 60-second check-ins',
        'Memory Bridge basics (3 recordings/month)',
        '1 support share per month',
        'Basic insights dashboard'
      ],
      lookForward: [
        'Build awareness of your patterns',
        'Start capturing important moments',
        'Connect with support when needed'
      ],
      transformation: 'Begin your journey with confidence and clarity'
    },
    {
      id: 'plus' as const,
      name: 'Plus',
      price: '$9.99/mo',
      icon: Star,
      color: 'border-brain-health-200 bg-brain-health-50',
      buttonColor: 'bg-brain-health-600 hover:bg-brain-health-700',
      popular: true,
      features: [
        'Everything in Starter',
        'Unlimited Memory Bridge recordings',
        'Routine builder & calendar sync',
        'Advanced insights & trends',
        'Unlimited support shares',
        'Weekly reflection prompts'
      ],
      lookForward: [
        'Comprehensive memory support',
        'Personalized routine building',
        'Deep insight into your patterns'
      ],
      transformation: 'Transform your daily rhythm into sustainable wellness'
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: '$19.99/mo',
      icon: Crown,
      color: 'border-clarity-teal-200 bg-clarity-teal-50',
      buttonColor: 'bg-clarity-teal-600 hover:bg-clarity-teal-700',
      features: [
        'Everything in Plus',
        'AI-powered coaching prompts',
        'Advanced analytics & reports',
        'Priority support',
        'Family/caregiver collaboration',
        'Expert-designed programs'
      ],
      lookForward: [
        'AI-guided personal coaching',
        'Professional-grade analytics',
        'Collaborative care features'
      ],
      transformation: 'Achieve optimal cognitive wellness with expert guidance'
    }
  ];

  if (!showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-brain-health-900">
            Your 60-second check‑in
          </h1>
          <p className="text-xl text-brain-health-700 max-w-2xl mx-auto">
            Help us understand how you're feeling right now so we can personalize your experience.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-8 space-y-8">
            {checkInItems.map((item) => (
              <div key={item.key} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-brain-health-900">
                    {item.label}
                  </h3>
                  <Badge variant="outline" className="text-brain-health-700">
                    {checkIn[item.key]}/10
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[checkIn[item.key]]}
                    onValueChange={(value) => handleSliderChange(item.key, value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-brain-health-600">
                    <span>{item.lowLabel}</span>
                    <span>{item.highLabel}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmitCheckIn}
                size="lg"
                className="px-8 py-3 text-lg font-semibold"
              >
                See my personalized plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-brain-health-900">
          Here's what we heard
        </h1>
        <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
          Based on your check-in, here's your personalized plan and the right package to support your journey.
        </p>
      </div>

      {/* Personalized Recommendations */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-brain-health-50 to-memory-emerald-50">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-brain-health-900 mb-4">
            Your personalized focus areas:
          </h3>
          <div className="space-y-2">
            {getPersonalizedRecommendations().map((rec, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-memory-emerald-600 flex-shrink-0" />
                <span className="text-brain-health-700">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Package Selection */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brain-health-900 mb-2">
            Choose your package
          </h2>
          <p className="text-brain-health-700">
            Start your transformation with the right level of support
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon;
            return (
              <Card 
                key={pkg.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedPackage === pkg.id 
                    ? `${pkg.color} border-2 shadow-lg` 
                    : 'border border-gray-200 hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brain-health-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className={`p-3 rounded-xl ${pkg.buttonColor} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-brain-health-900">
                    {pkg.name}
                  </CardTitle>
                  <p className="text-3xl font-bold text-brain-health-900">
                    {pkg.price}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-brain-health-900">Features:</h4>
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-memory-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-brain-health-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-brain-health-900">What to look forward to:</h4>
                    {pkg.lookForward.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-clarity-teal-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-brain-health-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                    <p className="text-sm font-medium text-brain-health-900 mb-1">
                      Transformation you can expect:
                    </p>
                    <p className="text-sm text-brain-health-700">
                      {pkg.transformation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Choose Your Path */}
        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-brain-health-900">
                Choose your path
              </h3>
              <p className="text-brain-health-700">
                How would you like to experience MyRhythm?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <button
                onClick={() => setSelectedPath('guided')}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left relative ${
                  selectedPath === 'guided'
                    ? 'border-brain-health-300 bg-brain-health-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Badge className="absolute -top-2 left-4 bg-brain-health-500 text-white">
                  Recommended
                </Badge>
                <h4 className="text-xl font-bold text-brain-health-900 mb-1">
                  Guided
                </h4>
                <p className="text-sm text-brain-health-600 mb-2 font-medium">
                  Recommended
                </p>
                <p className="text-brain-health-700">
                  Step-by-step support with personalized guidance
                </p>
              </button>
              
              <button
                onClick={() => setSelectedPath('explorer')}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedPath === 'explorer'
                    ? 'border-brain-health-300 bg-brain-health-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <h4 className="text-xl font-bold text-brain-health-900 mb-1">
                  Explorer
                </h4>
                <p className="text-sm text-brain-health-600 mb-2 font-medium">
                  I prefer to discover
                </p>
                <p className="text-brain-health-700">
                  Freedom to explore features at your own pace
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            onClick={() => selectedPath && onComplete(checkIn, selectedPackage, selectedPath)}
            disabled={!selectedPath}
            size="lg"
            className="px-12 py-4 text-xl font-semibold"
          >
            {selectedPackage === 'starter' ? 'Start with Starter (free)' : `Try ${packages.find(p => p.id === selectedPackage)?.name}`}
          </Button>
        </div>
      </div>
    </div>
  );
}