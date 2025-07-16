
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

  // Don't show if user has completed onboarding (persistent until registration complete)
  const isRegistered = localStorage.getItem("myrhythm_onboarding_complete") === "true";
  if (!forceShow && isRegistered) {
    return null;
  }

  const handleRegister = () => {
    console.log("FloatingRegisterButton: Register Here button clicked, variant:", variant);
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
          buttonVariant: "premium" as const
        };
      case 'results':
        return {
          icon: Gift,
          text: "Unlock Results",
          subtext: "See Full Journey",
          buttonVariant: "cognitive" as const
        };
      case 'trial':
        return {
          icon: UserPlus,
          text: "Register Here",
          subtext: "7-Day Free Trial",
          buttonVariant: "premium" as const
        };
      default:
        return {
          icon: UserPlus,
          text: "Register Here",
          subtext: "Free Trial",
          buttonVariant: "premium" as const
        };
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  return (
    <div className={cn(
      "fixed z-50 animate-fade-in transition-all duration-300",
      isMobile ? "bottom-6 right-6" : "bottom-8 right-8",
      className
    )}>
      <Button 
        onClick={handleRegister}
        size={isMobile ? "lg" : "lg"}
        variant={config.buttonVariant}
        className={cn(
          "rounded-full text-base font-medium flex items-center gap-3 hover:scale-105 border-2 border-white/30 backdrop-blur-sm group relative overflow-hidden shadow-2xl hover:shadow-purple-300/40 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 pulse",
          isMobile ? "px-6 py-4" : "px-8 py-6"
        )}
      >
        {/* Premium shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-pulse rounded-full"></div>
        
        <div className="relative flex items-center gap-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          <div className="flex flex-col items-start">
            <span className="font-medium">{config.text}</span>
            {!isMobile && (
              <span className="text-xs opacity-90 leading-tight">{config.subtext}</span>
            )}
          </div>
          <ArrowRight className="h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </Button>
    </div>
  );
}
