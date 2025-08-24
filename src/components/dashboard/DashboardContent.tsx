import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { WelcomeToApp } from "@/components/onboarding/WelcomeToApp";
import { UserGuideIntegration } from "@/components/onboarding/UserGuideIntegration";
import { CommandCenterLayout } from "./unified/CommandCenterLayout";
import { QuickActionZone } from "./unified/QuickActionZone";
import { CalendarDashboardIntegration } from "@/components/calendar/CalendarDashboardIntegration";
import { DashboardWelcome } from "./DashboardWelcome";
import { MemoryCoreStrip } from "./MemoryCoreStrip";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

function DashboardContentInner() {
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [dailyIntention, setDailyIntention] = useState<string>("");
  const { metrics, getNextUnlock } = useUserProgress();
  const { user } = useAuth();
  const { interactionMode, setInteractionMode } = useDashboard();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleUpgradeClick = () => {
    toast.success("Upgrade to Premium for unlimited features! 🚀");
  };

  const getRoleSpecificWelcome = () => {
    if (!user?.role) return null;
    
    const messages = {
      'brain-injury': 'Every step forward is progress. Your brain is healing and growing stronger.',
      'caregiver': 'Your care and dedication make a meaningful difference every day.',
      'cognitive-optimization': 'Optimize your cognitive abilities and achieve your highest potential.',
      'basic_user': 'Building habits and mindsets for lasting well-being and growth.'
    };
    
    return messages[user.role] || messages['basic_user'];
  };

  return (
    <div className="space-y-8">
      {/* Memory Core Strip - Memory First! */}
      <MemoryCoreStrip 
        interactionMode={interactionMode}
        onInteractionModeChange={setInteractionMode}
      />

      {/* Welcome Section */}
      <DashboardWelcome />
      
      {/* Role-specific welcome message */}
      {getRoleSpecificWelcome() && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-blue-600 text-sm">👋</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Welcome to your personalized dashboard!</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                {getRoleSpecificWelcome()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assessment upgrade reminder */}
      {user?.role === 'basic_user' && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 text-sm">🎯</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">Get Your Complete Assessment</h3>
              <p className="text-purple-800 text-sm mb-3">
                Unlock personalized insights and recommendations with our comprehensive memory and cognitive assessment.
              </p>
              <button 
                onClick={handleUpgradeClick}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                Take Full Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Section */}
      {metrics && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-green-900">Your Progress Journey</h2>
            <div className="text-green-700 text-sm">
              Level {metrics.engagementLevel} • {metrics.readinessScore} points
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{metrics.sessionsCount}</div>
              <div className="text-xs text-green-500">Active Sessions</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{metrics.featuresUsed.length}</div>
              <div className="text-xs text-green-500">Features Used</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{metrics.completedActions}</div>
              <div className="text-xs text-green-500">Actions Completed</div>
            </div>
          </div>
          {getNextUnlock() && (
            <div className="text-sm text-green-700 bg-green-100 rounded-lg p-3">
              <strong>Next unlock:</strong> {getNextUnlock()?.description}
            </div>
          )}
        </div>
      )}

      {/* Main Dashboard Layout */}
      <CalendarDashboardIntegration />
      <CommandCenterLayout />
      <QuickActionZone />

      {/* Support Components */}
      <WelcomeToApp showOnMount={false} />
      <UserGuideIntegration />
    </div>
  );
}

export function DashboardContent() {
  return (
    <DashboardProvider>
      <DashboardContentInner />
    </DashboardProvider>
  );
}