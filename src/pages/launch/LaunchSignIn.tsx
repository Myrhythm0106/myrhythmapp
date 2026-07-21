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

      // Success - navigate to home
      navigate('/launch/home');
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
    <div className="min-h-screen h-screen bg-launch-cream-light flex flex-col overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center min-h-full">
          {/* Logo */}
          <div className="w-16 h-16 bg-launch-ink rounded-2xl ring-1 ring-launch-gold/50 flex items-center justify-center mb-6 shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-launch-ink mb-2 text-center font-display">
            Welcome Back
          </h1>
          <p className="text-launch-ink/70 mb-8 text-center max-w-sm">
            Sign in to continue your cognitive wellness journey
          </p>

          <Card className="w-full max-w-md bg-launch-ivory border border-launch-gold/30 shadow-xl">
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
                    className={errors.email ? 'border-launch-ember' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-launch-ember">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-launch-moss hover:text-launch-moss/80"
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
                      className={errors.password ? 'border-launch-ember pr-10' : 'pr-10'}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-launch-ink/40 hover:text-launch-ink/70"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-launch-ember">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-launch-ink hover:bg-launch-ink/90 text-launch-cream py-6"
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
                  <div className="mt-4 p-4 bg-launch-ember/10 rounded-lg border border-launch-ember/30">
                    <p className="text-sm text-launch-ink mb-3">
                      Your email may not be verified yet. Check your inbox or resend the verification email.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="w-full border-launch-ember/40 text-launch-ink hover:bg-launch-ember/20"
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
              <div className="mt-6 pt-6 border-t border-launch-gold/20">
                <p className="text-sm text-launch-ink/50 text-center mb-3">
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
                        options: { emailRedirectTo: `${window.location.origin}/launch/home` }
                      });
                      if (error) throw error;
                      toast.success('Magic link sent! Check your email.');
                    } catch (e: any) {
                      toast.error(e?.message || 'Failed to send magic link.');
                    }
                  }}
                  className="w-full border-launch-gold/40 text-launch-ink hover:bg-launch-gold/10 hover:text-launch-ink"
                  disabled={isLoading}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Magic Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign up link */}
          <p className="mt-6 text-sm text-launch-ink/60 pb-8">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/launch/register')}
              className="text-launch-moss hover:text-launch-moss/80 font-medium"
            >
              Create one
            </button>
          </p>

        </div>
      </div>
      
      {/* Compass FAB */}
      <LaunchQuickActions />
    </div>
  );
}
