
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import MemoryFirstIndex from "./pages/MemoryFirstIndex";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { OnboardingPage } from "./pages/OnboardingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FoundersMemoryStory from "./pages/FoundersMemoryStory";
import InAppPurchase from "./routes/InAppPurchase";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MemoryFirstIndex />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/founders-story" element={<FoundersMemoryStory />} />
              <Route path="/in-app-purchase" element={<InAppPurchase />} />
              <Route path="/dashboard/*" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/gratitude" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/brain-games" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/accountability" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
}

export default App;
