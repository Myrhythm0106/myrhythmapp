import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Heart, Loader2, MessageCircle, Send, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { ENCOURAGEMENT_SNIPPETS, ItemNoteTarget, useItemNotes } from '@/hooks/useItemNotes';

interface ItemNotesThreadProps {
  targetType: ItemNoteTarget;
  targetId: string;
  ownerUserId?: string | null;
  title?: string;
  className?: string;
}

export function ItemNotesThread({
  targetType,
  targetId,
  ownerUserId,
  title,
  className
}: ItemNotesThreadProps) {
  const { user } = useAuth();
  const { notes, isLoading, isSaving, addNote, deleteNote, markRead } = useItemNotes(
    targetType,
    targetId,
    ownerUserId
  );
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!isLoading) markRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, notes.length]);

  const submit = async () => {
    const ok = await addNote(draft, 'note');
    if (ok) setDraft('');
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-brand-orange-500" />
        <h4 className="text-sm font-semibold">{title || 'Notes & encouragement'}</h4>
        {notes.length > 0 && (
          <Badge variant="secondary" className="text-[10px]">{notes.length}</Badge>
        )}
      </div>

      <ScrollArea className="max-h-64 pr-2">
        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          </div>
        ) : notes.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Nothing here yet. Add a progress update, or send a word of encouragement.
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map(note => {
              const mine = note.author_user_id === user?.id;
              return (
                <li
                  key={note.id}
                  className={cn(
                    'rounded-xl border p-3 text-sm',
                    note.kind === 'encouragement'
                      ? 'border-memory-emerald-200 bg-memory-emerald-50/70'
                      : 'border-border bg-muted/30'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {note.kind === 'encouragement' && (
                          <Heart className="inline h-3 w-3 mr-1 text-memory-emerald-600" />
                        )}
                        {mine ? 'Me' : note.author_name || 'Someone'} ·{' '}
                        {format(new Date(note.created_at), 'MMM d, HH:mm')}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap break-words">{note.body}</p>
                    </div>
                    {mine && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete my note"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>

      <div className="space-y-2">
        <Textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={2}
          placeholder="Add a progress update…"
          aria-label="Write a note"
          className="text-sm"
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="flex flex-wrap gap-1">
          {ENCOURAGEMENT_SNIPPETS.map(snippet => (
            <button
              key={snippet}
              type="button"
              disabled={isSaving}
              onClick={() => addNote(snippet, 'encouragement')}
              className="text-[11px] rounded-full border border-memory-emerald-200 bg-memory-emerald-50 px-2.5 py-1.5 text-memory-emerald-700 hover:bg-memory-emerald-100 transition-colors"
            >
              {snippet}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={submit}
          disabled={isSaving || !draft.trim()}
          className="min-h-[44px] w-full bg-brand-orange-500 hover:bg-brand-orange-600 text-white"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" /> Add note</>}
        </Button>
      </div>
    </div>
  );
}
