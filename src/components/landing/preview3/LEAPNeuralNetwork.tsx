
import React from "react";
import { Brain, Heart, Star } from "lucide-react";

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
          {/* Connecting neural pathways */}
          <path d="M 20% 50% Q 50% 20% 80% 50%" stroke="url(#memoryTrail1)" strokeWidth="2" fill="none" className="animate-pulse" />
          <path d="M 20% 50% Q 50% 80% 80% 50%" stroke="url(#memoryTrail1)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '1s'}} />
          <path d="M 50% 30% L 50% 70%" stroke="url(#memoryTrail1)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '2s'}} />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Minimal Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Brain's New Operating System
          </h2>
        </div>

        {/* Three Core Nodes */}
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          
          {/* LEAP Node */}
          <div className="text-center group">
            <div className="relative mb-8">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full w-32 h-32 mx-auto animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl font-bold text-white">L</span>
              </div>
              {/* Floating memory nodes */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-300 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-teal-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.7s'}}></div>
            </div>
            <h3 className="text-3xl font-bold text-emerald-600 mb-3">LEAP</h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Live your authentic, empowered journey forward.
            </p>
          </div>

          {/* REMEMBER Node */}
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-teal-400/20 rounded-full w-32 h-32 mx-auto animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-3 -left-3 w-5 h-5 bg-teal-300 rounded-full animate-pulse opacity-80" style={{animationDelay: '1.2s'}}></div>
              <div className="absolute -bottom-1 -right-3 w-7 h-7 bg-emerald-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '1.8s'}}></div>
            </div>
            <h3 className="text-3xl font-bold text-teal-600 mb-3">REMEMBER</h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Every lesson learned becomes permanent strength.
            </p>
          </div>

          {/* THRIVE Node */}
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full w-32 h-32 mx-auto animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Star className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-4 w-6 h-6 bg-teal-400 rounded-full animate-pulse opacity-60" style={{animationDelay: '2.3s'}}></div>
              <div className="absolute -bottom-3 -left-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse opacity-70" style={{animationDelay: '2.8s'}}></div>
            </div>
            <h3 className="text-3xl font-bold text-emerald-700 mb-3">THRIVE</h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Unstoppable growth through your personal rhythm.
            </p>
          </div>
        </div>

        {/* Central Connection Visual */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-emerald-200 shadow-lg">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-medium text-gray-700">Connected. Remembered. Sustained.</span>
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
