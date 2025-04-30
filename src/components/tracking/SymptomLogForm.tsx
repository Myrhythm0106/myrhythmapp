
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const formSchema = z.object({
  symptomType: z.string().min(1, "Please select a symptom type"),
  severity: z.number().min(0).max(5),
  date: z.string().min(1, "Please enter a date"),
  time: z.string().min(1, "Please enter a time"),
  notes: z.string().optional(),
  // Add blood pressure and steps fields
  trackBloodPressure: z.boolean().default(false),
  systolic: z.string().optional(),
  diastolic: z.string().optional(),
  trackSteps: z.boolean().default(false),
  steps: z.string().optional(),
});

export function SymptomLogForm() {
  const [severity, setSeverity] = useState(3);
  const [trackBloodPressure, setTrackBloodPressure] = useState(false);
  const [trackSteps, setTrackSteps] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptomType: "",
      severity: 3,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      notes: "",
      trackBloodPressure: false,
      systolic: "",
      diastolic: "",
      trackSteps: false,
      steps: "",
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
      trackBloodPressure: false,
      systolic: "",
      diastolic: "",
      trackSteps: false,
      steps: "",
    });
    setSeverity(3);
    setTrackBloodPressure(false);
    setTrackSteps(false);
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

        {/* Blood Pressure Tracking */}
        <FormField
          control={form.control}
          name="trackBloodPressure"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Blood Pressure</FormLabel>
                <FormDescription>
                  Track your blood pressure readings
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setTrackBloodPressure(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {trackBloodPressure && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-l-4 border-primary pl-4">
            <FormField
              control={form.control}
              name="systolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Systolic (mmHg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="120" {...field} />
                  </FormControl>
                  <FormDescription>Top number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diastolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diastolic (mmHg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="80" {...field} />
                  </FormControl>
                  <FormDescription>Bottom number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step Tracking */}
        <FormField
          control={form.control}
          name="trackSteps"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Steps</FormLabel>
                <FormDescription>
                  Track your daily step count
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setTrackSteps(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {trackSteps && (
          <div className="border-l-4 border-primary pl-4">
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Step Count</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000" {...field} />
                  </FormControl>
                  <FormDescription>Number of steps taken today</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

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
