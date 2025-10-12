import React from "react";

export function EnhancedBackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced gradient overlay layers - vibrant brain health colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-neural-purple-100/30 via-neural-magenta-50/25 to-clarity-teal-100/30" />
      <div className="absolute inset-0 bg-gradient-to-tr from-neural-blue-50/20 via-brain-health-50/15 to-brand-orange-50/20" />
      
      {/* Vibrant floating orbs with empowering brain health colors */}
      <div className="absolute top-[15%] left-[20%] w-3 h-3 bg-gradient-to-br from-neural-purple-500/50 to-neural-magenta-500/50 rounded-full animate-pulse opacity-70" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-[25%] right-[25%] w-2 h-2 bg-gradient-to-br from-neural-magenta-400/45 to-brand-orange-400/45 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.8s'}}></div>
      <div className="absolute bottom-[30%] left-[30%] w-4 h-4 bg-gradient-to-br from-clarity-teal-500/40 to-neural-blue-500/40 rounded-full animate-pulse opacity-55" style={{animationDelay: '1.2s'}}></div>
      <div className="absolute top-[45%] right-[15%] w-2.5 h-2.5 bg-gradient-to-br from-brain-health-500/50 to-neural-purple-500/50 rounded-full animate-pulse opacity-65" style={{animationDelay: '1.8s'}}></div>
      <div className="absolute bottom-[20%] right-[40%] w-3.5 h-3.5 bg-gradient-to-br from-neural-blue-400/35 to-clarity-teal-400/35 rounded-full animate-pulse opacity-50" style={{animationDelay: '2.4s'}}></div>
      <div className="absolute top-[60%] left-[15%] w-2 h-2 bg-gradient-to-br from-brand-orange-400/40 to-neural-magenta-400/40 rounded-full animate-pulse opacity-55" style={{animationDelay: '3s'}}></div>
      
      {/* Subtle neural network pathways */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neuralPath1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#8B5CF6', stopOpacity:0}} />
            <stop offset="50%" style={{stopColor:'#3B82F6', stopOpacity:0.3}} />
            <stop offset="100%" style={{stopColor:'#14B8A6', stopOpacity:0}} />
          </linearGradient>
          <linearGradient id="neuralPath2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:'#14B8A6', stopOpacity:0}} />
            <stop offset="50%" style={{stopColor:'#10B981', stopOpacity:0.25}} />
            <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:0}} />
          </linearGradient>
        </defs>
        <path d="M 20% 15% Q 45% 10% 75% 25%" stroke="url(#neuralPath1)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '0.5s'}} />
        <path d="M 30% 70% Q 60% 50% 85% 75%" stroke="url(#neuralPath2)" strokeWidth="1" fill="none" className="animate-pulse" style={{animationDelay: '1.3s'}} />
        <path d="M 15% 60% Q 40% 45% 65% 35%" stroke="url(#neuralPath1)" strokeWidth="1.2" fill="none" className="animate-pulse" style={{animationDelay: '2.1s'}} />
      </svg>

      {/* Glass morphism light effects - vibrant accents */}
      <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-br from-neural-magenta-400/8 to-neural-purple-400/8 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-clarity-teal-400/8 to-brain-health-500/8 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-gradient-to-br from-brand-orange-400/6 to-neural-blue-400/6 rounded-full blur-xl"></div>
    </div>
  );
}