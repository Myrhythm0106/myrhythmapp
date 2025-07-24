
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardViewSelector } from "./DashboardViewSelector";
import { VisualDashboard } from "./VisualDashboard";
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
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Star } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";

export function DashboardContent() {
  const [searchParams] = useSearchParams();
  const [showMorningRitual, setShowMorningRitual] = useState(false);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [dailyIntention, setDailyIntention] = useState('');
  const [dashboardView, setDashboardView] = useState<"now" | "week">("now");
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

    // Check if morning ritual is completed today
    const today = new Date().toDateString();
    const morningRitual = localStorage.getItem(`morning_ritual_${today}`);
    
    if (!morningRitual) {
      const hour = new Date().getHours();
      // Show morning ritual if it's morning and not completed
      if (hour >= 6 && hour <= 11) {
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

  // If morning ritual not completed and it's morning time, show morning ritual
  if (showMorningRitual) {
    return (
      <div className="space-y-6">
        <ReadingProgressBar sections={[{ id: 'morning-ritual', title: 'Morning Ritual' }]} />
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
      {/* Hero Section: Monthly Theme & Daily #IChoose */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MonthlyTheme />
        <DailyIChooseWidget onUpgradeClick={handleUpgradeClick} userType={userData?.userType} />
      </div>

      <ReadingProgressBar sections={dashboardSections} />
      
      <div id="header" className="pt-4">
        <DashboardHeader />
      </div>
      
      {/* Dashboard View Toggle */}
      <div className="flex justify-center">
        <DashboardViewSelector 
          currentView={dashboardView} 
          onViewChange={setDashboardView} 
        />
      </div>
      
      {/* Role-Specific Welcome Message */}
      {userData.userType && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{roleWelcome.icon}</div>
              <div>
                <h3 className="font-semibold text-purple-800">{roleWelcome.title}</h3>
                <p className="text-sm text-purple-700">{roleWelcome.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
      
      {/* Conditional Dashboard Content */}
      {dashboardView === "now" ? (
        <VisualDashboard />
      ) : (
        <>
          {/* Daily #IChoose Widget - Prominent placement with user type */}
          <div id="ichoose">
            <DailyIChooseWidget 
              onUpgradeClick={handleUpgradeClick}
              userType={userData.userType}
            />
          </div>
          
          {/* Trial Status - Show prominently at top */}
          <TrialStatusCard />
          
          {/* Quick Actions for Progress */}
          <div id="activities">
            <QuickActionsToProgress />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div id="focus">
                <TodayFocus />
              </div>
              <UpcomingToday />
            </div>
            
            <div className="space-y-6">
              <RecentWins />
              <QuickAccessWidget />
              <TopPriorities />
              <div id="mood">
                <MoodEnergySnapshot />
              </div>
              <BrainGameQuickStart />
            </div>
          </div>
        </>
      )}
      
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
