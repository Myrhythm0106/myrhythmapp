import React from 'react';
import { cn } from '@/lib/utils';

interface MVPPageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function MVPPageHeader({ title, subtitle, className, children }: MVPPageHeaderProps) {
  return (
    <div className={cn("mb-8 space-y-4", className)}>
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-memory-emerald-600 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-brain-health-700 font-medium max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
}