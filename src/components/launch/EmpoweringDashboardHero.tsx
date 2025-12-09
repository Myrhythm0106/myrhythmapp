import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sunrise, Sparkles, Crown, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getDaysRemainingInYear } from '@/hooks/useLaunchMode';

interface EmpoweringDashboardHeroProps {
  className?: string;
}

export function EmpoweringDashboardHero({ className }: EmpoweringDashboardHeroProps) {
  const { user } = useAuth();
  const daysRemaining = getDaysRemainingInYear();
  const [monthlyTheme, setMonthlyTheme] = useState<string>('');
  
  const hour = new Date().getHours();
  
  const getTimeBasedContent = () => {
    if (hour >= 5 && hour < 12) {
      return {
        greeting: "Good morning",
        message: "Your brain is fresh and ready for greatness",
        Icon: Sunrise,
        gradient: "from-amber-400 via-orange-400 to-rose-400",
        bgGradient: "from-amber-50 via-orange-50/50 to-rose-50"
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: "Good afternoon",
        message: "Keep the momentum going strong",
        Icon: Sun,
        gradient: "from-brain-health-400 via-clarity-teal-400 to-memory-emerald-400",
        bgGradient: "from-brain-health-50 via-clarity-teal-50/50 to-memory-emerald-50"
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        greeting: "Good evening",
        message: "Reflect on today's victories",
        Icon: Sparkles,
        gradient: "from-purple-400 via-brain-health-400 to-clarity-teal-400",
        bgGradient: "from-purple-50 via-brain-health-50/50 to-clarity-teal-50"
      };
    } else {
      return {
        greeting: "Good night",
        message: "Rest well, champion",
        Icon: Moon,
        gradient: "from-indigo-400 via-purple-400 to-brain-health-400",
        bgGradient: "from-indigo-50 via-purple-50/50 to-brain-health-50"
      };
    }
  };

  const getDefaultMonthTheme = () => {
    const themes = [
      "New Beginnings", "Heart & Connection", "Awakening Potential",
      "Renewal & Growth", "Strength & Clarity", "Abundance & Joy",
      "Freedom & Adventure", "Power & Confidence", "Wisdom & Learning",
      "Gratitude & Reflection", "Transformation", "Celebration & Peace"
    ];
    return themes[new Date().getMonth()];
  };

  useEffect(() => {
    const loadMonthlyTheme = async () => {
      if (!user) {
        setMonthlyTheme(getDefaultMonthTheme());
        return;
      }
      
      try {
        const { data } = await supabase
          .from('monthly_themes')
          .select('theme')
          .eq('user_id', user.id)
          .eq('month', new Date().getMonth() + 1)
          .eq('year', new Date().getFullYear())
          .single();
        
        setMonthlyTheme(data?.theme || getDefaultMonthTheme());
      } catch {
        setMonthlyTheme(getDefaultMonthTheme());
      }
    };
    
    loadMonthlyTheme();
  }, [user]);

  const content = getTimeBasedContent();
  const userName = user?.user_metadata?.name?.split(' ')[0] || 
                   user?.email?.split('@')[0] || 
                   'Champion';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${content.bgGradient} border border-brain-health-200/30 p-6 ${className}`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${content.gradient} blur-3xl`}
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-gradient-to-br from-memory-emerald-400 to-brain-health-400 blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Top row: Greeting + Days remaining */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`p-3 rounded-xl bg-gradient-to-br ${content.gradient} shadow-lg`}
            >
              <content.Icon className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brain-health-700 via-memory-emerald-700 to-clarity-teal-700 bg-clip-text text-transparent">
                {content.greeting}, {userName}!
              </h1>
              <p className="text-sm text-brain-health-600 font-medium">
                {content.message}
              </p>
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-right bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-brain-health-200/30"
          >
            <p className="text-2xl font-bold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 bg-clip-text text-transparent">
              {daysRemaining}
            </p>
            <p className="text-xs text-brain-health-600 font-medium">
              days to make magic
            </p>
          </motion.div>
        </div>

        {/* Command Center Title */}
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-bold tracking-widest text-brain-health-600 uppercase">
            Your Momentum Hub
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-brain-health-300/50 to-transparent" />
        </div>

        {/* Monthly Theme Badge */}
        {monthlyTheme && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brain-health-500/10 via-memory-emerald-500/10 to-clarity-teal-500/10 border border-brain-health-300/30"
          >
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-brain-health-700">
              This Month's Focus:
            </span>
            <span className="text-sm font-bold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 bg-clip-text text-transparent">
              {monthlyTheme}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
