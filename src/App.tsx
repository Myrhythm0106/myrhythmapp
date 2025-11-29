import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MockAuthWrapper } from "@/components/auth/MockAuthWrapper";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { DailyActionsProvider } from "@/contexts/DailyActionsContext";
import { PriorityProvider } from "@/contexts/PriorityContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SetupProgressProvider } from "@/contexts/SetupProgressContext";
import { SetupProgressBar } from "@/components/progress/SetupProgressBar";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { NavProvider } from "@/components/navigation/NavContext";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { lazy, Suspense } from "react";
import { PageSkeleton } from "@/components/loading/PageSkeleton";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import MemoryBridge from "./routes/MemoryBridge";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
// Lazy load heavy routes for better performance
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const Assessment = lazy(() => import("./pages/Assessment"));
const CommandCenter = lazy(() => import("./pages/CommandCenter"));

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
import OrganizationsDirectory from "./pages/OrganizationsDirectory";
import SymptomTracking from "./pages/SymptomTracking";
import AcceptInvitation from "./pages/AcceptInvitation";
import SupportMemberDashboard from "./pages/SupportMemberDashboard";
import { SupportMemberDashboardPage } from "./pages/SupportMemberDashboardPage";
import DemoLanding from "./pages/DemoLanding";
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
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
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
import EcosystemPage from "./pages/EcosystemPage";
import { NextStepsHub } from "./components/nextStepsHub/NextStepsHub";
import PlanSelectionPage from "./pages/PlanSelectionPage";
import { WelcomeCongratsPage } from "./components/mvp/WelcomeCongratsPage";
import { UserGuideTimeline } from "./components/mvp/UserGuideTimeline";
import VisionPage from "./pages/VisionPage";
import ColorSystemBible from "./pages/ColorSystemBible";
import FirstTimePage from "./pages/FirstTimePage";
import { SmartReminderToast } from "./components/notifications/SmartReminderToast";
import BrainInjuryWelcomePage from "./pages/BrainInjuryWelcomePage";
import MemoryFirstWelcomePage from "./pages/MemoryFirstWelcomePage";
import BrainHealthWelcomePage from "./pages/BrainHealthWelcomePage";
import CaregiverWelcomePage from "./pages/CaregiverWelcomePage";
import MedicalProfessionalWelcomePage from "./pages/MedicalProfessionalWelcomePage";
import CognitiveSupportWelcomePage from "./pages/CognitiveSupportWelcomePage";
import StudentWelcomePage from "./pages/StudentWelcomePage";
import ExecutiveWelcomePage from "./pages/ExecutiveWelcomePage";
import PostRecoveryWelcomePage from "./pages/PostRecoveryWelcomePage";

const queryClient = new QueryClient();

// Network status component
function NetworkStatusMonitor() {
  useNetworkStatus();
  return null;
}

// Authenticated Bottom Nav - only shows when user is logged in
function AuthenticatedBottomNav() {
  const { user, loading } = useAuth();
  
  // Hide nav while checking auth or if no user logged in
  if (loading || !user) return null;
  
  return <MobileBottomNav />;
}

