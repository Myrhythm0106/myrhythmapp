
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Calendar, CheckCircle2, Lightbulb, Sparkles, Target } from "lucide-react";
import { GameType } from "@/components/brain-games/types/gameTypes";

interface EssentialToolsSectionProps {
  recommendedGame: GameType;
}

export function EssentialToolsSection({ recommendedGame }: EssentialToolsSectionProps) {
  const navigate = useNavigate();
  
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        Your Essential Tools for an Intuitive Weekly View
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Focus Card */}
        <Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              My Focus Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded border flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <span>Complete 10-minute meditation</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded border flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                </div>
                <span>Take morning medication</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded border"></div>
                <span>Call doctor for appointment</span>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate("/dashboard")}>
              View All Tasks
            </Button>
          </CardContent>
        </Card>
        
        {/* Brain Game */}
        <Card className="bg-gradient-to-br from-amber-50/50 to-amber-100/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-amber-500" />
              Quick Brain Exercise
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              A short activity to boost your cognitive skills
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 p-2 rounded-md">
                  <Lightbulb className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">{recommendedGame.name}</p>
                  <p className="text-sm text-muted-foreground">5-minute session</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
              onClick={() => navigate("/dashboard")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Exercise
            </Button>
          </CardContent>
        </Card>
        
        {/* Routine Check-in */}
        <Card className="bg-gradient-to-br from-green-50/50 to-green-100/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Today's Routine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Progress</span>
                <span className="font-medium">2/4</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <span>Morning Medication</span>
                <span className="text-xs text-muted-foreground ml-auto">8:00 AM</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <span>15 Min Walk</span>
                <span className="text-xs text-muted-foreground ml-auto">10:00 AM</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="border p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <span>Evening Medication</span>
                <span className="text-xs text-muted-foreground ml-auto">8:00 PM</span>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate("/dashboard")}>
              View Full Routine
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
