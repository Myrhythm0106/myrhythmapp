import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Users, Heart, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

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
  const [showOtherPaths, setShowOtherPaths] = useState(false);

  const primaryUserType: UserTypeOption = {
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
  };

  const otherUserTypes: UserTypeOption[] = [
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

      {/* Primary Mission - Brain Injury Recovery */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">Our Primary Mission</h3>
        <Card
          onClick={() => handleSelectType(primaryUserType.id)}
          className={`cursor-pointer transition-all hover:shadow-md border-2 ${
            selectedType === primaryUserType.id
              ? "border-primary shadow-lg bg-primary/5"
              : "border-primary/30 hover:border-primary/50"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  {primaryUserType.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{primaryUserType.title}</CardTitle>
                  <CardDescription className="text-sm font-medium">
                    {primaryUserType.subtitle}
                  </CardDescription>
                </div>
              </div>
              {selectedType === primaryUserType.id && (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>
            {primaryUserType.badge && (
              <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
                {primaryUserType.badge}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {primaryUserType.description}
            </p>
            <div className="space-y-1">
              {primaryUserType.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {feature}
                </div>
              ))}
              {primaryUserType.features.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{primaryUserType.features.length - 3} more features
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Paths - Expandable Section */}
      <div className="space-y-3">
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setShowOtherPaths(!showOtherPaths)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Using MyRhythm for other purposes?
            {showOtherPaths ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>

        {showOtherPaths && (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                The framework that helps with recovery also supports other journeys
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-3">
              {otherUserTypes.map((type) => (
                <Card
                  key={type.id}
                  onClick={() => handleSelectType(type.id)}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedType === type.id
                      ? "border-2 border-primary shadow-lg"
                      : "border border-border hover:border-primary/50"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-1.5">
                          {React.cloneElement(type.icon as React.ReactElement, { className: "h-5 w-5 text-primary" })}
                        </div>
                        <div>
                          <CardTitle className="text-base">{type.title}</CardTitle>
                          <CardDescription className="text-xs font-medium">
                            {type.subtitle}
                          </CardDescription>
                        </div>
                      </div>
                      {selectedType === type.id && (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                    <div className="space-y-1">
                      {type.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-2.5 w-2.5 text-primary" />
                          {feature}
                        </div>
                      ))}
                      {type.features.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{type.features.length - 2} more features
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
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
