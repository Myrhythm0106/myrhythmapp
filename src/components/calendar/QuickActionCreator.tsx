
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, Zap, Plus } from "lucide-react";
import { format } from "date-fns";

interface QuickActionCreatorProps {
  onSave: (actionData: any) => void;
}

export function QuickActionCreator({ onSave }: QuickActionCreatorProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTime, setSelectedTime] = useState("now");
  const [selectedType, setSelectedType] = useState("activity");
  const [selectedReminder, setSelectedReminder] = useState("30min");

  const timeOptions = [
    { id: "now", label: "Right Now", time: format(new Date(), "HH:mm") },
    { id: "30min", label: "In 30 minutes", time: format(new Date(Date.now() + 30 * 60000), "HH:mm") },
    { id: "1hour", label: "In 1 hour", time: format(new Date(Date.now() + 60 * 60000), "HH:mm") },
    { id: "today", label: "Later Today", time: "18:00" },
    { id: "tomorrow", label: "Tomorrow", time: "09:00" }
  ];

  const actionTypes = [
    { id: "activity", label: "Activity", icon: <Zap className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
    { id: "appointment", label: "Appointment", icon: <Calendar className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
    { id: "medication", label: "Medication", icon: <Clock className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
    { id: "goal-action", label: "Goal Action", icon: <Target className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" }
  ];

  const reminderOptions = [
    { id: "none", label: "No Reminder" },
    { id: "10min", label: "10 minutes before" },
    { id: "30min", label: "30 minutes before" },
    { id: "1hour", label: "1 hour before" },
    { id: "motivational", label: "Motivational reminder" }
  ];

  const handleSave = () => {
    if (!title.trim()) return;

    const selectedTimeOption = timeOptions.find(t => t.id === selectedTime);
    const selectedTypeOption = actionTypes.find(t => t.id === selectedType);

    const actionData = {
      title: title.trim(),
      notes: notes.trim(),
      type: selectedType,
      time: selectedTimeOption?.time || "09:00",
      date: selectedTime === "tomorrow" ? format(new Date(Date.now() + 24 * 60 * 60000), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      reminder: selectedReminder,
      quickAction: true
    };

    onSave(actionData);
    
    // Reset form
    setTitle("");
    setNotes("");
    setSelectedTime("now");
    setSelectedType("activity");
    setSelectedReminder("30min");
  };

  return (
    <div className="space-y-4">
      {/* Action Title */}
      <div>
        <label className="text-sm font-medium mb-2 block">What do you want to do?</label>
        <Input
          placeholder="e.g., Walk around the block, Call mom, Take medication..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-base"
        />
      </div>

      {/* Action Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">Type</label>
        <div className="grid grid-cols-2 gap-2">
          {actionTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              className="justify-start h-auto p-3"
              onClick={() => setSelectedType(type.id)}
            >
              <div className="flex items-center gap-2">
                {type.icon}
                <span className="text-sm">{type.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* When */}
      <div>
        <label className="text-sm font-medium mb-2 block">When?</label>
        <div className="grid grid-cols-1 gap-2">
          {timeOptions.map((time) => (
            <Button
              key={time.id}
              variant={selectedTime === time.id ? "default" : "outline"}
              className="justify-between"
              onClick={() => setSelectedTime(time.id)}
            >
              <span>{time.label}</span>
              <Badge variant="secondary" className="text-xs">
                {time.time}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Reminder */}
      <div>
        <label className="text-sm font-medium mb-2 block">Reminder</label>
        <div className="grid grid-cols-1 gap-1">
          {reminderOptions.map((reminder) => (
            <Button
              key={reminder.id}
              variant={selectedReminder === reminder.id ? "default" : "ghost"}
              size="sm"
              className="justify-start"
              onClick={() => setSelectedReminder(reminder.id)}
            >
              {reminder.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Notes (Optional) */}
      <div>
        <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
        <Textarea
          placeholder="Any additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[60px]"
        />
      </div>

      {/* Save Button */}
      <Button 
        onClick={handleSave} 
        disabled={!title.trim()}
        className="w-full bg-gradient-to-r from-primary to-primary/80"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Action
      </Button>
    </div>
  );
}
