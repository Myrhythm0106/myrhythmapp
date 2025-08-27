
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { DailyActionsProvider } from "@/contexts/DailyActionsContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import MemoryBridge from "./routes/MemoryBridge";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { OnboardingPage } from "./pages/OnboardingPage";
import WebOnboarding from "./pages/WebOnboarding";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { Disclaimer } from "./pages/legal/Disclaimer";
import TermsOfService from "./pages/TermsOfService";
import FoundersMemoryStory from "./pages/FoundersMemoryStory";
import InAppPurchase from "./routes/InAppPurchase";
import MemoryBank from "./routes/MemoryBank";
import Calendar from "./pages/Calendar";
import OrganizationsDirectory from "./pages/OrganizationsDirectory";
import SymptomTracking from "./pages/SymptomTracking";
import AcceptInvitation from "./pages/AcceptInvitation";
import SupportMemberDashboard from "./pages/SupportMemberDashboard";
import DemoLanding from "./pages/DemoLanding";
import Assessment from "./pages/Assessment";
import QuickAssessment from "./pages/QuickAssessment";
import BrainInjuryAssessment from "./pages/BrainInjuryAssessment";
import CognitivePerformanceAssessment from "./pages/CognitivePerformanceAssessment";
import MVPDashboardPage from "./pages/MVPDashboardPage";
import MVPAssessmentPage from "./pages/MVPAssessmentPage";
import MVPCorePage from "./pages/MVPCorePage";
import MVPCore4CPage from "./pages/MVPCore4CPage";
import MVPAssessmentFlowPage from "./pages/MVPAssessmentFlowPage";
import MVPAssessmentResults from "./pages/MVPAssessmentResults";
import CongratsPage from "./pages/CongratsPage";
import StartPage from "./pages/StartPage";
import LifeEmpowermentGuidePage from "./pages/LifeEmpowermentGuidePage";
import SetupWizard from "./pages/SetupWizard";
import { RedirectToStart } from "./components/redirects/RedirectToStart";
import SubscribePage from "./pages/SubscribePage";
import SubscribeSuccess from "./pages/SubscribeSuccess";
import SubscribeCancel from "./pages/SubscribeCancel";

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
                    {/* Landing and Discovery Routes */}
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/demo-landing" element={<DemoLanding />} />
                    
                    {/* Subscription Routes */}
                    <Route path="/subscribe" element={<ProtectedRoute requireAuth={false}><SubscribePage /></ProtectedRoute>} />
                    <Route path="/subscribe/success" element={<ProtectedRoute requireAuth={false}><SubscribeSuccess /></ProtectedRoute>} />
                    <Route path="/subscribe/cancel" element={<ProtectedRoute requireAuth={false}><SubscribeCancel /></ProtectedRoute>} />
                    
                    {/* Dashboard-First Experience - Default Route */}
                    <Route path="/" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                    
                    {/* Assessment Routes */}
                    <Route path="/assessment-old" element={<Assessment />} />
                    <Route path="/quick-assessment" element={<QuickAssessment />} />
                    <Route path="/comprehensive-assessment" element={<Assessment />} />
                    <Route path="/brain-injury-assessment" element={<BrainInjuryAssessment />} />
                    <Route path="/cognitive-performance-assessment" element={<CognitivePerformanceAssessment />} />
                    
                    <Route path="/memory-bridge" element={<ProtectedRoute><MemoryBridge /></ProtectedRoute>} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/accept-invitation" element={<AcceptInvitation />} />
                    <Route path="/support-member-dashboard" element={<ProtectedRoute><SupportMemberDashboard /></ProtectedRoute>} />
                     <Route path="/legal/disclaimer" element={<ProtectedRoute requireAuth={false}><Disclaimer /></ProtectedRoute>} />
                     <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/founders-story" element={<FoundersMemoryStory />} />
                    <Route path="/in-app-purchase" element={<InAppPurchase />} />
                    <Route path="/memory-bank" element={<ProtectedRoute requireAuth={false}><MemoryBank /></ProtectedRoute>} />
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
                        <ProtectedRoute requireAuth={false}>
                          <WebOnboarding />
                        </ProtectedRoute>
                      }
                    />
                    
                     {/* Warm Onboarding Flow */}
                     <Route path="/start" element={<StartPage />} />
                     
                     {/* New Assessment and Setup Flow */}
         <Route path="/mvp/assessment-flow" element={<MVPAssessmentFlowPage />} />
         <Route path="/mvp-assessment-results" element={<MVPAssessmentResults />} />
                     <Route path="/setup-wizard" element={<SetupWizard />} />
                     <Route path="/life-empowerment-guide" element={<LifeEmpowermentGuidePage />} />
                     
                      {/* Redirect assessment routes to /start for new users - but keep /mvp/assessment directing to MVPCore4C */}
                      <Route path="/mvp/assessment" element={<MVPCore4CPage />} />
                      <Route path="/assessment" element={<RedirectToStart />} />
                    
                    {/* MVP Routes */}
                    <Route path="/mvp-dashboard" element={<ProtectedRoute><MVPDashboardPage /></ProtectedRoute>} />
                    <Route path="/mvp-assessment" element={<ProtectedRoute><MVPAssessmentPage /></ProtectedRoute>} />
                    <Route path="/assessment-protected" element={<ProtectedRoute><MVPAssessmentPage /></ProtectedRoute>} />
                    <Route path="/mvp" element={<MVPCore4CPage />} />
                    <Route path="/mvp/preview-4c" element={<MVPCore4CPage />} />
                    <Route path="/congrats" element={<CongratsPage />} />
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
