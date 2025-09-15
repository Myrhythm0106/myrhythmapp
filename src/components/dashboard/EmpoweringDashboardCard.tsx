import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Brain,
  Heart
} from 'lucide-react';

interface EmpoweringDashboardCardProps {
  timeFrame: 'day' | 'week' | 'month' | 'year';
  onNavigate?: (path: string) => void;
}

export function EmpoweringDashboardCard({ timeFrame, onNavigate }: EmpoweringDashboardCardProps) {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  // Mock data - in real app would come from props/context
  const summaryData = {
    day: {
      completed: 3,
      total: 5,
      streak: 7,
      energy: 'High'
    },
    week: {
      completed: 18,
      total: 25,
      streak: 2,
      energy: 'Good'
    },
    month: {
      completed: 72,
      total: 100,
      streak: 1,
      energy: 'Steady'
    },
    year: {
      completed: 268,
      total: 365,
      streak: 12,
      energy: 'Strong'
    }
  };

  const currentData = summaryData[timeFrame];
  const completionRate = Math.round((currentData.completed / currentData.total) * 100);

  return (
    <Card className="premium-card border-0 bg-gradient-to-br from-brain-health-50/80 via-clarity-teal-50/60 to-memory-emerald-50/80 hover:shadow-xl transition-all duration-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-brain-health-900 flex items-center gap-2">
            <Brain className="h-5 w-5 text-brain-health-600" />
            Your {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} at a Glance
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-memory-emerald-100 to-clarity-teal-100 text-memory-emerald-700"
          >
            {completionRate}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="p-4 bg-white/60 rounded-lg border border-brain-health-200/50 hover:bg-white/80 transition-all cursor-pointer group"
            onClick={() => handleNavigation('/goals')}
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-brain-health-600" />
              <ArrowRight className="h-4 w-4 text-brain-health-400 group-hover:text-brain-health-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-2xl font-bold text-brain-health-900">{currentData.completed}</div>
            <div className="text-sm text-brain-health-600">Goals Achieved</div>
          </div>

          <div 
            className="p-4 bg-white/60 rounded-lg border border-clarity-teal-200/50 hover:bg-white/80 transition-all cursor-pointer group"
            onClick={() => handleNavigation('/support-circle')}
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-clarity-teal-600" />
              <ArrowRight className="h-4 w-4 text-clarity-teal-400 group-hover:text-clarity-teal-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-2xl font-bold text-clarity-teal-900">{currentData.streak}</div>
            <div className="text-sm text-clarity-teal-600">Support Team</div>
          </div>
        </div>

        {/* Interactive Summary Cards */}
        <div className="space-y-3">
          <div 
            className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-memory-emerald-200/50 hover:bg-white/80 transition-all cursor-pointer group"
            onClick={() => handleNavigation('/calendar')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-memory-emerald-900">Schedule & Activities</div>
                <div className="text-sm text-memory-emerald-600">View your personalized routine</div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-memory-emerald-400 group-hover:text-memory-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>

          <div 
            className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-beacon-200/50 hover:bg-white/80 transition-all cursor-pointer group"
            onClick={() => handleNavigation('/analytics')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-beacon-500 to-beacon-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-beacon-900">Progress Analytics</div>
                <div className="text-sm text-beacon-600">Energy: {currentData.energy} • Trending up</div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-beacon-400 group-hover:text-beacon-600 group-hover:translate-x-1 transition-all" />
          </div>

          <div 
            className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-brain-health-200/50 hover:bg-white/80 transition-all cursor-pointer group"
            onClick={() => handleNavigation('/gratitude')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brain-health-500 to-brain-health-600 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-brain-health-900">Gratitude & Wins</div>
                <div className="text-sm text-brain-health-600">Celebrate your victories</div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-brain-health-400 group-hover:text-brain-health-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Empowerment Message */}
        <div className="p-4 bg-gradient-to-r from-brain-health-100/80 to-clarity-teal-100/80 rounded-lg border border-brain-health-200/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-memory-emerald-600" />
            <span className="font-semibold text-brain-health-900">You're Making Amazing Progress!</span>
          </div>
          <p className="text-sm text-brain-health-700">
            Every click here takes you closer to your goals. Your journey matters, and you're exactly where you need to be.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}