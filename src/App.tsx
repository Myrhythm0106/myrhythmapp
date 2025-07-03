
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ToastProvider } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Landing from './pages/Landing';
import { AuthLayout } from './components/auth/AuthLayout';
import { BrainRecoveryHome } from './pages/BrainRecoveryHome';
import Onboarding from './pages/Onboarding';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import MoodTracking from './pages/MoodTracking';
import BrainGamesPage from './pages/BrainGamesPage';
import SymptomTracking from './pages/SymptomTracking';
import Goals from './pages/Goals';
import AccountabilityPage from './pages/AccountabilityPage';
import PersonalCommunity from './pages/PersonalCommunity';
import NotesPage from './pages/NotesPage';
import Profile from './pages/Profile';
import UsefulInfoPage from './pages/UsefulInfoPage';
import { MemoryEnhancementCenter } from "@/components/memory/MemoryEnhancementCenter";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <SubscriptionProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public routes - accessible to everyone */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<AuthLayout title="Welcome Back" />} />
                  <Route path="/brain-recovery" element={<BrainRecoveryHome />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  
                  {/* Protected routes - wrapped in authentication */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/memory" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <MemoryEnhancementCenter />
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
                  <Route path="/mood" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <MoodTracking />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/brain-games" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <BrainGamesPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/health-fitness" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <SymptomTracking />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/goals" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Goals />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/accountability" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AccountabilityPage />
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
                  <Route path="/notes" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <NotesPage />
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
                  <Route path="/useful-info" element={
                    <ProtectedRoute>
                      <MainLayout>
                        <UsefulInfoPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </ToastProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
