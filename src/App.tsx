
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
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
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthLayout title="Welcome Back" />} />
              <Route path="/brain-recovery" element={<BrainRecoveryHome />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/memory" element={<MemoryEnhancementCenter />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/mood" element={<MoodTracking />} />
                <Route path="/brain-games" element={<BrainGamesPage />} />
                <Route path="/health-fitness" element={<SymptomTracking />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/accountability" element={<AccountabilityPage />} />
                <Route path="/personal-community" element={<PersonalCommunity />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/useful-info" element={<UsefulInfoPage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
