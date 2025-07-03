
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash, Plus, Pin, Volume2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SpeechButton } from "@/components/ui/SpeechButton";

interface Reminder {
  id: string;
  text: string;
  isPinned: boolean;
  completed?: boolean;
}

export function EnhancedTopReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", text: "Take medication with food", isPinned: true, completed: true },
    { id: "2", text: "Call mom on Friday", isPinned: true, completed: false },
    { id: "3", text: "Drink water regularly throughout the day", isPinned: true, completed: false },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState("");
  
  const completedCount = reminders.filter(r => r.completed).length;
  const completionRate = reminders.length > 0 ? Math.round((completedCount / reminders.length) * 100) : 0;
  
  const handleAddReminder = () => {
    if (newReminderText.trim()) {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        text: newReminderText,
        isPinned: true,
        completed: false
      };
      
      setReminders([...reminders, newReminder]);
      setNewReminderText("");
      setIsAddDialogOpen(false);
      toast.success("🎯 Reminder added! You've got this!", {
        description: "Your new reminder is ready to help you stay on track",
        duration: 4000
      });
    }
  };
  
  const handleToggleComplete = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder && !reminder.completed) {
      toast.success("🎉 Excellent work!", {
        description: `"${reminder.text}" completed! Keep up the great momentum!`,
        duration: 5000
      });
    }
  };
  
  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast.success("Reminder removed", {
      description: "You can always add it back if needed",
      duration: 3000
    });
  };
  
  const speakAllReminders = () => {
    const activeReminders = reminders.filter(r => !r.completed);
    const text = activeReminders.length > 0 
      ? `You have ${activeReminders.length} reminders: ${activeReminders.map(r => r.text).join(", ")}`
      : "Great job! All your reminders are complete!";
    return text;
  };
  
  return (
    <>
      <Card className="hover:shadow-md transition-shadow border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Pin className="h-5 w-5 text-primary" />
              Pinned Reminders
              {completedCount > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  {completedCount} ✅
                </Badge>
              )}
            </CardTitle>
            <SpeechButton 
              text={speakAllReminders()}
              variant="outline"
              size="sm"
            />
          </div>
          
          {/* Progress Section */}
          {reminders.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Completion Progress</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress 
                value={completionRate} 
                showPulse={completionRate > 60}
                className="h-2"
                indicatorClassName="bg-gradient-to-r from-primary to-primary/80"
              />
              <p className="text-xs text-muted-foreground">
                {completionRate === 100 
                  ? "🌟 All reminders complete! Amazing work!" 
                  : `💪 ${reminders.length - completedCount} more to go!`
                }
              </p>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-3">
          {reminders.length === 0 ? (
            <div className="text-center py-6">
              <Pin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-muted-foreground">No pinned reminders yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add important reminders to keep them visible
              </p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div 
                key={reminder.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                  reminder.completed 
                    ? "bg-green-50 border-green-200" 
                    : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 rounded-full ${
                      reminder.completed 
                        ? "bg-green-500 text-white hover:bg-green-600" 
                        : "border-2 border-gray-300 hover:border-primary"
                    }`}
                    onClick={() => handleToggleComplete(reminder.id)}
                  >
                    {reminder.completed && <CheckCircle className="h-3 w-3" />}
                  </Button>
                  
                  <p className={`text-sm flex-1 ${
                    reminder.completed 
                      ? "line-through text-green-700 font-medium" 
                      : "text-gray-900"
                  }`}>
                    {reminder.text}
                  </p>
                  
                  <SpeechButton 
                    text={reminder.text}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive ml-2"
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
            className="w-full flex items-center gap-2 h-12 text-base font-medium hover:bg-primary/5 hover:border-primary/30"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Add Important Reminder
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Reminder</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Enter your important reminder here..."
              value={newReminderText}
              onChange={(e) => setNewReminderText(e.target.value)}
              className="min-h-[100px] text-base"
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Be specific and clear - this will help you stay focused!
            </p>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleAddReminder}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
