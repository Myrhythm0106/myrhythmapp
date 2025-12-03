import React from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchCommitmentBanner } from './LaunchCommitmentBanner';
import { cn } from '@/lib/utils';
import { isSameMonth } from 'date-fns';

interface LaunchYearViewProps {
  date: Date;
  onMonthSelect: (date: Date) => void;
  className?: string;
  yearVision?: string;
  onYearVisionChange?: (vision: string) => void;
}

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export function LaunchYearView({ 
  date, 
  onMonthSelect, 
  className = '',
  yearVision,
  onYearVisionChange
}: LaunchYearViewProps) {
  const today = new Date();
  const currentYear = date.getFullYear();

  return (
    <div className={cn("space-y-4", className)}>
      <LaunchCommitmentBanner 
        scope="year" 
        date={date}
        inheritedVision={yearVision}
        onVisionChange={onYearVisionChange}
      />

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{currentYear}</h2>
        <p className="text-sm text-brand-teal-600">Your year of growth</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {months.map((monthName, index) => {
          const monthDate = new Date(currentYear, index, 1);
          const isCurrentMonth = isSameMonth(monthDate, today);
          const isPastMonth = monthDate < new Date(today.getFullYear(), today.getMonth(), 1);
          
          return (
            <button
              key={monthName}
              onClick={() => onMonthSelect(monthDate)}
              className={cn(
                "p-4 rounded-xl text-center transition-all",
                isCurrentMonth 
                  ? "bg-gradient-to-br from-brand-emerald-500 to-brand-teal-500 text-white shadow-lg"
                  : isPastMonth
                    ? "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    : "bg-white border border-gray-100 hover:border-brand-emerald-300 hover:shadow-md text-gray-900"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                isCurrentMonth ? "text-white" : ""
              )}>
                {monthName.slice(0, 3)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Year Summary Card */}
      <LaunchCard className="p-4 mt-4">
        <h3 className="font-semibold text-gray-900 mb-2">🎯 Year at a Glance</h3>
        <p className="text-sm text-gray-600">
          Set your yearly vision above, then break it down into monthly focuses. 
          Each month brings you closer to your goals.
        </p>
        {yearVision && (
          <div className="mt-3 p-3 bg-brand-emerald-50 rounded-lg">
            <p className="text-sm text-brand-emerald-700">
              <span className="font-medium">Your Vision:</span> {yearVision}
            </p>
            <p className="text-xs text-brand-emerald-600 mt-1">
              This flows down to guide your months, weeks, and days
            </p>
          </div>
        )}
      </LaunchCard>
    </div>
  );
}
