import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil, Play, RefreshCw, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { OutputActions } from '@/components/shared/OutputActions';
import { runMeetingJob } from '@/lib/memoryBridge/outputMode';
import { useAuth } from '@/hooks/useAuth';

interface Utterance {
  speaker: string;
  start: number;
  end: number;
  text: string;
  unclear?: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  meetingId?: string | null;
  title: string;
  /** Called after actions were re-extracted from the corrected transcript. */
  onActionsUpdated?: () => void;
}

function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
}

/** Plain transcripts (no speakers) become paragraphs so they are still readable. */
function toUtterances(transcript: string): Utterance[] {
  return transcript
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => {
      const m = p.match(/^Speaker ([A-Z0-9]+):\s*([\s\S]*)$/);
      return { speaker: m ? m[1] : '', start: -1, end: -1, text: m ? m[2] : p };
    });
}

function renderWithUnclear(text: string, unclear: string[] = []) {
  if (unclear.length === 0) return text;
  const set = new Set(unclear.map(w => w.toLowerCase()));
  return text.split(/(\s+)/).map((tok, i) => {
    const bare = tok.replace(/[^\p{L}\p{N}'-]/gu, '').toLowerCase();
    return bare && set.has(bare) ? (
      <span
        key={i}
        title="Not sure I heard this right — please check"
        className="underline decoration-dotted decoration-launch-ember underline-offset-4"
      >
        {tok}
      </span>
    ) : (
      <React.Fragment key={i}>{tok}</React.Fragment>
    );
  });
}

export function TranscriptView({ open, onClose, meetingId, title, onActionsUpdated }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [utts, setUtts] = useState<Utterance[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<string | null>(null);
  const [editedAt, setEditedAt] = useState<string | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [reextracting, setReextracting] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!open || !meetingId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from('meeting_recordings')
        .select('transcript, transcript_utterances, transcript_original, transcript_edited_at, speaker_names, transcription_quality, transcript_deleted_at, recording_id')
        .eq('id', meetingId)
        .maybeSingle();
      if (cancelled) return;
      const row = data as any;
      const stored = Array.isArray(row?.transcript_utterances) ? (row.transcript_utterances as Utterance[]) : null;
      setUtts(stored && stored.length > 0 ? stored : toUtterances(row?.transcript || ''));
      setNames((row?.speaker_names as Record<string, string>) || {});
      setOriginal(row?.transcript_original ?? null);
      setEditedAt(row?.transcript_edited_at ?? null);
      setQuality(row?.transcription_quality ?? null);
      setDeleted(!row?.transcript && Boolean(row?.transcript_deleted_at));
      setLoading(false);
      if (row?.recording_id) {
        const { data: rec } = await supabase
          .from('voice_recordings').select('file_path').eq('id', row.recording_id).maybeSingle();
        if (rec?.file_path) {
          const { data: signed } = await supabase.storage.from('voice-recordings').createSignedUrl(rec.file_path, 3600);
          if (!cancelled) setAudioUrl(signed?.signedUrl ?? null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [open, meetingId]);

  const speakerLabel = (s: string) => (s ? names[s] || `Speaker ${s}` : '');
  const plainText = useMemo(
    () => utts.map(u => `${u.speaker ? speakerLabel(u.speaker) + ': ' : ''}${u.text}`).join('\n\n'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [utts, names],
  );
  const hasTimes = utts.some(u => u.start >= 0);
  const unclearCount = utts.reduce((n, u) => n + (u.unclear?.length || 0), 0);

  const playAt = (ms: number) => {
    const a = audioRef.current;
    if (!a || !audioUrl || ms < 0) return;
    a.currentTime = ms / 1000;
    a.play().catch(() => toast.error("Couldn't play this moment."));
  };

  const persist = async (nextUtts: Utterance[], nextNames = names) => {
    if (!meetingId) return;
    setSaving(true);
    const text = nextUtts.map(u => (u.speaker ? `Speaker ${u.speaker}: ${u.text}` : u.text)).join('\n\n');
    const { data: cur } = await supabase
      .from('meeting_recordings').select('transcript, transcript_original').eq('id', meetingId).maybeSingle();
    const keepOriginal = (cur as any)?.transcript_original ?? cur?.transcript ?? null;
    const { error } = await supabase
      .from('meeting_recordings')
      .update({
        transcript: text,
        transcript_utterances: nextUtts as any,
        transcript_original: keepOriginal,
        transcript_edited_at: new Date().toISOString(),
        speaker_names: nextNames as any,
      })
      .eq('id', meetingId);
    setSaving(false);
    if (error) {
      toast.error("Couldn't save that change.", { description: 'Please try again.' });
      return false;
    }
    setOriginal(keepOriginal);
    setEditedAt(new Date().toISOString());
    return true;
  };

  const saveLine = async () => {
    if (editing === null) return;
    const next = utts.map((u, i) => (i === editing ? { ...u, text: draft.trim(), unclear: [] } : u));
    if (await persist(next)) {
      setUtts(next);
      setEditing(null);
      toast.success('Saved. The original is kept in history.');
    }
  };

  const saveName = async () => {
    if (!renaming || !meetingId) return;
    const next = { ...names, [renaming]: nameDraft.trim() };
    if (!nameDraft.trim()) delete next[renaming];
    const { error } = await supabase.from('meeting_recordings').update({ speaker_names: next as any }).eq('id', meetingId);
    if (error) { toast.error("Couldn't save that name."); return; }
    setNames(next);
    setRenaming(null);
  };

  const reextract = async () => {
    if (!meetingId || !user) return;
    setReextracting(true);
    const res = await runMeetingJob(meetingId, user.id, { reextract: true });
    setReextracting(false);
    if (res.success) {
      toast.success('Actions updated from the corrected transcript.', {
        description: 'Anything I had already confirmed was kept.',
      });
      onActionsUpdated?.();
    } else {
      toast.error("Couldn't update my actions.", { description: res.error });
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-3xl w-[calc(100vw-1rem)] h-[92vh] p-0 gap-0 flex flex-col bg-background">
        <div className="shrink-0 border-b border-border px-4 md:px-6 py-4">
          <DialogTitle className="text-xl md:text-2xl font-semibold text-foreground">Full transcript</DialogTitle>
          <DialogDescription className="text-sm md:text-base text-muted-foreground mt-1">
            “{title}”. Tap a name to rename a speaker{hasTimes ? ', tap a time to hear that moment' : ''}, and tap the pencil to fix a word.
          </DialogDescription>
          {quality === 'lower' && (
            <p className="mt-2 text-sm text-launch-ember">Lower accuracy on this one — please read it through.</p>
          )}
          {unclearCount > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="underline decoration-dotted decoration-launch-ember underline-offset-4">Dotted words</span> may not be right — worth a quick check.
            </p>
          )}
          {audioUrl && <audio ref={audioRef} src={audioUrl} controls preload="none" className="mt-3 w-full" />}
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Opening my transcript…
            </div>
          ) : deleted ? (
            <p className="py-16 text-center text-base text-muted-foreground">
              I chose not to keep the transcript for this recording. My actions are still saved.
            </p>
          ) : utts.length === 0 ? (
            <p className="py-16 text-center text-base text-muted-foreground">
              No transcript yet for this recording.
            </p>
          ) : showOriginal && original ? (
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground">{original}</pre>
          ) : (
            <ol className="space-y-4">
              {utts.map((u, i) => (
                <li key={i} className="group">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {u.speaker && (
                      renaming === u.speaker ? (
                        <span className="flex items-center gap-2">
                          <Input
                            autoFocus
                            value={nameDraft}
                            onChange={e => setNameDraft(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveName()}
                            placeholder="e.g. Dr Patel, Me"
                            className="h-10 w-44 text-base"
                            aria-label="Speaker name"
                          />
                          <Button size="sm" onClick={saveName}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setRenaming(null)}>Cancel</Button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setRenaming(u.speaker); setNameDraft(names[u.speaker] || ''); }}
                          className="text-sm font-semibold text-launch-teal hover:underline"
                        >
                          {speakerLabel(u.speaker)}
                        </button>
                      )
                    )}
                    {u.start >= 0 && (
                      <button
                        type="button"
                        onClick={() => playAt(u.start)}
                        disabled={!audioUrl}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-60"
                        aria-label={`Play from ${clock(u.start)}`}
                      >
                        <Play className="h-3 w-3" /> {clock(u.start)}
                      </button>
                    )}
                    {editing !== i && (
                      <button
                        type="button"
                        onClick={() => { setEditing(i); setDraft(u.text); }}
                        className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Fix a word in this line"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {editing === i ? (
                    <div className="space-y-2">
                      <Textarea value={draft} onChange={e => setDraft(e.target.value)} className="min-h-[96px] text-base" />
                      <div className="flex gap-2">
                        <Button onClick={saveLine} disabled={saving} className="min-h-[44px]">
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                        </Button>
                        <Button variant="ghost" onClick={() => setEditing(null)} className="min-h-[44px]">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base leading-relaxed text-foreground">{renderWithUnclear(u.text, u.unclear)}</p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>

        {!loading && !deleted && utts.length > 0 && (
          <div className="shrink-0 border-t border-border px-4 md:px-6 py-3 flex flex-wrap items-center gap-2">
            {editedAt && (
              <Button
                variant="outline"
                onClick={reextract}
                disabled={reextracting}
                className="min-h-[48px]"
              >
                {reextracting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Update my actions from the corrected transcript
              </Button>
            )}
            {original && (
              <Button variant="ghost" onClick={() => setShowOriginal(v => !v)} className="min-h-[48px]">
                <History className="h-4 w-4 mr-2" />
                {showOriginal ? 'Show corrected version' : 'Show original'}
              </Button>
            )}
            <OutputActions
              text={`Transcript — ${title}\n\n${plainText}\n\n— Sent from MyRhythm`}
              subject={`MyRhythm transcript — ${title}`}
              size="compact"
              className={cn('ml-auto')}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
