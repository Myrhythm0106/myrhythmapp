
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Sparkles, Target, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CelebrationSystemProps {
  onGoalMilestone?: (goalId: string, milestone: number) => void;
  onGoalComplete?: (goalId: string) => void;
}

interface Milestone {
  goalId: string;
  goalTitle: string;
  milestone: number;
  message: string;
}

interface GoalCompletion {
  goalId: string;
  goalTitle: string;
  metric: string;
  focus?: string;
  benefit: string;
}

export function CelebrationSystem({ onGoalMilestone, onGoalComplete }: CelebrationSystemProps) {
  const navigate = useNavigate();
  const [showMilestone, setShowMilestone] = useState<Milestone | null>(null);
  const [showCompletion, setShowCompletion] = useState<GoalCompletion | null>(null);

  // Milestone celebration function
  const celebrateMilestone = (goalId: string, goalTitle: string, milestone: number) => {
    const milestoneMessages = {
      25: `You're off to a great start with "${goalTitle}"! Quarter of the way there! 🚀`,
      50: `Halfway there on "${goalTitle}"! Your dedication is inspiring! 💪`,
      75: `You're so close! Three-quarters complete on "${goalTitle}"! The finish line is in sight! ⭐`
    };

    const milestoneData: Milestone = {
      goalId,
      goalTitle,
      milestone,
      message: milestoneMessages[milestone as keyof typeof milestoneMessages] || "Great progress!"
    };

    setShowMilestone(milestoneData);
    onGoalMilestone?.(goalId, milestone);

    // Also show toast notification
    toast.success(`${milestone}% Complete! 🎉`, {
      description: milestoneData.message,
      duration: 6000
    });
  };

  // Goal completion celebration
  const celebrateGoalCompletion = (completion: GoalCompletion) => {
    setShowCompletion(completion);
    onGoalComplete?.(completion.goalId);

    // Show immediate toast
    toast.success("🎉 GOAL ACHIEVED! 🎉", {
      description: `Congratulations on completing "${completion.goalTitle}"!`,
      duration: 8000
    });
  };

  // Action completion micro-celebrations
  const celebrateActionCompletion = (actionTitle: string, goalTitle?: string) => {
    const celebrations = [
      "Great work! ✨",
      "You nailed it! 💪", 
      "Fantastic! 🌟",
      "Well done! 🎯",
      "Amazing! 🚀"
    ];
    
    const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
    
    toast.success(celebration, {
      description: goalTitle 
        ? `"${actionTitle}" completed! One step closer to "${goalTitle}"!`
        : `"${actionTitle}" completed successfully!`,
      duration: 4000
    });
  };

  // Daily wins summary
  const showDailyWins = (completedActions: number) => {
    if (completedActions === 0) return;

    const encouragements = [
      `You crushed ${completedActions} actions today! Keep that momentum going! 🔥`,
      `${completedActions} actions completed! You're building incredible habits! ⭐`,
      `Fantastic day! ${completedActions} actions done! Your consistency is paying off! 💪`,
      `${completedActions} actions in the books! You're making real progress! 🚀`
    ];

    const message = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    toast.success("Daily Wins Summary! 🏆", {
      description: message,
      duration: 6000
    });
  };

  // Weekly summary
  const showWeeklySummary = (weeklyData: { goalProgress: any[], actionsCompleted: number }) => {
    const message = `Fantastic week! You completed ${weeklyData.actionsCompleted} actions and made progress on ${weeklyData.goalProgress.length} goals. Your rhythm is getting stronger!`;
    
    toast.success("Weekly Achievement! 📈", {
      description: message,
      duration: 8000
    });
  };

  return (
    <>
      {/* Milestone Celebration Dialog */}
      <Dialog open={!!showMilestone} onOpenChange={() => setShowMilestone(null)}>
        <DialogContent className="sm:max-w-[500px] text-center">
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Star className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Milestone Reached!</h2>
                <Badge className="bg-primary/10 text-primary text-lg py-1 px-3">
                  {showMilestone?.milestone}% Complete
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-lg font-semibold text-gray-800">
                  {showMilestone?.goalTitle}
                </p>
                <p className="text-gray-600 mt-2">
                  {showMilestone?.message}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary/80"
                onClick={() => {
                  setShowMilestone(null);
                  navigate(`/calendar?goalId=${showMilestone?.goalId}`);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Goal Progress
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowMilestone(null)}
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Completion Celebration Dialog */}
      <Dialog open={!!showCompletion} onOpenChange={() => setShowCompletion(null)}>
        <DialogContent className="sm:max-w-[600px] text-center">
          <div className="space-y-8 py-6">
            {/* Confetti-like header */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                    <Sparkles className="h-8 w-8 text-yellow-500" />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-green-700 mb-2">
                  🎉 CONGRATULATIONS! 🎉
                </h1>
                <p className="text-xl text-gray-700">
                  You've achieved your goal!
                </p>
              </div>
            </div>

            {/* Goal details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-green-800">
                {showCompletion?.goalTitle}
              </h2>
              
              <div className="text-left space-y-2">
                <p className="text-sm text-green-700">
                  <strong>Achievement:</strong> {showCompletion?.metric}
                </p>
                {showCompletion?.focus && (
                  <p className="text-sm text-green-700">
                    <strong>Focus Area:</strong> {showCompletion.focus}
                  </p>
                )}
                <p className="text-sm text-green-700">
                  <strong>Impact:</strong> {showCompletion?.benefit}
                </p>
              </div>
            </div>

            {/* Motivational message */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <p className="text-gray-700 italic">
                "Your dedication and consistency have paid off! This achievement shows your strength and determination. You're building momentum that will carry you to even greater successes."
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-lg py-3"
                onClick={() => {
                  setShowCompletion(null);
                  navigate("/calendar?planMyDreams=true");
                }}
              >
                <Target className="h-5 w-5 mr-2" />
                Set Your Next Goal
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowCompletion(null);
                    // Share achievement functionality
                    toast.success("Achievement shared! 📢");
                  }}
                >
                  Share Achievement
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowCompletion(null);
                    navigate("/calendar?view=goals");
                  }}
                >
                  View All Goals
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setShowCompletion(null)}
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export utility functions for easy use throughout the app
export const celebrationUtils = {
  celebrateMilestone: (goalId: string, goalTitle: string, milestone: number) => {
    // This would trigger the celebration system
    console.log(`Celebrating ${milestone}% milestone for ${goalTitle}`);
  },
  
  celebrateGoalCompletion: (completion: GoalCompletion) => {
    // This would trigger the goal completion celebration
    console.log(`Celebrating completion of ${completion.goalTitle}`);
  },
  
  celebrateActionCompletion: (actionTitle: string, goalTitle?: string) => {
    const celebrations = ["Great work! ✨", "You nailed it! 💪", "Fantastic! 🌟"];
    const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
    
    toast.success(celebration, {
      description: goalTitle 
        ? `"${actionTitle}" completed! One step closer to "${goalTitle}"!`
        : `"${actionTitle}" completed successfully!`,
      duration: 4000
    });
  }
};
