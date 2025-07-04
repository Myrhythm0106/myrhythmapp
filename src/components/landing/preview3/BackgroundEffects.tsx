
import React from "react";

export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Memory1st Visual Effects - Interconnected glowing nodes */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-70"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-teal-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-emerald-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-teal-300 rounded-full animate-pulse opacity-40" style={{animationDelay: '1.5s'}}></div>
      
      {/* Connecting memory trails */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="memoryTrail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#10B981', stopOpacity:0}} />
            <stop offset="50%" style={{stopColor:'#14B8A6', stopOpacity:0.4}} />
            <stop offset="100%" style={{stopColor:'#10B981', stopOpacity:0}} />
          </linearGradient>
        </defs>
        <path d="M 25% 25% Q 50% 15% 75% 35%" stroke="url(#memoryTrail)" strokeWidth="2" fill="none" className="animate-pulse" />
        <path d="M 35% 65% Q 55% 45% 80% 70%" stroke="url(#memoryTrail)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '0.7s'}} />
      </svg>
    </div>
  );
}
