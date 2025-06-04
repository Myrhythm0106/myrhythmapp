
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Sparkles, Target, Calendar, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Action {
  id: string;
  title: string;
  goalTitle?: string;
  goalFocus?: string;
  time: string;
  benefit?: string;
  type: "medication" | "activity" | "appointment" | "goal-action";
}

interface MotivationalNotificationSystemProps {
  actions?: Action[];
  onActionComplete?: (actionId: string) => void;
  onActionReschedule?: (actionId: string) => void;
}

const sampleActions: Action[] = [
  {
    id: "action1",
    title: "Practice walking to front door",
    goalTitle: "Walk to mailbox independently", 
    goalFocus: "independence",
    time: "10:00",
    benefit: "builds your confidence and strength",
    type: "goal-action"
  },
  {
    id: "action2",
    title: "Take morning medication",
    time: "09:00",
    benefit: "supports your recovery journey",
    type: "medication"
  }
];

const motivationalPhrases = {
  preAction: [
    "You've got this! 💪",
    "Time to shine! ✨", 
    "Ready to conquer this! 🎯",
    "Your moment to succeed! 🌟",
    "Let's make progress! 🚀"
  ],
  encouragement: [
    "Every step counts!",
    "You're building amazing habits!",
    "Progress over perfection!",
    "Your dedication is inspiring!",
    "Small steps, big victories!"
  ],
  celebration: [
    "Fantastic work! 🎉",
    "You crushed it! 💪",
    "Amazing progress! ⭐",
    "Keep that momentum! 🚀",
    "You're on fire! 🔥"
  ]
};

export function MotivationalNotificationSystem({ 
  actions = sampleActions, 
  onActionComplete,
  onActionReschedule 
}: MotivationalNotificationSystemProps) {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [missedActions, setMissedActions] = useState<string[]>([]);

  const getRandomPhrase = (type: keyof typeof motivationalPhrases) => {
    const phrases = motivationalPhrases[type];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const handleActionComplete = (action: Action) => {
    setCompletedActions(prev => [...prev, action.id]);
    onActionComplete?.(action.id);

    // Celebration toast with confetti-like effect
    toast.success(getRandomPhrase("celebration"), {
      description: action.goalTitle 
        ? `Great job with "${action.title}"! You're one step closer to "${action.goalTitle}"!`
        : `"${action.title}" completed successfully! ${action.benefit ? action.benefit : ""}`,
      duration: 5000,
      className: "border-l-4 border-l-green-500"
    });

    // Trigger goal progress update animation (in real app)
    if (action.goalTitle) {
      setTimeout(() => {
        toast.info("Goal Progress Updated! 📈", {
          description: `Your progress on "${action.goalTitle}" just improved!`,
          duration: 3000
        });
      }, 1500);
    }
  };

  const handleActionSnooze = (action: Action) => {
    toast.info("Action Rescheduled ⏰", {
      description: `"${action.title}" moved to later today. You've got this when you're ready!`,
      duration: 4000
    });
    onActionReschedule?.(action.id);
  };

  const handleMissedActionReschedule = (action: Action, rescheduleType: "later" | "tomorrow" | "done") => {
    if (rescheduleType === "done") {
      handleActionComplete(action);
    } else {
      const timeText = rescheduleType === "later" ? "later today" : "tomorrow";
      toast.success("No worries! 😊", {
        description: `"${action.title}" rescheduled for ${timeText}. Progress isn't always linear!`,
        duration: 4000
      });
    }
    setMissedActions(prev => prev.filter(id => id !== action.id));
  };

  const generateMotivationalMessage = (action: Action) => {
    const basePhrase = getRandomPhrase("preAction");
    
    if (action.goalTitle) {
      return `${basePhrase} Time for "${action.title}" to power your "${action.goalTitle}"!`;
    }
    
    if (action.benefit) {
      return `${basePhrase} Time for "${action.title}" - this ${action.benefit}!`;
    }
    
    return `${basePhrase} Time for "${action.title}"!`;
  };

  // Simulate checking for upcoming/missed actions
  useEffect(() => {
    const checkActions = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      actions.forEach(action => {
        const [hours, minutes] = action.time.split(':').map(Number);
        const actionTime = hours * 60 + minutes;
        
        // Check for upcoming actions (5 minutes before)
        if (currentTime === actionTime - 5) {
          toast.info("Coming Up! ⏰", {
            description: generateMotivationalMessage(action),
            duration: 10000,
            action: (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleActionComplete(action)}>
                  Done Early!
                </Button>
              </div>
            )
          });
        }
        
        // Check for current actions
        if (currentTime === actionTime) {
          const encouragement = getRandomPhrase("encouragement");
          toast.success(generateMotivationalMessage(action), {
            description: `${encouragement} ${action.benefit ? `Remember: this ${action.benefit}!` : ""}`,
            duration: 15000,
            action: (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleActionComplete(action)}>
                  ✓ Done
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleActionSnooze(action)}>
                  Snooze
                </Button>
              </div>
            )
          });
        }
        
        // Check for missed actions (30 minutes after)
        if (currentTime === actionTime + 30 && !completedActions.includes(action.id)) {
          setMissedActions(prev => [...prev, action.id]);
        }
      });
    };

    const interval = setInterval(checkActions, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [actions, completedActions]);

  return (
    <div className="space-y-4">
      {/* Current Action Reminders */}
      {actions.filter(a => !completedActions.includes(a.id)).map(action => (
        <Card 
          key={action.id}
          className={cn(
            "border-l-4 transition-all duration-300 hover:shadow-md",
            action.type === "goal-action" ? "border-l-primary bg-primary/5" :
            action.type === "medication" ? "border-l-red-400 bg-red-50" :
            "border-l-blue-400 bg-blue-50"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-lg text-white",
                  action.type === "goal-action" ? "bg-primary" :
                  action.type === "medication" ? "bg-red-500" :
                  "bg-blue-500"
                )}>
                  {action.type === "goal-action" ? <Target className="h-4 w-4" /> :
                   action.type === "medication" ? <Clock className="h-4 w-4" /> :
                   <Calendar className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-semibold">{action.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{action.time}</Badge>
                    {action.goalTitle && (
                      <Badge className="bg-primary/10 text-primary">
                        Goal: {action.goalTitle}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => handleActionComplete(action)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Done
              </Button>
            </div>

            <div className="bg-white/70 rounded-lg p-3 border border-white/50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-sm">
                  {getRandomPhrase("encouragement")}
                </span>
              </div>
              {action.benefit && (
                <p className="text-sm text-gray-600">
                  This action {action.benefit}
                  {action.goalTitle && ` and moves you closer to "${action.goalTitle}"`}!
                </p>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleActionSnooze(action)}
                className="text-xs"
              >
                <Clock className="h-3 w-3 mr-1" />
                Snooze 15min
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Missed Action Recovery */}
      {missedActions.map(actionId => {
        const action = actions.find(a => a.id === actionId);
        if (!action) return null;
        
        return (
          <Card key={actionId} className="border-l-4 border-l-orange-400 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-orange-500" />
                <p className="font-semibold">Missed: {action.title}</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                No worries! Life happens. Would you like to reschedule or mark as done?
              </p>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => handleMissedActionReschedule(action, "later")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Later Today
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMissedActionReschedule(action, "tomorrow")}
                >
                  Tomorrow
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMissedActionReschedule(action, "done")}
                >
                  Mark as Done
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {actions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No actions scheduled right now</p>
          <p className="text-xs">You're all caught up! 🌟</p>
        </div>
      )}
    </div>
  );
}
