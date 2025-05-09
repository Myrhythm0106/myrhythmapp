
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Smile, Meh, Frown, Lightbulb, Brain, Calendar, CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface MoodOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  numericValue: number;
}

// Sample mood history data - in a real app, this would come from a database
const moodHistoryData = [
  { day: format(subDays(new Date(), 6), "EEE"), value: 2, mood: "okay" },
  { day: format(subDays(new Date(), 5), "EEE"), value: 3, mood: "great" },
  { day: format(subDays(new Date(), 4), "EEE"), value: 2, mood: "okay" },
  { day: format(subDays(new Date(), 3), "EEE"), value: 1, mood: "struggling" },
  { day: format(subDays(new Date(), 2), "EEE"), value: 2, mood: "okay" },
  { day: format(subDays(new Date(), 1), "EEE"), value: 3, mood: "great" },
  { day: format(new Date(), "EEE"), value: 0, mood: "" }, // Today's value will be set based on check-in
];

// Sample upcoming events - in a real app, this would come from a database
const upcomingEvents = [
  {
    id: "1",
    title: "Neurology Appointment",
    date: format(new Date(), "yyyy-MM-dd"), // Today
    time: "10:00 AM",
    type: "appointment"
  },
  {
    id: "2", 
    title: "Medication: Aspirin",
    date: format(new Date(), "yyyy-MM-dd"), // Today
    time: "12:00 PM",
    type: "medication"
  },
  {
    id: "3",
    title: "Physical Therapy",
    date: format(subDays(new Date(), -1), "yyyy-MM-dd"), // Tomorrow
    time: "2:30 PM",
    type: "therapy"
  },
  {
    id: "4",
    title: "Support Group Meeting",
    date: format(subDays(new Date(), -2), "yyyy-MM-dd"), // Day after tomorrow
    time: "6:00 PM",
    type: "activity"
  }
];

