
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MockAuthWrapper } from "@/components/auth/MockAuthWrapper";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { DailyActionsProvider } from "@/contexts/DailyActionsContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SetupProgressProvider } from "@/contexts/SetupProgressContext";
import { SetupProgressBar } from "@/components/progress/SetupProgressBar";
import Landing from "./pages/Landing";
import MemoryBridge from "./routes/MemoryBridge";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import EmailVerification from "./pages/EmailVerification";
import MVPPaymentPage from "./pages/MVPPaymentPage";
import GetStartedPage from "./pages/GetStartedPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import WebOnboarding from "./pages/WebOnboarding";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { Disclaimer } from "./pages/legal/Disclaimer";
import TermsOfService from "./pages/TermsOfService";
import FoundersMemoryStory from "./pages/FoundersMemoryStory";
import InAppPurchase from "./routes/InAppPurchase";
import MemoryBank from "./routes/MemoryBank";
import CommandCenter from "./pages/CommandCenter";
import CalendarPage from "./pages/CalendarPage";
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
import AssessmentToCalendarPage from "./pages/AssessmentToCalendarPage";
import CongratsPage from "./pages/CongratsPage";
import StartPage from "./pages/StartPage";
import LifeEmpowermentGuidePage from "./pages/LifeEmpowermentGuidePage";
import SetupWizard from "./pages/SetupWizard";
import { IndividualSetupItem } from "./components/setup/IndividualSetupItem";
import { RedirectToStart } from "./components/redirects/RedirectToStart";
import SubscribePage from "./pages/SubscribePage";

import SubscribeCancel from "./pages/SubscribeCancel";
import GuidedJourneyPage from "./pages/GuidedJourneyPage";
import QuickCapture from "./pages/QuickCapture";
import TestingSuitePage from "./pages/TestingSuitePage";
import TestMemoryBridge from "./routes/TestMemoryBridge";
import { NextStepsDebugger } from "./components/debug/NextStepsDebugger";
import { BrainFriendlyDashboard } from "./components/dashboard/BrainFriendlyDashboard";
import Help from "./pages/Help";
import HelpGettingStarted from "./pages/HelpGettingStarted";
import Welcome from "./pages/Welcome";
import ExplorerPage from "./pages/ExplorerPage";
import PathSelectionPage from "./pages/PathSelectionPage";
import AssessmentResultsPage from "./pages/AssessmentResultsPage";

const queryClient = new QueryClient();

