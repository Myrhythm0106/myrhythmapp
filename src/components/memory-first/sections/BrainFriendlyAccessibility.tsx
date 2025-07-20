import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, Eye, Zap, Pause, RotateCcw, BookOpen } from 'lucide-react';

export function BrainFriendlyAccessibility() {
  const [textSize, setTextSize] = useState('normal');
  const [isReading, setIsReading] = useState(false);
  const [showSimpleMode, setShowSimpleMode] = useState(false);

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const text = document.body.innerText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower for memory challenges
      utterance.pitch = 1;
      
      if (isReading) {
        speechSynthesis.cancel();
        setIsReading(false);
      } else {
        speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    }
  };

  const adjustTextSize = () => {
    const sizes = ['normal', 'large', 'xl'];
    const currentIndex = sizes.indexOf(textSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const newSize = sizes[nextIndex];
    
    setTextSize(newSize);
    
    // Apply text size to document
    const sizeClasses = {
      normal: 'text-base',
      large: 'text-lg', 
      xl: 'text-xl'
    };
    
    document.documentElement.className = sizeClasses[newSize as keyof typeof sizeClasses];
  };

  const toggleSimpleMode = () => {
    setShowSimpleMode(!showSimpleMode);
    // This would trigger a simplified view of content
    document.body.classList.toggle('simple-mode', !showSimpleMode);
  };

  const accessibilityOptions = [
    {
      icon: Volume2,
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
          
          <div className="flex gap-2">
            {accessibilityOptions.map((option, index) => (
              <Button
                key={index}
                variant={option.isActive ? "default" : "outline"}
                size="sm"
                onClick={option.action}
                className={`gap-2 ${
                  option.isActive 
                    ? 'bg-amber-600 text-white hover:bg-amber-700' 
                    : 'border-amber-300 text-amber-700 hover:bg-amber-100'
                }`}
                title={option.subtitle}
              >
                <option.icon className="h-4 w-4" />
                <span className="hidden sm:inline">
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