import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = "Processing...", 
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-gradient-to-br from-neural-purple-50/95 via-white/95 to-neural-blue-50/95 backdrop-blur-md",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-600 animate-pulse shadow-lg" />
          <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-white animate-spin" />
        </div>
        
        <div className="space-y-2">
          <p className="font-medium text-neural-indigo-700">
            {message}
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-memory-emerald-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-brain-health-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-clarity-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}