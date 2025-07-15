
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import WebOnboarding from "./pages/WebOnboarding";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import Preview3 from "./pages/Preview3";
import EmpowermentStatements from "./pages/EmpowermentStatements";
import Notes from "./pages/Notes";
import Gratitude from "./pages/Gratitude";
import AudioJournal from "@/pages/AudioJournal";
import Pomodoro from "./pages/Pomodoro";
import Calendar from "./pages/Calendar";
import MoodTracker from "./pages/MoodTracker";
import QuickActions from "./pages/QuickActions";
import BrainHealth from "./pages/BrainHealth";
import PersonalProgress from "./pages/PersonalProgress";
import SupportCircle from "./pages/SupportCircle";
import Goals from "./pages/Goals";
import DailyWins from "./pages/DailyWins";
import HealthLogs from "./pages/HealthLogs";
import VoiceRecordings from "./pages/VoiceRecordings";
import Settings from "./pages/Settings";
import Upgrade from "./pages/Upgrade";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/preview-3" element={<Preview3 />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/web-onboarding" element={<WebOnboarding />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/empowerment-statements" element={<EmpowermentStatements />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/gratitude" element={<Gratitude />} />
              <Route path="/audio-journal" element={<AudioJournal />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/mood-tracker" element={<MoodTracker />} />
              <Route path="/quick-actions" element={<QuickActions />} />
              <Route path="/brain-health" element={<BrainHealth />} />
              <Route path="/personal-progress" element={<PersonalProgress />} />
              <Route path="/support-circle" element={<SupportCircle />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/daily-wins" element={<DailyWins />} />
              <Route path="/health-logs" element={<HealthLogs />} />
              <Route path="/voice-recordings" element={<VoiceRecordings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/upgrade" element={<Upgrade />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
