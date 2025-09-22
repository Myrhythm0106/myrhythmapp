import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Brain, ArrowLeft } from "lucide-react";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PasswordRecoveryForm } from "@/components/auth/PasswordRecoveryForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [showTokenError, setShowTokenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Check for password recovery parameters in hash - run only once on mount
  useEffect(() => {
    const processRecoveryToken = async () => {
      console.log('🔒 AUTH DEBUG: Starting recovery token processing');
      console.log('🔒 AUTH DEBUG: Full URL:', window.location.href);
      console.log('🔒 AUTH DEBUG: Hash:', window.location.hash);
      
      const hash = window.location.hash;
      
      if (!hash) {
        console.log('🔒 AUTH DEBUG: No hash found - normal auth flow');
        return;
      }

      console.log('🔒 AUTH DEBUG: Processing hash:', hash);
      
      // Parse hash parameters
      const hashParams = new URLSearchParams(hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      console.log('🔒 AUTH DEBUG: Hash params parsed:', { 
        type, 
        accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : 'missing', 
        refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : 'missing',
        allParams: Object.fromEntries(hashParams.entries())
      });
      
      // Check for errors first
      const error = hashParams.get('error');
      const errorCode = hashParams.get('error_code');
      const errorDescription = hashParams.get('error_description');
      
      if (error) {
        console.log('🔒 AUTH DEBUG: Error found in hash:', { error, errorCode, errorDescription });
        if (error === 'access_denied' && errorCode === 'otp_expired') {
          console.log('🔒 AUTH DEBUG: OTP expired - showing error message');
          setErrorMessage('The password reset link has expired or has already been used. Please request a new one.');
          setShowTokenError(true);
          setShowPasswordRecovery(false);
          setShowForgotPassword(false);
          setShowSuccessMessage(false);
          
          // Clean the URL
          window.history.replaceState({}, '', window.location.pathname);
          return;
        } else {
          console.log('🔒 AUTH DEBUG: Other error - showing generic error');
          setErrorMessage(`Authentication error: ${error} - ${errorDescription || 'Please try again'}`);
          setShowTokenError(true);
          setShowPasswordRecovery(false);
          setShowForgotPassword(false);
          setShowSuccessMessage(false);
          
          // Clean the URL
          window.history.replaceState({}, '', window.location.pathname);
          return;
        }
      }
      
      // Process recovery token
      if (type === 'recovery' && accessToken && refreshToken) {
        console.log('🔒 AUTH DEBUG: Valid recovery token found - immediately showing recovery form');
        
        // Immediately show the password recovery form to prevent race condition
        setShowPasswordRecovery(true);
        setShowForgotPassword(false);
        setShowSuccessMessage(false);
        setShowTokenError(false);
        
        console.log('🔒 AUTH DEBUG: Establishing session with recovery tokens');
        
        try {
          // Set the session with the recovery tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          console.log('🔒 AUTH DEBUG: setSession result:', {
            success: !error,
            error: error?.message,
            user: data?.user?.email,
            session: !!data?.session
          });
          
          if (error) {
            console.error('🔒 AUTH DEBUG: Failed to set session:', error);
            setErrorMessage(`Failed to process recovery token: ${error.message}`);
            setShowTokenError(true);
            setShowPasswordRecovery(false);
            return;
          }
          
          if (data?.session && data?.user) {
            console.log('🔒 AUTH DEBUG: Session established successfully, recovery form already visible');
            
            // Clean the URL after processing
            window.history.replaceState({}, '', window.location.pathname);
            console.log('🔒 AUTH DEBUG: URL cleaned, recovery form should remain visible');
          } else {
            console.error('🔒 AUTH DEBUG: Session or user missing from response');
            setErrorMessage('Failed to establish session. Please try again.');
            setShowTokenError(true);
            setShowPasswordRecovery(false);
          }
          
        } catch (error) {
          console.error('🔒 AUTH DEBUG: Exception during recovery token processing:', error);
          setErrorMessage(`Failed to process recovery token: ${error}`);
          setShowTokenError(true);
          setShowPasswordRecovery(false);
        }
      } else {
        console.log('🔒 AUTH DEBUG: Not a recovery token - missing required params');
        console.log('🔒 AUTH DEBUG: type:', type, 'accessToken present:', !!accessToken, 'refreshToken present:', !!refreshToken);
      }
    };

    processRecoveryToken();
  }, []); // Empty dependency array - run only once on mount

  // If user is already logged in (but not in password recovery), show logout option instead of redirecting
  if (user && !loading && !showPasswordRecovery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 flex items-center justify-center p-4">
        <Card className="shadow-lg border-purple-200/50 w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-xl">Already Logged In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              You are already logged in as <strong>{user.email}</strong>
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 hover:from-purple-600 hover:via-blue-600 hover:to-teal-600"
              >
              Go to Dashboard
              </Button>
              <Button
                onClick={signOut}
                variant="outline"
                className="w-full"
              >
                Log Out to Test Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignUpEmailSuccess = (email: string) => {
    console.log('Auth page: Sign up successful for:', email);
    setSuccessEmail(email);
    setShowSuccessMessage(true);
    setShowForgotPassword(false);
  };

  const handleBackToSignIn = () => {
    setShowSuccessMessage(false);
    setSuccessEmail('');
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    console.log('Showing forgot password form');
    setShowForgotPassword(true);
  };

  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const handleBackFromTokenError = () => {
    setShowTokenError(false);
    setErrorMessage('');
  };

  const handleRequestNewReset = () => {
    setShowTokenError(false);
    setShowForgotPassword(true);
    setErrorMessage('');
  };

  const handleResendVerification = (email: string) => {
    console.log('Resend verification for:', email);
  };

  const handleSignInSuccess = () => {
    toast.success('Welcome back!');
    // Redirect to the page they were trying to access, or dashboard
    console.log('Auth page: Sign in successful, redirecting to:', from);
    navigate(from, { replace: true });
  };

  const handleSignUpSuccess = () => {
    toast.success('Account created successfully!');
    // After signup, redirect to their intended destination or path selection
    const destination = from !== "/dashboard" ? from : '/path-selection';
    console.log('Auth page: Sign up successful, redirecting to:', destination);
    navigate(destination, { replace: true });
  };

  const handlePasswordRecoverySuccess = () => {
    setShowPasswordRecovery(false);
    toast.success('Password updated successfully!');
    navigate('/dashboard', { replace: true });
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

  // Show token error message
  if (showTokenError) {
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

          <Card className="shadow-lg border-red-200/50">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  MyRhythm
                </h1>
              </div>
              <CardTitle className="text-xl text-red-600">Reset Link Expired</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-600">
                {errorMessage}
              </p>
              <div className="space-y-2">
                <Button
                  onClick={handleRequestNewReset}
                  className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 hover:from-purple-600 hover:via-blue-600 hover:to-teal-600"
                >
                  Request New Reset Link
                </Button>
                <Button
                  onClick={handleBackFromTokenError}
                  variant="outline"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show password recovery form
  if (showPasswordRecovery) {
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

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
            </div>
          </div>

          <PasswordRecoveryForm onSuccess={handlePasswordRecoverySuccess} />
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

  // Show forgot password form
  if (showForgotPassword) {
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

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
            </div>
          </div>

          <ForgotPasswordForm onBack={handleBackFromForgotPassword} />
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
              onSignUpSuccess={() => handleSignUpEmailSuccess('')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
