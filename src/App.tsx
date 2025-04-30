
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import LocalServices from "./pages/LocalServices";
import Onboarding from "./pages/Onboarding";
import MainLayout from "./components/layout/MainLayout";
import Profile from "./pages/Profile";
import SymptomTracking from "./pages/SymptomTracking";
import Calendar from "./pages/Calendar";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Routes with MainLayout */}
          <Route path="/resources" element={
            <MainLayout>
              <Resources />
            </MainLayout>
          } />
          <Route path="/local-services" element={
            <MainLayout>
              <LocalServices />
            </MainLayout>
          } />
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
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
