
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFormContext } from "react-hook-form";
import { Check, Plus, X } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample community members - in a real app, these would come from an API or context
const communityMembers = [
  { id: "1", name: "Sarah Johnson", role: "family" },
  { id: "2", name: "Dr. Michael Smith", role: "healthcare" },
  { id: "3", name: "Mom", role: "family" },
  { id: "4", name: "Jane Roberts", role: "caregiver" },
  { id: "5", name: "Robert Wilson", role: "friend" },
  { id: "6", name: "Lisa Chen", role: "colleague" },
];

export function WatchersField() {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  
  const watcherIds = form.watch("watchers") || [];
  
  const handleToggleMember = (memberId: string) => {
    const currentWatchers = [...watcherIds];
    const index = currentWatchers.indexOf(memberId);
    
    if (index > -1) {
      currentWatchers.splice(index, 1);
    } else {
      currentWatchers.push(memberId);
    }
    
    form.setValue("watchers", currentWatchers, { shouldValidate: true });
  };
  
  const handleRemoveWatcher = (memberId: string) => {
    const currentWatchers = watcherIds.filter(id => id !== memberId);
    form.setValue("watchers", currentWatchers, { shouldValidate: true });
  };
  
  const getSelectedMembers = () => {
    return communityMembers.filter(member => watcherIds.includes(member.id));
  };
  
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
          
          <div className="flex flex-wrap gap-2 mt-2">
            {getSelectedMembers().map((member) => (
              <Badge key={member.id} variant="secondary" className="gap-1">
                {member.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveWatcher(member.id)} 
                />
              </Badge>
            ))}
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Watchers
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <h4 className="font-medium mb-2">Select Watchers</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  They will be notified when this action is added or updated
                </p>
                <ScrollArea className="h-60">
                  <div className="space-y-2">
                    {communityMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center space-x-2"
                      >
                        <Checkbox 
                          id={`watcher-${member.id}`}
                          checked={watcherIds.includes(member.id)}
                          onCheckedChange={() => handleToggleMember(member.id)}
                        />
                        <label 
                          htmlFor={`watcher-${member.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {member.name}
                          <span className="text-xs text-muted-foreground ml-2">
                            ({member.role})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-4 flex justify-end">
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
