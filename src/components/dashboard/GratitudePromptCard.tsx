
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, ArrowRight, Pencil, Sparkles, Heart, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useGratitude } from "@/hooks/use-gratitude";
import { toast } from "sonner";

const dailyGratitudePrompts = [
  "What made you smile today?",
  "Who showed you kindness recently?",
  "What progress are you proud of?",
  "What small joy brightened your day?",
  "What challenge helped you grow?",
  "What ability are you grateful for?",
  "What made today a little better?",
  "What moment of peace did you find?",
  "What support did you receive?",
  "What opportunity appeared today?"
];

export function GratitudePromptCard() {
  const navigate = useNavigate();
  const { addEntry } = useGratitude();
  const [response, setResponse] = useState("");
  const [whyResponse, setWhyResponse] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [currentPrompt] = useState(
    dailyGratitudePrompts[Math.floor(Math.random() * dailyGratitudePrompts.length)]
  );
  
  const handleViewAll = () => {
    navigate("/gratitude");
  };
  
  const handleStartWriting = () => {
    setIsWriting(true);
  };
  
  const handleSave = () => {
    if (!response.trim()) {
      toast.error("Share what you're grateful for");
      return;
    }
    
    if (!whyResponse.trim()) {
      toast.error("Please explain why - this boosts the brain health benefit!");
      return;
    }
    
    const newEntry = {
      promptType: "general" as const,
      gratitudeText: response,
      whyGrateful: whyResponse,
      moodScore: 4,
      isShared: false,
      tags: ["daily", "gratitude"]
    };

    addEntry(newEntry);
    toast.success("Brain health gratitude saved! 🧠✨", {
      description: "Every grateful moment strengthens your neural pathways."
    });
    
    setResponse("");
    setWhyResponse("");
    setIsWriting(false);
  };
  
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-rose-50 to-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <HeartHandshake className="h-5 w-5 text-rose-500" />
          Brain Health Gratitude
          <Brain className="h-4 w-4 text-blue-500" />
          <Sparkles className="h-4 w-4 text-amber-400" />
        </CardTitle>
        <p className="text-sm text-gray-600">
          Strengthen neural pathways through meaningful reflection
        </p>
      </CardHeader>
      
      <CardContent className="pt-1 space-y-4">
        <div className="rounded-lg bg-gradient-to-r from-rose-100 to-blue-100 p-4 border border-rose-200">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-medium text-rose-700">Today's question</span>
          </div>
          <p className="text-rose-800 italic font-medium">"{currentPrompt}"</p>
        </div>
        
        {isWriting ? (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-medium text-rose-700 mb-2 block">
                What are you grateful for? 💖
              </label>
              <Textarea
                placeholder="I'm grateful for..."
                className="min-h-[80px] border-rose-200 focus:border-rose-400"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-500" />
                <label className="text-sm font-medium text-blue-700">
                  🧠 Why does this matter to you? (Brain Health Boost!)
                </label>
              </div>
              <p className="text-xs text-blue-600 mb-2">
                This deeper reflection strengthens your neural connections
              </p>
              <Textarea
                placeholder="This matters because... / I feel grateful because... / This impacts my life by..."
                className="min-h-[80px] border-blue-200 focus:border-blue-400"
                value={whyResponse}
                onChange={(e) => setWhyResponse(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                className="bg-gradient-to-r from-rose-500 via-blue-500 to-purple-500 hover:from-rose-600 hover:via-blue-600 hover:to-purple-600"
                disabled={!response.trim() || !whyResponse.trim()}
              >
                <Brain className="h-4 w-4 mr-1" />
                Save Brain Health Gratitude
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsWriting(false);
                  setResponse("");
                  setWhyResponse("");
                }}
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleStartWriting}
            className="w-full bg-gradient-to-r from-rose-500 to-blue-500 hover:from-rose-600 hover:to-blue-600"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Start Brain Health Reflection
          </Button>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between text-rose-600 hover:text-rose-800 hover:bg-rose-100"
          onClick={handleViewAll}
        >
          <span>View All Your Gratitude</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
