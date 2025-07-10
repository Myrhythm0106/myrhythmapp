
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Heart, Users, Sparkles } from "lucide-react";

export type UserType = "brain-injury" | "caregiver" | "cognitive-optimization" | "wellness";

interface UserTypeStepProps {
  onComplete: (data: { type: UserType }) => void;
  initialValue?: UserType | null;
}

const userTypes = [
  {
    id: "brain-injury" as const,
    title: "Brain Injury Recovery",
    description: "I'm recovering from a brain injury and want to rebuild my cognitive abilities",
    icon: Brain,
    color: "bg-blue-500",
    gradient: "from-blue-100 to-blue-50"
  },
  {
    id: "caregiver" as const,
    title: "Caregiver Support",
    description: "I'm caring for someone with cognitive challenges and need support",
    icon: Heart,
    color: "bg-rose-500",
    gradient: "from-rose-100 to-rose-50"
  },
  {
    id: "cognitive-optimization" as const,
    title: "Cognitive Optimization",
    description: "I want to enhance my mental performance and cognitive abilities",
    icon: Sparkles,
    color: "bg-purple-500",
    gradient: "from-purple-100 to-purple-50"
  },
  {
    id: "wellness" as const,
    title: "General Wellness",
    description: "I'm focused on overall mental health and wellness",
    icon: Users,
    color: "bg-green-500",
    gradient: "from-green-100 to-green-50"
  }
];

export function UserTypeStep({ onComplete, initialValue }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(initialValue || null);

  const handleSelection = (type: UserType) => {
    console.log("UserTypeStep: User selected type:", type);
    setSelectedType(type);
    onComplete({ type });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tell us about yourself
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This helps us personalize your MyRhythm experience and create the most effective brain health journey for you
        </p>
      </div>

      {/* Simple button-based selection instead of complex RadioGroup */}
      <div className="grid gap-6 md:grid-cols-2">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => handleSelection(type.id)}
              className={`text-left p-0 border-0 bg-transparent w-full`}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 h-full ${
                  isSelected 
                    ? 'ring-4 ring-primary/20 shadow-xl border-primary bg-gradient-to-br from-primary/5 to-primary/10' 
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${type.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2 text-foreground">{type.title}</CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                    {/* Selection indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}
                    </div>
                  </div>
                </CardHeader>
                {isSelected && (
                  <CardContent className="pt-0 pb-4">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">✓ Selected - Click Next to continue</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            </button>
          );
        })}
      </div>

      {selectedType && (
        <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-primary font-medium">
            ✨ Perfect! You've selected {userTypes.find(t => t.id === selectedType)?.title}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the "Continue" button below to proceed to location setup
          </p>
        </div>
      )}
    </div>
  );
}
