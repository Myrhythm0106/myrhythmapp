
import React from "react";
import { ExpandableMyRhythmCards } from "@/components/shared/ExpandableMyRhythmCards";

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
  const rhythmSteps = [
    { 
      letter: 'M', 
      word: 'MINDSET', 
      phase: 'Memory-Aware Mindset Foundation',
      description: 'Build cognitive confidence and self-awareness as your foundation for growth and empowerment.',
      memoryFocus: 'Build cognitive confidence & self-awareness',
      icon: '🧠'
    },
    { 
      letter: 'Y', 
      word: 'Reflect', 
      phase: 'Acknowledge Your Current Reality',
      description: 'Honor where you are in your recovery journey without judgment—this is your starting point for transformation.',
      memoryFocus: 'Honor where you are without judgment',
      icon: '🌟'
    },
    { 
      letter: 'R', 
      word: 'Restore', 
      phase: 'Rhythm-Based Energy Management',
      description: 'Map your cognitive peaks and rest periods to work with your brain\'s natural energy patterns.',
      memoryFocus: 'Work with your brain\'s natural patterns',
      icon: '⚡'
    },
    { 
      letter: 'H', 
      word: 'Harness', 
      phase: 'Hope Through Community Support',
      description: 'Build your circle of care and maintain independence—support systems that empower, not enable.',
      memoryFocus: 'Build your empowering support network',
      icon: '💪'
    },
    { 
      letter: 'Y', 
      word: 'Celebrate', 
      phase: 'Your Small Victories Matter',
      description: 'Celebrate every step forward, no matter how small—progress tracking that builds unstoppable confidence.',
      memoryFocus: 'Celebrate every step of progress',
      icon: '🎉'
    },
    { 
      letter: 'T', 
      word: 'Take', 
      phase: 'Transform Your Daily Experience',
      description: 'Reclaim agency in your life through reliable memory anchors and external systems you can trust.',
      memoryFocus: 'Reclaim agency with memory anchors',
      icon: '✨'
    },
    { 
      letter: 'H', 
      word: 'Heal', 
      phase: 'Hope, Growth & Cognitive Strengthening',
      description: 'Gentle brain exercises that build resilience and recovery-focused cognitive enhancement.',
      memoryFocus: 'Gentle exercises that build resilience',
      icon: '🌈'
    },
    { 
      letter: 'M', 
      word: 'Multiply', 
      phase: 'Mission to Share & Inspire',
      description: 'Transform your experience into hope for others—become an advocate and share your inspiring journey.',
      memoryFocus: 'Become an advocate for your journey',
      icon: '🌍'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50/80 via-blue-50/60 to-teal-50/70 p-8 rounded-2xl border border-purple-200/30">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">The MYRHYTHM Framework</h2>
      <p className="text-gray-700 text-sm mb-6">Each phase empowers your memory recovery and builds unstoppable momentum</p>
      
      <ExpandableMyRhythmCards 
        steps={rhythmSteps}
        variant="onboarding"
        showExpandAll={false}
        className="mb-6"
      />
      
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
