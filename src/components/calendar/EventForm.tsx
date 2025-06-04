
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionTitleField } from "./forms/ActionTitleField";
import { ActionTypeSelect } from "./forms/ActionTypeSelect";
import { DateTimeFields } from "./forms/DateTimeFields";
import { LocationField } from "./forms/LocationField";
import { NotesField } from "./forms/NotesField";
import { ReminderSelect } from "./forms/ReminderSelect";
import { WatchersField } from "./forms/WatchersField";
import { GoalLinkField } from "./forms/GoalLinkField";
import { FormActions } from "./forms/FormActions";
import { MediaAttachment } from "./forms/MediaAttachment";
import { actionFormSchema, ActionFormValues, defaultActionValues } from "./forms/actionFormSchema";
import { useDailyActions } from "@/hooks/use-daily-actions";
import { format } from "date-fns";

interface EventFormProps {
  defaultTime?: string;
  goalId?: string;
  onSuccess?: () => void;
}

export function EventForm({ defaultTime, goalId, onSuccess }: EventFormProps = {}) {
  const { createAction, createGoal } = useDailyActions();
  
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      ...defaultActionValues,
      startTime: defaultTime || defaultActionValues.startTime,
      goalId: goalId || "none",
    },
  });

  async function onSubmit(values: ActionFormValues) {
    try {
      if (values.isGoal) {
        // Create a new goal with proper category mapping
        const goalCategory = values.type === 'therapy' ? 'health' : 
                           values.type === 'activity' ? 'personal' : 
                           values.type === 'cognitive' ? 'cognitive' :
                           values.type === 'social' ? 'social' :
                           values.type === 'mobility' ? 'mobility' : 'health';
                           
        await createGoal({
          title: values.title,
          description: values.notes || undefined,
          category: goalCategory,
          target_date: values.date ? new Date(values.date).toISOString().split('T')[0] : undefined
        });
      } else {
        // Create a new action with proper type mapping
        const actionData = {
          title: values.title,
          description: values.notes || undefined,
          action_type: values.type === 'daily_win' ? 'daily_win' as const : 
                      values.goalId && values.goalId !== "none" ? 'goal_linked' as const : 
                      'regular' as const,
          date: values.date ? format(new Date(values.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          start_time: values.startTime || undefined,
          duration_minutes: values.duration || undefined,
          is_daily_win: values.type === 'daily_win',
          goal_id: values.goalId && values.goalId !== "none" ? values.goalId : undefined,
          difficulty_level: values.type === 'daily_win' ? 1 : 2,
          focus_area: values.type === 'daily_win' ? 'emotional' as const : undefined
        };

        await createAction(actionData);
      }

      // Reset form
      form.reset();
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error creating action/goal:', error);
      toast.error('Failed to create action/goal');
    }
  }

  const isGoal = form.watch("isGoal");

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-[60vh]">
          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-6 pb-2">
              <ActionTitleField />
              <ActionTypeSelect />
              <DateTimeFields />
              <LocationField />
              <NotesField />
              <MediaAttachment />
              {!isGoal && <GoalLinkField preselectedGoalId={goalId} />}
              <ReminderSelect />
              <WatchersField />
            </div>
          </ScrollArea>
          <FormActions isSubmitting={form.formState.isSubmitting} mode={goalId ? "edit" : "add"} />
        </form>
      </Form>
    </FormProvider>
  );
}
