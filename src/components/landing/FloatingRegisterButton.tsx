
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight, Zap, Gift } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FloatingRegisterButtonProps {
  forceShow?: boolean;
  variant?: 'default' | 'payment' | 'results' | 'trial';
  className?: string;
}

export function FloatingRegisterButton({ 
  forceShow = false, 
  variant = 'default',
  className 
}: FloatingRegisterButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't show on onboarding pages unless forced
  if (!forceShow && location.pathname.includes('/onboarding')) {
    return null;
  }

  // Don't show if user is already logged in (basic check)
  const isLoggedIn = localStorage.getItem("myrhythm_onboarding_complete") === "true";
  if (!forceShow && isLoggedIn) {
    return null;
  }

  const handleRegister = () => {
    console.log("FloatingRegisterButton: Register Here button clicked - PRODUCTION VERSION, variant:", variant);
    console.log("FloatingRegisterButton: About to navigate to /onboarding");
    console.log("FloatingRegisterButton: Current location:", window.location.href);
    
    try {
      navigate("/onboarding");
      console.log("FloatingRegisterButton: navigate() called successfully");
    } catch (error) {
      console.error("FloatingRegisterButton: Navigation error:", error);
    }
  };

  const getButtonConfig = () => {
    switch (variant) {
      case 'payment':
        return {
          icon: Zap,
          text: "Start Trial",
          subtext: "Begin Journey",
          color: "bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700"
        };
      case 'results':
        return {
          icon: Gift,
          text: "Unlock Results",
          subtext: "See Full Journey",
          color: "bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 hover:from-purple-600 hover:via-blue-600 hover:to-teal-600"
        };
      case 'trial':
        return {
          icon: UserPlus,
          text: "Register Here",
          subtext: "7-Day Free Trial",
          color: "bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-600 hover:via-emerald-600 hover:to-green-600"
        };
      default:
        return {
          icon: UserPlus,
          text: "Register Here",
          subtext: "Free Trial",
          color: "bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700"
        };
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  // Show on both mobile and desktop now
  return (
    <div className={cn(
      "fixed z-50 animate-fade-in",
      isMobile ? "bottom-6 right-6" : "bottom-8 right-8",
      className
    )}>
      <Button 
        onClick={handleRegister}
        size={isMobile ? "lg" : "lg"}
        className={cn(
          "text-white shadow-2xl hover:shadow-xl transition-all duration-300 rounded-full text-base font-semibold flex items-center gap-2 hover:scale-105 border-2 border-white/20",
          isMobile ? "px-6 py-4" : "px-8 py-6",
          config.color
        )}
      >
        <Icon className="h-5 w-5" />
        <div className="flex flex-col items-start">
          <span>{config.text}</span>
          {!isMobile && (
            <span className="text-xs opacity-90">{config.subtext}</span>
          )}
        </div>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
