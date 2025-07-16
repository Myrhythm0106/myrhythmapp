
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Brain, Calendar, Target, BookOpen, TrendingUp, Users, Settings, LogOut } from "lucide-react";
import { VerificationBanner } from "@/components/auth/VerificationBanner";

const Dashboard = () => {
  const { user, signOut, emailVerificationStatus } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const features = [
    {
      title: "Daily Tracking",
      description: "Track your mood, energy, and daily wins",
      icon: Calendar,
      available: true,
      path: "/daily-tracking"
    },
    {
      title: "Goals & Progress",
      description: "Set and track your recovery goals",
      icon: Target,
      available: true,
      path: "/goals"
    },
    {
      title: "Notes & Journaling",
      description: "Keep track of thoughts and insights",
      icon: BookOpen,
      available: true,
      path: "/notes"
    },
    {
      title: "Progress Analytics",
      description: "View your progress over time",
      icon: TrendingUp,
      available: emailVerificationStatus === 'verified',
      path: "/analytics"
    },
    {
      title: "Support Circle",
      description: "Connect with family and care team",
      icon: Users,
      available: emailVerificationStatus === 'verified',
      path: "/support"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.user_metadata?.name || 'there'}!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Verification Banner */}
        <VerificationBanner />

        {/* Welcome Message */}
        <Card className="mb-8 bg-gradient-to-r from-purple-100 via-blue-100 to-teal-100 border-none">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Memory1st Journey Starts Here
              </h2>
              <p className="text-gray-600">
                Begin with daily tracking to establish your rhythm, then explore goals and progress over time.
                {emailVerificationStatus === 'pending' && (
                  <span className="block mt-2 text-amber-700 font-medium">
                    🔐 Verify your email to unlock all premium features and secure data sync
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  feature.available
                    ? "hover:scale-105"
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => feature.available && navigate(feature.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      feature.available
                        ? "bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      {!feature.available && (
                        <span className="text-xs text-amber-600 font-medium">
                          Requires email verification
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Start Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium">Start with Daily Tracking</p>
                  <p className="text-sm text-gray-600">Log your mood and energy to establish baseline patterns</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium">Set Your First Goal</p>
                  <p className="text-sm text-gray-600">Create a simple, achievable goal to work towards</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  emailVerificationStatus === 'verified' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <span className={`font-bold text-sm ${
                    emailVerificationStatus === 'verified' ? 'text-purple-600' : 'text-gray-400'
                  }`}>3</span>
                </div>
                <div>
                  <p className={`font-medium ${emailVerificationStatus === 'verified' ? '' : 'text-gray-400'}`}>
                    Explore Advanced Features
                  </p>
                  <p className={`text-sm ${emailVerificationStatus === 'verified' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {emailVerificationStatus === 'verified' 
                      ? 'Access analytics, support circles, and detailed progress tracking'
                      : 'Available after email verification'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
