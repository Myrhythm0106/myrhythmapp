
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HeartHandshake, Star, Share2, Brain, Sparkles, ArrowDown, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useUserData } from "@/hooks/use-user-data";
import { Progress } from "@/components/ui/progress";

interface GratitudePromptProps {
  promptType: "fitness" | "mindfulness" | "social" | "general";
  activity?: string;
  onSave: (entry: GratitudeEntry) => void;
  onClose?: () => void;
}

export interface GratitudeEntry {
  id: string;
  date: Date;
  promptType: string;
  activity?: string;
  gratitudeText: string;
  whyGrateful: string;
  moodScore: number;
  isShared: boolean;
  tags: string[];
}

export function GratitudePrompt({ promptType, activity, onSave, onClose }: GratitudePromptProps) {
  const [gratitudeText, setGratitudeText] = useState("");
  const [whyGrateful, setWhyGrateful] = useState("");
  const [moodScore, setMoodScore] = useState(3);
  const [isSharing, setIsSharing] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const userData = useUserData();
  const containerRef = useRef<HTMLDivElement>(null);
  const whyFieldRef = useRef<HTMLTextAreaElement>(null);

  // Progress calculation
  const getProgress = () => {
    let progress = 0;
    if (gratitudeText.trim()) progress += 40;
    if (whyGrateful.trim()) progress += 40;
    if (moodScore !== 3) progress += 20;
    return Math.min(progress, 100);
  };

  const currentProgress = getProgress();
  const isComplete = gratitudeText.trim() && whyGrateful.trim();

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setShowScrollHint(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 50);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scrollToWhy = () => {
    if (whyFieldRef.current) {
      whyFieldRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      whyFieldRef.current.focus();
    }
  };

  const getPromptText = () => {
    switch (promptType) {
      case "fitness":
        return `What are you grateful for related to ${activity || "this activity"}?`;
      case "mindfulness":
        return "What are you grateful for in this moment?";
      case "social":
        return "Who or what are you grateful for from your recent interaction?";
      default:
        return "What are you grateful for today?";
    }
  };

  const getPlaceholderText = () => {
    switch (promptType) {
      case "fitness":
        return "e.g., energy gained, the weather, feeling accomplished...";
      case "mindfulness":
        return "e.g., peace, clarity, a calm space...";
      case "social":
        return "e.g., support from a friend, an insightful conversation...";
      default:
        return "Share what you're grateful for...";
    }
  };

  const handleSave = () => {
    if (!gratitudeText.trim()) {
      toast.error("Please share what you're grateful for before saving.");
      return;
    }

    if (!whyGrateful.trim()) {
      toast.error("Please explain why this matters to you - this deepens the brain health benefit!");
      scrollToWhy();
      return;
    }

    const entry: GratitudeEntry = {
      id: crypto.randomUUID(),
      date: new Date(),
      promptType,
      activity,
      gratitudeText,
      whyGrateful,
      moodScore,
      isShared: isSharing,
      tags: extractTags(gratitudeText),
    };

    onSave(entry);
    toast.success("Gratitude recorded! Your brain loves this reflection! 🧠✨");
    
    if (onClose) {
      onClose();
    }
  };

  const extractTags = (text: string): string[] => {
    const commonWords = ["for", "the", "and", "that", "with", "this", "from", "have", "was", "feel", "felt"];
    const matches = text.toLowerCase().match(/\b(\w+)\b/g);
    
    if (!matches) {
      return [];
    }
    
    const potentialTags = matches.filter(word => 
      word.length > 3 && !commonWords.includes(word)
    );
    
    return [...new Set(potentialTags)].slice(0, 5);
  };

  return (
    <Card className="shadow-md max-h-[80vh] flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          <HeartHandshake className="h-5 w-5 text-primary" />
          Gratitude for Brain Health
          <Brain className="h-5 w-5 text-blue-500" />
        </CardTitle>
        <p className="text-sm text-gray-600">
          Research shows gratitude practice strengthens neural pathways and improves cognitive function
        </p>
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion Progress</span>
            <span className="font-medium">{Math.round(currentProgress)}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent 
        ref={containerRef}
        className="space-y-4 flex-1 overflow-y-auto relative"
        style={{ maxHeight: 'calc(80vh - 200px)' }}
      >
        {/* Scroll hint */}
        {showScrollHint && (
          <div className="absolute top-0 right-4 z-10 animate-bounce">
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <ArrowDown className="h-3 w-3" />
              Scroll for more
            </div>
          </div>
        )}
        
        <p className="font-medium text-lg">{getPromptText()}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="font-medium">What are you grateful for? 💖</label>
            {gratitudeText.trim() && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
          <Textarea
            placeholder={getPlaceholderText()}
            value={gratitudeText}
            onChange={e => setGratitudeText(e.target.value)}
            className="min-h-[100px] text-base"
          />
          {gratitudeText.trim() && !whyGrateful.trim() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scrollToWhy}
              className="w-full mt-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Continue to "WHY" section below ⬇️
            </Button>
          )}
        </div>
        
        {/* Enhanced WHY field with brain health emphasis */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-blue-500" />
            <p className="font-semibold text-lg text-blue-800">
              🧠 Brain Health Boost: Why does this matter to you?
            </p>
            <Sparkles className="h-4 w-4 text-purple-500" />
            {whyGrateful.trim() && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
          <p className="text-sm text-blue-700 mb-3">
            This "why" reflection actively engages your brain's deeper thinking patterns, 
            strengthening neural connections and emotional processing.
          </p>
          <Textarea
            ref={whyFieldRef}
            placeholder="This matters because it helps me... / I feel grateful because... / This impacts my life by..."
            value={whyGrateful}
            onChange={e => setWhyGrateful(e.target.value)}
            className="min-h-[120px] text-base border-blue-300 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="font-medium">How does this make you feel?</p>
            {moodScore !== 3 && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Less positive</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <Button
                  key={score}
                  type="button"
                  size="sm"
                  variant={moodScore === score ? "default" : "outline"}
                  className={`rounded-full w-10 h-10 p-0 ${moodScore === score ? "bg-primary" : ""}`}
                  onClick={() => setMoodScore(score)}
                >
                  {score}
                </Button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">More positive</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setIsSharing(!isSharing)}
          >
            <Share2 className={`h-4 w-4 mr-1 ${isSharing ? "text-primary" : ""}`} />
            {isSharing ? "Will be shared" : "Private (only you can see)"}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between flex-shrink-0 border-t pt-4">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Skip for now
          </Button>
        )}
        <Button 
          onClick={handleSave} 
          disabled={!isComplete}
          className={`${isComplete 
            ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" 
            : "bg-muted"
          }`}
        >
          <Brain className="h-4 w-4 mr-2" />
          {isComplete ? "Save Brain Health Gratitude" : `Complete fields above (${Math.round(currentProgress)}%)`}
        </Button>
      </CardFooter>
    </Card>
  );
}
