import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Calendar, Brain, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NextAction {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
}

interface ContextualNextButtonProps {
  customAction?: NextAction;
  className?: string;
}

export function ContextualNextButton({ customAction, className }: ContextualNextButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const getNextAction = (): NextAction => {
    if (customAction) return customAction;

    // Context-aware next actions based on current page
    switch (location.pathname) {
      case '/calendar':
        return {
          label: "Plan Next Step",
          action: () => {
            // Trigger quick action modal
            navigate('/calendar?addAction=true');
          },
          icon: <Zap className="h-4 w-4" />
        };
      case '/goals':
        return {
          label: "Create Goal",
          action: () => navigate('/calendar?newGoal=true'),
          icon: <Target className="h-4 w-4" />
        };
      case '/dashboard':
        return {
          label: "View Calendar",
          action: () => navigate('/calendar'),
          icon: <Calendar className="h-4 w-4" />
        };
      default:
        return {
          label: "Continue",
          action: () => navigate('/calendar'),
          icon: <ArrowRight className="h-4 w-4" />
        };
    }
  };

  const nextAction = getNextAction();

  return (
    <Button
      onClick={nextAction.action}
      variant={nextAction.variant || "default"}
      className={`flex items-center gap-2 ${className}`}
    >
      {nextAction.icon}
      {nextAction.label}
    </Button>
  );
}