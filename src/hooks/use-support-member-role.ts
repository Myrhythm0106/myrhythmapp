import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SupportedUser {
  id: string;
  member_name: string;
  relationship: string;
  role: string;
  permissions: any;
  supportedUserName: string;
}

export function useSupportMemberRole() {
  const { user } = useAuth();
  const [isSupportMember, setIsSupportMember] = useState(false);
  const [supportedUsers, setSupportedUsers] = useState<SupportedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }

    checkSupportMemberRole();
  }, [user?.email]);

  const checkSupportMemberRole = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      
      // Check if user is a support circle member for any user
      const { data, error } = await supabase
        .from('support_circle_members')
        .select(`
          user_id,
          member_name,
          relationship,
          role,
          permissions,
          profiles!inner(name)
        `)
        .eq('member_email', user.email)
        .eq('status', 'active');

      if (error) {
        console.error('Error checking support member role:', error);
        return;
      }

      if (data && data.length > 0) {
        setIsSupportMember(true);
        setSupportedUsers(data.map(member => ({
          id: member.user_id,
          member_name: member.member_name,
          relationship: member.relationship,
          role: member.role,
          permissions: member.permissions,
          supportedUserName: (member.profiles as any)?.name || 'Unknown User'
        } as SupportedUser)));
      } else {
        setIsSupportMember(false);
        setSupportedUsers([]);
      }
    } catch (error) {
      console.error('Error checking support member role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupportMember,
    supportedUsers,
    isLoading,
    refetch: checkSupportMemberRole
  };
}