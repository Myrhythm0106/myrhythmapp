
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import { MoodHistoryChart } from "./daily-checkin/MoodHistoryChart";
import { MoodSelectionForm } from "./daily-checkin/MoodSelectionForm";
import { InspirationSection } from "./daily-checkin/InspirationSection";
import { ScheduleSection, ScheduleEvent } from "./daily-checkin/ScheduleSection";
import { MoodHistoryEntry, moodOptions } from "./daily-checkin/MoodTypes";
import { InspirationalMessage, inspirationalMessages } from "@/data/inspirationalMessages";

// Sample mood history data - in a real app, this would come from a database
const initialMoodHistoryData: MoodHistoryEntry[] = [
  { day: format(subDays(new Date(), 6), "EEE"), value: 2, mood: "okay" },
  { day: format(subDays(new Date(), 5), "EEE"), value: 3, mood: "great" },
  { day: format(subDays(new Date(), 4), "EEE"), value: 2, mood: "okay" },
  { day: format(subDays(new Date(), 3), "EEE"), value: 1, mood: "struggling" },
  { day: format(subDays(new Date(), 2), "EEE"), value: 2, mood: "okay" },
  { day: format(subDays(new Date(), 1), "EEE"), value: 3, mood: "great" },
  { day: format(new Date(), "EEE"), value: 0, mood: "" }, // Today's value will be set based on check-in
];

// Sample upcoming events - in a real app, this would come from a database
const upcomingEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "Neurology Appointment",
    date: format(new Date(), "yyyy-MM-dd"), // Today
    time: "10:00 AM",
    type: "appointment"
  },
  {
    id: "2", 
    title: "Medication: Aspirin",
    date: format(new Date(), "yyyy-MM-dd"), // Today
    time: "12:00 PM",
    type: "medication"
  },
  {
    id: "3",
    title: "Physical Therapy",
    date: format(subDays(new Date(), -1), "yyyy-MM-dd"), // Tomorrow
    time: "2:30 PM",
    type: "therapy"
  },
  {
    id: "4",
    title: "Support Group Meeting",
    date: format(subDays(new Date(), -2), "yyyy-MM-dd"), // Day after tomorrow
    time: "6:00 PM",
    type: "activity"
  }
];

export function DailyCheckin() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [inspiration, setInspiration] = useState<InspirationalMessage>(inspirationalMessages[0]);
  const [moodSpecificMessages, setMoodSpecificMessages] = useState<InspirationalMessage[]>(inspirationalMessages);
  const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>(initialMoodHistoryData);

  // Update inspiration messages when mood changes
  useEffect(() => {
    if (selectedMood) {
      // Filter messages that match the selected mood
      const moodMessages = inspirationalMessages.filter(msg => msg.category === selectedMood);
      setMoodSpecificMessages(moodMessages);
      
      // Select a random message from the filtered list
      if (moodMessages.length > 0) {
        const randomIndex = Math.floor(Math.random() * moodMessages.length);
        setInspiration(moodMessages[randomIndex]);
      }
    } else {
      // Default to random message when no mood is selected
      const randomIndex = Math.floor(Math.random() * inspirationalMessages.length);
      setInspiration(inspirationalMessages[randomIndex]);
    }
  }, [selectedMood]);

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error("Please select how you're feeling today");
      return;
    }

    // Get numeric value for the selected mood
    const moodValue = moodOptions.find(option => option.value === selectedMood)?.numericValue || 0;

    // Update today's mood in the history
    setMoodHistory(prev => {
      const updatedHistory = [...prev];
      updatedHistory[updatedHistory.length - 1] = {
        ...updatedHistory[updatedHistory.length - 1],
        value: moodValue,
        mood: selectedMood
      };
      return updatedHistory;
    });

    // In a real app, we would send this to an API
    console.log("Mood submitted:", selectedMood);
    toast.success("Your check-in has been recorded!");
    setSubmitted(true);
    
    // Reset after a while to allow for another check-in later
    setTimeout(() => {
      setSubmitted(false);
    }, 3600000); // Reset after 1 hour
  };

  const getNewInspiration = () => {
    if (moodSpecificMessages.length <= 1) return;
    
    const currentIndex = moodSpecificMessages.findIndex(msg => msg.text === inspiration.text);
    let newIndex = currentIndex;
    
    // Make sure we get a different message
    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * moodSpecificMessages.length);
    }
    
    setInspiration(moodSpecificMessages[newIndex]);
    toast.success("New inspiration loaded!");
  };

  return (
    <Card className="bg-card shadow-sm hover:shadow transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {!submitted ? (
                <MoodSelectionForm 
                  selectedMood={selectedMood}
                  setSelectedMood={setSelectedMood}
                  handleSubmit={handleSubmit}
                />
              ) : (
                <div className="text-center py-2">
                  <p className="font-medium text-green-600 mb-1">Check-in Recorded!</p>
                  <p className="text-sm text-muted-foreground">
                    Thank you for sharing how you're feeling today.
                  </p>
                </div>
              )}
              
              {/* Mood history chart */}
              <MoodHistoryChart moodHistory={moodHistory} />
            </div>

            <div className="space-y-4 border-l-0 md:border-l pl-0 md:pl-4">
              <InspirationSection 
                selectedMood={selectedMood}
                inspiration={inspiration}
                getNewInspiration={getNewInspiration}
              />
              
              <ScheduleSection upcomingEvents={upcomingEvents} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
