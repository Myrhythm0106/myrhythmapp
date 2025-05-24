
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoodSelectionForm } from "@/components/dashboard/daily-checkin/MoodSelectionForm";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { useMoodTracker } from "@/hooks/use-mood-tracker";
import { Smile, Clock, Calendar, Share2, Eye, Users, ChevronRight } from "lucide-react";
import { MoodOption } from "@/components/dashboard/daily-checkin/MoodTypes";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupportCircle } from "@/hooks/use-support-circle";

// Import smaller components
import { TodayMoodCard } from "./components/TodayMoodCard";
import { MoodSuggestionCard } from "./components/MoodSuggestionCard";
import { WeeklyMoodView } from "./components/WeeklyMoodView";
import { MonthlyMoodView } from "./components/MonthlyMoodView";
import { 
  getChartData, 
  getMoodTrendInsight, 
  getWeeklyRecommendations,
  getMonthlyInsight,
  getAverageMoodLabel,
  getSuggestions
} from "./utils/moodUtils";

export function MoodTrackerView() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState("today");
  const { addEntry, entries, isLoading } = useMoodTracker();
  const { members } = useSupportCircle();
  
  const handleMoodSubmit = (mood: string, comment: string) => {
    const moodOption: MoodOption | undefined = 
      moodOptions.find(option => option.value === mood);
    
    if (moodOption) {
      const newEntry = {
        id: crypto.randomUUID(),
        date: new Date(),
        mood: moodOption.value as "great" | "okay" | "struggling",
        score: moodOption.numericValue,
        note: comment
      };
      
      addEntry(newEntry);
      toast.success("Your mood has been recorded");
      setSelectedMood(null);
    }
  };
  
  const moodOptions = [
    {
      value: "great",
      label: "Great",
      color: "bg-green-500",
      description: "I'm feeling positive and energetic",
      numericValue: 3
    },
    {
      value: "okay",
      label: "Okay",
      color: "bg-blue-500",
      description: "I'm feeling balanced and stable",
      numericValue: 2
    },
    {
      value: "struggling",
      label: "Struggling",
      color: "bg-red-500",
      description: "I'm having a difficult time today",
      numericValue: 1
    }
  ];

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

  // Get the number of support circle members with mood tracking access
  const membersWithAccess = members.filter(member => member.permissions.moodTracking).length;

  // Function to show sharing permissions dialog
  const handleShowSharingDialog = () => {
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mood Tracker</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleShowSharingDialog}
          >
            <Eye className="h-4 w-4" />
            {membersWithAccess > 0 ? (
              <span>Shared with {membersWithAccess} {membersWithAccess === 1 ? 'member' : 'members'}</span>
            ) : (
              <span>Not shared</span>
            )}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Manage Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Manage Support Circle Access</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Card>
                  <CardContent className="pt-6">
                    {members.length > 0 ? (
                      <div className="space-y-4">
                        {members.map(member => (
                          <div key={member.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <p className="font-medium">{member.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex gap-2 items-center">
                                <span className="text-sm">Mood access:</span>
                                <span className={`text-sm font-medium ${
                                  member.permissions.moodTracking ? "text-green-600" : "text-red-600"
                                }`}>
                                  {member.permissions.moodTracking ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="mt-4">
                          <Button asChild className="w-full">
                            <a href="/personal-community">
                              Manage Permissions
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Users className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="font-medium">No support circle members</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add members to your support circle to share your mood data.
                        </p>
                        <Button asChild>
                          <a href="/personal-community">Add Members</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Smile className="h-5 w-5 text-primary" />
            How are you feeling?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MoodSelectionForm 
            onSubmit={handleMoodSubmit}
            isLoading={isLoading}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
        </CardContent>
      </Card>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="mb-4">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Smile className="h-4 w-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Last 7 Days
          </TabsTrigger>
          <TabsTrigger value="month" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Monthly
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
