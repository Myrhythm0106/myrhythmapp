import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchAddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: { title: string; time: string; type: string }) => void;
  selectedDate?: Date;
}

const eventTypes = [
  { key: 'appointment', label: 'Appointment', color: 'bg-blue-500' },
  { key: 'routine', label: 'Routine', color: 'bg-brand-emerald-500' },
  { key: 'medical', label: 'Medical', color: 'bg-red-500' },
  { key: 'activity', label: 'Activity', color: 'bg-purple-500' },
  { key: 'social', label: 'Social', color: 'bg-amber-500' },
  { key: 'rest', label: 'Rest', color: 'bg-brand-teal-500' },
];

export function LaunchAddEventModal({ 
  isOpen, 
  onClose, 
  onAdd,
  selectedDate = new Date()
}: LaunchAddEventModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState('routine');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title: title.trim(), time, type });
      setTitle('');
      setTime('09:00');
      setType('routine');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Event</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date Display */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <Calendar className="h-4 w-4" />
            <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's happening?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Doctor appointment"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 focus:border-transparent text-base"
              autoFocus
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 focus:border-transparent text-base"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((eventType) => (
                <button
                  key={eventType.key}
                  type="button"
                  onClick={() => setType(eventType.key)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    type === eventType.key
                      ? `${eventType.color} text-white`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {eventType.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-3 bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 text-white font-semibold rounded-xl hover:from-brand-emerald-600 hover:to-brand-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}
