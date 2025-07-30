
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SupportCircleMember {
  id: string;
  user_id: string;
  member_name: string;
  member_email?: string;
  member_phone?: string;
  relationship: string;
  role: 'viewer' | 'supporter' | 'caregiver' | 'medical';
  permissions: {
    mood?: boolean;
    health?: boolean;
    calendar?: boolean;
    goals?: boolean;
    gratitude?: boolean;
  };
  can_send_reminders: boolean;
  can_receive_alerts: boolean;
  notification_preferences: {
    email: boolean;
    sms: boolean;
  };
  status: 'active' | 'pending' | 'inactive' | 'revoked' | 'expired';
  invitation_token?: string;
  invited_at?: string;
  joined_at?: string;
  invitation_expires_at?: string;
  created_at: string;
}

export interface AccountabilityReminder {
  id: string;
  user_id: string;
  created_by_member_id: string;
  title: string;
  description?: string;
  reminder_type: 'medication' | 'appointment' | 'activity' | 'safety' | 'custom';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  reminder_time: string;
  reminder_days?: number[];
  start_date: string;
  end_date?: string;
  is_active: boolean;
  escalation_enabled: boolean;
  escalation_delay_minutes?: number;
  escalation_members: string[];
}

export interface AccountabilityAlert {
  id: string;
  user_id: string;
  alert_type: 'task_completed' | 'task_missed' | 'streak_milestone' | 'concern_pattern';
  related_id?: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  target_members: string[];
  sent_at?: string;
  acknowledged_by: string[];
  created_at: string;
}

