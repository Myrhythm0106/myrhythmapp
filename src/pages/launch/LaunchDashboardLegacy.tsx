import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchAppTour } from '@/components/launch/LaunchAppTour';
import { EmpoweringDashboardHero } from '@/components/launch/EmpoweringDashboardHero';
import { MomentumCelebration } from '@/components/launch/MomentumCelebration';
import { PowerMovesSection } from '@/components/launch/PowerMovesSection';
import { WinningWeekTracker } from '@/components/launch/WinningWeekTracker';
import { MonthlyIChooseWidget } from '@/components/dashboard/hero/MonthlyIChooseWidget';
import { EmpowermentSignature } from '@/components/shared/EmpowermentSignature';
import { Target, ChevronRight } from 'lucide-react';

export default function LaunchDashboard() {
  const navigate = useNavigate();
  const [showTour, setShowTour] = useState(false);
  
  // Get assessment results for personalization
  const launchData = JSON.parse(localStorage.getItem('myrhythm_launch_mode') || '{}');
  const isRecoveryUser = launchData.assessmentResults?.userType === 'recovery';

  // Check if first-time user and show tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('myrhythm-launch-tour-completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for manual tour trigger from compass menu
  useEffect(() => {
    const handleShowTour = () => setShowTour(true);
    window.addEventListener('show-launch-tour', handleShowTour);
    return () => window.removeEventListener('show-launch-tour', handleShowTour);
  }, []);

  const handleTourClose = () => {
    setShowTour(false);
  };

  return (
    <LaunchLayout>
      {/* App Tour Dialog */}
      <LaunchAppTour isOpen={showTour} onClose={handleTourClose} />

      {/* Empowering Hero Section */}
      <EmpoweringDashboardHero className="mb-6" />

      {/* Daily #IChoose Affirmation - Centerpiece */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <MonthlyIChooseWidget userType={isRecoveryUser ? 'recovery' : 'general'} />
      </motion.div>

      {/* My Path Forward Card (Recovery Users) */}
      {isRecoveryUser && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LaunchCard 
            variant="featured" 
            className="mb-6 border-2 border-memory-emerald-200/50 bg-gradient-to-r from-memory-emerald-50 via-brain-health-50/30 to-clarity-teal-50"
            onClick={() => navigate('/launch/support')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-memory-emerald-800">My Path Forward</h3>
                  <p className="text-sm text-memory-emerald-600">3 power moves this week 💪</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-memory-emerald-500" />
            </div>
          </LaunchCard>
        </motion.div>
      )}

      {/* Momentum & Celebration Stats */}
      <MomentumCelebration className="mb-6" streak={7} gratitudeCount={12} />

      {/* Today's Power Moves */}
      <PowerMovesSection 
        className="mb-6"
        moves={[
          { title: 'Morning routine', done: true },
          { title: 'Review calendar', done: true },
          { title: 'Call Dr. Smith', done: false },
        ]}
        onViewAll={() => navigate('/launch/actions')}
      />

      {/* Winning Week Tracker */}
      <WinningWeekTracker className="mb-6" completedDays={[0, 1, 2]} />

      {/* Empowerment Signature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <EmpowermentSignature variant="prominent" context="general" />
      </motion.div>
    </LaunchLayout>
  );
}
