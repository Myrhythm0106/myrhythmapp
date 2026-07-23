import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Users, Sparkles, Loader2, Eye, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

interface ActionRow {
  id: string;
  title: string;
  proposed_date: string | null;
  proposed_time: string | null;
  assigned_to: string | null;
  source_quote: string | null;
  duration_note: string | null;
  is_from_document: boolean;
}

interface PostExtractionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionsCount: number;
  meetingTitle: string;
  meetingId?: string;
  /** When set, dialog deletes this file from the `document-imports` bucket
   *  after the user approves the extracted actions. */
  sourceFilePath?: string;
  /** Human-readable original filename, recorded in the audit log. */
  sourceFileName?: string;
  onAcceptAndScheduleAll: (notifyCircle: boolean, actionIds?: string[]) => Promise<void>;
  onReviewIndividually: () => void;
}

export function PostExtractionDialog({
  isOpen,
  onClose,
  actionsCount,
  meetingTitle,
  meetingId,
  sourceFilePath,
  onAcceptAndScheduleAll,
  onReviewIndividually,
}: PostExtractionDialogProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [notifyCircle, setNotifyCircle] = useState(true);
  const [actions, setActions] = useState<ActionRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !meetingId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('extracted_actions')
        .select('id, action_text, what_outcome, proposed_date, proposed_time, assigned_to, due_context, user_notes, motivation_statement, extraction_method')
        .eq('meeting_recording_id', meetingId);
      if (cancelled) return;
      if (error) {
        console.warn('Failed to load actions for scheduling', error);
        setActions([]);
      } else {
        const rows: ActionRow[] = (data || []).map((a: any) => ({
          id: a.id,
          title: a.what_outcome || a.action_text || 'Untitled action',
          proposed_date: a.proposed_date,
          proposed_time: a.proposed_time,
          assigned_to: a.assigned_to,
          source_quote: a.due_context || null,
          duration_note: a.motivation_statement || null,
          is_from_document: a.extraction_method === 'document_import',
        }));
        setActions(rows);
        // Preselect all — user unticks the ones they don't agree with.
        setSelectedIds(new Set(rows.map((r) => r.id)));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, meetingId]);

  const allSelected = actions.length > 0 && selectedIds.size === actions.length;
  const noneSelected = selectedIds.size === 0;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(actions.map((a) => a.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendSelected = async () => {
    if (noneSelected) return;
    setIsScheduling(true);
    try {
      await onAcceptAndScheduleAll(notifyCircle, Array.from(selectedIds));
      // User has approved — safe to delete the source document now.
      if (sourceFilePath) {
        try {
          await supabase.storage.from('document-imports').remove([sourceFilePath]);
        } catch (cleanupErr) {
          console.warn('Failed to delete source document after approval', cleanupErr);
        }
      }
    } finally {
      setIsScheduling(false);
    }
  };

  const handleReview = () => {
    onReviewIndividually();
    onClose();
  };

  const formatWhen = (row: ActionRow) => {
    if (!row.proposed_date) return 'Date to be set';
    try {
      const d = format(parseISO(row.proposed_date), 'EEE d MMM');
      return row.proposed_time ? `${d} · ${row.proposed_time.slice(0, 5)}` : d;
    } catch {
      return row.proposed_date;
    }
  };

  const selectedCount = selectedIds.size;

  if (!isOpen || actionsCount === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-launch-cream border border-launch-moss/30 shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-launch-moss rounded-full shadow-md">
              <Sparkles className="h-6 w-6 text-launch-cream" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-launch-ink">
            {actionsCount} actions extracted
          </DialogTitle>
          <p className="text-sm text-launch-ink/70 mt-1">
            From "{meetingTitle}" — pick which to send to your calendar.
          </p>
          {sourceFilePath && (
            <p className="text-xs text-launch-moss/80 mt-2 font-medium">
              🔒 Your document is held until you confirm — then it's deleted. Expand "Show source" on any action to check the original wording.
            </p>
          )}
        </DialogHeader>

        {/* Select all bar */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-launch-ivory border border-launch-moss/20">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleAll}
              aria-label="Select all actions"
            />
            <span className="text-sm font-medium text-launch-ink">
              {allSelected ? 'Deselect all' : 'Select all'}
            </span>
          </label>
          <span className="text-xs text-launch-ink/60">
            {selectedCount} of {actions.length} selected
          </span>
        </div>

        {/* Action list */}
        <ScrollArea className="max-h-64 rounded-lg border border-launch-moss/20 bg-white/60">
          {loading ? (
            <div className="p-6 text-center text-sm text-launch-ink/60">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Loading actions…
            </div>
          ) : actions.length === 0 ? (
            <div className="p-6 text-center text-sm text-launch-ink/60">
              No actions to review.
            </div>
          ) : (
            <ul className="divide-y divide-launch-moss/10">
              {actions.map((a) => {
                const checked = selectedIds.has(a.id);
                return (
                  <li key={a.id}>
                    <label className="flex items-start gap-3 p-3 cursor-pointer hover:bg-launch-ivory/60">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleOne(a.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-launch-ink line-clamp-2">
                          {a.title}
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-launch-ink/60">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatWhen(a)}
                          </span>
                          {a.duration_note && (
                            <span className="text-launch-ink/50">{a.duration_note.replace('Suggested duration: ', '~')}</span>
                          )}
                          {a.assigned_to && (
                            <span>Owner: {a.assigned_to}</span>
                          )}
                        </div>
                        {a.is_from_document && a.source_quote && (
                          <details className="mt-1.5 group">
                            <summary className="text-[11px] text-launch-moss cursor-pointer hover:underline list-none inline-flex items-center gap-1">
                              <span className="group-open:hidden">📄 Show source</span>
                              <span className="hidden group-open:inline">📄 Hide source</span>
                            </summary>
                            <blockquote className="mt-1 pl-2 border-l-2 border-launch-gold/50 text-[11px] italic text-launch-ink/70 leading-relaxed">
                              "{a.source_quote}"
                            </blockquote>
                          </details>
                        )}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>

        {/* Notify support circle */}
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-launch-ivory border border-launch-moss/20 cursor-pointer">
          <Checkbox
            checked={notifyCircle}
            onCheckedChange={(v) => setNotifyCircle(v as boolean)}
          />
          <span className="text-sm text-launch-ink flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Notify your Support Circle
          </span>
        </label>

        {/* Primary CTA */}
        <Button
          onClick={handleSendSelected}
          disabled={isScheduling || noneSelected || loading}
          className="w-full bg-launch-ember hover:bg-launch-ember/90 text-launch-cream shadow-md py-5"
        >
          {isScheduling ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Scheduling {selectedCount} {selectedCount === 1 ? 'action' : 'actions'}…
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Send {selectedCount === actions.length && selectedCount > 0 ? 'all' : `${selectedCount}`} to calendar
            </>
          )}
        </Button>

        {/* Secondary — review individually */}
        <Button
          variant="outline"
          onClick={handleReview}
          className="w-full py-4 border-launch-moss/30 text-launch-ink hover:bg-launch-ivory"
        >
          <Eye className="h-4 w-4 mr-2" />
          Review actions individually first
        </Button>

        <p className="text-xs text-center text-launch-ink/50">
          Anything you skip stays in your Actions list — send it later from Memory Bridge.
        </p>
      </DialogContent>
    </Dialog>
  );
}
