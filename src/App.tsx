import { Toaster } from "@/components/ui/sonner";
import { Toaster as CustomToaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlatformProvider } from "@/components/platform/PlatformProvider";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Calendar from "./pages/Calendar";
import Gratitude from "./pages/Gratitude";
import BrainGames from "./pages/BrainGames";
import MoodTracking from "./pages/MoodTracking";
import Accountability from "./pages/Accountability";
import Community from "./pages/Community";
import Notes from "./pages/Notes";
import Strategy from "./pages/Strategy";
import Analytics from "./pages/Analytics";
import Testing from "./pages/Testing";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PlatformProvider>
            <ToastProvider>
              <TooltipProvider>
                <Toaster />
                <CustomToaster />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/assessment" element={<Assessment />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/gratitude" element={<Gratitude />} />
                  <Route path="/brain-games" element={<BrainGames />} />
                  <Route path="/mood-tracking" element={<MoodTracking />} />
                  <Route path="/accountability" element={<Accountability />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/strategy" element={<Strategy />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/testing" element={<Testing />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </TooltipProvider>
            </ToastProvider>
          </PlatformProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
