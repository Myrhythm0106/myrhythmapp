// @version 0.1
// MyRhythm App - Memory-First Architecture

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import MemoryFirstIndex from "./pages/MemoryFirstIndex";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { OnboardingPage } from "./pages/OnboardingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FoundersMemoryStory from "./pages/FoundersMemoryStory";
import MVPCorePage from "./pages/MVPCorePage";
import MemoryBridge from "./routes/MemoryBridge";
import CalendarPage from "./pages/CalendarPage";
import CommandCenter from "./pages/CommandCenter";

const queryClient = new QueryClient();

function AppMemoryFirst() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* ============= v0.1 PUBLIC ROUTES ============= */}
                {/* Landing & Marketing */}
                <Route path="/" element={<MemoryFirstIndex />} />
                <Route path="/founders-story" element={<FoundersMemoryStory />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                
                {/* MVP Assessment Flow */}
                <Route path="/mvp" element={<MVPCorePage />} />
                
                {/* Authentication */}
                <Route path="/auth" element={<Auth />} />

                {/* ============= v0.1 PROTECTED ROUTES ============= */}
                
                {/* @feature Memory Bridge - Voice recording & ACT extraction */}
                <Route
                  path="/memory-bridge"
                  element={<MemoryBridge />}
                />
                
                {/* @feature Next Steps Hub - ACT management with bulk scheduling */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* @feature Calendar - Schedule management */}
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <CalendarPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* @feature Support Circle - Family coordination */}
                <Route
                  path="/command-center"
                  element={
                    <ProtectedRoute>
                      <CommandCenter />
                    </ProtectedRoute>
                  }
                />
                
                {/* @feature Mood Tracking - Gratitude journal */}
                <Route
                  path="/gratitude"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* @feature Onboarding - User setup flow */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default AppMemoryFirst;