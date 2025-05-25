
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Target, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/calendar/EventForm";
import { toast } from "sonner";
import { Action } from "@/components/calendar/ActionItem";

interface ActionItemDetailedProps {
  action: Action;
  getActionStatusStyles: (actionDate: string) => string;
  getActionTypeStyles: (type: Action["type"]) => string;
  getGoalTypeStyles: (type: string) => string;
}

export function ActionItemDetailed({ 
  action, 
  getActionStatusStyles, 
  getActionTypeStyles, 
  getGoalTypeStyles 
}: ActionItemDetailedProps) {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = () => {
    toast.success("Action deleted successfully");
    // In a real app, this would delete the action from the data store
  };

  return (
    <div 
      className={`border rounded-md p-3 transition-all hover:shadow-md cursor-pointer relative ${getActionStatusStyles(action.date)}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium truncate pr-2">{action.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getActionTypeStyles(action.type)}`}>
          {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
        </span>
      </div>
      
      <div className="mt-2 space-y-1 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{action.date}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{action.time}</span>
        </div>
        
        {action.location && (
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{action.location}</span>
          </div>
        )}
        
        {action.linkedGoal && (
          <div className="flex items-center mt-2 bg-primary/5 px-2 py-1 rounded-md border-l-2 border-primary/30 overflow-hidden">
            <Target className="h-3.5 w-3.5 mr-1 text-primary flex-shrink-0" />
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-medium truncate max-w-full",
                getGoalTypeStyles(action.linkedGoal.type)
              )}
            >
              Goal: {action.linkedGoal.title}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Action buttons that appear on hover */}
      {showActions && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white shadow-md rounded-md p-1 border">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Edit Action</DialogTitle>
              </DialogHeader>
              <EventForm />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
