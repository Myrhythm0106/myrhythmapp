
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Brain, Zap, Target, Clock, ArrowRight } from "lucide-react";
import { AssessmentGuide } from "../../AssessmentGuide";
import { UserType } from "../UserTypeStep";

interface PreAssessmentStepProps {
  onComplete: () => void;
  userType?: UserType | null;
}

export function PreAssessmentStep({ onComplete, userType }: PreAssessmentStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const preparationSteps = [
    {
      icon: Brain,
      title: "Analyzing Your Profile",
      description: "Setting up personalized assessment based on your brain health journey type",
      duration: 2000
    },
    {
      icon: Target,
      title: "Customizing Questions",
      description: "Tailoring assessment questions to your specific needs and goals",
      duration: 2500
    },
    {
      icon: Zap,
      title: "Preparing Insights Engine",
      description: "Configuring our AI to provide personalized recommendations",
      duration: 2000
    },
    {
      icon: CheckCircle,
      title: "Assessment Ready!",
      description: "Your personalized rhythm assessment is now ready to begin",
      duration: 1000
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < preparationSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    }, preparationSteps[currentStep]?.duration || 2000);

    return () => clearTimeout(timer);
  }, [currentStep, preparationSteps]);

  const progress = ((currentStep + 1) / preparationSteps.length) * 100;

  if (showGuide) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assessment Preparation Guide</h2>
          <Button variant="outline" onClick={() => setShowGuide(false)}>
            Back to Setup
          </Button>
        </div>
        <AssessmentGuide userType={userType} onStartAssessment={onComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Preparing Your Assessment
        </h2>
        <p className="text-lg text-muted-foreground">
          We're customizing your brain health assessment for the best possible insights
        </p>
      </div>

      <Card className="border-2 border-border/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Assessment Preparation</CardTitle>
            <Badge variant="secondary" className="px-3 py-1">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-3" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {preparationSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div 
                key={index}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-500 ${
                  isActive ? 'bg-primary/10 border-2 border-primary/30 shadow-md' :
                  isCompleted ? 'bg-green-50 border border-green-200' :
                  'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-green-600 text-white' :
                  isActive ? 'bg-primary text-primary-foreground animate-pulse' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 transition-colors ${
                    isActive ? 'text-primary' :
                    isCompleted ? 'text-green-800' :
                    'text-gray-600'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm transition-colors ${
                    isActive ? 'text-primary/80' :
                    isCompleted ? 'text-green-700' :
                    'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
                
                {isCompleted && (
                  <CheckCircle className="h-6 w-6 text-green-600 mt-2" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {isComplete && (
        <div className="space-y-6">
          <div className="text-center space-y-6">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h3 className="text-2xl font-bold text-green-800">
                  Ready to Begin!
                </h3>
              </div>
              <p className="text-green-700 mb-4">
                Your personalized rhythm assessment is prepared and ready. This will take approximately 5-10 minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={onComplete}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  Start My Assessment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowGuide(true)}
                  className="px-8 py-3 text-lg"
                >
                  View Assessment Guide
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                5-10 minutes
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Personalized insights
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Actionable recommendations
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
