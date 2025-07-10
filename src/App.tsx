import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MobileSubscriptionProvider } from "@/contexts/MobileSubscriptionContext";
import { PlatformProvider } from "@/components/platform/PlatformProvider";
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
                  
                  {/* Full application routes - universal access */}
                  <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
                  <Route path="/personal-empowerment" element={<MainLayout><PersonalEmpowermentPage /></MainLayout>} />
                  <Route path="/calendar" element={<MainLayout><CalendarPage /></MainLayout>} />
                  <Route path="/goals" element={<MainLayout><GoalsPage /></MainLayout>} />
                  <Route path="/brain-games" element={<MainLayout><BrainGamesPage /></MainLayout>} />
                  <Route path="/brain-recovery" element={<MainLayout><BrainRecoveryPage /></MainLayout>} />
                  <Route path="/mood-tracking" element={<MainLayout><MoodTrackingPage /></MainLayout>} />
                  <Route path="/gratitude" element={<MainLayout><GratitudePage /></MainLayout>} />
                  <Route path="/accountability" element={<MainLayout><AccountabilityPage /></MainLayout>} />
                  <Route path="/community" element={<MainLayout><CommunityPage /></MainLayout>} />
                  <Route path="/personal-community" element={<MainLayout><CommunityPage /></MainLayout>} />
                  <Route path="/notes" element={<MainLayout><NotesPage /></MainLayout>} />
                  <Route path="/strategy" element={<MainLayout><StrategyDashboard /></MainLayout>} />
                  <Route path="/analytics" element={<MainLayout><RevenueAnalyticsPage /></MainLayout>} />
                  <Route path="/testing" element={<MainLayout><TestingSuitePage /></MainLayout>} />
                  <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
                  <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
                  <Route path="/useful-info" element={<MainLayout><UsefulInfoPage /></MainLayout>} />
                  <Route path="/user-guide" element={<MainLayout><UserGuidePage /></MainLayout>} />

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
