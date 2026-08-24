import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type ItemNoteTarget = 'action' | 'recording';

export interface ItemNote {
  id: string;
  owner_user_id: string;
  target_type: ItemNoteTarget;
  target_id: string;
  author_user_id: string;
  author_name: string | null;
  body: string;
  kind: 'note' | 'encouragement';
  read_at: string | null;
  created_at: string;
}

export const ENCOURAGEMENT_SNIPPETS = [
  "Proud of you for keeping this moving.",
  "One step at a time — you've got this.",
  "Thinking of you today.",
  "No rush. Whenever you're ready.",
  "This one matters. Nice work."
];

export function useItemNotes(targetType: ItemNoteTarget, targetId: string | null | undefined, ownerUserId?: string | null) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ItemNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    if (!targetId) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('item_notes')
      .select('*')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[item_notes] load failed', error);
    } else {
      setNotes((data || []) as ItemNote[]);
    }
    setIsLoading(false);
  }, [targetType, targetId]);

  useEffect(() => {
    load();
  }, [load]);

  const addNote = useCallback(
    async (body: string, kind: 'note' | 'encouragement' = 'note') => {
      const text = body.trim();
      if (!text || !targetId || !user) return false;

      setIsSaving(true);
      const { data, error } = await supabase
        .from('item_notes')
        .insert({
          owner_user_id: ownerUserId || user.id,
          target_type: targetType,
          target_id: targetId,
          author_user_id: user.id,
          author_name:
            (user.user_metadata as Record<string, string> | undefined)?.name ||
            user.email?.split('@')[0] ||
            'Someone',
          body: text,
          kind
        })
        .select()
        .single();

      setIsSaving(false);

      if (error) {
        console.error('[item_notes] insert failed', error);
        toast.error("That note didn't save — you may not have access to this item.");
        return false;
      }

      setNotes(prev => [...prev, data as ItemNote]);
      toast.success(kind === 'encouragement' ? 'Encouragement sent' : 'Note added');
      return true;
    },
    [ownerUserId, targetId, targetType, user]
  );

  const deleteNote = useCallback(async (noteId: string) => {
    const previous = notes;
    setNotes(prev => prev.filter(n => n.id !== noteId));

    const { error } = await supabase.from('item_notes').delete().eq('id', noteId);
    if (error) {
      console.error('[item_notes] delete failed', error);
      setNotes(previous);
      toast.error("That note couldn't be removed");
    }
  }, [notes]);

  const markRead = useCallback(async () => {
    if (!user) return;
    const unread = notes.filter(n => !n.read_at && n.author_user_id !== user.id);
    if (unread.length === 0) return;

    const stamp = new Date().toISOString();
    setNotes(prev => prev.map(n => (n.read_at || n.author_user_id === user.id ? n : { ...n, read_at: stamp })));
    await supabase
      .from('item_notes')
      .update({ read_at: stamp })
      .in('id', unread.map(n => n.id));
  }, [notes, user]);

  const unreadCount = notes.filter(n => !n.read_at && n.author_user_id !== user?.id).length;

  return { notes, isLoading, isSaving, addNote, deleteNote, markRead, reload: load, unreadCount };
}
