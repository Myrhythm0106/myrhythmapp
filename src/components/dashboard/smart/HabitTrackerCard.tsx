import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const habits = [
  { id: 1, name: "Morning mindfulness", completed: true },
  { id: 2, name: "Movement practice", completed: true },
  { id: 3, name: "Gratitude reflection", completed: false },
  { id: 4, name: "Evening review", completed: false },
];

export function HabitTrackerCard() {
  const completedCount = habits.filter(habit => habit.completed).length;

  return (
    <Card className="bg-gradient-to-br from-white to-brand-teal-50/30 border-brand-teal-200/60 shadow-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-brand-teal-500 to-brand-emerald-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <div>
            <CardTitle className="text-base font-bold">
              Daily Focus Areas
            </CardTitle>
            <p className="text-xs opacity-90 uppercase tracking-wider">
              HABIT TRACKER
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {habit.completed ? (
                  <CheckCircle className="w-4 h-4 text-brand-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <span className={cn(
                "text-sm",
                habit.completed ? "text-brand-teal-700 font-medium" : "text-gray-600"
              )}>
                {habit.name}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-brand-teal-100">
          <p className="text-sm text-brand-teal-600 font-medium">
            {completedCount} of {habits.length} completed — You're making progress!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}