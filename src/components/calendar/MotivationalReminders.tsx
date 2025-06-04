
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, Zap, Heart, Star, ArrowRight, Clock, Target } from "lucide-react";
import { toast } from "sonner";

interface MotivationalRemindersProps {
  date?: Date;
}

export function MotivationalReminders({ date }: MotivationalRemindersProps) {
  const [completedReminders, setCompletedReminders] = useState<string[]>([]);

  const reminders = [
    {
      id: "1",
      type: "goal-action",
      title: "Time to practice walking to the mailbox! 📫",
      motivation: "Every step builds your confidence and independence!",
      action: "Just 5 minutes of practice",
      time: "2:00 PM",
      energy: "You've got this! 💪",
      priority: "high",
      icon: <Target className="h-4 w-4" />,
      color: "bg-green-50 border-green-200",
      actionColor: "bg-green-500"
    },
    {
      id: "2",
      type: "medication",
      title: "Evening medication reminder 💊",
      motivation: "Taking care of yourself is an act of self-love!",
      action: "Take with water and food",
      time: "8:00 PM",
      energy: "You're doing great staying on track! ⭐",
      priority: "high",
      icon: <Clock className="h-4 w-4" />,
      color: "bg-blue-50 border-blue-200",
      actionColor: "bg-blue-500"
    },
    {
      id: "3",
      type: "activity",
      title: "Wind-down routine time 🌙",
      motivation: "Good rest sets you up for tomorrow's victories!",
      action: "15 minutes of relaxation",
      time: "9:30 PM",
      energy: "You've earned this peaceful moment! 🌟",
      priority: "medium",
      icon: <Heart className="h-4 w-4" />,
      color: "bg-purple-50 border-purple-200",
      actionColor: "bg-purple-500"
    }
  ];

  const handleComplete = (reminderId: string, title: string) => {
    setCompletedReminders(prev => [...prev, reminderId]);
    
    const encouragements = [
      "Amazing work! 🎉",
      "You're building great habits! ⭐",
      "One step closer to your goals! 🚀",
      "Fantastic progress! 💪",
      "You're doing incredible! 🌟"
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    toast.success(randomEncouragement, {
      description: `"${title}" completed successfully!`,
      duration: 4000
    });
  };

  const handleSnooze = (reminderId: string, title: string) => {
    toast.info("Reminder snoozed for 15 minutes", {
      description: `We'll remind you about "${title}" again soon!`,
      duration: 3000
    });
  };

  const handleViewDetails = (reminder: any) => {
    toast.info(`💡 ${reminder.motivation}`, {
      description: reminder.energy,
      duration: 5000
    });
  };

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => {
        const isCompleted = completedReminders.includes(reminder.id);
        
        return (
          <Card 
            key={reminder.id} 
            className={`${reminder.color} border transition-all hover:shadow-md ${isCompleted ? 'opacity-60' : ''}`}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 ${reminder.actionColor} text-white rounded-lg`}>
                    {reminder.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{reminder.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {reminder.time}
                      </Badge>
                      {reminder.priority === "high" && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                          Important
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {!isCompleted && (
                  <Button
                    size="sm"
                    onClick={() => handleComplete(reminder.id, reminder.title)}
                    className={`${reminder.actionColor} hover:opacity-90 text-white`}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Done
                  </Button>
                )}
              </div>

              {/* Motivation & Action */}
              {!isCompleted && (
                <div className="space-y-2">
                  <div className="bg-white/70 rounded-lg p-3 border border-white/50">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      💭 {reminder.motivation}
                    </p>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{reminder.action}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(reminder)}
                      className="text-xs h-7"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Motivation
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSnooze(reminder.id, reminder.title)}
                      className="text-xs h-7"
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      Snooze 15min
                    </Button>
                  </div>
                </div>
              )}

              {/* Completed State */}
              {isCompleted && (
                <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Completed! Great job! 🎉
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
      
      {reminders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No reminders right now</p>
          <p className="text-xs">You're all caught up! 🌟</p>
        </div>
      )}
    </div>
  );
}
