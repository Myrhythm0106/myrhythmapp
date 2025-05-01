
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export function LocationField() {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location (Optional)</FormLabel>
          <FormControl>
            <Input placeholder="Enter location" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
