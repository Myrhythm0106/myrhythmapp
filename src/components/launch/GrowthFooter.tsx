import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const growthMessages = [
  "Every small step builds momentum.",
  "Progress, not perfection.",
  "Your brain adapts and grows every day.",
  "Steady action creates new possibilities.",
  "You are not walking this path alone.",
  "Consistency outperforms intensity.",
  "A clearer rhythm, day by day.",
  "Your journey is uniquely yours.",
];

export function GrowthFooter() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % growthMessages.length);
        setIsVisible(true);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-brain-health-100 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-brain-health-400" strokeWidth={1.75} />
        <p
          className={`text-sm text-brain-health-600 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {growthMessages[currentMessage]}
        </p>
      </div>
    </div>
  );
}
