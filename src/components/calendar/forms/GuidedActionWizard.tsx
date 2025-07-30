
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Clock, Zap, Heart, Brain, Info, Lightbulb } from "lucide-react";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { toast } from "sonner";
import { WatchersField } from "./WatchersField";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actionFormSchema, type ActionFormValues, defaultActionValues } from "./actionFormSchema";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useDataTransfer } from "@/hooks/useDataTransfer";

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
  const { transferData } = useDataTransfer();
  
  // Use transferred data if available, fall back to preFilledData
  const selectedDate = transferData.selectedDate ? 
    new Date(transferData.selectedDate).toISOString().split('T')[0] : 
    preFilledData?.date || new Date().toISOString().split('T')[0];
  
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      ...defaultActionValues,
      date: selectedDate,
      startTime: transferData.selectedTime || preFilledData?.time || '',
      watchers: preFilledData?.watchers || []
    }
  });

  const handleSubmit = async (data: ActionFormValues) => {
    try {
      const actionData = {
        title: data.title,
        description: data.description || '',
        date: data.date,
        start_time: data.startTime || null,
        duration_minutes: data.duration || 30,
        difficulty_level: 1, // Default difficulty
        action_type: 'regular' as const,
        focus_area: 'cognitive' as const,
        status: 'pending' as const
      };

      const newAction = await createAction(actionData);
      
      if (newAction) {
        toast.success("🎯 Brain-Friendly Action Created!", {
          description: `${data.title} scheduled for ${new Date(data.date).toLocaleDateString()}. Your brain will thank you for this thoughtful planning!`,
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
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action Title</FormLabel>
                <FormControl>
                  <Input placeholder="What would you like to accomplish?" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any details or notes..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
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
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <Select value={field.value?.toString() || "30"} onValueChange={(value) => field.onChange(parseInt(value))}>
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
                )}
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
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
              <FormField
                control={form.control}
                name="cognitiveLoad"
                render={({ field }) => (
                  <Select value={field.value?.toString() || "2"} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Light - Minimal mental energy</SelectItem>
                      <SelectItem value="2">Moderate - Some concentration needed</SelectItem>
                      <SelectItem value="3">Intensive - Peak mental focus required</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = field.value === category.value;
                    return (
                      <Button
                        key={category.value}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => field.onChange(category.value)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              </FormItem>
            )}
          />

          <div>
            <Label className="flex items-center gap-2">
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
            <FormField
              control={form.control}
              name="energyLevel"
              render={({ field }) => (
                <Select value={field.value?.toString() || "2"} onValueChange={(value) => field.onChange(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Gentle - Perfect for low-energy moments</SelectItem>
                    <SelectItem value="2">Moderate - Balanced energy needed</SelectItem>
                    <SelectItem value="3">Energetic - Best when you're feeling strong</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <WatchersField />

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
          {loading ? "Creating your action..." : "Create Action"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => form.reset()}
          className="w-full sm:w-auto min-h-[44px] text-foreground"
        >
          Clear Form
        </Button>
        </div>
      </form>
    </FormProvider>
  );
}
