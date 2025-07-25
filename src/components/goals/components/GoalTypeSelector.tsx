
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

import { Home, Briefcase, DollarSign, GraduationCap } from 'lucide-react';

export const GOAL_TYPES: GoalType[] = [
  {
    id: 'health',
    title: 'Health & Wellness',
    icon: <Heart className="h-6 w-6" />,
    color: 'from-brain-health-400 to-brain-health-500',
    description: 'Physical and mental wellbeing',
    examples: ['Exercise 3x weekly', 'Therapy sessions', 'Healthy eating habits'],
    measurementPrompts: ['How many sessions?', 'What frequency?', 'Daily/weekly targets?']
  },
  {
    id: 'career',
    title: 'Career & Work',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'from-clarity-teal-400 to-clarity-teal-500',
    description: 'Professional development and work goals',
    examples: ['Complete certification', 'Network with colleagues', 'Job search activities'],
    measurementPrompts: ['Skills to learn?', 'Applications to submit?', 'Meetings to attend?']
  },
  {
    id: 'home',
    title: 'Home & Living',
    icon: <Home className="h-6 w-6" />,
    color: 'from-memory-emerald-400 to-memory-emerald-500',
    description: 'Household management and living space',
    examples: ['Organize one room weekly', 'Establish cleaning routine', 'Home improvements'],
    measurementPrompts: ['Rooms to organize?', 'Tasks per week?', 'Projects to complete?']
  },
  {
    id: 'family',
    title: 'Family & Relationships',
    icon: <Users className="h-6 w-6" />,
    color: 'from-purple-400 to-purple-500',
    description: 'Building stronger connections',
    examples: ['Weekly family dinner', 'Call parents daily', 'Plan date nights'],
    measurementPrompts: ['How often?', 'Who to connect with?', 'Activities to share?']
  },
  {
    id: 'personal',
    title: 'Personal Growth',
    icon: <GraduationCap className="h-6 w-6" />,
    color: 'from-energy-amber-400 to-energy-amber-500',
    description: 'Learning and self-improvement',
    examples: ['Read 30 min daily', 'Practice meditation', 'Learn new skill'],
    measurementPrompts: ['Books to read?', 'Skills to develop?', 'Habits to build?']
  },
  {
    id: 'financial',
    title: 'Financial Goals',
    icon: <DollarSign className="h-6 w-6" />,
    color: 'from-success-green-400 to-success-green-500',
    description: 'Money management and financial security',
    examples: ['Save $500 monthly', 'Track expenses', 'Build emergency fund'],
    measurementPrompts: ['Amount to save?', 'Budget targets?', 'Financial milestones?']
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
