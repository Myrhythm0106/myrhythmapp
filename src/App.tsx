import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { SidebarProvider } from './components/layout/Sidebar/SidebarContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { SecurityMonitor } from './components/security/SecurityMonitor';

// Public Pages
import Landing from './pages/Landing';
import FoundersStory from './pages/FoundersStory';
import Auth from './pages/Auth';
import EmailVerification from './pages/EmailVerification';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import MoodTracking from './pages/MoodTracking';
import Gratitude from './pages/Gratitude';
import SymptomTracking from './pages/SymptomTracking';
import TBICalendar from './pages/TBICalendar';
import Community from './pages/Community';
import PersonalCommunity from './pages/PersonalCommunity';
import Profile from './pages/Profile';
import SecuritySettings from './pages/SecuritySettings';
import Customization from './pages/Customization';
import UserGuideView from './pages/UserGuideView';
import UsefulInfo from './pages/UsefulInfo';
import Accountability from './pages/Accountability';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error?.message?.includes('auth') || error?.message?.includes('unauthorized')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SubscriptionProvider>
            <QueryClientProvider client={queryClient}>
              <SidebarProvider>
                <Toaster />
                <SecurityMonitor />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/founders-story" element={<FoundersStory />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/email-verification" element={<EmailVerification />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/faq" element={<FAQ />} />

                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Calendar />
                      </MainLayout>
                    </ProtectedRoute>
                  } />

                  <Route path="/accountability" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Accountability />
                      </MainLayout>
                    </ProtectedRoute>
                  } />

                  <Route path="/mood-tracking" element={
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

                  <Route path="/symptom-tracking" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <SymptomTracking />
                      </MainLayout>
                    </ProtectedRoute>
                  } />

                  <Route path="/tbi-calendar" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <TBICalendar />
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

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Profile />
                      </MainLayout>
                    </ProtectedRoute>
                  } />

                  <Route path="/security" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <SecuritySettings />
                      </MainLayout>
                    </ProtectedRoute>
                  } />

                  <Route path="/customization" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Customization />
                      </MainLayout>
                    </ProtectedRoute>
                  } />

                  <Route path="/user-guide" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <UserGuideView />
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

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SidebarProvider>
            </QueryClientProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
