
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, Brain, HeartHandshake, Target, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";

interface Achievement {
  id: string;
  title: string;
  date: Date;
  type: "streak" | "game" | "goal" | "gratitude" | "tracking";
  highlight?: boolean;
}

export function RecentWinsCard() {
  // Sample achievements - in a real app, these would be fetched from a database
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Completed 5-day gratitude streak",
      date: new Date(),
      type: "streak",
      highlight: true
    },
    {
      id: "2",
      title: "New high score in Memory Match game",
      date: subDays(new Date(), 1),
      type: "game"
    },
    {
      id: "3",
      title: "Completed weekly walking goal",
      date: subDays(new Date(), 2),
      type: "goal"
    },
    {
      id: "4",
      title: "Tracked symptoms for 7 consecutive days",
      date: subDays(new Date(), 3),
      type: "tracking"
    }
  ];
  
  const getAchievementIcon = (type: string) => {
    switch(type) {
      case "streak": return <HeartHandshake className="h-4 w-4 text-purple-500" />;
      case "game": return <Brain className="h-4 w-4 text-blue-500" />;
      case "goal": return <Target className="h-4 w-4 text-green-500" />;
      case "gratitude": return <HeartHandshake className="h-4 w-4 text-indigo-500" />;
      case "tracking": return <CheckCircle className="h-4 w-4 text-amber-500" />;
      default: return <Award className="h-4 w-4 text-primary" />;
    }
  };
  
  return (
    <Card className="border-l-4 border-l-pink-400 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Award className="h-5 w-5 text-pink-500" />
          Recent Wins
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-1">
        <ul className="space-y-3">
          {achievements.map(achievement => (
            <li 
              key={achievement.id} 
              className={cn(
                "flex items-start gap-3 p-3 border rounded-md",
                achievement.highlight && "bg-pink-50 border-pink-200"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                achievement.highlight ? "bg-pink-100" : "bg-muted"
              )}>
                {getAchievementIcon(achievement.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className={cn(
                    "text-sm font-medium",
                    achievement.highlight && "text-pink-800"
                  )}>
                    {achievement.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {format(achievement.date, "MMM d")}
                  </span>
                </div>
              </div>
            </li>
          ))}
          
          {achievements.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Your achievements will appear here
              </p>
            </div>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
