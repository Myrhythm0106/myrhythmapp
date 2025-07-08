
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
      icon: Target,
      content: empowermentData.todaysFocus,
      bgColor: "from-slate-600 via-slate-700 to-slate-800",
      textColor: "text-white",
      accentColor: "bg-blue-400",
      action: "Set My Focus",
      route: "/goals"
    },
    {
      id: "mood-check",
      title: "How I'm Feeling",
      icon: Heart,
      content: "Share your current state",
      bgColor: "from-emerald-600 via-emerald-700 to-emerald-800",
      textColor: "text-white",
      accentColor: "bg-emerald-400",
      action: "Check In",
      route: "/mood-tracking"
    },
    {
      id: "support-team",
      title: "My Support Network",
      icon: Users,
      content: `${empowermentData.supportTeamCount} professionals supporting you`,
      bgColor: "from-indigo-600 via-indigo-700 to-indigo-800",
      textColor: "text-white",
      accentColor: "bg-indigo-400",
      action: "Connect",
      route: "/community"
    },
    {
      id: "my-wins",
      title: "My Achievements",
      icon: Trophy,
      content: `${empowermentData.winsThisWeek} accomplishments this week`,
      bgColor: "from-amber-600 via-amber-700 to-amber-800",
      textColor: "text-white",
      accentColor: "bg-amber-400",
      action: "Celebrate",
      route: "/wins"
    },
    {
      id: "health-check",
      title: "Daily Wellness",
      icon: Activity,
      content: "Complete your health assessment",
      bgColor: "from-rose-600 via-rose-700 to-rose-800",
      textColor: "text-white",
      accentColor: "bg-rose-400",
      action: "Assess",
      route: "/brain-games"
    },
    {
      id: "independence-journey",
      title: "Progress Tracker",
      icon: TrendingUp,
      content: `${empowermentData.independenceProgress}% toward independence`,
      bgColor: "from-purple-600 via-purple-700 to-purple-800",
      textColor: "text-white",
      accentColor: "bg-purple-400",
      action: "View Progress",
      route: "/progress"
    }
  ];

  const handleBubbleClick = (route: string) => {
    window.location.href = route;
  };

  return (
    <div className={`space-y-8 ${isMobile ? 'p-6' : 'p-8'} bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen`}>
      {/* Professional Welcome Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Your Empowerment Hub
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Professionally designed tools to support your independence journey
          </p>
        </div>
        
        {/* Professional Streak Display */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-slate-200">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-slate-700">
            {empowermentData.streakDays} consecutive days of progress
          </span>
        </div>
      </div>

      {/* Professional Mood Check */}
      <Card className="bg-gradient-to-r from-slate-50 to-white border-slate-200 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Heart className="h-6 w-6 text-slate-600" />
              <h3 className="text-xl font-semibold text-slate-800">Daily Wellness Check</h3>
            </div>
            <p className="text-slate-600">Select your current state for personalized support</p>
            <div className="flex justify-center gap-4">
              {[
                { emoji: "😊", label: "Excellent", color: "hover:bg-emerald-50 hover:border-emerald-300" },
                { emoji: "😌", label: "Good", color: "hover:bg-blue-50 hover:border-blue-300" },
                { emoji: "😐", label: "Neutral", color: "hover:bg-yellow-50 hover:border-yellow-300" },
                { emoji: "😔", label: "Challenging", color: "hover:bg-orange-50 hover:border-orange-300" },
                { emoji: "🤕", label: "Difficult", color: "hover:bg-red-50 hover:border-red-300" }
              ].map((mood, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 text-2xl ${mood.color} transition-all duration-200 bg-white rounded-2xl shadow-md border-2 border-slate-200 flex flex-col items-center justify-center gap-1`}
                  onClick={() => handleBubbleClick('/mood-tracking')}
                >
                  <span>{mood.emoji}</span>
                  <span className="text-xs font-medium text-slate-600">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Empowerment Grid */}
      <div className="grid grid-cols-2 gap-6">
        {empowermentBubbles.map((bubble) => {
          const IconComponent = bubble.icon;
          return (
            <Card 
              key={bubble.id}
              className="cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl border-0 overflow-hidden group"
              onClick={() => handleBubbleClick(bubble.route)}
            >
              <div className={`bg-gradient-to-br ${bubble.bgColor} p-8 text-center space-y-4 relative overflow-hidden`}>
                {/* Professional accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${bubble.accentColor} opacity-10 rounded-full -mr-12 -mt-12`}></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`font-bold text-lg ${bubble.textColor} mb-2`}>{bubble.title}</h3>
                  <p className={`text-sm ${bubble.textColor} opacity-90 line-clamp-2 leading-relaxed`}>
                    {bubble.content}
                  </p>
                </div>
                
                {/* Professional hover indicator */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Professional Progress Tracker */}
      <Card className="bg-gradient-to-r from-white to-slate-50 border-slate-200 shadow-xl">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="h-8 w-8 text-slate-600" />
              <h3 className="text-2xl font-bold text-slate-800">Independence Progress</h3>
            </div>
            
            {/* Professional Progress Visualization */}
            <div className="relative">
              <div className="w-full bg-slate-200 rounded-full h-6 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 h-6 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${empowermentData.independenceProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="absolute -top-12 right-0 transform translate-x-1/2">
                <div className="bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {empowermentData.independenceProgress}%
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-slate-600">
                <span className="font-semibold text-slate-800">
                  {100 - empowermentData.independenceProgress}% remaining
                </span> to achieve your independence milestone
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Support Network */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Professional Support Network</h3>
                <p className="text-slate-600">{empowermentData.supportTeamCount} professionals actively supporting your journey</p>
              </div>
            </div>
            <button
              onClick={() => handleBubbleClick('/community')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Connect Now
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Professional Achievement Button */}
      <div className="text-center">
        <button
          onClick={() => handleBubbleClick('/wins')}
          className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 hover:from-slate-900 hover:via-slate-800 hover:to-slate-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 border border-slate-600"
        >
          Record New Achievement
        </button>
      </div>
    </div>
  );
}
