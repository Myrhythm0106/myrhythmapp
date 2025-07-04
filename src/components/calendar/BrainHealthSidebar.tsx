
import React from "react";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Clock, HeartPulse, Brain } from "lucide-react";

interface BrainHealthSidebarProps {
  date?: Date;
}

export function BrainHealthSidebar({ date }: BrainHealthSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Brain-Friendly Reminders */}
      <MemoryEffectsContainer nodeCount={3}>
        <Card className="border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-brain-lg">
              <Zap className="h-5 w-5 text-orange-500" />
              Gentle Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-memory-pulse" />
                <span className="text-brain-sm font-medium text-orange-800">
                  Brain Break Time
                </span>
              </div>
              <p className="text-brain-sm text-orange-700">
                You've been focused for 45 minutes. Time for a gentle 5-minute break.
              </p>
            </div>
            
            <div className="p-3 bg-memory-emerald-50 border border-memory-emerald-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-memory-emerald-400 rounded-full animate-memory-pulse" style={{animationDelay: '0.5s'}} />
                <span className="text-brain-sm font-medium text-memory-emerald-800">
                  Hydration Check
                </span>
              </div>
              <p className="text-brain-sm text-memory-emerald-700">
                Your brain needs water to function well. Have a sip!
              </p>
            </div>

            <div className="p-3 bg-clarity-teal-50 border border-clarity-teal-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-clarity-teal-400 rounded-full animate-memory-pulse" style={{animationDelay: '1s'}} />
                <span className="text-brain-sm font-medium text-clarity-teal-800">
                  Celebration Moment
                </span>
              </div>
              <p className="text-brain-sm text-clarity-teal-700">
                You completed 3 actions today! Your brain is building new pathways.
              </p>
            </div>
          </CardContent>
        </Card>
      </MemoryEffectsContainer>

      {/* Today's Brain Energy */}
      <MemoryEffectsContainer nodeCount={2}>
        <Card className="border-brain-health-200 bg-gradient-to-br from-brain-health-50/50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-brain-lg">
              <Brain className="h-5 w-5 text-brain-health-600" />
              Brain Energy Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-brain-sm text-gray-600">Focus Level</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-2 bg-gradient-to-r from-brain-health-400 to-memory-emerald-400 rounded-full" />
                </div>
                <span className="text-brain-sm font-medium">Good</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-brain-sm text-gray-600">Energy Level</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div className="w-2/3 h-2 bg-gradient-to-r from-clarity-teal-400 to-brain-health-400 rounded-full" />
                </div>
                <span className="text-brain-sm font-medium">Fair</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 text-center mb-3">
                Your brain works best with regular breaks and gentle challenges
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-brain-health-600 hover:bg-brain-health-50"
              >
                Log Energy Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </MemoryEffectsContainer>

      {/* Upcoming Memory Moments */}
      <MemoryEffectsContainer nodeCount={3}>
        <Card className="border-clarity-teal-200 bg-gradient-to-br from-clarity-teal-50/50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-brain-lg">
              <Clock className="h-5 w-5 text-clarity-teal-600" />
              Upcoming Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-white/60 rounded">
                <div className="w-2 h-2 bg-memory-emerald-400 rounded-full animate-memory-pulse" />
                <div className="flex-1">
                  <p className="text-brain-sm font-medium">Brain training session</p>
                  <p className="text-xs text-gray-500">2:00 PM • 15 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-white/60 rounded">
                <div className="w-2 h-2 bg-clarity-teal-400 rounded-full animate-memory-pulse" style={{animationDelay: '0.5s'}} />
                <div className="flex-1">
                  <p className="text-brain-sm font-medium">Gentle walk outside</p>
                  <p className="text-xs text-gray-500">4:30 PM • 20 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-white/60 rounded">
                <div className="w-2 h-2 bg-brain-health-400 rounded-full animate-memory-pulse" style={{animationDelay: '1s'}} />
                <div className="flex-1">
                  <p className="text-brain-sm font-medium">Evening reflection</p>
                  <p className="text-xs text-gray-500">7:00 PM • 10 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </MemoryEffectsContainer>
    </div>
  );
}
