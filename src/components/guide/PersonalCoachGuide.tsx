import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star,
  Trophy, 
  Target,
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  Sparkles,
  MapPin,
  ChevronDown,
  Calendar,
  Brain,
  Users,
  BarChart3,
  Settings,
  Home,
  Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppFeature {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  status: 'not-started' | 'in-progress' | 'completed';
  timeEstimate: string;
  coachTip: string;
  nextSteps?: string[];
}

interface UserProgress {
  totalFeatures: number;
  completedFeatures: number;
  currentStreak: number;
  badges: string[];
}

export function PersonalCoachGuide() {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalFeatures: 6,
    completedFeatures: 2,
    currentStreak: 5,
    badges: ['First Steps', 'Daily Warrior']
  });

  const appFeatures: AppFeature[] = [
    {
      id: 'dashboard',
      title: 'Your Recovery Command Center',
      description: 'Start each day with confidence by checking your personalized dashboard',
      path: '/dashboard',
      icon: Home,
      status: 'completed',
      timeEstimate: '2 minutes daily',
      coachTip: "Amazing! You've mastered your daily check-in routine. Your consistency is building the foundation for lasting recovery.",
      nextSteps: ['Try customizing your dashboard widgets', 'Set up morning ritual reminders']
    },
    {
      id: 'goals',
      title: 'Your Recovery Roadmap',
      description: 'Set meaningful goals that celebrate every step forward in your journey',
      path: '/goals',
      icon: Target,
      status: 'in-progress',
      timeEstimate: '5-10 minutes to set up',
      coachTip: "You're making great progress! Goals give your brain something positive to focus on. Each small step is a victory worth celebrating.",
      nextSteps: ['Add one new goal this week', 'Break down your current goal into smaller steps']
    },
    {
      id: 'calendar',
      title: 'Your Healing Schedule',
      description: 'Organize your appointments, therapy, and recovery activities with ease',
      path: '/calendar',
      icon: Calendar,
      status: 'not-started',
      timeEstimate: '10 minutes to set up',
      coachTip: "Ready for the next step? Your calendar will become your recovery anchor, helping you build the routine that supports your healing.",
      nextSteps: ['Add your next appointment', 'Set up recurring therapy sessions']
    },
    {
      id: 'brain-games',
      title: 'Cognitive Strength Training',
      description: 'Rebuild and strengthen your cognitive abilities through engaging exercises',
      path: '/brain-games',
      icon: Brain,
      status: 'not-started',
      timeEstimate: '10-15 minutes daily',
      coachTip: "Your brain is remarkably adaptable! These exercises are like going to the gym for your mind - each session builds strength.",
      nextSteps: ['Try the Memory Match game', 'Start with 10 minutes daily']
    },
    {
      id: 'analytics',
      title: 'Your Progress Story',
      description: 'See your healing journey unfold through meaningful insights and trends',
      path: '/analytics',
      icon: BarChart3,
      status: 'not-started',
      timeEstimate: '5 minutes weekly',
      coachTip: "Your progress is a powerful story of resilience. These insights help you see how far you've come and guide your next steps.",
      nextSteps: ['Review your weekly progress', 'Identify your strongest patterns']
    },
    {
      id: 'accountability',
      title: 'Your Support Circle',
      description: 'Connect with family, friends, and healthcare providers who care about your recovery',
      path: '/accountability',
      icon: Users,
      status: 'not-started',
      timeEstimate: '15 minutes to set up',
      coachTip: "Recovery is a team sport! Your support circle becomes your cheering squad, helping you stay motivated and connected.",
      nextSteps: ['Invite one trusted person', 'Share your first progress update']
    }
  ];

  const progressPercentage = Math.round((userProgress.completedFeatures / userProgress.totalFeatures) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Play className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMotivationalMessage = () => {
    if (progressPercentage >= 80) return "You're absolutely crushing it! 🌟";
    if (progressPercentage >= 50) return "Look at you go! Halfway there! 💪";
    if (progressPercentage >= 25) return "Great start! You're building momentum! 🚀";
    return "Welcome to your journey! Every expert was once a beginner. 🌱";
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Personal Coach Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Your Personal Recovery Coach</h1>
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hi there! I'm here to guide you through every step of your healing journey. 
          Together, we'll unlock the full power of MyRhythm to support your recovery.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Your Recovery Progress
            <Badge variant="secondary" className="ml-2">
              {userProgress.currentStreak} day streak!
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{getMotivationalMessage()}</span>
            <span className="text-lg font-semibold">{progressPercentage}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex flex-wrap gap-2">
            {userProgress.badges.map((badge) => (
              <Badge key={badge} variant="outline" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="app-map" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="app-map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            App Map
          </TabsTrigger>
          <TabsTrigger value="daily-guide" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Daily Guide
          </TabsTrigger>
          <TabsTrigger value="quick-wins" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Quick Wins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="app-map" className="space-y-6">
          {/* Interactive App Map */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  feature.status === 'completed' ? 'border-green-200 bg-green-50/50' :
                  feature.status === 'in-progress' ? 'border-yellow-200 bg-yellow-50/50' :
                  'border-gray-200 hover:border-primary/30'
                }`}
                onClick={() => navigate(feature.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <feature.icon className="w-8 h-8 text-primary" />
                    <div className="flex items-center gap-2">
                      {getStatusIcon(feature.status)}
                      <Badge variant="outline" className={getStatusColor(feature.status)}>
                        {feature.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {feature.timeEstimate}
                  </div>

                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-sm font-medium text-primary mb-1">Coach's Tip:</p>
                    <p className="text-sm">{feature.coachTip}</p>
                  </div>

                  {feature.nextSteps && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Next Steps:</p>
                      {feature.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <ArrowRight className="w-3 h-3 text-primary" />
                          {step}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className="w-full mt-3"
                    variant={feature.status === 'completed' ? 'outline' : 'default'}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(feature.path);
                    }}
                  >
                    {feature.status === 'completed' ? 'Review & Optimize' : 
                     feature.status === 'in-progress' ? 'Continue Journey' : 'Start Here'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily-guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Your Daily Recovery Routine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">🌅 Morning (5-10 minutes)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Check your dashboard for today's focus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Log your morning mood and energy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Review today's appointments</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">🌆 Evening (10-15 minutes)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Practice gratitude journaling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Complete one brain exercise</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Plan tomorrow's priorities</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">💡 Coach's Daily Wisdom</h4>
                <p className="text-sm text-blue-800">
                  "Recovery isn't about perfection—it's about consistency. Even on tough days, 
                  completing just one small routine builds the neural pathways that support your healing. 
                  You're stronger than you know!"
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-wins" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  5-Minute Wins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Add one therapy appointment to your calendar",
                  "Complete your first mood check-in",
                  "Try the Memory Match brain game",
                  "Write one thing you're grateful for",
                  "Invite a family member to your support circle"
                ].map((win, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="text-sm">{win}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Weekly Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Complete 7 consecutive daily check-ins",
                  "Set up your first recovery goal",
                  "Play brain games for 5 days",
                  "Track your mood for a full week",
                  "Share progress with your support circle"
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Support & Encouragement */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6 text-center">
          <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">Remember: You're Not Alone</h3>
          <p className="text-muted-foreground mb-4">
            Every step you take in MyRhythm is a step toward reclaiming your life. 
            Your brain is healing, your strength is growing, and your future is bright.
          </p>
          <Button variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            Connect with Support Circle
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}