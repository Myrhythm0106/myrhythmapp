import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Brain, ArrowLeft, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { haptics } from '@/utils/haptics/hapticFeedback';
import { cn } from '@/lib/utils';

interface PersistentNavHeaderProps {
  className?: string;
}

const pageLabels: Record<string, string> = {
  '/next-steps': 'Next Steps',
  '/memory-bridge': 'Memory Bridge',
  '/calendar': 'Calendar',
  '/dashboard': 'Dashboard',
  '/goals': 'Goals',
  '/settings': 'Settings',
};

export function PersistentNavHeader({ className }: PersistentNavHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentLabel = pageLabels[location.pathname] || 'MyRhythm';
  
  const handleHome = () => {
    haptics.light();
    navigate('/dashboard');
  };
  
  const handleMemoryBridge = () => {
    haptics.light();
    navigate('/memory-bridge');
  };
  
  const handleNextSteps = () => {
    haptics.light();
    navigate('/next-steps');
  };
  
  const handleBack = () => {
    haptics.light();
    window.history.back();
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/50",
      className
    )}>
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-neural-purple-500 via-clarity-teal-500 to-brain-health-500" />
      
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back + Home */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 rounded-full hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleHome}
            className="h-10 px-3 gap-2 rounded-full border-neural-purple-200 hover:bg-neural-purple-50 hover:border-neural-purple-300"
            aria-label="Go to dashboard"
          >
            <Home className="h-4 w-4 text-neural-purple-600" />
            <span className="text-sm font-medium">Home</span>
          </Button>
        </div>
        
        {/* Center: Current Location */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">You're in:</span>
          <span className="text-sm font-semibold text-foreground">{currentLabel}</span>
        </div>
        
        {/* Right: Quick Access to Core Features */}
        <div className="flex items-center gap-2">
          {location.pathname !== '/memory-bridge' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMemoryBridge}
              className="h-10 px-3 gap-2 rounded-full border-clarity-teal-200 hover:bg-clarity-teal-50 hover:border-clarity-teal-300"
              aria-label="Go to Memory Bridge"
            >
              <Brain className="h-4 w-4 text-clarity-teal-600" />
              <span className="hidden sm:inline text-sm font-medium">Memory</span>
            </Button>
          )}
          
          {location.pathname !== '/next-steps' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextSteps}
              className="h-10 px-3 gap-2 rounded-full border-brain-health-200 hover:bg-brain-health-50 hover:border-brain-health-300"
              aria-label="Go to Next Steps"
            >
              <Target className="h-4 w-4 text-brain-health-600" />
              <span className="hidden sm:inline text-sm font-medium">Steps</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
