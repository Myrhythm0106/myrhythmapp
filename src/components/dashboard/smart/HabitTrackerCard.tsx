import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

const habits = [
  { id: 1, name: "Focus on brain health", completed: true },
  { id: 2, name: "Mental clarity", completed: false },
  { id: 3, name: "Productivity", completed: true }
];

export function HabitTrackerCard() {
  const completedCount = habits.filter(h => h.completed).length;

  return (
    <Card className="bg-white border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardTitle className="text-lg font-bold text-gray-900">
          <span className="text-orange-500 text-sm font-medium uppercase tracking-wider block mb-1">
            HABIT TRACKER
          </span>
          Daily Focus Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              {habit.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <span className={`text-base font-medium ${
                habit.completed 
                  ? 'text-gray-900' 
                  : 'text-gray-600'
              }`}>
                {habit.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Today's Progress</span>
            <span className="text-sm font-bold text-orange-600">
              {completedCount}/{habits.length} Complete
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}