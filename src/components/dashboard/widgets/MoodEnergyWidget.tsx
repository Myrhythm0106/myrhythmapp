import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Battery, ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GrowthMindsetMessage } from "@/components/shared/GrowthMindsetMessage";
import { MoodStateSelector, MoodValue } from "@/components/sophisticated/MoodStateSelector";

const COMPACT_MOODS = [
  { value: 'good' as const,    label: 'Strong',  icon: TrendingUp,  ring: 'ring-brand-teal-400',     fill: 'text-brand-teal-600 bg-brand-teal-50' },
  { value: 'neutral' as const, label: 'Steady',  icon: Battery,     ring: 'ring-slate-400',          fill: 'text-slate-600 bg-slate-50' },
  { value: 'challenging' as const, label: 'Low', icon: Heart,       ring: 'ring-brand-orange-400',   fill: 'text-brand-orange-600 bg-brand-orange-50' },
];

export function MoodEnergyWidget() {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<MoodValue | null>(null);
  const energyLevel = 75;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-neural-magenta-500" strokeWidth={1.75} />
          Mood &amp; Energy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GrowthMindsetMessage type="progress" />

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2 text-foreground">How are you arriving today?</p>
            <MoodStateSelector value={currentMood} onChange={setCurrentMood} options={COMPACT_MOODS} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Battery className="h-4 w-4 text-memory-emerald-500" strokeWidth={1.75} />
              <span className="text-sm font-medium">Energy</span>
              <span className="text-sm text-muted-foreground ml-auto">{energyLevel}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-memory-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${energyLevel}%` }}
              />
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/mood")}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Explore your trend
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
