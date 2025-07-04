
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Brain, Heart, Users, Activity, ArrowRight, Target, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface GoalType {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  examples: string[];
}

const GOAL_TYPES: GoalType[] = [
  {
    id: 'cognitive',
    title: 'Brain Power',
    icon: <Brain className="h-6 w-6" />,
    color: 'from-memory-emerald-400 to-memory-emerald-500',
    description: 'Strengthen your thinking and memory',
    examples: ['Read 15 minutes daily', 'Complete memory games', 'Learn something new']
  },
  {
    id: 'physical',
    title: 'Body Wellness',
    icon: <Activity className="h-6 w-6" />,
    color: 'from-clarity-teal-400 to-clarity-teal-500',
    description: 'Build strength and mobility',
    examples: ['Walk to the mailbox', 'Do stretching exercises', 'Take the stairs']
  },
  {
    id: 'emotional',
    title: 'Heart Health',
    icon: <Heart className="h-6 w-6" />,
    color: 'from-brain-health-400 to-brain-health-500',
    description: 'Nurture your emotional wellbeing',
    examples: ['Practice gratitude daily', 'Call a friend', 'Journal feelings']
  },
  {
    id: 'social',
    title: 'Connection',
    icon: <Users className="h-6 w-6" />,
    color: 'from-purple-400 to-purple-500',
    description: 'Build meaningful relationships',
    examples: ['Join a support group', 'Have coffee with family', 'Volunteer weekly']
  }
];

interface BrainFriendlyGoalCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: (goal: any) => void;
}

export function BrainFriendlyGoalCreator({ 
  open, 
  onOpenChange, 
  onGoalCreated 
}: BrainFriendlyGoalCreatorProps) {
  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState<GoalType | null>(null);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalWhy, setGoalWhy] = useState("");

  const handleReset = () => {
    setStep(1);
    setGoalType(null);
    setGoalTitle("");
    setGoalWhy("");
  };

  const handleClose = () => {
    onOpenChange(false);
    handleReset();
  };

  const handleTypeSelect = (type: GoalType) => {
    setGoalType(type);
    setStep(2);
  };

  const handleCreateGoal = () => {
    if (!goalType || !goalTitle.trim()) {
      toast.error("Please complete all fields");
      return;
    }

    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goalTitle,
      myRhythmFocus: goalType.id,
      target: goalWhy || `Achieve: ${goalTitle}`,
      progress: 0,
      actions: [],
      createdAt: new Date().toISOString()
    };

    onGoalCreated(newGoal);
    
    toast.success("🎯 Goal Created!", {
      description: `"${goalTitle}" is now part of your journey. Let's break it into small steps!`,
      duration: 4000
    });
    
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <MemoryEffectsContainer nodeCount={4} className="relative">
          <DialogHeader className="text-center space-y-4 pb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-memory-emerald-400 to-clarity-teal-400 rounded-full flex items-center justify-center mx-auto animate-memory-pulse">
              <Target className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
              Create Your Memory-Friendly Goal
            </DialogTitle>
            <p className="text-brain-base text-gray-600">
              Simple steps to build goals that work with your brain, not against it
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex justify-center items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-memory-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-memory-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-memory-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>

            {/* Step 1: Choose Goal Type */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-brain-lg font-semibold text-center">What area would you like to focus on?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GOAL_TYPES.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleTypeSelect(type)}
                      className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-memory-emerald-300 hover:bg-memory-emerald-50 transition-all group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-white`}>
                        {type.icon}
                      </div>
                      <h4 className="font-semibold text-brain-base mb-2">{type.title}</h4>
                      <p className="text-brain-sm text-gray-600 mb-3">{type.description}</p>
                      <div className="space-y-1">
                        {type.examples.slice(0, 2).map((example, idx) => (
                          <p key={idx} className="text-xs text-gray-500">• {example}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Define Goal */}
            {step === 2 && goalType && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${goalType.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white`}>
                    {goalType.icon}
                  </div>
                  <h3 className="text-brain-lg font-semibold">{goalType.title} Goal</h3>
                  <p className="text-brain-sm text-gray-600">{goalType.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goalTitle" className="text-brain-base font-medium">
                      What do you want to achieve? *
                    </Label>
                    <Input
                      id="goalTitle"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      placeholder="e.g., Walk to the mailbox by myself"
                      className="mt-2 text-brain-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="goalWhy" className="text-brain-base font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Why is this meaningful to you?
                    </Label>
                    <Textarea
                      id="goalWhy"
                      value={goalWhy}
                      onChange={(e) => setGoalWhy(e.target.value)}
                      placeholder="This will help me feel more independent and confident..."
                      className="mt-2 text-brain-sm"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This helps your brain remember why this goal matters during challenging times
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateGoal}
                    disabled={!goalTitle.trim()}
                    className="flex-1 bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600"
                  >
                    Create Goal
                  </Button>
                </div>
              </div>
            )}
          </div>
        </MemoryEffectsContainer>
      </DialogContent>
    </Dialog>
  );
}
