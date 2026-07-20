import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, Sparkles, ArrowRight } from 'lucide-react';
import { usePlanningDay, usePlanningScope } from '@/hooks/usePlanningScope';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * A gentle card that appears on the user's chosen planning day
 * (default Sunday). Nudges them to plan the coming week.
 */
export function LaunchWeeklyPlanningCard() {
  const { dayOfWeek, loading: dayLoading } = usePlanningDay();
  const today = new Date();
  const preferred = dayOfWeek ?? 0;
  const isPlanningDay = today.getDay() === preferred;

  const { row, loading } = usePlanningScope('week', today, dayOfWeek);

  if (dayLoading || loading || !isPlanningDay) return null;

  const hasPlan = Boolean(row?.core || row?.key || row?.stretch);

  return (
    <div className="rounded-3xl border border-brand-emerald-200 bg-gradient-to-br from-brand-emerald-50 to-brand-teal-50 p-5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-2xl bg-white/70">
          <CalendarRange className="h-5 w-5 text-brand-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">
            It's {dayNames[preferred]} — plan your week
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">
            {hasPlan
              ? "You've started this week's rhythm. Want to refine it?"
              : 'A gentle 3-minute check-in. One Core, one Key, one Stretch.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/launch/calendar?view=week"
              className="inline-flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-xl bg-brand-emerald-500 text-white hover:bg-brand-emerald-600 min-h-[44px]"
            >
              {hasPlan ? 'Review my week' : 'Plan my week'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/launch/calendar?view=week&assist=1"
              className="inline-flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-xl bg-white/80 text-brand-emerald-700 border border-brand-emerald-200 hover:bg-white min-h-[44px]"
            >
              <Sparkles className="h-4 w-4" /> Help me plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
