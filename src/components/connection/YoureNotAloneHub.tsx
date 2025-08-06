import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  BookOpen,
  Star,
  Lightbulb,
  Calendar,
  Share2,
  Brain
} from "lucide-react";

export function YoureNotAloneHub() {
  const [activeTab, setActiveTab] = useState("stories");

  const successStories = [
    {
      id: 1,
      name: "Sarah M.",
      journey: "TBI Recovery",
      story: "Building my support circle changed everything. My family went from feeling helpless to feeling empowered. We're all healing together now.",
      impact: "6 months post-injury",
      supporters: 4
    },
    {
      id: 2,
      name: "Mike R.",
      journey: "Memory Challenges",
      story: "I thought I was a burden until I saw how much my progress meant to my wife. She says watching me adapt has made her stronger too.",
      impact: "1 year journey",
      supporters: 3
    },
    {
      id: 3,
      name: "Lisa K.",
      journey: "Cognitive Recovery",
      story: "My teenager started handling his own challenges better after seeing how I tackle mine. We're both growing from this experience.",
      impact: "8 months progress",
      supporters: 5
    }
  ];

  const sharedExperiences = [
    {
      icon: Heart,
      title: "The 'You Don't Look Sick' Challenge",
      participants: 127,
      lastActivity: "2 hours ago",
      description: "Supporting each other through invisible disability experiences"
    },
    {
      icon: Brain,
      title: "Memory Wins & Worries",
      participants: 89,
      lastActivity: "4 hours ago", 
      description: "Celebrating small victories and sharing coping strategies"
    },
    {
      icon: Users,
      title: "Family Dynamics & Communication",
      participants: 156,
      lastActivity: "1 hour ago",
      description: "Navigating changed relationships and building understanding"
    }
  ];

  const connectionChallenges = [
    {
      title: "Share a Win This Week",
      description: "Tell your support circle about one positive thing from your week",
      participants: 234,
      timeLeft: "4 days left"
    },
    {
      title: "Gratitude Chain",
      description: "Send one thank you message to someone who's supported you",
      participants: 167,
      timeLeft: "2 days left"
    },
    {
      title: "Progress Photo Share",
      description: "Share a photo that represents your growth this month",
      participants: 98,
      timeLeft: "1 week left"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Users className="h-3 w-3 mr-1" />
          You're Not Alone Community Hub
        </Badge>
        
        <h2 className="text-3xl font-bold">
          Connect, Share, and Heal Together
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of others who understand your journey. Share experiences, 
          find hope, and build connections that strengthen everyone involved.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stories" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Success Stories
          </TabsTrigger>
          <TabsTrigger value="experiences" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Shared Experiences
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Connection Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-4">
          {successStories.map((story) => (
            <Card key={story.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold">{story.name}</h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      {story.journey}
                    </Badge>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{story.impact}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3" />
                      {story.supporters} supporters
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "{story.story}"
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    Inspiring
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="experiences" className="space-y-4">
          {sharedExperiences.map((experience, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <experience.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{experience.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {experience.participants} members
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {experience.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Last activity: {experience.lastActivity}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          {connectionChallenges.map((challenge, index) => (
            <Card key={index} className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{challenge.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {challenge.participants} participating
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {challenge.timeLeft}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Join Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
