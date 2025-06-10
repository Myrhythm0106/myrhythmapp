
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Target, Plus, Trash2, CheckCircle2, Lightbulb, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Action {
  id: string;
  title: string;
  description: string;
  timing: string;
  duration: number;
}

interface Measure {
  id: string;
  description: string;
  type: 'checkbox' | 'numeric' | 'milestone';
  target?: string;
}

interface EnhancedGoalCreationWizardProps {
  onComplete: () => void;
  focusArea?: string;
}

export function EnhancedGoalCreationWizard({ onComplete, focusArea }: EnhancedGoalCreationWizardProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState({
    title: "",
    category: focusArea || "",
    description: "",
    timeline: "",
    actions: [] as Action[],
    measures: [] as Measure[]
  });

  const categories = [
    { id: "independence", label: "Independence", color: "bg-blue-100 text-blue-800", description: "Daily living skills and autonomy" },
    { id: "cognitive", label: "Cognitive", color: "bg-purple-100 text-purple-800", description: "Memory, focus, and thinking skills" },
    { id: "emotional", label: "Emotional", color: "bg-pink-100 text-pink-800", description: "Mood, stress, and emotional wellbeing" },
    { id: "physical", label: "Physical", color: "bg-green-100 text-green-800", description: "Strength, mobility, and health" },
    { id: "social", label: "Social", color: "bg-orange-100 text-orange-800", description: "Relationships and community connection" }
  ];

  const timelines = [
    { id: "daily", label: "Daily Practice", description: "Something to do every day", example: "Take a 5-minute walk" },
    { id: "weekly", label: "Weekly Goal", description: "Achieve within a week", example: "Organize my medicine cabinet" },
    { id: "monthly", label: "Monthly Goal", description: "Achieve within a month", example: "Walk to the mailbox independently" },
    { id: "long-term", label: "Long-term Goal", description: "Achieve within 3-6 months", example: "Return to driving short distances" }
  ];

  const addAction = () => {
    const newAction: Action = {
      id: `action-${Date.now()}`,
      title: "",
      description: "",
      timing: "morning",
      duration: 5
    };
    setGoalData(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const updateAction = (actionId: string, field: string, value: any) => {
    setGoalData(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId ? { ...action, [field]: value } : action
      )
    }));
  };

  const removeAction = (actionId: string) => {
    setGoalData(prev => ({
      ...prev,
      actions: prev.actions.filter(action => action.id !== actionId)
    }));
  };

  const addMeasure = () => {
    const newMeasure: Measure = {
      id: `measure-${Date.now()}`,
      description: "",
      type: 'checkbox'
    };
    setGoalData(prev => ({
      ...prev,
      measures: [...prev.measures, newMeasure]
    }));
  };

  const updateMeasure = (measureId: string, field: string, value: any) => {
    setGoalData(prev => ({
      ...prev,
      measures: prev.measures.map(measure =>
        measure.id === measureId ? { ...measure, [field]: value } : measure
      )
    }));
  };

  const removeMeasure = (measureId: string) => {
    setGoalData(prev => ({
      ...prev,
      measures: prev.measures.filter(measure => measure.id !== measureId)
    }));
  };

  const handleComplete = () => {
    console.log("Enhanced Goal created:", goalData);
    
    toast.success("Goal Created Successfully! 🎉", {
      description: "Your goal with actions and measures has been saved!",
      duration: 4000
    });
    
    onComplete();
    navigate("/dashboard");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return goalData.title && goalData.category;
      case 2:
        return goalData.description && goalData.timeline;
      case 3:
        return goalData.actions.length > 0 && goalData.actions.every(action => action.title);
      case 4:
        return goalData.measures.length > 0 && goalData.measures.every(measure => measure.description);
      default:
        return false;
    }
  };

  const progress = (currentStep / 4) * 100;

  const getStepExamples = () => {
    const selectedCategory = categories.find(cat => cat.id === goalData.category);
    const categoryName = selectedCategory?.label || "your category";
    
    switch (currentStep) {
      case 1:
        return {
          title: "Goal Examples",
          items: [
            "Walk to the mailbox by myself",
            "Read a complete book",
            "Cook a simple meal independently",
            "Have a 10-minute conversation with a friend"
          ]
        };
      case 2:
        return {
          title: "Why This Matters",
          items: [
            "Builds my confidence and independence",
            "Improves my cognitive abilities",
            "Helps me feel more connected to others",
            "Gives me a sense of accomplishment"
          ]
        };
      case 3:
        return {
          title: "Action Examples",
          items: [
            "Practice standing from chair (5 minutes)",
            "Walk to front door and back (daily)",
            "Do balance exercises (10 minutes)",
            "Celebrate small progress (daily)"
          ]
        };
      case 4:
        return {
          title: "Measure Examples",
          items: [
            "Can walk 50 feet without assistance",
            "Completes walk in under 3 minutes",
            "Feels confident during the walk",
            "No longer needs to rest halfway"
          ]
        };
      default:
        return { title: "", items: [] };
    }
  };

  const examples = getStepExamples();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-3" />
        
        <div className="flex justify-between">
          {["Goal", "Why", "Actions", "Measures"].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              <span className="text-xs mt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Define Your Goal */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  What Am I Aiming For?
                </CardTitle>
                <p className="text-muted-foreground">Define a clear, meaningful goal that matters to you</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">My Goal Is...</label>
                  <Input
                    placeholder="e.g., Walk to the mailbox by myself"
                    value={goalData.title}
                    onChange={(e) => setGoalData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Keep it specific and achievable. What would success look like?
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((category) => (
                      <Card
                        key={category.id}
                        className={`cursor-pointer border-2 transition-all ${
                          goalData.category === category.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setGoalData(prev => ({ ...prev, category: category.id }))}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <Badge className={category.color}>{category.label}</Badge>
                              <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                            </div>
                            {goalData.category === category.id && (
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

          {/* Step 2: Why This Matters */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Why Does This Matter to Me?
                </CardTitle>
                <p className="text-muted-foreground">Understanding your 'why' will keep you motivated</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Why is this goal important to you?</label>
                  <Textarea
                    placeholder="Describe why achieving this goal matters to you personally..."
                    value={goalData.description}
                    onChange={(e) => setGoalData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Think about how this will improve your daily life, confidence, or independence.
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">When do you want to achieve this?</label>
                  <div className="space-y-3">
                    {timelines.map((timeline) => (
                      <Card
                        key={timeline.id}
                        className={`cursor-pointer border ${
                          goalData.timeline === timeline.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setGoalData(prev => ({ ...prev, timeline: timeline.id }))}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{timeline.label}</p>
                              <p className="text-sm text-muted-foreground">{timeline.description}</p>
                              <p className="text-xs text-muted-foreground italic">Example: {timeline.example}</p>
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

          {/* Step 3: Actions */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  What Steps Do I Need to Take?
                </CardTitle>
                <p className="text-muted-foreground">Break your goal into specific, actionable steps</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {goalData.actions.map((action, index) => (
                  <Card key={action.id} className="border-l-4 border-l-orange-400">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className="bg-orange-100 text-orange-800">
                          Action {index + 1}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => removeAction(action.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <Input
                          placeholder="e.g., Practice standing from chair"
                          value={action.title}
                          onChange={(e) => updateAction(action.id, 'title', e.target.value)}
                        />
                        <Textarea
                          placeholder="Describe this action in more detail..."
                          value={action.description}
                          onChange={(e) => updateAction(action.id, 'description', e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            className="border rounded px-3 py-2 text-sm"
                            value={action.timing}
                            onChange={(e) => updateAction(action.id, 'timing', e.target.value)}
                          >
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="evening">Evening</option>
                            <option value="flexible">Flexible</option>
                          </select>
                          <Input
                            type="number"
                            placeholder="Duration (min)"
                            value={action.duration}
                            onChange={(e) => updateAction(action.id, 'duration', parseInt(e.target.value) || 5)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addAction}
                  className="w-full border-dashed border-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Action
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Measures */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  How Do I Know I've Achieved It?
                </CardTitle>
                <p className="text-muted-foreground">Define clear success criteria so you'll know when you've won</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {goalData.measures.map((measure, index) => (
                  <Card key={measure.id} className="border-l-4 border-l-green-400">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className="bg-green-100 text-green-800">
                          Success Measure {index + 1}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => removeMeasure(measure.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <Input
                          placeholder="e.g., Can walk 50 feet without assistance"
                          value={measure.description}
                          onChange={(e) => updateMeasure(measure.id, 'description', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            className="border rounded px-3 py-2 text-sm"
                            value={measure.type}
                            onChange={(e) => updateMeasure(measure.id, 'type', e.target.value)}
                          >
                            <option value="checkbox">Yes/No Achievement</option>
                            <option value="numeric">Measurable Number</option>
                            <option value="milestone">Milestone Reached</option>
                          </select>
                          {measure.type === 'numeric' && (
                            <Input
                              placeholder="Target (e.g., 50 feet, 3 minutes)"
                              value={measure.target || ''}
                              onChange={(e) => updateMeasure(measure.id, 'target', e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addMeasure}
                  className="w-full border-dashed border-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Success Measure
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar with Examples */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                {examples.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {examples.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              {currentStep === 1 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Tip:</strong> Make your goal specific and personal. Instead of "exercise more," try "walk to the mailbox by myself."
                  </p>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-700">
                    💡 <strong>Tip:</strong> Start with small, manageable actions. You can always add more later as you build confidence.
                  </p>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700">
                    💡 <strong>Tip:</strong> Good measures are specific and observable. Others should be able to tell when you've achieved them.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
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
            className="bg-primary hover:bg-primary/90"
          >
            Next Step
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!canProceed()}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Create My Goal
          </Button>
        )}
      </div>
    </div>
  );
}
