
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Calendar, Target, Users, Music, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Welcome to MyRhythm
              </h1>
              <p className="text-muted-foreground">Your Memory1st Journey to LEAP Forward</p>
            </div>
          </div>
        </div>

        {/* Featured: Personal Empowerment Hub */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Your Personal Empowerment Hub
                  </h3>
                  <p className="text-muted-foreground">
                    Daily #IChoose affirmations, victory celebrations, and LEAP progress tracking
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Memory1st Foundation</Badge>
                    <Badge variant="secondary">LEAP Outcomes</Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">New Features!</Badge>
                  </div>
                </div>
              </div>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => navigate("/personal-empowerment")}
              >
                Enter Hub
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-400"
            onClick={() => navigate("/mood")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                Mood Harmony
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">8.2/10</div>
              <p className="text-sm text-muted-foreground">Feeling empowered today with Memory1st stability</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-green-400"
            onClick={() => navigate("/goals")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                LEAP Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">78%</div>
              <p className="text-sm text-muted-foreground">Gentle progress building strong foundations</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-purple-400"
            onClick={() => navigate("/calendar")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Today's Rhythm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-2">3/5</div>
              <p className="text-sm text-muted-foreground">Memory1st activities completed</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-orange-400"
            onClick={() => navigate("/personal-community")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Support Circle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 mb-2">5</div>
              <p className="text-sm text-muted-foreground">People supporting your LEAP journey</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/gratitude")}
              >
                <Heart className="w-4 h-4 mr-2" />
                Add Gratitude Entry
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/notes")}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Capture Memory1st Insight
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/brain-games")}
              >
                <Brain className="w-4 h-4 mr-2" />
                Brain Training Session
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Completed mood check-in</span>
                <Badge variant="secondary" className="ml-auto text-xs">Today</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">LEAP goal progress updated</span>
                <Badge variant="secondary" className="ml-auto text-xs">Yesterday</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Memory1st practice session</span>
                <Badge variant="secondary" className="ml-auto text-xs">2 days ago</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your Memory1st → LEAP Journey</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every gentle step you take with Memory1st principles builds the foundation for your empowered LEAP forward. 
              Your brain is healing, your confidence is growing, and your potential is unlimited.
            </p>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}
