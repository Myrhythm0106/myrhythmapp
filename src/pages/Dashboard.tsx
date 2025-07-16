
import React from "react";
import { useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SidebarProvider } from "@/components/layout/Sidebar/SidebarContext";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import CalendarPage from "./CalendarPage";
import GoalsPage from "./GoalsPage";
import GratitudePage from "./GratitudePage";
import AnalyticsPage from "./AnalyticsPage";
import BrainGamesPage from "./BrainGamesPage";
import AccountabilityPage from "./AccountabilityPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";

const Dashboard = () => {
  const location = useLocation();
  
  const renderContent = () => {
    switch (location.pathname) {
      case '/calendar':
        return <CalendarPage />;
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
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <SidebarProvider>
      <MainLayout>
        {renderContent()}
      </MainLayout>
    </SidebarProvider>
  );
};

export default Dashboard;
