
import React from "react";
import { EnhancedBackgroundEffects } from "@/components/ui/EnhancedBackgroundEffects";

interface Preview3BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function Preview3Background({ children, className = "" }: Preview3BackgroundProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-neural-purple-50/30 via-neural-blue-50/25 to-clarity-teal-50/30 relative ${className}`}>
      {/* Enhanced gradient foundation - 5 colors only */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brain-health-50/20 via-transparent to-neural-purple-50/15" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-neural-blue-50/10 to-clarity-teal-50/20" />
      
      <EnhancedBackgroundEffects />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
