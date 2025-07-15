
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AssessmentData {
  id: string;
  assessmentType: 'brief' | 'comprehensive';
  responses: Record<string, any>;
  recommendations?: Record<string, any>;
  completedAt: string;
}

export interface AssessmentReminder {
  id: string;
  reminderType: string;
  scheduledFor: string;
  isActive: boolean;
}

export function useAssessmentManager() {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [reminders, setReminders] = useState<AssessmentReminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const saveAssessment = async (
    assessmentType: 'brief' | 'comprehensive',
    responses: Record<string, any>,
    recommendations?: Record<string, any>
  ) => {
    setIsLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      const assessmentData: AssessmentData = {
        id: crypto.randomUUID(),
        assessmentType,
        responses,
        recommendations,
        completedAt: new Date().toISOString(),
      };

      // Try to save to database, fall back to localStorage
      try {
        const { error } = await supabase
          .from('user_assessments')
          .insert({
            user_id: user.data.user.id,
            assessment_type: assessmentType,
            responses,
            recommendations,
          });

        if (error) throw error;
      } catch (dbError) {
        console.log('Database not available, using localStorage:', dbError);
        // Fallback to localStorage
        const existingAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
        existingAssessments.push(assessmentData);
        localStorage.setItem('assessments', JSON.stringify(existingAssessments));
      }

      // Schedule reminder for comprehensive assessment if brief was completed
      if (assessmentType === 'brief') {
        await scheduleUpgradeReminder(assessmentData.id);
      }

      setAssessments(prev => [...prev, assessmentData]);
      toast.success('Assessment saved successfully!');
      
      return assessmentData.id;
    } catch (error: any) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleUpgradeReminder = async (assessmentId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 7); // 7 days from now

      const reminderData: AssessmentReminder = {
        id: crypto.randomUUID(),
        reminderType: 'comprehensive_upgrade',
        scheduledFor: reminderDate.toISOString(),
        isActive: true,
      };

      // Try to save to database, fall back to localStorage
      try {
        const { error } = await supabase
          .from('assessment_reminders')
          .insert({
            user_id: user.data.user.id,
            assessment_id: assessmentId,
            reminder_type: 'comprehensive_upgrade',
            scheduled_for: reminderDate.toISOString(),
          });

        if (error) throw error;
      } catch (dbError) {
        console.log('Database not available for reminders, using localStorage:', dbError);
        // Fallback to localStorage
        const existingReminders = JSON.parse(localStorage.getItem('assessment_reminders') || '[]');
        existingReminders.push(reminderData);
        localStorage.setItem('assessment_reminders', JSON.stringify(existingReminders));
      }

      setReminders(prev => [...prev, reminderData]);
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  };

  const loadAssessments = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Try to load from database, fall back to localStorage
      try {
        const { data, error } = await supabase
          .from('user_assessments')
          .select('*')
          .eq('user_id', user.data.user.id)
          .order('completed_at', { ascending: false });

        if (error) throw error;

        const formattedData: AssessmentData[] = (data || []).map(item => ({
          id: item.id,
          assessmentType: item.assessment_type as 'brief' | 'comprehensive',
          responses: item.responses || {},
          recommendations: item.recommendations || undefined,
          completedAt: item.completed_at,
        }));

        setAssessments(formattedData);
      } catch (dbError) {
        console.log('Database not available, loading from localStorage:', dbError);
        // Fallback to localStorage
        const localAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
        setAssessments(localAssessments);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    }
  };

  const loadReminders = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Try to load from database, fall back to localStorage
      try {
        const { data, error } = await supabase
          .from('assessment_reminders')
          .select('*')
          .eq('user_id', user.data.user.id)
          .eq('is_active', true)
          .order('scheduled_for', { ascending: true });

        if (error) throw error;

        const formattedData: AssessmentReminder[] = (data || []).map(item => ({
          id: item.id,
          reminderType: item.reminder_type,
          scheduledFor: item.scheduled_for,
          isActive: item.is_active,
        }));

        setReminders(formattedData);
      } catch (dbError) {
        console.log('Database not available for reminders, loading from localStorage:', dbError);
        // Fallback to localStorage
        const localReminders = JSON.parse(localStorage.getItem('assessment_reminders') || '[]');
        setReminders(localReminders);
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const getActiveReminders = () => {
    const now = new Date();
    return reminders.filter(reminder => 
      reminder.isActive && new Date(reminder.scheduledFor) <= now
    );
  };

  const dismissReminder = async (reminderId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Try to update in database, fall back to localStorage
      try {
        const { error } = await supabase
          .from('assessment_reminders')
          .update({ 
            is_active: false,
            acknowledged_at: new Date().toISOString()
          })
          .eq('id', reminderId);

        if (error) throw error;
      } catch (dbError) {
        console.log('Database not available, updating localStorage:', dbError);
        // Fallback to localStorage
        const existingReminders = JSON.parse(localStorage.getItem('assessment_reminders') || '[]');
        const updatedReminders = existingReminders.map((reminder: AssessmentReminder) =>
          reminder.id === reminderId ? { ...reminder, isActive: false } : reminder
        );
        localStorage.setItem('assessment_reminders', JSON.stringify(updatedReminders));
      }

      setReminders(prev => prev.map(reminder =>
        reminder.id === reminderId ? { ...reminder, isActive: false } : reminder
      ));
    } catch (error) {
      console.error('Error dismissing reminder:', error);
    }
  };

  useEffect(() => {
    loadAssessments();
    loadReminders();
  }, []);

  return {
    assessments,
    reminders,
    isLoading,
    saveAssessment,
    getActiveReminders,
    dismissReminder,
    loadAssessments,
    loadReminders,
  };
}
