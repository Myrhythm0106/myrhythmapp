
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
    console.log("FloatingRegisterButton: Start Your LEAP button clicked - DEBUG VERSION, variant:", variant);
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
          text: "Skip Trial",
          subtext: "Pay & Start Now",
          color: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        };
      case 'results':
        return {
          icon: Gift,
          text: "See Full Results",
          subtext: "Unlock Everything",
          color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        };
      case 'trial':
        return {
          icon: UserPlus,
          text: "Start Your LEAP",
          subtext: "Free Trial",
          color: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        };
      default:
        return {
          icon: UserPlus,
          text: "Start Your LEAP",
          subtext: "Free Trial",
          color: "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
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
          "text-white shadow-2xl hover:shadow-xl transition-all duration-300 rounded-full text-base font-semibold flex items-center gap-2 hover:scale-105",
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
