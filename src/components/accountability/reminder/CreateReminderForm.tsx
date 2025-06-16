
import React, { useState } from 'react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { toast } from 'sonner';
import { ReminderBasicInfo } from './ReminderBasicInfo';
import { ReminderScheduling } from './ReminderScheduling';
import { ReminderEscalation } from './ReminderEscalation';
import { ReminderFormActions } from './ReminderFormActions';

interface CreateReminderFormProps {
  onClose: () => void;
}

export function CreateReminderForm({ onClose }: CreateReminderFormProps) {
  const { createReminder } = useAccountabilitySystem();
  
  const [newReminder, setNewReminder] = useState({
    created_by_member_id: 'self',
    title: '',
    description: '',
    reminder_type: 'custom' as const,
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly' | 'once',
    reminder_time: '09:00',
    reminder_days: [] as number[],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    escalation_enabled: false,
    escalation_delay_minutes: 30,
    escalation_members: [] as string[]
  });

  const handleCreateReminder = async () => {
    if (!newReminder.title || !newReminder.reminder_time) {
      toast.error('Let\'s make sure we have everything we need to set you up for success');
      return;
    }

    try {
      await createReminder(newReminder);
      onClose();
      setNewReminder({
        created_by_member_id: 'self',
        title: '',
        description: '',
        reminder_type: 'custom',
        frequency: 'daily',
        reminder_time: '09:00',
        reminder_days: [],
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true,
        escalation_enabled: false,
        escalation_delay_minutes: 30,
        escalation_members: []
      });
      toast.success('Perfect! Your reminder is all set up to help you succeed! 🎉');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDayToggle = (day: number, checked: boolean) => {
    setNewReminder(prev => ({
      ...prev,
      reminder_days: checked 
        ? [...prev.reminder_days, day].sort()
        : prev.reminder_days.filter(d => d !== day)
    }));
  };

  const isFormValid = newReminder.title && newReminder.reminder_time;

  return (
    <div className="grid gap-4 py-4">
      <ReminderBasicInfo
        title={newReminder.title}
        description={newReminder.description}
        reminderType={newReminder.reminder_type}
        onTitleChange={(title) => setNewReminder(prev => ({ ...prev, title }))}
        onDescriptionChange={(description) => setNewReminder(prev => ({ ...prev, description }))}
        onTypeChange={(reminder_type: any) => setNewReminder(prev => ({ ...prev, reminder_type }))}
      />

      <ReminderScheduling
        frequency={newReminder.frequency}
        reminderTime={newReminder.reminder_time}
        startDate={newReminder.start_date}
        endDate={newReminder.end_date}
        reminderDays={newReminder.reminder_days}
        onFrequencyChange={(frequency) => setNewReminder(prev => ({ ...prev, frequency }))}
        onTimeChange={(reminder_time) => setNewReminder(prev => ({ ...prev, reminder_time }))}
        onStartDateChange={(start_date) => setNewReminder(prev => ({ ...prev, start_date }))}
        onEndDateChange={(end_date) => setNewReminder(prev => ({ ...prev, end_date }))}
        onDayToggle={handleDayToggle}
      />

      <ReminderEscalation
        escalationEnabled={newReminder.escalation_enabled}
        escalationDelayMinutes={newReminder.escalation_delay_minutes}
        onEscalationToggle={(escalation_enabled) => setNewReminder(prev => ({ ...prev, escalation_enabled }))}
        onDelayChange={(escalation_delay_minutes) => setNewReminder(prev => ({ ...prev, escalation_delay_minutes }))}
      />

      <ReminderFormActions
        onClose={onClose}
        onSubmit={handleCreateReminder}
        isValid={isFormValid}
      />
    </div>
  );
}
