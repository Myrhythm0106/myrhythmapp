
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { Link, Target, Book, ArrowRight, Brain, Heart, Users, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample data - in a real app, this would come from an API or context
const sampleGoals = [
  { id: "g1", title: "Improve memory skills", type: "cognitive" },
  { id: "g2", title: "Walk to mailbox independently", type: "physical" },
  { id: "g3", title: "Reduce anxiety levels", type: "emotional" },
  { id: "g4", title: "Connect with family weekly", type: "social" }
];

interface GoalLinkFieldProps {
  preselectedGoalId?: string;
}

export function GoalLinkField({ preselectedGoalId }: GoalLinkFieldProps) {
  const { control, setValue, watch } = useFormContext();
  const isGoal = watch('isGoal');
  
  React.useEffect(() => {
    if (preselectedGoalId) {
      setValue('goalId', preselectedGoalId);
    }
  }, [preselectedGoalId, setValue]);

  // Don't show this field if creating a goal
  if (isGoal) return null;

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

  return (
    <FormField
      control={control}
      name="goalId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Link to Goal
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a goal to link this action to (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground">Not linked to any goal</span>
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
        </FormItem>
      )}
    />
  );
}
