
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
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
}

export interface AccountabilityReminder {
  id: string;
  user_id: string;
  created_by_member_id: string;
  title: string;
  description?: string;
  reminder_type: 'medication' | 'appointment' | 'activity' | 'custom';
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
    if (!user) return;
    loadSupportCircle();
    loadReminders();
    loadAlerts();
  }, [user]);

  const loadSupportCircle = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('support_circle_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle database string types vs TypeScript union types
      const typedData = (data || []).map(member => ({
        ...member,
        role: member.role as SupportCircleMember['role'],
        status: member.status as SupportCircleMember['status']
      }));
      
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
      
      // Type assertion to handle database string types vs TypeScript union types
      const typedData = (data || []).map(reminder => ({
        ...reminder,
        reminder_type: reminder.reminder_type as AccountabilityReminder['reminder_type'],
        frequency: reminder.frequency as AccountabilityReminder['frequency']
      }));
      
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
      
      // Type assertion to handle database string types vs TypeScript union types
      const typedData = (data || []).map(alert => ({
        ...alert,
        alert_type: alert.alert_type as AccountabilityAlert['alert_type'],
        severity: alert.severity as AccountabilityAlert['severity']
      }));
      
      setAlerts(typedData);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setIsLoading(false);
    }
  };

  const addSupportMember = async (memberData: Omit<SupportCircleMember, 'id' | 'user_id' | 'status' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_circle_members')
        .insert({
          user_id: user.id,
          ...memberData,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      const typedData = {
        ...data,
        role: data.role as SupportCircleMember['role'],
        status: data.status as SupportCircleMember['status']
      };
      
      setSupportCircle(prev => [typedData, ...prev]);
      toast.success(`${memberData.member_name} added to your support circle`);
      return typedData;
    } catch (error) {
      console.error('Error adding support member:', error);
      toast.error('Failed to add support member');
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
      
      // Type assertion for the returned data
      const typedData = {
        ...data,
        reminder_type: data.reminder_type as AccountabilityReminder['reminder_type'],
        frequency: data.frequency as AccountabilityReminder['frequency']
      };
      
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
