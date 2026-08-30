import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { LoopInPicker, AdhocLoopIn } from '@/components/shared/LoopInPicker';
import {
  Loader2, CalendarPlus, Plus, Trash2, ChevronDown, ChevronUp, CalendarDays, Clock, X,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ActionOverride } from '@/components/memoryBridge/capture-brief/model/scheduleFromMeeting';
import { ExecutiveSummaryPanel, type MeetingSummaryModel } from '@/components/memoryBridge/ExecutiveSummaryPanel';
import { buildExecutiveSummary, extractDecisions, extractOpenQuestions, extractThemes } from '@/components/memoryBridge/capture-brief/model/synthesize';
import type { BriefAction } from '@/components/memoryBridge/capture-brief/model/types';

export interface ReviewRowState {
  id: string;
  include: boolean;
  text: string;
  owner: string;
  date: string;          // YYYY-MM-DD
  time: string;          // HH:mm
  dueDate: string;       // YYYY-MM-DD or ''
  priority: number;
  circleMemberIds: string[];
  adhocLoopIns: AdhocLoopIn[];
  slotIsSuggestion: boolean;
  needsCheck: boolean;
  sourceQuote?: string;
}

interface ReviewStepProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId?: string;
  meetingTitle: string;
  /** Held document that is deleted once the user approves */
  sourceFilePath?: string;
  sourceFileName?: string;
  /** Commits the approved rows. Returns when scheduling has finished. */
  onCommit: (actionIds: string[], overrides: Map<string, ActionOverride>) => Promise<void>;
}

function isoDay(offset = 0): string {
  return format(addDays(new Date(), offset), 'yyyy-MM-dd');
}

function niceDate(iso: string): string {
  try {
    return format(parseISO(iso), 'EEE d MMM');
  } catch {
    return iso;
  }
}

const PRIORITIES = [
  { value: '1', label: 'High' },
  { value: '3', label: 'Medium' },
  { value: '5', label: 'Low' },
];

const priorityValue = (n: number) => (n <= 2 ? '1' : n >= 4 ? '5' : '3');

/** Step description field that grows to fit the full text — never truncates. */
function StepTextField({
  value, onChange, className,
}: { value: string; onChange: (v: string) => void; className?: string }) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 44)}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Step description"
      rows={1}
      className={cn(
        'flex w-full rounded-md border border-input bg-background px-3 py-2.5 text-base ring-offset-background',
        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'resize-none overflow-hidden min-h-11 leading-snug',
        className,
      )}
    />
  );
}

