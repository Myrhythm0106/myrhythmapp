import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { Search, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingSearchProps {
  className?: string;
  variant?: 'search' | 'help';
}

export function FloatingSearch({ className, variant = 'search' }: FloatingSearchProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      <GlobalSearch />
      <div className={cn(
        "fixed bottom-6 right-6 z-50",
        className
      )}>
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900 text-white border-2 border-white/20"
          onClick={() => {
            // Trigger the global search
            const event = new KeyboardEvent('keydown', {
              key: 'k',
              ctrlKey: true,
              bubbles: true
            });
            document.dispatchEvent(event);
          }}
        >
          {variant === 'help' ? (
            <>
              <HelpCircle className="h-5 w-5 mr-2" />
              Lost?
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>
    </>
  );
}