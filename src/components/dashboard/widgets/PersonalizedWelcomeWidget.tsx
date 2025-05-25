
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Info, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserData } from "@/hooks/use-user-data";

export function PersonalizedWelcomeWidget() {
  const navigate = useNavigate();
  const userData = useUserData();
  
  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleShowTips = () => {
    toast.success("Dashboard Tips", {
      description: "Focus on completing your routine items and daily focus tasks first."
    });
  };

  const handleCustomize = () => {
    navigate("/customization");
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-primary/10 to-primary/20 p-4">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Brain size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-semibold">
            {greetingTime()}, {userData.name}!
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's important for you today
          </p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 w-fit">
            Brain Health Focus
          </Badge>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowTips}
              className="flex-1 h-9"
            >
              <Info className="h-4 w-4 mr-1" />
              Tips
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomize}
              className="flex-1 h-9"
            >
              <Settings className="h-4 w-4 mr-1" />
              Customize
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
