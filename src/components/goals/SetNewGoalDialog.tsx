
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Target, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SetNewGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: (goal: any) => void;
}

interface MyRhythmFocus {
  id: string;
  title: string;
  color: string;
  description: string;
}

const myRhythmFocuses: MyRhythmFocus[] = [
  { id: "cognitive", title: "Cognitive Recovery", color: "bg-purple-100 text-purple-800", description: "Memory, focus, problem-solving" },
  { id: "physical", title: "Physical Health", color: "bg-green-100 text-green-800", description: "Movement, strength, coordination" },
  { id: "emotional", title: "Emotional Wellbeing", color: "bg-pink-100 text-pink-800", description: "Mood, relationships, confidence" },
  { id: "independence", title: "Daily Independence", color: "bg-blue-100 text-blue-800", description: "Self-care, routine, autonomy" }
];

export function SetNewGoalDialog({ open, onOpenChange, onGoalCreated }: SetNewGoalDialogProps) {
  const [step, setStep] = useState(1);
  const [goalData, setGoalData] = useState({
    title: "",
    myRhythmFocus: "",
    target: "",
    deadline: undefined as Date | undefined,
    description: ""
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      ...goalData,
      progress: 0,
      createdAt: new Date().toISOString(),
      actions: []
    };

    onGoalCreated(newGoal);
    
    toast.success("Goal Created! 🎯", {
      description: `"${goalData.title}" is now ready for actions!`,
      duration: 4000
    });

    // Reset form
    setGoalData({
      title: "",
      myRhythmFocus: "",
      target: "",
      deadline: undefined,
      description: ""
    });
    setStep(1);
    onOpenChange(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return goalData.title.trim().length > 0;
      case 2: return goalData.target.trim().length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const selectedFocus = myRhythmFocuses.find(f => f.id === goalData.myRhythmFocus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Set a New Goal
            <Badge variant="outline" className="ml-auto">
              Step {step} of 3
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  i <= step ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {i < step ? <Check className="h-4 w-4" /> : i}
                </div>
                {i < 3 && (
                  <div className={cn(
                    "w-8 h-0.5",
                    i < step ? "bg-primary" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Goal Title */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <h3 className="text-lg font-semibold mb-2">What's your goal?</h3>
                <p className="text-muted-foreground">
                  Start with something meaningful that you want to achieve
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Improve my sleep quality, Walk independently..."
                  value={goalData.title}
                  onChange={(e) => setGoalData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-3">
                <Label>Link to MyRhythm Focus (Optional)</Label>
                <p className="text-sm text-muted-foreground">
                  Connect this goal to one of your main focus areas
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {myRhythmFocuses.map((focus) => (
                    <button
                      key={focus.id}
                      type="button"
                      onClick={() => setGoalData(prev => ({ 
                        ...prev, 
                        myRhythmFocus: prev.myRhythmFocus === focus.id ? "" : focus.id 
                      }))}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all",
                        goalData.myRhythmFocus === focus.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={focus.color}>{focus.title}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{focus.description}</p>
                        </div>
                        {goalData.myRhythmFocus === focus.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target & Deadline */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <h3 className="text-lg font-semibold mb-2">How will you measure success?</h3>
                <p className="text-muted-foreground">
                  Define what achievement looks like for this goal
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target/Metric</Label>
                <Textarea
                  id="target"
                  placeholder="e.g., Average 7+ hours of sleep per night, Walk to mailbox independently, Complete daily exercises..."
                  value={goalData.target}
                  onChange={(e) => setGoalData(prev => ({ ...prev, target: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Target Deadline (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !goalData.deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {goalData.deadline ? format(goalData.deadline, "PPP") : "Pick a target date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={goalData.deadline}
                      onSelect={(date) => setGoalData(prev => ({ ...prev, deadline: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <h3 className="text-lg font-semibold mb-2">Review your goal</h3>
                <p className="text-muted-foreground">
                  Everything looks good? You can add actions to this goal next!
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Goal</Label>
                  <p className="font-semibold">{goalData.title}</p>
                </div>

                {selectedFocus && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">MyRhythm Focus</Label>
                    <Badge className={`${selectedFocus.color} mt-1`}>
                      {selectedFocus.title}
                    </Badge>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-600">Success Metric</Label>
                  <p>{goalData.target}</p>
                </div>

                {goalData.deadline && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Target Date</Label>
                    <p>{format(goalData.deadline, "PPP")}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Notes (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any additional context or motivation for this goal..."
                  value={goalData.description}
                  onChange={(e) => setGoalData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[60px]"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Create Goal
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
