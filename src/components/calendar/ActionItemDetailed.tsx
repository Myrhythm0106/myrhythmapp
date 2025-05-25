
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Target, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/calendar/EventForm";
import { toast } from "sonner";

interface ActionItemDetailedProps {
  action: {
    id: string;
    title: string;
    date: string;
    time: string;
    location?: string;
    type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
    watchers?: string[];
    linkedGoal?: {
      id: string;
      title: string;
      type: "mobility" | "cognitive" | "health" | "other";
    };
    status?: "completed" | "pending" | "in-progress" | "canceled";
  };
  showDetails?: boolean;
}

export function ActionItemDetailed({ 
  action, 
  showDetails = false 
}: ActionItemDetailedProps) {
  const [showActions, setShowActions] = useState(false);

  const getActionStatusStyles = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "in-progress":
        return "bg-blue-50 border-blue-200";
      case "canceled":
        return "bg-red-50 border-red-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getActionTypeStyles = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800";
      case "therapy":
        return "bg-purple-100 text-purple-800";
      case "medication":
        return "bg-red-100 text-red-800";
      case "activity":
        return "bg-green-100 text-green-800";
      case "personal":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGoalTypeStyles = (type: string) => {
    switch (type) {
      case "mobility":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "cognitive":
        return "border-purple-200 bg-purple-50 text-purple-700";
      case "health":
        return "border-green-200 bg-green-50 text-green-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const handleDelete = () => {
    toast.success("Action deleted successfully");
    // In a real app, this would delete the action from the data store
  };

  return (
    <div 
      className={`border rounded-md p-3 transition-all hover:shadow-md cursor-pointer relative ${getActionStatusStyles(action.status)}`}
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
