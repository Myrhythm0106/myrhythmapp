
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { toast } from 'sonner';
import { DaySelector } from './DaySelector';

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
      toast.error('Please fill in required fields');
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

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={newReminder.title}
            onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Take medication, Exercise, etc."
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select 
            value={newReminder.reminder_type} 
            onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, reminder_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
              <SelectItem value="safety">Safety Check</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={newReminder.description}
          onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Additional details about this reminder..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select 
            value={newReminder.frequency} 
            onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, frequency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Once</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={newReminder.reminder_time}
            onChange={(e) => setNewReminder(prev => ({ ...prev, reminder_time: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={newReminder.start_date}
            onChange={(e) => setNewReminder(prev => ({ ...prev, start_date: e.target.value }))}
          />
        </div>
      </div>

      {newReminder.frequency === 'weekly' && (
        <DaySelector 
          selectedDays={newReminder.reminder_days}
          onDayToggle={handleDayToggle}
        />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="escalation">Enable Escalation</Label>
          <Switch
            id="escalation"
            checked={newReminder.escalation_enabled}
            onCheckedChange={(checked) => setNewReminder(prev => ({ ...prev, escalation_enabled: checked }))}
          />
        </div>

        {newReminder.escalation_enabled && (
          <div>
            <Label htmlFor="escalation-delay">Escalation Delay (minutes)</Label>
            <Input
              id="escalation-delay"
              type="number"
              value={newReminder.escalation_delay_minutes}
              onChange={(e) => setNewReminder(prev => ({ 
                ...prev, 
                escalation_delay_minutes: parseInt(e.target.value) || 30 
              }))}
              placeholder="30"
            />
            <p className="text-xs text-muted-foreground mt-1">
              If you don't respond, support circle members will be notified after this delay
            </p>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="end-date">End Date (Optional)</Label>
        <Input
          id="end-date"
          type="date"
          value={newReminder.end_date}
          onChange={(e) => setNewReminder(prev => ({ ...prev, end_date: e.target.value }))}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleCreateReminder}>
          Create Reminder
        </Button>
      </div>
    </div>
  );
}
