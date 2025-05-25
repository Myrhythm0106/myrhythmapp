
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { useMoodTracker } from "@/hooks/use-mood-tracker";
import { Clock, Calendar, Eye, CalendarDays, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { useSupportCircle } from "@/hooks/use-support-circle";

// Import components
import { MoodSelectionInterface } from "./components/MoodSelectionInterface";
import { TodayMoodCard } from "./components/TodayMoodCard";
import { MoodSuggestionCard } from "./components/MoodSuggestionCard";
import { WeeklyMoodView } from "./components/WeeklyMoodView";
import { MonthlyMoodView } from "./components/MonthlyMoodView";
import { SupportCircleShareDialog } from "./components/SupportCircleShareDialog";
import { GratitudePrompt } from "@/components/gratitude/GratitudePrompt";
import { useGratitude } from "@/hooks/use-gratitude";
import { 
  getChartData, 
  getMoodTrendInsight, 
  getWeeklyRecommendations,
  getMonthlyInsight,
  getAverageMoodLabel,
  getSuggestions
} from "./utils/moodUtils";

const moodValueMap: Record<string, { mood: "great" | "okay" | "struggling"; score: number }> = {
  "very-negative": { mood: "struggling", score: 1 },
  "negative": { mood: "struggling", score: 2 },
  "neutral": { mood: "okay", score: 3 },
  "positive": { mood: "great", score: 4 },
  "very-positive": { mood: "great", score: 5 }
};

export function MoodTrackerView() {
  const [selectedView, setSelectedView] = useState("today");
  const [showGratitude, setShowGratitude] = useState(false);
  const { addEntry, entries, isLoading } = useMoodTracker();
  const { members } = useSupportCircle();
  const { addEntry: addGratitudeEntry } = useGratitude();
  
  const handleMoodSubmit = (moodValue: string, note: string) => {
    const moodData = moodValueMap[moodValue];
    
    if (moodData) {
      const newEntry = {
        id: crypto.randomUUID(),
        date: new Date(),
        mood: moodData.mood,
        score: moodData.score,
        note: note || undefined
      };
      
      addEntry(newEntry);
      toast.success("Your mood has been recorded");
      
      // Show gratitude prompt after mood entry
      setShowGratitude(true);
    }
  };

  const handleGratitudeSave = (entry: any) => {
    addGratitudeEntry(entry);
    setShowGratitude(false);
  };

  // Filter entries based on selected view
  const getFilteredEntries = () => {
    const today = new Date();
    
    switch(selectedView) {
      case "today":
        return entries.filter(entry => 
          format(entry.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
        );
      case "week":
        const sevenDaysAgo = subDays(today, 7);
        return entries.filter(entry => 
          entry.date >= sevenDaysAgo && entry.date <= today
        );
      case "month":
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        return entries.filter(entry => 
          entry.date >= monthStart && entry.date <= monthEnd
        );
      default:
        return entries;
    }
  };

  const filteredEntries = getFilteredEntries();
  const latestMood = filteredEntries.length > 0 ? filteredEntries[0].mood : null;
  const suggestions = getSuggestions(latestMood || "");

  // Get support circle members with mood tracking access
  const membersWithAccess = members.filter(member => member.permissions.moodTracking).length;

  // Function to show sharing status
  const handleShowSharingStatus = () => {
    if (membersWithAccess > 0) {
      toast.success(`Your mood data is shared with ${membersWithAccess} support circle member${membersWithAccess > 1 ? 's' : ''}`, {
        description: "You can manage sharing permissions in My Support Circle."
      });
    } else {
      toast("No sharing permissions set", {
        description: "Visit My Support Circle to grant access to your mood data."
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mood Tracker</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleShowSharingStatus}
          >
            <Eye className="h-4 w-4" />
            {membersWithAccess > 0 ? (
              <span>Shared with {membersWithAccess} {membersWithAccess === 1 ? 'member' : 'members'}</span>
            ) : (
              <span>Not shared</span>
            )}
          </Button>
          
          <SupportCircleShareDialog members={members} />
        </div>
      </div>

      {/* Gratitude Prompt Modal */}
      {showGratitude && (
        <div className="mb-6 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center gap-2 mb-4">
            <HeartHandshake className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium text-purple-800">Complete Your Reflection</h3>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            Since you've shared your mood, take a moment to reflect on something you're grateful for today. 
            This practice can help reinforce positive feelings and build emotional resilience.
          </p>
          <GratitudePrompt
            promptType="mindfulness"
            onSave={handleGratitudeSave}
            onClose={() => setShowGratitude(false)}
          />
        </div>
      )}

      {/* Mood Selection Interface */}
      <MoodSelectionInterface 
        onSubmit={handleMoodSubmit}
        isLoading={isLoading}
      />

      {/* Data Views */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="mb-4">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            7-Day Trend
          </TabsTrigger>
          <TabsTrigger value="month" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Monthly Overview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-4">
          {filteredEntries.length > 0 ? (
            <>
              <TodayMoodCard 
                latestMood={latestMood} 
                moodEntry={filteredEntries[0]} 
              />
              
              <MoodSuggestionCard suggestions={suggestions} />
            </>
          ) : (
            <TodayMoodCard latestMood={null} moodEntry={null} />
          )}
        </TabsContent>
        
        <TabsContent value="week">
          <WeeklyMoodView 
            filteredEntries={filteredEntries}
            getChartData={getChartData}
            getMoodTrendInsight={getMoodTrendInsight}
            getWeeklyRecommendations={getWeeklyRecommendations}
          />
        </TabsContent>
        
        <TabsContent value="month">
          <MonthlyMoodView 
            filteredEntries={filteredEntries}
            getChartData={getChartData}
            getAverageMoodLabel={getAverageMoodLabel}
            getMonthlyInsight={getMonthlyInsight}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
