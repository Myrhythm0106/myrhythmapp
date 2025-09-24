import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SupportCircleMessage {
  id: string;
  user_id: string;
  sender_member_id: string;
  recipient_user_id: string;
  message_text: string;
  message_type: string;
  related_action_id?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender_member?: {
    member_name: string;
    role: string;
    relationship: string;
  };
}

export function useSupportCircleMessaging() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<SupportCircleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load messages
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    loadMessages();
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('support_circle_messages')
        .select(`
          *,
          sender_member:support_circle_members(
            member_name,
            role,
            relationship
          )
        `)
        .or(`user_id.eq.${user.id},recipient_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (
    recipientUserId: string,
    messageText: string,
    messageType: string = 'general',
    relatedActionId?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Find the support circle member record for the current user
      const { data: memberData, error: memberError } = await supabase
        .from('support_circle_members')
        .select('id')
        .eq('user_id', recipientUserId)
        .eq('member_email', user.email)
        .eq('status', 'active')
        .single();

      if (memberError || !memberData) {
        throw new Error('You are not an active member of this user\'s support circle');
      }

      const { data, error } = await supabase
        .from('support_circle_messages')
        .insert({
          user_id: recipientUserId,
          sender_member_id: memberData.id,
          recipient_user_id: recipientUserId,
          message_text: messageText,
          message_type: messageType,
          related_action_id: relatedActionId,
        })
        .select(`
          *,
          sender_member:support_circle_members(
            member_name,
            role,
            relationship
          )
        `)
        .single();

      if (error) throw error;

      // Add to local state
      setMessages(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('support_circle_messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('recipient_user_id', user.id);

      if (error) throw error;

      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
      throw err;
    }
  };

  // Get unread message count
  const unreadCount = messages.filter(
    msg => !msg.is_read && msg.recipient_user_id === user?.id
  ).length;

  // Get messages by type
  const getMessagesByType = (type: string) =>
    messages.filter(msg => msg.message_type === type);

  // Get messages related to a specific action
  const getActionMessages = (actionId: string) =>
    messages.filter(msg => msg.related_action_id === actionId);

  return {
    messages,
    isLoading,
    error,
    unreadCount,
    sendMessage,
    markAsRead,
    getMessagesByType,
    getActionMessages,
    refetch: loadMessages,
  };
}