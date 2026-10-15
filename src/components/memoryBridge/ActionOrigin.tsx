import React, { useId, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { SourceRefLine } from '@/components/traceability/SourceRefLine';
import { TranscriptView } from './TranscriptView';
import { uniqueQuoteMatch } from '@/lib/memoryBridge/quoteMatch';

interface Props {
  meetingId?: string | null;
  actionId?: string;
  quote?: string | null;
  referenceCode?: string | null;
  userAdded?: boolean;
}

export function ActionOrigin({ meetingId, actionId, quote, referenceCode, userAdded }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [source, setSource] = useState<{ id: string; title: string; transcript: string | null; removed: boolean; manual: boolean } | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const load = async () => {
    setLoading(true);
    setFailed(false);
    setSource(null);
    try {
      if (!meetingId) return;
      const { data, error } = await supabase.from('meeting_recordings')
        .select('id, meeting_title, transcript, transcript_deleted_at').eq('id', meetingId).maybeSingle();
      if (error) throw error;
      let manual = Boolean(userAdded);
      if (actionId) {
        const { data: action, error: actionError } = await supabase.from('extracted_actions')
          .select('extraction_method, meeting_recording_id').eq('id', actionId).maybeSingle();
        if (actionError) throw actionError;
        if (!action || action.meeting_recording_id !== meetingId) return;
        manual = action.extraction_method === 'user_added';
      }
      if (data) setSource({ id: data.id, title: data.meeting_title, transcript: data.transcript, removed: Boolean(data.transcript_deleted_at), manual });
    } catch { setFailed(true); }
    finally { setLoading(false); }
  };
  const matched = source && !source.removed && !source.manual && uniqueQuoteMatch(source.transcript || '', quote);
  return (
    <div className="min-w-0 text-base text-foreground">
      <Button variant="ghost" type="button" aria-expanded={open} aria-controls={id}
        className="min-h-14 h-auto px-0 text-left whitespace-normal text-base font-medium text-foreground hover:bg-transparent"
        onClick={() => { setOpen(!open); if (!open) void load(); }}>
        {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
        Where did this come from?
      </Button>
      {open && <div id={id} className="space-y-3 border-l-2 border-border pl-3 pb-3" role="region" aria-label="Original words for this next step">
        {referenceCode && <SourceRefLine referenceCode={referenceCode} state={source?.transcript && !source.removed ? 'available' : 'retired'} className="text-base" />}
        {loading ? <p role="status" className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Opening the conversation…</p> : failed ?
          <><p>Could not open the original words. Please try again.</p><Button variant="outline" onClick={() => void load()}>Try again</Button></> :
          <>
            {source && <p className="font-semibold break-words">{source.title}</p>}
            {userAdded || source?.manual ? <p>Added by me — not taken from the conversation.</p> : matched ?
              <><p className="text-muted-foreground">Original words</p><blockquote className="whitespace-pre-wrap break-words leading-relaxed">“{source?.transcript?.slice(matched.start, matched.end)}”</blockquote></> :
              <p>{source?.removed ? 'The transcript is no longer available. My next step and reference stay.' : source?.transcript ? 'No exact passage could be identified. I can check the full transcript.' : 'The original transcript is not available.'}</p>}
            {source?.transcript && !source.removed && <Button variant="outline" className="min-h-14 text-base h-auto whitespace-normal" onClick={() => setShowTranscript(true)}><FileText className="h-4 w-4" />Read in transcript</Button>}
          </>}
      </div>}
      {source && <TranscriptView open={showTranscript} onClose={() => setShowTranscript(false)} meetingId={source.id} title={source.title} highlightQuote={matched ? quote : null} />}
    </div>
  );
}