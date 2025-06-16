
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickCheckIn() {
  const navigate = useNavigate();
  
  const handleMoodSelection = (mood: string) => {
    // In a real app, save this to state/context/API
    navigate("/tracking?type=mood&value=" + mood);
  };
  
  const handleLogSymptom = () => {
    navigate("/tracking?tab=log");
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">How Are You Feeling Right Now?</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Just checking in with you - every feeling is valid</p>
        
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            className="flex-1 flex flex-col items-center py-4 gap-1 hover:bg-red-50 hover:border-red-200"
            onClick={() => handleMoodSelection("struggling")}
          >
            <Frown className="h-6 w-6 text-red-500" />
            <span className="text-xs">Having a tough time</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 flex flex-col items-center py-4 gap-1 hover:bg-yellow-50 hover:border-yellow-200"
            onClick={() => handleMoodSelection("okay")}
          >
            <Meh className="h-6 w-6 text-yellow-500" />
            <span className="text-xs">Getting by</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 flex flex-col items-center py-4 gap-1 hover:bg-green-50 hover:border-green-200"
            onClick={() => handleMoodSelection("great")}
          >
            <Smile className="h-6 w-6 text-green-500" />
            <span className="text-xs">Feeling good!</span>
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full text-primary"
          onClick={handleLogSymptom}
        >
          Want to share more details? →
        </Button>
      </CardFooter>
    </Card>
  );
}
