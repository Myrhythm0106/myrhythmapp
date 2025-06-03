
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResendVerificationForm } from '@/components/auth/ResendVerificationForm';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendVerificationEmail, setResendVerificationEmail] = useState('');
  
  // Check if this is a password reset
  const isPasswordReset = searchParams.get('reset') === 'true';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Show password reset message if coming from reset link
  useEffect(() => {
    if (isPasswordReset) {
      toast.info('You can now update your password');
    }
  }, [isPasswordReset]);

  const handleSignInSuccess = () => {
    navigate('/dashboard');
  };

  const handleSignUpSuccess = (email: string) => {
    setShowResendVerification(true);
    setResendVerificationEmail(email);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showResendVerification) {
    return (
      <AuthLayout title="Resend verification email">
        <ResendVerificationForm
          onBack={handleBackToAuth}
          initialEmail={resendVerificationEmail}
        />
      </AuthLayout>
    );
  }

  if (showForgotPassword) {
    return (
      <AuthLayout title="Reset your password">
        <ForgotPasswordForm onBack={handleBackToAuth} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Your personal brain recovery companion">
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
