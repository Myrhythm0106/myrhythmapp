import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const messages = [
  "Your rhythm, your rules.",
  "Every small step builds momentum.",
  "Progress, not perfection.",
  "You're building something meaningful.",
  "One moment at a time.",
  "Trust your journey.",
  "Small wins add up.",
  "You've got this.",
];

interface LaunchEmpoweringMessageProps {
  className?: string;
  interval?: number;
}

export function LaunchEmpoweringMessage({ 
  className = '', 
  interval = 8000 
}: LaunchEmpoweringMessageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div 
      className={cn(
        "text-sm text-brand-teal-600 italic text-center transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {messages[currentIndex]}
    </div>
  );
}
