
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Heart, Users, List, Settings, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type UserType = 
  | "brain-health" 
  | "emotional-wellness" 
  | "family-professional" 
  | "productivity" 
  | "organization"
  | "custom";

interface UserTypeOption {
  id: UserType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface UserTypeData {
  type: UserType;
  customValue?: string;
}

interface UserTypeStepProps {
  onComplete: (data: UserTypeData) => void;
}

export const UserTypeStep = ({ onComplete }: UserTypeStepProps) => {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [customValue, setCustomValue] = useState("");

  const userTypes: UserTypeOption[] = [
    {
      id: "brain-health",
      name: "Brain Health Recovery",
      description: "For those recovering from brain injury or conditions, focusing on mental rehabilitation and tracking progress.",
      icon: <ShieldCheck className="h-8 w-8 text-primary" />
    },
    {
      id: "emotional-wellness",
      name: "Emotional Wellness",
      description: "For those seeking balance in mood and emotions, with tools for mindfulness and emotional regulation.",
      icon: <Heart className="h-8 w-8 text-primary" />
    },
    {
      id: "family-professional",
      name: "Family/Professional Support",
      description: "For family members or healthcare professionals seeking to support a loved one or client with their brain health journey.",
      icon: <Users className="h-8 w-8 text-primary" />
    },
    {
      id: "productivity",
      name: "Productivity Champion",
      description: "For those seeking to maximize efficiency, complete tasks promptly, and achieve more in less time.",
      icon: <List className="h-8 w-8 text-primary" />
    },
    {
      id: "organization",
      name: "Organization Expert",
      description: "For those wanting structured routines, methodical planning, and a comprehensive approach to life management.",
      icon: <Settings className="h-8 w-8 text-primary" />
    },
    {
      id: "custom",
      name: "Something Else",
      description: "Tell us about your specific needs and goals so we can personalize your experience.",
      icon: <Settings className="h-8 w-8 text-primary" />
    }
  ];

  const handleSelectType = (type: UserType) => {
    setSelectedType(type);
  };

  const handleSubmit = () => {
    if (!selectedType) return;
    
    onComplete({
      type: selectedType,
      customValue: selectedType === "custom" ? customValue : undefined
    });
  };

  const isNextButtonDisabled = !selectedType || (selectedType === "custom" && !customValue.trim());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleSelectType(type.id)}
            className={cn(
              "flex items-start gap-4 p-5 rounded-lg border-2 cursor-pointer transition-all",
              selectedType === type.id 
                ? "border-primary shadow-sm" 
                : "hover:border-primary/50 border-border"
            )}
          >
            <div className="flex-shrink-0 mt-1">{type.icon}</div>
            <div>
              <h3 className="font-medium text-lg">{type.name}</h3>
              <p className="text-muted-foreground text-sm">{type.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedType === "custom" && (
        <div className="mt-4 p-4 border rounded-md border-primary/30 bg-primary/5">
          <Label htmlFor="customType" className="mb-2 block">What best describes your needs?</Label>
          <Input 
            id="customType"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Describe your specific needs..."
            className="w-full focus-visible:ring-primary"
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isNextButtonDisabled}
          className="gap-2"
        >
          Complete Setup <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
