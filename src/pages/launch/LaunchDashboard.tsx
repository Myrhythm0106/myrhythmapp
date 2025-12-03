import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { CompactBrainTip } from '@/components/launch/CompactBrainTip';
import { getDaysRemainingInYear } from '@/hooks/useLaunchMode';
import { 
  Calendar, Gamepad2, Heart, Target, 
  ChevronRight, TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LaunchDashboard() {
  const navigate = useNavigate();
  const daysRemaining = getDaysRemainingInYear();
  
  // Get assessment results for personalization
  const launchData = JSON.parse(localStorage.getItem('myrhythm_launch_mode') || '{}');
  const isRecoveryUser = launchData.assessmentResults?.userType === 'recovery';
  const userName = 'there'; // Would come from auth

  return (
    <LaunchLayout>
      {/* Header with Days Remaining */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {userName} 👋
            </h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-emerald-600">{daysRemaining}</p>
            <p className="text-xs text-gray-500">days left in {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Compact Brain Tip */}
      <div className="mb-6">
        <CompactBrainTip />
      </div>

      {/* My Path Forward Card (Recovery Users) */}
      {isRecoveryUser && (
        <LaunchCard 
          variant="featured" 
          className="mb-6"
          onClick={() => navigate('/launch/support')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-emerald-200 flex items-center justify-center">
                <Target className="h-6 w-6 text-brand-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-emerald-800">My Path Forward</h3>
                <p className="text-sm text-brand-emerald-600">3 actions this week</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-brand-emerald-500" />
          </div>
        </LaunchCard>
      )}

      {/* Today's Focus */}
      <LaunchCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Today's Focus</h3>
          <span className="text-sm text-brand-emerald-600 font-medium">2 of 5 done</span>
        </div>
        
        <div className="space-y-3">
          {[
            { title: 'Morning routine', done: true },
            { title: 'Review calendar', done: true },
            { title: 'Call Dr. Smith', done: false },
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                task.done ? "bg-brand-emerald-500 border-brand-emerald-500" : "border-gray-300"
              )}>
                {task.done && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={cn(
                "text-sm",
                task.done ? "text-gray-400 line-through" : "text-gray-900 font-medium"
              )}>
                {task.title}
              </span>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm text-brand-emerald-600 font-medium hover:text-brand-emerald-700">
          View all →
        </button>
      </LaunchCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LaunchCard variant="glass" onClick={() => navigate('/launch/games')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">7</p>
              <p className="text-xs text-gray-500">Day streak 🔥</p>
            </div>
          </div>
        </LaunchCard>

        <LaunchCard variant="glass" onClick={() => navigate('/launch/gratitude')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Heart className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-500">Gratitudes</p>
            </div>
          </div>
        </LaunchCard>
      </div>

      {/* Weekly Progress */}
      <LaunchCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">This Week</h3>
          <TrendingUp className="h-5 w-5 text-brand-emerald-500" />
        </div>
        <div className="flex items-center gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={day + i} className="flex-1 text-center">
              <div className={cn(
                "w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium mb-1",
                i < 3 ? "bg-brand-emerald-500 text-white" : "bg-gray-100 text-gray-400"
              )}>
                {i < 3 ? '✓' : day}
              </div>
              <span className="text-xs text-gray-400">{day}</span>
            </div>
          ))}
        </div>
      </LaunchCard>
    </LaunchLayout>
  );
}
