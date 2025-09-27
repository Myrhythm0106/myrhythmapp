import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
  fallbackPath?: string;
  onboardingMode?: boolean;
}

export function BackButton({ 
  className, 
  variant = "ghost", 
  size = "sm",
  onClick,
  fallbackPath = "/",
  onboardingMode = false
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // Context-aware navigation for onboarding flows
    if (onboardingMode) {
      const currentPath = location.pathname;
      
      // Handle specific onboarding navigation
      if (currentPath.includes('/mvp/')) {
        const steps = [
          '/mvp/user-type-selection',
          '/mvp/privacy-setup', 
          '/mvp/assessment-introduction',
          '/mvp/assessment',
          '/mvp/results'
        ];
        
        const currentIndex = steps.findIndex(step => currentPath.includes(step));
        if (currentIndex > 0) {
          navigate(steps[currentIndex - 1]);
          return;
        }
      }
      
      // Handle general onboarding steps
      if (currentPath.includes('/onboarding/')) {
        // Try to go back within onboarding flow first
        if (window.history.length > 2) {
          navigate(-1);
          return;
        }
      }
      
      // Default onboarding fallback
      navigate('/auth');
      return;
    }

    // Regular back navigation
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}