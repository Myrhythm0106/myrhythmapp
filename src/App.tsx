
import { Toaster } from "@/components/ui/sonner";
import { Toaster as CustomToaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlatformProvider } from "@/components/platform/PlatformProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
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
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/Welcome";
import InAppPurchase from "./routes/InAppPurchase";

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
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/home" element={<Home />} />
                  
                  {/* Onboarding Routes */}
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/welcome" element={<Welcome />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/assessment" element={
                    <ProtectedRoute>
                      <Assessment />
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/gratitude" element={
                    <ProtectedRoute>
                      <Gratitude />
                    </ProtectedRoute>
                  } />
                  <Route path="/brain-games" element={
                    <ProtectedRoute>
                      <BrainGames />
                    </ProtectedRoute>
                  } />
                  <Route path="/mood-tracking" element={
                    <ProtectedRoute>
                      <MoodTracking />
                    </ProtectedRoute>
                  } />
                  <Route path="/accountability" element={
                    <ProtectedRoute>
                      <Accountability />
                    </ProtectedRoute>
                  } />
                  <Route path="/community" element={
                    <ProtectedRoute>
                      <Community />
                    </ProtectedRoute>
                  } />
                  <Route path="/notes" element={
                    <ProtectedRoute>
                      <Notes />
                    </ProtectedRoute>
                  } />
                  <Route path="/strategy" element={
                    <ProtectedRoute>
                      <Strategy />
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/testing" element={
                    <ProtectedRoute>
                      <Testing />
                    </ProtectedRoute>
                  } />
                  <Route path="/goals" element={
                    <ProtectedRoute>
                      <Goals />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/in-app-purchase" element={
                    <ProtectedRoute>
                      <InAppPurchase />
                    </ProtectedRoute>
                  } />
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
