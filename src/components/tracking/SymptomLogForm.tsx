
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const formSchema = z.object({
  symptomType: z.string().min(1, "Please select a symptom type"),
  severity: z.number().min(0).max(5),
  date: z.string().min(1, "Please enter a date"),
  time: z.string().min(1, "Please enter a time"),
  notes: z.string().optional(),
});

export function SymptomLogForm() {
  const [severity, setSeverity] = useState(3);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptomType: "",
      severity: 3,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Symptom logged successfully!");
    console.log(values);
    form.reset({
      symptomType: "",
      severity: 3,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      notes: "",
    });
    setSeverity(3);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="symptomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptom Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a symptom" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="headache">Headache</SelectItem>
                  <SelectItem value="dizziness">Dizziness</SelectItem>
                  <SelectItem value="fatigue">Fatigue</SelectItem>
                  <SelectItem value="nausea">Nausea</SelectItem>
                  <SelectItem value="memory">Memory Issues</SelectItem>
                  <SelectItem value="anxiety">Anxiety</SelectItem>
                  <SelectItem value="depression">Depression</SelectItem>
                  <SelectItem value="sleep">Sleep Disturbance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity (0-5)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    defaultValue={[field.value]}
                    max={5}
                    step={1}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                      setSeverity(vals[0]);
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>None</div>
                    <div>Mild</div>
                    <div>Moderate</div>
                    <div>Severe</div>
                    <div>Extreme</div>
                    <div>Unbearable</div>
                  </div>
                  <div className="text-center font-medium">
                    Current: {severity}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any additional details, potential triggers, or related activities" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Log Symptom</Button>
      </form>
    </Form>
  );
}
