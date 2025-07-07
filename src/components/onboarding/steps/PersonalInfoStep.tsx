
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { personalInfoSchema, PersonalInfoFormValues } from "./personal-info/personalInfoSchema";
import { PersonalInfoFormFields } from "./personal-info/PersonalInfoFormFields";
import { AccountRecoveryInfo } from "./personal-info/AccountRecoveryInfo";

export type { PersonalInfoFormValues };

interface PersonalInfoStepProps {
  onComplete: (values: PersonalInfoFormValues) => void;
  initialValues?: PersonalInfoFormValues;
}

export const PersonalInfoStep = ({ onComplete, initialValues }: PersonalInfoStepProps) => {
  const { user } = useAuth();
  
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialValues || {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
      password: "",
    },
    mode: "onChange", 
  });

  // Auto-populate form with authenticated user data
  useEffect(() => {
    if (user && !initialValues) {
      console.log("PersonalInfoStep: Auto-populating with authenticated user data");
      form.setValue("name", user.user_metadata?.name || user.email?.split('@')[0] || "");
      form.setValue("email", user.email || "");
      form.setValue("password", ""); // Don't show password for existing users
    }
  }, [user, initialValues, form]);

  const handleSubmit = (values: PersonalInfoFormValues) => {
    console.log("PersonalInfoStep: Form submitted, user is already authenticated");
    onComplete(values);
  };

  // If user is authenticated, show a simplified view
  if (user) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-800">Account Verified</h3>
            <p className="text-green-600">
              Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}!
            </p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Your Account Details</h4>
          <div className="space-y-2 text-sm text-green-700">
            <p><strong>Name:</strong> {user.user_metadata?.name || "Not provided"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> Authenticated ✓</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            onClick={() => handleSubmit({
              name: user.user_metadata?.name || user.email?.split('@')[0] || "",
              email: user.email || "",
              password: ""
            })}
            className="gap-2"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Fallback form for unauthenticated users (shouldn't happen with auth gate, but just in case)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You should be authenticated before reaching this step. 
            If you see this form, please refresh the page or return to the beginning of the onboarding process.
          </p>
        </div>
        
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
