
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smile, TrendingUp, Calendar, Heart, Brain, Activity } from "lucide-react";

export default function MoodTrackingPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Smile className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Mood Harmony Tracking
              </h1>
              <p className="text-muted-foreground">Memory1st Approach to Emotional Wellness & LEAP Progress</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                Current Mood
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">😊</div>
                <div className="text-2xl font-bold text-blue-600">8/10</div>
                <p className="text-sm text-muted-foreground">Feeling empowered today</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Update Mood
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                Weekly Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mood Stability</span>
                  <Badge variant="secondary">+15%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Memory1st tracking shows gentle, consistent improvement
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-teal-600" />
                LEAP Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Energy Level</span>
                  <span className="text-sm font-semibold text-teal-600">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Focus Clarity</span>
                  <span className="text-sm font-semibold text-teal-600">Good</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Motivation</span>
                  <span className="text-sm font-semibold text-teal-600">Strong</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Memory1st Mood Journal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Today's Reflection</span>
                    <span className="text-xs text-muted-foreground">2:30 PM</span>
                  </div>
                  <p className="text-sm">Gentle progress with memory exercises. Feeling more confident about my LEAP journey.</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Yesterday's Note</span>
                    <span className="text-xs text-muted-foreground">Evening</span>
                  </div>
                  <p className="text-sm">Practiced gratitude and noticed improved mood stability.</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Add Mood Note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Mood Boosting Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Memory1st recommendations based on your mood patterns:
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  🧘 Gentle mindfulness (5 min)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  🎵 Calming music therapy
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📝 Quick gratitude note
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  🌱 Nature connection moment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Preview3Background>
  );
}
