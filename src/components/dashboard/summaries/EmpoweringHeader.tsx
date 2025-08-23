import React from 'react';
import { cn } from '@/lib/utils';

interface EmpoweringHeaderProps {
  title: string;
  isCollapsed: boolean;
  className?: string;
}

const empoweringPhrases = {
  'Calendar & Timeline': {
    expanded: 'Your Time, Your Power',
    collapsed: 'Time Mastery',
    motivation: 'Every moment is an opportunity to thrive'
  },
  'Goals & Priorities': {
    expanded: 'Your Vision, Your Victory',
    collapsed: 'Dream Builder',
    motivation: 'Every goal achieved makes you stronger'
  },
  'Actions & Tasks': {
    expanded: 'Your Actions, Your Impact',
    collapsed: 'Progress Engine',
    motivation: 'Small steps lead to extraordinary outcomes'
  },
  'Reminders & Notifications': {
    expanded: 'Your Support, Your Success',
    collapsed: 'Success Signals',
    motivation: 'Gentle nudges toward greatness'
  },
  'Focus & Energy': {
    expanded: 'Your Energy, Your Excellence',
    collapsed: 'Peak Performance',
    motivation: 'Channel your energy into extraordinary results'
  },
  'Progress & Insights': {
    expanded: 'Your Growth, Your Glory',
    collapsed: 'Victory Analytics',
    motivation: 'Celebrate every step of your journey'
  }
};

export function EmpoweringHeader({ title, isCollapsed, className }: EmpoweringHeaderProps) {
  const phrases = empoweringPhrases[title as keyof typeof empoweringPhrases] || {
    expanded: title,
    collapsed: title,
    motivation: 'You are capable of amazing things'
  };

  return (
    <div className={cn('transition-all duration-300', className)}>
      <h3 className={cn(
        'font-bold transition-all duration-300',
        isCollapsed 
          ? 'text-sm bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent' 
          : 'text-lg therapeutic-accent'
      )}>
        {isCollapsed ? phrases.collapsed : phrases.expanded}
      </h3>
      
      {!isCollapsed && (
        <p className="text-xs text-muted-foreground opacity-75 italic mt-1 animate-fade-in">
          {phrases.motivation}
        </p>
      )}
    </div>
  );
}