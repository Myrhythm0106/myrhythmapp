import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reminders = [
  { id: 1, text: "Celebrate today's progress", dueTime: "6:00 PM" },
  { id: 2, text: "Set tomorrow's intention", dueTime: "8:00 PM" },
  { id: 3, text: "Evening gratitude practice", dueTime: "9:00 PM" },
];

export function CoachingRemindersCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-white to-brand-teal-50/30 border-brand-teal-200/60 shadow-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-brand-teal-500 to-brand-emerald-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">
              Support Reminders
            </CardTitle>
            <p className="text-xs opacity-90 uppercase tracking-wider">
              FOR LIFE COACHING
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/calendar')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center gap-3 p-2 rounded-md border border-brand-teal-100">
              <Calendar className="w-4 h-4 text-brand-teal-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{reminder.text}</p>
                <p className="text-xs text-gray-500">{reminder.dueTime}</p>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/calendar')}
          className="w-full border-brand-teal-300 text-brand-teal-600 hover:bg-brand-teal-50"
        >
          View All in Calendar
        </Button>
      </CardContent>
    </Card>
  );
}