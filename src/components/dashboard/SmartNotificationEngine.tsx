
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserData } from "@/hooks/use-user-data";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Bell, Clock, Heart, Trophy, Users } from "lucide-react";

interface SmartNotificationEngineProps {
  energyLevel?: number;
  dailyIntention?: string;
}

export function SmartNotificationEngine({ energyLevel, dailyIntention }: SmartNotificationEngineProps) {
  const userData = useUserData();
  const { hasFeature } = useSubscription();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are enabled
    const enabled = localStorage.getItem('smart_notifications_enabled') === 'true';
    setNotificationsEnabled(enabled);
    
    if (enabled) {
      setupSmartNotifications();
    }
  }, [energyLevel, userData.userType]);

  const setupSmartNotifications = () => {
    const userType = userData.userType || 'wellness';
    
    // Clear existing timers
    const existingTimers = JSON.parse(localStorage.getItem('notification_timers') || '[]');
    existingTimers.forEach((timerId: number) => clearTimeout(timerId));
    
    const newTimers: number[] = [];
    
    // Morning check-in reminder (if not completed)
    if (!localStorage.getItem(`morning_ritual_${new Date().toDateString()}`)) {
      const morningTimer = window.setTimeout(() => {
        showNotification('morning-checkin', 'Morning Check-in', 'Ready to start your day with intention? 🌅');
      }, 30 * 60 * 1000); // 30 minutes
      newTimers.push(morningTimer);
    }
    
    // Energy-based break reminders
    if (energyLevel) {
      const breakInterval = energyLevel <= 2 ? 45 : energyLevel <= 3 ? 60 : 90; // minutes
      const breakTimer = window.setTimeout(() => {
        showBreakReminder(userType, energyLevel);
      }, breakInterval * 60 * 1000);
      newTimers.push(breakTimer);
    }
    
    // Community celebration notifications
    const celebrationTimer = window.setTimeout(() => {
      showCommunityUpdate();
    }, 2 * 60 * 60 * 1000); // 2 hours
    newTimers.push(celebrationTimer);
    
    // Micro-win celebration
    const microWinTimer = window.setTimeout(() => {
      showMicroWinCelebration();
    }, 4 * 60 * 60 * 1000); // 4 hours
    newTimers.push(microWinTimer);
    
    // Evening reflection reminder
    const eveningTimer = window.setTimeout(() => {
      showEveningReflectionReminder();
    }, 8 * 60 * 60 * 1000); // 8 hours
    newTimers.push(eveningTimer);
    
    localStorage.setItem('notification_timers', JSON.stringify(newTimers));
  };

  const showNotification = (type: string, title: string, message: string, icon?: React.ReactNode) => {
    toast.success(message, {
      description: title,
      duration: 6000,
      action: {
        label: "View",
        onClick: () => handleNotificationClick(type),
      },
    });
  };

  const showBreakReminder = (userType: string, energyLevel: number) => {
    const breakSuggestions = {
      'brain-injury': {
        low: 'Time for a gentle 5-minute walk or breathing exercise 🌸',
        medium: 'Consider a 10-minute outdoor break or light stretching 🌳',
        high: 'Perfect time for a 15-minute creative activity or nature walk 🎨'
      },
      'caregiver': {
        low: 'Take 5 minutes for yourself - deep breathing or tea break ☕',
        medium: 'Step outside for fresh air or call a supportive friend 🌿',
        high: 'Enjoy a 10-minute walk or quick self-care activity 💆‍♀️'
      },
      'cognitive-optimization': {
        low: 'Brain break time! Try the 20-20-20 rule or desk stretches 🧠',
        medium: 'Strategic break: walk, hydrate, or do brain puzzles 🚶‍♂️',
        high: 'Power break: quick exercise or challenging brain game 🏃‍♂️'
      },
      'wellness': {
        low: 'Mindful moment: gratitude practice or gentle movement 🧘‍♀️',
        medium: 'Balance break: stretch, hydrate, or quick meditation 💧',
        high: 'Energy break: movement, music, or creative expression 🎵'
      }
    };
    
    const suggestion = breakSuggestions[userType as keyof typeof breakSuggestions] || breakSuggestions.wellness;
    const message = energyLevel <= 2 ? suggestion.low : energyLevel <= 3 ? suggestion.medium : suggestion.high;
    
    showNotification('break-reminder', 'Smart Break Time', message, <Clock className="h-4 w-4" />);
  };

  const showCommunityUpdate = () => {
    const messages = [
      'Your support network is cheering you on! 📣',
      'Someone in your community just completed their daily goal! 🎉',
      'New encouragement message from your watchers 💙',
      'Your progress is inspiring others in the community! ⭐'
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    showNotification('community-update', 'Community Update', message, <Users className="h-4 w-4" />);
  };

  const showMicroWinCelebration = () => {
    const celebrations = [
      'You\'ve been active for 4 hours straight! 🏆',
      'Micro-win: You\'re staying consistent today! ✨',
      'Your daily intention is guiding your actions! 🎯',
      'Small steps, big progress - you\'re doing great! 💪'
    ];
    
    const message = celebrations[Math.floor(Math.random() * celebrations.length)];
    showNotification('micro-win', 'Micro-Win Alert', message, <Trophy className="h-4 w-4" />);
  };

  const showEveningReflectionReminder = () => {
    showNotification(
      'evening-reflection',
      'Evening Reflection', 
      'Ready to reflect on today\'s wins and plan tomorrow? 🌙',
      <Heart className="h-4 w-4" />
    );
  };

  const handleNotificationClick = (type: string) => {
    switch (type) {
      case 'morning-checkin':
        // Navigate to morning ritual if not on that page
        break;
      case 'break-reminder':
        // Open break suggestions
        break;
      case 'community-update':
        // Navigate to community section
        break;
      case 'evening-reflection':
        // Navigate to evening reflection
        break;
      default:
        break;
    }
  };

  return null; // This component doesn't render anything visible
}
