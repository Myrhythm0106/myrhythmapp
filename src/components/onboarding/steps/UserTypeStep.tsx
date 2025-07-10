
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

  const handleSubmit = () => {
    if (selectedType) {
      onComplete({ type: selectedType });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          This helps us personalize your MyRhythm experience
        </p>
      </div>

      <RadioGroup value={selectedType || ""} onValueChange={(value) => setSelectedType(value as UserType)}>
        <div className="grid gap-4">
          {userTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary shadow-md' : ''
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <Label htmlFor={type.id} className="cursor-pointer flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${type.color} flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </RadioGroup>

      <Button 
        onClick={handleSubmit}
        disabled={!selectedType}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
}
