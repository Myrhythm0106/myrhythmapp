
import React from "react";

interface RhythmStep {
  letter: string;
  word: string;
  description: string;
  memoryFocus: string;
}

interface MyRhythmFrameworkDisplayProps {
  currentStepIndex: number;
}

export function MyRhythmFrameworkDisplay({ currentStepIndex }: MyRhythmFrameworkDisplayProps) {
  // MYRHYTHM Framework - Memory-First Approach
  const rhythmSteps: RhythmStep[] = [
    { 
      letter: 'M', 
      word: 'MINDSET', 
      description: 'Memory-Aware Mindset Foundation',
      memoryFocus: 'Build cognitive confidence & self-awareness'
    },
    { 
      letter: 'Y', 
      word: 'Yield', 
      description: 'Acknowledge Your Current Reality',
      memoryFocus: 'Honor where you are without judgment'
    },
    { 
      letter: 'R', 
      word: 'Restore', 
      description: 'Rhythm-Based Energy Management',
      memoryFocus: 'Work with your brain\'s natural patterns'
    },
    { 
      letter: 'H', 
      word: 'Harness', 
      description: 'Hope Through Community Support',
      memoryFocus: 'Build your empowering support network'
    },
    { 
      letter: 'Y', 
      word: 'Yield', 
      description: 'Your Small Victories Matter',
      memoryFocus: 'Celebrate every step of progress'
    },
    { 
      letter: 'T', 
      word: 'Take', 
      description: 'Transform Your Daily Experience',
      memoryFocus: 'Reclaim agency with memory anchors'
    },
    { 
      letter: 'H', 
      word: 'Heal', 
      description: 'Hope, Growth & Cognitive Strengthening',
      memoryFocus: 'Gentle exercises that build resilience'
    },
    { 
      letter: 'M', 
      word: 'Multiply', 
      description: 'Mission to Share & Inspire',
      memoryFocus: 'Become an advocate for your journey'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50/80 via-blue-50/60 to-teal-50/70 p-8 rounded-2xl border border-purple-200/30">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">The MYRHYTHM Framework</h2>
      <p className="text-gray-700 text-sm mb-6">Each phase empowers your memory recovery and builds unstoppable momentum</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
        {rhythmSteps.map((step, index) => (
          <div key={`${step.letter}-${index}`} className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 ${
              currentStepIndex === index
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 ring-4 ring-indigo-300' 
                : 'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}>
              {step.letter}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">{step.word}</span>
            <span className="text-xs text-gray-500 text-center mt-1">{step.description}</span>
            <span className="text-xs text-indigo-600 text-center mt-1 font-medium">{step.memoryFocus}</span>
            {currentStepIndex === index && (
              <div className="mt-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                You are here
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          <span className="font-semibold text-indigo-800">Memory-First Approach</span>
        </div>
        <p className="text-indigo-700 text-sm">
          Your personalized journey follows the MyRhythm framework with memory wellness as the foundation. 
          Each phase builds both your memory capabilities and other life skills that support cognitive wellness.
        </p>
      </div>
    </div>
  );
}
