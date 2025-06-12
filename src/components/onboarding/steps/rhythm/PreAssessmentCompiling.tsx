
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, Target, Users, Heart } from "lucide-react";
import { UserType } from "../UserTypeStep";

interface PreAssessmentCompilingProps {
  onComplete: () => void;
  userType?: UserType | null;
}

export function PreAssessmentCompiling({ onComplete, userType }: PreAssessmentCompilingProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // 3.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getIcon = () => {
    switch (userType) {
      case "brain-injury-recovery":
        return <Brain className="h-12 w-12 text-white" />;
      case "cognitive-optimization":
        return <Target className="h-12 w-12 text-white" />;
      case "caregiver-support":
        return <Users className="h-12 w-12 text-white" />;
      case "wellness-productivity":
        return <Heart className="h-12 w-12 text-white" />;
      default:
        return <Brain className="h-12 w-12 text-white" />;
    }
  };

  const getMessage = () => {
    switch (userType) {
      case "brain-injury-recovery":
        return "Personalizing your recovery-focused assessment based on your unique journey...";
      case "cognitive-optimization":
        return "Calibrating cognitive performance metrics for your optimization goals...";
      case "caregiver-support":
        return "Preparing caregiver-specific insights and support resources...";
      case "wellness-productivity":
        return "Customizing wellness and productivity frameworks for your lifestyle...";
      default:
        return "Personalizing your rhythm discovery experience...";
    }
  };

  const getSubMessage = () => {
    switch (userType) {
      case "brain-injury-recovery":
        return "Creating a safe space for your assessment";
      case "cognitive-optimization":
        return "Analyzing your performance patterns";
      case "caregiver-support":
        return "Understanding your support role";
      case "wellness-productivity":
        return "Mapping your productivity rhythms";
      default:
        return "Understanding your unique patterns";
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center animate-pulse">
              {getIcon()}
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800">
              Preparing Your Assessment
            </h3>
            <p className="text-gray-600 text-sm">
              {getMessage()}
            </p>
            <p className="text-xs text-muted-foreground">
              {getSubMessage()}
            </p>
          </div>
          
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
