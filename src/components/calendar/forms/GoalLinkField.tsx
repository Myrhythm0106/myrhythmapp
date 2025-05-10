
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { Link, Target, Book, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample data - in a real app, this would come from an API or context
const sampleGoals = [
  { id: "g1", title: "Improve memory skills", type: "cognitive" },
  { id: "g2", title: "Maintain regular therapy sessions", type: "health" },
  { id: "g3", title: "Reduce anxiety levels", type: "health" },
  { id: "g4", title: "Walk for 15 mins daily", type: "mobility" }
];

interface GoalLinkFieldProps {
  preselectedGoalId?: string;
}

export function GoalLinkField({ preselectedGoalId }: GoalLinkFieldProps) {
  const { control, setValue } = useFormContext();
  
  React.useEffect(() => {
    if (preselectedGoalId) {
      setValue('goalId', preselectedGoalId);
    }
  }, [preselectedGoalId, setValue]);

  const getGoalIcon = (type: string) => {
    switch(type) {
      case "mobility":
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case "cognitive":
        return <Book className="h-4 w-4 text-purple-500" />;
      default:
        return <Target className="h-4 w-4 text-green-500" />;
    }
  };

  const getGoalTypeStyles = (type: string) => {
    switch (type) {
      case "mobility":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cognitive":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "health":
        return "bg-green-50 text-green-700 border-green-200";
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
          <FormLabel className="flex items-center">
            <Link className="h-4 w-4 mr-1" />
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
                    <span className="flex items-center gap-2">
                      {getGoalIcon(goal.type)}
                      <span>{goal.title}</span>
                      <Badge className={cn("text-xs ml-auto", getGoalTypeStyles(goal.type))}>
                        {goal.type}
                      </Badge>
                    </span>
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
