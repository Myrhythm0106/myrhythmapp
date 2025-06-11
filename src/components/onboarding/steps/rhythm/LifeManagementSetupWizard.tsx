
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, User, Calendar, Target, Users, LayoutDashboard } from "lucide-react";
import { PersonalProfileStep } from "./setup-steps/PersonalProfileStep";
import { CalendarRoutineStep } from "./setup-steps/CalendarRoutineStep";
import { GoalFrameworkStep } from "./setup-steps/GoalFrameworkStep";
import { SupportIntegrationStep } from "./setup-steps/SupportIntegrationStep";
import { DashboardLayoutStep } from "./setup-steps/DashboardLayoutStep";
import { SetupCompleteStep } from "./setup-steps/SetupCompleteStep";

interface LifeManagementSetupWizardProps {
  onComplete: () => void;
  onBack: () => void;
  assessmentResult: any;
}

const setupSteps = [
  {
    id: 1,
    title: "Personal Operating Style",
    description: "Configure your preferences and operational approach",
    icon: User,
    estimatedTime: "3-4 min"
  },
  {
    id: 2,
    title: "Calendar & Operations",
    description: "Set up your essential appointments and routine framework",
    icon: Calendar,
    estimatedTime: "4-5 min"
  },
  {
    id: 3,
    title: "Goal Operations",
    description: "Establish your goal and action tracking system",
    icon: Target,
    estimatedTime: "3-4 min"
  },
  {
    id: 4,
    title: "Support Network",
    description: "Connect your support circle and operational preferences",
    icon: Users,
    estimatedTime: "2-3 min"
  },
  {
    id: 5,
    title: "Dashboard Operations",
    description: "Optimize your dashboard for peak usability",
    icon: LayoutDashboard,
    estimatedTime: "1-2 min"
  }
];

export function LifeManagementSetupWizard({ onComplete, onBack, assessmentResult }: LifeManagementSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState({
    personalProfile: {},
    calendarRoutine: {},
    goalFramework: {},
    supportIntegration: {},
    dashboardLayout: {}
  });

  const handleNext = () => {
    if (currentStep < setupSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed, show completion screen
      setCurrentStep(setupSteps.length + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleStepComplete = (stepData: any) => {
    const stepKey = setupSteps[currentStep - 1]?.id === 1 ? 'personalProfile' :
                   setupSteps[currentStep - 1]?.id === 2 ? 'calendarRoutine' :
                   setupSteps[currentStep - 1]?.id === 3 ? 'goalFramework' :
                   setupSteps[currentStep - 1]?.id === 4 ? 'supportIntegration' :
                   'dashboardLayout';
    
    setSetupData(prev => ({ ...prev, [stepKey]: stepData }));
    handleNext();
  };

  const renderStepContent = () => {
    if (currentStep > setupSteps.length) {
      return <SetupCompleteStep setupData={setupData} onComplete={onComplete} assessmentResult={assessmentResult} />;
    }

    switch (currentStep) {
      case 1:
        return <PersonalProfileStep onComplete={handleStepComplete} assessmentResult={assessmentResult} />;
      case 2:
        return <CalendarRoutineStep onComplete={handleStepComplete} assessmentResult={assessmentResult} />;
      case 3:
        return <GoalFrameworkStep onComplete={handleStepComplete} assessmentResult={assessmentResult} />;
      case 4:
        return <SupportIntegrationStep onComplete={handleStepComplete} assessmentResult={assessmentResult} />;
      case 5:
        return <DashboardLayoutStep onComplete={handleStepComplete} assessmentResult={assessmentResult} />;
      default:
        return null;
    }
  };

  const currentStepInfo = setupSteps[currentStep - 1];
  const progressPercentage = currentStep > setupSteps.length ? 100 : (currentStep / setupSteps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {currentStep <= setupSteps.length && (
        <>
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-primary">Build Your Life Operating Model</h1>
            <p className="text-muted-foreground">
              Let's create your personalized operating system for running your life effectively
            </p>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Step {currentStep} of {setupSteps.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {currentStepInfo?.estimatedTime}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex items-center gap-3">
                  {currentStepInfo?.icon && <currentStepInfo.icon className="h-5 w-5 text-primary" />}
                  <div>
                    <h3 className="font-medium">{currentStepInfo?.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentStepInfo?.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation - only show for regular steps */}
      {currentStep <= setupSteps.length && (
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 1 ? "Back to Options" : "Previous"}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Total estimated time: 13-19 minutes
          </div>
        </div>
      )}
    </div>
  );
}
