
import React from "react";
import { Brain, Zap } from "lucide-react";

export function LEAPNeuralNetwork() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50/30 relative overflow-hidden">
      {/* Background Neural Network Effects */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="memoryTrail1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#10B981', stopOpacity:0}} />
              <stop offset="50%" style={{stopColor:'#14B8A6', stopOpacity:0.6}} />
              <stop offset="100%" style={{stopColor:'#10B981', stopOpacity:0}} />
            </linearGradient>
          </defs>
          {/* Horizontal connecting neural pathways */}
          <path d="M 15% 50% L 85% 50%" stroke="url(#memoryTrail1)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M 20% 45% Q 50% 30% 80% 45%" stroke="url(#memoryTrail1)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '1s'}} />
          <path d="M 20% 55% Q 50% 70% 80% 55%" stroke="url(#memoryTrail1)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '2s'}} />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Minimal Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Brain's New Operating System
          </h2>
        </div>

        {/* Always Horizontal Flow of Three Core Nodes */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 lg:gap-16 max-w-6xl mx-auto">
          
          {/* LEAP Node */}
          <div className="text-center group flex-1 min-w-0">
            <div className="relative mb-4 sm:mb-8">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto animate-pulse"></div>
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-white" />
              </div>
              {/* Floating memory nodes */}
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-6 sm:h-6 bg-emerald-300 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-2 h-2 sm:w-4 sm:h-4 bg-teal-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.7s'}}></div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 mb-2 sm:mb-3">LEAP</h3>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-2">
              Live your authentic, empowered journey forward.
            </p>
          </div>

          {/* Connecting Arrow */}
          <div className="text-2xl sm:text-3xl lg:text-4xl text-emerald-500 animate-pulse flex-shrink-0">
            →
          </div>

          {/* REMEMBER Node */}
          <div className="text-center group flex-1 min-w-0">
            <div className="relative mb-4 sm:mb-8">
              <div className="absolute inset-0 bg-teal-400/20 rounded-full w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-white" />
                {/* Neural pathway glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-300/40 to-emerald-300/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <div className="absolute -top-1 -left-1 sm:-top-3 sm:-left-3 w-3 h-3 sm:w-5 sm:h-5 bg-teal-300 rounded-full animate-pulse opacity-80" style={{animationDelay: '1.2s'}}></div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-1 sm:-right-3 w-4 h-4 sm:w-7 sm:h-7 bg-emerald-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '1.8s'}}></div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-teal-600 mb-2 sm:mb-3">REMEMBER</h3>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-2">
              Every lesson learned becomes permanent strength.
            </p>
          </div>

          {/* Connecting Arrow */}
          <div className="text-2xl sm:text-3xl lg:text-4xl text-teal-500 animate-pulse flex-shrink-0" style={{animationDelay: '1s'}}>
            →
          </div>

          {/* THRIVE Node with Clear Transformation Visual */}
          <div className="text-center group flex-1 min-w-0">
            <div className="relative mb-4 sm:mb-8">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                
                {/* Clear 3-Stage Transformation: Caterpillar → Cocoon → Butterfly */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {/* Stage 1: Caterpillar */}
                  <div className="flex flex-col items-center animate-pulse">
                    <div className="text-base sm:text-lg lg:text-xl">🐛</div>
                  </div>
                  
                  {/* Transformation Arrow */}
                  <div className="text-white/60 text-xs sm:text-sm animate-pulse" style={{animationDelay: '0.5s'}}>
                    →
                  </div>
                  
                  {/* Stage 2: Cocoon */}
                  <div className="flex flex-col items-center animate-pulse" style={{animationDelay: '1s'}}>
                    <div className="text-base sm:text-lg lg:text-xl">🛡️</div>
                  </div>
                  
                  {/* Transformation Arrow */}
                  <div className="text-white/60 text-xs sm:text-sm animate-pulse" style={{animationDelay: '1.5s'}}>
                    →
                  </div>
                  
                  {/* Stage 3: Butterfly */}
                  <div className="flex flex-col items-center animate-pulse" style={{animationDelay: '2s'}}>
                    <div className="text-base sm:text-lg lg:text-xl">🦋</div>
                  </div>
                </div>
                
                {/* Transformation Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 via-teal-300/30 to-emerald-300/20 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
              </div>
              
              {/* Floating transformation nodes */}
              <div className="absolute -top-1 -right-2 sm:-top-1 sm:-right-4 w-4 h-4 sm:w-6 sm:h-6 bg-teal-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '2.3s'}}></div>
              <div className="absolute -bottom-1 -left-1 sm:-bottom-3 sm:-left-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 rounded-full animate-pulse opacity-70" style={{animationDelay: '2.8s'}}></div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3">THRIVE</h3>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-2">
              Unstoppable growth through your personal rhythm.
            </p>
          </div>
        </div>

        {/* Central Connection Visual */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 sm:px-8 py-3 sm:py-4 bg-white/60 backdrop-blur-sm rounded-full border border-emerald-200 shadow-lg">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-base sm:text-lg font-medium text-gray-700">Connected. Remembered. Sustained.</span>
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
