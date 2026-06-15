import React, { useEffect, useRef, useState } from 'react';
import { Pencil, Check, X, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CaptureTitleEditorProps {
  recordingId: string;
  title: string;
  shortId?: string | null;
  /** Supabase table that owns this row. Defaults to voice_recordings. */
  table?: 'voice_recordings' | 'meeting_recordings';
  /** Called with the new title after a successful save. */
  onSaved?: (newTitle: string) => void;
  /** Optional class for the title text/heading. */
  titleClassName?: string;
}

/**
 * Inline-editable capture title with a copyable short_id chip.
 *
 * - The `short_id` (e.g. CAP-0042) is the unique handle and is always shown when present.
 * - The title is an optional human-friendly label; empty is allowed (we keep the existing title).
 * - Click the pencil or the title to edit. Enter saves, Esc cancels, blur saves.
 */
export function CaptureTitleEditor({
  recordingId,
  title,
  shortId,
  table = 'voice_recordings',
  onSaved,
  titleClassName = 'font-medium',
}: CaptureTitleEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [saving, setSaving] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentTitle(title);
    setDraft(title);
  }, [title]);

  useEffect(() => {
    if (editing) {
      // Defer to allow render
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [editing]);

  const save = async () => {
    const next = draft.trim();
    // Empty title is allowed — keep existing title rather than blanking it.
    const finalTitle = next.length === 0 ? currentTitle : next;
    if (finalTitle === currentTitle) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from(table)
        .update({ title: finalTitle })
        .eq('id', recordingId);
      if (error) throw error;
      setCurrentTitle(finalTitle);
      onSaved?.(finalTitle);
      toast.success('Capture renamed');
    } catch (err) {
      console.error('Rename failed', err);
      toast.error('Could not rename capture');
      setDraft(currentTitle);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const cancel = () => {
    setDraft(currentTitle);
    setEditing(false);
  };

  const copyShortId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shortId) return;
    try {
      await navigator.clipboard.writeText(shortId);
      toast.success(`${shortId} copied`);
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap min-w-0">
      {shortId && (
        <Badge
          variant="outline"
          onClick={copyShortId}
          className="cursor-pointer font-mono text-[10px] tracking-wider gap-1 hover:bg-muted"
          title="Click to copy unique ID"
        >
          {shortId}
          <Copy className="h-3 w-3 opacity-60" />
        </Badge>
      )}

      {editing ? (
        <div className="flex items-center gap-1 flex-1 min-w-[180px]">
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                save();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                cancel();
              }
            }}
            onBlur={() => {
              // Brief delay so clicks on Save/Cancel still register
              setTimeout(() => {
                if (editing) save();
              }, 100);
            }}
            placeholder="Name this capture (optional)"
            disabled={saving}
            maxLength={120}
            className="h-7 px-2 text-sm"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onMouseDown={(e) => e.preventDefault()}
            onClick={save}
            disabled={saving}
            aria-label="Save title"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancel}
            disabled={saving}
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="group flex items-center gap-1.5 text-left min-w-0"
          title="Click to rename"
        >
          <span className={`${titleClassName} truncate`}>{currentTitle}</span>
          <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
        </button>
      )}
    </div>
  );
}
