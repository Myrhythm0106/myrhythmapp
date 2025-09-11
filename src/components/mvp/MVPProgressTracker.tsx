import React from 'react';
import { Check, Circle, Brain, Shield, ClipboardList, Crown } from 'lucide-react';

interface MVPProgressTrackerProps {
  currentStep: 'payment' | 'privacy' | 'assessment' | 'results';
}

const steps = [
  { 
    id: 'payment', 
    label: 'Choose Plan', 
    icon: Crown,
    description: '7-day trial'
  },
  { 
    id: 'privacy', 
    label: 'Privacy & Consent', 
    icon: Shield,
    description: 'Data protection'
  },
  { 
    id: 'assessment', 
    label: 'Assessment', 
    icon: ClipboardList,
    description: 'Cognitive profile'
  },
  { 
    id: 'results', 
    label: 'Your Results', 
    icon: Brain,
    description: 'Personalized insights'
  }
];

export function MVPProgressTracker({ currentStep }: MVPProgressTrackerProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-brain-health-100 py-4">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white' 
                      : isCurrent 
                      ? 'bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <IconComponent className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${
                      isCompleted || isCurrent ? 'text-brain-health-700' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </div>
                    <div className={`text-xs ${
                      isCompleted || isCurrent ? 'text-brain-health-500' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-4 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-memory-emerald-500 to-brain-health-500' 
                      : 'bg-gray-200'
                    }
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}