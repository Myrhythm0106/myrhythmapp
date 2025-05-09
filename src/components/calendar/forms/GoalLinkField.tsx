
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { Link, Target } from 'lucide-react';

// Sample data - in a real app, this would come from an API or context
const sampleGoals = [
  { id: "g1", title: "Improve memory skills", type: "weekly" },
  { id: "g2", title: "Maintain regular therapy sessions", type: "monthly" },
  { id: "g3", title: "Reduce anxiety levels", type: "long-term" }
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
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1 text-muted-foreground" />
                      {goal.title}
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
