import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Calendar, CalendarCheck, CalendarPlus, Check, Flag, ListCheck, Target } from 'lucide-react';

export function ActionTypeSelect() {
  const { control, watch, setValue } = useFormContext();
  const isGoal = watch('isGoal');

  const actionTypes = [
    { value: 'appointment', label: 'Appointment', icon: <Calendar className="h-4 w-4" /> },
    { value: 'meeting', label: 'Meeting', icon: <CalendarCheck className="h-4 w-4" /> },
    { value: 'task', label: 'Task', icon: <Check className="h-4 w-4" /> },
    { value: 'reminder', label: 'Reminder', icon: <CalendarPlus className="h-4 w-4" /> },
    { value: 'goal', label: 'Goal', icon: <Target className="h-4 w-4" /> },
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
      setValue('actionType', 'goal');
    } else {
      setValue('actionType', '');
    }
  };
  
  return (
    <>
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
        name="actionType"
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
    </>
  );
}
