
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Book, Heart, Footprints, Utensils, Home, Plus, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Icon mapping for goal icons
const iconMap = {
  "walking": Footprints,
  "book": Book,
  "heart": Heart,
  "target": Target,
  "cooking": Utensils,
  "home": Home
};

interface Goal {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "long-term";
  description?: string;
  progress: number;
  icon: string;
  dueDate?: string;
  createdAt: string;
  status: "to-do" | "doing" | "done";
  smallSteps: any[];
}

// Sample organized goals data
const sampleOrganizedGoals: Goal[] = [
  {
    id: "goal1",
    title: "Walk to the mailbox by myself",
    type: "daily",
    description: "Build independence in mobility",
    progress: 65,
    icon: "walking",
    dueDate: "2024-02-15",
    createdAt: "2024-01-15",
    status: "doing",
    smallSteps: []
  },
  {
    id: "goal2",
    title: "Read a whole book",
    type: "weekly",
    description: "Improve cognitive function through reading",
    progress: 45,
    icon: "book",
    dueDate: "2024-03-01",
    createdAt: "2024-01-20",
    status: "doing",
    smallSteps: []
  },
  {
    id: "goal3",
    title: "Cook a simple meal",
    type: "weekly",
    description: "Regain independence in kitchen tasks",
    progress: 25,
    icon: "cooking",
    dueDate: "2024-02-28",
    createdAt: "2024-01-25",
    status: "to-do",
    smallSteps: []
  },
  {
    id: "goal4",
    title: "Daily morning walk",
    type: "daily",
    description: "Completed daily exercise routine",
    progress: 100,
    icon: "walking",
    dueDate: "2024-01-31",
    createdAt: "2024-01-01",
    status: "done",
    smallSteps: []
  }
];

interface GoalCardProps {
  goal: Goal;
  onClick: (goalId: string) => void;
}

function GoalCard({ goal, onClick }: GoalCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[goal.icon as keyof typeof iconMap] || Target;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "to-do": return "bg-gray-100 text-gray-800 border-gray-200";
      case "doing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "done": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/30 relative",
        getStatusColor(goal.status).split(' ')[2]
      )}
      onClick={() => onClick(goal.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 text-gray-800">
                {goal.title}
              </CardTitle>
              <Badge className={cn("mt-1 text-xs border", getStatusColor(goal.status))}>
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {goal.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{goal.description}</p>
          )}
          
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Progress</span>
              <span className="text-sm font-bold text-primary">{goal.progress}%</span>
            </div>
            <Progress 
              value={goal.progress} 
              className="h-2"
              indicatorClassName={cn(getProgressColor(goal.progress))}
            />
          </div>

          {/* Type badge */}
          <Badge variant="outline" className="text-xs">
            {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal
          </Badge>
        </div>
      </CardContent>

      {/* Hover overlay with dates */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center text-white p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Started: {new Date(goal.createdAt).toLocaleDateString()}</span>
            </div>
            {goal.dueDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            <p className="text-xs opacity-80 mt-2">Click to view details</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export function OrganizedGoalBoard() {
  const navigate = useNavigate();
  const [goals] = useState<Goal[]>(sampleOrganizedGoals);

  const handleGoalClick = (goalId: string) => {
    navigate(`/calendar/goal/${goalId}`);
  };

  const handleAddGoal = () => {
    navigate("/calendar?planMyDreams=true");
    toast.info("Starting Plan My Dreams flow!");
  };

  const categorizeGoals = () => {
    return {
      "to-do": goals.filter(goal => goal.status === "to-do"),
      "doing": goals.filter(goal => goal.status === "doing"),
      "done": goals.filter(goal => goal.status === "done")
    };
  };

  const categorizedGoals = categorizeGoals();

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "to-do": return "📋 To Do";
      case "doing": return "🚀 In Progress";
      case "done": return "✅ Completed";
      default: return category;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "to-do": return "Goals ready to start";
      case "doing": return "Goals currently being worked on";
      case "done": return "Successfully completed goals";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            My Goal Board
          </h2>
          <p className="text-gray-600 mt-1">Your dreams organized and in progress</p>
        </div>
        
        <Button onClick={handleAddGoal} className="bg-gradient-to-r from-purple-500 to-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Plan New Dream
        </Button>
      </div>

      {/* Goal Categories */}
      <div className="space-y-8">
        {Object.entries(categorizedGoals).map(([category, categoryGoals]) => (
          <div key={category} className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {getCategoryTitle(category)}
              </h3>
              <p className="text-sm text-gray-600">{getCategoryDescription(category)}</p>
              <Badge variant="outline" className="mt-1">
                {categoryGoals.length} goal{categoryGoals.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {categoryGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryGoals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    onClick={handleGoalClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>No goals in this category yet</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state for no goals */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No goals yet</h3>
          <p className="text-gray-500 mb-4">Start by planning your first dream!</p>
          <Button onClick={handleAddGoal} className="bg-gradient-to-r from-purple-500 to-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            Plan My First Dream
          </Button>
        </div>
      )}
    </div>
  );
}
