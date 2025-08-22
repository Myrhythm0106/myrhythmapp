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
  variant?: 'default' | 'mvp';
}

export function Step2FeelDifferenceChoosePath({ persona, intents, onComplete, variant = 'default' }: Step2FeelDifferenceChoosePathProps) {
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
      gradient: "from-memory-emerald-500 to-memory-emerald-600",
      bgGradient: "from-memory-emerald-50 to-memory-emerald-100"
    },
    {
      title: "Transform overwhelm into organized action",
      subtitle: "Calibrate", 
      description: getPersonalizedText("Turn chaos into clear, manageable and planned steps for your needs"),
      icon: Calendar,
      gradient: "from-brain-health-500 to-brain-health-600",
      bgGradient: "from-brain-health-50 to-brain-health-100",
      image: organizedActionImage
    },
    {
      title: "Understand your inner rhythm",
      subtitle: "Check-in + Insights",
      description: getPersonalizedText("Track patterns and build sustainable routines"),
      icon: BarChart3,
      gradient: "from-clarity-teal-500 to-clarity-teal-600", 
      bgGradient: "from-clarity-teal-50 to-clarity-teal-100"
    },
    {
      title: "You're never walking alone",
      subtitle: "Support & Community",
      description: getPersonalizedText("Connect with others who understand the journey"),
      icon: Users,
      gradient: "from-sunrise-amber-500 to-sunrise-amber-600",
      bgGradient: "from-sunrise-amber-50 to-sunrise-amber-100"
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
                <div className={`bg-gradient-to-br ${card.bgGradient} p-6 relative overflow-hidden`}>
                  {card.image ? (
                    <div className="absolute inset-0">
                      <img 
                        src={card.image} 
                        alt={card.title}
                        className="w-full h-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-brain-health-500/20 to-brain-health-600/30" />
                    </div>
                  ) : null}
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${card.gradient} text-white mb-4`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-brain-health-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-brain-health-700 mb-3 font-medium">
                      {card.description}
                    </p>
                    <Badge variant="secondary" className="bg-white/80 text-brain-health-800">
                      {card.subtitle}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={onComplete}
          size="lg"
          className={`px-8 py-3 text-lg font-semibold ${variant === 'mvp' ? 'bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white' : ''}`}
        >
          Do my 60-second check‑in
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}