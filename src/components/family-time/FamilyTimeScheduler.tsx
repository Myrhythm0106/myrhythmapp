
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Calendar, Clock, Heart, Plus, Star } from "lucide-react";
import { toast } from "sonner";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  availability?: string[];
}

interface FamilyTimeActivity {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "easy" | "medium" | "challenging";
  category: "conversation" | "activity" | "shared-task" | "celebration";
  benefits: string[];
}

const familyActivities: FamilyTimeActivity[] = [
  {
    id: "daily-checkin",
    title: "Daily Family Check-in",
    description: "Share one good thing from today and ask how everyone is feeling",
    duration: 10,
    difficulty: "easy",
    category: "conversation",
    benefits: ["emotional connection", "routine building"]
  },
  {
    id: "cooking-together",
    title: "Cook a Simple Meal Together", 
    description: "Prepare something easy like sandwiches or pasta side by side",
    duration: 30,
    difficulty: "medium",
    category: "activity",
    benefits: ["collaboration", "life skills", "quality time"]
  },
  {
    id: "gratitude-sharing",
    title: "Gratitude Circle",
    description: "Each person shares 2 things they're grateful for today",
    duration: 15,
    difficulty: "easy", 
    category: "conversation",
    benefits: ["positive focus", "emotional bonding"]
  },
  {
    id: "memory-lane",
    title: "Share a Favorite Memory",
    description: "Take turns sharing a happy memory involving the family",
    duration: 20,
    difficulty: "easy",
    category: "conversation", 
    benefits: ["memory strengthening", "emotional connection"]
  }
];

export function FamilyTimeScheduler() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", name: "Partner/Spouse", relationship: "spouse" },
    { id: "2", name: "Child", relationship: "child" }
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<FamilyTimeActivity | null>(null);

  const addFamilyMember = () => {
    if (!newMemberName.trim() || !newMemberRelation.trim()) return;
    
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName,
      relationship: newMemberRelation
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName("");
    setNewMemberRelation("");
    setShowAddMember(false);
    
    toast.success("Family member added! 👨‍👩‍👧‍👦", {
      description: `${newMemberName} has been added to your family circle.`
    });
  };

  const scheduleFamilyTime = (activity: FamilyTimeActivity) => {
    setSelectedActivity(activity);
    
    toast.success("Family Time Scheduled! ❤️", {
      description: `"${activity.title}" is ready for your family. Duration: ${activity.duration} minutes.`,
      duration: 5000,
      action: (
        <Button size="sm" onClick={() => startFamilyTime(activity)}>
          Start Now
        </Button>
      )
    });
  };

  const startFamilyTime = (activity: FamilyTimeActivity) => {
    toast.info(`Family Time Started: ${activity.title}`, {
      description: activity.description,
      duration: 8000
    });

    // Set timer for activity completion
    setTimeout(() => {
      toast.success("Family Time Complete! 🎉", {
        description: "How did it go? Your family bonds grow stronger with each interaction!",
        duration: 6000,
        action: (
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => recordFamilyTime(activity.id, "great")}>
              😊 Amazing
            </Button>
            <Button size="sm" variant="outline" onClick={() => recordFamilyTime(activity.id, "good")}>
              👍 Good
            </Button>
          </div>
        )
      });
    }, activity.duration * 60 * 1000);
  };

  const recordFamilyTime = (activityId: string, quality: "great" | "good") => {
    console.log(`Family time recorded: ${activityId} - ${quality}`);
    toast.success("Family time logged! 💕", {
      description: "These moments matter for your recovery and family relationships.",
      duration: 4000
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "challenging": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Family Circle */}
      <Card className="border-heart-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-heart-500" />
            Your Family Circle
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {familyMembers.map((member) => (
              <Badge key={member.id} variant="outline" className="px-3 py-1 bg-heart-50 text-heart-700 border-heart-300">
                {member.name} ({member.relationship})
              </Badge>
            ))}
          </div>
          
          <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-dashed">
                <Plus className="h-4 w-4 mr-1" />
                Add Family Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Name (e.g., Sarah, Mom, Brother)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
                <Input
                  placeholder="Relationship (e.g., daughter, parent, friend)"
                  value={newMemberRelation}
                  onChange={(e) => setNewMemberRelation(e.target.value)}
                />
                <Button onClick={addFamilyMember} className="w-full">
                  Add to Family Circle
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Family Time Activities */}
      <Card className="border-memory-emerald-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-memory-emerald-600" />
            Family Time Activities
          </CardTitle>
          <p className="text-sm text-gray-600">
            Brain-friendly activities to strengthen family bonds
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {familyActivities.map((activity) => (
            <div key={activity.id} className="p-4 bg-gradient-to-r from-memory-emerald-50 to-heart-50 rounded-lg border border-memory-emerald-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-memory-emerald-800">{activity.title}</h3>
                    <Badge className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {activity.category}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => scheduleFamilyTime(activity)}
                  className="bg-memory-emerald-500 hover:bg-memory-emerald-600"
                >
                  Schedule
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {activity.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-white/70">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
