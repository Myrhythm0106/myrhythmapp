
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpeechButton } from "@/components/ui/SpeechButton";
import { CheckCircle2, Clock, Target, AlertCircle, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TBIReminder {
  id: string;
  title: string;
  description: string;
  type: "medication" | "activity" | "appointment" | "safety";
  time: string;
  goalConnection?: string;
  benefit?: string;
  visualAid?: string;
  isSticky?: boolean;
  priority: "low" | "medium" | "high" | "critical";
}

interface TBIReminderCardProps {
  reminder: TBIReminder;
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
  onWorkingOnIt: (id: string) => void;
}

export function TBIReminderCard({ 
  reminder, 
  onComplete, 
  onSnooze, 
  onWorkingOnIt 
}: TBIReminderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-l-red-500 bg-red-50 animate-pulse";
      case "high":
        return "border-l-orange-500 bg-orange-50";
      case "medium":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-green-500 bg-green-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medication": return "💊";
      case "activity": return "🏃‍♂️";
      case "appointment": return "👩‍⚕️";
      case "safety": return "⚠️";
      default: return "📋";
    }
  };

  const handleComplete = () => {
    if (reminder.isSticky) {
      setShowConfirmation(true);
    } else {
      confirmComplete();
    }
  };

  const confirmComplete = () => {
    onComplete(reminder.id);
    toast.success("🎉 Great job completing that reminder!", {
      description: reminder.benefit ? `This ${reminder.benefit}!` : "You're making excellent progress!",
      duration: 5000
    });
    setShowConfirmation(false);
  };

  const handleWorkingOnIt = () => {
    onWorkingOnIt(reminder.id);
    toast.info("👍 Take your time!", {
      description: "We'll check back with you soon. You've got this!",
      duration: 4000
    });
  };

  const speakableText = `${reminder.title}. ${reminder.description}. ${
    reminder.benefit ? `This ${reminder.benefit}.` : ""
  } ${reminder.goalConnection ? `This helps with your goal: ${reminder.goalConnection}.` : ""}`;

  return (
    <Card className={cn(
      "border-l-4 transition-all duration-300 hover:shadow-lg",
      getPriorityStyles(reminder.priority),
      reminder.isSticky && "ring-2 ring-primary/20"
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-3xl">{getTypeIcon(reminder.type)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{reminder.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {reminder.time}
                </Badge>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                {reminder.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <SpeechButton 
              text={speakableText}
              size="sm"
              variant="outline"
              showLabel={false}
            />
            {reminder.priority === "critical" && (
              <AlertCircle className="h-5 w-5 text-red-500 animate-bounce" />
            )}
          </div>
        </div>

        {/* Visual Aid */}
        {reminder.visualAid && (
          <div className="mb-4 p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Visual Guide</span>
            </div>
            <img 
              src={reminder.visualAid} 
              alt="Visual reminder aid"
              className="w-full h-32 object-cover rounded"
            />
          </div>
        )}

        {/* Benefits & Goal Connection */}
        {(reminder.benefit || reminder.goalConnection) && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            {reminder.benefit && (
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Why this matters: This {reminder.benefit}
                </span>
              </div>
            )}
            {reminder.goalConnection && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Goal: {reminder.goalConnection}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Expandable Details */}
        {(reminder.benefit || reminder.goalConnection) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-3 text-xs"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
            {isExpanded ? "Less details" : "More details"}
          </Button>
        )}

        {/* Action Buttons */}
        {!showConfirmation ? (
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 min-w-[120px] h-12 text-base font-medium"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              ✅ Completed
            </Button>
            
            <Button
              onClick={handleWorkingOnIt}
              variant="outline"
              className="flex-1 min-w-[120px] h-12 text-base font-medium border-blue-500 hover:bg-blue-50"
            >
              <Clock className="h-5 w-5 mr-2" />
              🚀 Working on it
            </Button>
            
            <Button
              onClick={() => onSnooze(reminder.id)}
              variant="outline"
              className="h-12 px-4 text-sm"
            >
              ⏰ 15min
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                Are you sure you completed: "{reminder.title}"?
              </p>
              <p className="text-xs text-yellow-700">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={confirmComplete}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                ✅ Yes, I completed it
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="flex-1"
              >
                ↩️ Go back
              </Button>
            </div>
          </div>
        )}

        {/* Progress indicator for sticky reminders */}
        {reminder.isSticky && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle className="h-3 w-3" />
              <span>Important reminder - please confirm when complete</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
