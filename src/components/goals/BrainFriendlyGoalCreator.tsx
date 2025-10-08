
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Target, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { GoalTypeSelector, GoalType, GOAL_TYPES } from "./components/GoalTypeSelector";
import { GoalDefinitionGuide } from "./components/GoalDefinitionGuide";
import { GoalFormFields } from "./components/GoalFormFields";
import { StepIndicator } from "./components/StepIndicator";

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
  const [goalMeasurement, setGoalMeasurement] = useState("");
  const [goalTimeframe, setGoalTimeframe] = useState("");
  const [skipGuidance, setSkipGuidance] = useState(() => {
    return localStorage.getItem('goals_skip_guidance') === 'true';
  });
  const { createGoal } = useDailyActions();

  const handleReset = () => {
    setStep(1);
    setGoalType(null);
    setGoalTitle("");
    setGoalWhy("");
    setGoalMeasurement("");
    setGoalTimeframe("");
  };

  const handleClose = () => {
    onOpenChange(false);
    handleReset();
  };

  const handleTypeSelect = (type: GoalType) => {
    setGoalType(type);
    setStep(skipGuidance ? 3 : 2); // Skip to quick entry if guidance is disabled
  };

  const toggleSkipGuidance = () => {
    const newValue = !skipGuidance;
    setSkipGuidance(newValue);
    localStorage.setItem('goals_skip_guidance', newValue.toString());
    
    if (newValue && step === 2) {
      setStep(3); // Move to quick entry
    } else if (!newValue && step === 3) {
      setStep(2); // Move back to guided
    }
  };

  const handleCreateGoal = async () => {
    if (!goalType || !goalTitle.trim() || !goalMeasurement.trim()) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      const goalData = {
        title: goalTitle,
        description: goalWhy || undefined,
        category: goalType.id as 'mobility' | 'cognitive' | 'health' | 'personal' | 'social',
        target_date: goalTimeframe ? new Date(goalTimeframe).toISOString().split('T')[0] : undefined,
        status: 'active' as const
      };

      const newGoal = await createGoal(goalData);
      onGoalCreated(newGoal);
      
      toast.success("🎯 Goal Created!", {
        description: `"${goalTitle}" is now saved and ready to help guide your journey!`,
        duration: 4000
      });
      
      handleClose();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error("Failed to create goal", {
        description: "Please try again or contact support if the issue persists."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <MemoryEffectsContainer nodeCount={4} className="relative">
          <DialogHeader className="text-center space-y-4 pb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-memory-emerald-400 to-clarity-teal-400 rounded-full flex items-center justify-center mx-auto animate-memory-pulse">
              <Target className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
              Create Your Goal
            </DialogTitle>
            <p className="text-brain-base text-gray-600">
              Simple steps to build goals that work with your brain, not against it
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Step Indicator */}
            <StepIndicator currentStep={step} totalSteps={2} />

            {/* Step 1: Choose Goal Type */}
            {step === 1 && (
              <GoalTypeSelector onTypeSelect={handleTypeSelect} />
            )}

            {/* Step 2: Define Goal with Guidance */}
            {step === 2 && goalType && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${goalType.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white`}>
                    {goalType.icon}
                  </div>
                  <h3 className="text-brain-lg font-semibold">{goalType.title} Goal</h3>
                  <p className="text-brain-sm text-gray-600">{goalType.description}</p>
                </div>

                {/* Skip Guidance Option */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSkipGuidance}
                    className="flex items-center gap-2 text-xs"
                  >
                    <SkipForward className="h-3 w-3" />
                    Skip Guidance & Quick Entry
                  </Button>
                </div>

                {/* Goal Definition Guidance */}
                <GoalDefinitionGuide />

                <GoalFormFields
                  goalType={goalType}
                  goalTitle={goalTitle}
                  setGoalTitle={setGoalTitle}
                  goalMeasurement={goalMeasurement}
                  setGoalMeasurement={setGoalMeasurement}
                  goalTimeframe={goalTimeframe}
                  setGoalTimeframe={setGoalTimeframe}
                  goalWhy={goalWhy}
                  setGoalWhy={setGoalWhy}
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="w-full sm:flex-1 min-h-[44px]"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateGoal}
                    disabled={!goalTitle.trim() || !goalMeasurement.trim()}
                    className="w-full sm:flex-1 bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600 min-h-[44px]"
                  >
                    Create Goal
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Quick Entry Mode */}
            {step === 3 && goalType && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${goalType.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white`}>
                    {goalType.icon}
                  </div>
                  <h3 className="text-brain-lg font-semibold">Quick Goal Entry</h3>
                  <p className="text-brain-sm text-gray-600">Fast track your {goalType.title.toLowerCase()} goal creation</p>
                </div>

                {/* Quick Entry Form */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Goal Title *</Label>
                    <Input
                      placeholder="What do you want to achieve?"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">Success Measurement *</Label>
                    <Input
                      placeholder="How will you know you've achieved it?"
                      value={goalMeasurement}
                      onChange={(e) => setGoalMeasurement(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">Target Date (Optional)</Label>
                    <Input
                      type="date"
                      value={goalTimeframe}
                      onChange={(e) => setGoalTimeframe(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">Personal Why (Optional)</Label>
                    <Textarea
                      placeholder="Why is this goal important to you?"
                      value={goalWhy}
                      onChange={(e) => setGoalWhy(e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Use Full Guidance Link */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSkipGuidance}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Use full guidance instead
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="w-full sm:flex-1 min-h-[44px]"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateGoal}
                    disabled={!goalTitle.trim() || !goalMeasurement.trim()}
                    className="w-full sm:flex-1 bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600 min-h-[44px]"
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
