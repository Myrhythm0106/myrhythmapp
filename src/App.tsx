
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Landing from "./pages/Landing";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import EmailVerification from "./pages/EmailVerification";
import MainLayout from "./components/layout/MainLayout";
import Profile from "./pages/Profile";
import SymptomTracking from "./pages/SymptomTracking";
import TBICalendar from "./pages/TBICalendar";
import Community from "./pages/Community";
import PersonalCommunity from "./pages/PersonalCommunity";
import UsefulInfo from "./pages/UsefulInfo";
import SplashScreen from "./components/mobile/SplashScreen";
import Customization from "./pages/Customization";
import Gratitude from "./pages/Gratitude";
import { useIsMobile } from "./hooks/use-mobile";
import UserGuideView from "./pages/UserGuideView";
import FoundersStory from "./pages/FoundersStory";
import MoodTracking from "./pages/MoodTracking";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const isMobile = useIsMobile();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={isMobile ? <SplashScreen /> : <Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route path="/founders-story" element={<FoundersStory />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/guide" element={<UserGuideView />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/customization" element={
        <ProtectedRoute>
          <Customization />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout>
            <Profile />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/calendar" element={
        <ProtectedRoute>
          <TBICalendar />
        </ProtectedRoute>
      } />
      
      <Route path="/tracking" element={
        <ProtectedRoute>
          <MainLayout>
            <SymptomTracking />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/mood" element={
        <ProtectedRoute>
          <MainLayout>
            <MoodTracking />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gratitude" element={
        <ProtectedRoute>
          <MainLayout>
            <Gratitude />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/community" element={
        <ProtectedRoute>
          <MainLayout>
            <Community />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/personal-community" element={
        <ProtectedRoute>
          <MainLayout>
            <PersonalCommunity />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/useful-info" element={
        <ProtectedRoute>
          <MainLayout>
            <UsefulInfo />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Legacy redirects */}
      <Route path="/index" element={<Navigate to="/dashboard" replace />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastProvider>
        <Toaster />
        <Sonner richColors />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
