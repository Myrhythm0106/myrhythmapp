import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CoachingReminder {
  id: string;
  type: 'tip' | 'reminder' | 'check-in';
  title: string;
  message: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

export function CoachingRemindersCard() {
  const navigate = useNavigate();

  // Mock data - in real implementation, this would come from your coaching/AI system
  const reminders: CoachingReminder[] = [
    {
      id: "1",
      type: "reminder",
      title: "Evening Reflection",
      message: "It's been 6 hours since your last capture. Time to reflect on your day.",
      action: "Start Reflection",
      priority: "medium"
    },
    {
      id: "2", 
      type: "tip",
      title: "Memory Consolidation",
      message: "Try reviewing yesterday's notes before adding new ones - it helps with memory formation.",
      priority: "low"
    },
    {
      id: "3",
      type: "check-in",
      title: "Weekly Progress",
      message: "You've had a productive week! Consider sharing an update with your support circle.",
      action: "Share Update",
      priority: "medium"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-sunrise-amber-600 bg-sunrise-amber-50 border-sunrise-amber-200';
      default: return 'text-brain-health-600 bg-brain-health-50 border-brain-health-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return Clock;
      case 'check-in': return AlertCircle;
      default: return Brain;
    }
  };

  const handleAction = (reminder: CoachingReminder) => {
    if (reminder.action === "Start Reflection") {
      navigate('/calendar?focus=reflection');
    } else if (reminder.action === "Share Update") {
      navigate('/support-circle');
    } else {
      navigate('/calendar');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4 text-brain-health-600" />
          Coaching Reminders
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {reminders.map(reminder => {
          const Icon = getTypeIcon(reminder.type);
          return (
            <div 
              key={reminder.id} 
              className={`p-3 rounded-lg border ${getPriorityColor(reminder.priority)}`}
            >
              <div className="flex items-start gap-2">
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-brain-health-800">
                      {reminder.title}
                    </h4>
                    <p className="text-xs text-brain-health-600 mt-1">
                      {reminder.message}
                    </p>
                  </div>
                  
                  {reminder.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(reminder)}
                      className="text-xs h-7 px-2"
                    >
                      {reminder.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-2 border-t border-brain-health-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/calendar?focus=coaching')}
            className="w-full text-brain-health-600 hover:bg-brain-health-50 text-xs"
          >
            View All Coaching Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}