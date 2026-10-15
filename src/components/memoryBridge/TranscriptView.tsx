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
import { uniqueQuoteMatch } from '@/lib/memoryBridge/quoteMatch';
import { readingPassages, PASSAGES_PER_SECTION } from '@/lib/memoryBridge/transcriptReading';

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
  highlightQuote?: string | null;
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

export function TranscriptView({ open, onClose, meetingId, title, onActionsUpdated, highlightQuote }: Props) {
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
  const [section, setSection] = useState(0);
  const [readAll, setReadAll] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const readingRef = useRef<HTMLDivElement>(null);
  const passages = useMemo(() => readingPassages(utts), [utts]);
  const sectionCount = Math.max(1, Math.ceil(passages.length / PASSAGES_PER_SECTION));
  const currentSection = Math.min(section, sectionCount - 1);
  const visiblePassages = readAll ? passages : passages.slice(currentSection * PASSAGES_PER_SECTION, (currentSection + 1) * PASSAGES_PER_SECTION);
  const speakers = Array.from(new Set(utts.map(u => u.speaker).filter(Boolean)));

  useEffect(() => {
    if (!open || !meetingId) return;
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    setSection(0);
    setReadAll(false);
    setToolsOpen(false);
    setUtts([]);
    setAudioUrl(null);
    setOriginal(null);
    setEditing(null);
    setRenaming(null);
    setShowOriginal(false);
    (async () => {
      const { data, error } = await supabase
        .from('meeting_recordings')
        .select('transcript, transcript_utterances, transcript_original, transcript_edited_at, speaker_names, transcription_quality, transcript_deleted_at, recording_id')
        .eq('id', meetingId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) { setLoadFailed(true); setLoading(false); return; }
      const row = data as any;
      const stored = Array.isArray(row?.transcript_utterances) ? (row.transcript_utterances as Utterance[]) : null;
      const removed = Boolean(row?.transcript_deleted_at);
      setUtts(removed ? [] : stored && stored.length > 0 ? stored : toUtterances(row?.transcript || '')); 
      setNames((row?.speaker_names as Record<string, string>) || {});
      setOriginal(removed ? null : row?.transcript_original ?? null);
      setEditedAt(row?.transcript_edited_at ?? null);
      setQuality(row?.transcription_quality ?? null);
      setDeleted(removed);
      setLoading(false);
      if (row?.recording_id) {
        const { data: rec } = await supabase
          .from('voice_recordings').select('file_path, audio_deleted_at').eq('id', row.recording_id).maybeSingle();
        if (rec?.file_path && !rec.audio_deleted_at) {
          const { data: signed } = await supabase.storage.from('voice-recordings').createSignedUrl(rec.file_path, 3600);
          if (!cancelled) setAudioUrl(signed?.signedUrl ?? null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [open, meetingId, reload]);

  const passageRef = useRef<HTMLLIElement>(null);
  const match = useMemo(() => uniqueQuoteMatch(utts.map(u => u.text).join('\n\n'), highlightQuote), [utts, highlightQuote]);
  useEffect(() => {
    if (!open || loading || !match) return;
    const index = passages.findIndex(p => match.start >= p.offset && match.start < p.offset + p.text.length);
    if (index >= 0) setSection(Math.floor(index / PASSAGES_PER_SECTION));
  }, [open, loading, match, passages]);
  useEffect(() => {
    if (!open || loading || !match || showOriginal) return;
    const timer = window.setTimeout(() => passageRef.current?.scrollIntoView({ block: 'center', behavior: 'auto' }), 250);
    return () => window.clearTimeout(timer);
  }, [open, loading, match, showOriginal, currentSection]);

  const speakerLabel = (s: string) => (s ? names[s] || `Speaker ${s}` : '');
  const plainText = useMemo(
    () => utts.map(u => `${u.speaker ? speakerLabel(u.speaker) + ': ' : ''}${u.text}`).join('\n\n'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [utts, names],
  );
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
          <DialogTitle className="text-xl md:text-2xl font-semibold text-foreground">My conversation</DialogTitle>
          <DialogDescription className="text-base md:text-base text-muted-foreground mt-1">
            “{title}” · Original words
          </DialogDescription>
          {quality === 'lower' && (
            <p className="mt-2 text-base text-launch-ember">Lower accuracy on this one — please read it through.</p>
          )}
          {unclearCount > 0 && (
            <p className="mt-2 text-base text-muted-foreground">
              <span className="underline decoration-dotted decoration-launch-ember underline-offset-4">Dotted words</span> may not be right — worth a quick check.
            </p>
          )}
          {audioUrl && <audio ref={audioRef} src={audioUrl} preload="none" />}
          {!loading && !deleted && !loadFailed && <Button variant="ghost" className="min-h-14 text-base" aria-expanded={toolsOpen} onClick={() => setToolsOpen(!toolsOpen)}>Conversation tools</Button>}
          {toolsOpen && audioUrl && <audio src={audioUrl} controls preload="none" className="mt-3 w-full" />}
        </div>

        <div ref={readingRef} className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Opening my transcript…
            </div>
          ) : loadFailed ? (
            <div role="alert" className="py-8 space-y-3 text-base"><p>My conversation could not be opened. Nothing has been changed.</p><Button variant="outline" className="min-h-14" onClick={() => setReload(n => n + 1)}>Try again</Button><Button variant="ghost" className="min-h-14" onClick={onClose}>Back</Button></div>
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
            <>
              <details className="border-b border-border mb-5 pb-3">
                <summary className="min-h-14 flex items-center text-base font-semibold cursor-pointer">People in this conversation</summary>
                {speakers.length === 0 ? <p className="text-base py-3">Speakers could not be separated in this transcript.</p> : speakers.map(speaker => (
                  <div key={speaker} className="py-3 border-t border-border space-y-2">
                    <p className="font-semibold text-base">{speakerLabel(speaker)}</p>
                    {renaming === speaker ? <div className="flex flex-wrap gap-2">
                      <Input autoFocus value={nameDraft} onChange={e => setNameDraft(e.target.value)} aria-label="Speaker name" placeholder="Name I recognise" className="min-h-14 min-w-0 flex-1 text-base" />
                      <Button variant="action" className="min-h-14" onClick={saveName}>Save name</Button>
                      <Button variant="ghost" className="min-h-14" onClick={() => setRenaming(null)}>Cancel</Button>
                    </div> : <Button variant="outline" className="min-h-14" onClick={() => { setRenaming(speaker); setNameDraft(names[speaker] || ''); }}>{names[speaker] ? 'Change name' : 'Add name'}</Button>}
                  </div>
                ))}
              </details>
              <ol className="space-y-5">
                {visiblePassages.map((passage, passageIndex) => {
                  const u = utts[passage.turnIndex];
                  if (!u) return null;
                  const start = match ? Math.max(0, match.start - passage.offset) : -1;
                  const end = match ? Math.min(passage.text.length, match.end - passage.offset) : -1;
                  const highlighted = start >= 0 && end > start && start < passage.text.length;
                  const previous = visiblePassages[passageIndex - 1];
                  const previousTurn = previous ? utts[previous.turnIndex] : null;
                  return <li key={`${passage.turnIndex}-${passage.turnStart}`} ref={highlighted && match?.start === passage.offset + start ? passageRef : undefined} className="border-b border-border pb-5">
                    {u.speaker && (!previousTurn || previousTurn.speaker !== u.speaker) && <h3 className="text-lg font-semibold mb-2">{speakerLabel(u.speaker)}</h3>}
                    {editing === passage.turnIndex ? <div className="space-y-2">
                      <Textarea value={draft} onChange={e => setDraft(e.target.value)} className="min-h-24 text-base" />
                      <div className="flex gap-2"><Button variant="action" onClick={saveLine} disabled={saving} className="min-h-14">Save</Button><Button variant="ghost" onClick={() => setEditing(null)} className="min-h-14">Cancel</Button></div>
                    </div> : <p className="text-base leading-relaxed whitespace-pre-wrap break-words">{highlighted ? <>{renderWithUnclear(passage.text.slice(0, start), u.unclear)}<mark className="bg-accent text-accent-foreground underline decoration-2 underline-offset-4">{renderWithUnclear(passage.text.slice(start, end), u.unclear)}</mark>{renderWithUnclear(passage.text.slice(end), u.unclear)}</> : renderWithUnclear(passage.text, u.unclear)}</p>}
                    {toolsOpen && <div className="flex flex-wrap gap-2 mt-2">
                      {passage.firstPart && u.start >= 0 && audioUrl && <Button variant="ghost" className="min-h-14 text-base" onClick={() => playAt(u.start)}><Play className="h-4 w-4" />Listen to this part · {clock(u.start)}</Button>}
                      <Button variant="ghost" className="min-h-14 text-base" onClick={() => { setEditing(passage.turnIndex); setDraft(u.text); }}><Pencil className="h-4 w-4" />Edit words</Button>
                    </div>}
                  </li>;
                })}
              </ol>
            </>

          )}
        </div>

        {!loading && !deleted && !loadFailed && utts.length > 0 && <div className="shrink-0 border-t border-border px-4 md:px-6 py-3 space-y-2">
          {!showOriginal && <>
            <p role="status" className="text-base">{readAll ? 'Whole conversation' : `Section ${currentSection + 1} of ${sectionCount}`}</p>
            <div className="flex flex-wrap gap-2">
              {!readAll && currentSection > 0 && <Button variant="outline" className="min-h-14" onClick={() => { setSection(currentSection - 1); readingRef.current?.scrollTo(0, 0); }}>Previous section</Button>}
              {!readAll && currentSection < sectionCount - 1 && <Button variant="action" className="min-h-14" onClick={() => { setSection(currentSection + 1); readingRef.current?.scrollTo(0, 0); }}>Read more</Button>}
              <Button variant="ghost" className="min-h-14" onClick={() => { setReadAll(!readAll); readingRef.current?.scrollTo(0, 0); }}>{readAll ? 'Read in sections' : 'Read everything'}</Button>
            </div>
          </>}
        </div>}
        {!loading && !deleted && utts.length > 0 && toolsOpen && (
          <div className="shrink-0 max-h-48 overflow-y-auto border-t border-border px-4 md:px-6 py-3 flex flex-wrap items-center gap-2">
            {editedAt && (
              <Button
                variant="outline"
                onClick={reextract}
                disabled={reextracting}
                className="min-h-14"
              >
                {reextracting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Update my actions from the corrected transcript
              </Button>
            )}
            {original && (
              <Button variant="ghost" onClick={() => setShowOriginal(v => !v)} className="min-h-14">
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
