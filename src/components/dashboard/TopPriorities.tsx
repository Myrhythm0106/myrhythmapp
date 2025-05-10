
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, CircleDot } from "lucide-react";
import { toast } from "sonner";

interface Priority {
  id: string;
  title: string;
  completed: boolean;
  priority: number; // 1-3, with 1 being highest
}

export function TopPriorities() {
  const [priorities, setPriorities] = useState<Priority[]>([
    { id: "1", title: "Finish presentation for work meeting", completed: false, priority: 1 },
    { id: "2", title: "Schedule doctor's appointment", completed: false, priority: 2 },
    { id: "3", title: "Buy groceries for dinner", completed: true, priority: 3 },
  ]);

  const handleToggle = (id: string) => {
    setPriorities(prev => 
      prev.map(priority => 
        priority.id === id 
          ? { ...priority, completed: !priority.completed } 
          : priority
      )
    );
    
    const priorityItem = priorities.find(p => p.id === id);
    if (priorityItem && !priorityItem.completed) {
      toast.success(`Completed: ${priorityItem.title}`);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return "text-red-500";
      case 2: return "text-amber-500";
      case 3: return "text-green-500";
      default: return "text-blue-500";
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
        <ul className="space-y-2">
          {priorities.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
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
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
