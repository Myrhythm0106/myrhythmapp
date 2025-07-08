
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Heart, 
  Users, 
  Trophy, 
  Activity, 
  TrendingUp,
  Sparkles,
  Camera,
  Sun
} from "lucide-react";
import { useMobileSubscription } from "@/contexts/MobileSubscriptionContext";
import { usePlatform } from "@/components/platform/PlatformProvider";

export function EmpowermentDashboard() {
  const { subscriptionData } = useMobileSubscription();
  const { isMobile } = usePlatform();

  // Empowerment data - would come from user context in production
  const empowermentData = {
    todaysFocus: "Take a 10-minute walk outside",
    currentMood: "feeling-good",
    supportTeamCount: 4,
    winsThisWeek: 12,
    streakDays: 5,
    independenceProgress: 68
  };

  const empowermentBubbles = [
    {
      id: "today-focus",
      title: "Today I Will...",
      emoji: "🎯",
      content: empowermentData.todaysFocus,
      bgColor: "from-blue-400 to-blue-600",
      action: "Set My Focus",
      route: "/goals"
    },
    {
      id: "mood-check",
      title: "How I'm Feeling",
      emoji: "😊",
      content: "Tap to share your mood",
      bgColor: "from-green-400 to-green-600",
      action: "Share Mood",
      route: "/mood-tracking"
    },
    {
      id: "support-team",
      title: "My Support Heroes",
      emoji: "🦸‍♀️",
      content: `${empowermentData.supportTeamCount} people cheering you on`,
      bgColor: "from-purple-400 to-purple-600",
      action: "Connect",
      route: "/community"
    },
    {
      id: "my-wins",
      title: "My Wins",
      emoji: "🏆",
      content: `${empowermentData.winsThisWeek} wins this week!`,
      bgColor: "from-yellow-400 to-yellow-600",
      action: "Celebrate",
      route: "/wins"
    },
    {
      id: "health-check",
      title: "Daily Power-Up",
      emoji: "⚡",
      content: "Quick health check",
      bgColor: "from-red-400 to-red-600",
      action: "Check In",
      route: "/brain-games"
    },
    {
      id: "independence-journey",
      title: "My Journey",
      emoji: "🗻",
      content: `${empowermentData.independenceProgress}% to independence`,
      bgColor: "from-indigo-400 to-indigo-600",
      action: "See Progress",
      route: "/progress"
    }
  ];

  const handleBubbleClick = (route: string) => {
    window.location.href = route;
  };

  return (
    <div className={`space-y-6 ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Empowering Welcome */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">You're Amazing!</h1>
        <p className="text-lg text-gray-600">Ready to make today incredible?</p>
        
        {/* Streak Celebration */}
        <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-full border border-orange-200">
          <span className="text-2xl">🔥</span>
          <span className="font-semibold text-orange-700">
            {empowermentData.streakDays} days of awesome!
          </span>
        </div>
      </div>

      {/* Quick Mood Check */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">How are you feeling right now?</h3>
            <div className="flex justify-center gap-3">
              {['😊', '😐', '😔', '😴', '🤕'].map((emoji, index) => (
                <button
                  key={index}
                  className="w-12 h-12 text-2xl hover:scale-110 transition-transform duration-200 bg-white rounded-full shadow-sm border border-gray-200"
                  onClick={() => handleBubbleClick('/mood-tracking')}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empowerment Bubbles Grid */}
      <div className="grid grid-cols-2 gap-4">
        {empowermentBubbles.map((bubble) => (
          <Card 
            key={bubble.id}
            className="cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg border-0 overflow-hidden"
            onClick={() => handleBubbleClick(bubble.route)}
          >
            <div className={`bg-gradient-to-br ${bubble.bgColor} p-6 text-white text-center space-y-3`}>
              <div className="text-4xl">{bubble.emoji}</div>
              <h3 className="font-bold text-sm">{bubble.title}</h3>
              <p className="text-xs opacity-90 line-clamp-2">{bubble.content}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Independence Progress */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Your Independence Journey</h3>
            </div>
            
            {/* Visual Progress Path */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${empowermentData.independenceProgress}%` }}
                ></div>
              </div>
              <div className="absolute -top-8 right-0 transform translate-x-1/2">
                <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {empowermentData.independenceProgress}%
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              You're {100 - empowermentData.independenceProgress}% away from your independence goal! 🎉
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Support Team Quick Access */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Your Support Heroes</h3>
                <p className="text-sm text-gray-600">{empowermentData.supportTeamCount} people believe in you</p>
              </div>
            </div>
            <button
              onClick={() => handleBubbleClick('/community')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Connect
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Win Button */}
      <div className="text-center">
        <button
          onClick={() => handleBubbleClick('/wins')}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          🎉 I Did Something Awesome! 🎉
        </button>
      </div>
    </div>
  );
}
