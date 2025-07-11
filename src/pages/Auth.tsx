
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { myRhythmToast } from '@/utils/myrhythmToast';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResendVerificationForm } from '@/components/auth/ResendVerificationForm';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendVerificationEmail, setResendVerificationEmail] = useState('');
  
  // SECURITY FIX: Clear any sensitive parameters from URL immediately
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasSensitiveParams = urlParams.has('email') || urlParams.has('password') || urlParams.has('token');
    
    if (hasSensitiveParams) {
      // Remove all sensitive parameters and update URL without them
      const cleanParams = new URLSearchParams();
      const allowedParams = ['reset', 'step', 'redirect']; // Only keep safe parameters
      
      for (const [key, value] of urlParams.entries()) {
        if (allowedParams.includes(key)) {
          cleanParams.set(key, value);
        }
      }
      
      // Update URL without sensitive parameters
      const newUrl = `${window.location.pathname}${cleanParams.toString() ? '?' + cleanParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
      
      console.warn('MyRhythm Security: Sensitive parameters removed from URL for user protection');
    }
  }, []);
  
  // Check if this is a password reset
  const isPasswordReset = searchParams.get('reset') === 'true';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      // Get the intended destination from location state, or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('Auth: Redirecting authenticated user to:', from);
      navigate(from, { replace: true });
      myRhythmToast.welcome('Welcome Back to MyRhythm!', {
        description: 'Your Memory1st journey continues with renewed energy and focus.'
      });
    }
  }, [user, loading, navigate, location.state]);

  // Show password reset message if coming from reset link
  useEffect(() => {
    if (isPasswordReset) {
      myRhythmToast.info('MyRhythm Password Reset', {
        description: 'You can now securely update your password to continue your journey.'
      });
    }
  }, [isPasswordReset]);

  const handleSignInSuccess = () => {
    // Navigation will be handled by the useEffect above
    console.log('Auth: Sign in successful, navigation will be handled by useEffect');
    myRhythmToast.welcome('Welcome Back to MyRhythm!', {
      description: 'Your personalized Memory1st journey continues where you left off.'
    });
  };

  const handleSignUpSuccess = (email: string) => {
    console.log('Auth: Sign up successful for:', email);
    myRhythmToast.welcome('MyRhythm Account Created!', {
      description: 'Your journey starts now! Let\'s build your Memory1st foundation together.'
    });
    
    // Since we're not requiring email verification, redirect directly to onboarding
    setTimeout(() => {
      navigate('/onboarding', { replace: true });
    }, 1500);
  };

  const handleResendVerificationRequest = (email: string) => {
    setShowResendVerification(true);
    setResendVerificationEmail(email);
  };

  const handleBackToAuth = () => {
    setShowForgotPassword(false);
    setShowResendVerification(false);
    setResendVerificationEmail('');
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">MyRhythm: Preparing your secure authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render auth forms if user is already authenticated (redirect will happen via useEffect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">MyRhythm: Redirecting to your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (showResendVerification) {
    return (
      <AuthLayout title="MyRhythm Email Verification">
        <ResendVerificationForm
          onBack={handleBackToAuth}
          initialEmail={resendVerificationEmail}
        />
      </AuthLayout>
    );
  }

  if (showForgotPassword) {
    return (
      <AuthLayout title="MyRhythm Password Recovery">
        <ForgotPasswordForm onBack={handleBackToAuth} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Your personalized Memory1st brain recovery companion">
      <AuthTabs
        onForgotPassword={() => setShowForgotPassword(true)}
        onResendVerification={handleResendVerificationRequest}
        onSignInSuccess={handleSignInSuccess}
        onSignUpSuccess={handleSignUpSuccess}
      />
    </AuthLayout>
  );
};

export default Auth;
