
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Flame, Plus } from "lucide-react";
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
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            <span>Your Daily Gratitude</span>
          </div>
          {streakCount > 0 && (
            <div className="flex items-center gap-1 text-sm font-normal bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>{streakCount} Day Streak</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestEntry ? (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">{latestEntry.content}</p>
              <span className="text-xs text-muted-foreground">
                {format(new Date(latestEntry.date), "MMM d")}
              </span>
            </div>
            {latestEntry.why && (
              <div className="mt-2 text-sm text-muted-foreground bg-blue-50 p-2 rounded-md">
                <span className="font-medium text-blue-800">Reflection: </span>
                <span>{latestEntry.why}</span>
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {latestEntry.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="mb-4 text-muted-foreground">What are you grateful for today?</p>
            <Button onClick={handleAddGratitude} className="bg-gradient-to-r from-blue-500 to-indigo-500">
              <Plus className="mr-1 h-4 w-4" />
              Add Gratitude
            </Button>
          </div>
        )}
      </CardContent>
      {latestEntry && (
        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleAddGratitude} className="flex-1">
              <Plus className="mr-1 h-4 w-4" />
              New Entry
            </Button>
            <Button variant="secondary" onClick={handleViewGratitude} className="flex-1">
              View All
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
