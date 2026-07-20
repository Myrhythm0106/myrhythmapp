import React, { useMemo, useState } from 'react';
import { X, Calendar, Clock, ChevronDown, ChevronRight, Users, Bell, Mail, Plus, Repeat } from 'lucide-react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useSupportCircle } from '@/hooks/use-support-circle';

export type ReminderLevel = 'gentle' | 'steady' | 'strong' | 'custom' | 'off';
export type RecurrencePattern = 'none' | 'daily' | 'weekdays' | 'weekly' | 'fortnightly' | 'monthly' | 'yearly';

const RECURRENCE_OPTIONS: { key: RecurrencePattern; label: string; blurb: string }[] = [
  { key: 'none', label: 'One-off', blurb: 'Just this once.' },
  { key: 'daily', label: 'Every day', blurb: 'Repeats each day.' },
  { key: 'weekdays', label: 'Weekdays', blurb: 'Monday to Friday.' },
  { key: 'weekly', label: 'Weekly', blurb: 'Same day every week.' },
  { key: 'fortnightly', label: 'Fortnightly', blurb: 'Every 2 weeks.' },
  { key: 'monthly', label: 'Monthly', blurb: 'Same date each month.' },
  { key: 'yearly', label: 'Yearly', blurb: 'Same date each year.' },
];

export const REMINDER_PRESETS: Record<Exclude<ReminderLevel, 'custom' | 'off'>, { label: string; blurb: string; offsets: number[] }> = {
  gentle: { label: 'Gentle', blurb: 'A single nudge, close to the time.', offsets: [15] },
  steady: { label: 'Steady', blurb: 'A heads-up the day before, plus one on the day.', offsets: [1440, 30] },
  strong: { label: 'Strong', blurb: 'Extra reminders so nothing slips.', offsets: [1440, 120, 30, 10] },
};

const FINE_TUNE_OFFSETS: { minutes: number; label: string }[] = [
  { minutes: 10080, label: '1 week before' },
  { minutes: 2880, label: '2 days before' },
  { minutes: 1440, label: '1 day before' },
  { minutes: 120, label: '2 hours before' },
  { minutes: 60, label: '1 hour before' },
  { minutes: 30, label: '30 min before' },
  { minutes: 15, label: '15 min before' },
  { minutes: 10, label: '10 min before' },
  { minutes: 5, label: '5 min before' },
];

interface LaunchAddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: {
    title: string;
    time: string;
    type: string;
    watchers: string[];
    reminder_level: ReminderLevel;
    reminder_offsets_minutes: number[];
    recurrence_pattern: RecurrencePattern;
    recurrence_interval: number;
    recurrence_end_date?: string | null;
  }) => void;
  selectedDate?: Date;
}

const eventTypes = [
  { key: 'appointment', label: 'Appointment', color: 'bg-blue-500' },
  { key: 'meeting', label: 'Meeting', color: 'bg-indigo-500' },
  { key: 'routine', label: 'Routine', color: 'bg-brand-emerald-500' },
  { key: 'medical', label: 'Medical', color: 'bg-red-500' },
  { key: 'activity', label: 'Activity', color: 'bg-purple-500' },
  { key: 'social', label: 'Social', color: 'bg-amber-500' },
  { key: 'rest', label: 'Rest', color: 'bg-brand-teal-500' },
];

const emailSchema = z.string().trim().toLowerCase().email();

function formatOffsetShort(mins: number) {
  if (mins % 1440 === 0) return `${mins / 1440}d`;
  if (mins % 60 === 0) return `${mins / 60}h`;
  return `${mins}m`;
}

