
import React from "react";

interface RhythmStep {
  letter: string;
  word: string;
  description: string;
}

interface MyRhythmFrameworkDisplayProps {
  currentStepIndex: number;
}

export function MyRhythmFrameworkDisplay({ currentStepIndex }: MyRhythmFrameworkDisplayProps) {
  // All 8 steps of MYRHYTHM
  const rhythmSteps: RhythmStep[] = [
    { letter: 'M', word: 'Mindset', description: 'Moment of Impact' },
    { letter: 'Y', word: 'Yearning', description: 'Yield to the Fog' },
    { letter: 'R', word: 'Routine', description: 'Reckon with Reality' },
    { letter: 'H', word: 'Health', description: 'Harness Support' },
    { letter: 'Y', word: 'Yield', description: 'Yield to Progress' },
    { letter: 'T', word: 'Thrive', description: 'Take Back Control' },
    { letter: 'H', word: 'Heal', description: 'Heal Forward' },
    { letter: 'M', word: 'Multiply', description: 'Multiply the Mission' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">The MyRhythm Framework</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
        {rhythmSteps.map((step, index) => (
          <div key={`${step.letter}-${index}`} className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 ${
              currentStepIndex === index
                ? 'bg-green-600 ring-4 ring-green-300' 
                : 'bg-gray-400'
            }`}>
              {step.letter}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">{step.word}</span>
            <span className="text-xs text-gray-500 text-center mt-1">{step.description}</span>
            {currentStepIndex === index && (
              <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                You are here
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-6 text-gray-600 text-sm">
        Your personalized journey follows the MyRhythm framework, designed to support your unique path to recovery and growth.
      </p>
    </div>
  );
}
