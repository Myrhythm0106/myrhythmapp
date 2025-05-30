
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Flame, Plus, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGratitude } from "@/hooks/use-gratitude";
import { format } from "date-fns";

export function GratitudeSnapshotCard() {
  const navigate = useNavigate();
  const { entries } = useGratitude();
  
  const latestEntry = entries.length > 0 ? entries[0] : null;
  const streakCount = 5; // In a real app, we would calculate this
  
  const handleAddGratitude = () => {
    navigate("/gratitude");
  };
  
  const handleViewGratitude = () => {
    navigate("/gratitude");
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-amber-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-amber-600" />
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Your Gratitude Garden
            </span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          {streakCount > 0 && (
            <div className="flex items-center gap-1 text-sm font-normal bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span>{streakCount} Days Growing</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestEntry ? (
          <div className="bg-white/60 rounded-lg p-4 border border-amber-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-lg font-medium text-amber-900 mb-2">{latestEntry.text}</p>
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                  {format(new Date(latestEntry.date), "MMM d")}
                </span>
              </div>
            </div>
            
            {latestEntry.whyGrateful && (
              <div className="mt-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-md border border-rose-100">
                <span className="text-xs font-medium text-rose-600 block mb-1">Why this matters to me:</span>
                <span className="text-sm text-rose-700">{latestEntry.whyGrateful}</span>
              </div>
            )}
            
            <div className="mt-3 flex flex-wrap gap-1">
              {latestEntry.tags && latestEntry.tags.map((tag, index) => (
                <span key={index} className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full border border-amber-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center bg-white/40 rounded-lg border border-amber-100">
            <div className="mb-4">
              <HeartHandshake className="h-12 w-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-amber-800 mb-2">Start Your Gratitude Journey</h3>
              <p className="text-amber-700 text-sm">
                Every moment of gratitude plants a seed of growth in your heart
              </p>
            </div>
            <Button onClick={handleAddGratitude} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Plus className="mr-1 h-4 w-4" />
              Begin Growing
            </Button>
          </div>
        )}
      </CardContent>
      {latestEntry && (
        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleAddGratitude} className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50">
              <Plus className="mr-1 h-4 w-4" />
              New Growth
            </Button>
            <Button onClick={handleViewGratitude} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              View Garden
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
