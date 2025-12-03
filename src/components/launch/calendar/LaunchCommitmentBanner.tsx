import React, { useState } from 'react';
import { Star, Zap, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewScope = 'day' | 'week' | 'month' | 'year';

interface LaunchCommitmentBannerProps {
  scope: ViewScope;
  date?: Date;
  className?: string;
}

const scopeTitles: Record<ViewScope, (date: Date) => string> = {
  day: () => "Today's Purpose",
  week: () => "This Week's Mission",
  month: (date) => `My ${date.toLocaleDateString('en-US', { month: 'long' })} Focus`,
  year: (date) => `My ${date.getFullYear()} Vision`,
};

const commitmentTypes = [
  { 
    key: 'core', 
    label: 'My Core Commitment', 
    icon: Star, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    hint: 'This is non-negotiable'
  },
  { 
    key: 'key', 
    label: 'My Key Commitment', 
    icon: Zap, 
    color: 'text-brand-emerald-500',
    bgColor: 'bg-brand-emerald-50',
    borderColor: 'border-brand-emerald-200',
    hint: 'Important to me'
  },
  { 
    key: 'stretch', 
    label: 'My Stretch Commitment', 
    icon: Target, 
    color: 'text-brand-teal-500',
    bgColor: 'bg-brand-teal-50',
    borderColor: 'border-brand-teal-200',
    hint: 'When energy allows'
  },
];

export function LaunchCommitmentBanner({ 
  scope, 
  date = new Date(),
  className = '' 
}: LaunchCommitmentBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [commitments, setCommitments] = useState<Record<string, string>>({
    core: '',
    key: '',
    stretch: '',
  });

  const title = scopeTitles[scope](date);

  const handleCommitmentChange = (key: string, value: string) => {
    setCommitments(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-brand-emerald-50 to-brand-teal-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {commitmentTypes.map((type) => (
            <div 
              key={type.key}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                type.bgColor,
                commitments[type.key] ? "opacity-100" : "opacity-50"
              )}
            >
              <type.icon className={cn("h-3 w-3", type.color)} />
              <span className="truncate max-w-[100px]">
                {commitments[type.key] || type.hint}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Expanded Form */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {commitmentTypes.map((type) => (
            <div 
              key={type.key}
              className={cn("rounded-lg p-3 border", type.bgColor, type.borderColor)}
            >
              <div className="flex items-center gap-2 mb-2">
                <type.icon className={cn("h-4 w-4", type.color)} />
                <span className="font-medium text-sm text-gray-800">{type.label}</span>
              </div>
              <input
                type="text"
                value={commitments[type.key]}
                onChange={(e) => handleCommitmentChange(type.key, e.target.value)}
                placeholder={type.hint}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 focus:border-transparent bg-white"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
