import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useThemeHierarchy } from '@/hooks/useThemeHierarchy';

interface ThemeHierarchyDisplayProps {
  date?: Date;
  variant?: 'full' | 'breadcrumb' | 'current';
  className?: string;
}

export function ThemeHierarchyDisplay({ 
  date = new Date(), 
  variant = 'full',
  className = ""
}: ThemeHierarchyDisplayProps) {
  const { getThemeHierarchy } = useThemeHierarchy();
  const hierarchy = getThemeHierarchy(date);

  if (variant === 'current') {
    return (
      <span className={`font-bold text-brand-orange-700 ${className}`}>
        #{hierarchy.current}
      </span>
    );
  }

  if (variant === 'breadcrumb') {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        {hierarchy.breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            <span className={index === hierarchy.breadcrumb.length - 1 
              ? "font-bold text-brand-orange-700" 
              : "text-brand-teal-600"
            }>
              {item}
            </span>
            {index < hierarchy.breadcrumb.length - 1 && (
              <ChevronRight className="h-3 w-3 text-brand-teal-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-xs text-brand-teal-600 uppercase tracking-wider font-medium">
        My Journey
      </div>
      <div className="text-lg font-semibold text-brand-teal-800">
        {hierarchy.yearly}
      </div>
      <div className="text-base text-brand-teal-700">
        → {hierarchy.monthly}
      </div>
      <div className="text-xl font-bold text-brand-orange-700 italic">
        → Today: #{hierarchy.current}
      </div>
    </div>
  );
}