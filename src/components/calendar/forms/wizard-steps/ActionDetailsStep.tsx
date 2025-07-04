
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFormContext } from 'react-hook-form';
import { MapPin, Clock, Link, Target, Brain, Heart, Users, Activity, Lightbulb, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample goals data - in a real app, this would come from an API
const sampleGoals = [
  { id: "g1", title: "Improve memory skills", type: "cognitive" },
  { id: "g2", title: "Walk to mailbox independently", type: "physical" },
  { id: "g3", title: "Reduce anxiety levels", type: "emotional" },
  { id: "g4", title: "Connect with family weekly", type: "social" }
];

interface ActionDetailsStepProps {
  preselectedGoalId?: string;
}

export function ActionDetailsStep({ preselectedGoalId }: ActionDetailsStepProps) {
  const { control, watch, setValue } = useFormContext();
  const isGoal = watch('isGoal');
  const actionType = watch('type');
  
  React.useEffect(() => {
    if (preselectedGoalId) {
      setValue('goalId', preselectedGoalId);
    }
  }, [preselectedGoalId, setValue]);

  const getGoalIcon = (type: string) => {
    switch(type) {
      case "physical":
        return <Activity className="h-4 w-4 text-clarity-teal-500" />;
      case "cognitive":
        return <Brain className="h-4 w-4 text-memory-emerald-500" />;
      case "emotional":
        return <Heart className="h-4 w-4 text-brain-health-500" />;
      case "social":
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Target className="h-4 w-4 text-green-500" />;
    }
  };

  const getGoalTypeStyles = (type: string) => {
    switch (type) {
      case "physical":
        return "bg-clarity-teal-50 text-clarity-teal-700 border-clarity-teal-200";
      case "cognitive":
        return "bg-memory-emerald-50 text-memory-emerald-700 border-memory-emerald-200";
      case "emotional":
        return "bg-brain-health-50 text-brain-health-700 border-brain-health-200";
      case "social":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getExplanationPrompts = () => {
    switch (actionType) {
      case 'daily_win':
        return [
          "This will help me feel accomplished because...",
          "This is important for my confidence because...",
          "Completing this will give me energy to..."
        ];
      case 'therapy':
        return [
          "This helps my recovery by...",
          "I expect to work on...",
          "This supports my goal of..."
        ];
      case 'gym':
      case 'steps':
        return [
          "This physical activity helps me...",
          "I'm working toward being able to...",
          "This strengthens my..."
        ];
      case 'meeting':
        return [
          "Connecting with others helps me...",
          "This person/group supports me by...",
          "This social connection is important because..."
        ];
      default:
        return [
          "This activity is meaningful because...",
          "Completing this will help me...",
          "This supports my wellbeing by..."
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Helper Card */}
      <Card className="bg-gradient-to-r from-brain-health-50 to-purple-50 border-brain-health-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-brain-health-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-brain-health-800 mb-1">
                Add Context & Connection
              </p>
              <p className="text-sm text-brain-health-700">
                Adding details helps your brain prepare and connects this action to your bigger goals.
                This information also helps your support team understand how to best encourage you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* End Time and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-clarity-teal-500" />
                When will you finish? (Optional)
              </FormLabel>
              <FormControl>
                <Input type="time" className="p-3" {...field} />
              </FormControl>
              <p className="text-sm text-gray-600">
                This helps with planning and energy management
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How long will this take? (Minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g., 30" 
                  className="p-3"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <p className="text-sm text-gray-600">
                Knowing the duration helps prevent overwhelm
              </p>
            </FormItem>
          )}
        />
      </div>

      {/* Location */}
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-clarity-teal-500" />
              Where will this happen? (Optional)
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Home gym, Doctor's office, Local park" 
                className="p-3"
                {...field} 
              />
            </FormControl>
            <p className="text-sm text-gray-600">
              Knowing the location helps with mental preparation
            </p>
          </FormItem>
        )}
      />

      {/* Action Explanation (formerly Notes) */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-base font-medium">
              <MessageSquare className="h-4 w-4 text-brain-health-500" />
              Why is this important to you?
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Explain why this matters to you and how it fits into your journey..."
                className="min-h-[100px] p-3"
                {...field} 
              />
            </FormControl>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                This helps your brain remember why this matters during challenging times
              </p>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Need inspiration? Try starting with:</p>
                <div className="flex flex-wrap gap-2">
                  {getExplanationPrompts().map((prompt, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="cursor-pointer hover:bg-brain-health-50 text-xs"
                      onClick={() => setValue('notes', prompt)}
                    >
                      {prompt}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </FormItem>
        )}
      />

      {/* Goal Linking */}
      {!isGoal && (
        <FormField
          control={control}
          name="goalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-base font-medium">
                <Link className="h-4 w-4 text-memory-emerald-500" />
                Does this connect to a bigger goal?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="p-3">
                    <SelectValue placeholder="Choose a goal this action supports (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-muted-foreground">This is a standalone action</span>
                    </SelectItem>
                    {sampleGoals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        <div className="flex items-center gap-2 w-full">
                          {getGoalIcon(goal.type)}
                          <span className="flex-1">{goal.title}</span>
                          <Badge className={cn("text-xs ml-2", getGoalTypeStyles(goal.type))}>
                            {goal.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <p className="text-sm text-gray-600">
                Linking to goals helps track progress and builds momentum
              </p>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
