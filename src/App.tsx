
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/hooks/use-toast";
import Preview3Landing from "./pages/Preview3Landing";
import Dashboard from "./pages/Dashboard";
import BrainHealthDashboardPage from "./pages/BrainHealthDashboardPage";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import { BrainRecoveryHome } from "./components/brain-recovery/BrainRecoveryHome";
import Onboarding from "./pages/Onboarding";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { PomodoroProvider } from "./contexts/PomodoroContext";
import BrainGamesPage from "./pages/BrainGamesPage";
import Landing from "./pages/Landing";
import PreviewLanding from "./pages/PreviewLanding";
import Preview2Landing from "./pages/Preview2Landing";
import StrategyDashboard from "./pages/StrategyDashboard";
import PersonalEmpowermentHubPage from "./pages/PersonalEmpowermentHubPage";
import CommunityPage from "./pages/CommunityPage";
import GratitudePage from "./pages/GratitudePage";
import MoodTrackingPage from "./pages/MoodTrackingPage";
import GoalsPage from "./pages/GoalsPage";
import PersonalCommunityPage from "./pages/PersonalCommunityPage";
import AccountabilityPage from "./pages/AccountabilityPage";
import NotesPage from "./pages/NotesPage";
import UsefulInfoPage from "./pages/UsefulInfoPage";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <div className="min-h-screen bg-background">
          <BrowserRouter>
            <AuthProvider>
              <SubscriptionProvider>
                <PomodoroProvider>
                  <Routes>
                    <Route path="/" element={<Preview3Landing />} />
                    <Route path="/landing-original" element={<Landing />} />
                    <Route path="/preview-landing" element={<PreviewLanding />} />
                    <Route path="/preview-2" element={<Preview2Landing />} />
                    <Route path="/preview-3" element={<Preview3Landing />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    
                    {/* Main App Routes with Layout */}
                    <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                    <Route path="/personal-empowerment" element={<MainLayout><PersonalEmpowermentHubPage /></MainLayout>} />
                    <Route path="/dashboard/brain-health" element={<MainLayout><BrainHealthDashboardPage /></MainLayout>} />
                    <Route path="/calendar" element={<MainLayout><Calendar /></MainLayout>} />
                    <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
                    <Route path="/brain-recovery" element={<MainLayout><BrainRecoveryHome /></MainLayout>} />
                    <Route path="/brain-games" element={<MainLayout><BrainGamesPage /></MainLayout>} />
                    <Route path="/strategy-dashboard" element={<MainLayout><StrategyDashboard /></MainLayout>} />
                    <Route path="/community" element={<MainLayout><CommunityPage /></MainLayout>} />
                    <Route path="/gratitude" element={<MainLayout><GratitudePage /></MainLayout>} />
                    <Route path="/mood" element={<MainLayout><MoodTrackingPage /></MainLayout>} />
                    <Route path="/goals" element={<MainLayout><GoalsPage /></MainLayout>} />
                    <Route path="/personal-community" element={<MainLayout><PersonalCommunityPage /></MainLayout>} />
                    <Route path="/accountability" element={<MainLayout><AccountabilityPage /></MainLayout>} />
                    <Route path="/notes" element={<MainLayout><NotesPage /></MainLayout>} />
                    <Route path="/useful-info" element={<MainLayout><UsefulInfoPage /></MainLayout>} />
                  </Routes>
                  <Toaster />
                </PomodoroProvider>
              </SubscriptionProvider>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
