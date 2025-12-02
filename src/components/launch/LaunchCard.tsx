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
    default: 'bg-white/90 shadow-sm border border-gray-100',
    elevated: 'bg-white shadow-lg border border-gray-100',
    featured: 'bg-gradient-to-br from-brand-emerald-50 to-brand-teal-50 shadow-md border border-brand-emerald-200',
    glass: 'bg-white/60 backdrop-blur-md shadow-sm border border-white/50',
  };

  return (
    <div 
      className={cn(
        "rounded-3xl p-6 transition-all duration-200",
        variants[variant],
        onClick && "cursor-pointer hover:shadow-md active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
