import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const growthMessages = [
  "Every small step builds momentum 🌱",
  "You're stronger than you think 💪",
  "Progress, not perfection ✨",
  "Your brain adapts and grows every day 🧠",
  "Celebrate every victory, big or small 🎉",
  "You're not walking this path alone 💙",
  "Each action creates new possibilities 🚀",
  "Your journey is uniquely yours 🛤️",
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
    <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-gradient-to-r from-brand-emerald-500/10 via-brand-teal-500/10 to-brand-blue-500/10 border-t border-brand-emerald-200/30 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-emerald-500" />
        <p 
          className={`text-sm text-brand-emerald-700 font-medium transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {growthMessages[currentMessage]}
        </p>
      </div>
    </div>
  );
}
