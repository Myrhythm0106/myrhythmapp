import React from "react";

export function PremiumHeroVisual() {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-20">
      {/* Abstract brain visualization */}
      <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-2xl">
        {/* Central node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-brand-emerald-500 to-brand-teal-500 rounded-full blur-2xl opacity-60 animate-pulse" />
        
        {/* Connecting nodes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-brand-blue-400 to-brand-teal-400 rounded-full blur-xl opacity-40 animate-parallax-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-brand-orange-400 to-brand-emerald-400 rounded-full blur-xl opacity-40 animate-parallax-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-gradient-to-br from-brand-teal-400 to-brand-blue-400 rounded-full blur-xl opacity-40 animate-parallax-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-br from-brand-emerald-400 to-brand-orange-400 rounded-full blur-xl opacity-40 animate-parallax-float" style={{ animationDelay: '1.5s' }} />
        
        {/* Subtle pathways */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="path1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'hsl(var(--brand-emerald-500))', stopOpacity:0}} />
              <stop offset="50%" style={{stopColor:'hsl(var(--brand-teal-500))', stopOpacity:0.3}} />
              <stop offset="100%" style={{stopColor:'hsl(var(--brand-blue-500))', stopOpacity:0}} />
            </linearGradient>
          </defs>
          <path d="M 25% 25% Q 50% 30% 75% 35%" stroke="url(#path1)" strokeWidth="1" fill="none" />
          <path d="M 30% 70% Q 50% 60% 70% 65%" stroke="url(#path1)" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
}
