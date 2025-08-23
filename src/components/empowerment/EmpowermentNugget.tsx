import React, { useState } from 'react';
import { Heart, RefreshCw, X, Copy, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEmpowerment } from '@/contexts/EmpowermentContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EmpowermentNuggetProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function EmpowermentNugget({ className, variant = 'default' }: EmpowermentNuggetProps) {
  const { dailyStatement, refreshStatement, toggleFavorite, dismissForToday, dismissedForToday } = useEmpowerment();
  const [open, setOpen] = useState(false);

  if (!dailyStatement || dismissedForToday) {
    return null;
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(dailyStatement.text);
      toast.success('💫 Copied to clipboard!', {
        description: 'Share this empowerment with others',
      });
      setOpen(false);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(dailyStatement.id);
      toast.success('💝 Added to favorites!', {
        description: 'Find this in your empowerment collection',
      });
    } catch (error) {
      toast.error('Failed to save to favorites');
    }
  };

  const handleRefresh = () => {
    refreshStatement();
    toast.success('✨ New empowerment unlocked!');
    setOpen(false);
  };

  const handleDismiss = () => {
    dismissForToday();
    setOpen(false);
  };

  return (
    <div className={cn(
      "relative group transition-all duration-300",
      variant === 'compact' ? "max-w-xs" : "max-w-sm",
      className
    )}>
      <div className={cn(
        "bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border border-purple-200/50",
        "rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200",
        "flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
      )}>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-transparent bg-gradient-to-r from-purple-700 via-blue-700 to-teal-700 bg-clip-text font-medium",
            "truncate",
            variant === 'compact' ? "text-xs" : "text-sm"
          )}>
            {dailyStatement.text}
          </p>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-6 w-6 p-0 hover:bg-purple-100/50 text-purple-600 opacity-70 group-hover:opacity-100",
                  variant === 'compact' && "h-5 w-5"
                )}
              >
                <MoreHorizontal className={cn("h-3 w-3", variant === 'compact' && "h-2.5 w-2.5")} />
                <span className="sr-only">Empowerment options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleToggleFavorite}
                  className="w-full justify-start text-left"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save to Favorites
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopyToClipboard}
                  className="w-full justify-start text-left"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="w-full justify-start text-left"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Get New Empowerment
                </Button>
                <hr className="my-1" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDismiss}
                  className="w-full justify-start text-left text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Hide for Today
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}