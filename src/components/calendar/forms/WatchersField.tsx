
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Check, Plus, X, Eye } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WatchersDisplay } from "@/components/shared/WatchersDisplay";
import { Member } from "@/components/community/types/memberTypes";

// This would typically come from a context or API in a real app
const getCommunityMembers = (): Member[] => [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", role: "family", status: "active", isAdmin: true },
  { id: "2", name: "Dr. Michael Smith", email: "dr.smith@example.com", role: "healthcare", status: "active" },
  { id: "3", name: "Mom", email: "mom@example.com", role: "family", status: "active" },
  { id: "4", name: "Jane Roberts", email: "jane@example.com", role: "caregiver", status: "active" },
  { id: "5", name: "Robert Wilson", email: "robert@example.com", role: "friend", status: "active" },
  { id: "6", name: "Lisa Chen", email: "lisa@example.com", role: "colleague", status: "active" },
];

export function WatchersField() {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [communityMembers, setCommunityMembers] = useState<Member[]>([]);
  
  // Fetch community members
  useEffect(() => {
    setCommunityMembers(getCommunityMembers());
  }, []);
  
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
  
  const selectedMembers = communityMembers.filter(member => watcherIds.includes(member.id));
  
  return (
    <FormField
      control={form.control}
      name="watchers"
      render={() => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Accountability Watchers
          </FormLabel>
          <FormDescription>
            Add community members who will be notified about this action
          </FormDescription>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedMembers.length > 0 ? (
              <WatchersDisplay 
                watchers={selectedMembers.map(m => m.name)}
                showIcon={false}
                maxVisible={3}
              />
            ) : (
              <p className="text-xs text-muted-foreground">No watchers selected</p>
            )}
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  {selectedMembers.length > 0 ? "Edit" : "Add"} Watchers
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="p-4 border-b">
                  <h4 className="font-medium">Select Watchers</h4>
                  <p className="text-sm text-muted-foreground">
                    They will be notified when this item is updated
                  </p>
                </div>
                
                <ScrollArea className="h-60 px-4 py-2">
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
                
                <div className="p-2 bg-muted/20 flex justify-end border-t">
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
