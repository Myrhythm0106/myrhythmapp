
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Target, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface FocusItem {
  id: string;
  text: string;
  completed: boolean;
}

export function TodayFocus() {
  const navigate = useNavigate();
  const [focusItems, setFocusItems] = useState<FocusItem[]>([
    { id: "1", text: "Complete cognitive exercises", completed: false },
    { id: "2", text: "Review notes from therapy", completed: true },
    { id: "3", text: "Walk for 15 minutes", completed: false },
  ]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState("");

  const handleToggleComplete = (id: string) => {
    setFocusItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    toast.success("Focus item updated");
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: crypto.randomUUID(),
      text: newItemText.trim(),
      completed: false
    };
    
    setFocusItems(prev => [...prev, newItem]);
    setNewItemText("");
    setIsAddingItem(false);
    toast.success("Focus item added");
  };

  const handleRemoveItem = (id: string) => {
    setFocusItems(prev => prev.filter(item => item.id !== id));
    toast.success("Focus item removed");
  };

  const handleCancel = () => {
    setIsAddingItem(false);
    setNewItemText("");
  };

  return (
    <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-5 w-5 text-primary" />
          My Focus for Today
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-1">
        <ul className="space-y-3">
          {focusItems.map(item => (
            <li key={item.id} className="flex items-start gap-2 group">
              <Checkbox 
                checked={item.completed} 
                onCheckedChange={() => handleToggleComplete(item.id)}
                className="mt-0.5"
              />
              <span 
                className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {item.text}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                onClick={() => handleRemoveItem(item.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </li>
          ))}
          
          {isAddingItem ? (
            <li className="flex flex-col gap-2 pt-1">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="What do you want to focus on today?"
                className="w-full p-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAddItem}
                  className="text-xs py-0 h-8"
                >
                  Add Item
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  className="text-xs py-0 h-8"
                >
                  Cancel
                </Button>
              </div>
            </li>
          ) : focusItems.length < 3 && (
            <li>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-muted-foreground"
                onClick={() => setIsAddingItem(true)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add focus item
              </Button>
            </li>
          )}
        </ul>
      </CardContent>
      
      {focusItems.length > 0 && (
        <CardFooter className="pt-0">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>
              {focusItems.filter(i => i.completed).length} of {focusItems.length} completed
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
