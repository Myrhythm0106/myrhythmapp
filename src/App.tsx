
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MobileSubscriptionProvider } from "@/contexts/MobileSubscriptionContext";
import { PlatformProvider } from "@/components/platform/PlatformProvider";
import { SidebarProvider } from "@/components/layout/Sidebar/SidebarContext";
import MainLayout from "@/components/layout/MainLayout";
import LandingPage from "@/pages/Landing";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/Dashboard";
import CalendarPage from "@/pages/Calendar";
import GoalsPage from "@/pages/GoalsPage";
import BrainGamesPage from "@/pages/BrainGamesPage";
import MoodTrackingPage from "@/pages/MoodTrackingPage";
import GratitudePage from "@/pages/GratitudePage";
import AccountabilityPage from "@/pages/AccountabilityPage";
import CommunityPage from "@/pages/CommunityPage";
import NotesPage from "@/pages/NotesPage";
import StrategyDashboard from "@/pages/StrategyDashboard";
import RevenueAnalyticsPage from "@/pages/RevenueAnalyticsPage";
import TestingSuitePage from "@/pages/TestingSuitePage";
import ProfilePage from "@/pages/Profile";
import SettingsPage from "@/pages/SecuritySettings";
import UsefulInfoPage from "@/pages/UsefulInfoPage";
import PersonalEmpowermentPage from "@/pages/PersonalEmpowermentPage";
import BrainRecoveryPage from "@/pages/BrainRecoveryPage";
import UserGuidePage from "@/pages/UserGuidePage";
import Preview3Landing from "@/pages/Preview3Landing";
import PreviewLanding from "@/pages/PreviewLanding";
import Preview2Landing from "@/pages/Preview2Landing";
import WebOnboarding from "@/pages/WebOnboarding";
import Onboarding from "@/pages/Onboarding";
import { MobileOnboarding } from "@/components/onboarding/MobileOnboarding";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PlatformProvider>
          <AuthProvider>
            <MobileSubscriptionProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  {/* Primary Preview 3 route - mobile-first landing */}
                  <Route path="/" element={<Preview3Landing />} />
                  <Route path="/preview-3" element={<Preview3Landing />} />
                  
                  {/* Authentication */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Onboarding routes - FIXED TO USE THE RIGHT COMPONENT */}
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/mobile-onboarding" element={<MobileOnboarding />} />
                  <Route path="/web-onboarding" element={<WebOnboarding />} />
                  
                  {/* Other preview versions - preserved for reference */}
                  <Route path="/landing-original" element={<LandingPage />} />
                  <Route path="/preview-landing" element={<PreviewLanding />} />
                  <Route path="/preview-2" element={<Preview2Landing />} />
                  
                  {/* Full application routes - wrapped with SidebarProvider */}
                  <Route path="/dashboard" element={<SidebarProvider><MainLayout><DashboardPage /></MainLayout></SidebarProvider>} />
                  <Route path="/personal-empowerment" element={<SidebarProvider><MainLayout><PersonalEmpowermentPage /></MainLayout></SidebarProvider>} />
                  <Route path="/calendar" element={<SidebarProvider><MainLayout><CalendarPage /></MainLayout></SidebarProvider>} />
                  <Route path="/goals" element={<SidebarProvider><MainLayout><GoalsPage /></MainLayout></SidebarProvider>} />
                  <Route path="/brain-games" element={<SidebarProvider><MainLayout><BrainGamesPage /></MainLayout></SidebarProvider>} />
                  <Route path="/brain-recovery" element={<SidebarProvider><MainLayout><BrainRecoveryPage /></MainLayout></SidebarProvider>} />
                  <Route path="/mood-tracking" element={<SidebarProvider><MainLayout><MoodTrackingPage /></MainLayout></SidebarProvider>} />
                  <Route path="/gratitude" element={<SidebarProvider><MainLayout><GratitudePage /></MainLayout></SidebarProvider>} />
                  <Route path="/accountability" element={<SidebarProvider><MainLayout><AccountabilityPage /></MainLayout></SidebarProvider>} />
                  <Route path="/community" element={<SidebarProvider><MainLayout><CommunityPage /></MainLayout></SidebarProvider>} />
                  <Route path="/personal-community" element={<SidebarProvider><MainLayout><CommunityPage /></MainLayout></SidebarProvider>} />
                  <Route path="/notes" element={<SidebarProvider><MainLayout><NotesPage /></MainLayout></SidebarProvider>} />
                  <Route path="/strategy" element={<SidebarProvider><MainLayout><StrategyDashboard /></MainLayout></SidebarProvider>} />
                  <Route path="/analytics" element={<SidebarProvider><MainLayout><RevenueAnalyticsPage /></MainLayout></SidebarProvider>} />
                  <Route path="/testing" element={<SidebarProvider><MainLayout><TestingSuitePage /></MainLayout></SidebarProvider>} />
                  <Route path="/profile" element={<SidebarProvider><MainLayout><ProfilePage /></MainLayout></SidebarProvider>} />
                  <Route path="/settings" element={<SidebarProvider><MainLayout><SettingsPage /></MainLayout></SidebarProvider>} />
                  <Route path="/useful-info" element={<SidebarProvider><MainLayout><UsefulInfoPage /></MainLayout></SidebarProvider>} />
                  <Route path="/user-guide" element={<SidebarProvider><MainLayout><UserGuidePage /></MainLayout></SidebarProvider>} />

                  {/* Redirect unknown routes to mobile-first landing */}
                  <Route path="*" element={<Navigate to="/preview-3" replace />} />
                </Routes>
              </BrowserRouter>
            </MobileSubscriptionProvider>
          </AuthProvider>
        </PlatformProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
