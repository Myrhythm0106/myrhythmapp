
import React, { useState, useEffect } from "react";

export function BeforeAfterBrainStates() {
  const [isTransformed, setIsTransformed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransformed(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-emerald-50/40 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Minimal Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            The Transformation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch your mental landscape evolve from chaos to clarity
          </p>
        </div>

        {/* Split Screen Visual */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Before State - Mental Chaos */}
          <div className={`relative bg-white rounded-3xl p-12 shadow-xl border-2 transition-all duration-1000 ${!isTransformed ? 'border-red-200 shadow-red-100' : 'border-gray-200'}`}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-red-600 mb-2">Mental Chaos</h3>
              <p className="text-gray-600">Scattered thoughts, lost memories</p>
            </div>
            
            {/* Chaotic Dots */}
            <div className="relative h-48 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-3 h-3 bg-red-400 rounded-full transition-all duration-2000 ${!isTransformed ? 'animate-ping' : 'opacity-20'}`}
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
              
              {/* Scattered connection lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30">
                {[...Array(8)].map((_, i) => (
                  <line
                    key={i}
                    x1={`${Math.random() * 80 + 10}%`}
                    y1={`${Math.random() * 80 + 10}%`}
                    x2={`${Math.random() * 80 + 10}%`}
                    y2={`${Math.random() * 80 + 10}%`}
                    stroke={isTransformed ? "#ef4444" : "#fca5a5"}
                    strokeWidth="1"
                    className="transition-all duration-1000"
                    strokeDasharray="5,5"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* After State - Clear Pathways */}
          <div className={`relative bg-white rounded-3xl p-12 shadow-xl border-2 transition-all duration-1000 ${isTransformed ? 'border-emerald-200 shadow-emerald-100' : 'border-gray-200'}`}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-emerald-600 mb-2">Clear Pathways</h3>
              <p className="text-gray-600">Organized thoughts, preserved wisdom</p>
            </div>
            
            {/* Organized Pattern */}
            <div className="relative h-48 overflow-hidden">
              {/* Central hub */}
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500 rounded-full transition-all duration-1000 ${isTransformed ? 'animate-pulse scale-100' : 'scale-0'}`}></div>
              
              {/* Organized nodes in a pattern */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const radius = 60;
                const x = 50 + (radius * Math.cos(angle)) / 3.2;
                const y = 50 + (radius * Math.sin(angle)) / 3.2;
                
                return (
                  <div
                    key={i}
                    className={`absolute w-4 h-4 bg-emerald-400 rounded-full transition-all duration-1000 ${isTransformed ? 'animate-pulse scale-100' : 'scale-0'}`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                );
              })}
              
              {/* Organized connection lines */}
              <svg className="absolute inset-0 w-full h-full">
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45) * Math.PI / 180;
                  const radius = 60;
                  const x = 50 + (radius * Math.cos(angle)) / 3.2;
                  const y = 50 + (radius * Math.sin(angle)) / 3.2;
                  
                  return (
                    <line
                      key={i}
                      x1="50%"
                      y1="50%"
                      x2={`${x}%`}
                      y2={`${y}%`}
                      stroke={isTransformed ? "#10b981" : "transparent"}
                      strokeWidth="2"
                      className="transition-all duration-1000"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Transformation Arrow */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200 shadow-lg">
            <span className="text-lg font-medium text-gray-700">Every 7 Days</span>
            <div className="w-8 h-0.5 bg-gradient-to-r from-red-400 to-emerald-500"></div>
            <span className="text-lg font-medium text-emerald-600">Lasting Change</span>
          </div>
        </div>
      </div>
    </section>
  );
}
