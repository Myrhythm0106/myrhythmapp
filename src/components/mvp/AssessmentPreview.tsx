import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  Brain,
  Clock,
  CheckCircle,
  Target,
  Heart,
  Lightbulb,
  Shield,
  Star
} from "lucide-react";

interface AssessmentPreviewProps {
  onStartAssessment: () => void;
  onBack?: () => void;
  selectedPath?: 'guided' | 'explorer';
}

export function AssessmentPreview({ onStartAssessment, onBack, selectedPath }: AssessmentPreviewProps) {
  const sampleQuestions = [
    {
      category: "Memory",
      question: "How often do you forget important details from conversations?",
      icon: <Brain className="h-4 w-4" />
    },
    {
      category: "Focus", 
      question: "How easily can you maintain focus throughout your day?",
      icon: <Target className="h-4 w-4" />
    },
    {
      category: "Energy",
      question: "When do you typically feel most mentally sharp and focused?",
      icon: <Heart className="h-4 w-4" />
    }
  ];

  const benefits = [
    {
      icon: <Target className="h-5 w-5 text-beacon-600" />,
      title: "Personalized Experience",
      desc: "Get features and recommendations tailored to your specific needs"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-beacon-600" />,
      title: "Smart Insights", 
      desc: "Discover your optimal times for important conversations and tasks"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-beacon-600" />,
      title: "Progress Tracking",
      desc: "See how you improve over time with personalized metrics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-beacon-50/30 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent mb-2">
                5-Minute Personalized Assessment
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                This quick assessment helps us understand your unique needs and personalize your MyRhythm experience.
              </p>
            </div>

            {/* Assessment Overview */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What to Expect</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-beacon-600" />
                      <div>
                        <p className="font-medium">5-8 questions</p>
                        <p className="text-sm text-muted-foreground">Takes about 3-5 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-beacon-600" />
                      <div>
                        <p className="font-medium">Completely private</p>
                        <p className="text-sm text-muted-foreground">Your responses are encrypted and secure</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-beacon-600" />
                      <div>
                        <p className="font-medium">No right or wrong answers</p>
                        <p className="text-sm text-muted-foreground">Just answer honestly about your experience</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Sample Questions</h3>
                  <div className="space-y-3">
                    {sampleQuestions.map((q, index) => (
                      <div key={index} className="p-3 bg-gradient-to-r from-beacon-50 to-indigo-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          {q.icon}
                          <Badge variant="outline" className="text-xs">{q.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{q.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Why This Helps You</h3>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-beacon-100 rounded-lg flex items-center justify-center">
                          {benefit.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Smart Personalization</h4>
                      <p className="text-sm text-green-700">
                        Based on your responses, we'll customize Memory Bridge settings, 
                        recommend optimal meeting times, and highlight the most relevant features for your journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {selectedPath === 'explorer' ? 'Back to Explore' : 'Back'}
              </Button>

              <div className="flex items-center space-x-3">
                {selectedPath === 'explorer' && (
                  <Button variant="ghost" onClick={() => {
                    // Skip assessment and go directly to features
                    window.location.href = '/dashboard';
                  }}>
                    Skip Assessment
                  </Button>
                )}
                <Button 
                  onClick={onStartAssessment}
                  className="bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900"
                >
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Hint */}
      <div className="text-center p-4 text-sm text-muted-foreground">
        Lost? Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd> to search anything
      </div>
    </div>
  );
}