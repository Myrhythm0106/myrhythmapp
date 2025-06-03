
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  securityQuestion1: z.string().min(1, "Please select a security question"),
  securityAnswer1: z.string().min(2, "Answer must be at least 2 characters"),
  securityQuestion2: z.string().min(1, "Please select a second security question"),
  securityAnswer2: z.string().min(2, "Answer must be at least 2 characters"),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  onComplete: (values: PersonalInfoFormValues) => void;
  initialValues?: PersonalInfoFormValues;
}

const securityQuestions = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your elementary school?",
  "What is the name of the street you grew up on?",
  "What was your childhood nickname?",
  "What is your favorite book?",
  "What was the make of your first car?",
  "What city were you born in?",
];

export const PersonalInfoStep = ({ onComplete, initialValues }: PersonalInfoStepProps) => {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      password: "",
      securityQuestion1: "",
      securityAnswer1: "",
      securityQuestion2: "",
      securityAnswer2: "",
    },
    mode: "onChange", 
  });

  const watchedSecurityQuestion1 = form.watch("securityQuestion1");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onComplete)} className="space-y-4">
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

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-medium text-muted-foreground">Security Questions (Required for Password Recovery)</h3>
          
          <FormField
            control={form.control}
            name="securityQuestion1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Security Question</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a security question" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {securityQuestions.map((question, index) => (
                      <SelectItem key={index} value={question}>
                        {question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="securityAnswer1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your answer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="securityQuestion2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Second Security Question</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a different security question" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {securityQuestions
                      .filter(question => question !== watchedSecurityQuestion1)
                      .map((question, index) => (
                        <SelectItem key={index} value={question}>
                          {question}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="securityAnswer2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your answer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
