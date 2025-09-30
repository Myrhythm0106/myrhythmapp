import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CommunityStats {
  totalUsers: number;
  dailyActive: number;
  weeklyWins: number;
  todayHighlight: string;
}

export function useCommunityStats() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem('community_stats');
        const cacheTime = localStorage.getItem('community_stats_time');
        
        if (cached && cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          // Use cache if less than 1 hour old
          if (age < 3600000) {
            setStats(JSON.parse(cached));
            setIsLoading(false);
            return;
          }
        }

        // Fetch total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch daily active users (users with actions today)
        const today = new Date().toISOString().split('T')[0];
        const { count: dailyActive } = await supabase
          .from('daily_actions')
          .select('user_id', { count: 'exact', head: true })
          .eq('date', today);

        // Fetch weekly wins
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count: weeklyWins } = await supabase
          .from('daily_actions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed')
          .gte('created_at', weekAgo.toISOString());

        const highlights = [
          'People are staying consistent with their daily routines and supporting each other.',
          'The community celebrated 50+ daily wins together today!',
          'New members are finding their rhythm and connecting with support circles.',
          'Several milestone achievements were reached this week - keep going!'
        ];

        const newStats: CommunityStats = {
          totalUsers: totalUsers || 0,
          dailyActive: dailyActive || 0,
          weeklyWins: weeklyWins || 0,
          todayHighlight: highlights[Math.floor(Math.random() * highlights.length)]
        };

        // Cache the results
        localStorage.setItem('community_stats', JSON.stringify(newStats));
        localStorage.setItem('community_stats_time', Date.now().toString());

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching community stats:', error);
        // Fallback stats
        setStats({
          totalUsers: 0,
          dailyActive: 0,
          weeklyWins: 0,
          todayHighlight: 'Building a supportive community together.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
}
