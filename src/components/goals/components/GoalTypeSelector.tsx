
import React from 'react';
import { Brain, Heart, Users, Activity } from 'lucide-react';

export interface GoalType {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  examples: string[];
  measurementPrompts: string[];
}

export const GOAL_TYPES: GoalType[] = [
  {
    id: 'cognitive',
    title: 'Brain Power',
    icon: <Brain className="h-6 w-6" />,
    color: 'from-memory-emerald-400 to-memory-emerald-500',
    description: 'Strengthen your thinking and memory',
    examples: ['Read 15 minutes daily', 'Complete memory games', 'Learn something new'],
    measurementPrompts: ['How many books/articles?', 'How many games completed?', 'Skills learned?']
  },
  {
    id: 'physical',
    title: 'Body Wellness',
    icon: <Activity className="h-6 w-6" />,
    color: 'from-clarity-teal-400 to-clarity-teal-500',
    description: 'Build strength and mobility',
    examples: ['Walk to the mailbox', 'Do stretching exercises', 'Take the stairs'],
    measurementPrompts: ['How far/long?', 'How many steps?', 'How many reps/sets?']
  },
  {
    id: 'emotional',
    title: 'Heart Health',
    icon: <Heart className="h-6 w-6" />,
    color: 'from-brain-health-400 to-brain-health-500',
    description: 'Nurture your emotional wellbeing',
    examples: ['Practice gratitude daily', 'Call a friend', 'Journal feelings'],
    measurementPrompts: ['Daily mood rating?', 'Journal entries per week?', 'Social interactions?']
  },
  {
    id: 'social',
    title: 'Connection',
    icon: <Users className="h-6 w-6" />,
    color: 'from-purple-400 to-purple-500',
    description: 'Build meaningful relationships',
    examples: ['Join a support group', 'Have coffee with family', 'Volunteer weekly'],
    measurementPrompts: ['How many calls/visits?', 'Activities attended?', 'New connections made?']
  }
];

interface GoalTypeSelectorProps {
  onTypeSelect: (type: GoalType) => void;
}

export function GoalTypeSelector({ onTypeSelect }: GoalTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-brain-lg font-semibold text-center">What area would you like to focus on?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GOAL_TYPES.map((type) => (
          <div
            key={type.id}
            onClick={() => onTypeSelect(type)}
            className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-memory-emerald-300 hover:bg-memory-emerald-50 transition-all group"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-white`}>
              {type.icon}
            </div>
            <h4 className="font-semibold text-brain-base mb-2">{type.title}</h4>
            <p className="text-brain-sm text-gray-600 mb-3">{type.description}</p>
            <div className="space-y-1">
              {type.examples.slice(0, 2).map((example, idx) => (
                <p key={idx} className="text-xs text-gray-500">• {example}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
