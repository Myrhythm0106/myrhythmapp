import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface FloatingSearchHelperProps {
  className?: string;
  variant?: 'minimal' | 'prominent' | 'helper';
  contextualHints?: string[];
  currentPage?: string;
}

export function FloatingSearchHelper({ 
  className = '',
  variant = 'minimal',
  contextualHints = [],
  currentPage
}: FloatingSearchHelperProps) {
  const navigate = useNavigate();
  const [showHints, setShowHints] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  // Auto-pulse on certain pages to draw attention
  useEffect(() => {
    const pulseTriggerPages = ['assessment', 'onboarding', 'setup'];
    const shouldTriggerPulse = pulseTriggerPages.some(page => 
      currentPage?.includes(page) || location.pathname.includes(page)
    );
    
    if (shouldTriggerPulse) {
      const timer = setTimeout(() => setShouldPulse(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleSearchClick = () => {
    navigate('/search?context=' + encodeURIComponent(currentPage || ''));
  };

  const getContextualMessage = () => {
    if (location.pathname.includes('assessment')) {
      return "Lost during assessment? Search for help!";
    }
    if (location.pathname.includes('onboarding')) {
      return "Need guidance? Search anything!";
    }
    if (location.pathname.includes('memory-bridge')) {
      return "Questions about Memory Bridge? Search here!";
    }
    return "Lost? Search anything to get help!";
  };

  if (variant === 'minimal') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSearchClick}
        className={`fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg border-border/50 hover:bg-white ${
          shouldPulse ? 'animate-pulse' : ''
        } ${className}`}
      >
        <SearchIcon className="h-4 w-4 mr-2" />
        Search
      </Button>
    );
  }

  if (variant === 'prominent') {
    return (
      <Card className={`fixed bottom-4 right-4 z-50 shadow-xl bg-white/95 backdrop-blur-sm ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <SearchIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Need help?</p>
              <p className="text-xs text-muted-foreground">Search for anything</p>
            </div>
            <Button size="sm" onClick={handleSearchClick}>
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'helper') {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Card 
          className={`bg-white/95 backdrop-blur-sm shadow-xl transition-all duration-300 ${
            showHints ? 'w-80' : 'w-auto'
          } ${shouldPulse ? 'animate-pulse' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{getContextualMessage()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Ctrl+K
                  </Badge>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs"
                    onClick={() => setShowHints(!showHints)}
                  >
                    {showHints ? 'Hide' : 'Show'} suggestions
                  </Button>
                </div>
              </div>
              <Button size="sm" onClick={handleSearchClick} className="bg-gradient-to-r from-primary to-accent">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>

            {showHints && (contextualHints.length > 0 || currentPage) && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-2">Quick searches:</p>
                <div className="space-y-1">
                  {contextualHints.length > 0 ? contextualHints.map((hint, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"  
                      className="w-full justify-start text-xs h-auto py-1"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(hint)}`)}
                    >
                      <ArrowRight className="h-3 w-3 mr-2" />
                      {hint}
                    </Button>
                  )) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-1"
                        onClick={() => navigate('/search?q=how to use memory bridge')}
                      >
                        <ArrowRight className="h-3 w-3 mr-2" />
                        How to use Memory Bridge
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-1"
                        onClick={() => navigate('/search?q=assessment help')}
                      >
                        <ArrowRight className="h-3 w-3 mr-2" />
                        Assessment help
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}