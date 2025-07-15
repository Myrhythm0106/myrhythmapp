
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, TrendingUp, Calendar, MessageCircle } from "lucide-react";

const MoodTracking = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");

  const moods = [
    { emoji: "😊", label: "Great", value: "great" },
    { emoji: "🙂", label: "Good", value: "good" },
    { emoji: "😐", label: "Okay", value: "okay" },
    { emoji: "😔", label: "Low", value: "low" },
    { emoji: "😰", label: "Difficult", value: "difficult" }
  ];

  const handleSave = () => {
    console.log("Saving mood entry:", { selectedMood, energyLevel, notes });
    // Reset form
    setSelectedMood("");
    setEnergyLevel(5);
    setNotes("");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
          Mood & Energy Tracking
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your emotional well-being and energy levels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              How are you feeling today?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Mood</label>
              <div className="grid grid-cols-5 gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      selectedMood === mood.value
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Energy Level: {energyLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Notes (optional)</label>
              <Textarea
                placeholder="How are you feeling? What's on your mind?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Entry
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">😊</span>
                  <span className="text-sm">Yesterday</span>
                </div>
                <div className="text-sm text-muted-foreground">Energy: 8/10</div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🙂</span>
                  <span className="text-sm">2 days ago</span>
                </div>
                <div className="text-sm text-muted-foreground">Energy: 7/10</div>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">😐</span>
                  <span className="text-sm">3 days ago</span>
                </div>
                <div className="text-sm text-muted-foreground">Energy: 5/10</div>
              </div>
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
