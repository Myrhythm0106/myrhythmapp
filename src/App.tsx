
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import { BrainRecoveryHome } from "./components/brain-recovery/BrainRecoveryHome";
import Onboarding from "./pages/Onboarding";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { PomodoroProvider } from "./contexts/PomodoroContext";
import BrainGamesPage from "./pages/BrainGamesPage";
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
                  <Route path="/" element={<Landing />} />
                  <Route path="/preview-landing" element={<PreviewLanding />} />
                  <Route path="/preview-2" element={<Preview2Landing />} />
                  <Route path="/dashboard" element={<Dashboard />} />
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
