
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, SmilePlus, TrendingUp, TrendingDown, Minus, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMoodTracker } from "@/hooks/use-mood-tracker";
import { toast } from "sonner";

// Extend our EnergyLevelIndicator component
export function MoodEnergySnapshot() {
  const { addEntry, getLatestMood, getMoodTrend, entries } = useMoodTracker();
  const [energyLevel, setEnergyLevel] = useState(70);
  const [moodLevel, setMoodLevel] = useState(4); // 1-5 scale
  const [isExpanded, setIsExpanded] = useState(false);
  
  const latestMood = getLatestMood();
  const moodTrend = getMoodTrend(7);
  
  const moodOptions = [
    { value: 1, label: "Struggling", icon: "😔" },
    { value: 2, label: "Down", icon: "😕" },
    { value: 3, label: "Neutral", icon: "😐" },
    { value: 4, label: "Good", icon: "🙂" },
    { value: 5, label: "Great", icon: "😀" },
  ];
  
  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Function to determine the background color based on energy level
  const getEnergyColor = () => {
    if (energyLevel >= 80) return "bg-green-500";
    if (energyLevel >= 60) return "bg-green-400";
    if (energyLevel >= 40) return "bg-yellow-400";
    if (energyLevel >= 20) return "bg-orange-400";
    return "bg-red-500";
  };
  
  const getEnergyMessage = () => {
    if (energyLevel >= 80) return "Your energy is high. Great time for challenging tasks!";
    if (energyLevel >= 60) return "Good energy level. Balance activities.";
    if (energyLevel >= 40) return "Moderate energy. Take breaks between tasks.";
    if (energyLevel >= 20) return "Energy is getting low. Consider rest periods.";
    return "Very low energy. Time for self-care and rest.";
  };
  
  const getSelectedMood = () => {
    return moodOptions.find(option => option.value === moodLevel) || moodOptions[2];
  };
  
  const handleLogMood = () => {
    const newEntry = {
      id: crypto.randomUUID(),
      date: new Date(),
      mood: getSelectedMood().label.toLowerCase() as "great" | "okay" | "struggling",
      score: moodLevel,
      note: ""
    };
    
    addEntry(newEntry);
    toast.success("Mood and energy logged successfully!");
  };
  
  return (
    <Card className="border-l-4 border-l-amber-400 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <SmilePlus className="h-5 w-5 text-amber-500" />
          Mood & Energy Snapshot
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-1 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getSelectedMood().icon}</span>
            <div>
              <h4 className="font-medium">{getSelectedMood().label}</h4>
              {latestMood && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getTrendIcon(moodTrend)}
                  <span>
                    {moodTrend === "up" ? "Improving" : 
                     moodTrend === "down" ? "Declining" : "Stable"} since yesterday
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Change
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moodOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setMoodLevel(option.value)}
                  className="cursor-pointer"
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                  {option.value === moodLevel && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Energy Level</span>
            <span>{energyLevel}%</span>
          </div>
          
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getEnergyColor()}`} 
              style={{ width: `${energyLevel}%` }}
            ></div>
          </div>
          
          <Slider
            value={[energyLevel]}
            min={0}
            max={100}
            step={5}
            onValueChange={(values) => setEnergyLevel(values[0])}
            className="py-2"
          />
          
          <p className="text-xs text-muted-foreground">
            {getEnergyMessage()}
          </p>
        </div>
        
        {isExpanded && (
          <div className="pt-2 space-y-2 animate-fade-in">
            <h5 className="text-sm font-medium">Recent History</h5>
            <div className="grid grid-cols-5 gap-1">
              {entries.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="text-center text-xs">
                  <div className={cn(
                    "mx-auto rounded-full w-8 h-8 flex items-center justify-center",
                    entry.score >= 4 ? "bg-green-100 text-green-700" :
                    entry.score >= 3 ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {entry.score}
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    {format(new Date(entry.date), "E")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide" : "Show"} History
        </Button>
        
        <Button 
          onClick={handleLogMood}
          size="sm"
        >
          Log Now
        </Button>
      </CardFooter>
    </Card>
  );
}
