
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, TrendingUp, Bell, Calendar, Users } from "lucide-react";

export default function AccountabilityPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Gentle Accountability Hub
              </h1>
              <p className="text-muted-foreground">Memory1st Approach to Supportive Progress Tracking</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-violet-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-violet-600" />
                Weekly LEAP Commitments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-violet-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Daily Memory1st Practice</span>
                    <Badge variant="secondary">6/7 days</Badge>
                  </div>
                  <Progress value={86} className="h-2" />
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mood Check-ins</span>
                    <Badge variant="secondary">7/7 days</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="p-3 bg-violet-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Gratitude Practice</span>
                    <Badge variant="secondary">5/7 days</Badge>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Progress Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <p className="text-sm text-muted-foreground">Weekly Achievement Rate</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Consistency Score</span>
                  <span className="text-sm font-semibold text-purple-600">Excellent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">LEAP Momentum</span>
                  <span className="text-sm font-semibold text-violet-600">Strong</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Memory1st Stability</span>
                  <span className="text-sm font-semibold text-purple-600">Very Good</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-600" />
                Gentle Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Evening Reflection</span>
                    <span className="text-xs text-muted-foreground">7:00 PM</span>
                  </div>
                  <p className="text-xs">Time for your Memory1st gratitude practice</p>
                </div>
                <div className="p-3 bg-violet-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Morning LEAP Check-in</span>
                    <span className="text-xs text-muted-foreground">9:00 AM</span>
                  </div>
                  <p className="text-xs">Set your gentle intention for the day</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Customize Reminders
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Accountability Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">SC</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">Sarah Chen</span>
                    <p className="text-xs text-muted-foreground">Memory1st Journey Partner</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">DR</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">Dr. Rodriguez</span>
                    <p className="text-xs text-muted-foreground">Professional Support</p>
                  </div>
                  <Badge variant="secondary">Weekly</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Find Accountability Partner
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                Upcoming Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Partner Check-in</span>
                    <Badge variant="secondary">Tomorrow</Badge>
                  </div>
                  <p className="text-xs">Share LEAP progress with Sarah</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Review</span>
                    <Badge variant="secondary">Friday</Badge>
                  </div>
                  <p className="text-xs">Reflect on Memory1st journey progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-violet-600 mx-auto" />
              <h3 className="text-xl font-semibold">Gentle, Supportive Accountability</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Memory1st accountability isn't about pressure or judgment - it's about gentle support, 
                understanding, and celebrating every step forward. Our approach recognizes that healing 
                and growth happen at your own pace, with encouragement from those who care about your LEAP journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}