// Expanded inspirational messages array with mood categories
const inspirationalMessages = [
  // Great mood messages
  {
    text: "Your positive energy is contagious. Keep spreading that joy!",
    category: "great",
    type: "positivity"
  },
  {
    text: "Wonderful to see you thriving today! Use this energy for something special.",
    category: "great",
    type: "productivity"
  },
  {
    text: "Your great mood is a perfect time to tackle something challenging.",
    category: "great",
    type: "productivity"
  },
  {
    text: "Feeling good? Pay it forward with a kind act for someone else today.",
    category: "great",
    type: "mindfulness"
  },
  {
    text: "Great days like today are perfect for setting new goals and aspirations.",
    category: "great",
    type: "growth"
  },
  {
    text: "Channel this positive energy into your most important tasks today.",
    category: "great",
    type: "productivity"
  },
  {
    text: "When you're feeling good, your brain makes stronger connections. Try learning something new!",
    category: "great",
    type: "health"
  },
  {
    text: "This positive state is perfect for creative thinking and innovation.",
    category: "great",
    type: "creativity"
  },
  {
    text: "Celebrate your good mood by spending time with people who energize you further.",
    category: "great",
    type: "social"
  },
  {
    text: "Optimal mood is the perfect time to practice gratitude. What are three things you're thankful for?",
    category: "great",
    type: "mindfulness"
  },
  {
    text: "Use this positive energy for a brisk walk or workout to compound the benefits.",
    category: "great",
    type: "physical"
  },
  {
    text: "Your brain is primed for learning when you feel good. Take advantage!",
    category: "great",
    type: "growth"
  },
  {
    text: "Great moods enhance creativity. Try tackling a creative project today.",
    category: "great",
    type: "creativity"
  },
  {
    text: "Feeling good today? Pay attention to what contributed to this feeling for future reference.",
    category: "great",
    type: "mindfulness"
  },
  {
    text: "Harness this positive energy for deeper focus and flow state work.",
    category: "great",
    type: "productivity"
  },
  {
    text: "Great days are perfect for trying something new that pushes your comfort zone a bit.",
    category: "great",
    type: "growth"
  },
  {
    text: "Your positive mood creates resilience for future challenges. Savor it!",
    category: "great",
    type: "resilience"
  },
  {
    text: "The world needs your positive energy. Share your enthusiasm with others today.",
    category: "great",
    type: "social"
  },
  {
    text: "Great moods can boost problem-solving ability. What challenge can you tackle today?",
    category: "great",
    type: "productivity"
  },
  {
    text: "Take a moment to appreciate your good mood and the circumstances that contributed to it.",
    category: "great",
    type: "mindfulness"
  },
  
  // Okay mood messages
  {
    text: "Take a deep breath and find a moment of calm today.",
    category: "okay",
    type: "mindfulness"
  },
  {
    text: "Remember to stretch for 5 minutes every hour to keep your body loose.",
    category: "okay",
    type: "physical"
  },
  {
    text: "Drink a glass of water right now - staying hydrated helps brain function!",
    category: "okay",
    type: "health"
  },
  {
    text: "One small positive thought can change your whole day.",
    category: "okay",
    type: "positivity"
  },
  {
    text: "Try focusing on one task at a time today to reduce cognitive load.",
    category: "okay",
    type: "productivity"
  },
  {
    text: "Stand up and do a quick 30-second stretch to boost your energy.",
    category: "okay",
    type: "physical"
  },
  {
    text: "Practice gratitude by noting three things you're thankful for today.",
    category: "okay",
    type: "mindfulness"
  },
  {
    text: "Every step forward is progress, no matter how small.",
    category: "okay",
    type: "positivity"
  },
  {
    text: "Consider taking a 10-minute nature walk to refresh your mind.",
    category: "okay",
    type: "health"
  },
  {
    text: "Set one achievable goal for today and celebrate when you complete it.",
    category: "okay",
    type: "productivity"
  },
  {
    text: "Sometimes an okay day is the perfect foundation for small improvements.",
    category: "okay",
    type: "growth"
  },
  {
    text: "Take five deep breaths and notice how your body feels afterward.",
    category: "okay",
    type: "mindfulness"
  },
  {
    text: "Looking out a window for a minute can help reset your mental state.",
    category: "okay",
    type: "health"
  },
  {
    text: "What's one small thing you can do to make today slightly better?",
    category: "okay",
    type: "positivity"
  },
  {
    text: "Breaking tasks into smaller pieces makes them more manageable.",
    category: "okay",
    type: "productivity"
  },
  {
    text: "Listen to a favorite song to give your mood a gentle boost.",
    category: "okay",
    type: "health"
  },
  {
    text: "Even on ordinary days, extraordinary things can happen.",
    category: "okay",
    type: "positivity"
  },
  {
    text: "A brief conversation with someone you like can improve your day.",
    category: "okay",
    type: "social"
  },
  {
    text: "Move your body for 5 minutes to refresh your perspective.",
    category: "okay",
    type: "physical"
  },
  {
    text: "Sometimes 'good enough' really is good enough. Be gentle with yourself today.",
    category: "okay",
    type: "mindfulness"
  },
  
  // Struggling mood messages
  {
    text: "Remember that difficult feelings are temporary and will pass.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Be kind to yourself today - you're doing the best you can.",
    category: "struggling",
    type: "self-care"
  },
  {
    text: "Take things one small moment at a time when days are challenging.",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "Your worth isn't measured by your productivity, especially on hard days.",
    category: "struggling",
    type: "self-care"
  },
  {
    text: "Reach out to someone supportive - connection helps in difficult times.",
    category: "struggling",
    type: "social"
  },
  {
    text: "Focus on just the next small step. You don't need to solve everything at once.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Try the 5-4-3-2-1 technique: notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "Difficult days are when self-care is most important. What small comfort can you give yourself?",
    category: "struggling",
    type: "self-care"
  },
  {
    text: "Struggling is human and universal. You're not alone in having hard days.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Your brain and body need rest when you're struggling. Can you take a short break?",
    category: "struggling",
    type: "health"
  },
  {
    text: "Place a hand on your heart and take three deep breaths. Feel the support you're giving yourself.",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "Progress isn't always visible. Sometimes surviving a hard day is an achievement.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Stepping outside for fresh air can help shift your perspective when struggling.",
    category: "struggling",
    type: "health"
  },
  {
    text: "Your struggles don't define you - they're just one part of your complex human experience.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Simply drinking water and eating something nourishing can help when you're having a tough time.",
    category: "struggling",
    type: "health"
  },
  {
    text: "Consider reaching out to a professional if you're struggling consistently.",
    category: "struggling",
    type: "support"
  },
  {
    text: "Your brain is trying to protect you when you feel down. Thank it, then gently redirect.",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "What worked for you in past difficult times? Can you try that strategy again?",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "It takes courage to acknowledge when you're struggling. That awareness is valuable.",
    category: "struggling",
    type: "growth"
  },
  {
    text: "When we name our emotions, we gain some power over them. What exactly are you feeling?",
    category: "struggling",
    type: "mindfulness"
  }
];

