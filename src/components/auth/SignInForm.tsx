
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
import { sanitizeEmail } from "@/utils/security/inputSanitization";
import { createRateLimiter } from "@/utils/security/inputSanitization";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Mail, Shield, AlertTriangle } from "lucide-react";

const signInSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(1, "Password is required")
});

type SignInFormData = z.infer<typeof signInSchema>;

// Rate limiter: 5 attempts per 15 minutes
const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000);

export function SignInForm() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: SignInFormData) => {
    // Rate limiting check
    if (!loginRateLimiter(data.email)) {
      setRateLimited(true);
      toast.error("Too many login attempts. Please try again in 15 minutes.");
      return;
    }

    setIsLoading(true);
    setRateLimited(false);
    
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(data.email);
      
      await signIn(sanitizedEmail, data.password);
      toast.success("Welcome back to MyRhythm!");
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Enhanced error handling
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email and click the verification link before signing in.";
      } else if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      }
      
      toast.error(errorMessage);
      setError("password", { message: "" }); // Clear form without showing duplicate error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        </div>
        <CardDescription>
          Sign in to your secure MyRhythm account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {rateLimited && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Too many login attempts. Please wait 15 minutes before trying again.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="signin-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="signin-email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading || rateLimited}
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
            placeholder="Enter your password"
            showStrengthIndicator={false}
            required={true}
            error={errors.password?.message}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || rateLimited}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Sign In Securely
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default SignInForm;
