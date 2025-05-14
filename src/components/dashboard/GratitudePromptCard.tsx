
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, ArrowRight, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useGratitude } from "@/hooks/use-gratitude";
import { toast } from "sonner";

// Array of gratitude prompts
const gratitudePrompts = [
  "What made you smile today?",
  "What's something beautiful you noticed recently?",
  "Who has helped you this week that you're grateful for?",
  "What simple pleasure did you enjoy today?",
  "What's something you're looking forward to?",
  "What's a small win you had today?",
  "What's something you appreciate about your health journey?",
  "Who or what made your day better today?",
  "What's something you accomplished recently that you're proud of?",
  "What's a positive change you've noticed in yourself lately?"
];

export function GratitudePromptCard() {
  const navigate = useNavigate();
  const { addEntry } = useGratitude();
  const [response, setResponse] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [currentPrompt] = useState(
    gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]
  );
  
  const handleViewAll = () => {
    navigate("/gratitude");
  };
  
  const handleStartWriting = () => {
    setIsWriting(true);
  };
  
  const handleSave = () => {
    if (!response.trim()) {
      toast.error("Please write something before saving");
      return;
    }
    
    addEntry({
      promptType: "general",
      gratitudeText: response,
      whyGrateful: "Daily reflection",
      moodScore: 4,
      isShared: false,
      tags: ["daily", "reflection"]
    });
    
    toast.success("Gratitude entry saved!");
    setResponse("");
    setIsWriting(false);
  };
  
  return (
    <Card className="border-l-4 border-l-indigo-400 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <HeartHandshake className="h-5 w-5 text-indigo-500" />
          Gratitude Prompt
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-1 space-y-4">
        <div className="rounded-lg bg-indigo-50 p-4 text-indigo-800 italic">
          "{currentPrompt}"
        </div>
        
        {isWriting ? (
          <div className="space-y-3 animate-fade-in">
            <Textarea
              placeholder="Write your thoughts here..."
              className="min-h-[100px]"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsWriting(false);
                  setResponse("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleStartWriting}
            className="w-full"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Jot Down Now
          </Button>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between"
          onClick={handleViewAll}
        >
          <span>View Gratitude Journal</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
