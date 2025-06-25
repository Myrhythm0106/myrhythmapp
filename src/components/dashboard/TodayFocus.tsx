
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Target, Trash2, Brain, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface FocusItem {
  id: string;
  text: string;
  completed: boolean;
  type: "moment" | "decision" | "action";
  timestamp?: string;
}

export function TodayFocus() {
  const navigate = useNavigate();
  const [focusItems, setFocusItems] = useState<FocusItem[]>([
    { 
      id: "1", 
      text: "Log the important decision to start morning walks earlier", 
      completed: false, 
      type: "decision",
      timestamp: "9:30 AM"
    },
    { 
      id: "2", 
      text: "Capture key moments from team meeting about project priorities", 
      completed: true, 
      type: "moment",
      timestamp: "11:00 AM"
    },
    { 
      id: "3", 
      text: "Record the action taken to call the doctor for appointment", 
      completed: false, 
      type: "action",
      timestamp: "2:00 PM"
    },
  ]);
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

  const getTypeColor = (type: "moment" | "decision" | "action") => {
    switch (type) {
      case "moment": return "bg-blue-100 text-blue-800";
      case "decision": return "bg-purple-100 text-purple-800";
      case "action": return "bg-green-100 text-green-800";
    }
  };

  const getTypeEmoji = (type: "moment" | "decision" | "action") => {
    switch (type) {
      case "moment": return "📸";
      case "decision": return "🎯";
      case "action": return "⚡";
    }
  };

  return (
    <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5 text-primary" />
          My Memory Focus for Today
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track important moments, decisions, and actions to strengthen your memory
        </p>
      </CardHeader>
      
      <CardContent className="pt-1">
        <ul className="space-y-3">
          {focusItems.map(item => (
            <li key={item.id} className="flex items-start gap-3 group p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <Checkbox 
                checked={item.completed} 
                onCheckedChange={() => handleToggleComplete(item.id)}
                className="mt-1"
              />
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeEmoji(item.type)}</span>
                  <Badge variant="secondary" className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                  {item.timestamp && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </span>
                  )}
                </div>
                <span 
                  className={`block text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                >
                  {item.text}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 shrink-0"
                onClick={() => handleRemoveItem(item.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </li>
          ))}
          
          {isAddingItem ? (
            <li className="flex flex-col gap-3 pt-2 p-2 bg-muted/20 rounded-lg">
              <div className="flex gap-2">
                {(["moment", "decision", "action"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={newItemType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewItemType(type)}
                    className="text-xs capitalize"
                  >
                    {getTypeEmoji(type)} {type}
                  </Button>
                ))}
              </div>
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder={`What important ${newItemType} do you want to log today?`}
                className="w-full p-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAddItem}
                  className="text-xs py-1 h-8"
                >
                  Add Memory Task
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  className="text-xs py-1 h-8"
                >
                  Cancel
                </Button>
              </div>
            </li>
          ) : focusItems.length < 5 && (
            <li>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setIsAddingItem(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add memory focus item
              </Button>
            </li>
          )}
        </ul>
      </CardContent>
      
      {focusItems.length > 0 && (
        <CardFooter className="pt-0 flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>
              {focusItems.filter(i => i.completed).length} of {focusItems.length} memory tasks completed
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/memory")}
            className="text-xs text-primary hover:text-primary/80"
          >
            View Memory Center →
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
