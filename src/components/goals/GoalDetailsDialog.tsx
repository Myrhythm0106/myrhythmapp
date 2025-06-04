
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, Plus, CheckCircle2, Clock, Edit } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  myRhythmFocus?: string;
  target: string;
  deadline?: Date;
  progress: number;
  actions: any[];
  createdAt: string;
  description?: string;
}

interface GoalDetailsDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const focusConfig = {
  cognitive: { label: "Cognitive Recovery", color: "bg-purple-100 text-purple-800" },
  physical: { label: "Physical Health", color: "bg-green-100 text-green-800" },
  emotional: { label: "Emotional Wellbeing", color: "bg-pink-100 text-pink-800" },
  independence: { label: "Daily Independence", color: "bg-blue-100 text-blue-800" }
};

// Sample actions for demonstration
const sampleActions = [
  {
    id: "action1",
    title: "Practice walking to front door",
    status: "completed",
    date: "2024-01-15",
    time: "10:00"
  },
  {
    id: "action2", 
    title: "Walk to end of driveway",
    status: "completed", 
    date: "2024-01-16",
    time: "10:00"
  },
  {
    id: "action3",
    title: "Walk halfway to mailbox",
    status: "pending",
    date: "2024-01-17", 
    time: "10:00"
  },
  {
    id: "action4",
    title: "Complete walk to mailbox",
    status: "pending",
    date: "2024-01-20",
    time: "10:00"
  }
];

export function GoalDetailsDialog({ goal, open, onOpenChange }: GoalDetailsDialogProps) {
  const navigate = useNavigate();

  if (!goal) return null;

  const focus = goal.myRhythmFocus ? focusConfig[goal.myRhythmFocus as keyof typeof focusConfig] : null;
  const completedActions = sampleActions.filter(a => a.status === "completed").length;
  const totalActions = sampleActions.length;
  const progressPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  const handleAddAction = () => {
    onOpenChange(false);
    navigate(`/calendar?goalId=${goal.id}&addAction=true`);
    toast.info("Add actions to your calendar", {
      description: "Schedule specific actions that will help you achieve this goal!"
    });
  };

  const handleViewInCalendar = () => {
    onOpenChange(false);
    navigate(`/calendar?goalId=${goal.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Goal Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Goal Header */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{goal.title}</h2>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            {focus && (
              <Badge className={focus.color}>
                {focus.label}
              </Badge>
            )}

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedActions} of {totalActions} actions completed
              </p>
            </div>
          </div>

          {/* Goal Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Success Metric</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{goal.target}</p>
            </div>

            {goal.deadline && (
              <div>
                <h3 className="font-semibold mb-2">Target Date</h3>
                <p className="text-gray-700">{format(goal.deadline, "MMMM dd, yyyy")}</p>
              </div>
            )}

            {goal.description && (
              <div>
                <h3 className="font-semibold mb-2">Additional Notes</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{goal.description}</p>
              </div>
            )}
          </div>

          {/* Linked Actions */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Linked Actions</h3>
              <Button size="sm" onClick={handleAddAction}>
                <Plus className="h-4 w-4 mr-1" />
                Add Action
              </Button>
            </div>

            {sampleActions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 mb-4">No actions scheduled yet</p>
                <Button onClick={handleAddAction}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Action
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {sampleActions.map((action) => (
                  <div 
                    key={action.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      action.status === "completed" 
                        ? "bg-green-50 border-green-200" 
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className={`p-1 rounded-full ${
                      action.status === "completed" 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      {action.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`font-medium ${action.status === "completed" ? "line-through text-green-700" : ""}`}>
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(action.date), "MMM dd")} at {action.time}
                      </p>
                    </div>

                    <Badge variant={action.status === "completed" ? "default" : "secondary"}>
                      {action.status === "completed" ? "Done" : "Scheduled"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t">
            <Button 
              className="w-full"
              onClick={handleViewInCalendar}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View in Calendar
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleAddAction}>
                <Plus className="h-4 w-4 mr-1" />
                Add Actions
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit Goal
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
