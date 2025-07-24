
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Target } from "lucide-react";
import { toast } from "sonner";
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
    setStep(2);
  };

  const handleCreateGoal = () => {
    if (!goalType || !goalTitle.trim() || !goalMeasurement.trim()) {
      toast.error("Please complete all required fields");
      return;
    }

    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goalTitle,
      myRhythmFocus: goalType.id,
      target: goalMeasurement,
      why: goalWhy || `Achieve: ${goalTitle}`,
      timeframe: goalTimeframe,
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
          </div>
        </MemoryEffectsContainer>
      </DialogContent>
    </Dialog>
  );
}
