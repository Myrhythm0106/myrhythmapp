import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCommunityStats } from '@/hooks/useCommunityStats';

export function CommunityStatsWidget() {
  const { stats, isLoading } = useCommunityStats();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-primary/10 rounded w-3/4" />
          <div className="h-4 bg-primary/10 rounded w-1/2" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">You're Not Alone</h2>
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-card rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Community Members</p>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="w-10 h-10 text-primary/20" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Walking this journey together
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 bg-card rounded-lg border"
          >
            <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-xl font-bold">{stats?.dailyActive || 0}</p>
            <p className="text-xs text-muted-foreground">Active today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 bg-card rounded-lg border"
          >
            <Heart className="w-5 h-5 text-red-500 mb-2" />
            <p className="text-xl font-bold">{stats?.weeklyWins || 0}</p>
            <p className="text-xs text-muted-foreground">Wins this week</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20"
        >
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Today in the Community</p>
              <p className="text-sm text-muted-foreground">
                {stats?.todayHighlight || 'People are staying consistent with their daily routines and supporting each other through challenges.'}
              </p>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground italic">
          "Where no one walks alone" 💙
        </p>
      </div>
    </Card>
  );
}