/** Tap-friendly date control used on every breakpoint. */
function DateField({
  value, onChange, placeholder, allowClear,
}: { value: string; onChange: (v: string) => void; placeholder: string; allowClear?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-11 min-h-11 justify-start gap-2 px-3 text-base font-normal"
          >
            <CalendarDays className="h-4 w-4 shrink-0 opacity-70" />
            {value ? niceDate(value) : <span className="text-muted-foreground">{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarPicker
            mode="single"
            selected={value ? parseISO(value) : undefined}
            onSelect={(d) => {
              if (d) onChange(format(d, 'yyyy-MM-dd'));
              setOpen(false);
            }}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {allowClear && value && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Clear date"
          className="h-11 w-11"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function TimeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Start time"
        className="h-11 min-h-11 pl-9 text-base"
      />
    </div>
  );
}

/**
 * The single review-and-edit surface for Memory Bridge.
 * Nothing reaches the calendar until "Add to my diary" is pressed here.
 */
export function ReviewStep({
  isOpen, onClose, meetingId, meetingTitle, sourceFilePath, sourceFileName, onCommit,
}: ReviewStepProps) {
  const [rows, setRows] = useState<ReviewRowState[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [confirmedAccurate, setConfirmedAccurate] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [meetingSummaryData, setMeetingSummaryData] = useState<{
    date: string;
    participants: string[];
    context?: string;
    transcript: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || !meetingId) return;
    let cancelled = false;
    setLoading(true);
    setConfirmedAccurate(false);
    (async () => {
      const [actionsResult, meetingResult] = await Promise.all([
        supabase
          .from('extracted_actions')
          .select('*')
          .eq('meeting_recording_id', meetingId)
          .is('calendar_event_id', null),
        supabase
          .from('meeting_recordings')
          .select('started_at, created_at, participants, meeting_context, transcript')
          .eq('id', meetingId)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      const { data, error } = actionsResult;
      const meeting = meetingResult.data;
      if (meeting) {
        const participantNames = Array.isArray(meeting.participants)
          ? (meeting.participants as any[])
              .map(person => typeof person === 'string' ? person : person?.name)
              .filter((name): name is string => Boolean(name))
          : [];
        setMeetingSummaryData({
          date: new Date(meeting.started_at || meeting.created_at).toLocaleDateString(undefined, {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          }),
          participants: participantNames,
          context: meeting.meeting_context || undefined,
          transcript: meeting.transcript || '',
        });
      } else {
        setMeetingSummaryData(null);
      }
      if (error) {
        console.warn('ReviewStep: failed to load actions', error);
        setRows([]);
      } else {
        setRows(
          (data || []).map((a: any) => {
            const date = a.scheduled_date || a.proposed_date || '';
            return {
              id: a.id,
              include: true,
              text: a.action_text || a.what_outcome || '',
              owner: a.owner || a.assigned_to || 'Me',
              date: date || isoDay(1),
              time: (a.scheduled_time || a.proposed_time || '09:00').slice(0, 5),
              dueDate: a.end_date || '',
              priority: a.priority_level ?? 3,
              circleMemberIds: (a.assigned_watchers || []) as string[],
              adhocLoopIns: (a.adhoc_loop_ins || []) as AdhocLoopIn[],
              slotIsSuggestion: !date,
              needsCheck: Boolean(a.requires_review) || Number(a.confidence_score ?? 1) < 0.65,
              sourceQuote: a.transcript_excerpt || a.due_context || undefined,
            } as ReviewRowState;
          }),
        );
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [isOpen, meetingId]);

  const included = useMemo(() => rows.filter(r => r.include), [rows]);

  const executiveSummary = useMemo<MeetingSummaryModel>(() => {
    const actions: BriefAction[] = rows.map(row => ({
      id: row.id,
      text: row.text,
      owner: row.owner || 'Me',
      due: row.dueDate || row.date || undefined,
      priority: row.priority,
      priorityLabel: row.priority <= 2 ? 'High' : row.priority >= 4 ? 'Low' : 'Medium',
      confidence: row.needsCheck ? 0.6 : 0.9,
      sourceQuote: row.sourceQuote,
    }));
    const transcript = meetingSummaryData?.transcript || '';
    const decisions = extractDecisions(actions, transcript);
    const themes = extractThemes(transcript);
    const openQuestions = extractOpenQuestions(transcript, actions);
    const participants = meetingSummaryData?.participants || [];
    const summary = actions.length > 0
      ? buildExecutiveSummary({ title: meetingTitle, participants, actions, decisions, themes })
      : 'No next steps were captured from this conversation yet.';

    return {
      title: meetingTitle || 'My conversation',
      date: meetingSummaryData?.date || new Date().toLocaleDateString(),
      participants,
      context: meetingSummaryData?.context,
      summary,
      themes,
      decisions,
      openQuestions,
      counts: {
        total: rows.length,
        withProposedDate: rows.filter(row => Boolean(row.date)).length,
        scheduled: 0,
        complete: 0,
      },
    };
  }, [meetingSummaryData, meetingTitle, rows]);

  const patch = (id: string, next: Partial<ReviewRowState>) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...next } : r)));

  const toggleExpanded = (id: string) =>
    setExpanded(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const handleAddStep = async () => {
    const text = newText.trim();
    if (!text || !meetingId) return;
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes?.user?.id;
    if (!userId) return;
    const { data, error } = await supabase
      .from('extracted_actions')
      .insert({
        user_id: userId,
        meeting_recording_id: meetingId,
        action_text: text,
        owner: 'Me',
        priority_level: 3,
        confidence_score: 1,
        extraction_method: 'user_added',
      })
      .select('id')
      .single();
    if (error || !data) {
      toast.error('Could not add that step');
      return;
    }
    setRows(prev => [
      ...prev,
      {
        id: data.id,
        include: true,
        text,
        owner: 'Me',
        date: isoDay(1),
        time: '09:00',
        dueDate: '',
        priority: 3,
        circleMemberIds: [],
        adhocLoopIns: [],
        slotIsSuggestion: true,
        needsCheck: false,
      },
    ]);
    setNewText('');
    setAdding(false);
  };

  const handleRemove = async (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
    await supabase.from('extracted_actions').delete().eq('id', id);
  };

  const cleanupSourceDocument = async (approvedCount: number) => {
    if (!sourceFilePath) return;
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes?.user?.id;
    let auditId: string | undefined;
    if (userId) {
      const { data: auditRow } = await supabase
        .from('document_import_audit')
        .insert({
          user_id: userId,
          meeting_id: meetingId ?? null,
          file_path: sourceFilePath,
          file_name: sourceFileName ?? null,
          actions_sent_count: approvedCount,
          deletion_status: 'pending',
        })
        .select('id')
        .single();
      auditId = auditRow?.id as string | undefined;
    }

    let deletionStatus: 'deleted' | 'failed' = 'deleted';
    let deletionError: string | null = null;
    try {
      const { error: rmErr } = await supabase.storage.from('document-imports').remove([sourceFilePath]);
      if (rmErr) throw rmErr;
    } catch (e: any) {
      deletionStatus = 'failed';
      deletionError = e?.message ?? String(e);
    }
    if (auditId) {
      await supabase
        .from('document_import_audit')
        .update({
          deleted_at: new Date().toISOString(),
          deletion_status: deletionStatus,
          deletion_error: deletionError,
        })
        .eq('id', auditId);
    }
    if (deletionStatus === 'deleted') toast.success('Approved — source document deleted and logged.');
    else toast.warning('Approved and logged, but the source document could not be deleted automatically.');
  };

  const handleCommit = async () => {
    if (included.length === 0) return;
    if (sourceFilePath && !confirmedAccurate) return;
    setSaving(true);
    try {
      // 1. Persist every edit so the review reflects reality if I come back.
      for (const r of rows) {
        await supabase
          .from('extracted_actions')
          .update({
            action_text: r.text,
            owner: r.owner,
            assigned_to: r.owner,
            priority_level: r.priority,
            proposed_date: r.date || null,
            proposed_time: r.time || null,
            end_date: r.dueDate || null,
            assigned_watchers: r.circleMemberIds,
            adhoc_loop_ins: r.adhocLoopIns as any,
          })
          .eq('id', r.id);
      }

      // 2. Commit only the included rows, with exactly the agreed slots.
      const overrides = new Map<string, ActionOverride>();
      for (const r of included) {
        overrides.set(r.id, {
          text: r.text,
          date: r.date,
          time: r.time,
          dueDate: r.dueDate || undefined,
          priority: r.priority,
        });
      }
      await onCommit(included.map(r => r.id), overrides);
      await cleanupSourceDocument(included.length);
      onClose();
    } catch (e) {
      console.error('ReviewStep commit failed', e);
      toast.error('Could not add these to my diary — please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const renderPeople = (r: ReviewRowState) => (
    <LoopInPicker
      circleMemberIds={r.circleMemberIds}
      adhocLoopIns={r.adhocLoopIns}
      onChange={({ circleMemberIds, adhocLoopIns }) => patch(r.id, { circleMemberIds, adhocLoopIns })}
      triggerLabel={
        r.circleMemberIds.length + r.adhocLoopIns.length > 0
          ? `${r.circleMemberIds.length + r.adhocLoopIns.length} looped in`
          : 'Loop someone in'
      }
    />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl w-[calc(100vw-1rem)] h-[92vh] p-0 gap-0 flex flex-col bg-background"
        aria-describedby={undefined}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-border px-4 md:px-6 py-4">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Review before it reaches my diary
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            From “{meetingTitle}”. Change anything here — nothing is scheduled until I say so.
          </p>
          {sourceFilePath && (
            <p className="text-xs text-primary mt-2">
              Your document is held until you confirm, then deleted.
            </p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Gathering my next steps…
            </div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-base">
              Nothing left to review — everything from this capture is already in my diary.
            </div>
          ) : (
            <>
              <div className="mb-6">
                <ExecutiveSummaryPanel model={executiveSummary} />
              </div>

              {/* ---------- Laptop / large tablet: table ---------- */}
              <div className="hidden lg:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="w-10 py-2" />
                      <th className="py-2">My next step</th>
                      <th className="py-2 w-32">Owner</th>
                      <th className="py-2 w-56">Start</th>
                      <th className="py-2 w-44">Due</th>
                      <th className="py-2 w-32">Priority</th>
                      <th className="py-2 w-44">People</th>
                      <th className="w-12 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr
                        key={r.id}
                        className={cn(
                          'border-t border-border align-top',
                          !r.include && 'opacity-45',
                        )}
                      >
                        <td className="py-3">
                          <Checkbox
                            checked={r.include}
                            onCheckedChange={v => patch(r.id, { include: Boolean(v) })}
                            aria-label="Include this step"
                          />
                        </td>
                        <td className="py-3 pr-3">
                          <StepTextField
                            value={r.text}
                            onChange={v => patch(r.id, { text: v })}
                          />
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {r.needsCheck && (
                              <Badge variant="outline" className="text-[11px] border-primary/50 text-primary">
                                suggested — check this
                              </Badge>
                            )}
                            {r.sourceQuote && (
                              <button
                                type="button"
                                onClick={() => toggleExpanded(r.id)}
                                className="text-[11px] text-primary hover:underline"
                              >
                                {expanded.has(r.id) ? 'Hide what I said' : 'What I said'}
                              </button>
                            )}
                          </div>
                          {expanded.has(r.id) && r.sourceQuote && (
                            <blockquote className="mt-1 border-l-2 border-border pl-2 text-xs italic text-muted-foreground">
                              “{r.sourceQuote}”
                            </blockquote>
                          )}
                        </td>
                        <td className="py-3 pr-3">
                          <Input
                            value={r.owner}
                            onChange={e => patch(r.id, { owner: e.target.value })}
                            className="h-11 text-base"
                            aria-label="Owner"
                          />
                        </td>
                        <td className="py-3 pr-3">
                          <div className="flex flex-col gap-1">
                            <DateField
                              value={r.date}
                              onChange={v => patch(r.id, { date: v, slotIsSuggestion: false })}
                              placeholder="Pick a day"
                            />
                            <TimeField value={r.time} onChange={v => patch(r.id, { time: v, slotIsSuggestion: false })} />
                            {r.slotIsSuggestion && (
                              <span className="text-[11px] text-muted-foreground">suggested slot</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <DateField
                            value={r.dueDate}
                            onChange={v => patch(r.id, { dueDate: v })}
                            placeholder="No due date"
                            allowClear
                          />
                        </td>
                        <td className="py-3 pr-3">
                          <Select
                            value={priorityValue(r.priority)}
                            onValueChange={v => patch(r.id, { priority: Number(v) })}
                          >
                            <SelectTrigger className="h-11 text-base"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {PRIORITIES.map(p => (
                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 pr-3">{renderPeople(r)}</td>
                        <td className="py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Remove this step"
                            className="h-11 w-11 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(r.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ---------- Phone / small tablet: stacked cards ---------- */}
              <div className="lg:hidden space-y-3">
                {rows.map(r => {
                  const open = expanded.has(r.id);
                  return (
                    <div
                      key={r.id}
                      className={cn(
                        'rounded-xl border border-border bg-card p-3',
                        !r.include && 'opacity-50',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={r.include}
                          onCheckedChange={v => patch(r.id, { include: Boolean(v) })}
                          aria-label="Include this step"
                          className="mt-3 h-5 w-5"
                        />
                        <div className="flex-1 min-w-0">
                          <StepTextField
                            value={r.text}
                            onChange={v => patch(r.id, { text: v })}
                            className="font-medium"
                          />
                          {r.needsCheck && (
                            <Badge variant="outline" className="mt-2 text-[11px] border-primary/50 text-primary">
                              suggested — check this
                            </Badge>
                          )}
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <DateField
                              value={r.date}
                              onChange={v => patch(r.id, { date: v, slotIsSuggestion: false })}
                              placeholder="Pick a day"
                            />
                            <TimeField value={r.time} onChange={v => patch(r.id, { time: v, slotIsSuggestion: false })} />
                          </div>
                          {r.slotIsSuggestion && (
                            <p className="mt-1 text-[11px] text-muted-foreground">Suggested slot — tap to change.</p>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleExpanded(r.id)}
                            className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm text-primary"
                          >
                            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            {open ? 'Less' : 'More'}
                          </button>

                          {open && (
                            <div className="mt-2 space-y-3">
                              <div>
                                <label className="text-xs text-muted-foreground">Owner</label>
                                <Input
                                  value={r.owner}
                                  onChange={e => patch(r.id, { owner: e.target.value })}
                                  className="min-h-11 text-base"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Due</label>
                                <DateField
                                  value={r.dueDate}
                                  onChange={v => patch(r.id, { dueDate: v })}
                                  placeholder="No due date"
                                  allowClear
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Priority</label>
                                <Select
                                  value={priorityValue(r.priority)}
                                  onValueChange={v => patch(r.id, { priority: Number(v) })}
                                >
                                  <SelectTrigger className="min-h-11 text-base"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {PRIORITIES.map(p => (
                                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              {renderPeople(r)}
                              {r.sourceQuote && (
                                <blockquote className="border-l-2 border-border pl-2 text-xs italic text-muted-foreground">
                                  “{r.sourceQuote}”
                                </blockquote>
                              )}
                              <Button
                                variant="ghost"
                                className="min-h-11 w-full text-destructive"
                                onClick={() => handleRemove(r.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Remove this step
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Add a step the recording missed */}
          {!loading && meetingId && (
            <div className="mt-4">
              {adding ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    autoFocus
                    value={newText}
                    onChange={e => setNewText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddStep()}
                    placeholder="Something I said I'd do…"
                    className="min-h-11 text-base"
                  />
                  <div className="flex gap-2">
                    <Button className="min-h-11" onClick={handleAddStep}>Add</Button>
                    <Button variant="ghost" className="min-h-11" onClick={() => { setAdding(false); setNewText(''); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="min-h-11" onClick={() => setAdding(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add a step
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-border bg-muted/40 px-4 md:px-6 py-3 space-y-3">
          {sourceFilePath && (
            <label className="flex items-start gap-2 text-sm text-foreground cursor-pointer">
              <Checkbox
                checked={confirmedAccurate}
                onCheckedChange={v => setConfirmedAccurate(Boolean(v))}
                className="mt-0.5"
              />
              <span>
                I confirm these match my document — approving deletes the uploaded file.
              </span>
            </label>
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              {included.length} of {rows.length} will go in my diary
            </span>
            <div className="flex gap-2">
              <Button variant="outline" className="min-h-11 flex-1 sm:flex-none" onClick={onClose}>
                Not yet
              </Button>
              <Button
                className="min-h-11 flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCommit}
                disabled={saving || included.length === 0 || (!!sourceFilePath && !confirmedAccurate)}
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding…</>
                ) : (
                  <><CalendarPlus className="h-4 w-4 mr-2" /> Add these to my diary</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
