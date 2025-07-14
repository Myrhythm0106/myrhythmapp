
import React, { useState } from "react";
import { Calendar, Settings, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedEmpowermentHub } from "@/components/empowerment/EnhancedEmpowermentHub";
import { InAppPurchasePage } from "@/components/empowerment/InAppPurchasePage";

export function EmpowermentDashboard() {
  const [showPurchasePage, setShowPurchasePage] = useState(false);
  const [currentStreak] = useState(12); // Mock data
  const [hasPremiumAccess] = useState(false); // Mock data
  const [userMood] = useState<'great' | 'okay' | 'struggling'>('great'); // Mock data

  if (showPurchasePage) {
    return (
      <div className="min-h-screen">
        <div className="mb-4 p-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowPurchasePage(false)}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
        </div>
        <InAppPurchasePage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-2 rounded-lg">
                <span className="text-white font-bold text-lg">MR</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MyRhythm</h1>
                <p className="text-sm text-gray-600">Empowerment Hub</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!hasPremiumAccess && (
                <Button
                  onClick={() => setShowPurchasePage(true)}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                  size="sm"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              )}
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Your Empowerment Hub
              </h2>
              <p className="text-lg text-gray-600">
                Transform your day with personalized #IChoose statements designed for your journey
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">Day {currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
          </div>
        </div>

        {/* Enhanced Empowerment Hub */}
        <div className="mb-8">
          <EnhancedEmpowermentHub
            userType="brain-injury"
            hasPremiumAccess={hasPremiumAccess}
            currentStreak={currentStreak}
            mood={userMood}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Daily Planner</h3>
              <p className="text-sm text-gray-600">Organize your empowered day</p>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setShowPurchasePage(true)}
          >
            <CardContent className="p-6 text-center">
              <Crown className="h-8 w-8 mx-auto mb-3 text-amber-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Premium Content</h3>
              <p className="text-sm text-gray-600">Unlock 700+ statements</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Support Circle</h3>
              <p className="text-sm text-gray-600">Connect with your team</p>
            </CardContent>
          </Card>
        </div>

        {/* Journey Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Your Empowerment Journey</span>
              <Badge variant="outline">{hasPremiumAccess ? 'Premium' : 'Free Tier'}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">{currentStreak}</div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{hasPremiumAccess ? '760+' : '60'}</div>
                <div className="text-sm text-gray-600">Statements Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Favorites Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 mb-1">85%</div>
                <div className="text-sm text-gray-600">Empowerment Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
