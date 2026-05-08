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
    default: 'bg-white border border-brain-health-100',
    elevated: 'bg-white shadow-sm border border-brain-health-100',
    featured: 'bg-white border border-brand-emerald-200',
    glass: 'bg-white/70 backdrop-blur border border-brain-health-100',
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variants[variant],
        onClick && "cursor-pointer hover:border-brain-health-200 hover:shadow-sm active:scale-[0.99]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
