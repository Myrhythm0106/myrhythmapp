import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { CompletionCelebration } from '@/components/launch/CompletionCelebration';
import { Mic, Square, Play, Pause, Save, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type RecordingState = 'idle' | 'recording' | 'paused' | 'reviewing';

export default function LaunchMemoryBridge() {
  const [state, setState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [notifySupport, setNotifySupport] = useState(true);

  const recentRecordings = [
    { title: 'Doctor appointment', date: 'Today, 10:30 AM', actions: 3 },
    { title: 'Family call', date: 'Yesterday', actions: 2 },
    { title: 'Therapy session', date: '2 days ago', actions: 5 },
  ];

  const handleStartRecording = () => {
    setState('recording');
    // Would start actual recording here
  };

  const handleStopRecording = () => {
    setState('reviewing');
    // Would stop recording and process
  };

  const handleSave = () => {
    setShowCelebration(true);
    // Would save recording and extract actions
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LaunchLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Memory Bridge</h1>
        <p className="text-gray-600">Record conversations, we'll extract the actions</p>
      </div>

      {/* Recording Interface */}
      <LaunchCard variant="featured" className="mb-6 text-center py-10">
        {state === 'idle' && (
          <>
            <button
              onClick={handleStartRecording}
              className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-brand-emerald-500 to-brand-teal-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow active:scale-95"
            >
              <Mic className="h-10 w-10 text-white" />
            </button>
            <p className="text-lg font-semibold text-gray-900 mb-1">Tap to Record</p>
            <p className="text-sm text-gray-600">We'll listen and find the action items</p>
          </>
        )}

        {state === 'recording' && (
          <>
            <div className="w-24 h-24 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-8 h-8 bg-white rounded-sm" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{formatDuration(duration)}</p>
            <p className="text-sm text-red-600 font-medium mb-4">Recording...</p>
            <LaunchButton onClick={handleStopRecording} variant="outline">
              <Square className="h-5 w-5" />
              Stop Recording
            </LaunchButton>
          </>
        )}

        {state === 'reviewing' && (
          <>
            <div className="w-24 h-24 mx-auto mb-4 bg-brand-emerald-100 rounded-full flex items-center justify-center">
              <Play className="h-10 w-10 text-brand-emerald-600 ml-1" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-4">Recording Complete!</p>
            
            {/* Notify Support Circle Toggle */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setNotifySupport(!notifySupport)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  notifySupport
                    ? "bg-brand-emerald-100 text-brand-emerald-700"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                <Users className="h-4 w-4" />
                Notify Support Circle
              </button>
            </div>

            <LaunchButton onClick={handleSave} className="w-full max-w-xs">
              <Save className="h-5 w-5" />
              Save & Extract Actions
            </LaunchButton>
          </>
        )}
      </LaunchCard>

      {/* Recent Recordings */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Recent Recordings</h2>
        <button className="text-sm text-brand-emerald-600 font-medium">View all</button>
      </div>

      <div className="space-y-3 mb-24">
        {recentRecordings.map((recording, i) => (
          <LaunchCard key={i} variant="glass" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-emerald-100 flex items-center justify-center">
                  <Mic className="h-5 w-5 text-brand-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{recording.title}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recording.date}
                  </p>
                </div>
              </div>
              <span className="text-sm bg-brand-emerald-100 text-brand-emerald-700 px-2 py-1 rounded-full">
                {recording.actions} actions
              </span>
            </div>
          </LaunchCard>
        ))}
      </div>

      {/* Celebration Modal */}
      <CompletionCelebration
        isOpen={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          setState('idle');
        }}
        actionTitle="Memory Bridge recording"
        onNotifySupport={notifySupport ? () => console.log('Notifying support') : undefined}
        streakCount={3}
      />
    </LaunchLayout>
  );
}
