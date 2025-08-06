
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WelcomeScreen } from "@/components/dashboard/WelcomeScreen";
import { 
  Brain, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp,
  Sparkles,
  Heart,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user should see welcome flow
    const today = new Date().toDateString();
    const welcomeComplete = localStorage.getItem(`welcome_complete_${today}`);
    
    if (!welcomeComplete) {
      setShowWelcome(true);
    }
  }, []);

  const handleProceedToDashboard = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onProceedToDashboard={handleProceedToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-teal-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                MyRhythm Dashboard
              </h1>
              <p className="text-slate-600">Welcome back, {user?.email?.split('@')[0] || 'there'}!</p>
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1">
            <Sparkles className="h-4 w-4 mr-2" />
            Premium Active
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200/50">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-teal-800">85%</div>
              <p className="text-teal-600 text-sm">Progress This Week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200/50">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-800">7/10</div>
              <p className="text-blue-600 text-sm">Goals Achieved</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200/50">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-emerald-800">12</div>
              <p className="text-emerald-600 text-sm">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200/50">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-orange-800">4</div>
              <p className="text-orange-600 text-sm">Support Connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-teal-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Brain className="h-6 w-6" />
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-semibold text-teal-800 mb-2">Morning Cognitive Exercise</h3>
                  <p className="text-teal-700 text-sm mb-3">
                    Complete your daily brain training session to maintain cognitive flexibility.
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Start Exercise
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Memory Palace Practice</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    15 minutes of memory palace building with today's appointments.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Practice Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-6 w-6" />
                  Your Progress This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Memory Exercises</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                      </div>
                      <span className="text-sm font-medium text-teal-600">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Daily Goals</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-gradient-to-r from-blue-500 to-teal-500"></div>
                      </div>
                      <span className="text-sm font-medium text-blue-600">80%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Support Connections</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-3/5 h-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                      </div>
                      <span className="text-sm font-medium text-orange-600">60%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-emerald-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <Heart className="h-6 w-6" />
                  Daily Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                  <p className="text-emerald-800 font-medium italic text-center">
                    "Every small step forward is a victory worth celebrating. Your journey matters."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <MessageSquare className="h-6 w-6" />
                  Support Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 mb-1">
                    <strong>Sarah M.:</strong> "Great job on your morning routine!"
                  </p>
                  <p className="text-xs text-orange-600">2 hours ago</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 mb-1">
                    <strong>Dr. Chen:</strong> "Your progress report looks excellent."
                  </p>
                  <p className="text-xs text-orange-600">1 day ago</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Calendar className="h-6 w-6" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">Doctor Appointment</p>
                    <p className="text-slate-600">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">Support Group Meeting</p>
                    <p className="text-slate-600">Friday, 10:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