export function useAccountabilitySystem() {
  const { user } = useAuth();
  const [supportCircle, setSupportCircle] = useState<SupportCircleMember[]>([]);
  const [reminders, setReminders] = useState<AccountabilityReminder[]>([]);
  const [alerts, setAlerts] = useState<AccountabilityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load support circle data
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadSupportCircle(),
          loadReminders(),
          loadAlerts()
        ]);
      } catch (error) {
        console.error('Error loading accountability data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const loadSupportCircle = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('support_circle_members')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Properly cast database types to our interfaces
      const typedData = (data || []).map(member => ({
        ...member,
        role: member.role as SupportCircleMember['role'],
        status: member.status as SupportCircleMember['status'],
        permissions: (member.permissions as any) || {},
        notification_preferences: (member.notification_preferences as any) || { email: true, sms: false }
      })) as SupportCircleMember[];
      
      setSupportCircle(typedData);
    } catch (error) {
      console.error('Error loading support circle:', error);
      toast.error('Failed to load support circle');
    }
  };

  const loadReminders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('accountability_reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Properly cast database types to our interfaces
      const typedData = (data || []).map(reminder => ({
        ...reminder,
        reminder_type: reminder.reminder_type as AccountabilityReminder['reminder_type'],
        frequency: reminder.frequency as AccountabilityReminder['frequency']
      })) as AccountabilityReminder[];
      
      setReminders(typedData);
    } catch (error) {
      console.error('Error loading reminders:', error);
      toast.error('Failed to load reminders');
    }
  };

  const loadAlerts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('accountability_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Properly cast database types to our interfaces
      const typedData = (data || []).map(alert => ({
        ...alert,
        alert_type: alert.alert_type as AccountabilityAlert['alert_type'],
        severity: alert.severity as AccountabilityAlert['severity']
      })) as AccountabilityAlert[];
      
      setAlerts(typedData);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load alerts');
    }
  };

  const addSupportMember = async (memberData: Omit<SupportCircleMember, 'id' | 'user_id' | 'status' | 'created_at'>) => {
    if (!user) {
      console.error('No authenticated user when trying to add support member');
      throw new Error('You must be logged in to add support members');
    }

    console.log('Adding support member to database:', {
      user_id: user.id,
      member_name: memberData.member_name,
      member_email: memberData.member_email,
      relationship: memberData.relationship
    });

    try {
      // Generate secure invitation token using crypto.randomUUID()
      const invitationToken = crypto.randomUUID().replace(/-/g, '');

      // Set invitation expiration (48 hours from now)
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 48);

      const { data, error } = await supabase
        .from('support_circle_members')
        .insert({
          user_id: user.id,
          ...memberData,
          status: 'pending',
          invitation_token: invitationToken,
          invited_at: new Date().toISOString(),
          invitation_expires_at: expirationDate.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Database error when adding support member:', error);
        throw error;
      }
      
      console.log('Support member added to database successfully:', data);
      
      // Properly cast the returned data
      const typedData = {
        ...data,
        role: data.role as SupportCircleMember['role'],
        status: data.status as SupportCircleMember['status'],
        permissions: (data.permissions as any) || {},
        notification_preferences: (data.notification_preferences as any) || { email: true, sms: false }
      } as SupportCircleMember;
      
      setSupportCircle(prev => [typedData, ...prev]);
      console.log('Support circle updated in state');

      // Send invitation email if email is provided
      if (typedData.member_email) {
        try {
          console.log('Sending invitation email...');
          const emailResponse = await supabase.functions.invoke('send-support-invitation', {
            body: {
              memberName: typedData.member_name,
              memberEmail: typedData.member_email,
              inviterName: user.user_metadata?.name || user.email || 'MyRhythm User',
              relationship: typedData.relationship,
              role: typedData.role,
              invitationToken: invitationToken,
              expiresAt: expirationDate.toISOString()
            }
          });

          if (emailResponse.error) {
            console.error('Error sending invitation email:', emailResponse.error);
            // Don't throw here - the member was added successfully, just email failed
          } else {
            console.log('Invitation email sent successfully');
          }
        } catch (emailError) {
          console.error('Failed to send invitation email:', emailError);
          // Don't throw here - the member was added successfully, just email failed
        }
      }

      return typedData;
    } catch (error) {
      console.error('Error adding support member:', error);
      if (error.message?.includes('JWT')) {
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw error;
    }
  };

  const updateMemberPermissions = async (memberId: string, permissions: Partial<SupportCircleMember>) => {
    try {
      const { error } = await supabase
        .from('support_circle_members')
        .update(permissions)
        .eq('id', memberId);

      if (error) throw error;
      
      setSupportCircle(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, ...permissions }
            : member
        )
      );
      toast.success('Permissions updated');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  const createReminder = async (reminderData: Omit<AccountabilityReminder, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('accountability_reminders')
        .insert({
          user_id: user.id,
          ...reminderData
        })
        .select()
        .single();

      if (error) throw error;
      
      // Properly cast the returned data
      const typedData = {
        ...data,
        reminder_type: data.reminder_type as AccountabilityReminder['reminder_type'],
        frequency: data.frequency as AccountabilityReminder['frequency']
      } as AccountabilityReminder;
      
      setReminders(prev => [typedData, ...prev]);
      toast.success('Reminder created');
      return typedData;
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder');
      throw error;
    }
  };

  const generateAlert = async (
    alertType: AccountabilityAlert['alert_type'],
    title: string,
    message: string,
    relatedId?: string,
    severity: AccountabilityAlert['severity'] = 'info'
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('generate_accountability_alert', {
        p_user_id: user.id,
        p_alert_type: alertType,
        p_related_id: relatedId,
        p_title: title,
        p_message: message,
        p_severity: severity
      });

      if (error) throw error;
      
      // Reload alerts to get the new one
      loadAlerts();
      return data;
    } catch (error) {
      console.error('Error generating alert:', error);
      toast.error('Failed to send alert');
    }
  };

  const acknowledgeAlert = async (alertId: string, memberIdentifier: string) => {
    try {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;

      const updatedAcknowledged = [...alert.acknowledged_by, memberIdentifier];

      const { error } = await supabase
        .from('accountability_alerts')
        .update({ acknowledged_by: updatedAcknowledged })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged_by: updatedAcknowledged }
            : alert
        )
      );
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  };

  return {
    supportCircle,
    reminders,
    alerts,
    isLoading,
    addSupportMember,
    updateMemberPermissions,
    createReminder,
    generateAlert,
    acknowledgeAlert,
    loadSupportCircle,
    loadReminders,
    loadAlerts
  };
}
