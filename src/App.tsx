
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { ToastProvider } from "@/components/ui/toast";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ToastProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>
              <PomodoroProvider>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/preview-landing" element={<PreviewLanding />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/brain-recovery" element={<BrainRecoveryHome />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/brain-games" element={<BrainGamesPage />} />
                </Routes>
              </PomodoroProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </div>
  );
}

export default App;
