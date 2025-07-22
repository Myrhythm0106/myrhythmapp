
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ReadingProgressBarProps {
  className?: string;
  sections?: Array<{
    id: string;
    title: string;
    element?: HTMLElement;
  }>;
}

export function ReadingProgressBar({ className, sections = [] }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState<string>('');

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(Math.max(scrollPercent, 0), 100));

      // Update current section based on scroll position
      if (sections.length > 0) {
        const currentSectionElement = sections.find(section => {
          if (section.element) {
            const rect = section.element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
          }
          return false;
        });
        
        if (currentSectionElement) {
          setCurrentSection(currentSectionElement.id);
        }
      }
    };

    // Get saved progress from localStorage
    const savedProgress = localStorage.getItem('reading-progress');
    if (savedProgress) {
      const { position, timestamp } = JSON.parse(savedProgress);
      // Only restore if saved within last 24 hours
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          window.scrollTo({ top: position, behavior: 'smooth' });
        }, 100);
      }
    }

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    return () => {
      // Save progress when component unmounts
      localStorage.setItem('reading-progress', JSON.stringify({
        position: window.scrollY,
        timestamp: Date.now()
      }));
      window.removeEventListener('scroll', updateProgress);
    };
  }, [sections]);

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollTop = (clickPercent / 100) * docHeight;
    
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40",
      className
    )}>
      <div className="relative h-2 cursor-pointer group" onClick={handleProgressClick}>
        <Progress 
          value={progress} 
          className="h-2 rounded-none"
          indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          showPulse={progress > 0 && progress < 100}
        />
        
        {/* Hover indicator */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute top-0 h-2 w-1 bg-foreground/60 rounded-full transform -translate-x-0.5 pointer-events-none"
               style={{ left: `${progress}%` }} />
        </div>
        
        {/* Section markers */}
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="absolute top-0 h-2 w-0.5 bg-foreground/30"
            style={{ left: `${((index + 1) / sections.length) * 100}%` }}
            title={section.title}
          />
        ))}
      </div>
      
      {/* Current section indicator */}
      {currentSection && (
        <div className="px-4 py-1 text-xs text-muted-foreground bg-background/60">
          Reading: {sections.find(s => s.id === currentSection)?.title}
        </div>
      )}
    </div>
  );
}
