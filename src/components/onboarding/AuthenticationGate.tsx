
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { myRhythmToast } from "@/utils/myrhythmToast";

interface AuthenticationGateProps {
  onAuthSuccess: () => void;
}

export const AuthenticationGate = ({ onAuthSuccess }: AuthenticationGateProps) => {
  const { signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match for sign up
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError("MyRhythm Security: Passwords don't match. Please ensure both entries are identical.");
      setIsLoading(false);
      return;
    }

    // Basic password validation
    if (isSignUp && formData.password.length < 6) {
      setError("MyRhythm Security: Password must be at least 6 characters for optimal protection.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        console.log("AuthenticationGate: Creating account for onboarding");
        const { error } = await signUp(formData.email, formData.password, formData.name);
        
        if (error) {
          if (error.message.includes("User already registered")) {
            setError("MyRhythm Account: This email is already part of our community. Please sign in to continue your journey.");
            setIsSignUp(false);
          } else {
            setError(`MyRhythm Setup: ${error.message || "Unable to create your account at this time. Please try again."}`);
          }
        } else {
          console.log("AuthenticationGate: Account created successfully, proceeding to onboarding");
          myRhythmToast.welcome("Account Created Successfully!", {
            description: "Your Memory1st journey begins now. Let's discover your unique rhythm together."
          });
          onAuthSuccess();
        }
      } else {
        console.log("AuthenticationGate: Signing in existing user");
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setError("MyRhythm Access: Invalid credentials. Please verify your email and password to continue your journey.");
        } else {
          console.log("AuthenticationGate: Sign in successful, proceeding to onboarding");
          myRhythmToast.welcome("Welcome Back!", {
            description: "Continuing your personalized Memory1st journey where you left off."
          });
          onAuthSuccess();
        }
      }
    } catch (error) {
      console.error("AuthenticationGate: Unexpected error:", error);
      setError("MyRhythm System: An unexpected issue occurred. Our team has been notified. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const passwordsMatch = isSignUp && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm
              </CardTitle>
              <p className="text-sm text-muted-foreground">Memory1st → LEAP Forward</p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              {isSignUp ? "Your Journey Starts Here" : "Welcome Back to MyRhythm"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isSignUp 
                ? "We're ready to begin! Registration takes 2-3 minutes to complete." 
                : "Continue building your empowered, authentic, productive life"
              }
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PasswordInput
                  id="password"
                  placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
                {passwordsMatch && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>MyRhythm Security: Passwords match perfectly ✓</span>
                  </div>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "Creating Your MyRhythm Account..." : "Accessing Your Journey..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Your Journey Starts Here" : "Continue Your MyRhythm Journey"}
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
              }}
              disabled={isLoading}
              className="text-sm"
            >
              {isSignUp 
                ? "Already part of MyRhythm? Continue your journey" 
                : "New to MyRhythm? Your journey starts here"
              }
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>🚀 Your MyRhythm account is ready to use immediately</p>
            <p>✨ No email confirmation required - start your Memory1st journey now</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
