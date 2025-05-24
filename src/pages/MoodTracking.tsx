
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MoodTrackerView } from "@/components/mood-tracking/MoodTrackerView";

const MoodTracking = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mood Tracking" 
        subtitle="Track, understand, and improve your emotional wellbeing"
      />
      
      <div className="container mx-auto max-w-4xl">
        <MoodTrackerView />
      </div>
    </div>
  );
};

export default MoodTracking;
