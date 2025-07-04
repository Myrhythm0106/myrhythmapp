
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Calendar, CalendarCheck, CalendarPlus, Check, Flag, ListCheck, Target, Star, Dumbbell, Footprints, HeartPulse, Users, Plus } from 'lucide-react';

export function ActionTypeSelect() {
  const { control, watch, setValue } = useFormContext();
  const isGoal = watch('isGoal');
  const actionType = watch('type');

  const actionTypes = [
    { value: 'daily_win', label: 'Daily Victory', icon: <Star className="h-4 w-4" />, category: 'personal' },
    { value: 'appointment', label: 'Appointment', icon: <Calendar className="h-4 w-4" />, category: 'scheduled' },
    { value: 'gym', label: 'Gym/Fitness', icon: <Dumbbell className="h-4 w-4" />, category: 'physical' },
    { value: 'steps', label: 'Walking/Steps', icon: <Footprints className="h-4 w-4" />, category: 'physical' },
    { value: 'therapy', label: 'Therapy/Medical', icon: <HeartPulse className="h-4 w-4" />, category: 'health' },
    { value: 'meeting', label: 'Meeting', icon: <Users className="h-4 w-4" />, category: 'social' },
    { value: 'task', label: 'Task', icon: <Check className="h-4 w-4" />, category: 'productivity' },
    { value: 'reminder', label: 'Reminder', icon: <CalendarPlus className="h-4 w-4" />, category: 'personal' },
    { value: 'custom', label: 'Other (specify)', icon: <Plus className="h-4 w-4" />, category: 'custom' }
  ];
  
  const goalTypes = [
    { value: 'daily', label: 'Daily Goal', icon: <Flag className="h-4 w-4" /> },
    { value: 'weekly', label: 'Weekly Goal', icon: <Flag className="h-4 w-4" /> },
    { value: 'monthly', label: 'Monthly Goal', icon: <Target className="h-4 w-4" /> },
    { value: 'long-term', label: 'Long-term Goal', icon: <ListCheck className="h-4 w-4" /> },
  ];

  const handleGoalToggleChange = (checked: boolean) => {
    setValue('isGoal', checked);
    if (checked) {
      setValue('type', 'daily');
    } else {
      setValue('type', 'daily_win');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <FormLabel>Action Type</FormLabel>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Is Goal</span>
          <Switch 
            checked={isGoal} 
            onCheckedChange={handleGoalToggleChange}
          />
        </div>
      </div>
      
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Action Type" />
                </SelectTrigger>
                <SelectContent>
                  {isGoal ? (
                    goalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="flex items-center gap-2">
                        <span className="flex items-center gap-2">
                          {type.icon} {type.label}
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    actionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="flex items-center gap-2">
                        <span className="flex items-center gap-2">
                          {type.icon} {type.label}
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Custom Reason Field for Other Actions */}
      {actionType === 'custom' && !isGoal && (
        <FormField
          control={control}
          name="customReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specify the reason</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Personal care, Hobby time, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
