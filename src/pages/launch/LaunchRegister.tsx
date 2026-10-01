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
import { supabase } from '@/integrations/supabase/client';
import { resolveEntryRoute } from '@/launch/onboarding/entryRoute';


// Real Supabase signup is ON. A real session is required for checkout,
// access-code redemption and saving assessment results, so we no longer
// fake accounts locally.
const BYPASS_REGISTRATION = false;

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Please add your first name').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});


export default function LaunchRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledUserType = searchParams.get('userType');
  const { user, signOut, resendVerification } = useAuth();
  const [signedInNext, setSignedInNext] = useState<string | null>(null);

  React.useEffect(() => {
    if (!user) { setSignedInNext(null); return; }
    resolveEntryRoute('start', user.id).then(setSignedInNext);
  }, [user]);

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
      if (prefilledUserType) {
        localStorage.setItem('myrhythm_user_type', prefilledUserType);
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}${
            '/launch/assessment?first=1'
          }`,
        },
      });

      const alreadyRegistered =
        !!error &&
        /already registered|already been registered|user already exists/i.test(error.message || '');

      if (error && !alreadyRegistered) {
        toast.error(error.message || "We couldn't create your account", {
          description: 'Check your email and password, then try again. If it keeps failing, sign in instead.',
        });
        return;
      }

      // Make sure we end up with a real session — checkout and saving your
      // results both need one.
      let session = data?.session ?? null;
      if (!session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        session = signInData?.session ?? null;

        if (!session) {
          if (alreadyRegistered) {
            toast.error('That email already has an account', {
              description: 'Please sign in with your password to continue.',
            });
            navigate('/launch/signin');
            return;
          }
          if (/confirm/i.test(signInError?.message || '')) {
            // Email confirmation is switched on — show the verify screen.
            setRegistrationSuccess(true);
            toast.success('Account created! Please check your email to verify.');
            return;
          }
          toast.error("We couldn't sign you in automatically", {
            description: 'Your account exists — please sign in to carry on.',
          });
          navigate('/launch/signin');
          return;
        }
      }

      toast.success("You're in — let's get you set up.");
      navigate('/launch/assessment?first=1', { replace: true });
    } catch (err: any) {
      console.error('[register] unexpected error', err);
      toast.error(err?.message || 'Something went wrong', {
        description: 'Nothing was lost. Please try again in a moment.',
      });
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
    const next = searchParams.get('next');
    if (next && next.startsWith('/launch/')) {
      navigate(next);
      return;
    }
    if (prefilledUserType) localStorage.setItem('myrhythm_user_type', prefilledUserType);
    navigate('/launch/assessment?first=1');
  };


  // Already signed in: never show an empty sign-up form.
  if (user && !registrationSuccess && !isLoading) {
    const name = String((user.user_metadata as { name?: string } | undefined)?.name ?? '').trim().split(/\s+/)[0] || user.email;
    const label = signedInNext?.startsWith('/launch/assessment') ? 'Continue my questions' : 'Go to my day';
    return (
      <div className="min-h-screen bg-launch-cream-light flex flex-col items-center justify-center px-6 py-10 pt-safe pb-safe">
        <Card className="w-full max-w-md bg-launch-ivory border border-launch-gold/30 shadow-xl">
          <CardContent className="p-7 space-y-5 text-center">
            <h1 className="text-3xl font-display text-launch-ink">You're already signed in as {name}.</h1>
            <Button
              onClick={() => navigate(signedInNext ?? '/launch/home?from=landing')}
              className="w-full min-h-14 bg-launch-teal hover:bg-[hsl(var(--launch-teal)/0.88)] text-white text-base font-bold"
            >
              {label}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <button
              onClick={async () => { await signOut(); }}
              className="min-h-11 text-sm text-launch-ink/70 underline underline-offset-4"
            >
              Sign out and create a new account
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state after registration
  if (registrationSuccess) {
    return (
      <div className="h-full min-h-0 bg-launch-cream-light flex flex-col overflow-hidden pt-safe pb-safe px-safe">
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
                  className="w-full bg-launch-teal hover:bg-[hsl(var(--launch-teal)/0.88)] text-white py-6"
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
    <div className="h-full min-h-0 bg-launch-cream-light flex flex-col overflow-hidden pt-safe pb-safe px-safe">
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
            Create my account
          </h1>
          <p className="text-launch-ink/70 mb-8 text-center max-w-sm">
            Takes 30 seconds, then your free questions. Membership is optional and shown separately.
          </p>

          <Card className="w-full max-w-md bg-launch-ivory border border-launch-gold/30 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Annabel" autoComplete="given-name"
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
                  className="w-full bg-launch-teal hover:bg-[hsl(var(--launch-teal)/0.88)] text-white py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create my account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 text-sm text-launch-ink/75">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-launch-teal" />
                    <span>Free snapshot included</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-launch-teal" />
                    <span>Nothing is purchased here</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign in link */}
          <p className="mt-6 text-sm text-launch-ink/60 pb-8">
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