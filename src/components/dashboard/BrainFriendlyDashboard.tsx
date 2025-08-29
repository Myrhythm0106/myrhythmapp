import React, { useState, useEffect } from 'react';
import { User, ArrowRight, CheckCircle2, Calendar, Target, TrendingUp, Star, Users, Brain, Clock, Activity, BarChart3, Gamepad2, Heart, Share2 } from 'lucide-react';
import { getRandomIChooseStatement } from '@/data/premiumAffirmations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function BrainFriendlyDashboard() {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [monthlyTheme, setMonthlyTheme] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('monthlyTheme') || 'Mindful Completion';
    setMonthlyTheme(savedTheme);
  }, []);

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const shareWithSupportCircle = () => {
    // Navigate to support circle or show share modal
    navigate('/support-circle');
  };

  const renderViewContent = () => {
    switch (currentView) {
      case 'day':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Today's Priorities */}
            <Card 
              className="border-2 border-brain-health-200 hover:border-brain-health-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-brain-health-50 to-brain-health-100/50" 
              onClick={() => handleNavigate('/goals')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-brain-health-700">
                  <Target className="h-5 w-5" />
                  Today's Priorities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-memory-emerald-500" />
                  <span className="text-sm text-foreground">Morning routine ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brain-health-500" />
                  <span className="text-sm text-foreground">Therapy notes review</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-sunrise-amber-500" />
                  <span className="text-sm text-foreground">Mindfulness practice</span>
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card 
              className="border-2 border-clarity-teal-200 hover:border-clarity-teal-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-clarity-teal-50 to-clarity-teal-100/50"
              onClick={() => handleNavigate('/calendar')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-clarity-teal-700">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-memory-emerald-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Dr. Johnson</p>
                    <p className="text-xs text-muted-foreground">2:30 PM - Follow up</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-brain-health-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Cognitive Training</p>
                    <p className="text-xs text-muted-foreground">4:00 PM - 30 mins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mood & Energy */}
            <Card 
              className="border-2 border-memory-emerald-200 hover:border-memory-emerald-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-memory-emerald-50 to-memory-emerald-100/50"
              onClick={() => handleNavigate('/tracking')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-memory-emerald-700">
                  <Activity className="h-5 w-5" />
                  Mood & Energy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Energy Level</span>
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-2 h-4 rounded ${i <= 3 ? 'bg-memory-emerald-500' : 'bg-memory-emerald-200'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Mood</span>
                  <span className="text-lg">😊</span>
                </div>
                <p className="text-xs text-muted-foreground">Feeling good today, ready for challenges!</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 border-sunrise-amber-200 hover:border-sunrise-amber-300 transition-all hover:shadow-lg bg-gradient-to-br from-sunrise-amber-50 to-sunrise-amber-100/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sunrise-amber-700">
                  <Star className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start text-xs border-brain-health-300"
                  onClick={() => handleNavigate('/gratitude')}
                >
                  <Heart className="h-3 w-3 mr-2" />
                  Gratitude Entry
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start text-xs border-brain-health-300"
                  onClick={() => handleNavigate('/brain-games')}
                >
                  <Brain className="h-3 w-3 mr-2" />
                  Brain Training
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start text-xs border-brain-health-300"
                  onClick={() => handleNavigate('/memory-bank')}
                >
                  <Star className="h-3 w-3 mr-2" />
                  Memory Capture
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'week':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weekly Goals Progress */}
            <Card 
              className="border-2 border-brain-health-200 hover:border-brain-health-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-brain-health-50 to-brain-health-100/50"
              onClick={() => handleNavigate('/goals')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brain-health-700">
                  <Target className="h-5 w-5" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Cognitive Training</span>
                    <span className="text-memory-emerald-600 font-medium">4/5 sessions</span>
                  </div>
                  <div className="w-full bg-brain-health-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Social Connections</span>
                    <span className="text-memory-emerald-600 font-medium">3/3 calls</span>
                  </div>
                  <div className="w-full bg-brain-health-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Schedule Overview */}
            <Card 
              className="border-2 border-clarity-teal-200 hover:border-clarity-teal-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-clarity-teal-50 to-clarity-teal-100/50"
              onClick={() => handleNavigate('/calendar')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-clarity-teal-700">
                  <Calendar className="h-5 w-5" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Mon: Therapy Session</span>
                    <span className="text-memory-emerald-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wed: Dr. Appointment</span>
                    <span className="text-brain-health-600">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fri: Support Group</span>
                    <span className="text-muted-foreground">Upcoming</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Analytics */}
            <Card 
              className="border-2 border-memory-emerald-200 hover:border-memory-emerald-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-memory-emerald-50 to-memory-emerald-100/50"
              onClick={() => handleNavigate('/analytics')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-memory-emerald-700">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-memory-emerald-600">87%</div>
                  <p className="text-sm text-muted-foreground">Goal completion rate</p>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-3">
                  {Array.from({length: 7}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-8 rounded-sm ${
                        i < 5 ? 'bg-memory-emerald-400' : 
                        i === 5 ? 'bg-brain-health-400' : 'bg-brain-health-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-center text-muted-foreground">Daily mood tracking</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'month':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Goals & Milestones */}
            <Card 
              className="border-2 border-brain-health-200 hover:border-brain-health-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-brain-health-50 to-brain-health-100/50"
              onClick={() => handleNavigate('/goals')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brain-health-700">
                  <Target className="h-5 w-5" />
                  Monthly Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-memory-emerald-50 rounded-lg border border-memory-emerald-200">
                    <CheckCircle2 className="h-5 w-5 text-memory-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Complete cognitive assessment</p>
                      <p className="text-xs text-muted-foreground">Scheduled for next week - 95% prepared</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-sunrise-amber-50 rounded-lg border border-sunrise-amber-200">
                    <Clock className="h-5 w-5 text-sunrise-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Update care plan</p>
                      <p className="text-xs text-muted-foreground">Review with healthcare team - in progress</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-clarity-teal-50 rounded-lg border border-clarity-teal-200">
                    <Users className="h-5 w-5 text-clarity-teal-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Family support meeting</p>
                      <p className="text-xs text-muted-foreground">Monthly check-in scheduled</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Progress Overview */}
            <Card 
              className="border-2 border-memory-emerald-200 hover:border-memory-emerald-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-memory-emerald-50 to-memory-emerald-100/50"
              onClick={() => handleNavigate('/analytics')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-memory-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-memory-emerald-600">78%</div>
                  <p className="text-sm text-muted-foreground">Overall progress this month</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cognitive Health</span>
                      <span className="text-memory-emerald-600">85%</span>
                    </div>
                    <div className="w-full bg-brain-health-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Social Wellness</span>
                      <span className="text-clarity-teal-600">72%</span>
                    </div>
                    <div className="w-full bg-brain-health-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-500 h-2 rounded-full w-[72%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily Routines</span>
                      <span className="text-brain-health-600">91%</span>
                    </div>
                    <div className="w-full bg-brain-health-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 h-2 rounded-full w-[91%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'year':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Annual Goals & Vision */}
            <Card 
              className="border-2 border-beacon-200 hover:border-beacon-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-beacon-50 to-beacon-100/50"
              onClick={() => handleNavigate('/goals')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-beacon-700">
                  <Star className="h-5 w-5" />
                  Annual Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 rounded-lg border border-brain-health-200">
                  <h3 className="font-bold text-lg text-brain-health-700 mb-2">Complete Independence</h3>
                  <p className="text-sm text-muted-foreground">Build cognitive strength and life skills for autonomous living</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-memory-emerald-50 rounded-lg">
                    <Brain className="h-5 w-5 text-memory-emerald-600" />
                    <div>
                      <p className="text-sm font-medium">Cognitive Enhancement</p>
                      <p className="text-xs text-muted-foreground">Memory and focus improvement</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-clarity-teal-50 rounded-lg">
                    <Users className="h-5 w-5 text-clarity-teal-600" />
                    <div>
                      <p className="text-sm font-medium">Social Connections</p>
                      <p className="text-xs text-muted-foreground">Expand meaningful relationships</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-sunrise-amber-50 rounded-lg">
                    <Target className="h-5 w-5 text-sunrise-amber-600" />
                    <div>
                      <p className="text-sm font-medium">Life Skills Mastery</p>
                      <p className="text-xs text-muted-foreground">Daily living independence</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Year in Review & Achievements */}
            <Card 
              className="border-2 border-memory-emerald-200 hover:border-memory-emerald-300 transition-all cursor-pointer hover:shadow-lg bg-gradient-to-br from-memory-emerald-50 to-memory-emerald-100/50"
              onClick={() => handleNavigate('/analytics')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-memory-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                  Year Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-memory-emerald-600">67%</div>
                  <p className="text-sm text-muted-foreground">Annual goals achieved</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-brain-health-50 rounded-lg border border-brain-health-200">
                    <div className="text-xl font-bold text-brain-health-600">247</div>
                    <p className="text-xs text-muted-foreground">Therapy sessions</p>
                  </div>
                  <div className="p-3 bg-clarity-teal-50 rounded-lg border border-clarity-teal-200">
                    <div className="text-xl font-bold text-clarity-teal-600">156</div>
                    <p className="text-xs text-muted-foreground">Skills practiced</p>
                  </div>
                  <div className="p-3 bg-sunrise-amber-50 rounded-lg border border-sunrise-amber-200">
                    <div className="text-xl font-bold text-sunrise-amber-600">89</div>
                    <p className="text-xs text-muted-foreground">Milestones hit</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cognitive Growth</span>
                    <span className="text-memory-emerald-600 font-medium">+32%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Social Confidence</span>
                    <span className="text-clarity-teal-600 font-medium">+45%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Independence Level</span>
                    <span className="text-brain-health-600 font-medium">+28%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50/30 via-background to-clarity-teal-50/30">
      {/* Header with #IChoose Statement */}
      <div className="text-center py-8 px-4 md:py-12 md:px-6">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-brain-health-700 via-clarity-teal-600 to-memory-emerald-600 bg-clip-text text-transparent mb-4">
          #IChoose to focus my mental energy on what matters most
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          This month's theme: <span className="font-medium text-brain-health-700">{monthlyTheme}</span>
        </p>
      </div>

      {/* Main Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <Card className="bg-card/95 backdrop-blur-sm border-2 border-brain-health-200/50 shadow-xl">
          <CardContent className="p-6 md:p-8">
            
            {/* Enhanced Navigation Tabs */}
            <div className="flex flex-col items-center mb-8 space-y-4">
              <div className="flex flex-wrap justify-center gap-2 bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 rounded-2xl p-2 border border-brain-health-200 shadow-inner">
                {[
                  { key: 'day', label: 'Today', icon: Clock },
                  { key: 'week', label: 'This Week', icon: Calendar },
                  { key: 'month', label: 'This Month', icon: Target },
                  { key: 'year', label: 'This Year', icon: TrendingUp }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={currentView === key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView(key as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      currentView === key 
                        ? 'bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white shadow-md hover:shadow-lg transform scale-105' 
                        : 'text-brain-health-700 hover:bg-brain-health-100/50 hover:text-brain-health-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{label}</span>
                  </Button>
                ))}
              </div>

              {/* Support Circle Sharing */}
              <Button
                variant="outline"
                size="sm"
                onClick={shareWithSupportCircle}
                className="flex items-center gap-2 px-4 py-2 border-2 border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50 transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm font-medium">Share with Support Circle</span>
              </Button>
            </div>

            {/* Dynamic Content Based on Selected View */}
            <div className="animate-fade-in">
              {renderViewContent()}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}