
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Form } from "@/components/ui/form";
import { personalInfoSchema, PersonalInfoFormValues } from "./personal-info/personalInfoSchema";
import { PersonalInfoFormFields } from "./personal-info/PersonalInfoFormFields";
import { AccountRecoveryInfo } from "./personal-info/AccountRecoveryInfo";

export type { PersonalInfoFormValues };

interface PersonalInfoStepProps {
  onComplete: (values: PersonalInfoFormValues) => void;
  initialValues?: PersonalInfoFormValues;
}

export const PersonalInfoStep = ({ onComplete, initialValues }: PersonalInfoStepProps) => {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange", 
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onComplete)} className="space-y-4">
        <PersonalInfoFormFields form={form} />
        <AccountRecoveryInfo />
        
        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            className="gap-2"
            disabled={!form.formState.isValid}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
