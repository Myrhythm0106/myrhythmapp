
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Brain, ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import { EmailVerificationStatus } from "@/components/auth/EmailVerificationStatus";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailStatus, setShowEmailStatus] = useState(false);
  
  const { signIn, signUp, user, emailVerificationStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/onboarding";

  // Redirect authenticated users
  useEffect(() => {
    if (user && !showEmailStatus) {
      if (emailVerificationStatus === 'verified') {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [user, emailVerificationStatus, navigate, showEmailStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error) {
          toast.success("Welcome back!");
          navigate(from);
        }
      } else {
        // Validation for signup
        if (password !== confirmPassword) {
          toast.error("Passwords do not match. Please check and try again.");
          setIsLoading(false);
          return;
        }
        
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters long.");
          setIsLoading(false);
          return;
        }
        
        if (!acceptPrivacy) {
          toast.error("Please accept the privacy policy to continue.");
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, name);
        if (!error) {
          setShowEmailStatus(true);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithLimitedAccess = () => {
    navigate("/onboarding");
  };

  // Show email verification status after successful signup
  if (showEmailStatus && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
            </div>
            <p className="text-gray-600 mt-2">Welcome to your journey!</p>
          </div>

          <EmailVerificationStatus 
            onContinue={handleContinueWithLimitedAccess}
            showContinueButton={true}
          />

          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setShowEmailStatus(false);
                setIsLogin(true);
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg border-purple-200/50">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
            </div>
            <CardTitle className="text-xl">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-xs text-green-600">✓ Passwords match</p>
                  )}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={acceptPrivacy}
                      onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                      required
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="privacy"
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-sm underline"
                          onClick={() => navigate("/privacy-policy")}
                        >
                          Privacy Policy
                        </Button>{" "}
                        and{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-sm underline"
                          onClick={() => navigate("/terms")}
                        >
                          Terms of Service
                        </Button>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <h4 className="text-sm font-medium text-blue-900">Email Verification</h4>
                    </div>
                    <div className="text-xs text-blue-800 space-y-1">
                      <p>• You'll receive a verification email within 10-30 seconds</p>
                      <p>• You can start using MyRhythm immediately</p>
                      <p>• Full features unlock after email verification</p>
                      <p>• Check spam folder if email doesn't arrive</p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 hover:from-purple-600 hover:via-blue-600 hover:to-teal-600"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account & Continue")}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
