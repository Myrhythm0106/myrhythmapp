
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Pin } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Reminder {
  id: string;
  text: string;
  isPinned: boolean;
}

export function TopReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", text: "Take medication with food", isPinned: true },
    { id: "2", text: "Call mom on Friday", isPinned: true },
    { id: "3", text: "Drink water regularly throughout the day", isPinned: true },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState("");
  
  const handleAddReminder = () => {
    if (newReminderText.trim()) {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        text: newReminderText,
        isPinned: true,
      };
      
      setReminders([...reminders, newReminder]);
      setNewReminderText("");
      setIsAddDialogOpen(false);
      toast.success("Reminder added!");
    }
  };
  
  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast.success("Reminder removed");
  };
  
  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Pin className="h-5 w-5 text-primary" />
            Pinned Reminders
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              No pinned reminders yet
            </p>
          ) : (
            reminders.map((reminder) => (
              <div 
                key={reminder.id}
                className="flex items-center justify-between p-2 bg-primary/5 rounded-md"
              >
                <p className="text-sm">{reminder.text}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteReminder(reminder.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Reminder
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Enter your reminder here..."
              value={newReminderText}
              onChange={(e) => setNewReminderText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddReminder}>
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
