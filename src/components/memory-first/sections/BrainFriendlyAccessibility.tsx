import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, Eye, Zap, Pause, RotateCcw, BookOpen, Loader2 } from 'lucide-react';
import { speechService } from '@/utils/speechSynthesis';
import { toast } from 'sonner';

export function BrainFriendlyAccessibility() {
  const [textSize, setTextSize] = useState(() => 
    localStorage.getItem('accessibility-text-size') || 'normal'
  );
  const [isReading, setIsReading] = useState(false);
  const [showSimpleMode, setShowSimpleMode] = useState(() => 
    localStorage.getItem('accessibility-simple-mode') === 'true'
  );

  // Apply settings on mount
  useEffect(() => {
    applyTextSize(textSize);
    applySimpleMode(showSimpleMode);
  }, []);

  const applyTextSize = (size: string) => {
    const root = document.documentElement;
    const sizeMap = {
      normal: '1rem',
      large: '1.125rem', 
      xl: '1.25rem'
    };
    root.style.setProperty('--accessibility-text-size', sizeMap[size as keyof typeof sizeMap]);
    localStorage.setItem('accessibility-text-size', size);
  };

  const applySimpleMode = (enabled: boolean) => {
    document.body.classList.toggle('simple-mode', enabled);
    localStorage.setItem('accessibility-simple-mode', enabled.toString());
  };

  const handleTextToSpeech = async () => {
    if (!speechService.isAvailable()) {
      toast.error("Speech not supported in this browser");
      return;
    }

    if (isReading) {
      speechService.cancel();
      setIsReading(false);
      return;
    }

    try {
      setIsReading(true);
      const textContent = document.querySelector('main')?.innerText || 
                         document.body.innerText;
      
      await speechService.speak(textContent, { 
        rate: 0.8, // Slower for memory challenges
        volume: 0.9 
      });
    } catch (error) {
      console.error("Speech error:", error);
      toast.error("Could not read text aloud");
    } finally {
      setIsReading(false);
    }
  };

  const adjustTextSize = () => {
    const sizes = ['normal', 'large', 'xl'];
    const currentIndex = sizes.indexOf(textSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const newSize = sizes[nextIndex];
    
    setTextSize(newSize);
    applyTextSize(newSize);
    toast.success(`Text size: ${newSize}`);
  };

  const toggleSimpleMode = () => {
    const newSimpleMode = !showSimpleMode;
    setShowSimpleMode(newSimpleMode);
    applySimpleMode(newSimpleMode);
    toast.success(newSimpleMode ? 'Simple mode enabled' : 'Simple mode disabled');
  };

  const accessibilityOptions = [
    {
      icon: isReading ? Loader2 : Volume2,
      title: 'Read Aloud',
      subtitle: 'Listen instead of reading',
      action: handleTextToSpeech,
      isActive: isReading,
      activeText: 'Stop Reading',
      inactiveText: 'Start Reading'
    },
    {
      icon: Eye,
      title: 'Text Size',
      subtitle: `Currently: ${textSize}`,
      action: adjustTextSize,
      isActive: textSize !== 'normal',
      activeText: 'Reset Size',
      inactiveText: 'Make Larger'
    },
    {
      icon: Zap,
      title: 'Simple Mode',
      subtitle: 'Remove extra details',
      action: toggleSimpleMode,
      isActive: showSimpleMode,
      activeText: 'Show All',
      inactiveText: 'Simplify'
    }
  ];

  return (
    <Card className="sticky top-4 bg-amber-50 border-amber-200 shadow-lg z-10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Brain-Friendly Options</span>
          </div>
          
          <div className="flex gap-1">
            {accessibilityOptions.map((option, index) => (
              <Button
                key={index}
                variant={option.isActive ? "default" : "outline"}
                size="sm"
                onClick={option.action}
                className={`gap-1 text-xs px-2 py-1 ${
                  option.isActive 
                    ? 'bg-amber-600 text-white hover:bg-amber-700' 
                    : 'border-amber-300 text-amber-700 hover:bg-amber-100'
                }`}
                title={option.subtitle}
              >
                <option.icon className={`h-3 w-3 ${option.title === 'Read Aloud' && isReading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline whitespace-nowrap">
                  {option.isActive ? option.activeText : option.inactiveText}
                </span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="mt-3 pt-3 border-t border-amber-200">
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <span>Reading progress:</span>
            <div className="flex-1 bg-amber-200 rounded-full h-1">
              <div className="bg-amber-500 h-1 rounded-full w-1/4"></div>
            </div>
            <span>25%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}