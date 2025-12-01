import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { haptics } from '@/utils/haptics/hapticFeedback';
import { cn } from '@/lib/utils';

interface QuickEscapeButtonProps {
  className?: string;
}

export function QuickEscapeButton({ className }: QuickEscapeButtonProps) {
  const navigate = useNavigate();
  
  const handleEscape = () => {
    haptics.medium();
    navigate('/dashboard');
  };

  return (
    <Button
      onClick={handleEscape}
      className={cn(
        "fixed bottom-20 left-4 z-40 md:hidden",
        "h-12 px-4 gap-2 rounded-full",
        "bg-neural-purple-500 hover:bg-neural-purple-600",
        "text-white font-medium shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "border-2 border-neural-purple-400",
        className
      )}
      aria-label="Return to home dashboard"
    >
      <Home className="h-5 w-5" />
      <span>Home</span>
    </Button>
  );
}
