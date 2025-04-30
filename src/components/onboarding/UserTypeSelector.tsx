
import React from "react";
import { Brain, User, HeartPulse, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type UserType = "tbi" | "abi" | "mental-health" | "caregiver";

interface UserTypeOption {
  id: UserType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface UserTypeSelectorProps {
  selectedType: UserType | null;
  onChange: (type: UserType) => void;
}

export function UserTypeSelector({ selectedType, onChange }: UserTypeSelectorProps) {
  const userTypes: UserTypeOption[] = [
    {
      id: "tbi",
      label: "Traumatic Brain Injury",
      description: "I have experienced a TBI and am looking for support",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      id: "abi",
      label: "Acquired Brain Injury",
      description: "I have an ABI (stroke, aneurysm, etc.) and need resources",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      id: "mental-health",
      label: "Mental Health",
      description: "I'm seeking support for brain-related mental health conditions",
      icon: <HeartPulse className="h-6 w-6" />,
    },
    {
      id: "caregiver",
      label: "Caregiver",
      description: "I care for someone with a brain injury or mental health condition",
      icon: <Users className="h-6 w-6" />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {userTypes.map((type) => (
        <button
          key={type.id}
          className={cn(
            "flex cursor-pointer items-start gap-4 rounded-lg border p-4 text-left transition-all hover:border-primary",
            selectedType === type.id && "border-primary bg-primary/5"
          )}
          onClick={() => onChange(type.id)}
        >
          <div className={cn(
            "rounded-full p-2 text-primary",
            selectedType === type.id ? "bg-primary/10" : "bg-muted"
          )}>
            {type.icon}
          </div>
          <div>
            <h3 className="font-medium">{type.label}</h3>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
