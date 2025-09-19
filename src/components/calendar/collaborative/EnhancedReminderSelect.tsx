import React, { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Clock, 
  Calendar, 
  Plus, 
  X, 
  Smartphone, 
  Mail, 
  MessageCircle 
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface ReminderOption {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  category: 'minutes' | 'hours' | 'days' | 'weeks';
}

const reminderOptions: ReminderOption[] = [
  // Minutes
  { id: 'at_time', label: 'At event time', value: '0_minutes', icon: <Bell className="h-3 w-3" />, category: 'minutes' },
  { id: '5_min', label: '5 minutes before', value: '5_minutes', icon: <Clock className="h-3 w-3" />, category: 'minutes' },
  { id: '15_min', label: '15 minutes before', value: '15_minutes', icon: <Clock className="h-3 w-3" />, category: 'minutes' },
  { id: '30_min', label: '30 minutes before', value: '30_minutes', icon: <Clock className="h-3 w-3" />, category: 'minutes' },
  
  // Hours
  { id: '1_hour', label: '1 hour before', value: '1_hour', icon: <Clock className="h-3 w-3" />, category: 'hours' },
  { id: '2_hour', label: '2 hours before', value: '2_hours', icon: <Clock className="h-3 w-3" />, category: 'hours' },
  { id: '4_hour', label: '4 hours before', value: '4_hours', icon: <Clock className="h-3 w-3" />, category: 'hours' },
  
  // Days
  { id: '1_day', label: '1 day before', value: '1_day', icon: <Calendar className="h-3 w-3" />, category: 'days' },
  { id: '2_day', label: '2 days before', value: '2_days', icon: <Calendar className="h-3 w-3" />, category: 'days' },
  { id: '3_day', label: '3 days before', value: '3_days', icon: <Calendar className="h-3 w-3" />, category: 'days' },
  { id: '7_day', label: '1 week before', value: '7_days', icon: <Calendar className="h-3 w-3" />, category: 'weeks' },
];

interface ReminderMethod {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const reminderMethods: ReminderMethod[] = [
  {
    id: 'push',
    label: 'Push Notification',
    icon: <Smartphone className="h-4 w-4" />,
    description: 'Mobile and desktop notifications'
  },
  {
    id: 'email',
    label: 'Email',
    icon: <Mail className="h-4 w-4" />,
    description: 'Send reminder via email'
  },
  {
    id: 'sms',
    label: 'SMS Text',
    icon: <MessageCircle className="h-4 w-4" />,
    description: 'Text message reminder (Premium)'
  }
];

export function EnhancedReminderSelect() {
  const { control, setValue, watch } = useFormContext();
  const [selectedReminders, setSelectedReminders] = useState<string[]>(['30_minutes']);
  const [selectedMethods, setSelectedMethods] = useState<string[]>(['push']);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addReminder = (reminderValue: string) => {
    if (!selectedReminders.includes(reminderValue)) {
      const newReminders = [...selectedReminders, reminderValue];
      setSelectedReminders(newReminders);
      setValue('reminders', newReminders);
    }
  };

  const removeReminder = (reminderValue: string) => {
    const newReminders = selectedReminders.filter(r => r !== reminderValue);
    setSelectedReminders(newReminders);
    setValue('reminders', newReminders);
  };

  const toggleMethod = (methodId: string) => {
    const newMethods = selectedMethods.includes(methodId)
      ? selectedMethods.filter(m => m !== methodId)
      : [...selectedMethods, methodId];
    setSelectedMethods(newMethods);
    setValue('reminderMethods', newMethods);
  };

  const getReminderLabel = (value: string) => {
    return reminderOptions.find(opt => opt.value === value)?.label || value;
  };

  const getCategoryOptions = (category: string) => {
    return reminderOptions.filter(opt => opt.category === category);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="reminders"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders
            </FormLabel>
            <FormDescription>
              Set multiple reminders for this event. Choose when and how you want to be notified.
            </FormDescription>

            {/* Selected Reminders */}
            {selectedReminders.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedReminders.map((reminder) => (
                  <Badge key={reminder} variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getReminderLabel(reminder)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground ml-1"
                      onClick={() => removeReminder(reminder)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick Reminder Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {reminderOptions.slice(0, 8).map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant={selectedReminders.includes(option.value) ? "default" : "outline"}
                  size="sm"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => addReminder(option.value)}
                  disabled={selectedReminders.includes(option.value)}
                >
                  {option.icon}
                  <span className="ml-2 text-xs">{option.label}</span>
                </Button>
              ))}
            </div>

            {/* Advanced Options Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </Button>

            {/* Advanced Reminder Options */}
            {showAdvanced && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">More Reminder Times</h4>
                  
                  {/* Days and Weeks */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Days & Weeks</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {getCategoryOptions('days').concat(getCategoryOptions('weeks')).map((option) => (
                        <Button
                          key={option.id}
                          type="button"
                          variant={selectedReminders.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          className="justify-start text-xs"
                          onClick={() => addReminder(option.value)}
                          disabled={selectedReminders.includes(option.value)}
                        >
                          {option.icon}
                          <span className="ml-1">{option.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      {/* Reminder Methods */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Notification Methods
        </Label>
        <div className="space-y-2">
          {reminderMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={method.id}
                checked={selectedMethods.includes(method.id)}
                onCheckedChange={() => toggleMethod(method.id)}
                disabled={method.id === 'sms'} // Premium feature
              />
              <div className="flex items-center gap-2 flex-1">
                <div className="p-1.5 bg-primary/10 rounded">
                  {method.icon}
                </div>
                <div>
                  <Label htmlFor={method.id} className="text-sm font-medium cursor-pointer">
                    {method.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
              </div>
              {method.id === 'sms' && (
                <Badge variant="secondary" className="text-xs">Premium</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}