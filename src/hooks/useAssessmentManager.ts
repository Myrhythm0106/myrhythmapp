
import { useState, useEffect } from 'react';
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
      const assessmentData: AssessmentData = {
        id: crypto.randomUUID(),
        assessmentType,
        responses,
        recommendations,
        completedAt: new Date().toISOString(),
      };

      // Use localStorage for now since database tables don't exist yet
      const existingAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      existingAssessments.push(assessmentData);
      localStorage.setItem('assessments', JSON.stringify(existingAssessments));

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
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 90); // 3 months from now

      const reminderData: AssessmentReminder = {
        id: crypto.randomUUID(),
        reminderType: 'comprehensive_upgrade',
        scheduledFor: reminderDate.toISOString(),
        isActive: true,
      };

      // Use localStorage for now
      const existingReminders = JSON.parse(localStorage.getItem('assessment_reminders') || '[]');
      existingReminders.push(reminderData);
      localStorage.setItem('assessment_reminders', JSON.stringify(existingReminders));

      setReminders(prev => [...prev, reminderData]);
    } catch (error) {
      console.error('Error scheduling reminder:', error);
    }
  };

  const loadAssessments = async () => {
    try {
      // Load from localStorage for now
      const localAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      setAssessments(localAssessments);
    } catch (error) {
      console.error('Error loading assessments:', error);
    }
  };

  const loadReminders = async () => {
    try {
      // Load from localStorage for now
      const localReminders = JSON.parse(localStorage.getItem('assessment_reminders') || '[]');
      setReminders(localReminders);
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
      // Update localStorage
      const existingReminders = JSON.parse(localStorage.getItem('assessment_reminders') || '[]');
      const updatedReminders = existingReminders.map((reminder: AssessmentReminder) =>
        reminder.id === reminderId ? { ...reminder, isActive: false } : reminder
      );
      localStorage.setItem('assessment_reminders', JSON.stringify(updatedReminders));

      setReminders(prev => prev.map(reminder =>
        reminder.id === reminderId ? { ...reminder, isActive: false } : reminder
      ));
    } catch (error) {
      console.error('Error dismissing reminder:', error);
    }
  };

  // Add the missing methods
  const acknowledgeReminder = async (reminderId: string) => {
    await dismissReminder(reminderId);
  };

  const hasBriefOnly = () => {
    return assessments.some(a => a.assessmentType === 'brief') && 
           !assessments.some(a => a.assessmentType === 'comprehensive');
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
    acknowledgeReminder,
    hasBriefOnly,
    loadAssessments,
    loadReminders,
  };
}
