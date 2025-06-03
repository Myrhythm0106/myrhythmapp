
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, UserPlus, LogIn, Heart, Mail } from 'lucide-react';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signUp, signIn, resetPassword, resendVerification, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  
  // Check if this is a password reset
  const isPasswordReset = searchParams.get('reset') === 'true';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resendVerificationEmail, setResendVerificationEmail] = useState('');

  // Show password reset message if coming from reset link
  useEffect(() => {
    if (isPasswordReset) {
      toast.info('You can now update your password');
    }
  }, [isPasswordReset]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.name);
    
    if (!error) {
      setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
      // Show option to resend verification if needed
      setShowResendVerification(true);
      setResendVerificationEmail(signUpData.email);
    }
    
    setIsSubmitting(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      navigate('/dashboard');
    } else {
      // If error is about email not confirmed, show resend verification option
      if (error.message?.includes('Email not confirmed')) {
        setShowResendVerification(true);
        setResendVerificationEmail(signInData.email);
      }
    }
    
    setIsSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await resetPassword(forgotPasswordEmail);
    
    if (!error) {
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    }
    
    setIsSubmitting(false);
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resendVerificationEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await resendVerification(resendVerificationEmail);
    
    if (!error) {
      setShowResendVerification(false);
      setResendVerificationEmail('');
    }
    
    setIsSubmitting(false);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">MyRhythm</h1>
            </div>
            <p className="text-gray-600">Resend verification email</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Email Verification</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResendVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resend-email">Email Address</Label>
                  <Input
                    id="resend-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resendVerificationEmail}
                    onChange={(e) => setResendVerificationEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Please verify your email address before signing in. If you didn't receive the verification email, you can request a new one.
                </p>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowResendVerification(false)}
                  >
                    Back
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">MyRhythm</h1>
            </div>
            <p className="text-gray-600">Reset your password</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Forgot Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Email'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">MyRhythm</h1>
          </div>
          <p className="text-gray-600">Your personal brain recovery companion</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Secure Access</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <PasswordInput
                      id="signin-password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                  <div className="text-center space-y-2">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot your password?
                    </Button>
                    <br />
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => setShowResendVerification(true)}
                    >
                      Resend verification email
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <PasswordInput
                      id="signup-password"
                      placeholder="Create a password (min. 6 characters)"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <PasswordInput
                      id="signup-confirm"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                    {signUpData.password !== signUpData.confirmPassword && signUpData.confirmPassword && (
                      <p className="text-sm text-red-600">Passwords do not match</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting || signUpData.password !== signUpData.confirmPassword || signUpData.password.length < 6}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Secure authentication powered by Supabase</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
