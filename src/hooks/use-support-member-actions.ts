import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SupportedUserAction {
  id: string;
  action_text: string;
  status: string;
  priority_level: number;
  due_context: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  category: string;
  action_type: string;
  user_id: string;
  user_name: string;
  created_at: string;
  updated_at: string;
  meeting_title?: string;
}

export interface SupportMemberNote {
  id: string;
  action_id: string;
  note_text: string;
  note_type: string;
  is_visible_to_user: boolean;
  created_at: string;
}

export function useSupportMemberActions() {
  const { user } = useAuth();
  const [actions, setActions] = useState<SupportedUserAction[]>([]);
  const [notes, setNotes] = useState<SupportMemberNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supportedUsers, setSupportedUsers] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (user?.email) {
      loadSupportMemberActions();
      loadSupportedUsers();
    }
  }, [user?.email]);

  const loadSupportedUsers = async () => {
    if (!user?.email) return;

    const { data, error } = await supabase
      .from('support_circle_members')
      .select(`
        user_id
      `)
      .eq('member_email', user.email)
      .eq('status', 'active');

    if (error) {
      console.error('Error loading supported users:', error);
      return;
    }

    // Get user profiles separately
    const userIds = data.map(item => item.user_id);
    if (userIds.length === 0) {
      setSupportedUsers([]);
      return;
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error loading profiles:', profilesError);
      return;
    }

    const users = profilesData.map(profile => ({
      id: profile.id,
      name: profile.name || 'User'
    }));

    setSupportedUsers(users);
  };

  const loadSupportMemberActions = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      // Get actions the support member has access to
      const { data: actionsData, error: actionsError } = await supabase
        .from('extracted_actions')
        .select(`
          *,
          meeting_recordings!inner (
            meeting_title
          )
        `)
        .order('created_at', { ascending: false });

      if (actionsError) {
        console.error('Error loading actions:', actionsError);
        return;
      }

      // Get user profiles for the actions
      const userIds = [...new Set(actionsData.map(action => action.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile]) || []);

      const formattedActions: SupportedUserAction[] = actionsData.map(action => ({
        id: action.id,
        action_text: action.action_text,
        status: action.status,
        priority_level: action.priority_level || 3,
        due_context: action.due_context,
        scheduled_date: action.scheduled_date,
        scheduled_time: action.scheduled_time,
        category: action.category,
        action_type: action.action_type,
        user_id: action.user_id,
        user_name: profilesMap.get(action.user_id)?.name || 'User',
        created_at: action.created_at,
        updated_at: action.updated_at,
        meeting_title: action.meeting_recordings?.meeting_title
      }));

      setActions(formattedActions);

      // Load notes
      const { data: notesData, error: notesError } = await supabase
        .from('support_member_action_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!notesError && notesData) {
        setNotes(notesData);
      }

    } catch (error) {
      console.error('Error loading support member actions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateActionStatus = async (actionId: string, status: string) => {
    const { error } = await supabase
      .from('extracted_actions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', actionId);

    if (error) {
      console.error('Error updating action status:', error);
      return false;
    }

    // Refresh actions
    loadSupportMemberActions();
    return true;
  };

  const addSupportNote = async (actionId: string, noteText: string, noteType: 'encouragement' | 'reminder' | 'help_offer' | 'status_update' = 'encouragement') => {
    if (!user?.email) return false;

    // First get the support member ID
    const { data: memberData, error: memberError } = await supabase
      .from('support_circle_members')
      .select('id')
      .eq('member_email', user.email)
      .eq('status', 'active')
      .single();

    if (memberError || !memberData) {
      console.error('Error finding support member:', memberError);
      return false;
    }

    const { error } = await supabase
      .from('support_member_action_notes')
      .insert({
        action_id: actionId,
        support_member_id: memberData.id,
        note_text: noteText,
        note_type: noteType,
        is_visible_to_user: true
      });

    if (error) {
      console.error('Error adding support note:', error);
      return false;
    }

    // Refresh notes
    loadSupportMemberActions();
    return true;
  };

  return {
    actions,
    notes,
    isLoading,
    supportedUsers,
    updateActionStatus,
    addSupportNote,
    refetch: loadSupportMemberActions
  };
}