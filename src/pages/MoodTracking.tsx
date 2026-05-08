import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, TrendingUp, Calendar, Zap, Minus, TrendingDown } from "lucide-react";
import { MoodStateSelector, MoodValue } from "@/components/sophisticated/MoodStateSelector";
import { EnergyLevelSelector, EnergyValue } from "@/components/sophisticated/EnergyLevelSelector";

const MoodTracking = () => {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [energyLevel, setEnergyLevel] = useState<EnergyValue>(3);
  const [notes, setNotes] = useState<string>("");

  const handleSave = () => {
    console.log("Saving mood entry:", { selectedMood, energyLevel, notes });
    setSelectedMood(null);
    setEnergyLevel(3);
    setNotes("");
  };

  const recent = [
    { label: "Yesterday", icon: Zap, tone: "text-memory-emerald-600 bg-memory-emerald-50", energy: 8 },
    { label: "2 days ago", icon: TrendingUp, tone: "text-brand-teal-600 bg-brand-teal-50", energy: 7 },
    { label: "3 days ago", icon: Minus, tone: "text-slate-600 bg-slate-50", energy: 5 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Mood &amp; Energy
        </h1>
        <p className="text-lg text-muted-foreground">
          A clear signal of how you're showing up today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-neural-magenta-500" strokeWidth={1.75} />
              How are you arriving today?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Mood</label>
              <MoodStateSelector value={selectedMood} onChange={setSelectedMood} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Energy</label>
              <EnergyLevelSelector value={energyLevel} onChange={setEnergyLevel} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Notes (optional)</label>
              <Textarea
                placeholder="Add context for today's signal..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleSave} className="w-full" disabled={!selectedMood}>
              Save Entry
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.label} className="flex justify-between items-center p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${r.tone}`}>
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="text-sm font-medium">{r.label}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Energy {r.energy}/10</div>
                  </div>
                );
              })}
            </div>

            <Button variant="outline" className="w-full mt-4">
              <Calendar className="h-4 w-4 mr-2" />
              View Full History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracking;