function App() {
  console.log('🎯 App.tsx: App component rendering');
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MockAuthWrapper>
          <SubscriptionProvider>
            <PomodoroProvider>
              <DailyActionsProvider>
                <SetupProgressProvider>
                  <TooltipProvider>
                    <Toaster />
                    <SmartReminderToast />
                    <NetworkStatusMonitor />
                    <BrowserRouter>
                      <NavProvider>
                        <SetupProgressBar />
                        <Suspense fallback={<PageSkeleton />}>
                          <Routes>
     {/* Landing and Discovery Routes */}
                     <Route path="/" element={<Landing />} />
                     <Route path="/auth" element={<Auth />} />
                     <Route path="/dashboard" element={<Dashboard />} />
                     <Route path="/landing" element={<Landing />} />
                    <Route path="/demo-landing" element={<DemoLanding />} />
                    
                     {/* Subscription Routes - Now requires authentication */}
                     <Route path="/subscribe" element={<ProtectedRoute requireAuth={true}><SubscribePage /></ProtectedRoute>} />
                     
                     <Route path="/subscribe/cancel" element={<ProtectedRoute requireAuth={false}><SubscribeCancel /></ProtectedRoute>} />
                     <Route path="/payment/success" element={<ProtectedRoute requireAuth={false}><PaymentSuccessPage /></ProtectedRoute>} />
                     <Route path="/payment/cancel" element={<ProtectedRoute requireAuth={false}><PaymentCancelPage /></ProtectedRoute>} />
                     
      {/* Restrict Welcome page to post-payment users only */}
      <Route path="/welcome" element={<ProtectedRoute requireAuth={false}><Welcome /></ProtectedRoute>} />
                    
                     {/* Dashboard-First Experience - Remove default Dashboard redirect */}
                     <Route path="/mvp/user-type-selection" element={<GetStartedPage />} />
                     <Route path="/mvp/plan-selection" element={<ProtectedRoute requireAuth={false}><PlanSelectionPage /></ProtectedRoute>} />
                     <Route path="/mvp/welcome-congrats" element={<ProtectedRoute requireAuth={false}><WelcomeCongratsPage /></ProtectedRoute>} />
                     <Route path="/mvp/user-guide" element={<ProtectedRoute requireAuth={false}><UserGuideTimeline /></ProtectedRoute>} />
                     <Route path="/design/color-system" element={<ColorSystemBible />} />
                       
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
                      <Route path="/email-verification" element={<EmailVerification />} />
                       <Route path="/get-started" element={<GetStartedPage />} />
                       <Route path="/first-time" element={<FirstTimePage />} />
                     <Route path="/mvp-payment" element={<MVPPaymentPage />} />
                    <Route path="/accept-invitation" element={<AcceptInvitation />} />
                    <Route path="/support-member-dashboard" element={<ProtectedRoute><SupportMemberDashboard /></ProtectedRoute>} />
                    <Route path="/support-circle-dashboard" element={<ProtectedRoute><SupportMemberDashboardPage /></ProtectedRoute>} />
                     <Route path="/legal/disclaimer" element={<ProtectedRoute requireAuth={false}><Disclaimer /></ProtectedRoute>} />
                     <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/founders-story" element={<FoundersMemoryStory />} />
                    <Route path="/in-app-purchase" element={<InAppPurchase />} />
                    <Route path="/memory-bank" element={<ProtectedRoute requireAuth={false}><MemoryBank /></ProtectedRoute>} />
                    <Route path="/dashboard/*" element={<ProtectedRoute requireAuth={false}><Dashboard /></ProtectedRoute>} />
                     <Route path="/calendar" element={
                       <ProtectedRoute requireAuth={false}>
                         <PriorityProvider>
                           <CalendarPage />
                         </PriorityProvider>
                       </ProtectedRoute>
                     } />
                     <Route path="/vision" element={
                       <ProtectedRoute requireAuth={false}>
                         <VisionPage />
                       </ProtectedRoute>
                     } />
                     <Route path="/ecosystem" element={<ProtectedRoute requireAuth={false}><EcosystemPage /></ProtectedRoute>} />
                     <Route path="/next-steps" element={<ProtectedRoute requireAuth={false}><div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"><NextStepsHub /></div></ProtectedRoute>} />
                     <Route path="/next-steps-hub" element={<ProtectedRoute requireAuth={false}><div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"><NextStepsHub /></div></ProtectedRoute>} />
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
                     <Route path="/mvp/memory-first-welcome" element={<MemoryFirstWelcomePage />} />
                     <Route path="/mvp/brain-health-welcome" element={<BrainHealthWelcomePage />} />
                     <Route path="/mvp/caregiver-welcome" element={<CaregiverWelcomePage />} />
                     <Route path="/mvp/medical-professional-welcome" element={<MedicalProfessionalWelcomePage />} />
                     <Route path="/mvp/cognitive-support-welcome" element={<CognitiveSupportWelcomePage />} />
                     <Route path="/mvp/brain-injury-welcome" element={<BrainInjuryWelcomePage />} />
                     <Route path="/mvp/student-welcome" element={<StudentWelcomePage />} />
                     <Route path="/mvp/executive-welcome" element={<ExecutiveWelcomePage />} />
                     <Route path="/mvp/thriving-welcome" element={<PostRecoveryWelcomePage />} />
                     
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
                     <Route path="/mvp/user-selection" element={<GetStartedPage />} />
                     <Route path="/mvp/preview-4c" element={<MVPCore4CPage />} />
                      <Route path="/brain-friendly-dashboard" element={
                        <ProtectedRoute requireAuth={false}>
                          <PriorityProvider>
                            <BrainFriendlyDashboard />
                          </PriorityProvider>
                        </ProtectedRoute>
                      } />
                       <Route path="/congrats" element={<CongratsPage />} />
                   </Routes>
                        </Suspense>
                        <AuthenticatedBottomNav />
                      </NavProvider>
                    </BrowserRouter>
                  </TooltipProvider>
                </SetupProgressProvider>
              </DailyActionsProvider>
            </PomodoroProvider>
          </SubscriptionProvider>
        </MockAuthWrapper>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
