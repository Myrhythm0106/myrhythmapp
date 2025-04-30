
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  condition: z.string().min(1, "Condition is required"),
  diagnosisDate: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

export function MedicalInfoForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: "tbi",
      diagnosisDate: "2023-08-15",
      medications: "Amitriptyline 25mg, Vitamin D 2000IU",
      allergies: "Penicillin",
      notes: "Mild traumatic brain injury from car accident. Ongoing symptoms include occasional headaches and fatigue.",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Medical information updated");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tbi">Traumatic Brain Injury</SelectItem>
                    <SelectItem value="stroke">Stroke</SelectItem>
                    <SelectItem value="bipolar">Bipolar Disorder</SelectItem>
                    <SelectItem value="schizophrenia">Schizophrenia</SelectItem>
                    <SelectItem value="other">Other Condition</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diagnosisDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Diagnosis</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Medications</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List medications and dosages" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Input 
                  placeholder="List any allergies" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional information about your condition" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Medical Information</Button>
      </form>
    </Form>
  );
}
