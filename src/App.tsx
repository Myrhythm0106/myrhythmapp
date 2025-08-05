
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { DailyActionsProvider } from "@/contexts/DailyActionsContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import MemoryFirstIndex from "./pages/MemoryFirstIndex";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { OnboardingPage } from "./pages/OnboardingPage";
import WebOnboarding from "./pages/WebOnboarding";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FoundersMemoryStory from "./pages/FoundersMemoryStory";
import InAppPurchase from "./routes/InAppPurchase";
import MemoryBank from "./routes/MemoryBank";
import MemoryBridge from "./routes/MemoryBridge";
import Watch from "./routes/Watch";
import Calendar from "./pages/Calendar";
import OrganizationsDirectory from "./pages/OrganizationsDirectory";
import SymptomTracking from "./pages/SymptomTracking";
import AcceptInvitation from "./pages/AcceptInvitation";
import SupportMemberDashboard from "./pages/SupportMemberDashboard";

const queryClient = new QueryClient();

function App() {
  console.log('🎯 App.tsx: App component rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <PomodoroProvider>
            <DailyActionsProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<MemoryFirstIndex />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/accept-invitation" element={<AcceptInvitation />} />
                    <Route path="/support-member-dashboard" element={<ProtectedRoute><SupportMemberDashboard /></ProtectedRoute>} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/founders-story" element={<FoundersMemoryStory />} />
                    <Route path="/in-app-purchase" element={<InAppPurchase />} />
                    <Route path="/memory-bank" element={<ProtectedRoute requireAuth={false}><MemoryBank /></ProtectedRoute>} />
                    <Route path="/memory-bridge" element={<ProtectedRoute requireAuth={false}><MemoryBridge /></ProtectedRoute>} />
                    <Route path="/watch" element={<ProtectedRoute requireAuth={false}><Watch /></ProtectedRoute>} />
                    <Route path="/dashboard/*" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute requireAuth={false}><Calendar /></ProtectedRoute>} />
                    <Route path="/organizations" element={<ProtectedRoute requireAuth={false}><OrganizationsDirectory /></ProtectedRoute>} />
                    <Route path="/tracking" element={<ProtectedRoute requireAuth={false}><SymptomTracking /></ProtectedRoute>} />
                    <Route path="/goals" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/gratitude" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/brain-games" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/accountability" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/support" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/support-circle" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route path="/testing" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    <Route
                      path="/onboarding"
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <OnboardingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/web-onboarding"
                      element={
                        <ProtectedRoute requireAuth={true}>
                          <WebOnboarding />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </DailyActionsProvider>
          </PomodoroProvider>
        </SubscriptionProvider>
      </AuthProvider>
  </QueryClientProvider>
  );
}

export default App;
