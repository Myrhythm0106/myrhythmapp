import React from "react";

interface BrainIllustrationProps {
  className?: string;
  opacity?: number;
}

export function BrainIllustration({ className = "", opacity = 0.15 }: BrainIllustrationProps) {
  return (
    <svg
      className={className}
      style={{ opacity }}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--clarity-teal-300))" />
          <stop offset="50%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--brain-health-400))" />
        </linearGradient>
        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--brain-health-200))" />
          <stop offset="100%" stopColor="hsl(var(--clarity-teal-200))" />
        </linearGradient>
      </defs>
      
      {/* Main brain outline */}
      <path
        d="M50 80c0-20 15-35 35-35s35 15 35 35c10-5 20 0 25 10s0 20-10 25c5 10 0 20-10 25s-20 5-30 0c-15 10-35 10-50 0s-20-15-15-25c-10-5-15-15-10-25s15-15 25-10z"
        fill="url(#brainGradient)"
        stroke="url(#brainGradient)"
        strokeWidth="1"
      />
      
      {/* Brain folds and details */}
      <path
        d="M70 65c10 5 20 5 30 0M75 85c8 3 15 3 23 0M80 105c6 2 12 2 18 0"
        stroke="url(#neuralGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Neural connections */}
      <circle cx="65" cy="70" r="2" fill="url(#neuralGradient)" />
      <circle cx="85" cy="75" r="1.5" fill="url(#neuralGradient)" />
      <circle cx="105" cy="85" r="2" fill="url(#neuralGradient)" />
      <circle cx="95" cy="100" r="1.5" fill="url(#neuralGradient)" />
      
      {/* Connecting lines */}
      <path
        d="M65 70L85 75M85 75L105 85M105 85L95 100"
        stroke="url(#neuralGradient)"
        strokeWidth="0.8"
        strokeDasharray="2,2"
        opacity="0.6"
      />
    </svg>
  );
}