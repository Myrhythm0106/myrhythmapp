
import { Toaster } from "@/components/ui/sonner";
import { Toaster as CustomToaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlatformProvider } from "@/components/platform/PlatformProvider";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Calendar from "./pages/Calendar";
import Gratitude from "./pages/Gratitude";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PlatformProvider>
            <ToastProvider>
              <TooltipProvider>
                <Toaster />
                <CustomToaster />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/assessment" element={<Assessment />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/gratitude" element={<Gratitude />} />
                </Routes>
              </TooltipProvider>
            </ToastProvider>
          </PlatformProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
