import React from 'react';
import { cn } from '@/lib/utils';

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

export function SurfaceCard({ 
  children, 
  className,
  variant = 'default',
  padding = 'md',
  hover = false
}: SurfaceCardProps) {
  const variants = {
    default: "bg-card border border-border/50 shadow-sm",
    elevated: "bg-card border border-border/30 shadow-lg backdrop-blur-sm",
    subtle: "bg-gradient-to-br from-neural-purple-50/30 to-neural-blue-50/20 border border-neural-indigo-200/30 backdrop-blur-sm",
    glass: "bg-card/80 backdrop-blur-md border border-border/20 shadow-xl"
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6", 
    xl: "p-8"
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300",
        variants[variant],
        paddings[padding],
        hover && "hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}