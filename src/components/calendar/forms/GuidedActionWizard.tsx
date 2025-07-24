
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Clock, Zap, Heart, Brain, Info, Lightbulb } from "lucide-react";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { toast } from "sonner";
import { WatchersField } from "./WatchersField";

interface GuidedActionWizardProps {
  onSuccess: (actionData: any) => void;
  onUpgradeClick: () => void;
  preFilledData?: {
    date?: string;
    time?: string;
    watchers?: string[];
  };
}

export function GuidedActionWizard({ 
  onSuccess, 
  onUpgradeClick,
  preFilledData 
}: GuidedActionWizardProps) {
  const { createAction, loading } = useDailyActions();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: preFilledData?.date || new Date().toISOString().split('T')[0],
    time: preFilledData?.time || '',
    duration: '30',
    difficulty: '1',
    category: 'personal',
    energyLevel: '2',
    watchers: preFilledData?.watchers || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const actionData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        start_time: formData.time || null,
        duration_minutes: parseInt(formData.duration),
        difficulty_level: parseInt(formData.difficulty),
        action_type: 'regular' as const,
        focus_area: 'cognitive' as const,
        status: 'pending' as const
      };

      const newAction = await createAction(actionData);
      
      if (newAction) {
        toast.success("🎯 Brain-Friendly Action Created!", {
          description: `${formData.title} scheduled for ${new Date(formData.date).toLocaleDateString()}. Your brain will thank you for this thoughtful planning!`,
          duration: 5000
        });
        onSuccess(newAction);
      }
    } catch (error) {
      toast.error("Failed to create action", {
        description: "Please try again or contact support if the issue persists."
      });
    }
  };

  const categories = [
    { value: 'health', label: 'Health & Wellness', icon: Heart },
    { value: 'personal', label: 'Personal Growth', icon: Zap },
    { value: 'work', label: 'Work & Focus', icon: Target },
    { value: 'family', label: 'Family & Social', icon: Heart },
    { value: 'rest', label: 'Rest & Recovery', icon: Clock }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Action Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="What would you like to accomplish?"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add any details or notes..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brain-purple-500" />
              Duration (minutes)
              <div className="group relative">
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-popover border rounded-md p-2 text-xs shadow-md z-10 w-48">
                  <p className="font-medium text-brain-purple-600">🧠 Why we ask:</p>
                  <p>Duration helps us match this activity to your natural energy cycles and cognitive rhythms for optimal brain performance.</p>
                </div>
              </div>
            </Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes - Quick boost</SelectItem>
                <SelectItem value="30">30 minutes - Focused session</SelectItem>
                <SelectItem value="45">45 minutes - Deep work</SelectItem>
                <SelectItem value="60">1 hour - Comprehensive</SelectItem>
                <SelectItem value="90">1.5 hours - Extended focus</SelectItem>
                <SelectItem value="120">2 hours - Marathon session</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="difficulty" className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-clarity-teal-500" />
              Cognitive Load
              <div className="group relative">
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-popover border rounded-md p-2 text-xs shadow-md z-10 w-48">
                  <p className="font-medium text-clarity-teal-600">🎯 Why we ask:</p>
                  <p>This helps us suggest optimal times based on your cognitive patterns and energy levels for maximum success.</p>
                </div>
              </div>
            </Label>
            <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Light - Minimal mental energy</SelectItem>
                <SelectItem value="2">Moderate - Some concentration needed</SelectItem>
                <SelectItem value="3">Intensive - Peak mental focus required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Category</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.value}
                  type="button"
                  variant={formData.category === category.value ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="energyLevel" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-energy-amber-500" />
            Energy Requirements
            <div className="group relative">
              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-popover border rounded-md p-2 text-xs shadow-md z-10 w-48">
                <p className="font-medium text-energy-amber-600">⚡ Why we ask:</p>
                <p>We'll match this to your natural energy rhythms and suggest the best times when you'll feel most capable and motivated.</p>
              </div>
            </div>
          </Label>
          <Select value={formData.energyLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, energyLevel: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Gentle - Perfect for low-energy moments</SelectItem>
              <SelectItem value="2">Moderate - Balanced energy needed</SelectItem>
              <SelectItem value="3">Energetic - Best when you're feeling strong</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <WatchersField />
        </div>

        <Card className="bg-gradient-to-r from-brain-purple-50 to-clarity-teal-50 border-brain-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-brain-purple-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-brain-purple-800">🧠 Brain Health Impact</h4>
                <p className="text-sm text-brain-purple-700">
                  By scheduling this thoughtfully, you're building neural pathways that support better planning, follow-through, and cognitive resilience. Each completed action strengthens your brain's executive function!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-6">
        <Button 
          type="submit" 
          className="w-full sm:flex-1 bg-gradient-to-r from-brain-purple-600 to-clarity-teal-600 hover:from-brain-purple-700 hover:to-clarity-teal-700 min-h-[44px] text-white" 
          disabled={loading}
        >
          <Target className="h-4 w-4 mr-2" />
          {loading ? "Creating..." : "Save & Continue"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onUpgradeClick}
          className="w-full sm:w-auto min-h-[44px] text-foreground"
        >
          Save & Close
        </Button>
      </div>
    </form>
  );
}
