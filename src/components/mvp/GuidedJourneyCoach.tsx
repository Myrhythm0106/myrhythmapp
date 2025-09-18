import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Heart, 
  CheckCircle, 
  ArrowRight,
  Brain,
  MessageCircle,
  Users
} from "lucide-react";

interface GuidedJourneyCoachProps {
  step: string;
  onNext: () => void;
  onHelp?: () => void;
}

export function GuidedJourneyCoach({ step, onNext, onHelp }: GuidedJourneyCoachProps) {
  const getCoachingContent = () => {
    switch (step) {
      case 'memory-bridge-intro':
        return {
          title: "Let's Try Memory Bridge Together! 🎯",
          message: "I'm right here with you. Memory Bridge is our hero feature - it turns your conversations into organized actions. Ready for some magic?",
          encouragement: "Over 1,000 people have mastered this in under 2 minutes",
          action: "Record Your First 30-Second Note",
          tip: "Just talk about tomorrow's plans - anything works!"
        };
      
      case 'first-recording':
        return {
          title: "Amazing! You Just Made Magic Happen ✨",
          message: "See how Memory Bridge extracted your action items? This is what makes MyRhythm special - your thoughts become organized automatically.",
          encouragement: "You're already getting the hang of this!",
          action: "Let's Schedule One Action",
          tip: "Pick any action and we'll add it to your calendar"
        };
      
      case 'calendar-setup':
        return {
          title: "Perfect! You're Becoming a Pro 🚀",
          message: "You just experienced the full Memory Bridge flow: Record → Extract → Schedule. This is how you'll stay organized effortlessly.",
          encouragement: "Users like you see 40% better organization in week 1",
          action: "Explore Your Dashboard",
          tip: "I'm always here - just search for anything you need"
        };
      
      default:
        return {
          title: "I'm Here to Help You Succeed 💪",
          message: "Whatever you're working on, remember - you're not alone. I've helped thousands of people master MyRhythm.",
          encouragement: "You're doing great!",
          action: "Continue Your Journey",
          tip: "Press Ctrl+K anytime to find what you need"
        };
    }
  };

  const content = getCoachingContent();

  return (
    <Card className="border-l-4 border-l-beacon-500 bg-gradient-to-r from-beacon-50/50 to-indigo-50/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-beacon-800 mb-2">
                {content.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {content.message}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                {content.encouragement}
              </Badge>
              <Badge variant="outline" className="border-beacon-200 text-beacon-700">
                <Sparkles className="h-3 w-3 mr-1" />
                {content.tip}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                {onHelp && (
                  <Button variant="outline" size="sm" onClick={onHelp}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Need Help?
                  </Button>
                )}
                
                <Button variant="ghost" size="sm" onClick={() => {
                  // Trigger search
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    ctrlKey: true,
                    bubbles: true
                  });
                  document.dispatchEvent(event);
                }}>
                  <span className="text-xs">Press</span>
                  <kbd className="px-1 py-0.5 mx-1 bg-muted rounded text-xs">Ctrl+K</kbd>
                  <span className="text-xs">to search</span>
                </Button>
              </div>

              <Button onClick={onNext} className="bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900">
                {content.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}