import React, { useState } from 'react';
import { Mic, History, PenLine, Upload, ChevronDown, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CaptureHubProps {
  onStartCapture: () => void;
  onOpenMyRecords: () => void;
  onUploadClick: () => void;
  isStarting: boolean;
  isUploading: boolean;
  isExtracting: boolean;
  micPermission: 'prompt' | 'granted' | 'denied' | 'unknown' | null;
  micBlockReason: 'frame' | 'insecure' | 'unsupported' | null;
  refreshMicStatus: () => void;
  outOfAllowance: boolean;
  allowance: { period: 'week' | 'month'; remainingMinutes: number; limits: { perRecordingMinutes: number } };
  nextTierInfo?: { label: string; perRecordingMinutes: number; monthlyMinutes: number } | null;
  children?: React.ReactNode;
}

export function CaptureHub({ onStartCapture, onOpenMyRecords, onUploadClick, isStarting, isUploading, isExtracting, micPermission, micBlockReason, refreshMicStatus, outOfAllowance, allowance, nextTierInfo, children }: CaptureHubProps) {
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

  const primaryDisabled = isStarting || outOfAllowance;
  const [uploadOpen, setUploadOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <section className="border-b border-launch-gold/30 pb-8 mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-12">
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-launch-teal mb-3">Keep the conversation. Carry the plan forward.</p>
          <h1 className="font-instrument text-4xl md:text-5xl text-launch-ink-deep leading-tight mb-4">Memory Bridge</h1>
          <p className="text-lg text-launch-ink-deep leading-relaxed max-w-lg">Capture what matters, then check the next steps in your own time.</p>
        </div>
        <div className="w-full lg:w-auto lg:min-w-80">
          <Button variant="action" size="lg" onClick={onStartCapture} disabled={primaryDisabled} className="w-full rounded-md px-6 min-h-16 whitespace-normal">
            {isStarting ? <Loader2 className="animate-spin" /> : <Mic />}
            {isStarting ? 'Starting…' : 'Start recording now'}
            {!isStarting && <ArrowRight />}
          </Button>
          <p className="mt-3 text-base text-launch-ink-deep leading-relaxed" role="status">
            {outOfAllowance ? 'My recording time is used for this period.' : `${allowance.remainingMinutes} minutes left this ${allowance.period} · up to ${allowance.limits.perRecordingMinutes} minutes per recording`}
          </p>
          {outOfAllowance && nextTierInfo && <p className="mt-2 text-base text-launch-ink">{nextTierInfo.label}: {nextTierInfo.perRecordingMinutes} minutes per recording, {nextTierInfo.monthlyMinutes} minutes a month.</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Button variant="outline" onClick={() => setUploadOpen(!uploadOpen)} aria-expanded={uploadOpen} className="min-h-14 rounded-md border-launch-gold/50 text-launch-ink-deep hover:bg-launch-gold/10"><Upload />Upload<ChevronDown /></Button>
        <Button variant="outline" onClick={onOpenMyRecords} className="min-h-14 rounded-md border-launch-gold/50 text-launch-ink-deep hover:bg-launch-gold/10"><History />My Records</Button>
      </div>
      {uploadOpen && <div className="mt-6 border-t border-launch-gold/30 pt-5 space-y-4">
        <h2 className="text-lg font-semibold text-launch-ink-deep">Bring something I already have</h2>
        <Button variant="outline" onClick={onUploadClick} disabled={isUploading || isExtracting} className="min-h-14 rounded-md border-launch-gold/50 text-launch-ink-deep whitespace-normal h-auto">
          {isUploading || isExtracting ? <Loader2 className="animate-spin" /> : <Upload />}
          {isUploading || isExtracting ? 'Uploading and finding next steps…' : 'Upload audio or video'}
        </Button>
        <p className="text-base text-launch-ink">A voice memo, phone recording or video.</p>
        {children}
      </div>}
          {/* Mic status — never let a tap disappear into silence */}
          <div className="mt-6 space-y-3">
            {micBlockReason === 'frame' && (
              <div className="mx-auto max-w-sm rounded-xl border border-launch-ember/30 bg-launch-ember/5 p-4 text-left">
                <p className="text-base font-semibold text-launch-ink">
                  Your browser is blocking the microphone inside this preview frame.
                </p>
                <p className="mt-1 text-base text-launch-ink/70">
                  Open the app in its own browser tab and recording will work normally.
                </p>
                <Button variant="ghost"
                  type="button"
                  onClick={() => window.open(window.location.href, '_blank', 'noopener')}
                  className="mt-3 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[hsl(var(--launch-ember))] px-4 text-base font-semibold text-primary-foreground"
                >
                  Open in a new tab
                </Button>
              </div>
            )}
            {micBlockReason === 'insecure' && (
              <p className="mx-auto max-w-sm text-base text-launch-ember">
                Recording needs a secure (https) address. Open the app over https and try again.
              </p>
            )}
            {micBlockReason === 'unsupported' && (
              <p className="mx-auto max-w-sm text-base text-launch-ember">
                This browser can't record audio. Please use Chrome on a laptop, or Safari on iPhone.
              </p>
            )}
            {!micBlockReason && micPermission === 'denied' && (
              <div className="mx-auto max-w-sm rounded-xl border border-launch-ember/30 bg-launch-ember/5 p-4 text-left">
                <p className="text-base font-semibold text-launch-ink">Microphone access is blocked.</p>
                <p className="mt-1 text-base text-launch-ink/70">
                  In Chrome, click the icon at the left of the address bar, set Microphone to Allow, then reload this page.
                </p>
                <Button variant="ghost"
                  type="button"
                  onClick={() => void refreshMicStatus()}
                  className="mt-3 text-base font-medium text-launch-ink underline underline-offset-4"
                >
                  Check again
                </Button>
              </div>
            )}
            {!micBlockReason && micPermission === 'prompt' && (
              <p className="text-base text-launch-ink/60">
                Your browser will ask permission for the microphone the first time you tap record.
              </p>
            )}
            {!micBlockReason && micPermission === 'granted' && (
              <p className="text-base text-launch-moss">Microphone ready.</p>
            )}
            {!micBlockReason && micPermission === 'unknown' && (
              <p className="text-base text-launch-ink/60">
                Your browser will ask permission for the microphone the first time you tap record.
              </p>
            )}
          </div>

      <div className="mt-5">
        <Button variant="ghost" onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen} className="px-0 text-launch-ink-deep hover:bg-transparent hover:text-launch-teal"><ChevronDown />More options</Button>
        {moreOpen && <div className="pt-2"><Button variant="outline" onClick={() => setNoteOpen(true)} className="min-h-14 rounded-md border-launch-gold/50 text-launch-ink-deep"><PenLine />Write a quick note</Button></div>}
      </div>
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="bg-launch-ivory border-launch-gold/30 font-worksans">
          <DialogHeader><DialogTitle className="text-launch-ink-deep text-xl">Quick Note</DialogTitle></DialogHeader>
          <label htmlFor="quick-note-title" className="text-base text-launch-ink">Title (optional)</label>
          <input id="quick-note-title" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} className="w-full min-h-14 px-4 rounded-md border border-launch-gold/40 bg-launch-ivory text-launch-ink text-base" />
          <label htmlFor="quick-note-content" className="text-base text-launch-ink">My note</label>
          <textarea id="quick-note-content" value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-md border border-launch-gold/40 bg-launch-ivory text-launch-ink text-base" />
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" onClick={() => setNoteOpen(false)} className="min-h-14 border-launch-gold/40 text-launch-ink">Cancel</Button>
            <Button variant="action" onClick={saveQuickNote} disabled={savingNote || !noteContent.trim()} className="min-h-14">{savingNote && <Loader2 className="animate-spin" />}Save note</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
