import React from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { 
  TrendingUp, Brain, Heart, Users, Calendar,
  Flame, Trophy, Target, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export default function LaunchAnalytics() {
  const stats = {
    weeklyStreak: 7,
    totalActions: 42,
    gratitudeEntries: 18,
    brainGamesPlayed: 23,
    supportConnections: 3,
  };

  const weeklyProgress = [
    { day: 'Mon', completed: 5, total: 5 },
    { day: 'Tue', completed: 4, total: 5 },
    { day: 'Wed', completed: 5, total: 5 },
    { day: 'Thu', completed: 3, total: 5 },
    { day: 'Fri', completed: 5, total: 5 },
    { day: 'Sat', completed: 2, total: 3 },
    { day: 'Sun', completed: 1, total: 3 },
  ];

  const insights = [
    { 
      icon: Brain, 
      title: 'Focus Peak', 
      description: "You're most focused between 9-11am",
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      icon: Heart, 
      title: 'Mood Trend', 
      description: 'Your mood improved 15% this week',
      color: 'bg-pink-100 text-pink-600'
    },
    { 
      icon: Target, 
      title: 'Goal Progress', 
      description: '3 of 5 monthly goals on track',
      color: 'bg-green-100 text-green-600'
    },
  ];

  return (
    <LaunchLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">See your progress and insights</p>
      </div>

      {/* Streak Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LaunchCard variant="featured" className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-4xl font-bold text-gray-900">{stats.weeklyStreak} days</p>
              <p className="text-xs text-brand-emerald-600">🎉 Personal best!</p>
            </div>
          </div>
        </LaunchCard>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <LaunchCard className="p-4 text-center">
            <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalActions}</p>
            <p className="text-xs text-gray-500">Actions Completed</p>
          </LaunchCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <LaunchCard className="p-4 text-center">
            <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.gratitudeEntries}</p>
            <p className="text-xs text-gray-500">Gratitudes</p>
          </LaunchCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <LaunchCard className="p-4 text-center">
            <Brain className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.brainGamesPlayed}</p>
            <p className="text-xs text-gray-500">Brain Games</p>
          </LaunchCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <LaunchCard className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.supportConnections}</p>
            <p className="text-xs text-gray-500">Support Circle</p>
          </LaunchCard>
        </motion.div>
      </div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <LaunchCard className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-5 w-5 text-brand-emerald-600" />
            <h3 className="font-semibold text-gray-900">This Week</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyProgress.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gray-100 rounded-full h-24 relative overflow-hidden flex flex-col justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.completed / day.total) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                    className="w-full bg-gradient-to-t from-brand-emerald-500 to-brand-teal-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </LaunchCard>
      </motion.div>

      {/* Insights */}
      <div className="mb-24">
        <h3 className="font-semibold text-gray-900 mb-3">Insights</h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <LaunchCard variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${insight.color} flex items-center justify-center`}>
                    <insight.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{insight.title}</p>
                    <p className="text-xs text-gray-500">{insight.description}</p>
                  </div>
                </div>
              </LaunchCard>
            </motion.div>
          ))}
        </div>
      </div>
    </LaunchLayout>
  );
}
