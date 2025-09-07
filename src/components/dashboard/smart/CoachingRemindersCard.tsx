import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reminders = [
  { id: 1, text: "Weekly check-in with support person", dueTime: "Tomorrow 2pm" },
  { id: 2, text: "Complete brain training exercise", dueTime: "Today 6pm" },
  { id: 3, text: "Review progress notes", dueTime: "Friday" }
];

export function CoachingRemindersCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-white border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">
            <span className="text-orange-500 text-sm font-medium uppercase tracking-wider block mb-1">
              FOR LIFE COACHING
            </span>
            Support Reminders
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/calendar")}
            className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-100 rounded-xl"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          {reminders.map(reminder => (
            <div key={reminder.id} className="p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-2">
              <p className="text-base text-gray-800 font-medium leading-relaxed">
                {reminder.text}
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">
                  {reminder.dueTime}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/calendar")}
          className="w-full text-orange-700 border-orange-200 hover:bg-orange-50 mt-4 rounded-xl py-3 font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          View All in Calendar
        </Button>
      </CardContent>
    </Card>
  );
}