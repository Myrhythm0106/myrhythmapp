
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Target, Trash2, Brain, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { format } from "date-fns";

interface FocusItem {
  id: string;
  text: string;
  completed: boolean;
  type: "moment" | "decision" | "action";
  timestamp?: string;
}

export function TodayFocus() {
  const navigate = useNavigate();
  const { actions, loading } = useDailyActions();
  
  // Get today's priority actions (top 3-5 most important)
  const today = new Date().toISOString().split('T')[0];
  const todayPriorityActions = actions
    .filter(action => action.date === today)
    .slice(0, 5); // Show top 5 priority items
  
  const [focusItems, setFocusItems] = useState<FocusItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [newItemType, setNewItemType] = useState<"moment" | "decision" | "action">("moment");

  const handleToggleComplete = (id: string) => {
    setFocusItems(prev => 
      prev.map(item => 
        item.id === id ? { 
          ...item, 
          completed: !item.completed,
          timestamp: !item.completed ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : item.timestamp
        } : item
      )
    );
    
    const item = focusItems.find(item => item.id === id);
    if (item && !item.completed) {
      toast.success("Memory task completed! 🧠", {
        description: "Great job logging this important information."
      });
    }
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: FocusItem = {
      id: crypto.randomUUID(),
      text: newItemText.trim(),
      completed: false,
      type: newItemType,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setFocusItems(prev => [...prev, newItem]);
    setNewItemText("");
    setIsAddingItem(false);
    toast.success("Memory focus item added", {
      description: "Added to your daily memory tracking list."
    });
  };

  const handleRemoveItem = (id: string) => {
    setFocusItems(prev => prev.filter(item => item.id !== id));
    toast.success("Memory task removed");
  };

  const handleCancel = () => {
    setIsAddingItem(false);
    setNewItemText("");
    setNewItemType("moment");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "health": return "bg-green-100 text-green-800";
      case "work": return "bg-blue-100 text-blue-800"; 
      case "personal": return "bg-purple-100 text-purple-800";
      case "family": return "bg-rose-100 text-rose-800";
      case "rest": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeEmoji = (type: "moment" | "decision" | "action") => {
    switch (type) {
      case "moment": return "📸";
      case "decision": return "🎯";
      case "action": return "⚡";
    }
  };

  if (loading) {
    return (
      <Card className="border-l-4 border-l-clarity-teal-400 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-clarity-teal-500 animate-pulse" />
            Loading Your Focus Actions...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-clarity-teal-400 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-5 w-5 text-clarity-teal-500" />
          Your Priority Focus Today
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {todayPriorityActions.length > 0 
            ? `${todayPriorityActions.filter(a => a.status === 'completed').length} of ${todayPriorityActions.length} priority actions completed`
            : "Ready to set your focus priorities?"
          }
        </p>
      </CardHeader>
      
      <CardContent className="pt-1">
        {todayPriorityActions.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <Target className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground">No priority actions set for today</p>
            <p className="text-xs text-muted-foreground">Create your first action to establish your daily focus!</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/calendar")}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Set Priority Actions
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {todayPriorityActions.map(action => (
              <li key={action.id} className="flex items-start gap-3 group p-3 rounded-lg hover:bg-muted/20 transition-colors border border-muted">
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-3 h-3 rounded-full ${action.status === 'completed' ? 'bg-clarity-teal-500' : 'bg-muted-foreground/30'}`}></div>
                  {action.difficulty_level && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: action.difficulty_level }, (_, i) => (
                        <div key={i} className="w-1 h-1 bg-clarity-teal-500 rounded-full"></div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-medium ${action.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {action.title}
                    </span>
                    {action.start_time && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(`2000-01-01T${action.start_time}`), 'h:mm a')}
                      </span>
                    )}
                    <Badge variant="secondary" className={getTypeColor(action.action_type)}>
                      {action.action_type}
                    </Badge>
                  </div>
                  
                  {action.description && (
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Duration: {action.duration_minutes || 30}min</span>
                    <span>•</span>
                    <span>Focus Level: {action.difficulty_level}/3</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 shrink-0"
                  onClick={() => navigate(`/calendar?actionId=${action.id}`)}
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      {todayPriorityActions.length > 0 && (
        <CardFooter className="pt-0 flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-clarity-teal-500" />
            <span>
              {todayPriorityActions.filter(a => a.status === 'completed').length} of {todayPriorityActions.length} priority actions completed
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/calendar")}
            className="text-xs text-clarity-teal-600 hover:text-clarity-teal-500"
          >
            Manage Calendar →
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
