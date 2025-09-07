import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
}

export function HabitTrackerCard() {
  const navigate = useNavigate();

  // Mock data - in real implementation, this would come from your habits system
  const habits: Habit[] = [
    { id: "1", name: "Morning capture", completed: true, streak: 5 },
    { id: "2", name: "Evening reflection", completed: false, streak: 3 },
    { id: "3", name: "Gratitude practice", completed: true, streak: 7 }
  ];

  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;

  const handleViewDetails = () => {
    navigate('/calendar?focus=habits');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-clarity-teal-600" />
            Daily Habits
          </CardTitle>
          <span className="text-xs text-brain-health-600 bg-brain-health-100 px-2 py-1 rounded">
            {completedToday}/{totalHabits}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center gap-3">
              {habit.completed ? (
                <CheckCircle2 className="h-4 w-4 text-memory-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 text-brain-health-300" />
              )}
              <div className="flex-1">
                <span className={`text-sm ${
                  habit.completed 
                    ? 'text-brain-health-800 font-medium' 
                    : 'text-brain-health-600'
                }`}>
                  {habit.name}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-brain-health-500">
                    {habit.streak} day streak
                  </span>
                  {habit.streak >= 7 && (
                    <span className="text-xs bg-memory-emerald-100 text-memory-emerald-700 px-1 rounded">
                      🔥
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-brain-health-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="w-full text-brain-health-600 border-brain-health-200 hover:bg-brain-health-50"
          >
            View in Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}