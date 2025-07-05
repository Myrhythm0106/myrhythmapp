
import React from "react";
import { PomodoroTimer } from "./PomodoroTimer";
import { IntelligentBreakSuggestions } from "@/components/breaks/IntelligentBreakSuggestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Coffee, Users } from "lucide-react";

interface EnhancedPomodoroTimerProps {
  taskTitle?: string;
  onClose?: () => void;
  initialSettings?: any;
}

export function EnhancedPomodoroTimer({ taskTitle, onClose, initialSettings }: EnhancedPomodoroTimerProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timer" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Focus Timer
          </TabsTrigger>
          <TabsTrigger value="breaks" className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            Smart Breaks
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Family Time
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timer" className="mt-6">
          <PomodoroTimer 
            taskTitle={taskTitle}
            onClose={onClose}
            initialSettings={initialSettings}
          />
        </TabsContent>
        
        <TabsContent value="breaks" className="mt-6">
          <IntelligentBreakSuggestions />
        </TabsContent>
        
        <TabsContent value="family" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-heart-500" />
                Family Break Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                When your Pomodoro break starts, consider spending it with family. 
                Quality time with loved ones can be the most refreshing break of all.
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-heart-50 rounded-lg border border-heart-200">
                  <p className="font-medium text-heart-800 text-sm">Quick Family Breaks (5-15 min)</p>
                  <p className="text-xs text-heart-700 mt-1">
                    Perfect for Pomodoro short breaks: quick check-ins, hugs, or sharing what you're working on
                  </p>
                </div>
                <div className="p-3 bg-memory-emerald-50 rounded-lg border border-memory-emerald-200">
                  <p className="font-medium text-memory-emerald-800 text-sm">Extended Family Time (15-30 min)</p>
                  <p className="text-xs text-memory-emerald-700 mt-1">
                    Great for long breaks: eat together, take a walk, or do a quick activity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
