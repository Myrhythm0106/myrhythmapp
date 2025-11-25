
import React, { useState } from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    toast.info("Password reset link sent! Check your email.");
  };

  const handleResendVerification = (email: string) => {
    toast.info(`Verification email sent to ${email}`);
  };

  const handleSignInSuccess = () => {
    toast.success("Welcome back!");
    navigate("/memory-bridge");
  };

  const handleSignUpSuccess = (email: string) => {
    toast.success("Account created! Please check your email to verify your account.");
    // Stay on auth page for email verification
  };

  return (
    <Preview3Background>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-brain-health-700 hover:text-brain-health-900 hover:bg-brain-health-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                    MyRhythm
                  </h1>
                  <p className="text-sm text-muted-foreground">Memory1st → LEAP Forward</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AuthTabs
                onForgotPassword={handleForgotPassword}
                onResendVerification={handleResendVerification}
                onSignInSuccess={handleSignInSuccess}
                onSignUpSuccess={handleSignUpSuccess}
              />
              
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Begin your gentle, Memory1st approach to empowered living
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Preview3Background>
  );
}
