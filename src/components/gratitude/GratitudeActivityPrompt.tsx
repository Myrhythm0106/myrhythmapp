
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GratitudePrompt, GratitudeEntry } from "./GratitudePrompt";
import { HeartHandshake } from "lucide-react";
import { useGratitude } from "@/hooks/use-gratitude";

interface GratitudeActivityPromptProps {
  activityType: "fitness" | "mindfulness" | "social" | "general";
  activityName?: string;
  onComplete?: () => void;
}

export function GratitudeActivityPrompt({ 
  activityType, 
  activityName, 
  onComplete 
}: GratitudeActivityPromptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addEntry } = useGratitude();
  
  const handleSaveGratitude = (entry: GratitudeEntry) => {
    addEntry(entry);
    setIsOpen(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  const getPromptText = () => {
    switch (activityType) {
      case "fitness":
        return `Reflect on your ${activityName || "fitness"} activity`;
      case "mindfulness":
        return `Reflect on your ${activityName || "mindfulness"} session`;
      case "social":
        return `Reflect on your ${activityName || "social"} interaction`;
      default:
        return "Reflect on your activity";
    }
  };

  return (
    <>
      <Card className="shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-primary/10 to-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            {getPromptText()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Taking a moment to reflect with gratitude can enhance the positive impact of your activities.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => setIsOpen(true)}
          >
            Express Gratitude
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <GratitudePrompt 
            promptType={activityType}
            activity={activityName}
            onSave={handleSaveGratitude}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
