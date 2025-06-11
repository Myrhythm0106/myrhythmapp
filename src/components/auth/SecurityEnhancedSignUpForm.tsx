
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EnhancedPasswordInput } from "./EnhancedPasswordInput";
import { validatePassword, enhancedPasswordSchema } from "@/utils/auth/enhancedPasswordValidation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Mail, User, Shield } from "lucide-react";

const signUpSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: enhancedPasswordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SecurityEnhancedSignUpForm() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    
    try {
      // Additional password validation
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        setError("password", { 
          message: passwordValidation.errors[0] 
        });
        return;
      }

      await signUp(data.email, data.password, data.name.trim());
      
      toast.success("Account created successfully! Please check your email to verify your account.");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        </div>
        <CardDescription>
          Create your secure MyRhythm account with enhanced protection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <EnhancedPasswordInput
            value={password}
            onChange={(value) => {
              setPassword(value);
              setValue("password", value, { shouldValidate: true });
            }}
            label="Password"
            placeholder="Create a strong password"
            showStrengthIndicator={true}
            required={true}
            error={errors.password?.message}
          />

          <EnhancedPasswordInput
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              setValue("confirmPassword", value, { shouldValidate: true });
            }}
            label="Confirm Password"
            placeholder="Confirm your password"
            showStrengthIndicator={false}
            required={true}
            error={errors.confirmPassword?.message}
          />

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your account will be protected with industry-standard encryption and security measures.
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Create Secure Account
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
