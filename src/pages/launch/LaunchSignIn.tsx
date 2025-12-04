import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Loader2, Eye, EyeOff, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import { LaunchQuickActions } from '@/components/launch/LaunchQuickActions';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LaunchSignIn() {
  const navigate = useNavigate();
  const { signIn, resendVerification } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showResendOption, setShowResendOption] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setShowResendOption(false);

    // Validate inputs
    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message?.toLowerCase().includes('confirm') || 
            error.message?.toLowerCase().includes('verify')) {
          setShowResendOption(true);
        }
        return;
      }

      // Success - navigate to dashboard
      navigate('/launch/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }
    
    setIsResending(true);
    try {
      const { error } = await resendVerification(email);
      if (!error) {
        toast.success('Verification email sent! Please check your inbox and spam folder.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsResending(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/auth', { state: { showForgotPassword: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-brand-teal-500 via-brand-emerald-500 to-brand-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Brain className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-sm">
          Sign in to continue your cognitive wellness journey
        </p>

        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-brand-emerald-600 hover:text-brand-emerald-700"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 hover:from-brand-emerald-600 hover:to-brand-teal-600 text-white py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {/* Resend verification option */}
              {showResendOption && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800 mb-3">
                    Your email may not be verified yet. Check your inbox or resend the verification email.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    {isResending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Resend Verification Email
                  </Button>
                </div>
              )}
            </form>

            {/* Magic link option */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center mb-3">
                Or sign in without a password
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  if (!email || !email.includes('@')) {
                    toast.error('Enter a valid email to receive a magic link.');
                    return;
                  }
                  try {
                    const { supabase } = await import('@/integrations/supabase/client');
                    const { error } = await supabase.auth.signInWithOtp({
                      email: email.trim(),
                      options: { emailRedirectTo: `${window.location.origin}/launch/dashboard` }
                    });
                    if (error) throw error;
                    toast.success('Magic link sent! Check your email.');
                  } catch (e: any) {
                    toast.error(e?.message || 'Failed to send magic link.');
                  }
                }}
                className="w-full"
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Magic Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign up link */}
        <p className="mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/launch/register')}
            className="text-brand-emerald-600 hover:text-brand-emerald-700 font-medium"
          >
            Create one
          </button>
        </p>
      </div>
      
      {/* Compass FAB */}
      <LaunchQuickActions />
    </div>
  );
}
