import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";
import { UserType } from "@/types/user";

interface RhythmAssessmentStepProps {
  onComplete: (userType: UserType) => void;
}

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const [userType, setUserType] = useState<UserType | null>(null);

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
  };

  const handleContinue = () => {
    if (userType) {
      onComplete(userType);
    } else {
      alert("Please select a user type to continue.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Choose Your Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>
          To tailor your experience, please select the option that best describes your primary focus:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className={userType === "brain-injury" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : ""}
            onClick={() => handleUserTypeSelection("brain-injury")}
          >
            Recovering from Brain Injury
          </Button>
          <Button
            variant="outline"
            className={userType === "mental-wellness" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : ""}
            onClick={() => handleUserTypeSelection("mental-wellness")}
          >
            Improving Mental Wellness
          </Button>
          <Button
            variant="outline"
            className={userType === "peak-performance" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : ""}
            onClick={() => handleUserTypeSelection("peak-performance")}
          >
            Achieving Peak Performance
          </Button>
          <Button
            variant="outline"
            className={userType === "stress-management" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : ""}
            onClick={() => handleUserTypeSelection("stress-management")}
          >
            Managing Stress & Burnout
          </Button>
        </div>

        <Button onClick={handleContinue} disabled={!userType} className="w-full">
          Continue to Assessment Preview
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
