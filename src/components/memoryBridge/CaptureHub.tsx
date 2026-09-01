import React, { useState } from 'react';
import { ArrowRight, History, PenLine, Upload, ChevronDown, Play, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecordingEggTimer } from '@/components/memoryBridge/RecordingEggTimer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface VoiceRecording {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_path: string;
  duration_seconds?: number;
  transcription?: string;
  access_level: string;
  created_at: string;
}

interface AllowanceInfo {
  tier: string;
  limits: {
    label: string;
    perRecordingMinutes: number;
    monthlyMinutes: number;
  };
  period: 'week' | 'month';
  remainingMinutes: number;
}

interface CaptureHubProps {
  onStartCapture: () => void;
  onOpenMyRecords: () => void;
  onUploadClick: () => void;
  onOpenRecording: (recording: VoiceRecording) => void;
  isStarting: boolean;
  isUploading: boolean;
  isExtracting: boolean;
  micPermission: 'prompt' | 'granted' | 'denied' | 'unknown' | null;
  micBlockReason: 'frame' | 'insecure' | 'unsupported' | null;
  refreshMicStatus: () => void;
  outOfAllowance: boolean;
  allowance: AllowanceInfo;
  nextTierInfo?: { label: string; perRecordingMinutes: number; monthlyMinutes: number } | null;
  recentRecordings: VoiceRecording[];
  formatDuration: (seconds: number) => string;
}

