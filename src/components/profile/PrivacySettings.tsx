
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  profileVisibility: z.string(),
  dataSharing: z.string(),
  communityParticipation: z.boolean(),
  anonymousMode: z.boolean(),
});

export function PrivacySettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileVisibility: "private",
      dataSharing: "none",
      communityParticipation: true,
      anonymousMode: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Privacy settings saved");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="profileVisibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Visibility</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public - Visible to all app users</SelectItem>
                  <SelectItem value="connections">Connections Only - Visible to your connections</SelectItem>
                  <SelectItem value="private">Private - Only visible to you</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Control who can see your profile information within the app
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dataSharing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health Data Sharing</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sharing preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No Sharing - Keep my data private</SelectItem>
                  <SelectItem value="healthcare">Healthcare Providers Only</SelectItem>
                  <SelectItem value="caregivers">Caregivers & Healthcare Providers</SelectItem>
                  <SelectItem value="research">Anonymized Research - Allow anonymous use for research</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose how your health data can be shared or used
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="communityParticipation"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="font-medium">Community Participation</FormLabel>
                <FormDescription>
                  Allow your profile to be visible in the community section
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="anonymousMode"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="font-medium">Anonymous Mode</FormLabel>
                <FormDescription>
                  Participate in community discussions with an anonymous username
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit">Save Privacy Settings</Button>
      </form>
    </Form>
  );
}
