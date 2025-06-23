
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Users, Heart, ArrowRight, CheckCircle2, Star } from "lucide-react";

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
  isPrimary?: boolean;
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
      title: "Cognitive Wellness & Recovery Journey",
      subtitle: "I am on my empowering growth path",
      description: "Comprehensive support for your thriving journey with specialized tools for cognitive wellness and personal empowerment.",
      icon: <Brain className="h-8 w-8 text-primary" />,
      badge: "Our Flagship Experience",
      isPrimary: true,
      features: [
        "MYRHYTHM framework assessment",
        "Empowering goal achievement system", 
        "Wellness monitoring & celebrations",
        "Cognitive strengthening activities",
        "Thriving community support"
      ]
    },
    {
      id: "cognitive-optimization",
      title: "Mental Performance & Growth",
      subtitle: "I am seeking mental clarity and peak performance",
      description: "Enhance your cognitive abilities, focus, and mental clarity for professional and personal excellence.",
      icon: <Target className="h-8 w-8 text-primary" />,
      features: [
        "Performance-focused assessments",
        "Cognitive enhancement programs",
        "Advanced brain strengthening",
        "Productivity optimization",
        "Achievement insights"
      ]
    },
    {
      id: "caregiver-support",
      title: "Family & Support Network",
      subtitle: "I am empowering a loved one's journey",
      description: "Tools and resources for family members and supporters helping someone achieve their wellness goals.",
      icon: <Users className="h-8 w-8 text-primary" />,
      features: [
        "Supportive guidance resources",
        "Family empowerment tools",
        "Progress celebration dashboard",
        "Community connection features",
        "Empowering educational materials"
      ]
    },
    {
      id: "wellness-productivity",
      title: "Life Organization & Wellness", 
      subtitle: "I am seeking life optimization",
      description: "Build empowering habits, enhance productivity, and create a structured approach to personal thriving.",
      icon: <Heart className="h-8 w-8 text-primary" />,
      features: [
        "Habit mastery tools",
        "Productivity frameworks",
        "Wellness optimization",
        "Goal achievement system",
        "Life organization mastery"
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
          Our flagship experience supports cognitive wellness & recovery. Choose the path that best describes your empowering journey.
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
                : type.isPrimary
                ? "border-primary/30 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${type.isPrimary ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    {type.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {type.title}
                      {type.isPrimary && <Star className="h-4 w-4 text-primary" />}
                    </CardTitle>
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
                <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-primary/20">
                  ✨ {type.badge}
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
                    +{type.features.length - 3} more empowering features
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
