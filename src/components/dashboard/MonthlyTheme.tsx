import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function MonthlyTheme() {
  const [monthlyTheme, setMonthlyTheme] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedTheme, setSavedTheme] = useState("");

  useEffect(() => {
    // Load saved monthly theme from localStorage
    const savedTheme = localStorage.getItem("myrhythm_monthly_theme");
    if (savedTheme) {
      setSavedTheme(savedTheme);
    }
  }, []);

  const handleSave = () => {
    if (monthlyTheme.trim()) {
      const formattedTheme = monthlyTheme.toUpperCase().trim();
      localStorage.setItem("myrhythm_monthly_theme", formattedTheme);
      setSavedTheme(formattedTheme);
      setIsEditing(false);
      toast.success("Monthly theme set! You've got this! 💪");
    }
  };

  const handleEdit = () => {
    setMonthlyTheme(savedTheme);
    setIsEditing(true);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Month of
            </span>
          </div>
          {!isEditing ? (
            <Button variant="ghost" size="sm" onClick={handleEdit}>
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
            value={monthlyTheme} 
            onChange={(e) => setMonthlyTheme(e.target.value)}
            placeholder="e.g. COURAGE, GROWTH, BREAKTHROUGH"
            className="text-2xl font-bold text-center bg-white/50 border-purple-200"
            maxLength={15}
          />
        ) : (
          <p className="text-3xl font-black text-center">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              {savedTheme ? savedTheme : "SET YOUR THEME"}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}