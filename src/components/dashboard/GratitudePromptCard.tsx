
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, ArrowRight, Pencil, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useGratitude } from "@/hooks/use-gratitude";
import { toast } from "sonner";

// Simple, encouraging gratitude prompts
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
    
    const newEntry = {
      promptType: "general" as const,
      gratitudeText: response,
      whyGrateful: whyResponse,
      moodScore: 4,
      isShared: false,
      tags: ["daily", "gratitude"]
    };

    addEntry(newEntry);
    toast.success("Your gratitude has been saved! 🌱", {
      description: "Every grateful moment builds your resilience."
    });
    
    setResponse("");
    setWhyResponse("");
    setIsWriting(false);
  };
  
  return (
    <Card className="border-l-4 border-l-rose-400 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-rose-50 to-pink-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <HeartHandshake className="h-5 w-5 text-rose-500" />
          Your Daily Gratitude
          <Sparkles className="h-4 w-4 text-amber-400" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-1 space-y-4">
        <div className="rounded-lg bg-gradient-to-r from-rose-100 to-pink-100 p-4 border border-rose-200">
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
            
            <div>
              <label className="text-sm font-medium text-rose-700 mb-2 block">
                Why does this matter to you? 🌱
              </label>
              <Textarea
                placeholder="This matters because..."
                className="min-h-[80px] border-rose-200 focus:border-rose-400"
                value={whyResponse}
                onChange={(e) => setWhyResponse(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                <Heart className="h-4 w-4 mr-1" />
                Save Gratitude
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
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Start Writing
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
