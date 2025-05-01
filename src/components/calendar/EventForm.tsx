
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
import { FormActions } from "./forms/FormActions";
import { actionFormSchema, ActionFormValues, defaultActionValues } from "./forms/actionFormSchema";

export function EventForm() {
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: defaultActionValues,
  });

  function onSubmit(values: ActionFormValues) {
    toast.success("Action added successfully!");
    console.log(values);
  }

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
              <ReminderSelect />
              <WatchersField />
            </div>
          </ScrollArea>
          <FormActions isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </FormProvider>
  );
}
