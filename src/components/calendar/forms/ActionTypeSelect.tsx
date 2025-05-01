
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function ActionTypeSelect() {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="actionType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Action Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="appointment">Medical Appointment</SelectItem>
              <SelectItem value="therapy">Therapy Session</SelectItem>
              <SelectItem value="medication">Medication Reminder</SelectItem>
              <SelectItem value="activity">Daily Activity</SelectItem>
              <SelectItem value="personal">Personal Action</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
