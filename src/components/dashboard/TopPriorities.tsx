
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CircleDot, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Priority {
  id: string;
  title: string;
  completed: boolean;
  priority: number; // 1-3, with 1 being highest
  status: "todo" | "doing" | "done";
}

export function TopPriorities() {
  const navigate = useNavigate();
  const [priorities, setPriorities] = useState<Priority[]>([
    { id: "1", title: "Finish presentation for work meeting", completed: false, priority: 1, status: "doing" },
    { id: "2", title: "Schedule doctor's appointment", completed: false, priority: 2, status: "todo" },
    { id: "3", title: "Buy groceries for dinner", completed: true, priority: 3, status: "done" },
  ]);

  const handleToggle = (id: string) => {
    setPriorities(prev => 
      prev.map(priority => {
        if (priority.id === id) {
          const newCompleted = !priority.completed;
          // Also update the status when completing/uncompleting
          let newStatus = priority.status;
          if (newCompleted && priority.status !== "done") {
            newStatus = "done";
          } else if (!newCompleted && priority.status === "done") {
            newStatus = "todo";
          }
          
          return { 
            ...priority, 
            completed: newCompleted,
            status: newStatus as "todo" | "doing" | "done"
          };
        }
        return priority;
      })
    );
    
    const priorityItem = priorities.find(p => p.id === id);
    if (priorityItem && !priorityItem.completed) {
      toast.success(`Completed: ${priorityItem.title}`);
    }
  };

  const handleStatusChange = (id: string, status: "todo" | "doing" | "done") => {
    setPriorities(prev => 
      prev.map(priority => {
        if (priority.id === id) {
          // If marking as done, also check the checkbox
          const newCompleted = status === "done" ? true : priority.completed;
          return { ...priority, status, completed: newCompleted };
        }
        return priority;
      })
    );
    
    toast.info(`Status updated`);
  };

  const handleViewDetails = (id: string) => {
    // In a real app, navigate to a details page for this priority
    navigate(`/goals?id=${id}`);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return "text-red-500";
      case 2: return "text-amber-500";
      case 3: return "text-green-500";
      default: return "text-blue-500";
    }
  };

  const getStatusBadge = (status: "todo" | "doing" | "done") => {
    switch (status) {
      case "todo":
        return <Badge variant="outline" className="bg-slate-100 text-slate-800">To Do</Badge>;
      case "doing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Doing</Badge>;
      case "done":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Done</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          Today's Top Priorities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {priorities.map((item) => (
            <li key={item.id} className="flex items-center gap-3 border rounded-md p-3 hover:bg-muted/20 transition-colors">
              <Checkbox
                id={`priority-${item.id}`}
                checked={item.completed}
                onCheckedChange={() => handleToggle(item.id)}
              />
              <div className="flex items-center gap-2 flex-1">
                <CircleDot className={`h-4 w-4 ${getPriorityColor(item.priority)}`} />
                <Label
                  htmlFor={`priority-${item.id}`}
                  className={`flex-1 text-sm ${
                    item.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {item.title}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleViewDetails(item.id)}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View All Priorities
        </Button>
      </CardFooter>
    </Card>
  );
}
