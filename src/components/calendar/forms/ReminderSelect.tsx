
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';

export function ReminderSelect() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="reminders"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Reminder</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select reminder time" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">No reminder</SelectItem>
              <SelectItem value="5min">5 minutes before</SelectItem>
              <SelectItem value="15min">15 minutes before</SelectItem>
              <SelectItem value="30min">30 minutes before</SelectItem>
              <SelectItem value="1hour">1 hour before</SelectItem>
              <SelectItem value="1day">1 day before</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
