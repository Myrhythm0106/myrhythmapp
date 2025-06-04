
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Target, Calendar, Settings, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AssessmentResult, focusAreas } from "@/utils/rhythmAnalysis";
import { AssessmentResultsDisplay } from "./AssessmentResultsDisplay";
import { FocusAreaGoalTemplates } from "./FocusAreaGoalTemplates";
import { QuickDashboardSetup } from "./QuickDashboardSetup";
import { toast } from "sonner";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
}

type FlowStep = "results" | "understand" | "goals" | "dashboard" | "complete";

export function PostAssessmentFlow({ assessmentResult, onComplete }: PostAssessmentFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FlowStep>("results");
  const [selectedGoals, setSelectedGoals] = useState<any[]>([]);
  const [dashboardConfig, setDashboardConfig] = useState<any>(null);
  
  const focusInfo = focusAreas[assessmentResult.focusArea];
  
  const steps = [
    { id: "results", title: "Your Results", icon: CheckCircle2 },
    { id: "understand", title: "What This Means", icon: Target },
    { id: "goals", title: "Set Goals", icon: Target },
    { id: "dashboard", title: "Setup Dashboard", icon: Settings },
    { id: "complete", title: "Ready!", icon: CheckCircle2 }
  ];
  
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const stepOrder: FlowStep[] = ["results", "understand", "goals", "dashboard", "complete"];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Store personalization data
    localStorage.setItem("myrhythm_initial_setup_complete", "true");
    localStorage.setItem("myrhythm_selected_goals", JSON.stringify(selectedGoals));
    localStorage.setItem("myrhythm_dashboard_config", JSON.stringify(dashboardConfig));
    
    toast.success("Welcome to Your Personalized MyRhythm! 🎉", {
      description: "Your app is now customized to support your unique rhythm and recovery journey.",
      duration: 5000
    });
    
    // Navigate directly to personalized dashboard
    navigate("/dashboard");
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "results":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${focusInfo.gradient} flex items-center justify-center`}>
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Rhythm Assessment Results</h2>
                <Badge className={`${focusInfo.color === 'red' ? 'bg-red-100 text-red-800' : 
                  focusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' : 
                  focusInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' : 
                  focusInfo.color === 'green' ? 'bg-green-100 text-green-800' : 
                  'bg-amber-100 text-amber-800'} text-lg py-2 px-4`}>
                  {focusInfo.title}
                </Badge>
              </div>
            </div>
            <AssessmentResultsDisplay assessmentResult={assessmentResult} />
          </div>
        );
        
      case "understand":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">What This Means for You</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Based on your assessment, we've identified your current rhythm focus. Here's how MyRhythm will support you:
              </p>
            </div>
            
            <Card className={`border-l-4 border-l-${focusInfo.color}-500`}>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{focusInfo.title}</h3>
                  <p className="text-gray-700 mb-4">{focusInfo.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Your personalized experience will include:</h4>
                  <ul className="space-y-2">
                    {focusInfo.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`bg-gradient-to-r ${focusInfo.gradient} bg-opacity-10 p-4 rounded-lg`}>
                  <h4 className="font-semibold mb-2">Today's Focus Actions:</h4>
                  <ul className="space-y-1">
                    {focusInfo.primaryActions.slice(0, 3).map((action, index) => (
                      <li key={index} className="text-sm">• {action}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case "goals":
        return (
          <FocusAreaGoalTemplates 
            focusArea={assessmentResult.focusArea}
            onGoalsSelected={setSelectedGoals}
            selectedGoals={selectedGoals}
          />
        );
        
      case "dashboard":
        return (
          <QuickDashboardSetup
            focusArea={assessmentResult.focusArea}
            onConfigComplete={setDashboardConfig}
          />
        );
        
      case "complete":
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">You're All Set! 🎉</h2>
              <p className="text-xl text-gray-700 mb-2">Your personalized MyRhythm experience is ready</p>
              <p className="text-gray-600">
                You've set up {selectedGoals.length} goals and customized your dashboard to match your {focusInfo.title.toLowerCase()} focus.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Your dashboard will show your focus area prominently</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Goal suggestions will match your rhythm</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Daily actions will be personalized to your needs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>We'll reassess your rhythm in 6 months</span>
                </li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Setting Up Your Personalized Experience</h1>
          <span className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-primary text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-xs mt-1 ${isCurrent ? 'font-medium' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => {
            const stepOrder: FlowStep[] = ["results", "understand", "goals", "dashboard", "complete"];
            const currentIndex = stepOrder.indexOf(currentStep);
            if (currentIndex > 0) {
              setCurrentStep(stepOrder[currentIndex - 1]);
            }
          }}
          disabled={currentStep === "results"}
        >
          Back
        </Button>
        
        <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-primary/80">
          {currentStep === "complete" ? "Go to Dashboard" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
