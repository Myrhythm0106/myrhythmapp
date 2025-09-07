import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";

const affirmations = [
  "Every small step forward is progress worth celebrating",
  "Your mind is powerful and capable of amazing things", 
  "Today brings new opportunities to grow and heal",
  "You have the strength to navigate any challenge",
  "Your journey matters and you're not walking it alone",
  "Each moment of awareness is a gift to your future self",
  "Progress, not perfection, is what truly counts",
  "Your resilience grows stronger with every experience"
];

export function AffirmationCard() {
  // Get affirmation based on day of year to ensure consistency throughout the day
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const todaysAffirmation = affirmations[dayOfYear % affirmations.length];

  return (
    <Card className="bg-gradient-to-br from-memory-emerald-50 via-brain-health-50 to-clarity-teal-50 border-memory-emerald-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 flex-shrink-0 mt-1">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-memory-emerald-600" />
              <h3 className="text-sm font-medium text-brain-health-800">Today's Affirmation</h3>
            </div>
            <p className="text-sm text-brain-health-700 leading-relaxed italic">
              "{todaysAffirmation}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}