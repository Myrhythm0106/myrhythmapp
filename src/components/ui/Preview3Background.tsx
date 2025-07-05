
import React from "react";
import { BackgroundEffects } from "@/components/landing/preview3/BackgroundEffects";

interface Preview3BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function Preview3Background({ children, className = "" }: Preview3BackgroundProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative ${className}`}>
      <BackgroundEffects />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
