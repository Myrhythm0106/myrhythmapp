import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { currentVersion } from '@/data/releaseNotes';
import { LaunchWhatsNewModal } from './LaunchWhatsNewModal';

export function WhatsNewBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const lastViewedVersion = localStorage.getItem('myrhythm_last_viewed_version');
    if (lastViewedVersion !== currentVersion) {
      setHasUnread(true);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    localStorage.setItem('myrhythm_last_viewed_version', currentVersion);
    setHasUnread(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className={cn(
          "relative h-10 px-3 rounded-xl",
          "hover:bg-amber-50 transition-colors",
          hasUnread && "bg-amber-50"
        )}
      >
        <Sparkles className={cn(
          "h-5 w-5",
          hasUnread ? "text-amber-500" : "text-gray-600"
        )} />
        
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
        )}
        
        <span className="ml-2 text-sm font-medium hidden sm:inline">
          New
        </span>
      </Button>
      
      <LaunchWhatsNewModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
