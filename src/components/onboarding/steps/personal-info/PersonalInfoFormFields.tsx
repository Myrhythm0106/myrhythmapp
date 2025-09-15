
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { UseFormReturn } from "react-hook-form";
import { PersonalInfoFormValues } from "./personalInfoSchema";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonalInfoFormFieldsProps {
  form: UseFormReturn<PersonalInfoFormValues>;
  isFreemium?: boolean;
  onToggleMode?: () => void;
}

export const PersonalInfoFormFields = ({ form, isFreemium = true, onToggleMode }: PersonalInfoFormFieldsProps) => {
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
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Age <span className="text-muted-foreground text-sm">(optional)</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter your age" 
                min="13" 
                max="120"
                {...field} 
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-muted-foreground">
              This helps us provide more personalized recommendations
            </p>
          </FormItem>
        )}
      />

      {!isFreemium && (
        <>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput 
                    placeholder="Create a password" 
                    value={field.value || ""}
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
                    value={field.value || ""}
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
      )}

      {isFreemium && onToggleMode && (
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Want to create a secure account with full features?
          </p>
          <Button 
            type="button" 
            variant="link" 
            size="sm" 
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80"
          >
            Create Premium Account Instead
          </Button>
        </div>
      )}

      {!isFreemium && onToggleMode && (
        <div className="text-center">
          <Button 
            type="button" 
            variant="link" 
            size="sm" 
            onClick={onToggleMode}
            className="text-muted-foreground hover:text-foreground"
          >
            Start with Quick Registration Instead
          </Button>
        </div>
      )}
    </>
  );
};
