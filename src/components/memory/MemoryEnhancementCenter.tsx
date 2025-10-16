
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, TrendingUp, Calendar, Clock, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MemoryAssessment } from "./MemoryAssessment";
import { MemoryJourney } from "./MemoryJourney";
import { MemoryExercises } from "./MemoryExercises";
import { MemoryInsights } from "./MemoryInsights";
import { useMemoryProgress } from "@/hooks/use-memory-progress";

export function MemoryEnhancementCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("journey");
  const memoryProgress = useMemoryProgress();
  
  const handleStartMemoryAssessment = () => {
    setActiveTab("assessment");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="mobile-heading-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Memory Enhancement Center
            </h1>
            <p className="text-muted-foreground">
              Your personalized journey to stronger memory and cognitive wellness
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="mobile-heading-md font-bold text-blue-600">{memoryProgress.daysActive}</span>
              </div>
              <p className="text-sm text-muted-foreground">Days Active</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="mobile-heading-md font-bold text-green-600">{memoryProgress.tasksCompleted}</span>
              </div>
              <p className="text-sm text-muted-foreground">Memory Tasks</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="mobile-heading-md font-bold text-purple-600">{memoryProgress.improvementScore}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Improvement</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-4 w-4 text-amber-600" />
                <span className="mobile-heading-md font-bold text-amber-600">{memoryProgress.currentStreak}</span>
              </div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full overflow-x-auto flex md:grid md:grid-cols-4 gap-1">
          <TabsTrigger value="journey" className="flex-shrink-0">My Journey</TabsTrigger>
          <TabsTrigger value="exercises" className="flex-shrink-0">Exercises</TabsTrigger>
          <TabsTrigger value="insights" className="flex-shrink-0">Insights</TabsTrigger>
          <TabsTrigger value="assessment" className="flex-shrink-0">Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journey" className="space-y-6">
          <MemoryJourney />
        </TabsContent>
        
        <TabsContent value="exercises" className="space-y-6">
          <MemoryExercises />
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <MemoryInsights />
        </TabsContent>
        
        <TabsContent value="assessment" className="space-y-6">
          <MemoryAssessment />
        </TabsContent>
      </Tabs>
    </div>
  );
}
