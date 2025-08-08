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
    description: "...you want to strengthen your mind after a challenging experience, or you're currently feeling like your cognitive abilities aren't what they used to be and you're searching for a way back to feeling like yourself again",
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    id: "caregiver" as const,
    title: "Caregiver Support", 
    description: "...you want to build resilience and prevent burnout while supporting someone you love, or you're currently exhausted from holding it all together and need support too",
    icon: Heart,
    color: "bg-rose-500",
  },
  {
    id: "cognitive-optimization" as const,
    title: "Cognitive Optimization",
    description: "...you want to build on your existing mental strengths and reach new levels of performance, or you know there's more potential locked inside your mind and you're ready to unlock peak mental performance",
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    id: "wellness" as const,
    title: "General Wellness",
    description: "...you want to proactively build mental resilience for life's challenges, or you're currently feeling scattered and want to create sustainable mental wellness",
    icon: Users,
    color: "bg-green-500",
  },
  {
    id: "medical-professional" as const,
    title: "Medical Professional",
    description: "...you want to enhance your toolkit with evidence-based cognitive wellness resources, or you see the gaps in traditional care and want better tools to truly help your patients thrive",
    icon: Stethoscope,
    color: "bg-teal-500",
  },
  {
    id: "colleague" as const,
    title: "Colleague",
    description: "...you want to create a more supportive workplace environment for cognitive wellness, or you've witnessed how cognitive challenges impact your workplace family and want to create real change",
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
          This is for you if...
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the path that speaks to your heart. We'll create a personalized journey that honors your unique story.
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
