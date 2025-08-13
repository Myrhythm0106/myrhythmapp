import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HeartHandshake, Star, Share2, Brain, Sparkles, ArrowDown, CheckCircle, Crown, Zap } from "lucide-react";
import { toast } from "sonner";
import { useUserData } from "@/hooks/use-user-data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface EnhancedGratitudePromptProps {
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

export function EnhancedGratitudePrompt({ promptType, activity, onSave, onClose }: EnhancedGratitudePromptProps) {
  const [gratitudeText, setGratitudeText] = useState("");
  const [whyGrateful, setWhyGrateful] = useState("");
  const [moodScore, setMoodScore] = useState(3);
  const [isSharing, setIsSharing] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showMonetizationHint, setShowMonetizationHint] = useState(false);
  const userData = useUserData();
  const containerRef = useRef<HTMLDivElement>(null);
  const whyFieldRef = useRef<HTMLTextAreaElement>(null);

  // Progress calculation with enhanced "why" weighting
  const getProgress = () => {
    let progress = 0;
    if (gratitudeText.trim()) progress += 30;
    if (whyGrateful.trim()) progress += 50; // WHY gets more weight for brain health
    if (moodScore !== 3) progress += 20;
    return Math.min(progress, 100);
  };

  const currentProgress = getProgress();
  const isComplete = gratitudeText.trim() && whyGrateful.trim();
  const whyWordCount = whyGrateful.trim().split(' ').filter(word => word.length > 0).length;
  const isPremiumQuality = whyWordCount >= 20; // Premium gratitude has deeper "why"

  useEffect(() => {
    // Show monetization hint when user writes quality "why" responses
    if (whyWordCount >= 15 && !showMonetizationHint) {
      setShowMonetizationHint(true);
    }
  }, [whyWordCount, showMonetizationHint]);

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
      checkScroll();
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
    
    // Enhanced success message based on quality
    if (isPremiumQuality) {
      toast.success("🧠✨ Premium gratitude recorded! Your deep reflection is supercharging your neural pathways!");
    } else {
      toast.success("Gratitude recorded! Your brain loves this reflection! 🧠✨");
    }
    
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
    <Card className="shadow-lg max-h-[85vh] flex flex-col border-brain-health-200/60">
      <CardHeader className="pb-4 flex-shrink-0 bg-gradient-to-r from-brain-health-50/50 to-memory-emerald-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <HeartHandshake className="h-5 w-5 text-memory-emerald-500" />
            Gratitude for Brain Health
            <Brain className="h-5 w-5 text-brain-health-500" />
          </CardTitle>
          
          {isPremiumQuality && (
            <Badge className="bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              Premium Quality
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-brain-health-600">
          Research shows gratitude practice strengthens neural pathways and improves cognitive function
        </p>
        
        {/* Enhanced Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Brain Health Progress</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{Math.round(currentProgress)}%</span>
              {isPremiumQuality && <Sparkles className="h-4 w-4 text-sunrise-amber-500" />}
            </div>
          </div>
          <Progress 
            value={currentProgress} 
            className={`h-3 ${isPremiumQuality ? 'bg-gradient-to-r from-sunrise-amber-200 to-memory-emerald-200' : ''}`}
          />
          {whyWordCount > 0 && (
            <p className="text-xs text-brain-health-600">
              Why reflection: {whyWordCount} words 
              {whyWordCount >= 15 && <span className="text-memory-emerald-600 font-medium"> • Excellent depth!</span>}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent 
        ref={containerRef}
        className="space-y-6 flex-1 overflow-y-auto relative"
        style={{ maxHeight: 'calc(85vh - 250px)' }}
      >
        {/* Scroll hint */}
        {showScrollHint && (
          <div className="absolute top-0 right-4 z-10 animate-bounce">
            <div className="bg-brain-health-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <ArrowDown className="h-3 w-3" />
              Scroll for more
            </div>
          </div>
        )}
        
        <p className="font-medium text-lg text-brain-health-700">{getPromptText()}</p>

        {/* WHAT section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="font-medium text-brain-health-700">What are you grateful for? 💖</label>
            {gratitudeText.trim() && <CheckCircle className="h-4 w-4 text-memory-emerald-500" />}
          </div>
          <Textarea
            placeholder={getPlaceholderText()}
            value={gratitudeText}
            onChange={e => setGratitudeText(e.target.value)}
            className="min-h-[100px] text-base border-brain-health-200 focus:border-brain-health-400"
          />
          {gratitudeText.trim() && !whyGrateful.trim() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scrollToWhy}
              className="w-full mt-2 bg-brain-health-50 border-brain-health-300 text-brain-health-700 hover:bg-brain-health-100"
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Continue to "WHY" section below ⬇️ (This is where the magic happens!)
            </Button>
          )}
        </div>
        
        {/* Enhanced WHY field with premium focus */}
        <div className="bg-gradient-to-r from-brain-health-50 to-memory-emerald-50 p-6 rounded-xl border-2 border-brain-health-200/80">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white">
              <Brain className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg text-brain-health-800">
                🧠 Brain Health Boost: Why does this matter to you?
              </p>
              <p className="text-sm text-brain-health-600">
                This deeper reflection creates stronger neural pathways and lasting positive change
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-memory-emerald-500" />
              {whyGrateful.trim() && <CheckCircle className="h-4 w-4 text-memory-emerald-500" />}
            </div>
          </div>
          
          {/* Monetization hint for quality responses */}
          {showMonetizationHint && (
            <div className="mb-4 p-3 bg-gradient-to-r from-sunrise-amber-50 to-memory-emerald-50 border border-sunrise-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-sunrise-amber-500" />
                <p className="text-sm font-medium text-sunrise-amber-700">
                  Premium Insight Unlock Available
                </p>
              </div>
              <p className="text-xs text-sunrise-amber-600">
                Your thoughtful reflections can unlock advanced analytics, mood patterns, and family sharing features!
              </p>
            </div>
          )}
          
          <div className="bg-white/70 p-4 rounded-lg border border-brain-health-200/50 mb-4">
            <h4 className="font-medium text-brain-health-700 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-memory-emerald-500" />
              Brain Science Behind the "Why"
            </h4>
            <p className="text-sm text-brain-health-600 leading-relaxed">
              When you reflect on <em>why</em> something matters, you activate the prefrontal cortex - 
              your brain's executive center. This deeper processing strengthens memory formation, 
              emotional regulation, and creates lasting neural changes that support recovery.
            </p>
          </div>
          
          <Textarea
            ref={whyFieldRef}
            placeholder="This matters because it helps me... / I feel grateful because... / This impacts my life by... / When I think about this, I realize..."
            value={whyGrateful}
            onChange={e => setWhyGrateful(e.target.value)}
            className="min-h-[130px] text-base border-brain-health-300 focus:border-memory-emerald-400 bg-white/80"
          />
          
          {whyWordCount >= 10 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
              <span className="text-memory-emerald-600 font-medium">
                Excellent depth! Your brain is getting a premium workout! 
                {whyWordCount >= 20 && " 🏆"}
              </span>
            </div>
          )}
        </div>

        {/* Mood section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="font-medium text-brain-health-700">How does this make you feel?</p>
            {moodScore !== 3 && <CheckCircle className="h-4 w-4 text-memory-emerald-500" />}
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
                  className={`rounded-full w-10 h-10 p-0 ${
                    moodScore === score 
                      ? "bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white" 
                      : "border-brain-health-200"
                  }`}
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
            <Share2 className={`h-4 w-4 mr-1 ${isSharing ? "text-memory-emerald-500" : ""}`} />
            {isSharing ? "Will be shared with support circle" : "Private (only you can see)"}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between flex-shrink-0 border-t border-brain-health-200/50 pt-4 bg-gradient-to-r from-background via-brain-health-50/20 to-memory-emerald-50/20">
        {onClose && (
          <Button variant="outline" onClick={onClose} className="border-brain-health-200">
            Skip for now
          </Button>
        )}
        <Button 
          onClick={handleSave} 
          disabled={!isComplete}
          className={`${isComplete 
            ? isPremiumQuality
              ? "bg-gradient-to-r from-sunrise-amber-500 via-brain-health-500 to-memory-emerald-500 hover:opacity-90" 
              : "bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 hover:opacity-90"
            : "bg-muted"
          } text-white`}
        >
          <Brain className="h-4 w-4 mr-2" />
          {isComplete 
            ? isPremiumQuality 
              ? "Save Premium Brain Health Gratitude" 
              : "Save Brain Health Gratitude"
            : `Complete fields above (${Math.round(currentProgress)}%)`
          }
          {isPremiumQuality && <Crown className="h-4 w-4 ml-2" />}
        </Button>
      </CardFooter>
    </Card>
  );
}