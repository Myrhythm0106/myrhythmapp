
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

  // Check if user is actually authenticated (using Supabase auth state)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuthState = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error("Error checking auth state:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Don't show if user is actually authenticated (unless forced)
  if (!forceShow && isAuthenticated) {
    return null;
  }

  // Don't show during loading unless forced
  if (!forceShow && isLoading) {
    return null;
  }

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/mvp/user-type-selection");
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
      "fixed z-50 animate-fade-in transition-all duration-300 animate-pulse",
      isMobile ? "bottom-6 right-6" : "bottom-8 right-8",
      className
    )}>
      <Button 
        onClick={handleRegister}
        size={isMobile ? "lg" : "lg"}
        variant={config.buttonVariant}
        className={cn(
          "rounded-full text-base font-medium flex items-center gap-3 hover:scale-105 border-2 border-white/30 backdrop-blur-sm group relative overflow-hidden shadow-lg hover:shadow-purple-300/30 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 hover:from-purple-500 hover:via-blue-500 hover:to-teal-500",
          "px-6 py-3"
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
