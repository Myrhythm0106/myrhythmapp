import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LaunchCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'featured' | 'glass';
  onClick?: () => void;
}

export function LaunchCard({ 
  children, 
  className, 
  variant = 'default',
  onClick 
}: LaunchCardProps) {
  const variants = {
    default: 'bg-launch-ivory border border-launch-gold/30',
    elevated: 'bg-launch-ivory shadow-sm border border-launch-gold/30',
    featured: 'bg-launch-ivory border border-launch-gold/50',
    glass: 'bg-launch-ivory/70 backdrop-blur border border-launch-gold/30',
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variants[variant],
        onClick && "cursor-pointer hover:border-launch-gold/60 hover:shadow-sm active:scale-[0.99]",
        className
      )}
      onClick={onClick}
    >

      {children}
    </div>
  );
}
