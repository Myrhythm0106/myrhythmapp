import React, { useState } from 'react';
import { JourneySteps } from '@/components/launch/JourneySteps';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, ArrowRight, Loader2, Eye, EyeOff, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { registrationSchema, registrationError } from '@/launch/onboarding/registration';
import { BackButton } from '@/components/ui/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { resolveEntryRoute } from '@/launch/onboarding/entryRoute';
import { readStartPlan, saveStartPlan, nextAfterAccount, type StartPlan } from '@/launch/onboarding/startPlan';
import { cn } from '@/lib/utils';


// Real Supabase signup is ON. A real session is required for checkout,
// access-code redemption and saving assessment results, so we no longer
// fake accounts locally.
const BYPASS_REGISTRATION = false;



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
  const [existingAccount, setExistingAccount] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const nextParam = searchParams.get('next');
  const safeNext = nextParam && nextParam.startsWith('/launch/') ? nextParam : null;
  const cameToPay = !!safeNext?.startsWith('/launch/payment');
  const [plan, setPlan] = useState<StartPlan>(() => (searchParams.get('plan') === 'member' || cameToPay ? 'member' : readStartPlan() ?? 'trial'));
  // A deep link (e.g. back to the membership page) wins only when it matches the choice.
  const afterAccount = () => {
    if (safeNext && !cameToPay) return safeNext;
    return nextAfterAccount(plan);
  };

  const sendReset = async () => {
    setIsResending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth`,
    });
    setIsResending(false);
    if (error) {
      toast.error("I couldn't send the reset email just now", {
        description: 'Please try again in a few minutes.',
      });
      return;
    }
    setResetSent(true);
  };

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
    const result = registrationSchema.safeParse({ name, email, password });
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
      saveStartPlan(plan);

      const { data, error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          data: { name: result.data.name },
          emailRedirectTo: `${window.location.origin}${afterAccount()}`,
        },
      });

      // An existing email comes back with no error but an empty identities
      // list, treat that as "already registered", never a silent success.
      const alreadyRegistered =
        (!!error &&
          /already registered|already been registered|user already exists/i.test(error.message || '')) ||
        (!error && !!data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0);

      if (error && !alreadyRegistered) {
        setErrors({ submit: registrationError(error.message) });
        return;
      }

      // Make sure we end up with a real session, checkout and saving your
      // results both need one.
      let session = data?.session ?? null;
      if (!session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: result.data.email,
          password: result.data.password,
        });
        session = signInData?.session ?? null;

        if (!session) {
          if (alreadyRegistered) {
            setExistingAccount(true);
            return;
          }
          if (/confirm/i.test(signInError?.message || '')) {
            // Email confirmation is switched on, show the verify screen.
            setRegistrationSuccess(true);
            toast.success('Account created! Please check your email to confirm it.');
            return;
          }
          toast.error("We couldn't sign you in automatically", {
            description: 'Your account exists, please sign in to carry on.',
          });
          navigate('/launch/signin');
          return;
        }
      }

      toast.success(plan === 'member' ? "You're in, next, my membership." : "You're in, next, add my card for my free 7 days.");
      navigate(afterAccount(), { replace: true });
    } catch (err: any) {
      console.error('[register] unexpected error', err);
      toast.error(err?.message || 'That did not go through. My details are safe, so I can try again.', {
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
        toast.error(error.message || 'Failed to resend confirmation email');
      } else {
        toast.success('Confirmation email sent! Please check your inbox and spam folder.');
      }
    } catch (err: any) {
      toast.error(err.message || 'That did not go through. My details are safe, so I can try again.');
    } finally {
      setIsResending(false);
    }
  };



  // Already signed in: never show an empty sign-up form.
  if (user && !registrationSuccess && !isLoading) {
    const name = String((user.user_metadata as { name?: string } | undefined)?.name ?? '').trim().split(/\s+/)[0] || user.email;
    const label = signedInNext === '/launch/user-type' ? 'Choose my starting point' : signedInNext?.startsWith('/launch/assessment') ? 'Continue my questions' : 'Go to my day';
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
          <BackButton onClick={() => navigate('/launch/landingpage')} />
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
              We've sent a confirmation link to <span className="font-semibold text-launch-moss">{email}</span>
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

                <p className="text-base text-launch-ink/70 text-center">
                  Open the link to confirm my email, then add my card. My choice is saved.
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
        <BackButton onClick={() => navigate('/launch/landingpage')} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-8">
        <div className="flex flex-col items-center justify-center min-h-full">
          {/* Logo */}
          <div className="w-12 h-12 bg-launch-ink rounded-2xl ring-1 ring-launch-gold/50 flex items-center justify-center mb-4 shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>

          <JourneySteps current={1} className="mb-4" />
          <h1 className="text-3xl font-bold text-launch-ink mb-2 text-center font-display">
            Create my account
          </h1>
          <p className="text-launch-ink/70 mb-5 text-center max-w-sm">
            My details, then my card. Next, my first conversation.
          </p>

          <fieldset className="w-full max-w-md mb-5">
            <legend className="mb-2 text-base font-semibold text-launch-ink-deep">How I'd like to start</legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {([
                { id: 'trial' as const, title: 'Free for 7 days', body: 'Card needed, nothing charged for 7 days.', tag: null },
                { id: 'member' as const, title: 'Join today', body: 'Founding Member, £10 a month for life.', tag: null },
              ]).map((o) => {
                const on = plan === o.id;
                return (
                  <Button
                    key={o.id}
                    type="button"
                    variant="ghost"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPlan(o.id)}
                    className={cn(
                      'h-auto min-h-14 w-full whitespace-normal rounded-lg border-2 p-3 text-left transition-colors',
                      on ? 'border-launch-teal bg-launch-teal/10' : 'border-launch-gold/30 bg-launch-ivory hover:border-launch-gold',
                    )}
                  >
                    <span className="flex items-start gap-3">
                      <span aria-hidden className={cn('mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', on ? 'border-launch-teal' : 'border-launch-ink/30')}>
                        {on && <span className="h-2.5 w-2.5 rounded-full bg-launch-teal" />}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2 text-base font-semibold text-launch-ink-deep">
                          {o.title}
                          {o.tag && <span className="rounded-full bg-launch-gold/20 px-2 py-0.5 text-xs font-semibold text-launch-ink">{o.tag}</span>}
                        </span>
                        <span className="mt-1 block text-base leading-relaxed text-launch-ink-deep/80">{o.body}</span>
                      </span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </fieldset>

          <Card className="w-full max-w-md bg-launch-ivory border border-launch-gold/30 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Annabel Aaron" autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn('h-14 text-base', errors.name && 'border-launch-ember')}
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
                    autoComplete="email"
                    autoCapitalize="none"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn('h-14 text-base', errors.email && 'border-launch-ember')}
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
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn('h-14 pr-14 text-base', errors.password && 'border-launch-ember')}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-launch-ink/70"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-base text-launch-ink/70">At least 8 characters.</p>
                  {errors.password && (
                    <p className="text-sm text-launch-ember">{errors.password}</p>
                  )}
                </div>

                {existingAccount && (
                  <div role="status" className="p-4 rounded-lg border border-launch-gold/40 bg-launch-gold/10 space-y-3">
                    <p className="text-base font-semibold text-launch-ink">
                      You already have an account with this email.
                    </p>
                    <p className="text-sm text-launch-ink/75">
                      {resetSent
                        ? `I've sent a reset link to ${email}. Open it on this phone to choose a new password. Check spam if it isn't there in a few minutes.`
                        : 'Log in, or reset your password if you can’t remember it.'}
                    </p>
                    <Button
                      type="button"
                      onClick={() => navigate('/launch/signin')}
                      className="w-full min-h-14 bg-launch-teal hover:bg-[hsl(var(--launch-teal)/0.88)] text-white"
                    >
                      Log in
                    </Button>
                    {!resetSent && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={sendReset}
                        disabled={isResending}
                        className="w-full min-h-14 border-launch-gold/40 text-launch-ink"
                      >
                        {isResending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset my password'}
                      </Button>
                    )}
                  </div>
                )}

                {errors.submit && <p role="alert" className="text-base text-launch-ember">{errors.submit}</p>}
                <Button
                  type="submit"
                  className="w-full min-h-14 h-auto whitespace-normal bg-brand-orange-500 hover:bg-brand-orange-600 text-primary-foreground py-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {plan === 'member' ? 'Create my account and join' : 'Create my account, start free'}
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
                    <span>{plan === 'member' ? 'Payment is on the next step' : 'Card next · nothing charged for 7 days'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign in link */}
          <p className="mt-6 text-sm text-launch-ink/60 pb-8">
            Already registered?{' '}
            <button
              onClick={() => navigate('/launch/signin')}
              className="min-h-11 text-launch-moss hover:text-launch-moss/80 font-medium underline underline-offset-4"
            >
              Log In
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}