
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Target, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SmallStep {
  id: string;
  title: string;
  description: string;
  actions: DailyAction[];
}

interface DailyAction {
  id: string;
  title: string;
  timing: string;
  duration: number;
}

interface GoalCreationWizardProps {
  onComplete: () => void;
}

export function GoalCreationWizard({ onComplete }: GoalCreationWizardProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState({
    title: "",
    category: "",
    description: "",
    timeline: "",
    smallSteps: [] as SmallStep[]
  });

  const categories = [
    { id: "independence", label: "Independence", color: "bg-blue-100 text-blue-800" },
    { id: "cognitive", label: "Cognitive", color: "bg-purple-100 text-purple-800" },
    { id: "emotional", label: "Emotional", color: "bg-pink-100 text-pink-800" },
    { id: "physical", label: "Physical", color: "bg-green-100 text-green-800" },
    { id: "social", label: "Social", color: "bg-orange-100 text-orange-800" }
  ];

  const timelines = [
    { id: "daily", label: "Daily Practice", description: "Something to do every day" },
    { id: "weekly", label: "Weekly Goal", description: "Achieve within a week" },
    { id: "monthly", label: "Monthly Goal", description: "Achieve within a month" },
    { id: "long-term", label: "Long-term Goal", description: "Achieve within 3-6 months" }
  ];

  const addSmallStep = () => {
    const newStep: SmallStep = {
      id: `step-${Date.now()}`,
      title: "",
      description: "",
      actions: []
    };
    setGoalData(prev => ({
      ...prev,
      smallSteps: [...prev.smallSteps, newStep]
    }));
  };

  const updateSmallStep = (stepId: string, field: string, value: string) => {
    setGoalData(prev => ({
      ...prev,
      smallSteps: prev.smallSteps.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }));
  };

  const addActionToStep = (stepId: string) => {
    const newAction: DailyAction = {
      id: `action-${Date.now()}`,
      title: "",
      timing: "morning",
      duration: 5
    };
    
    setGoalData(prev => ({
      ...prev,
      smallSteps: prev.smallSteps.map(step =>
        step.id === stepId 
          ? { ...step, actions: [...step.actions, newAction] }
          : step
      )
    }));
  };

  const updateAction = (stepId: string, actionId: string, field: string, value: any) => {
    setGoalData(prev => ({
      ...prev,
      smallSteps: prev.smallSteps.map(step =>
        step.id === stepId
          ? {
              ...step,
              actions: step.actions.map(action =>
                action.id === actionId ? { ...action, [field]: value } : action
              )
            }
          : step
      )
    }));
  };

  const removeSmallStep = (stepId: string) => {
    setGoalData(prev => ({
      ...prev,
      smallSteps: prev.smallSteps.filter(step => step.id !== stepId)
    }));
  };

  const removeAction = (stepId: string, actionId: string) => {
    setGoalData(prev => ({
      ...prev,
      smallSteps: prev.smallSteps.map(step =>
        step.id === stepId
          ? { ...step, actions: step.actions.filter(action => action.id !== actionId) }
          : step
      )
    }));
  };

  const handleComplete = () => {
    // Save goal data (in real app, this would save to database)
    console.log("Goal created:", goalData);
    
    toast.success("Goal Created Successfully! 🎉", {
      description: "Your goal has been saved and actions added to your calendar!",
      duration: 4000
    });
    
    onComplete();
    navigate("/calendar?view=goals");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return goalData.title && goalData.category;
      case 2:
        return goalData.description && goalData.timeline;
      case 3:
        return goalData.smallSteps.length > 0 && goalData.smallSteps.every(step => step.title);
      case 4:
        return goalData.smallSteps.every(step => step.actions.length > 0 && step.actions.every(action => action.title));
      default:
        return false;
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: Basic Goal Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>What's Your Goal?</CardTitle>
            <p className="text-muted-foreground">Start with something meaningful to you</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Goal Title</label>
              <Input
                placeholder="e.g., Walk to the mailbox by myself"
                value={goalData.title}
                onChange={(e) => setGoalData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={goalData.category === category.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setGoalData(prev => ({ ...prev, category: category.id }))}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Goal Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Tell Us More About Your Goal</CardTitle>
            <p className="text-muted-foreground">Help us understand what success looks like</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Why is this important to you?</label>
              <Textarea
                placeholder="Describe why achieving this goal matters to you..."
                value={goalData.description}
                onChange={(e) => setGoalData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Timeline</label>
              <div className="space-y-2">
                {timelines.map((timeline) => (
                  <Card
                    key={timeline.id}
                    className={`cursor-pointer border ${goalData.timeline === timeline.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                    onClick={() => setGoalData(prev => ({ ...prev, timeline: timeline.id }))}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{timeline.label}</p>
                          <p className="text-sm text-muted-foreground">{timeline.description}</p>
                        </div>
                        {goalData.timeline === timeline.id && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Break Down into Smaller Parts */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Break It Into Smaller Parts</CardTitle>
            <p className="text-muted-foreground">Divide your goal into 3-5 manageable steps</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalData.smallSteps.map((step, index) => (
              <Card key={step.id} className="border-l-4 border-l-orange-400">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-orange-100 text-orange-800">
                      Part {index + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500"
                      onClick={() => removeSmallStep(step.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="e.g., Walk to the front door"
                      value={step.title}
                      onChange={(e) => updateSmallStep(step.id, 'title', e.target.value)}
                    />
                    <Textarea
                      placeholder="Describe this step in more detail..."
                      value={step.description}
                      onChange={(e) => updateSmallStep(step.id, 'description', e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button
              variant="outline"
              onClick={addSmallStep}
              className="w-full border-dashed border-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Part
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Create Daily Actions */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Create Daily Actions</CardTitle>
            <p className="text-muted-foreground">Turn each part into specific daily actions</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalData.smallSteps.map((step, stepIndex) => (
              <Card key={step.id} className="border-l-4 border-l-green-400">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      Part {stepIndex + 1}
                    </Badge>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {step.actions.map((action, actionIndex) => (
                    <div key={action.id} className="border rounded p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">Daily Action {actionIndex + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500"
                          onClick={() => removeAction(step.id, action.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          placeholder="e.g., Stand up and walk 5 steps to the door"
                          value={action.title}
                          onChange={(e) => updateAction(step.id, action.id, 'title', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="border rounded px-3 py-2 text-sm"
                            value={action.timing}
                            onChange={(e) => updateAction(step.id, action.id, 'timing', e.target.value)}
                          >
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="evening">Evening</option>
                          </select>
                          <Input
                            type="number"
                            placeholder="Duration (min)"
                            value={action.duration}
                            onChange={(e) => updateAction(step.id, action.id, 'duration', parseInt(e.target.value) || 5)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addActionToStep(step.id)}
                    className="w-full border-dashed"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Daily Action
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!canProceed()}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        )}
      </div>
    </div>
  );
}
