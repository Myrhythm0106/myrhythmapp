
import React from "react";
import { Button } from "@/components/ui/button";
import { UserTypeSelector, UserType } from "@/components/onboarding/UserTypeSelector";
import { ArrowRight } from "lucide-react";

interface UserTypeStepProps {
  selectedType: UserType | null;
  onChange: (type: UserType) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function UserTypeStep({ selectedType, onChange, onContinue, onBack }: UserTypeStepProps) {
  return (
    <div className="space-y-6">
      <UserTypeSelector selectedType={selectedType} onChange={onChange} />
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue} className="gap-2">
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
