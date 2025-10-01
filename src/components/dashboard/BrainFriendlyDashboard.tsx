import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, Target, Sparkles, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePriorities } from "@/contexts/PriorityContext";
import { format } from "date-fns";

type ViewType = "day" | "week" | "month" | "year";

export function BrainFriendlyDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("day");
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    dailyPriorities,
    weeklyPriorities,
    monthlyPriorities,
    yearlyPriorities,
    getDailyProgress,
    getWeeklyProgress,
    getMonthlyProgress,
    getYearlyProgress,
  } = usePriorities();

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || "Bella";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", emoji: "🌅", message: "Choose Boldness & Clarity" };
    if (hour < 17) return { text: "Good Afternoon", emoji: "☀️", message: "Keep Your Momentum Strong" };
    return { text: "Good Evening", emoji: "🌙", message: "Reflect & Recharge" };
  };

  const greeting = getGreeting();
  const dailyProgress = getDailyProgress();
  const weeklyProgress = getWeeklyProgress();
  const monthlyProgress = getMonthlyProgress();
  const yearlyProgress = getYearlyProgress();

  const iChooseStatements = [
    "Focus Over Overwhelm",
    "Progress Over Perfection",
    "Courage Over Comfort",
    "Action Over Hesitation",
    "Growth Over Fear"
  ];
  
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const todaysChoice = iChooseStatements[dayOfYear % iChooseStatements.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-emerald-100 via-white to-brand-blue-100">
      
      {/* Enhanced Hero Header - Mockup Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8 sm:py-12 bg-gradient-to-r from-brand-emerald-400 via-brand-teal-400 to-brand-blue-400"
      >
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg leading-snug px-4">
          {greeting.text} {displayName} {greeting.emoji} — {greeting.message}
        </h1>
        <p className="text-base sm:text-xl text-white/90 mt-2 italic font-medium">
          #IChoose {todaysChoice}
        </p>
        <p className="text-sm text-white/80 mt-1">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>
      </motion.div>

      {/* View Toggle */}
      <div className="flex justify-center gap-2 sm:gap-4 py-4 sm:py-6 bg-white shadow-md sticky top-0 z-10">
        {(["day", "week", "month", "year"] as const).map((view) => (
          <Button
            key={view}
            variant={currentView === view ? "default" : "outline"}
            onClick={() => setCurrentView(view)}
            className={cn(
              "capitalize px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-emerald-400 shadow-lg hover:shadow-xl active:scale-[0.98]",
              currentView === view
                ? "bg-brand-emerald-600 text-white hover:bg-brand-emerald-700 border-2 border-brand-emerald-800"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-brand-emerald-50 hover:border-brand-emerald-500"
            )}
          >
            {view}
          </Button>
        ))}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-10 pb-16">
        
        {/* Day View */}
        {currentView === "day" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:gap-8 max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-brand-orange-100 to-brand-emerald-100 shadow-xl rounded-3xl border-0">
              <CardContent className="text-center p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-brand-orange-700 mb-2">Today's Focus</h2>
                <p className="text-3xl sm:text-4xl font-extrabold text-brand-emerald-900">
                  {dailyPriorities.p1 || "Set Your Top Priority"}
                </p>
                {dailyProgress.total > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-brand-teal-700 font-medium">
                      Progress: {dailyProgress.completed} / {dailyProgress.total} ({dailyProgress.percentage}%)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-brand-blue-100 to-white shadow-xl rounded-3xl border-0">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-brand-blue-700 flex items-center gap-2 mb-4">
                  <Target size={24} className="text-brand-blue-500"/> SMART Goals (3 max)
                </h2>
                <ul className="space-y-3 text-lg">
                  {[dailyPriorities.p1, dailyPriorities.p2, dailyPriorities.p3].map((priority, idx) => (
                    priority && (
                      <li key={idx} className="flex items-center gap-3 bg-brand-emerald-50/50 p-3 rounded-lg border border-brand-emerald-200 transition-all hover:bg-brand-emerald-100/50">
                        <CheckCircle2 className="text-brand-emerald-500 flex-shrink-0" size={22} />
                        <span className="text-brand-teal-800 font-medium">{priority}</span>
                      </li>
                    )
                  ))}
                  {!dailyPriorities.p1 && !dailyPriorities.p2 && !dailyPriorities.p3 && (
                    <li className="text-gray-500 italic text-center py-4">
                      No priorities set yet. Click below to plan your day! 📅
                    </li>
                  )}
                </ul>
                <Button
                  onClick={() => navigate("/calendar")}
                  className="w-full mt-6 bg-gradient-to-r from-brand-teal-500 to-brand-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Open Calendar to Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Week View */}
        {currentView === "week" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-brand-emerald-100 to-brand-blue-100 shadow-xl rounded-3xl p-6 sm:p-8 border-0">
              <h2 className="text-2xl font-bold text-brand-emerald-800 mb-4">Weekly Intention</h2>
              <p className="text-xl sm:text-2xl font-extrabold text-brand-blue-900">
                {weeklyPriorities.p1 || "This week I strengthen resilience 💪"}
              </p>
              {weeklyProgress.total > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-brand-teal-700 font-medium">
                    Weekly Progress: {weeklyProgress.percentage}% complete
                  </p>
                </div>
              )}
            </Card>

            <Card className="bg-gradient-to-br from-white to-brand-orange-100 shadow-xl rounded-3xl p-6 sm:p-8 border-0">
              <h2 className="text-xl font-semibold text-brand-orange-700 mb-4">Weekly Priorities</h2>
              <div className="space-y-3">
                {[weeklyPriorities.p1, weeklyPriorities.p2, weeklyPriorities.p3].map((priority, idx) => (
                  priority && (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-brand-blue-100 to-brand-emerald-50 rounded-xl p-4 shadow-md hover:scale-[1.02] transition-transform"
                    >
                      <p className="font-semibold text-base sm:text-lg text-brand-emerald-800 flex items-center gap-2">
                        <Sparkles className="text-brand-emerald-500" size={20} />
                        {priority}
                      </p>
                    </div>
                  )
                ))}
                {!weeklyPriorities.p1 && !weeklyPriorities.p2 && !weeklyPriorities.p3 && (
                  <p className="text-gray-500 italic text-center py-4">
                    No weekly priorities set. Plan your week in the calendar! 📅
                  </p>
                )}
              </div>
              <Button
                onClick={() => navigate("/calendar")}
                className="w-full mt-6 bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                View Week in Calendar
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Month View */}
        {currentView === "month" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-white to-brand-emerald-100 shadow-xl rounded-3xl p-6 sm:p-8 border-0">
              <h2 className="text-2xl font-bold text-brand-emerald-800 mb-6">Monthly Milestones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[monthlyPriorities.p1, monthlyPriorities.p2, monthlyPriorities.p3].map((milestone, idx) => (
                  milestone && (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-brand-orange-100 to-brand-blue-100 rounded-xl p-4 sm:p-6 shadow-lg border-b-4 border-brand-blue-400 hover:scale-[1.03] transition-transform"
                    >
                      <p className="font-semibold text-sm sm:text-lg text-brand-blue-900">{milestone}</p>
                    </div>
                  )
                ))}
                {!monthlyPriorities.p1 && !monthlyPriorities.p2 && !monthlyPriorities.p3 && (
                  <div className="col-span-full text-gray-500 italic text-center py-4">
                    No monthly milestones set. Define your month in the calendar! 📅
                  </div>
                )}
              </div>
              {monthlyProgress.total > 0 && (
                <div className="mt-8">
                  <p className="text-center text-brand-emerald-700 font-medium text-base sm:text-lg">
                    You are <span className="font-extrabold text-brand-emerald-900 text-2xl">{monthlyProgress.percentage}%</span> aligned with your monthly goals 🌱
                  </p>
                </div>
              )}
              <Button
                onClick={() => navigate("/calendar")}
                className="w-full mt-6 bg-gradient-to-r from-brand-blue-500 to-brand-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                View Month in Calendar
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Year View */}
        {currentView === "year" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-brand-emerald-100 to-white shadow-xl rounded-3xl p-6 sm:p-8 border-0">
              <h2 className="text-2xl font-bold text-brand-blue-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-brand-blue-600" size={28} />
                Yearly North Star Goals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[yearlyPriorities.p1, yearlyPriorities.p2, yearlyPriorities.p3].map((goal, idx) => (
                  goal && (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-brand-emerald-100 to-brand-orange-100 rounded-xl p-4 sm:p-6 shadow-lg border-b-4 border-brand-emerald-400 hover:scale-[1.03] transition-transform"
                    >
                      <p className="font-bold text-base sm:text-lg text-brand-emerald-900">{goal}</p>
                    </div>
                  )
                ))}
                {!yearlyPriorities.p1 && !yearlyPriorities.p2 && !yearlyPriorities.p3 && (
                  <div className="col-span-full text-gray-500 italic text-center py-4">
                    No yearly goals set. Define your vision in the calendar! 📅
                  </div>
                )}
              </div>
              {yearlyProgress.total > 0 && (
                <p className="mt-10 text-center text-lg sm:text-xl font-semibold text-brand-emerald-900">
                  Vision for {format(new Date(), "yyyy")} 🎯: Thriving with Balance + Growth
                </p>
              )}
              <Button
                onClick={() => navigate("/calendar")}
                className="w-full mt-6 bg-gradient-to-r from-brand-emerald-600 to-brand-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                View Year in Calendar
              </Button>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Bottom Motivational Message */}
      <div className="text-center py-8 bg-gradient-to-br from-brand-emerald-100 via-white to-brand-blue-100 border-t border-brand-teal-200/30">
        <p className="text-brand-teal-700 font-semibold text-lg mb-2">
          Your Calendar is your command center. All updates happen there.
        </p>
        <p className="text-sm text-brand-teal-600 italic">
          MyRhythm Dashboard — Brain-Friendly Productivity, Reimagined ✨
        </p>
      </div>
    </div>
  );
}