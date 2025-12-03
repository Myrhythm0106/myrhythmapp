import React, { useState, useEffect } from 'react';
import { Star, Zap, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type ViewScope = 'day' | 'week' | 'month' | 'year';

interface LaunchCommitmentBannerProps {
  scope: ViewScope;
  date?: Date;
  className?: string;
  inheritedVision?: string;
  inheritedFocus?: string;
  onVisionChange?: (vision: string) => void;
}

const scopeTitles: Record<ViewScope, (date: Date) => string> = {
  day: () => "Today's Focus",
  week: () => "This Week's Focus",
  month: (date) => `${date.toLocaleDateString('en-US', { month: 'long' })} Focus`,
  year: (date) => `${date.getFullYear()} Vision`,
};

const empoweringMessages = [
  "Your rhythm, your rules",
  "Every small step builds momentum",
  "Progress, not perfection",
  "You're building something meaningful",
  "One moment at a time",
  "Trust your journey",
  "Small wins add up",
  "You've got this",
];

const commitmentTypes = [
  { 
    key: 'core', 
    label: 'Core', 
    sublabel: 'This is non-negotiable',
    icon: Star, 
    iconColor: 'text-amber-300',
  },
  { 
    key: 'key', 
    label: 'Key', 
    sublabel: 'Important to me',
    icon: Zap, 
    iconColor: 'text-white',
  },
  { 
    key: 'stretch', 
    label: 'Stretch', 
    sublabel: 'When energy allows',
    icon: Target, 
    iconColor: 'text-brand-teal-200',
  },
];

export function LaunchCommitmentBanner({ 
  scope, 
  date = new Date(),
  className = '',
  inheritedVision,
  inheritedFocus,
  onVisionChange
}: LaunchCommitmentBannerProps) {
  const [commitments, setCommitments] = useState<Record<string, string>>({
    core: '',
    key: '',
    stretch: '',
  });
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % empoweringMessages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const title = scopeTitles[scope](date);

  const handleCommitmentChange = (key: string, value: string) => {
    setCommitments(prev => ({ ...prev, [key]: value }));
  };

  // For year view, show vision input instead of commitments
  if (scope === 'year') {
    return (
      <div className={cn(
        "rounded-2xl overflow-hidden shadow-lg",
        "bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500",
        className
      )}>
        <div className="p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <p className="text-white/80 text-sm mb-4">
            What do you want this year to be about?
          </p>
          <Input
            value={inheritedVision || ''}
            onChange={(e) => onVisionChange?.(e.target.value)}
            placeholder="My year of abundance & growth..."
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
          />
          <p className="text-white/70 text-xs mt-3 italic">
            ✨ {empoweringMessages[currentMessageIndex]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl overflow-hidden shadow-lg",
      "bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500",
      className
    )}>
      <div className="p-6 text-white">
        {/* Inherited context breadcrumb */}
        {(inheritedVision || inheritedFocus) && (
          <div className="text-white/70 text-xs mb-2 flex items-center gap-2">
            {inheritedVision && <span>🌟 {inheritedVision}</span>}
            {inheritedVision && inheritedFocus && <span>→</span>}
            {inheritedFocus && <span>{inheritedFocus}</span>}
          </div>
        )}

        {/* Header with empowering message */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <span className="text-white/80 text-sm italic">
            ✨ {empoweringMessages[currentMessageIndex]}
          </span>
        </div>

        {/* 3-column commitment grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {commitmentTypes.map((type) => (
            <div key={type.key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <type.icon className={cn("h-4 w-4", type.iconColor)} />
                <span>{type.label}</span>
                <span className="text-white/60 text-xs">- {type.sublabel}</span>
              </label>
              <Input
                value={commitments[type.key]}
                onChange={(e) => handleCommitmentChange(type.key, e.target.value)}
                placeholder={type.sublabel}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
