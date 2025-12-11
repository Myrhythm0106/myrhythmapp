import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { 
  Target, Plus, CheckCircle2, Circle, ChevronRight, 
  Sparkles, TrendingUp, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: string;
  dueDate?: string;
  milestones: { id: string; title: string; completed: boolean }[];
}

export default function LaunchGoals() {
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Improve Daily Focus',
      description: 'Build consistent focus habits through brain games',
      progress: 65,
      category: 'Cognitive',
      dueDate: '2025-01-15',
      milestones: [
        { id: 'm1', title: 'Complete 5 brain games', completed: true },
        { id: 'm2', title: 'Achieve 7-day streak', completed: true },
        { id: 'm3', title: 'Reach level 10', completed: false },
      ]
    },
    {
      id: '2',
      title: 'Practice Daily Gratitude',
      description: 'Write 3 gratitudes every day for 30 days',
      progress: 40,
      category: 'Wellbeing',
      dueDate: '2025-01-31',
      milestones: [
        { id: 'm1', title: 'Complete first week', completed: true },
        { id: 'm2', title: 'Complete two weeks', completed: false },
        { id: 'm3', title: 'Complete full month', completed: false },
      ]
    },
    {
      id: '3',
      title: 'Build Support Network',
      description: 'Add 3 members to your support circle',
      progress: 33,
      category: 'Social',
      milestones: [
        { id: 'm1', title: 'Add first member', completed: true },
        { id: 'm2', title: 'Add second member', completed: false },
        { id: 'm3', title: 'Add third member', completed: false },
      ]
    },
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cognitive': return 'bg-purple-100 text-purple-700';
      case 'Wellbeing': return 'bg-green-100 text-green-700';
      case 'Social': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const overallProgress = Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length);

  return (
    <LaunchLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
        <p className="text-gray-500 text-sm mt-1">Track your progress and celebrate wins</p>
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LaunchCard variant="featured" className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-emerald-400 to-brand-teal-500 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900">{overallProgress}%</p>
            </div>
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
          <Progress value={overallProgress} className="h-3 rounded-full" />
          <p className="text-xs text-gray-500 mt-2">{goals.length} active goals</p>
        </LaunchCard>
      </motion.div>

      {/* Goals List */}
      <div className="space-y-4 mb-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <LaunchCard className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-brand-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{goal.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{goal.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-900">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2 rounded-full" />
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                {goal.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-2">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-brand-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300" />
                    )}
                    <span className={`text-xs ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>

              {goal.dueDate && (
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(goal.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              )}
            </LaunchCard>
          </motion.div>
        ))}
      </div>

      {/* Add New Goal */}
      <LaunchButton className="w-full mb-24">
        <Plus className="h-5 w-5 mr-2" />
        Add New Goal
      </LaunchButton>
    </LaunchLayout>
  );
}
