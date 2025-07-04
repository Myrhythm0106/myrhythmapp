
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function LocationField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location (Optional)</FormLabel>
          <FormControl>
            <Input placeholder="Where will this take place?" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
