
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { TRANSFORMATION_ROADMAP, getTasksByStatus, getCompletionPercentage } from "@/utils/transformationTracker";

export function TransformationProgress() {
  const completedTasks = getTasksByStatus('completed');
  const inProgressTasks = getTasksByStatus('in-progress');
  const pendingTasks = getTasksByStatus('pending');
  const completionPercentage = getCompletionPercentage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Memory1st Transformation Progress</span>
          <Badge variant="outline" className="bg-memory-emerald-50 text-memory-emerald-700">
            {completionPercentage}% Complete
          </Badge>
        </CardTitle>
        <Progress value={completionPercentage} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{pendingTasks.length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Current Tasks:</h4>
          {TRANSFORMATION_ROADMAP.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <span className="text-sm">{task.component}</span>
              </div>
              <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
