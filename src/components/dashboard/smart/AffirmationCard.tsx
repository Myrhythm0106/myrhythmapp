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
    <Card className="bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-2">BOLD</h1>
            <h2 className="text-2xl font-bold text-orange-600 italic leading-tight">
              #IChoose to be Bold<br />and Productive
            </h2>
            <p className="text-sm text-gray-600 mt-2 font-medium">Ephesians 3:20</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">Today's Affirmation</h3>
            </div>
            <p className="text-base text-gray-800 leading-relaxed italic font-medium">
              "{todaysAffirmation}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}