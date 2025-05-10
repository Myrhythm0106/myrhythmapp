
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().optional(),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  onSubmit: (values: PersonalInfoFormValues) => void;
  onBack: () => void;
}

const PersonalInfoForm = ({ onSubmit, onBack }: PersonalInfoFormProps) => {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      location: "",
    },
    mode: "onChange", // Enable validation on change for auto-submission
  });

  // Add effect to auto-submit when all fields are valid
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Only check for auto-submission when fields change, not on initial load
      if (type === "change" && form.formState.isValid && Object.keys(form.formState.dirtyFields).length >= 3) {
        // Check if the required fields are filled
        const { name, email, password } = form.getValues();
        if (name && email && password) {
          // Small delay to allow the user to see the field is valid before auto-submitting
          const timer = setTimeout(() => {
            handleSubmit(form.getValues());
          }, 500);
          
          return () => clearTimeout(timer);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.formState.isValid]);

  const handleSubmit = (values: PersonalInfoFormValues) => {
    // Store user credentials in localStorage for the login functionality
    localStorage.setItem("myrhythm_name", values.name);
    localStorage.setItem("myrhythm_email", values.email);
    localStorage.setItem("myrhythm_password", values.password);
    
    // Call the parent component's onSubmit
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Location (optional)</FormLabel>
              <FormControl>
                <Input placeholder="City, State (e.g., Dallas, TX)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-4 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button type="submit" className="gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInfoForm;
