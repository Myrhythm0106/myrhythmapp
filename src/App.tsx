
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
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
import { OnboardingPage } from "@/pages/OnboardingPage";
import UsefulInfoPage from "@/pages/UsefulInfoPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                
                {/* Protected routes with MainLayout */}
                <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
                <Route path="/calendar" element={<MainLayout><CalendarPage /></MainLayout>} />
                <Route path="/goals" element={<MainLayout><GoalsPage /></MainLayout>} />
                <Route path="/brain-games" element={<MainLayout><BrainGamesPage /></MainLayout>} />
                <Route path="/mood-tracking" element={<MainLayout><MoodTrackingPage /></MainLayout>} />
                <Route path="/gratitude" element={<MainLayout><GratitudePage /></MainLayout>} />
                <Route path="/accountability" element={<MainLayout><AccountabilityPage /></MainLayout>} />
                <Route path="/community" element={<MainLayout><CommunityPage /></MainLayout>} />
                <Route path="/notes" element={<MainLayout><NotesPage /></MainLayout>} />
                <Route path="/strategy" element={<MainLayout><StrategyDashboard /></MainLayout>} />
                <Route path="/analytics" element={<MainLayout><RevenueAnalyticsPage /></MainLayout>} />
                <Route path="/testing" element={<MainLayout><TestingSuitePage /></MainLayout>} />
                <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
                <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
                <Route path="/useful-info" element={<MainLayout><UsefulInfoPage /></MainLayout>} />

                {/* Redirect unknown routes to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
