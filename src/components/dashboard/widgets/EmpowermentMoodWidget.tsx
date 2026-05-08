import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Sparkles, TrendingUp } from "lucide-react";
import { MoodStateSelector, MoodValue } from "@/components/sophisticated/MoodStateSelector";

export function EmpowermentMoodWidget() {
  const [, setSelectedMood] = useState<MoodValue | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
    setShowCelebration(true);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`mood_${today}`, mood);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  if (showCelebration) {
    return (
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white border-0 shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto border border-white/20">
            <Sparkles className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight">Assessment Recorded</h3>
          <p className="text-slate-200 text-base max-w-md mx-auto">
            Your wellness signal has been logged for personalised analysis and tailored support.
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-sm">
            <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
            <span>Building your wellness profile</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-gradient-to-br from-card to-muted/30 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
            <Heart className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          Daily Wellness Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground text-base">
          Select your current state for personalised support.
        </p>
        <MoodStateSelector onChange={handleMoodSelect} />
        <div className="text-center pt-3 border-t border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Wellness intelligence — for you, not about you
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
