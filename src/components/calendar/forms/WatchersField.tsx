
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function WatchersField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="watchers"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notify Others (Optional)</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter email addresses separated by commas"
              {...field}
              onChange={(e) => field.onChange(e.target.value.split(',').map(email => email.trim()).filter(Boolean))}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
