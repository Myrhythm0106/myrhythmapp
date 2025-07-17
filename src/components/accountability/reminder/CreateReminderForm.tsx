
import React, { useState } from 'react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReminderBasicInfo } from './ReminderBasicInfo';
import { ReminderScheduling } from './ReminderScheduling';
import { ReminderEscalation } from './ReminderEscalation';
import { ReminderVolumeIntensity } from './ReminderVolumeIntensity';
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
    reminder_type: 'custom' as 'medication' | 'appointment' | 'activity' | 'safety' | 'custom',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly' | 'once',
    reminder_time: '09:00',
    reminder_days: [] as number[],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    escalation_enabled: false,
    escalation_delay_minutes: 30,
    escalation_members: [] as string[],
    // Volume and intensity settings
    volume: 7,
    vibration_enabled: true,
    vibration_intensity: 'medium' as 'gentle' | 'medium' | 'strong',
    alert_types: ['audio', 'vibration'],
    voice_note_url: ''
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
        escalation_members: [],
        volume: 7,
        vibration_enabled: true,
        vibration_intensity: 'medium',
        alert_types: ['audio', 'vibration'],
        voice_note_url: ''
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

  const handleAlertTypeToggle = (type: string) => {
    setNewReminder(prev => ({
      ...prev,
      alert_types: prev.alert_types.includes(type)
        ? prev.alert_types.filter(t => t !== type)
        : [...prev.alert_types, type]
    }));
  };

  const handleVoiceNoteUpload = async (file: File) => {
    // In a real implementation, you would upload to storage
    // For now, we'll create a local URL
    const url = URL.createObjectURL(file);
    setNewReminder(prev => ({ ...prev, voice_note_url: url }));
    toast.success('Voice note uploaded successfully!');
  };

  const isFormValid = newReminder.title && newReminder.reminder_time;

  return (
    <ScrollArea className="max-h-[70vh] w-full">
      <div className="grid gap-4 py-4 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-teal-50/30 rounded-lg p-4 border-l border-emerald-300/20">
      <ReminderBasicInfo
        title={newReminder.title}
        description={newReminder.description}
        reminderType={newReminder.reminder_type}
        onTitleChange={(title) => setNewReminder(prev => ({ ...prev, title }))}
        onDescriptionChange={(description) => setNewReminder(prev => ({ ...prev, description }))}
        onTypeChange={(reminder_type) => setNewReminder(prev => ({ 
          ...prev, 
          reminder_type: reminder_type as 'medication' | 'appointment' | 'activity' | 'safety' | 'custom'
        }))}
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

      <ReminderVolumeIntensity
        volume={newReminder.volume}
        vibrationEnabled={newReminder.vibration_enabled}
        vibrationIntensity={newReminder.vibration_intensity}
        alertTypes={newReminder.alert_types}
        voiceNoteUrl={newReminder.voice_note_url}
        onVolumeChange={(volume) => setNewReminder(prev => ({ ...prev, volume }))}
        onVibrationToggle={(vibration_enabled) => setNewReminder(prev => ({ ...prev, vibration_enabled }))}
        onVibrationIntensityChange={(vibration_intensity) => setNewReminder(prev => ({ ...prev, vibration_intensity }))}
        onAlertTypeToggle={handleAlertTypeToggle}
        onVoiceNoteUpload={handleVoiceNoteUpload}
      />

      </div>
      
      {/* Sticky bottom actions */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4 mt-4">
        <ReminderFormActions
          onClose={onClose}
          onSubmit={handleCreateReminder}
          isValid={!!isFormValid}
        />
      </div>
    </ScrollArea>
  );
}
