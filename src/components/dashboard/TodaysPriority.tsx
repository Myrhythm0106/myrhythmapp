
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, Target } from "lucide-react";
import { toast } from "sonner";

export function TodaysPriority() {
  const [priority, setPriority] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedPriority, setSavedPriority] = useState("");

  useEffect(() => {
    // Load saved priority from localStorage
    const savedName = localStorage.getItem("myrhythm_todays_priority");
    if (savedName) {
      setSavedPriority(savedName);
    }
  }, []);

  const handleSave = () => {
    if (priority.trim()) {
      localStorage.setItem("myrhythm_todays_priority", priority);
      setSavedPriority(priority);
      setIsEditing(false);
      toast.success("Today's priority saved!");
    }
  };

  return (
    <Card className="bg-card hover:shadow-md transition-shadow border-l-4 border-l-blue-400">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Today's Priority</span>
          </div>
          {!isEditing ? (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Input 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            placeholder="What's your main focus today?"
            className="text-md"
          />
        ) : (
          <p className="text-md font-medium text-blue-800">
            {savedPriority ? savedPriority : "Set your priority for today"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
