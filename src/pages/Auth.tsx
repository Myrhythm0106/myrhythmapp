
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Brain, ArrowLeft } from "lucide-react";
import { AuthTabs } from "@/components/auth/AuthTabs";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Redirect authenticated users
  useEffect(() => {
    if (user && !loading) {
      console.log('Auth page: User is authenticated, redirecting to:', from);
      navigate(from);
    }
  }, [user, loading, navigate, from]);

  const handleSignUpSuccess = (email: string) => {
    console.log('Auth page: Sign up successful for:', email);
    setSuccessEmail(email);
    setShowSuccessMessage(true);
  };

  const handleBackToSignIn = () => {
    setShowSuccessMessage(false);
    setSuccessEmail('');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleResendVerification = (email: string) => {
    console.log('Resend verification for:', email);
  };

  const handleSignInSuccess = () => {
    console.log('Sign in successful, redirecting...');
    navigate(from);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show success message after signup
  if (showSuccessMessage) {
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
              <CardTitle className="text-xl text-green-600">Account Created Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your account has been created for <strong>{successEmail}</strong>
              </p>
              <p className="text-sm text-gray-500">
                You can now sign in using your email and password.
              </p>
              <Button
                onClick={handleBackToSignIn}
                className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 hover:from-purple-600 hover:via-blue-600 hover:to-teal-600"
              >
                Continue to Sign In
              </Button>
            </CardContent>
          </Card>
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
            <CardTitle className="text-xl">Welcome to MyRhythm</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthTabs 
              onForgotPassword={handleForgotPassword}
              onResendVerification={handleResendVerification}
              onSignInSuccess={handleSignInSuccess}
              onSignUpSuccess={handleSignUpSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
