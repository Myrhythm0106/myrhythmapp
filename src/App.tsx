
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Landing from "./pages/Landing";
import Welcome from "./pages/Welcome";
import MainLayout from "./components/layout/MainLayout";
import Profile from "./pages/Profile";
import SymptomTracking from "./pages/SymptomTracking";
import Calendar from "./pages/Calendar";
import Community from "./pages/Community";
import PersonalCommunity from "./pages/PersonalCommunity";
import UsefulInfo from "./pages/UsefulInfo";
import SplashScreen from "./components/mobile/SplashScreen";
import Customization from "./pages/Customization";
import Gratitude from "./pages/Gratitude";
import { useIsMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const isMobile = useIsMobile();

  // If on mobile device, show the mobile splash screen as home
  return (
    <Routes>
      {/* Use the SplashScreen for mobile, Landing for desktop */}
      <Route path="/" element={isMobile ? <SplashScreen /> : <Landing />} />
      
      {/* Direct to Dashboard */}
      <Route path="/dashboard" element={
        <MainLayout>
          <Dashboard />
        </MainLayout>
      } />
      
      {/* Welcome page after onboarding */}
      <Route path="/welcome" element={<Welcome />} />
      
      {/* Redirect /index to /dashboard */}
      <Route path="/index" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/customization" element={<Customization />} />
      
      {/* Routes with MainLayout */}
      <Route path="/profile" element={
        <MainLayout>
          <Profile />
        </MainLayout>
      } />
      <Route path="/calendar" element={
        <MainLayout>
          <Calendar />
        </MainLayout>
      } />
      <Route path="/tracking" element={
        <MainLayout>
          <SymptomTracking />
        </MainLayout>
      } />
      <Route path="/gratitude" element={
        <MainLayout>
          <Gratitude />
        </MainLayout>
      } />
      <Route path="/community" element={
        <MainLayout>
          <Community />
        </MainLayout>
      } />
      <Route path="/personal-community" element={
        <MainLayout>
          <PersonalCommunity />
        </MainLayout>
      } />
      <Route path="/useful-info" element={
        <MainLayout>
          <UsefulInfo />
        </MainLayout>
      } />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
