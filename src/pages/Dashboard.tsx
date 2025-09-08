
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SidebarProvider } from "@/components/layout/Sidebar/SidebarContext";
import { DailyActionsProvider } from "@/contexts/DailyActionsContext";
import { FirstTimeUserExperience } from "@/components/onboarding/FirstTimeUserExperience";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { BrainFriendlyDashboard } from "@/components/dashboard/BrainFriendlyDashboard";
import { ReportsWidget } from "@/components/dashboard/widgets/ReportsWidget";
import { BackButton } from "@/components/ui/BackButton";
import CalendarPage from "./CalendarPage";
import GoalsPage from "./GoalsPage";
import GratitudePage from "./GratitudePage";
import AnalyticsPage from "./AnalyticsPage";
import BrainGamesPage from "./BrainGamesPage";
import AccountabilityPage from "./AccountabilityPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import SupportPage from "./SupportPage";
import SupportCirclePage from "./SupportCirclePage";
import MemoryBankPage from "./MemoryBankPage";
import TestingPage from "./TestingPage";
import DecisionsPage from "./DecisionsPage";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resetSession } = useSessionTracking();

  // Check if this is the first time user
  useEffect(() => {
    if (user && location.pathname === '/') {
      const onboardingComplete = localStorage.getItem('myrhythm_onboarding_complete');
      const welcomeSeen = localStorage.getItem('myrhythm_welcome_seen');
      
      // If user hasn't completed onboarding and hasn't seen welcome, redirect to web-onboarding
      if (!onboardingComplete && !welcomeSeen) {
        navigate('/web-onboarding');
        return;
      }
    }
  }, [user, location.pathname, navigate]);
  
  const renderContent = () => {
    const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';
    
    return (
      <>
        {showBackButton && (
          <div className="p-4 border-b">
            <BackButton />
          </div>
        )}
        <div className={showBackButton ? "" : ""}>
          {(() => {
            switch (location.pathname) {
              case '/calendar':
                return (
                  <DailyActionsProvider>
                    <CalendarPage />
                  </DailyActionsProvider>
                );
              case '/goals':
                return <GoalsPage />;
              case '/gratitude':
                return <GratitudePage />;
              case '/analytics':
                return <AnalyticsPage />;
              case '/brain-games':
                return <BrainGamesPage />;
              case '/accountability':
                return <AccountabilityPage />;
              case '/support':
                return <SupportPage />;
              case '/support-circle':
                return <SupportCirclePage />;
              case '/profile':
                return <ProfilePage />;
              case '/memory-bank':
                return <MemoryBankPage />;
              case '/settings':
                return <SettingsPage />;
              case '/testing':
                return <TestingPage />;
              case '/decisions':
                return <DecisionsPage />;
              case '/':
              case '/dashboard':
                return <BrainFriendlyDashboard />;
              default:
                return <DashboardContent />;
            }
          })()}
        </div>
      </>
    );
  };

  return (
    <SidebarProvider>
      <DailyActionsProvider>
        <MainLayout>
          <FirstTimeUserExperience showOnMount={location.pathname === '/'} />
          {renderContent()}
        </MainLayout>
      </DailyActionsProvider>
    </SidebarProvider>
  );
};

export default Dashboard;
