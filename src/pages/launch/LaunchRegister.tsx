import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, ArrowRight, Loader2, Eye, EyeOff, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import { BackButton } from '@/components/ui/BackButton';

// TEMP: open registration. Flip to false to restore real Supabase signup + email verification.
const BYPASS_REGISTRATION = true;

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(BYPASS_REGISTRATION ? 1 : 8, 'Password must be at least 8 characters'),
});

export default function LaunchRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledUserType = searchParams.get('userType');
  const { signUp, resendVerification } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Prefill email captured on the landing hero, then clear it.
  React.useEffect(() => {
    const prefill = localStorage.getItem('myrhythm_prefill_email');
    if (prefill) {
      setEmail(prefill);
      localStorage.removeItem('myrhythm_prefill_email');
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate inputs
    const result = registerSchema.safeParse({ name, email, password });
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
      if (BYPASS_REGISTRATION) {
        // Open registration: skip Supabase, store locally, continue.
        localStorage.setItem(
          'myrhythm_mock_user',
          JSON.stringify({ name, email, createdAt: new Date().toISOString() })
        );
        if (prefilledUserType) {
          localStorage.setItem('myrhythm_user_type', prefilledUserType);
        }
        toast.success("Account ready — let's get you set up.");
        navigate(prefilledUserType ? '/launch/payment' : '/launch/user-type');
        return;
      }

      const { error } = await signUp(email, password, name);
      if (error) {
        if (error.message?.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message || 'Registration failed');
        }
        return;
      }

      // Show success state instead of navigating immediately
      setRegistrationSuccess(true);
      toast.success('Account created! Please check your email to verify.');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const { error } = await resendVerification(email);
      if (error) {
        toast.error(error.message || 'Failed to resend verification email');
      } else {
        toast.success('Verification email sent! Please check your inbox and spam folder.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsResending(false);
    }
  };

  const handleContinue = () => {
    if (prefilledUserType) {
      localStorage.setItem('myrhythm_user_type', prefilledUserType);
      navigate('/launch/payment');
    } else {
      navigate('/launch/user-type');
    }
  };

  // Success state after registration
  if (registrationSuccess) {
    return (
      <div className="min-h-screen h-screen bg-launch-cream-light flex flex-col overflow-hidden">
        {/* Back Button */}
        <div className="flex-shrink-0 p-4">
          <BackButton onClick={() => navigate('/launch')} />
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-full">
            {/* Logo */}
            <div className="w-16 h-16 bg-launch-ink rounded-2xl ring-1 ring-launch-gold/50 flex items-center justify-center mb-6 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-launch-ink mb-2 text-center font-display">
              Check Your Email
            </h1>
            <p className="text-launch-ink/70 mb-8 text-center max-w-sm">
              We've sent a verification link to <span className="font-semibold text-launch-moss">{email}</span>
            </p>

            <Card className="w-full max-w-md bg-launch-ivory border border-launch-gold/30 shadow-xl">
              <CardContent className="p-6 space-y-6">
                {/* Instructions */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-launch-ember/10 rounded-lg border border-launch-ember/30">
                    <CheckCircle className="h-5 w-5 text-launch-ember mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-launch-ink">
                      <p className="font-medium">Check your spam/junk folder</p>
                      <p className="text-launch-ink/70">The email might be there if you don't see it in your inbox.</p>
                    </div>
                  </div>
                </div>

                {/* Resend button */}
                <div className="text-center">
                  <p className="text-sm text-launch-ink/50 mb-3">Didn't receive the email?</p>
                  <Button
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="border-brand-emerald-300 text-brand-emerald-700 hover:bg-brand-emerald-50"
                  >
                    {isResending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Resend Verification Email
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-launch-ink/50">or</span>
                  </div>
                </div>

                {/* Continue anyway button */}
                <Button
                  onClick={handleContinue}
                  className="w-full bg-launch-ink hover:bg-launch-ink/90 text-launch-cream py-6"
                >
                  Continue to Setup
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-launch-ink/50 text-center">
                  You can verify your email later, but some features may be limited.
                </p>
              </CardContent>
            </Card>

            {/* Sign in link */}
            <p className="mt-6 text-sm text-launch-ink/60 pb-8">
              Already verified?{' '}
              <button
                onClick={() => navigate('/launch/signin')}
                className="text-launch-moss hover:text-launch-moss/80 font-medium"
              >
                Sign in
              </button>
            </p>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-launch-cream-light flex flex-col overflow-hidden">
      {/* Back Button */}
      <div className="flex-shrink-0 p-4">
        <BackButton onClick={() => navigate('/launch')} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-full">
          {/* Logo */}
          <div className="w-16 h-16 bg-launch-ink rounded-2xl ring-1 ring-launch-gold/50 flex items-center justify-center mb-6 shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-launch-ink mb-2 text-center font-display">
            Create Your Account
          </h1>
          <p className="text-launch-ink/70 mb-8 text-center max-w-sm">
            Start your 7-day free trial. No charge until your trial ends.
          </p>

          <Card className="w-full max-w-md bg-launch-ivory border border-launch-gold/30 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? 'border-launch-ember' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-launch-ember">{errors.name}</p>
                  )}
                </div>

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
                  <Label htmlFor="password">Password</Label>
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
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-sm text-launch-ink/50">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>7-day free trial</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign in link */}
          <p className="mt-6 text-sm text-gray-600 pb-8">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/launch/signin')}
              className="text-launch-moss hover:text-launch-moss/80 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}