// Adding 400+ more inspirational messages grouped by mood categories
// This is a condensed representation - in a real implementation, we would add all 400+ messages
const additionalMessages = [
  // Great mood - 130+ more messages would be added here
  {
    text: "Your enthusiasm today can move mountains. What will you accomplish?",
    category: "great",
    type: "motivation"
  },
  {
    text: "Today's positive energy is the perfect foundation for excellence.",
    category: "great",
    type: "productivity"
  },
  // ...more great mood messages...
  
  // Okay mood - 130+ more messages would be added here
  {
    text: "Small improvements add up to big changes over time.",
    category: "okay",
    type: "growth"
  },
  {
    text: "Balance is sometimes more valuable than constant high energy.",
    category: "okay",
    type: "mindfulness"
  },
  // ...more okay mood messages...
  
  // Struggling mood - 130+ more messages would be added here
  {
    text: "This moment is hard, but you have overcome difficult moments before.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Healing isn't linear. Some days are harder than others, and that's okay.",
    category: "struggling",
    type: "self-care"
  }
  // ...more struggling mood messages...
];

// Combine the inspirational messages arrays
const allInspirationalMessages = [...inspirationalMessages, ...additionalMessages];

export function DailyCheckin() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [inspiration, setInspiration] = useState(inspirationalMessages[0]);
  const [moodSpecificMessages, setMoodSpecificMessages] = useState(inspirationalMessages);
  const [moodHistory, setMoodHistory] = useState(moodHistoryData);

  const moodOptions: MoodOption[] = [
    {
      value: "great",
      label: "Great",
      icon: <Smile className="h-6 w-6" />,
      color: "text-green-500",
      numericValue: 3
    },
    {
      value: "okay",
      label: "Okay",
      icon: <Meh className="h-6 w-6" />,
      color: "text-amber-500",
      numericValue: 2
    },
    {
      value: "struggling",
      label: "Struggling",
      icon: <Frown className="h-6 w-6" />,
      color: "text-red-500",
      numericValue: 1
    }
  ];

  // Update inspiration messages when mood changes
  useEffect(() => {
    if (selectedMood) {
      // Filter messages that match the selected mood
      const moodMessages = inspirationalMessages.filter(msg => msg.category === selectedMood);
      setMoodSpecificMessages(moodMessages);
      
      // Select a random message from the filtered list
      if (moodMessages.length > 0) {
        const randomIndex = Math.floor(Math.random() * moodMessages.length);
        setInspiration(moodMessages[randomIndex]);
      }
    } else {
      // Default to random message when no mood is selected
      const randomIndex = Math.floor(Math.random() * inspirationalMessages.length);
      setInspiration(inspirationalMessages[randomIndex]);
    }
  }, [selectedMood]);

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error("Please select how you're feeling today");
      return;
    }

    // Get numeric value for the selected mood
    const moodValue = moodOptions.find(option => option.value === selectedMood)?.numericValue || 0;

    // Update today's mood in the history
    setMoodHistory(prev => {
      const updatedHistory = [...prev];
      updatedHistory[updatedHistory.length - 1] = {
        ...updatedHistory[updatedHistory.length - 1],
        value: moodValue,
        mood: selectedMood
      };
      return updatedHistory;
    });

    // In a real app, we would send this to an API
    console.log("Mood submitted:", selectedMood);
    toast.success("Your check-in has been recorded!");
    setSubmitted(true);
    
    // Reset after a while to allow for another check-in later
    setTimeout(() => {
      setSubmitted(false);
    }, 3600000); // Reset after 1 hour
  };

  const getNewInspiration = () => {
    if (moodSpecificMessages.length <= 1) return;
    
    const currentIndex = moodSpecificMessages.findIndex(msg => msg.text === inspiration.text);
    let newIndex = currentIndex;
    
    // Make sure we get a different message
    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * moodSpecificMessages.length);
    }
    
    setInspiration(moodSpecificMessages[newIndex]);
    toast.success("New inspiration loaded!");
  };

  // Helper function to get color based on mood value
  const getMoodColor = (value: number) => {
    switch (value) {
      case 3: return "#22c55e"; // green-500
      case 2: return "#f59e0b"; // amber-500
      case 1: return "#ef4444"; // red-500
      default: return "#d1d5db"; // gray-300
    }
  };

  // Helper function to get the mood icon
  const getMoodIcon = (mood: string) => {
    const option = moodOptions.find(opt => opt.value === mood);
    if (!option) return null;
    return React.cloneElement(option.icon as React.ReactElement, { 
      className: `h-4 w-4 ${option.color}`
    });
  };

  // Helper function to get the event type styles
  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800";
      case "therapy":
        return "bg-purple-100 text-purple-800";
      case "medication":
        return "bg-red-100 text-red-800";
      case "activity":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-card shadow-sm hover:shadow transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {!submitted ? (
                <>
                  <p className="mb-4 text-sm">How are you feeling today?</p>
                  <RadioGroup className="gap-3" value={selectedMood || ""} onValueChange={setSelectedMood}>
                    {moodOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label
                          htmlFor={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <span className={option.color}>{option.icon}</span>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full mt-4 bg-primary hover:bg-primary/90"
                  >
                    Submit Check-in
                  </Button>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="font-medium text-green-600 mb-1">Check-in Recorded!</p>
                  <p className="text-sm text-muted-foreground">
                    Thank you for sharing how you're feeling today.
                  </p>
                </div>
              )}
              
              {/* Mood history chart */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Your Mood - Last 7 Days</h3>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        fontSize={12}
                      />
                      <YAxis 
                        domain={[0, 3]} 
                        ticks={[1, 2, 3]} 
                        axisLine={false}
                        tickLine={false}
                        width={30}
                        tickFormatter={(value) => {
                          switch (value) {
                            case 3: return "😊";
                            case 2: return "😐";
                            case 1: return "😔";
                            default: return "";
                          }
                        }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          const moodValue = Number(value);
                          switch (moodValue) {
                            case 3: return ["Great", "Mood"];
                            case 2: return ["Okay", "Mood"];
                            case 1: return ["Struggling", "Mood"];
                            default: return ["Not recorded", "Mood"];
                          }
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                        activeDot={{ r: 6 }}
                        isAnimationActive={true}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-l-0 md:border-l pl-0 md:pl-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium text-sm">
                  {selectedMood ? `Daily Inspiration for ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Days` : "Daily Inspiration"}
                </h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-md">
                <p className="text-sm italic">{inspiration.text}</p>
                <p className="text-xs mt-2 text-muted-foreground">
                  {inspiration.type && `Focus: ${inspiration.type.charAt(0).toUpperCase() + inspiration.type.slice(1)}`}
                </p>
              </div>
              <div className="flex justify-end mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={getNewInspiration}
                  className="text-xs flex items-center gap-1"
                >
                  <Brain className="h-3 w-3" />
                  New Tip
                </Button>
              </div>
              
              {/* Today's appointments section */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium text-sm">Today's Schedule</h3>
                </div>
                <div className="space-y-2">
                  {upcomingEvents
                    .filter(event => event.date === format(new Date(), "yyyy-MM-dd"))
                    .map(event => (
                      <div key={event.id} className="bg-card border rounded-md p-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{event.title}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${getEventTypeStyles(event.type)}`}>
                            {event.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  {upcomingEvents.filter(event => event.date === format(new Date(), "yyyy-MM-dd")).length === 0 && (
                    <div className="text-sm text-muted-foreground italic text-center py-2">
                      No scheduled events for today
                    </div>
                  )}
                </div>
              </div>
              
              {/* Upcoming tasks section */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium text-sm">Upcoming Tasks</h3>
                </div>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {upcomingEvents
                    .filter(event => event.date !== format(new Date(), "yyyy-MM-dd"))
                    .slice(0, 3) // Limit to first 3 upcoming events
                    .map(event => (
                      <div key={event.id} className="bg-card border rounded-md p-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{event.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {event.date.split('-').slice(1).join('/')} • {event.time}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${getEventTypeStyles(event.type)}`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 text-xs"
                >
                  View Full Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
