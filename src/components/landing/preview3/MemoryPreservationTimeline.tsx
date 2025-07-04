
import React, { useState } from "react";
import { Heart, Brain, Star, Mountain } from "lucide-react";

export function MemoryPreservationTimeline() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: 0,
      title: "Lost",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: Heart,
      color: "from-gray-400 to-gray-500",
      description: "When everything felt scattered and overwhelming"
    },
    {
      id: 1,
      title: "Found MyRhythm",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: Brain,
      color: "from-blue-400 to-blue-500",
      description: "The moment structure brought clarity"
    },
    {
      id: 2,
      title: "Growing",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: Star,
      color: "from-emerald-400 to-emerald-500",
      description: "Every day building stronger foundations"
    },
    {
      id: 3,
      title: "Thriving",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: Mountain,
      color: "from-teal-400 to-emerald-500",
      description: "Living fully, remembering everything that matters"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-emerald-50/30 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Minimal Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            A Journey Remembered
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four milestones that changed everything
          </p>
        </div>

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Memory Trail Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-emerald-300 to-emerald-500 rounded-full transform -translate-y-1/2 z-0">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
            ></div>
          </div>

          {/* Stage Markers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index <= activeStage;
              
              return (
                <div
                  key={stage.id}
                  className="text-center cursor-pointer group"
                  onClick={() => setActiveStage(index)}
                  onMouseEnter={() => setActiveStage(index)}
                >
                  {/* Stage Image */}
                  <div className={`relative mb-6 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-95 opacity-70'}`}>
                    <div 
                      className="w-40 h-40 mx-auto rounded-full bg-cover bg-center shadow-2xl border-4 border-white relative overflow-hidden"
                      style={{ backgroundImage: `url('${stage.image}')` }}
                    >
                      {/* Overlay for better text visibility */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-60`}></div>
                      
                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Memory trail effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full">
                          <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          <div className="absolute bottom-3 left-3 w-2 h-2 bg-emerald-200 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute top-1/2 left-2 w-2 h-2 bg-teal-200 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        </div>
                      )}
                    </div>

                    {/* Timeline Node */}
                    <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-500 ${isActive ? `bg-gradient-to-r ${stage.color}` : 'bg-gray-300'}`}></div>
                  </div>

                  {/* Stage Info */}
                  <div className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{stage.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-32 mx-auto">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspiring Message */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200 shadow-lg">
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
              <strong className="text-emerald-600">"Your current chapter is not your final story."</strong>
            </p>
            <p className="text-lg text-gray-600">
              Every milestone preserved, every lesson remembered, every step forward celebrated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
