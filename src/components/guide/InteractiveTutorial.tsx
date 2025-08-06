import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Brain, 
  Target, 
  Calendar, 
  Users,
  X
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: string;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to MyRhythm",
    description: "Your personalized cognitive wellness companion",
    icon: Brain,
    content: "MyRhythm is designed to help you improve your cognitive health through personalized brain training, memory enhancement, and comprehensive progress tracking. Let's take a quick tour of the key features.",
    action: "Start Tour"
  },
  {
    id: "dashboard",
    title: "Your Dashboard",
    description: "Command center for your cognitive wellness",
    icon: Target,
    content: "The dashboard is your home base. Here you'll see your daily goals, recent progress, upcoming activities, and quick access to all major features. It's personalized based on your preferences and progress.",
    action: "Explore Dashboard"
  },
  {
    id: "goals",
    title: "Setting Goals",
    description: "Define and track your cognitive objectives",
    icon: Target,
    content: "Set SMART goals for your cognitive wellness journey. Whether it's improving memory, reducing brain fog, or building mental resilience, the goal system helps you stay focused and motivated.",
    action: "Set First Goal"
  },
  {
    id: "calendar",
    title: "Planning & Scheduling",
    description: "Organize your cognitive wellness routine",
    icon: Calendar,
    content: "Use the calendar to schedule brain training sessions, track mood and energy levels, plan wellness activities, and review your progress patterns over time.",
    action: "View Calendar"
  },
  {
    id: "support",
    title: "Building Your Support Network", 
    description: "Connect with family, caregivers, and professionals",
    icon: Users,
    content: "Invite family members, caregivers, or healthcare providers to join your support network. Share progress, get encouragement, and maintain accountability in your wellness journey.",
    action: "Invite Support"
  }
];

export function InteractiveTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const currentStepData = tutorialSteps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border-brain-health-200 hover:from-brain-health-100 hover:to-clarity-teal-100"
        >
          <Play className="h-4 w-4 mr-2" />
          Launch Interactive Tutorial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
                <Icon className="h-4 w-4 text-white" />
              </div>
              Interactive Tutorial
            </div>
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} of {tutorialSteps.length}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tutorialSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-2 border-primary/20' 
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-muted text-muted-foreground border border-border hover:bg-muted/70'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                  <span className="font-medium">{step.title}</span>
                </button>
              );
            })}
          </div>
          
          {/* Current Step Content */}
          <Card className="premium-card min-h-[300px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-brain-health-500 rounded-full flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
                  <p className="text-sm text-muted-foreground font-normal">{currentStepData.description}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.content}
                </p>
                
                {/* Interactive Demo Area */}
                <div className="bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 p-6 rounded-lg border border-brain-health-200/30">
                  <div className="flex items-center justify-center text-center">
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-brain-health-400 to-clarity-teal-400 rounded-full flex items-center justify-center mx-auto">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-sm font-medium text-brain-health-700">
                        {currentStepData.action || "Learn More"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        This would open the actual {currentStepData.title.toLowerCase()} feature
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-primary w-6'
                      : index < currentStep
                      ? 'bg-emerald-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600"
            >
              {isLastStep ? 'Finish Tutorial' : 'Next'}
              {isLastStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}