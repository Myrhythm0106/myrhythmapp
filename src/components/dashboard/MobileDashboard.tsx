
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Target, 
  Brain, 
  Heart, 
  TrendingUp, 
  Star,
  Clock,
  CheckCircle,
  Users
} from "lucide-react";
import { useMobileSubscription } from "@/contexts/MobileSubscriptionContext";
import { usePlatform } from "@/components/platform/PlatformProvider";

export function MobileDashboard() {
  const { subscriptionData, features, hasFeature } = useMobileSubscription();
  const { isMobile } = usePlatform();

  const dashboardCards = [
    {
      title: "Today's Focus",
      icon: Target,
      content: "Complete morning routine",
      action: "View Goals",
      route: "/goals",
      premium: false
    },
    {
      title: "Brain Games",
      icon: Brain,
      content: "Daily training: 5 min left",
      action: "Play Now",
      route: "/brain-games",
      premium: false
    },
    {
      title: "Calendar",
      icon: Calendar,
      content: "3 events today",
      action: "View Schedule",
      route: "/calendar",
      premium: !hasFeature('calendarIntegration')
    },
    {
      title: "Mood Tracking",
      icon: Heart,
      content: "How are you feeling?",
      action: "Log Mood",
      route: "/mood-tracking",
      premium: !hasFeature('moodTracking')
    },
    {
      title: "Progress",
      icon: TrendingUp,
      content: "Week 2 of 12",
      action: "View Stats",
      route: "/dashboard",
      premium: !hasFeature('advancedInsights')
    },
    {
      title: "Community",
      icon: Users,
      content: "2 new messages",
      action: "Connect",
      route: "/community",
      premium: false
    }
  ];

  return (
    <div className={`space-y-4 ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Welcome Section */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Ready to optimize your rhythm?</p>
        
        {/* Subscription Status */}
        <div className="flex justify-center">
          <Badge 
            variant={subscriptionData.trial_active ? "default" : "secondary"}
            className="text-xs"
          >
            {subscriptionData.trial_active 
              ? `${subscriptionData.trial_days_left} days trial left`
              : subscriptionData.subscribed 
                ? `${subscriptionData.subscription_tier} plan`
                : 'Free plan'
            }
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-sm font-semibold">7</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
            <p className="text-sm font-semibold">12</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-3">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-sm font-semibold">2h</p>
            <p className="text-xs text-muted-foreground">Focused</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          const isLocked = card.premium;
          
          return (
            <Card key={index} className={`${isLocked ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-base">{card.title}</CardTitle>
                  </div>
                  {isLocked && (
                    <Badge variant="secondary" className="text-xs">
                      Premium
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">{card.content}</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  disabled={isLocked}
                  onClick={() => {
                    if (!isLocked) {
                      window.location.href = card.route;
                    }
                  }}
                >
                  {card.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upgrade CTA for trial users */}
      {subscriptionData.trial_active && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Love MyRhythm so far?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade now to keep all your progress and unlock premium features
            </p>
            <Button onClick={() => window.location.href = '/onboarding'}>
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
