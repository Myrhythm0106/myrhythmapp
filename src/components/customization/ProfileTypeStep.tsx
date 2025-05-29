
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Brain, Layout, ArrowRight, Check as CheckIcon } from "lucide-react";

type UserType = "productivity" | "cognitive" | "comprehensive";

interface ProfileTypeStepProps {
  selectedType: UserType | null;
  onTypeSelect: (type: UserType) => void;
  onNext: () => void;
}

export function ProfileTypeStep({ selectedType, onTypeSelect, onNext }: ProfileTypeStepProps) {
  const userTypes = [
    {
      id: "productivity",
      title: "Productivity Focus",
      description: "I want to be more organized and productive in my daily life",
      icon: <Layout className="h-10 w-10 text-primary" />,
    },
    {
      id: "cognitive",
      title: "Cognitive Support",
      description: "I need support with memory and cognitive challenges",
      icon: <Brain className="h-10 w-10 text-primary" />,
    },
    {
      id: "comprehensive",
      title: "Comprehensive Solution",
      description: "I want the full MyRhythm experience with all features",
      icon: <Check className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Type</CardTitle>
        <CardDescription>Select the option that best matches your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedType === type.id
                  ? "border-2 border-primary shadow-lg"
                  : "border border-border"
              }`}
              onClick={() => onTypeSelect(type.id as UserType)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="rounded-full bg-primary/10 p-2">{type.icon}</div>
                <div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </div>
                {selectedType === type.id && (
                  <CheckIcon className="ml-auto h-5 w-5 text-primary" />
                )}
              </CardHeader>
              <CardContent>
                <CardDescription>{type.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} className="ml-auto">
          Next: Appearance
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
