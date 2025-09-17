import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, TrendingUp } from 'lucide-react';

export function FoundingMemberBanner() {
  const [usersCount, setUsersCount] = useState(127); // Starting count for demo
  const [timeLeft, setTimeLeft] = useState({
    days: 89,
    hours: 14,
    minutes: 32
  });

  // Simulate users joining (demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      setUsersCount(prev => {
        const newCount = prev + Math.floor(Math.random() * 3);
        return newCount > 1000 ? 1000 : newCount;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Countdown timer (demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes } = prev;
        
        if (minutes > 0) {
          minutes--;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
        }
        
        return { days, hours, minutes };
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const spotsRemaining = 1000 - usersCount;

  return (
    <div className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 text-white py-3 px-4 text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm font-medium">
        {/* Founding Member Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            🚀 Founding Member Launch
          </Badge>
        </div>

        {/* Users Counter */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{usersCount}/1,000 spots taken</span>
          <Badge variant="outline" className="bg-memory-emerald-600/50 text-white border-white/30">
            {spotsRemaining} left
          </Badge>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Special pricing ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
        </div>

        {/* Price Increase Warning */}
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp className="h-3 w-3" />
          <span>Then £39-£199/month</span>
        </div>
      </div>
    </div>
  );
}