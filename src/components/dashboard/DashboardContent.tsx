
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "./DashboardHeader";
import { HeroSection } from "./unified/HeroSection";
import { ActivityFlowLayout } from "./unified/ActivityFlowLayout";
import { QuickActionZone } from "./unified/QuickActionZone";
import { TodayFocus } from "./TodayFocus";
import { UpcomingToday } from "./UpcomingToday";
import { RecentWins } from "./RecentWins";
import { TopPriorities } from "./TopPriorities";
import { MoodEnergySnapshot } from "./MoodEnergySnapshot";
import { BrainGameQuickStart } from "./BrainGameQuickStart";
import { TrialStatusCard } from "./TrialStatusCard";
import { MorningRitualView } from "./views/MorningRitualView";
import { DailyIChooseWidget } from "./DailyIChooseWidget";
import { MonthlyTheme } from "./MonthlyTheme";
import { SmartNotificationEngine } from "./SmartNotificationEngine";
import { AssessmentUpgradeReminder } from "./AssessmentUpgradeReminder";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useUserProgress } from "@/hooks/useUserProgress";
import { QuickActionsToProgress } from "@/components/layout/QuickActionsToProgress";
import { QuickAccessWidget } from "@/components/guide/QuickAccessWidget";
import { FloatingGratitudeButton } from "@/components/gratitude/FloatingGratitudeButton";
import { UserGuideIntegration } from "@/components/onboarding/UserGuideIntegration";
import { WelcomeToApp } from "@/components/onboarding/WelcomeToApp";
import { FloatingGuideButton } from "@/components/guide/FloatingGuideButton";
import { NeverLostSystem } from "@/components/navigation/NeverLostSystem";
import { PersonalEmpowermentHub } from "./PersonalEmpowermentHub";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Star } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { CalendarDashboardIntegration } from "@/components/calendar/CalendarDashboardIntegration";
import { WelcomeScreen } from "./WelcomeScreen";

