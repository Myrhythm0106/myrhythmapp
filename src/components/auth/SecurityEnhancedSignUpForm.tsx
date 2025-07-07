
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle, CheckCircle, Shield, Brain } from "lucide-react";
import { EnhancedPasswordInput } from "./EnhancedPasswordInput";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SecurityEnhancedSignUpFormProps {
  onSignUpSuccess?: (email: string) => void;
}

export const SecurityEnhancedSignUpForm = ({ onSignUpSuccess }: SecurityEnhancedSignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("SecurityEnhancedSignUpForm: Starting signup process");
      
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name
          }
          // NOTE: Removed emailRedirectTo to skip email confirmation for immediate launch
          // This allows users to sign up and use the app immediately
        }
      });

      if (error) {
        console.error("SecurityEnhancedSignUpForm: Signup error:", error);
        
        if (error.message.includes("User already registered")) {
          setErrorMessage("An account with this email already exists. Please sign in instead.");
        } else if (error.message.includes("Invalid email")) {
          setErrorMessage("Please enter a valid email address.");
        } else if (error.message.includes("Password")) {
          setErrorMessage("Password does not meet security requirements.");
        } else {
          setErrorMessage(error.message || "Failed to create account. Please try again.");
        }
        return;
      }

      if (signUpData.user) {
        console.log("SecurityEnhancedSignUpForm: Signup successful");
        
        // Since we're not requiring email confirmation, the user can proceed immediately
        setSuccessMessage("Account created successfully! You can now start using MyRhythm.");
        toast.success("Welcome to MyRhythm! Your account is ready to use.");
        
        if (onSignUpSuccess) {
          onSignUpSuccess(data.email);
        }
        
        // Small delay to show success message, then proceed to onboarding
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 2000);
      }
    } catch (error) {
      console.error("SecurityEnhancedSignUpForm: Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold">Join MyRhythm</CardTitle>
        </div>
        <CardDescription className="text-base">
          Create your secure account to begin your cognitive wellness journey
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
              disabled={isLoading}
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <EnhancedPasswordInput
              id="password"
              placeholder="Create a secure password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <EnhancedPasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
              disabled={isLoading}
              autoComplete="new-password"
              showStrengthIndicator={false}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
            {password && confirmPassword && password === confirmPassword && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Passwords match</span>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Create Secure Account
              </div>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          <p className="flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Your account is ready to use immediately - no email confirmation required
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
