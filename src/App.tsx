
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
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

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/personal-empowerment" element={<PersonalEmpowermentHubPage />} />
                  <Route path="/dashboard/brain-health" element={<BrainHealthDashboardPage />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/brain-recovery" element={<BrainRecoveryHome />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/brain-games" element={<BrainGamesPage />} />
                  <Route path="/strategy-dashboard" element={<StrategyDashboard />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/gratitude" element={<GratitudePage />} />
                  <Route path="/mood" element={<MoodTrackingPage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/personal-community" element={<PersonalCommunityPage />} />
                  <Route path="/accountability" element={<AccountabilityPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/useful-info" element={<UsefulInfoPage />} />
                </Routes>
                <Toaster />
              </PomodoroProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
