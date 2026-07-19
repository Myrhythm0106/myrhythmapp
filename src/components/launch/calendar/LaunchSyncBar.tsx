import React from 'react';
import { RefreshCw, Upload, Download, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import { format } from 'date-fns';

/**
 * Optional external-calendar sync bar. Renders nothing when the user has not
 * connected Google or Outlook — keeps the calendar page uncluttered for users
 * who choose not to enable this feature during MyRhythm setup.
 */
export function LaunchSyncBar() {
  const { integrations, isLoading, isSyncing, syncCalendar, pushUpcoming } =
    useCalendarIntegration();

  if (isLoading) return null;

  if (!integrations.length) {
    return (
      <div className="mb-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-600 flex items-center justify-between">
        <span>Optional: connect Google or Outlook to two-way sync your calendar.</span>
        <Link
          to="/launch/settings"
          className="inline-flex items-center gap-1 text-brand-emerald-700 font-medium hover:underline"
        >
          <Settings2 className="h-4 w-4" /> Connect
        </Link>
      </div>
    );
  }

  const lastSync = integrations
    .map((i) => i.last_sync)
    .filter(Boolean)
    .sort()
    .pop();

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 flex flex-wrap items-center justify-between gap-2">
      <div className="text-sm text-gray-700">
        <span className="font-medium">Connected:</span>{' '}
        {integrations.map((i) => i.provider).join(', ')}
        {lastSync && (
          <span className="ml-2 text-xs text-gray-500">
            · last sync {format(new Date(lastSync), 'MMM d, HH:mm')}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => pushUpcoming()}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-emerald-600 text-white text-sm font-medium hover:bg-brand-emerald-700 disabled:opacity-50"
        >
          <Upload className="h-4 w-4" /> Push upcoming
        </button>
        <button
          onClick={() => syncCalendar()}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Pull latest
        </button>
        {isSyncing && <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />}
      </div>
    </div>
  );
}
