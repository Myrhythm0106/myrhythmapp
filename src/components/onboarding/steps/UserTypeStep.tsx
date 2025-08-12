import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Users, Sparkles, Stethoscope } from "lucide-react";
import { UserType } from "@/types/user";

interface UserTypeStepProps {
  onComplete: (data: { type: UserType }) => void;
  initialValue?: UserType | null;
}

const userTypes = [
  {
    id: "brain-injury" as const,
    title: "Brain Injury Recovery",
    description: "Strengthen your mind after a challenging experience and reclaim your cognitive abilities with personalized recovery tools",
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    id: "caregiver" as const,
    title: "Caregiver Support", 
    description: "Build resilience and prevent burnout while caring for others with evidence-based wellness strategies",
    icon: Heart,
    color: "bg-rose-500",
  },
  {
    id: "cognitive-optimization" as const,
    title: "Cognitive Optimization",
    description: "Unlock your brain's full potential and achieve peak mental performance with advanced cognitive training",
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    id: "wellness" as const,
    title: "General Wellness",
    description: "Build proactive mental resilience and create sustainable wellness habits for life's challenges",
    icon: Users,
    color: "bg-green-500",
  },
  {
    id: "medical-professional" as const,
    title: "Medical Professional",
    description: "Enhance your clinical toolkit with evidence-based cognitive wellness resources for better patient outcomes",
    icon: Stethoscope,
    color: "bg-teal-500",
  },
  {
    id: "colleague" as const,
    title: "Workplace Wellness",
    description: "Create a supportive workplace environment and help colleagues thrive with cognitive wellness tools",
    icon: Users,
    color: "bg-indigo-500",
  }
];

export function UserTypeStep({ onComplete, initialValue }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(initialValue || null);

  console.log("UserTypeStep: Rendering with selectedType:", selectedType, "initialValue:", initialValue);

  // Update selectedType when initialValue changes
  useEffect(() => {
    if (initialValue && initialValue !== selectedType) {
      setSelectedType(initialValue);
    }
  }, [initialValue]);

  const handleSelection = (type: UserType) => {
    console.log("UserTypeStep: User selected type:", type);
    setSelectedType(type);
    // Call onComplete immediately when user selects a type
    onComplete({ type });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">
          Choose Your Journey
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the path that resonates with your current situation and goals. We'll create a personalized experience just for you.
        </p>
      </div>

      {/* User Type Cards */}
      <div className="grid gap-4 md:grid-cols-2 w-full">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 w-full ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelection(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold text-foreground mb-1">
                      {type.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  
                  {/* Selection indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/30'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              </CardHeader>
              
              {isSelected && (
                <CardContent className="pt-0 pb-3">
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
          <p className="text-primary font-medium">
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
