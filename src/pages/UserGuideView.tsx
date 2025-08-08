
import React from 'react';
import { PersonalCoachGuide } from '../components/guide/PersonalCoachGuide';
import { CoachGuideHeader } from '../components/guide/CoachGuideHeader';
import { AppNavigation } from '../components/navigation/AppNavigation';

export default function UserGuideView() {
  const userProgress = {
    currentStreak: 5,
    completedToday: true
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <CoachGuideHeader userProgress={userProgress} />
      <PersonalCoachGuide />
    </div>
  );
}
