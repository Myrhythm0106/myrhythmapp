import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, Smile, MessageSquare, MessageSquareHeart, Crown, Sparkles, Lock } from "lucide-react";
import { EnhancedAffirmationSystem } from "@/components/affirmations/EnhancedAffirmationSystem";
import { useUserData } from "@/hooks/use-user-data";

// Sample inspiration quotes focused on growth mindset
const inspirationQuotes = [
  "Every challenge is an opportunity to grow stronger.",
  "Progress is progress, no matter how small.",
  "Your brain is like a muscle - the more you use it, the stronger it gets.",
  "Embrace challenges as opportunities to develop new skills.",
  "Mistakes are proof that you are trying.",
  "The journey of healing is not a sprint, but a marathon.",
  "I am not defined by my condition, but by how I respond to it.",
  "Today's effort is tomorrow's strength.",
  "Every small victory deserves celebration.",
  "Focus on how far you've come, not how far you have to go.",
  "Resilience is built one day at a time.",
  "Your potential to grow is limitless.",
  "Challenges help me discover strengths I never knew I had.",
  "Recovery isn't always linear, and that's okay.",
  "I have the power to reshape my brain through consistent effort.",
  "Each day is a new opportunity for progress.",
  "When you face difficulty, your brain creates new pathways.",
  "Growth happens outside your comfort zone.",
  "What seems impossible today will feel achievable tomorrow.",
  "Your attitude determines your direction.",
];

export function InspirationSection() {
  const userData = useUserData();
  const [quote, setQuote] = useState(inspirationQuotes[0]);
  const [customMessage, setCustomMessage] = useState("");
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState("medium");
  const [showEnhancedSystem, setShowEnhancedSystem] = useState(true);

  // Simulate premium status and user type
  const isPremium = false; // This would be: userData.isPremium || false
  const userType = userData.userType || "brain-injury-recovery";

  // Change quote randomly
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * inspirationQuotes.length);
    setQuote(inspirationQuotes[randomIndex]);
    toast.success("New inspiration loaded!");
  };

  // Save custom message
  const saveCustomMessage = () => {
    if (customMessage.trim()) {
      toast.success("Your personal message has been saved!");
      // In a real app, this would save to a database
    } else {
      toast.error("Please enter a message first");
    }
  };

  // Toggle notifications
  const handleNotificationToggle = (checked: boolean) => {
    setEnableNotifications(checked);
    if (checked) {
      toast.success("Growth mindset notifications enabled!");
    } else {
      toast.info("Notifications disabled");
    }
  };

  const handleUpgradeClick = () => {
    toast.success("Ready to unlock your full potential! 🚀", {
      description: "Premium affirmations will transform your daily inspiration"
    });
  };

  // Simulate a notification (in a real app, this would be handled by a proper notification system)
  useEffect(() => {
    if (!enableNotifications) return;

    const intervals = {
      low: { min: 180, max: 300 }, // 3-5 hours
      medium: { min: 60, max: 120 }, // 1-2 hours
      high: { min: 20, max: 40 }, // 20-40 minutes
    };

    const range = intervals[notificationFrequency as keyof typeof intervals] || intervals.medium;
    const randomTime = Math.floor(Math.random() * (range.max - range.min + 1) + range.min) * 60000;

    const timerId = setTimeout(() => {
      const randomQuote = inspirationQuotes[Math.floor(Math.random() * inspirationQuotes.length)];
      toast.success(randomQuote, {
        description: "Growth Mindset Reminder",
        duration: 6000,
      });
    }, randomTime);

    return () => clearTimeout(timerId);
  }, [enableNotifications, notificationFrequency, quote]);

  return (
    <div className="space-y-6">
      {/* Enhanced Affirmation System */}
      {showEnhancedSystem && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Personalized Daily Affirmations
            </h2>
            {!isPremium && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Premium Feature
              </Badge>
            )}
          </div>
          
          <EnhancedAffirmationSystem
            userType={userType}
            isPremium={isPremium}
            onUpgradeClick={handleUpgradeClick}
          />
        </div>
      )}

      {/* Original Daily Inspiration - now as fallback/additional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-primary" /> 
            General Daily Inspiration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-6 text-center">
            <p className="text-lg font-medium italic">"{quote}"</p>
          </div>
          <div className="flex justify-center">
            <Button onClick={getRandomQuote} className="mt-2">
              New Inspiration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced notification system */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="h-5 w-5 text-primary" /> 
              Smart Affirmation Notifications
            </div>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Smart Notifications</p>
              <p className="text-sm text-muted-foreground">
                {isPremium 
                  ? "Receive personalized affirmations based on your mood and journey"
                  : "Receive random growth mindset reminders throughout your day"
                }
              </p>
            </div>
            <Switch 
              checked={enableNotifications} 
              onCheckedChange={handleNotificationToggle}
            />
          </div>

          {enableNotifications && (
            <div className="space-y-4 pt-2">
              <div>
                <p className="mb-2 font-medium">Notification Frequency</p>
                <div className="flex gap-2">
                  <Button 
                    variant={notificationFrequency === "low" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setNotificationFrequency("low")}
                  >
                    Low
                  </Button>
                  <Button 
                    variant={notificationFrequency === "medium" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setNotificationFrequency("medium")}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={notificationFrequency === "high" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setNotificationFrequency("high")}
                  >
                    High
                  </Button>
                </div>
              </div>

              {!isPremium && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700 mb-2">
                    <Crown className="h-4 w-4 inline mr-1" />
                    Upgrade to Premium for mood-responsive notifications!
                  </p>
                  <Button
                    size="sm"
                    onClick={handleUpgradeClick}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  >
                    Learn More
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Affirmation Creator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> 
            Personal Affirmation Creator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create your own personal growth mindset message or affirmation
          </p>
          <Textarea 
            placeholder="Example: I embrace challenges as opportunities to grow stronger"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={saveCustomMessage}>Save My Message</Button>
        </CardContent>
      </Card>
    </div>
  );
}
