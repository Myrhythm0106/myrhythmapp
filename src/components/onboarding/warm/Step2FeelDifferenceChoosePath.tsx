import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, BarChart3, Users, ArrowRight } from 'lucide-react';
import organizedActionImage from '@/assets/onboarding/organized-professional-african-american.jpg';

interface Step2FeelDifferenceChoosePathProps {
  persona: string;
  intents: string[];
  onComplete: () => void;
  setPath: (path: 'guided' | 'explorer') => void;
  variant?: 'default' | 'mvp';
}

export function Step2FeelDifferenceChoosePath({ persona, intents, onComplete, setPath, variant = 'default' }: Step2FeelDifferenceChoosePathProps) {
  const getPersonalizedText = (baseText: string) => {
    const personaText = persona === 'me' ? 'your' : persona === 'loved-one' ? 'their' : 'your client\'s';
    const intentContext = intents.length > 1 ? 'your needs' : intents[0]?.toLowerCase() || 'your goals';
    return `${baseText} for ${intentContext}`;
  };

  const differenceCards = [
    {
      title: "Never lose precious moments",
      subtitle: "Capture",
      description: getPersonalizedText("Record conversations and important moments"),
      icon: Sparkles,
      gradient: "from-memory-emerald-600 to-memory-emerald-700",
      bgColor: "bg-memory-emerald-50"
    },
    {
      title: "Transform overwhelm into organized action",
      subtitle: "Calibrate", 
      description: getPersonalizedText("Turn chaos into clear, manageable and planned steps for your needs"),
      icon: Calendar,
      gradient: "from-brain-health-600 to-brain-health-700",
      bgColor: "bg-brain-health-50",
      image: organizedActionImage
    },
    {
      title: "Understand your inner rhythm",
      subtitle: "Check-in + Insights",
      description: getPersonalizedText("Track patterns and build sustainable routines"),
      icon: BarChart3,
      gradient: "from-clarity-teal-600 to-clarity-teal-700", 
      bgColor: "bg-clarity-teal-50"
    },
    {
      title: "You're never walking alone",
      subtitle: "Support & Community",
      description: getPersonalizedText("Connect with others who understand the journey"),
      icon: Users,
      gradient: "from-sunrise-amber-600 to-sunrise-amber-700",
      bgColor: "bg-sunrise-amber-50"
    }
  ];

  const pathOptions = [
    {
      id: 'guided' as const,
      title: 'Guided',
      subtitle: 'Recommended',
      description: 'Step-by-step support with personalized guidance',
      recommended: true
    },
    {
      id: 'explorer' as const,
      title: 'Explorer', 
      subtitle: 'I prefer to discover',
      description: 'Freedom to explore features at your own pace',
      recommended: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-brain-health-900">
          Feel the Difference
        </h1>
        <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
          Experience how MyRhythm transforms your daily cognitive wellness journey through our four core solutions.
        </p>
      </div>

      {/* Four Core Solutions */}
      <div className="grid md:grid-cols-2 gap-6">
        {differenceCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className={`${card.bgColor} p-6 relative overflow-hidden`}>
                  {card.image ? (
                    <div className="absolute inset-0">
                      <img 
                        src={card.image} 
                        alt={card.title}
                        className="w-full h-full object-cover opacity-20"
                      />
                      <div className={`absolute inset-0 ${card.bgColor}`} />
                    </div>
                  ) : null}
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${card.gradient} text-white mb-4 shadow-sm`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-brain-health-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-brain-health-700 mb-3 font-medium">
                      {card.description}
                    </p>
                    <Badge variant="secondary" className="bg-white text-brain-health-800 border border-brain-health-200">
                      {card.subtitle}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Path Selection */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-title font-bold text-brain-health-900">
              Choose your path
            </h3>
            <p className="text-body-lg text-brain-health-700">
              How would you like to experience MyRhythm?
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {pathOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setPath(option.id);
                  onComplete();
                }}
                className={`p-6 rounded-lg border-2 transition-all text-left relative ${
                  option.recommended
                    ? 'border-brain-health-600 bg-brain-health-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                {option.recommended && (
                  <Badge className="absolute -top-2 left-4 bg-brain-health-600 text-white">
                    Recommended
                  </Badge>
                )}
                <h4 className="text-body-lg font-bold text-brain-health-900 mb-1">
                  {option.title}
                </h4>
                <p className="text-caption text-brain-health-600 mb-2 font-medium">
                  {option.subtitle}
                </p>
                <p className="text-body text-brain-health-700">
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}