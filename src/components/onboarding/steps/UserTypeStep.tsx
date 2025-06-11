
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Users, Heart, ArrowRight, CheckCircle2 } from "lucide-react";

export type UserType = 
  | "brain-injury-recovery" 
  | "cognitive-optimization" 
  | "caregiver-support" 
  | "wellness-productivity";

interface UserTypeOption {
  id: UserType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  features: string[];
}

interface UserTypeData {
  type: UserType;
}

interface UserTypeStepProps {
  onComplete: (data: UserTypeData) => void;
  initialValue?: UserType;
}

export const UserTypeStep = ({ onComplete, initialValue }: UserTypeStepProps) => {
  // Pre-select brain injury recovery as the default
  const [selectedType, setSelectedType] = useState<UserType | null>(initialValue || "brain-injury-recovery");

  const userTypes: UserTypeOption[] = [
    {
      id: "brain-injury-recovery",
      title: "Brain Injury Recovery",
      subtitle: "TBI, ABI, Stroke, Concussion",
      description: "Comprehensive support for your recovery journey with specialized tools for rehabilitation and progress tracking.",
      icon: <Brain className="h-8 w-8 text-primary" />,
      badge: "Our Primary Mission",
      features: [
        "MYRHYTHM framework assessment",
        "Recovery-focused goal setting", 
        "Symptom and progress tracking",
        "Specialized brain training games",
        "Recovery community support"
      ]
    },
    {
      id: "cognitive-optimization",
      title: "Cognitive Optimization",
      subtitle: "Peak Mental Performance",
      description: "Enhance your cognitive abilities, focus, and mental clarity for professional and personal excellence.",
      icon: <Target className="h-8 w-8 text-primary" />,
      features: [
        "Performance-focused assessments",
        "Cognitive enhancement protocols",
        "Advanced brain training",
        "Productivity optimization",
        "Performance analytics"
      ]
    },
    {
      id: "caregiver-support",
      title: "Caregiver & Family Support",
      subtitle: "Supporting Your Loved One",
      description: "Tools and resources for family members and caregivers supporting someone on their recovery journey.",
      icon: <Users className="h-8 w-8 text-primary" />,
      features: [
        "Caregiver guidance resources",
        "Family communication tools",
        "Progress monitoring dashboard",
        "Support network features",
        "Educational materials"
      ]
    },
    {
      id: "wellness-productivity",
      title: "Wellness & Productivity", 
      subtitle: "Life Optimization",
      description: "Build better habits, enhance productivity, and create a structured approach to personal wellness.",
      icon: <Heart className="h-8 w-8 text-primary" />,
      features: [
        "Habit formation tools",
        "Productivity frameworks",
        "Wellness tracking",
        "Goal achievement system",
        "Life organization tools"
      ]
    }
  ];

  const handleSelectType = (type: UserType) => {
    setSelectedType(type);
  };

  const handleSubmit = () => {
    if (!selectedType) return;
    
    onComplete({
      type: selectedType
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome to MyRhythm</h2>
        <p className="text-muted-foreground">
          Our primary mission is supporting brain injury recovery. Choose the path that best describes your journey.
        </p>
      </div>

      {/* All User Type Options in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userTypes.map((type) => (
          <Card
            key={type.id}
            onClick={() => handleSelectType(type.id)}
            className={`cursor-pointer transition-all hover:shadow-md border-2 ${
              selectedType === type.id
                ? "border-primary shadow-lg bg-primary/5"
                : type.id === "brain-injury-recovery"
                ? "border-primary/30 hover:border-primary/50"
                : "border-border hover:border-primary/50"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    {type.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <CardDescription className="text-sm font-medium">
                      {type.subtitle}
                    </CardDescription>
                  </div>
                </div>
                {selectedType === type.id && (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
              {type.badge && (
                <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
                  {type.badge}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
              <div className="space-y-1">
                {type.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    {feature}
                  </div>
                ))}
                {type.features.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{type.features.length - 3} more features
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={!selectedType}
          className="gap-2"
        >
          Continue to Profile Setup
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
