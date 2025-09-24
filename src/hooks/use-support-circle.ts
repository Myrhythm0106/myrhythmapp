
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface SupportMember {
  id: string;
  name: string;
  permissions: {
    moodTracking: boolean;
    healthTracking: boolean;
  };
}

export interface SupportMessage {
  id: string;
  memberId: string;
  memberName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useSupportCircle() {
  const { user } = useAuth();
  const [members, setMembers] = useState<SupportMember[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSupportCircle();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadSupportCircle = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load members from support_circle_members table
      const { data: membersData, error: membersError } = await supabase
        .from('support_circle_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');
        
      if (membersError) throw membersError;
      
      const formattedMembers: SupportMember[] = membersData?.map(member => ({
        id: member.id,
        name: member.member_name,
        permissions: {
          moodTracking: (member.permissions as any)?.mood || false,
          healthTracking: (member.permissions as any)?.health || false
        }
      })) || [];
      
      setMembers(formattedMembers);

      // Load messages from support_circle_messages table
      const { data: messagesData, error: messagesError } = await supabase
        .from('support_circle_messages')
        .select('*, support_circle_members(member_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (messagesError) throw messagesError;
      
      const formattedMessages: SupportMessage[] = messagesData?.map(msg => ({
        id: msg.id,
        memberId: msg.sender_member_id,
        memberName: (msg.support_circle_members as any)?.member_name || 'Unknown Member',
        message: msg.message_text,
        timestamp: new Date(msg.created_at),
        read: msg.is_read
      })) || [];
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading support circle:', error);
      toast.error('Failed to load support circle');
    } finally {
      setIsLoading(false);
    }
  };

  // Database is now the source of truth - no localStorage needed

  const updateMemberPermissions = async (
    memberId: string, 
    permissions: { moodTracking?: boolean; healthTracking?: boolean }
  ) => {
    if (!user) return;
    
    try {
      const updatedPermissions = {
        mood: permissions.moodTracking,
        health: permissions.healthTracking
      };

      const { error } = await supabase
        .from('support_circle_members')
        .update({ permissions: updatedPermissions })
        .eq('id', memberId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { 
                ...member, 
                permissions: { 
                  ...member.permissions, 
                  ...permissions
                } 
              } 
            : member
        )
      );
      
      toast.success('Permissions updated');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  const addMessage = async (memberId: string, message: string) => {
    if (!user) return;
    
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    try {
      const { data, error } = await supabase
        .from('support_circle_messages')
        .insert({
          user_id: user.id,
          recipient_user_id: user.id,
          sender_member_id: memberId,
          message_text: message,
          message_type: 'encouragement',
          is_read: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      const newMessage: SupportMessage = {
        id: data.id,
        memberId,
        memberName: member.name,
        message,
        timestamp: new Date(data.created_at),
        read: false
      };

      setMessages(prev => [newMessage, ...prev]);
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to send message');
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('support_circle_messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId 
            ? { ...message, read: true } 
            : message
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const hasAccessToMoodTracking = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.permissions.moodTracking || false;
  };

  const hasAccessToHealthTracking = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.permissions.healthTracking || false;
  };

  return {
    members,
    messages,
    isLoading,
    updateMemberPermissions,
    addMessage,
    markMessageAsRead,
    hasAccessToMoodTracking,
    hasAccessToHealthTracking
  };
}
