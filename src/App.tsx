
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Landing from "./pages/Landing";
import MainLayout from "./components/layout/MainLayout";
import Profile from "./pages/Profile";
import SymptomTracking from "./pages/SymptomTracking";
import Calendar from "./pages/Calendar";
import Community from "./pages/Community";
import PersonalCommunity from "./pages/PersonalCommunity";
import UsefulInfo from "./pages/UsefulInfo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors />
      <BrowserRouter>
        <Routes>
          {/* Landing page as the root */}
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Routes with MainLayout */}
          <Route path="/profile" element={
            <MainLayout>
              <Profile />
            </MainLayout>
          } />
          <Route path="/tracking" element={
            <MainLayout>
              <SymptomTracking />
            </MainLayout>
          } />
          <Route path="/calendar" element={
            <MainLayout>
              <Calendar />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
