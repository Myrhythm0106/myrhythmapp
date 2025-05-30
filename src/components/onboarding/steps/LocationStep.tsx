
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const locationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  town: z.string().min(1, "Town is required"),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationStepProps {
  onComplete: (values: LocationFormValues) => void;
  initialValues?: LocationFormValues;
}

export function LocationStep({ onComplete, initialValues }: LocationStepProps) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: initialValues || {
      country: "",
      state: "",
      town: "",
    }
  });
  
  function onSubmit(values: LocationFormValues) {
    onComplete(values);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter your country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter your state" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="town"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Town <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter your town" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
