
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

export function WatchersField() {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="watchers"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Accountability Watchers (Optional)</FormLabel>
          <FormDescription>
            Add community members who will be notified about this action
          </FormDescription>
          <div className="mt-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => console.log("Open watcher selector")}
            >
              Add Watchers
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
