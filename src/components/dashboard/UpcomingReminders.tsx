
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Pill, Calendar } from "lucide-react";

export function UpcomingReminders() {
  const reminders = [
    {
      id: "1",
      type: "medication",
      title: "Take morning medication",
      time: "9:00 AM",
      status: "pending",
      icon: <Pill className="h-4 w-4" />
    },
    {
      id: "2", 
      type: "action",
      title: "Walk to mailbox practice",
      time: "2:00 PM",
      status: "pending",
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: "3",
      type: "routine",
      title: "Evening wind-down routine",
      time: "7:00 PM", 
      status: "pending",
      icon: <Clock className="h-4 w-4" />
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "medication":
        return "bg-red-100 text-red-800";
      case "action":
        return "bg-blue-100 text-blue-800";
      case "routine":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-orange-500" />
          Upcoming Reminders
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded">
                {reminder.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{reminder.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs ${getTypeColor(reminder.type)}`}>
                    {reminder.type}
                  </Badge>
                  <span className="text-xs text-gray-600">{reminder.time}</span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              Snooze
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
