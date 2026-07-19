import React, { useState } from 'react';
import { X, CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface LaunchRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newDate: Date, newTime: string) => void | Promise<void>;
  eventTitle: string;
  initialDate: Date;
  initialTime: string;
}

export function LaunchRescheduleModal({
  isOpen,
  onClose,
  onSubmit,
  eventTitle,
  initialDate,
  initialTime,
}: LaunchRescheduleModalProps) {
  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState(initialTime);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(date, time);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Reschedule</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-5 truncate">{eventTitle}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              New date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border border-gray-200 text-left text-base bg-white',
                    'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500'
                  )}
                >
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              New time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 text-white font-semibold rounded-xl hover:from-brand-emerald-600 hover:to-brand-teal-600 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Reschedule'}
          </button>
        </form>
      </div>
    </div>
  );
}
