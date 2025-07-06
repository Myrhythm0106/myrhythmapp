
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { MoodTrackerView } from '@/components/mood-tracking/MoodTrackerView';

export default function MoodTrackingPage() {
  return (
    <PageLayout 
      title="Mood Harmony" 
      description="Track and understand your emotional patterns for better wellbeing"
    >
      <MoodTrackerView />
    </PageLayout>
  );
}