export function CaptureHub({
  onStartCapture,
  onOpenMyRecords,
  onUploadClick,
  onOpenRecording,
  isStarting,
  isUploading,
  isExtracting,
  micPermission,
  micBlockReason,
  refreshMicStatus,
  outOfAllowance,
  allowance,
  nextTierInfo,
  recentRecordings,
  formatDuration,
}: CaptureHubProps) {
  const { user } = useAuth();
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const saveQuickNote = async () => {
    if (!user) {
      toast.error('Sign in to save a note.');
      return;
    }
    const title = noteTitle.trim() || `Note ${new Date().toLocaleTimeString()}`;
    const content = noteContent.trim();
    if (!content) {
      toast.error('Please write something first.');
      return;
    }
    setSavingNote(true);
    const { error } = await supabase.from('notes').insert({
      user_id: user.id,
      title,
      content,
      is_decision: false,
    });
    setSavingNote(false);
    if (error) {
      toast.error('Could not save the note. Please try again.');
      return;
    }
    toast.success('Note saved to My Records.');
    setNoteOpen(false);
    setNoteTitle('');
    setNoteContent('');
  };

  const formatRecordingDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return dateStr;
    }
  };

  const primaryDisabled = isStarting || outOfAllowance;

  return (
    <>
      <div className="relative w-full max-w-lg mx-auto mb-20">
        {/* Ambient glows */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-launch-teal/10 rounded-full blur-3xl motion-safe:animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-launch-gold/10 rounded-full blur-3xl" />

        {/* Main hub card */}
        <div className="relative overflow-hidden rounded-[32px] border border-launch-gold/20 bg-launch-ivory/80 backdrop-blur-2xl shadow-2xl shadow-[hsl(var(--launch-ink)/0.05)] p-6 md:p-8 text-center">
          {/* Brand mark */}
          <div className="flex justify-center mb-4">
            <div className="relative w-12 h-12 rounded-full border-2 border-[hsl(var(--launch-gold))] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-launch-ink shadow-lg shadow-[hsl(var(--launch-ink)/0.20)]" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-launch-ink leading-tight font-playfair">
            Memory Bridge
          </h1>

          <p className="text-base text-launch-ink/70 font-light max-w-xs mx-auto mb-6 leading-relaxed">
            Preserve my thoughts in perfect rhythm. Simple, clear, and kept for me.
          </p>

          {/* Primary action with teal breathing glow */}
          <div className="relative mb-4">
            <div
              className={cn(
                'absolute inset-0 rounded-2xl bg-launch-teal blur-xl opacity-40 motion-safe:animate-breathe',
                primaryDisabled && 'opacity-0'
              )}
              aria-hidden="true"
            />
            <button
              onClick={onStartCapture}
              disabled={primaryDisabled}
              aria-label="Start capture"
              className={cn(
                'relative w-full h-16 rounded-2xl flex items-center justify-center transition-all',
                'bg-launch-ink text-white text-lg font-medium tracking-wide',
                'hover:bg-[hsl(var(--launch-ink)/0.92)] hover:shadow-xl hover:shadow-[hsl(var(--launch-ink)/0.15)]',
                'active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              <span className="absolute inset-0 rounded-2xl border border-white/10" />
              {isStarting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Starting…
                </>
              ) : (
                <>
                  Start Capture
                  <div className="absolute right-5 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Allowance caption */}
          {outOfAllowance ? (
            <div className="mx-auto max-w-sm rounded-xl border border-launch-gold/40 bg-launch-gold/10 p-3 mb-4">
              <p className="text-sm font-medium text-launch-ink">
                I’ve used my {allowance.period === 'week' ? 'weekly' : 'monthly'} recording time.
              </p>
              {nextTierInfo && (
                <p className="mt-1 text-xs text-launch-ink/70">
                  {nextTierInfo.label} gives me {nextTierInfo.perRecordingMinutes} minutes per recording and {nextTierInfo.monthlyMinutes} minutes a month.
                </p>
              )}
            </div>
          ) : (
            <p className="mb-4 text-xs text-launch-ink/60">
              I can record up to {allowance.limits.perRecordingMinutes} minutes in one go —{' '}
              <span className="font-medium text-launch-moss">{allowance.remainingMinutes} minutes</span> left this {allowance.period}.
            </p>
          )}

          {/* Secondary actions (max 3 total: My Records, Quick Note, Upload) */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={onOpenMyRecords}
              className="group h-14 rounded-2xl border border-launch-gold/30 bg-launch-cream text-launch-ink font-medium hover:border-[hsl(var(--launch-gold))] transition-colors flex items-center justify-center gap-2"
            >
              <History className="h-4 w-4 text-launch-gold group-hover:scale-110 transition-transform" />
              My Records
            </button>
            <button
              onClick={() => setNoteOpen(true)}
              className="group h-14 rounded-2xl border border-launch-gold/30 bg-launch-cream text-launch-ink font-medium hover:border-[hsl(var(--launch-gold))] transition-colors flex items-center justify-center gap-2"
            >
              <PenLine className="h-4 w-4 text-launch-gold group-hover:scale-110 transition-transform" />
              Quick Note
            </button>
          </div>

          {/* Upload (kept accessible, but quiet) */}
          <button
            type="button"
            disabled={isUploading || isExtracting}
            onClick={onUploadClick}
            className="inline-flex w-full items-center justify-center gap-2 h-11 rounded-2xl border border-launch-gold/25 bg-white/60 px-4 text-sm font-medium text-launch-ink/80 hover:bg-launch-gold/10 transition-colors disabled:opacity-60"
          >
            {isUploading || isExtracting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading and finding next steps…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload a recording instead
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-launch-ink/50">
            Audio or video from my phone, a voice memo or a call recording.
          </p>

          {/* Quiet recent strip */}
          {recentRecordings.length > 0 && (
            <div className="mt-8 pt-6 border-t border-launch-gold/12">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-launch-gold mb-3 text-left">
                Recently captured
              </p>
              <div className="space-y-2">
                {recentRecordings.slice(0, 2).map((recording) => (
                  <button
                    key={recording.id}
                    onClick={() => onOpenRecording(recording)}
                    className="w-full flex items-center justify-between rounded-xl bg-white/60 border border-launch-gold/15 px-3 py-3 text-left hover:bg-white transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-launch-ink truncate">{recording.title}</p>
                      <p className="text-xs text-launch-ink/60 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRecordingDate(recording.created_at)}
                        {recording.duration_seconds && (
                          <span className="ml-2">• {formatDuration(recording.duration_seconds)}</span>
                        )}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-launch-ink flex items-center justify-center shrink-0">
                      <Play className="h-3.5 w-3.5 text-white ml-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progressive disclosure: Why it matters + facts */}
          <div className="mt-8 pt-6 border-t border-launch-gold/10">
            <Collapsible>
              <CollapsibleTrigger className="inline-flex items-center text-launch-teal hover:text-launch-teal/80 font-medium transition-colors text-sm uppercase tracking-widest">
                <span>Why it matters</span>
                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 text-left">
                <div className="rounded-2xl bg-launch-cream border border-launch-gold/15 p-4 space-y-3 text-sm text-launch-ink/80 leading-relaxed">
                  <p>
                    The conversations that matter most often arrive when energy is lowest — at the bedside, after a diagnosis, during a difficult call. Memory Bridge gives me a calm, dependable system to record, transcribe, and revisit those moments.
                  </p>
                  <ul className="space-y-2 text-launch-ink/70">
                    <li className="flex gap-2">
                      <span className="text-launch-gold">•</span>
                      <span>Working memory can drop by up to 30% under stress or fatigue — having a reliable record protects the plan I agreed on.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-launch-gold">•</span>
                      <span>Writing down commitments makes follow-through far more likely — the bridge turns talk into scheduled action.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-launch-gold">•</span>
                      <span>It is useful for everyone: appointments, meetings, family plans, creative ideas, or any conversation I may need to trust later.</span>
                    </li>
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Mic status — never let a tap disappear into silence */}
          <div className="mt-6 space-y-3">
            {micBlockReason === 'frame' && (
              <div className="mx-auto max-w-sm rounded-xl border border-launch-ember/30 bg-launch-ember/5 p-4 text-left">
                <p className="text-sm font-semibold text-launch-ink">
                  Your browser is blocking the microphone inside this preview frame.
                </p>
                <p className="mt-1 text-xs text-launch-ink/70">
                  Open the app in its own browser tab and recording will work normally.
                </p>
                <button
                  type="button"
                  onClick={() => window.open(window.location.href, '_blank', 'noopener')}
                  className="mt-3 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[hsl(var(--launch-ember))] px-4 text-sm font-semibold text-white"
                >
                  Open in a new tab
                </button>
              </div>
            )}
            {micBlockReason === 'insecure' && (
              <p className="mx-auto max-w-sm text-sm text-launch-ember">
                Recording needs a secure (https) address. Open the app over https and try again.
              </p>
            )}
            {micBlockReason === 'unsupported' && (
              <p className="mx-auto max-w-sm text-sm text-launch-ember">
                This browser can't record audio. Please use Chrome on a laptop, or Safari on iPhone.
              </p>
            )}
            {!micBlockReason && micPermission === 'denied' && (
              <div className="mx-auto max-w-sm rounded-xl border border-launch-ember/30 bg-launch-ember/5 p-4 text-left">
                <p className="text-sm font-semibold text-launch-ink">Microphone access is blocked.</p>
                <p className="mt-1 text-xs text-launch-ink/70">
                  In Chrome, click the icon at the left of the address bar, set Microphone to Allow, then reload this page.
                </p>
                <button
                  type="button"
                  onClick={() => void refreshMicStatus()}
                  className="mt-3 text-sm font-medium text-launch-ink underline underline-offset-4"
                >
                  Check again
                </button>
              </div>
            )}
            {!micBlockReason && micPermission === 'prompt' && (
              <p className="text-xs text-launch-ink/60">
                Your browser will ask permission for the microphone the first time you tap record.
              </p>
            )}
            {!micBlockReason && micPermission === 'granted' && (
              <p className="text-xs text-launch-moss">Microphone ready.</p>
            )}
            {!micBlockReason && micPermission === 'unknown' && (
              <p className="text-xs text-launch-ink/60">
                Your browser will ask permission for the microphone the first time you tap record.
              </p>
            )}
          </div>

          {/* Egg timer — compact */}
          <RecordingEggTimer compact className="mt-6" />
        </div>

        {/* Decorative outer ring */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[108%] h-[108%] border border-[hsl(var(--launch-gold)/0.05)] rounded-[44px]" aria-hidden="true" />
      </div>

      {/* Quick Note dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-md bg-[hsl(var(--launch-ivory))] border-launch-gold/20">
          <DialogHeader>
            <DialogTitle className="text-launch-ink font-display">Quick Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="What is this about?"
              className="w-full px-4 py-3 rounded-xl border border-launch-gold/30 bg-white text-launch-ink placeholder:text-launch-ink/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--launch-gold)/0.40)]"
            />
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Jot it down before I forget…"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-launch-gold/30 bg-white text-launch-ink placeholder:text-launch-ink/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--launch-gold)/0.40)] resize-none"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setNoteOpen(false)}
                className="rounded-xl border-launch-gold/30 text-launch-ink hover:bg-launch-gold/10"
              >
                Cancel
              </Button>
              <Button
                onClick={saveQuickNote}
                disabled={savingNote || !noteContent.trim()}
                className="rounded-xl bg-launch-ink text-white hover:bg-[hsl(var(--launch-ink)/0.92)]"
              >
                {savingNote ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
