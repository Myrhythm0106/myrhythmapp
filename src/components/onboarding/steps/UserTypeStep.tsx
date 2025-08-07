
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";
import { Brain, Heart, Zap } from "lucide-react";

interface UserTypeStepProps {
  onComplete: (data: { type: UserType }) => void;
  initialValue?: UserType | null;
}

export function UserTypeStep({ onComplete, initialValue }: UserTypeStepProps) {
  const handleUserTypeSelect = (type: UserType) => {
    onComplete({ type });
  };

  const userTypes = [
    {
      type: 'cognitive-optimization' as UserType,
      title: 'Cognitive Optimization',
      description: 'Focus on mental performance, memory, and cognitive enhancement',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Enhanced memory', 'Better focus', 'Improved problem-solving']
    },
    {
      type: 'empowerment' as UserType,
      title: 'Personal Empowerment',
      description: 'Build confidence, leadership skills, and personal growth',
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
      benefits: ['Increased confidence', 'Leadership skills', 'Personal growth']
    },
    {
      type: 'brain-health' as UserType,
      title: 'Brain Health',
      description: 'Optimize overall brain wellness and mental health',
      icon: Zap,
      color: 'from-green-500 to-teal-500',
      benefits: ['Mental wellness', 'Stress reduction', 'Healthy habits']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Choose Your Journey
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the path that best aligns with your goals and aspirations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {userTypes.map((userType) => {
          const Icon = userType.icon;
          const isSelected = initialValue === userType.type;
          
          return (
            <Card
              key={userType.type}
              className={`relative overflow-hidden border-2 transition-all cursor-pointer group hover:shadow-lg ${
                isSelected 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleUserTypeSelect(userType.type)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${userType.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  {userType.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {userType.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-foreground">Key Benefits:</h4>
                  <ul className="space-y-1">
                    {userType.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className={`w-full transition-all ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'group-hover:bg-primary group-hover:text-primary-foreground'
                  }`}
                  variant={isSelected ? "default" : "outline"}
                >
                  {isSelected ? 'Selected' : 'Select This Path'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
