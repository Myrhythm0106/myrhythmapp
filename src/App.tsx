
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/brain-health" element={<BrainHealthDashboardPage />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/brain-recovery" element={<BrainRecoveryHome />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/brain-games" element={<BrainGamesPage />} />
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
