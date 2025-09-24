
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Brain, ArrowRight, Loader2, Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/PasswordInput";

interface QuickRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickRegisterModal({ isOpen, onClose }: QuickRegisterModalProps) {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match. Please check and try again.");
      setIsLoading(false);
      return;
    }

    // Basic password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.name);
      toast.success("Account created! Check your email to verify your account.");
      onClose();
      navigate("/onboarding");
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToFullOnboarding = () => {
    onClose();
    navigate("/onboarding");
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
        <DialogHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Start Your MyRhythm Journey
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Memory1st → LEAP Forward</p>
            </div>
          </div>
        </DialogHeader>
        
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200/50">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="pl-10 bg-white/80 border-purple-200 focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="pl-10 bg-white/80 border-purple-200 focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PasswordInput
                  id="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 bg-white/80 border-purple-200 focus:border-purple-400"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 bg-white/80 border-purple-200 focus:border-purple-400"
                  required
                  minLength={6}
                />
              </div>
              {passwordsMatch && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-white font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Your Memory1st Account...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Begin Memory1st → LEAP Journey
                  </>
                )}
              </Button>

              <Button 
                type="button"
                variant="outline" 
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50" 
                onClick={handleContinueToFullOnboarding}
              >
                Continue to Full Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          By registering, you agree to our Memory1st approach to gentle, empowering brain health.
        </p>
      </DialogContent>
    </Dialog>
  );
}