export function DashboardContent() {
  const [searchParams] = useSearchParams();
  const [showMorningRitual, setShowMorningRitual] = useState(false);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [dailyIntention, setDailyIntention] = useState('');
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  // Removed dashboard view toggle - now unified experience
  const { metrics, getNextUnlock } = useUserProgress();
  const userData = useUserData();

  // Define sections for reading progress
  const dashboardSections = [
    { id: 'header', title: 'Header & Overview' },
    { id: 'ichoose', title: 'Daily #IChoose' },
    { id: 'focus', title: 'Today Focus' },
    { id: 'mood', title: 'Mood & Energy' },
    { id: 'activities', title: 'Quick Actions' }
  ];

  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check for onboarding completion
    if (searchParams.get('onboarding_complete') === 'true') {
      setShowWelcome(true);
      toast.success("🎉 Welcome to MyRhythm! Your personalized journey begins now.");
    }
    
    // Check for trial started
    if (searchParams.get('trial_started') === 'true') {
      toast.success("🚀 Your 7-day free trial has started! Explore all features.");
    }

    // Check if welcome screen should be shown (first time today)
    const today = new Date().toDateString();
    const welcomeComplete = localStorage.getItem(`welcome_complete_${today}`);
    const hour = new Date().getHours();
    
    // Show welcome screen first thing in the morning if not completed today
    if (!welcomeComplete && hour >= 6 && hour <= 11) {
      setShowWelcomeScreen(true);
      return; // Exit early to show welcome screen first
    }

    // Check if morning ritual is completed today
    const morningRitual = localStorage.getItem(`morning_ritual_${today}`);
    
    if (!morningRitual) {
      // Show morning ritual if welcome is complete but ritual isn't
      if (welcomeComplete && hour >= 6 && hour <= 11) {
        setShowMorningRitual(true);
      }
    } else {
      const ritualData = JSON.parse(morningRitual);
      setEnergyLevel(ritualData.energyLevel);
      setDailyIntention(ritualData.intention);
    }

    // Set up section elements for progress tracking
    setTimeout(() => {
      const sectionsWithElements = dashboardSections.map(section => {
        const element = document.getElementById(section.id);
        return { ...section, element };
      });
      // Update sections if needed for progress tracking
    }, 100);
  }, [searchParams]);

  const handleUpgradeClick = () => {
    toast.success("Upgrade to Premium for unlimited #IChoose statements! 🚀");
  };

  const nextUnlock = getNextUnlock();

  const getRoleSpecificWelcome = () => {
    const welcomeMessages = {
      'brain-injury': {
        title: 'Your Brain Recovery Journey',
        message: 'Every step forward is progress. Your brain is healing and growing stronger.',
        icon: '🧠'
      },
      'caregiver': {
        title: 'Supporting Your Loved One',
        message: 'Your care and dedication make a meaningful difference every day.',
        icon: '❤️'
      },
      'cognitive-optimization': {
        title: 'Peak Performance Mode',
        message: 'Optimize your cognitive abilities and achieve your highest potential.',
        icon: '🚀'
      },
      'wellness': {
        title: 'Your Wellness Journey',
        message: 'Building habits and mindsets for lasting well-being and growth.',
        icon: '🌟'
      }
    };
    
    return welcomeMessages[userData.userType] || welcomeMessages['wellness'];
  };

  // Show welcome screen first if not completed today
  if (showWelcomeScreen) {
    return (
      <WelcomeScreen 
        onProceedToDashboard={() => setShowWelcomeScreen(false)}
        userType={userData?.userType}
      />
    );
  }

  // If morning ritual not completed and it's morning time, show morning ritual
  if (showMorningRitual) {
    return (
      <div className="space-y-6">
        <div id="morning-ritual" className="pt-4">
          <MorningRitualView />
        </div>
        <SmartNotificationEngine 
          energyLevel={energyLevel || undefined}
          dailyIntention={dailyIntention}
        />
      </div>
    );
  }

  const roleWelcome = getRoleSpecificWelcome();

  return (
    <div className="space-y-6 pb-20">
      {/* PersonalEmpowermentHub - Priority Position */}
      <div id="empowerment-hub">
        <PersonalEmpowermentHub />
      </div>

      {/* Daily #IChoose Statement - Compact */}
      <div id="ichoose" className="space-y-4">
        <DailyIChooseWidget onUpgradeClick={handleUpgradeClick} userType={userData?.userType} />
      </div>

      {/* Monthly Theme */}
      <div id="monthly-theme" className="space-y-4">
        <MonthlyTheme />
      </div>
      
      {/* Assessment Upgrade Reminder */}
      <AssessmentUpgradeReminder />
      
      {/* Progress & Unlock Status */}
      {metrics.engagementLevel !== 'advanced' && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Your Progress</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {metrics.readinessScore}/100 points
                </Badge>
              </div>
              
              {nextUnlock && (
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Target className="h-4 w-4" />
                    <span>Next: {nextUnlock.description}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.readinessScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Activity Flow Layout - Today → Week → Month → Year */}
      <ActivityFlowLayout />
      
      {/* Quick Action Zone */}
      <QuickActionZone />
      
      {/* Trial Status */}
      <TrialStatusCard />
      
      {/* Smart Notification Engine */}
      <SmartNotificationEngine 
        energyLevel={energyLevel || undefined}
        dailyIntention={dailyIntention}
      />
      
      
      {/* Welcome to App - Show for new users */}
      <WelcomeToApp showOnMount={showWelcome} onClose={() => setShowWelcome(false)} />
      
      {/* Bottom Support Section */}
      <div className="mt-12 pt-8 border-t border-border/20 space-y-4">
        <UserGuideIntegration showOnMount={false} />
        <FloatingGuideButton />
        <NeverLostSystem />
      </div>
    </div>
  );
}
