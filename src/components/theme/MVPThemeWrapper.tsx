import React from 'react';

interface MVPThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function MVPThemeWrapper({ children, className = '' }: MVPThemeWrapperProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-neural-purple-50 to-neural-blue-50 dark:from-neural-purple-900 dark:to-neural-blue-800 ${className}`}>
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neural-indigo-500/10 via-neural-purple-500/5 to-brain-health-500/10 dark:from-neural-indigo-400/20 dark:via-neural-purple-400/10 dark:to-brain-health-400/20 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
            <defs>
              <pattern id="mvp-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mvp-pattern)" />
          </svg>
        </div>
      </div>
    </div>
  );
}