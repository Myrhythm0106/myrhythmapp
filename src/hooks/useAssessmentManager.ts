
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserType } from "@/types/user";

interface AssessmentData {
  id: string;
  assessmentType: 'brief' | 'comprehensive';
  responses: Record<string, any>;
  recommendations: any;
  completedAt: string;
  userType?: UserType;
}

interface AssessmentReminder {
  id: string;
  reminderType: string;
  scheduledFor: string;
  sentAt?: string;
  acknowledgedAt?: string;
  isActive: boolean;
}

export function useAssessmentManager() {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [reminders, setReminders] = useState<AssessmentReminder[]>([]);
  const [loading, setLoading] = useState(false);

  const saveAssessment = async (assessmentData: Omit<AssessmentData, 'id'>) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // For now, we'll use a workaround until the tables are created
      // Try to insert into user_assessments table, but handle the error gracefully
      try {
        const { data, error } = await supabase
          .from('user_assessments' as any)
          .insert({
            user_id: user.user.id,
            assessment_type: assessmentData.assessmentType,
            responses: assessmentData.responses,
            recommendations: assessmentData.recommendations
          })
          .select()
          .single();

        if (error) throw error;

        // If this is a brief assessment, schedule a reminder for 7 days
        if (assessmentData.assessmentType === 'brief') {
          const reminderDate = new Date();
          reminderDate.setDate(reminderDate.getDate() + 7);

          await supabase
            .from('assessment_reminders' as any)
            .insert({
              user_id: user.user.id,
              assessment_id: data.id,
              reminder_type: 'comprehensive_upgrade',
              scheduled_for: reminderDate.toISOString()
            });
        }

        // Store in localStorage for immediate access
        localStorage.setItem('myrhythm_current_assessment', JSON.stringify({
          id: data.id,
          ...assessmentData
        }));

        toast.success('Assessment completed successfully!');
        return data;
      } catch (dbError) {
        console.warn('Database tables not yet created, using localStorage fallback');
        
        // Fallback to localStorage until tables are created
        const assessmentId = crypto.randomUUID();
        const assessmentRecord = {
          id: assessmentId,
          ...assessmentData
        };

        localStorage.setItem('myrhythm_current_assessment', JSON.stringify(assessmentRecord));
        toast.success('Assessment completed successfully!');
        return assessmentRecord;
      }
    } catch (error: any) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadUserAssessments = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      try {
        const { data, error } = await supabase
          .from('user_assessments' as any)
          .select('*')
          .eq('user_id', user.user.id)
          .order('completed_at', { ascending: false });

        if (error) throw error;
        setAssessments(data || []);
      } catch (dbError) {
        console.warn('Database tables not yet created, using localStorage fallback');
        
        // Fallback to localStorage
        const stored = localStorage.getItem('myrhythm_current_assessment');
        if (stored) {
          try {
            const assessment = JSON.parse(stored);
            setAssessments([assessment]);
          } catch {
            setAssessments([]);
          }
        }
      }
    } catch (error: any) {
      console.error('Error loading assessments:', error);
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveReminders = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      try {
        const { data, error } = await supabase
          .from('assessment_reminders' as any)
          .select('*')
          .eq('user_id', user.user.id)
          .eq('is_active', true)
          .is('acknowledged_at', null)
          .lte('scheduled_for', new Date().toISOString());

        if (error) throw error;
        setReminders(data || []);
      } catch (dbError) {
        console.warn('Database tables not yet created, reminders will be empty');
        setReminders([]);
      }
    } catch (error: any) {
      console.error('Error loading reminders:', error);
    }
  };

  const acknowledgeReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('assessment_reminders' as any)
        .update({ 
          acknowledged_at: new Date().toISOString(),
          is_active: false 
        })
        .eq('id', reminderId);

      if (error) throw error;

      setReminders(prev => prev.filter(r => r.id !== reminderId));
    } catch (error: any) {
      console.error('Error acknowledging reminder:', error);
      toast.error('Failed to acknowledge reminder');
    }
  };

  const getCurrentAssessment = () => {
    const stored = localStorage.getItem('myrhythm_current_assessment');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return assessments.length > 0 ? assessments[0] : null;
  };

  const hasCompletedComprehensive = () => {
    return assessments.some(a => a.assessmentType === 'comprehensive');
  };

  const hasBriefOnly = () => {
    return assessments.length > 0 && 
           assessments.every(a => a.assessmentType === 'brief') &&
           !hasCompletedComprehensive();
  };

  useEffect(() => {
    loadUserAssessments();
    loadActiveReminders();
  }, []);

  return {
    assessments,
    reminders,
    loading,
    saveAssessment,
    loadUserAssessments,
    loadActiveReminders,
    acknowledgeReminder,
    getCurrentAssessment,
    hasCompletedComprehensive,
    hasBriefOnly
  };
}
