import React from "react";

interface NeuralNetworkBackgroundProps {
  opacity?: number;
  className?: string;
}

export function NeuralNetworkBackground({ opacity = 0.08, className = "" }: NeuralNetworkBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient definitions for neural pathways */}
          <linearGradient id="tealPathway" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--clarity-teal-500))" stopOpacity={opacity} />
            <stop offset="50%" stopColor="hsl(var(--clarity-teal-400))" stopOpacity={opacity * 1.5} />
            <stop offset="100%" stopColor="hsl(var(--clarity-teal-600))" stopOpacity={opacity} />
          </linearGradient>
          
          <linearGradient id="purpleNode" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--purple-400))" stopOpacity={opacity * 2} />
            <stop offset="100%" stopColor="hsl(var(--purple-600))" stopOpacity={opacity * 1.5} />
          </linearGradient>

          <radialGradient id="connectionGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--clarity-teal-400))" stopOpacity={opacity * 3} />
            <stop offset="100%" stopColor="hsl(var(--clarity-teal-600))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Neural pathway network */}
        <g className="animate-pulse" style={{ animationDuration: '4s' }}>
          {/* Main flowing pathways */}
          <path
            d="M50,150 Q300,100 550,200 Q800,300 1150,250"
            stroke="url(#tealPathway)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          
          <path
            d="M100,400 Q400,350 700,450 Q950,500 1100,400"
            stroke="url(#tealPathway)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="3,7"
          />

          <path
            d="M200,600 Q500,550 800,650 Q1000,700 1150,600"
            stroke="url(#tealPathway)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="8,4"
          />

          {/* Connecting branches */}
          <path
            d="M300,100 Q350,250 400,350"
            stroke="url(#tealPathway)"
            strokeWidth="1"
            fill="none"
            opacity={opacity * 2}
          />

          <path
            d="M700,450 Q750,300 800,200"
            stroke="url(#tealPathway)"
            strokeWidth="1"
            fill="none"
            opacity={opacity * 2}
          />

          <path
            d="M500,550 Q600,400 700,300"
            stroke="url(#tealPathway)"
            strokeWidth="1"
            fill="none"
            opacity={opacity * 2}
          />
        </g>

        {/* Connection nodes */}
        <g>
          {/* Primary nodes */}
          <circle cx="300" cy="100" r="8" fill="url(#purpleNode)" />
          <circle cx="550" cy="200" r="6" fill="url(#purpleNode)" />
          <circle cx="800" cy="300" r="7" fill="url(#purpleNode)" />
          <circle cx="400" cy="350" r="5" fill="url(#purpleNode)" />
          <circle cx="700" cy="450" r="6" fill="url(#purpleNode)" />
          <circle cx="500" cy="550" r="4" fill="url(#purpleNode)" />

          {/* Secondary nodes with glow */}
          <circle cx="150" cy="200" r="12" fill="url(#connectionGlow)" />
          <circle cx="150" cy="200" r="4" fill="url(#purpleNode)" />
          
          <circle cx="950" cy="350" r="10" fill="url(#connectionGlow)" />
          <circle cx="950" cy="350" r="3" fill="url(#purpleNode)" />
          
          <circle cx="600" cy="500" r="8" fill="url(#connectionGlow)" />
          <circle cx="600" cy="500" r="2" fill="url(#purpleNode)" />
        </g>

        {/* Subtle brain-inspired organic curves */}
        <g opacity={opacity * 0.5}>
          <path
            d="M50,50 Q200,80 350,50 Q500,20 650,50 Q800,80 950,50 Q1100,20 1150,50"
            stroke="hsl(var(--clarity-teal-300))"
            strokeWidth="0.5"
            fill="none"
          />
          
          <path
            d="M50,750 Q200,720 350,750 Q500,780 650,750 Q800,720 950,750 Q1100,780 1150,750"
            stroke="hsl(var(--clarity-teal-300))"
            strokeWidth="0.5"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}