
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save } from "lucide-react";
import { toast } from "sonner";

export function WeekNaming() {
  const [weekName, setWeekName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedWeekName, setSavedWeekName] = useState("");

  useEffect(() => {
    // Load saved week name from localStorage
    const savedName = localStorage.getItem("myrhythm_week_name");
    if (savedName) {
      setSavedWeekName(savedName);
    }
  }, []);

  const handleSave = () => {
    if (weekName.trim()) {
      localStorage.setItem("myrhythm_week_name", weekName);
      setSavedWeekName(weekName);
      setIsEditing(false);
      toast.success("Week name saved!");
    }
  };

  return (
    <Card className="bg-card hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>This Week's Theme</span>
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
            value={weekName} 
            onChange={(e) => setWeekName(e.target.value)}
            placeholder="e.g. #IChoose Productivity"
            className="text-md"
          />
        ) : (
          <p className="text-md font-medium">
            {savedWeekName ? savedWeekName : "Set a theme for your week"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
