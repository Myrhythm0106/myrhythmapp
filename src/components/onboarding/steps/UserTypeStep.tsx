
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  },
  {
    id: "caregiver" as const,
    title: "Caregiver Support", 
    description: "I'm caring for someone with cognitive challenges and need support",
    icon: Heart,
    color: "bg-rose-500",
  },
  {
    id: "cognitive-optimization" as const,
    title: "Cognitive Optimization",
    description: "I want to enhance my mental performance and cognitive abilities",
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    id: "wellness" as const,
    title: "General Wellness",
    description: "I'm focused on overall mental health and wellness",
    icon: Users,
    color: "bg-green-500",
  }
];

export function UserTypeStep({ onComplete, initialValue }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(initialValue || null);

  console.log("=== USER TYPE STEP RENDERING ===");
  console.log("UserTypeStep: Initial value:", initialValue);
  console.log("UserTypeStep: Selected type:", selectedType);
  console.log("UserTypeStep: User types array length:", userTypes.length);

  const handleSelection = (type: UserType) => {
    console.log("UserTypeStep: User clicked type:", type);
    setSelectedType(type);
    onComplete({ type });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">
          Tell us about yourself
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          This helps us personalize your MyRhythm experience and create the most effective brain health journey for you
        </p>
      </div>

      {/* Debug Info */}
      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          Debug: Rendering {userTypes.length} user type options. Selected: {selectedType || 'none'}
        </p>
      </div>

      {/* User Type Cards */}
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl mx-auto">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          console.log(`UserTypeStep: Rendering card for ${type.id}, isSelected: ${isSelected}`);
          
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 w-full ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-lg' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelection(type.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-foreground mb-2">
                      {type.title}
                    </CardTitle>
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
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">Selected - Ready to continue</span>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Selection Status */}
      {selectedType && (
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20 max-w-2xl mx-auto">
          <p className="text-primary font-medium text-lg">
            ✓ {userTypes.find(t => t.id === selectedType)?.title} Selected
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Continue" below to proceed to the next step
          </p>
        </div>
      )}
    </div>
  );
}
