import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  ArrowRight, 
  Clock,
  CheckCircle,
  Heart,
  Users,
  Phone,
  HelpCircle,
  Compass
} from "lucide-react";

interface ContinuousGuidanceProps {
  currentStep: string;
  nextStep?: string;
  progress?: number;
  encouragementMessage?: string;
  showHelp?: boolean;
}

export function ContinuousGuidance({ 
  currentStep, 
  nextStep, 
  progress = 0, 
  encouragementMessage,
  showHelp = true 
}: ContinuousGuidanceProps) {
  const [showHelpDetails, setShowHelpDetails] = useState(false);

  const getStepMessage = (step: string) => {
    const messages = {
      'assessment': 'We\'re here with you as you share your experience. Take your time.',
      'results': 'You\'ve taken an important step toward better brain health.',
      'features': 'Let\'s explore your personalized tools together, step by step.',
      'onboarding': 'We\'ll guide you through setting up your system at your own pace.',
      'daily-use': 'You\'re doing great! Here\'s what\'s helpful for you today.',
    };
    return messages[step as keyof typeof messages] || 'You\'re making progress on your cognitive wellness journey.';
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50">
      <Card className="premium-card border-memory-emerald-200/60 bg-gradient-to-r from-memory-emerald-50/95 to-brain-health-50/95 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          {/* Current Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-memory-emerald-500" />
            <Badge variant="outline" className="border-memory-emerald-300 text-memory-emerald-700 text-xs">
              You are here: {currentStep}
            </Badge>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-brain-health-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-brain-health-100 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Encouragement Message */}
          <div className="space-y-2">
            <p className="text-sm text-brain-health-700 leading-relaxed">
              {encouragementMessage || getStepMessage(currentStep)}
            </p>
            
            {nextStep && (
              <div className="flex items-center gap-2 text-xs text-brain-health-600">
                <Clock className="h-3 w-3" />
                <span>Coming next: {nextStep}</span>
              </div>
            )}
          </div>

          {/* Help Section */}
          {showHelp && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelpDetails(!showHelpDetails)}
                className="w-full justify-start text-xs h-8 text-brain-health-600 hover:text-brain-health-700"
              >
                <HelpCircle className="h-3 w-3 mr-2" />
                Need help or feeling unsure?
              </Button>
              
              {showHelpDetails && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-memory-emerald-200">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-col h-auto p-2 text-xs"
                  >
                    <Users className="h-3 w-3 mb-1 text-clarity-teal-500" />
                    <span>Community</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-col h-auto p-2 text-xs"
                  >
                    <Phone className="h-3 w-3 mb-1 text-sunrise-amber-500" />
                    <span>Support</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-col h-auto p-2 text-xs"
                  >
                    <Compass className="h-3 w-3 mb-1 text-memory-emerald-500" />
                    <span>Guide</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Accompaniment Messages */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-memory-emerald-200">
            <Heart className="h-3 w-3 text-memory-emerald-500" />
            <span className="text-xs text-brain-health-600">You're not alone in this</span>
            <CheckCircle className="h-3 w-3 text-memory-emerald-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}