export function LaunchAddEventModal({
  isOpen,
  onClose,
  onAdd,
  selectedDate = new Date(),
}: LaunchAddEventModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState('routine');

  // Invitees
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailDraft, setEmailDraft] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const { members } = useSupportCircle();

  // Reminders
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderLevel, setReminderLevel] = useState<ReminderLevel>('steady');
  const [customOffsets, setCustomOffsets] = useState<number[]>([1440, 30]);
  const [fineTuneOpen, setFineTuneOpen] = useState(false);

  // Frequency / recurrence
  const [freqOpen, setFreqOpen] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<string>('');

  const activeOffsets = useMemo(() => {
    if (reminderLevel === 'off') return [];
    if (reminderLevel === 'custom') return [...customOffsets].sort((a, b) => b - a);
    return REMINDER_PRESETS[reminderLevel].offsets;
  }, [reminderLevel, customOffsets]);

  const inviteeCount = selectedCircle.length + emails.length;

  if (!isOpen) return null;

  const addEmail = () => {
    const parsed = emailSchema.safeParse(emailDraft);
    if (!parsed.success) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (emails.includes(parsed.data)) {
      setEmailError('Already added');
      return;
    }
    if (emails.length >= 5) {
      setEmailError('Up to 5 email invites');
      return;
    }
    setEmails([...emails, parsed.data]);
    setEmailDraft('');
    setEmailError(null);
  };

  const toggleFineTuneOffset = (mins: number) => {
    setReminderLevel('custom');
    setCustomOffsets((prev) =>
      prev.includes(mins) ? prev.filter((m) => m !== mins) : [...prev, mins]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const watchers = [
      ...selectedCircle.map((id) => `circle:${id}`),
      ...emails.map((em) => `email:${em}`),
    ];
    onAdd({
      title: title.trim(),
      time,
      type,
      watchers,
      reminder_level: reminderLevel,
      reminder_offsets_minutes: activeOffsets,
    });
    // reset
    setTitle('');
    setTime('09:00');
    setType('routine');
    setSelectedCircle([]);
    setEmails([]);
    setEmailDraft('');
    setInviteOpen(false);
    setReminderOpen(false);
    setReminderLevel('steady');
    setCustomOffsets([1440, 30]);
    onClose();
  };

  const reminderSummary =
    reminderLevel === 'off'
      ? 'Off'
      : reminderLevel === 'custom'
      ? `Custom · ${activeOffsets.map(formatOffsetShort).join(', ') || 'none'}`
      : `${REMINDER_PRESETS[reminderLevel].label}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <Calendar className="h-4 w-4" />
            <span>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((eventType) => (
                <button
                  key={eventType.key}
                  type="button"
                  onClick={() => setType(eventType.key)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    type === eventType.key
                      ? `${eventType.color} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {eventType.label}
                </button>
              ))}
            </div>
          </div>

          {/* Invite reveal */}
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setInviteOpen((v) => !v)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Users className="h-4 w-4 text-gray-500" />
                Invite someone
                {inviteeCount > 0 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-brand-emerald-50 text-brand-emerald-700 px-2 py-0.5 text-xs font-semibold">
                    {inviteeCount} added
                  </span>
                )}
              </span>
              {inviteOpen ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {inviteOpen && (
              <div className="mt-3 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    From your Support Circle
                  </div>
                  {members.length === 0 ? (
                    <a
                      href="/launch/support-circle"
                      className="text-sm text-brand-emerald-600 hover:underline"
                    >
                      Add someone to your Support Circle →
                    </a>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {members.map((m) => {
                        const active = selectedCircle.includes(m.id);
                        return (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() =>
                              setSelectedCircle((prev) =>
                                prev.includes(m.id)
                                  ? prev.filter((id) => id !== m.id)
                                  : [...prev, m.id]
                              )
                            }
                            className={cn(
                              'px-3 py-2 rounded-full text-sm border transition-all',
                              active
                                ? 'bg-brand-emerald-500 text-white border-brand-emerald-500'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {m.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Or invite by email
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={emailDraft}
                        onChange={(e) => {
                          setEmailDraft(e.target.value);
                          setEmailError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addEmail();
                          }
                        }}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addEmail}
                      className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 inline-flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-xs text-red-600 mt-1">{emailError}</p>
                  )}
                  {emails.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {emails.map((em) => (
                        <span
                          key={em}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                        >
                          {em}
                          <button
                            type="button"
                            onClick={() => setEmails(emails.filter((e) => e !== em))}
                            className="hover:text-red-500"
                            aria-label={`Remove ${em}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reminder reveal */}
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setReminderOpen((v) => !v)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Bell className="h-4 w-4 text-gray-500" />
                Remind me
                <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 text-amber-800 px-2 py-0.5 text-xs font-semibold">
                  {reminderSummary}
                </span>
              </span>
              {reminderOpen ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {reminderOpen && (
              <div className="mt-3 space-y-4">
                <p className="text-sm text-gray-600">
                  Pick what feels right today — you can change it anytime.
                </p>
                <div className="grid gap-2">
                  {(['gentle', 'steady', 'strong'] as const).map((lvl) => {
                    const preset = REMINDER_PRESETS[lvl];
                    const active = reminderLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setReminderLevel(lvl)}
                        className={cn(
                          'min-h-[56px] w-full text-left rounded-xl border px-4 py-3 transition-all',
                          active
                            ? 'border-brand-emerald-500 bg-brand-emerald-50 ring-2 ring-brand-emerald-200'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">{preset.label}</span>
                          <span className="text-xs text-gray-500">
                            {preset.offsets.map(formatOffsetShort).join(' · ')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">{preset.blurb}</div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setFineTuneOpen((v) => !v)}
                  className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
                >
                  {fineTuneOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Fine-tune
                </button>

                {fineTuneOpen && (
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-600 mb-2">
                      Pick your own reminder times.
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {FINE_TUNE_OFFSETS.map((o) => {
                        const active =
                          reminderLevel === 'custom' && customOffsets.includes(o.minutes);
                        return (
                          <button
                            key={o.minutes}
                            type="button"
                            onClick={() => toggleFineTuneOffset(o.minutes)}
                            className={cn(
                              'px-3 py-1.5 rounded-full text-xs border transition-all',
                              active
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setReminderLevel('off')}
                      className={cn(
                        'mt-3 text-xs',
                        reminderLevel === 'off'
                          ? 'text-red-600 font-semibold'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      No reminders for this event
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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
