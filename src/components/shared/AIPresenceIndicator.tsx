import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, MessageCircle, X, HelpCircle } from "lucide-react";

interface AIPresenceIndicatorProps {
  context?: string;
  onHelpRequest?: () => void;
}

export function AIPresenceIndicator({ context, onHelpRequest }: AIPresenceIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  const contextualTips = {
    'memory-bridge': [
      "I'm right here with you - try recording a 30-second note about tomorrow's plans",
      "Just speak naturally - I'll help organize your thoughts into actions",
      "Need help? I've guided 1,000+ people through their first recording"
    ],
    'assessment': [
      "Take your time - I'm here to make sure you get the most accurate results",
      "These questions help me understand how to best support you",
      "No pressure - you can always retake this assessment later"
    ],
    'dashboard': [
      "I'm always here if you need anything - just search or ask for help",
      "Feeling lost? Press Ctrl+K to search for any feature",
      "I've helped thousands of people master MyRhythm - you're in good hands"
    ],
    'default': [
      "I'm right here if you need anything - you're never alone",
      "Lost? Press Ctrl+K and I'll help you find what you need",
      "I'm your AI coach - here to help you succeed with MyRhythm"
    ]
  };

  const tips = contextualTips[context as keyof typeof contextualTips] || contextualTips.default;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [tips.length]);

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 left-4 max-w-sm z-40 bg-gradient-to-r from-beacon-50 to-indigo-50 border-beacon-200 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="h-4 w-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tips[currentTip]}
            </p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                {onHelpRequest && (
                  <Button variant="ghost" size="sm" onClick={onHelpRequest} className="h-7 px-2">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    <span className="text-xs">Help</span>
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', {
                      key: 'k',
                      ctrlKey: true,
                      bubbles: true
                    });
                    document.dispatchEvent(event);
                  }}
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Search
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsVisible(false)}
                className="h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tip indicator dots */}
        <div className="flex justify-center space-x-1 mt-2">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentTip ? 'bg-beacon-500' : 'bg-beacon-200'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}