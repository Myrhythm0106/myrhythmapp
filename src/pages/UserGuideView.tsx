
import React from 'react';
import { PersonalCoachGuide } from '../components/guide/PersonalCoachGuide';
import { CoachGuideHeader } from '../components/guide/CoachGuideHeader';
import { AppNavigation } from '../components/navigation/AppNavigation';
import { QuickStartGuide } from '../components/guide/QuickStartGuide';
import { DetailedUserGuide } from '../components/guide/DetailedUserGuide';
import { InteractiveTutorial } from '../components/guide/InteractiveTutorial';
import { BrainIllustration } from '../components/ui/BrainIllustration';

export default function UserGuideView() {
  const userProgress = {
    currentStreak: 5,
    completedToday: true
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Brain illustration background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BrainIllustration className="w-96 h-96" opacity={0.04} />
      </div>
      
      <AppNavigation />
      <CoachGuideHeader userProgress={userProgress} />
      
      <div className="relative max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brain-health-600 via-primary to-clarity-teal-600 bg-clip-text text-transparent">
            MyRhythm User Guides
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to master MyRhythm and achieve your cognitive wellness goals
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <InteractiveTutorial />
          </div>
        </div>
        
        {/* Guide Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          <QuickStartGuide />
          <DetailedUserGuide />
        </div>
        
        {/* Personal Coach Guide */}
        <PersonalCoachGuide />
      </div>
    </div>
  );
}