function App() {
  console.log('🎯 App.tsx: App component rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <MockAuthWrapper>
        <SubscriptionProvider>
          <PomodoroProvider>
            <DailyActionsProvider>
              <SetupProgressProvider>
                <TooltipProvider>
                  <Toaster />
                  <BrowserRouter>
                    <SetupProgressBar />
                  <Routes>
                    {/* Landing and Discovery Routes */}
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/demo-landing" element={<DemoLanding />} />
                    
                     {/* Subscription Routes */}
                     <Route path="/subscribe" element={<ProtectedRoute requireAuth={false}><SubscribePage /></ProtectedRoute>} />
                     
                     <Route path="/subscribe/cancel" element={<ProtectedRoute requireAuth={false}><SubscribeCancel /></ProtectedRoute>} />
                     
      {/* Restrict Welcome page to post-payment users only */}
      <Route path="/welcome" element={<ProtectedRoute requireAuth={false}><Welcome /></ProtectedRoute>} />
                    
                     {/* Dashboard-First Experience - Default Route */}
                     <Route path="/" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                     
                       {/* Legacy route redirects for brain-injury users - never lose progress */}
                       <Route path="/mvp/user-type-selection" element={<GetStartedPage />} />
                       
                       {/* Help Routes */}
                    <Route path="/help" element={<ProtectedRoute requireAuth={false}><Help /></ProtectedRoute>} />
                    <Route path="/help/getting-started" element={<ProtectedRoute requireAuth={false}><HelpGettingStarted /></ProtectedRoute>} />
                    
                     {/* Assessment Routes */}
                     <Route path="/assessment-old" element={<Assessment />} />
                     <Route path="/quick-assessment" element={<QuickAssessment />} />
                     <Route path="/comprehensive-assessment" element={<Assessment />} />
                     <Route path="/brain-injury-assessment" element={<BrainInjuryAssessment />} />
                     <Route path="/cognitive-performance-assessment" element={<CognitivePerformanceAssessment />} />
                     <Route path="/onboarding/assessment" element={<ProtectedRoute requireAuth={false}><Assessment /></ProtectedRoute>} />
                     <Route path="/assessment-results" element={<ProtectedRoute requireAuth={false}><AssessmentResultsPage /></ProtectedRoute>} />
                     
                     {/* Path Selection & Explorer Routes */}
                     <Route path="/path-selection" element={<ProtectedRoute requireAuth={false}><PathSelectionPage /></ProtectedRoute>} />
                     <Route path="/explorer" element={<ProtectedRoute requireAuth={false}><ExplorerPage /></ProtectedRoute>} />
                    
                    <Route path="/memory-bridge" element={<ProtectedRoute requireAuth={false}><MemoryBridge /></ProtectedRoute>} />
                    <Route path="/memory-bridge/test" element={<ProtectedRoute><TestMemoryBridge /></ProtectedRoute>} />
                    <Route path="/debug-next-steps" element={
                      <ProtectedRoute requireAuth={false}>
                        <div className="container mx-auto p-6">
                          <NextStepsDebugger />
                        </div>
                      </ProtectedRoute>
                    } />
                    <Route path="/testing-suite" element={<ProtectedRoute requireAuth={false}><TestingSuitePage /></ProtectedRoute>} />
                    <Route path="/quick-capture" element={<ProtectedRoute requireAuth={false}><QuickCapture /></ProtectedRoute>} />
                     <Route path="/auth" element={<Auth />} />
                     <Route path="/email-verification" element={<EmailVerification />} />
                      <Route path="/get-started" element={<GetStartedPage />} />
                       <Route path="/mvp/user-type-selection" element={<Auth />} />
                     <Route path="/mvp-payment" element={<MVPPaymentPage />} />
                    <Route path="/accept-invitation" element={<AcceptInvitation />} />
                    <Route path="/support-member-dashboard" element={<ProtectedRoute><SupportMemberDashboard /></ProtectedRoute>} />
                     <Route path="/legal/disclaimer" element={<ProtectedRoute requireAuth={false}><Disclaimer /></ProtectedRoute>} />
                     <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/founders-story" element={<FoundersMemoryStory />} />
                    <Route path="/in-app-purchase" element={<InAppPurchase />} />
                    <Route path="/memory-bank" element={<ProtectedRoute requireAuth={false}><MemoryBank /></ProtectedRoute>} />
                    <Route path="/dashboard/*" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                     <Route path="/calendar" element={<ProtectedRoute requireAuth={false}><CalendarPage /></ProtectedRoute>} />
                     <Route path="/command-center" element={<ProtectedRoute requireAuth={false}><CommandCenter /></ProtectedRoute>} />
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
         <Route path="/assessment-to-calendar" element={<AssessmentToCalendarPage />} />
                     <Route path="/setup-wizard" element={<SetupWizard />} />
                     <Route path="/setup-hub" element={<SetupWizard />} />
                     <Route path="/setup/:itemId" element={<IndividualSetupItem />} />
                     <Route path="/life-empowerment-guide" element={<LifeEmpowermentGuidePage />} />
                     <Route path="/guided-journey" element={<GuidedJourneyPage />} />
                     
                      {/* Redirect assessment routes to /start for new users - but keep /mvp/assessment directing to MVPCore4C */}
                      <Route path="/mvp/assessment" element={<MVPCore4CPage />} />
                      <Route path="/assessment" element={<RedirectToStart />} />
                    
                    {/* MVP Routes */}
                    <Route path="/mvp-dashboard" element={<ProtectedRoute><MVPDashboardPage /></ProtectedRoute>} />
                    <Route path="/mvp-assessment" element={<ProtectedRoute><MVPAssessmentPage /></ProtectedRoute>} />
                    <Route path="/assessment-protected" element={<ProtectedRoute><MVPAssessmentPage /></ProtectedRoute>} />
                     <Route path="/mvp" element={<MVPCore4CPage />} />
                     <Route path="/mvp/preview-4c" element={<MVPCore4CPage />} />
                      <Route path="/brain-friendly-dashboard" element={<ProtectedRoute requireAuth={false}><BrainFriendlyDashboard /></ProtectedRoute>} />
                       <Route path="/congrats" element={<CongratsPage />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </SetupProgressProvider>
          </DailyActionsProvider>
        </PomodoroProvider>
        </SubscriptionProvider>
      </MockAuthWrapper>
  </QueryClientProvider>
  );
}

export default App;
