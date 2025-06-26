
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
  // Memory-enhanced 8 steps of MYRHYTHM
  const rhythmSteps: RhythmStep[] = [
    { 
      letter: 'M', 
      word: 'Memory', 
      description: 'Moment of Impact',
      memoryFocus: 'Memory Baseline & Assessment'
    },
    { 
      letter: 'Y', 
      word: 'Yield', 
      description: 'Yield to the Fog',
      memoryFocus: 'Memory Fog Recognition'
    },
    { 
      letter: 'R', 
      word: 'Reality', 
      description: 'Reckon with Reality',
      memoryFocus: 'Memory Pattern Awareness'
    },
    { 
      letter: 'H', 
      word: 'Harness', 
      description: 'Harness Support',
      memoryFocus: 'Memory Support Systems'
    },
    { 
      letter: 'Y', 
      word: 'Yield', 
      description: 'Yield to Progress',
      memoryFocus: 'Memory Progress Tracking'
    },
    { 
      letter: 'T', 
      word: 'Take', 
      description: 'Take Back Control',
      memoryFocus: 'Memory Empowerment'
    },
    { 
      letter: 'H', 
      word: 'Heal', 
      description: 'Heal Forward',
      memoryFocus: 'Memory Growth & Mastery'
    },
    { 
      letter: 'M', 
      word: 'Multiply', 
      description: 'Multiply the Mission',
      memoryFocus: 'Memory Advocacy & Sharing'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">The Memory-First MyRhythm Framework</h2>
      <p className="text-gray-600 text-sm mb-6">Each phase strengthens your memory foundation while building other life skills</p>
      
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
