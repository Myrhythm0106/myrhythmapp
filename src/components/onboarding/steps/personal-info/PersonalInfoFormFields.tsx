
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { UseFormReturn } from "react-hook-form";
import { PersonalInfoFormValues } from "./personalInfoSchema";
import { CheckCircle } from "lucide-react";

interface PersonalInfoFormFieldsProps {
  form: UseFormReturn<PersonalInfoFormValues>;
}

export const PersonalInfoFormFields = ({ form }: PersonalInfoFormFieldsProps) => {
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput 
                placeholder="Create a password" 
                value={field.value}
                onChange={field.onChange}
                minLength={6}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <PasswordInput 
                placeholder="Confirm your password" 
                value={field.value}
                onChange={field.onChange}
                minLength={6}
              />
            </FormControl>
            <FormMessage />
            {passwordsMatch && (
              <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
                <CheckCircle className="h-4 w-4" />
                <span>Passwords match</span>
              </div>
            )}
          </FormItem>
        )}
      />
    </>
  );
};
