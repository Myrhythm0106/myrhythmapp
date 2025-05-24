
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoodSelectionForm } from "@/components/dashboard/daily-checkin/MoodSelectionForm";
import { MoodHistoryChart } from "@/components/dashboard/daily-checkin/MoodHistoryChart";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { useMoodTracker } from "@/hooks/use-mood-tracker";
import { Smile, Clock, Calendar, Share2, Eye, Users } from "lucide-react";
import { MoodOption } from "@/components/dashboard/daily-checkin/MoodTypes";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupportCircle } from "@/hooks/use-support-circle";

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

  // Get suggestions based on current mood
  const getSuggestions = (mood: string) => {
    switch(mood) {
      case "great":
        return [
          "Maintain this positive energy by doing activities you enjoy",
          "Share your positive mood with others - positivity is contagious!",
          "Journal about what contributed to your good mood today"
        ];
      case "okay":
        return [
          "Take a short walk to boost your energy levels",
          "Practice 5 minutes of mindfulness or deep breathing",
          "Connect with a friend or family member"
        ];
      case "struggling":
        return [
          "Be gentle with yourself today and focus on self-care",
          "Try the 5-4-3-2-1 grounding technique (5 things you see, 4 you touch...)",
          "Consider sharing how you feel with someone you trust",
          "Remember: difficult feelings are temporary and will pass"
        ];
      default:
        return ["Log your mood to get personalized suggestions"];
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-4 ${
                      latestMood === "great" ? "bg-green-100" : 
                      latestMood === "okay" ? "bg-blue-100" : "bg-red-100"
                    }`}>
                      <Smile className={`h-8 w-8 ${
                        latestMood === "great" ? "text-green-500" : 
                        latestMood === "okay" ? "text-blue-500" : "text-red-500"
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium capitalize">{latestMood}</h3>
                      <p className="text-muted-foreground">
                        Recorded at {format(filteredEntries[0].date, "h:mm a")}
                      </p>
                      {filteredEntries[0].note && (
                        <p className="mt-2 italic">{filteredEntries[0].note}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No mood data recorded for today yet.</p>
                <p className="mt-2">Log your first mood to get started!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">7-Day Mood Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodHistoryChart moodHistory={getChartData(filteredEntries)} />
              
              <div className="mt-6 space-y-2">
                <h4 className="font-medium">Weekly Insights</h4>
                {filteredEntries.length > 2 ? (
                  <div className="space-y-4">
                    <p>
                      {getMoodTrendInsight(filteredEntries)}
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <h5 className="font-medium mb-2">Weekly Recommendations</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {getWeeklyRecommendations(filteredEntries)}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Log your mood for at least 3 days to see weekly insights and recommendations.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodHistoryChart moodHistory={getChartData(filteredEntries)} />
              
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Monthly Statistics</h4>
                  {filteredEntries.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Great days:</span>
                        <span className="font-medium">
                          {filteredEntries.filter(e => e.mood === "great").length} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Okay days:</span>
                        <span className="font-medium">
                          {filteredEntries.filter(e => e.mood === "okay").length} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Struggling days:</span>
                        <span className="font-medium">
                          {filteredEntries.filter(e => e.mood === "struggling").length} days
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span>Average mood:</span>
                        <span className="font-medium">
                          {getAverageMoodLabel(filteredEntries)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No data for this month yet.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Monthly Insights</h4>
                  {filteredEntries.length > 7 ? (
                    <p>{getMonthlyInsight(filteredEntries)}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      Track your mood for at least a week to see monthly insights.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for the mood tracker
const getChartData = (entries: any[]) => {
  // Process entries to create chart data
  const data = entries.map(entry => ({
    day: format(new Date(entry.date), "EEE"),
    value: entry.score,
    mood: entry.mood
  }));
  
  // Sort by date
  return data.reverse();
};

const getMoodTrendInsight = (entries: any[]) => {
  if (entries.length < 3) return "Track more days to see insights.";
  
  const moodScores = entries.map(entry => entry.score);
  const avgScore = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
  
  if (avgScore > 2.5) {
    return "You've been having a good week overall! Your mood has been consistently positive.";
  } else if (avgScore > 1.5) {
    return "You've had a balanced week with ups and downs. This is a normal part of life's rhythm.";
  } else {
    return "This has been a challenging week for you. Remember that difficult periods are temporary.";
  }
};

const getWeeklyRecommendations = (entries: any[]) => {
  if (entries.length < 3) return ["Log more days to get personalized recommendations"];
  
  const moodScores = entries.map(entry => entry.score);
  const avgScore = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
  
  if (avgScore > 2.5) {
    return [
      "Continue activities that have been working well this week",
      "Share your positive energy with others who might need support",
      "Document what's contributing to your positive mood"
    ];
  } else if (avgScore > 1.5) {
    return [
      "Build in daily moments of mindfulness or gratitude",
      "Ensure you're maintaining healthy sleep and exercise habits",
      "Connect with your support network regularly"
    ];
  } else {
    return [
      "Prioritize self-care and consider reducing commitments if possible",
      "Reach out to your support circle or consider professional support",
      "Keep track of small victories even on difficult days",
      "Remember that this period will pass"
    ];
  }
};

const getMonthlyInsight = (entries: any[]) => {
  const greatDays = entries.filter(e => e.mood === "great").length;
  const okayDays = entries.filter(e => e.mood === "okay").length;
  const strugglingDays = entries.filter(e => e.mood === "struggling").length;
  
  const totalDays = entries.length;
  const greatPercentage = (greatDays / totalDays) * 100;
  
  if (greatPercentage > 60) {
    return "This month has been mostly positive for you. Whatever you're doing seems to be working well!";
  } else if (greatPercentage > 30) {
    return "You've had a mix of good days and challenges this month. This balance is a normal part of life.";
  } else {
    return "This month has presented more challenges than usual. Consider reviewing your self-care and support strategies.";
  }
};

const getAverageMoodLabel = (entries: any[]) => {
  if (entries.length === 0) return "No data";
  
  const avgScore = entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length;
  
  if (avgScore > 2.5) return "Good";
  if (avgScore > 1.5) return "Okay";
  return "Challenging";
};
