import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/types/user";

interface PostAssessmentFlowProps {
  userType: UserType;
  assessmentResult: any;
  onComplete: (data: any) => void;
}

export function PostAssessmentFlow({ userType, assessmentResult, onComplete }: PostAssessmentFlowProps) {
  const [activeStep, setActiveStep] = useState<
    "teaser" | "full" | "calendar" | "pomodoro" | "support" | "complete"
  >("teaser");

  const handleStepComplete = (data: any) => {
    if (activeStep === "teaser") {
      setActiveStep("full");
    } else if (activeStep === "full") {
      setActiveStep("calendar");
    } else if (activeStep === "calendar") {
      setActiveStep("pomodoro");
    } else if (activeStep === "pomodoro") {
      setActiveStep("support");
    } else if (activeStep === "support") {
      setActiveStep("complete");
      onComplete(data);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case "teaser":
        return (
          <div>
            <h2>Assessment Teaser</h2>
            <p>Brief overview of assessment results.</p>
            <button onClick={() => handleStepComplete(null)}>Continue</button>
          </div>
        );
      case "full":
        return (
          <div>
            <h2>Full Assessment Results</h2>
            <p>Detailed breakdown of assessment findings.</p>
            <button onClick={() => handleStepComplete(null)}>Continue</button>
          </div>
        );
      case "calendar":
        return (
          <div>
            <h2>Calendar Integration</h2>
            <p>Connect your calendar for scheduling.</p>
            <button onClick={() => handleStepComplete(null)}>Continue</button>
          </div>
        );
      case "pomodoro":
        return (
          <div>
            <h2>Pomodoro Setup</h2>
            <p>Configure Pomodoro timer for focused work.</p>
            <button onClick={() => handleStepComplete(null)}>Continue</button>
          </div>
        );
      case "support":
        return (
          <div>
            <h2>Support Integration</h2>
            <p>Connect with your support network.</p>
            <button onClick={() => handleStepComplete(null)}>Complete</button>
          </div>
        );
      case "complete":
        return (
          <div>
            <h2>Setup Complete!</h2>
            <p>You're all set to start using the app.</p>
          </div>
        );
      default:
        return <p>Loading...</p>;
    }
  };

  return (
    <Card>
      <CardContent>{renderStepContent()}</CardContent>
    </Card>
  );
}
