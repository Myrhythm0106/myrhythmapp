import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  Brain, 
  Calendar, 
  Users, 
  HeartPulse,
  Sparkles,
  CheckCircle,
  MessageSquare,
  Target
} from "lucide-react";

interface AppStoryIntroductionProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function AppStoryIntroduction({ onComplete, onBack }: AppStoryIntroductionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Meet Sarah",
      subtitle: "A brain injury survivor just like you",
      content: (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Sarah had a brain injury 2 years ago. Like many survivors, she struggled with:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Badge variant="outline" className="p-3">
                <MessageSquare className="h-4 w-4 mr-2" />
                Forgetting conversations
              </Badge>
              <Badge variant="outline" className="p-3">
                <Target className="h-4 w-4 mr-2" />
                Missing appointments
              </Badge>
              <Badge variant="outline" className="p-3">
                <Calendar className="h-4 w-4 mr-2" />
                Losing track of tasks
              </Badge>
              <Badge variant="outline" className="p-3">
                <Users className="h-4 w-4 mr-2" />
                Feeling disconnected
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Then Sarah Discovered Memory Bridge",
      subtitle: "MyRhythm's flagship feature that changes everything",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-beacon-50 to-indigo-50 p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-beacon-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Record Important Conversations</h4>
                  <p className="text-sm text-muted-foreground">Simply press record during doctor visits, family discussions, or meetings</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-beacon-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold">AI Extracts A.C.T.S</h4>
                  <p className="text-sm text-muted-foreground"><strong>A</strong>ctions, <strong>C</strong>ontacts, <strong>T</strong>asks, <strong>S</strong>chedule items automatically identified</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-beacon-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Everything Gets Scheduled</h4>
                  <p className="text-sm text-muted-foreground">Follow-ups, appointments, and tasks automatically added to your calendar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Sarah's Life Transformed",
      subtitle: "See what MyRhythm can do for you too",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="h-5 w-5 text-beacon-600" />
                <h4 className="font-semibold">Smart Calendar</h4>
              </div>
              <p className="text-sm text-muted-foreground">Never miss appointments or tasks again</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="h-5 w-5 text-beacon-600" />
                <h4 className="font-semibold">Support Circle</h4>
              </div>
              <p className="text-sm text-muted-foreground">Stay connected with family and caregivers</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <HeartPulse className="h-5 w-5 text-beacon-600" />
                <h4 className="font-semibold">Health Tracking</h4>
              </div>
              <p className="text-sm text-muted-foreground">Monitor progress and symptoms</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="h-5 w-5 text-beacon-600" />
                <h4 className="font-semibold">Cognitive Training</h4>
              </div>
              <p className="text-sm text-muted-foreground">Rebuild focus and memory with personalized exercises</p>
            </Card>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h4 className="font-semibold text-green-800">Sarah's Results After 3 Months:</h4>
            </div>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• 85% fewer missed appointments</li>
              <li>• Improved family communication</li>
              <li>• Regained confidence and independence</li>
              <li>• Better cognitive function scores</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-beacon-50/30 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent mb-2">
                {currentSlideData.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* Content */}
            <div className="mb-8">
              {currentSlideData.content}
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2 mb-8">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-beacon-500 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={currentSlide === 0 ? onBack : handlePrevious}
                disabled={currentSlide === 0 && !onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentSlide === 0 ? 'Back' : 'Previous'}
              </Button>

              <Button onClick={handleNext} className="bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900">
                {currentSlide === slides.length - 1 ? (
                  <>
                    Get Started
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help hint */}
      <div className="text-center p-4 text-sm text-muted-foreground">
        Lost? Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd> to search anything
      </div>
    </div>
  );
}