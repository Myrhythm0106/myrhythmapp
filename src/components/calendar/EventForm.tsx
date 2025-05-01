
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ActionTitleField />
          <ActionTypeSelect />
          <DateTimeFields />
          <LocationField />
          <NotesField />
          <ReminderSelect />
          <WatchersField />
          <FormActions isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </FormProvider>
  );
}
