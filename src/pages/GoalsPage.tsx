
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, CheckCircle, TrendingUp, Calendar, Star } from "lucide-react";

export default function GoalsPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                LEAP Goals & Progress
              </h1>
              <p className="text-muted-foreground">Memory1st Approach to Gentle, Sustainable Achievement</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-green-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Current LEAP Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Daily Memory1st Practice</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">85% completion this week</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Build Mood Stability</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Progress value={72} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">72% improvement tracked</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Goal
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Recent Victories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">7-day mood tracking streak</span>
                    <p className="text-xs text-muted-foreground">Completed yesterday</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">First gratitude journal week</span>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                Progress Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">78%</div>
                <p className="text-sm text-muted-foreground">Overall LEAP Progress</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Memory1st Foundation</span>
                  <span className="text-xs font-semibold">Strong</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Empowerment Growth</span>
                  <span className="text-xs font-semibold">Excellent</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Consistency</span>
                  <span className="text-xs font-semibold">Very Good</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Star className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-semibold">Memory1st Goal Philosophy</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our approach to goals honors your brain's need for gentle, sustainable progress. 
                Each small step builds neural pathways of success, creating momentum for your LEAP forward. 
                We celebrate progress, not perfection, and adjust goals to support your unique journey.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-xs text-muted-foreground">Goals Set</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">8</div>
                  <div className="text-xs text-muted-foreground">Achieved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">4</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}
