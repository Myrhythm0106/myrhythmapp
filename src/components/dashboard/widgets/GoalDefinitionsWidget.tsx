
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, BookOpen, ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GoalDefinitionGuide } from "../../goals/GoalDefinitionGuide";
import { toast } from "sonner";

// Sample goals data
const sampleGoals = [
  {
    id: "goal1",
    title: "Walk to the mailbox by myself",
    category: "independence",
    progress: 35,
    nextAction: "Walk from chair to front door",
    dueToday: true,
    totalActions: 8,
    completedActions: 3
  },
  {
    id: "goal2", 
    title: "Read a complete book",
    category: "cognitive",
    progress: 60,
    nextAction: "Read one page out loud",
    dueToday: true,
    totalActions: 5,
    completedActions: 3
  }
];

export function GoalDefinitionsWidget() {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  const handleQuickAction = (goalId: string, actionTitle: string) => {
    toast.success("Action Completed! 🎉", {
      description: `Great job completing "${actionTitle}"!`,
      duration: 3000
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "independence":
        return "bg-blue-100 text-blue-800";
      case "cognitive":
        return "bg-purple-100 text-purple-800";
      case "emotional":
        return "bg-pink-100 text-pink-800";
      case "physical":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const hasGoals = sampleGoals.length > 0;
  const todayActions = sampleGoals.filter(goal => goal.dueToday);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            My Goals & Actions
          </CardTitle>
          <Dialog open={showGuide} onOpenChange={setShowGuide}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <BookOpen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Goal & Action Guide</DialogTitle>
              </DialogHeader>
              <GoalDefinitionGuide />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasGoals ? (
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-4">No goals defined yet</p>
            <Button 
              onClick={() => setShowGuide(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <>
            {/* Today's Actions */}
            {todayActions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-orange-700 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due Today ({todayActions.length})
                </h4>
                {todayActions.map((goal) => (
                  <div key={goal.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{goal.nextAction}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getCategoryColor(goal.category)}`}>
                            {goal.category}
                          </Badge>
                          <span className="text-xs text-gray-600">from "{goal.title}"</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => handleQuickAction(goal.id, goal.nextAction)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Goal Progress Overview */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Goal Progress</h4>
              {sampleGoals.map((goal) => (
                <div 
                  key={goal.id} 
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/calendar/goal/${goal.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm truncate">{goal.title}</p>
                    <span className="text-xs text-gray-500">{goal.progress}%</span>
                  </div>
                  
                  <Progress value={goal.progress} className="h-2 mb-2" />
                  
                  <div className="flex justify-between items-center">
                    <Badge className={`text-xs ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {goal.completedActions}/{goal.totalActions} actions
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate("/calendar?view=goals")}
              >
                View All Goals
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                variant="ghost"
                size="sm" 
                className="w-full text-xs"
                onClick={() => setShowGuide(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New Goal
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
