import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, EyeOff, Check, Shield, Clock, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JourneyLayout } from '@/components/journey/JourneyLayout';
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation';
import { useAuth } from '@/hooks/useAuth';
import { EmailVerificationPopup } from '@/components/auth/EmailVerificationPopup';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function JourneyRegister() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { currentStep, totalSteps, updateState, nextStep } = useJourneyNavigation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  // Field validation states
  const [fieldValid, setFieldValid] = useState({
    name: false,
    email: false,
    password: false,
  });

  const validateField = (field: string, value: string) => {
    try {
      if (field === 'name') {
        z.string().min(2).max(50).parse(value);
        setFieldValid(prev => ({ ...prev, name: true }));
        setErrors(prev => ({ ...prev, name: '' }));
      } else if (field === 'email') {
        z.string().email().parse(value);
        setFieldValid(prev => ({ ...prev, email: true }));
        setErrors(prev => ({ ...prev, email: '' }));
      } else if (field === 'password') {
        z.string().min(8).parse(value);
        setFieldValid(prev => ({ ...prev, password: true }));
        setErrors(prev => ({ ...prev, password: '' }));
      }
    } catch {
      setFieldValid(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate all fields
      registerSchema.parse(formData);

      // Attempt sign up
      const { error } = await signUp(formData.email, formData.password, formData.name);

      if (error) {
        if (error.message?.includes('already exists') || error.message?.includes('already registered')) {
          setErrors({ email: 'This email is already registered. Please sign in.' });
        } else {
          setErrors({ form: error.message || 'Registration failed. Please try again.' });
        }
        setIsSubmitting(false);
        return;
      }

      // Success - show verification popup
      updateState({
        profile: {
          name: formData.name,
          email: formData.email,
          priority: null,
          challenge: null,
        }
      });
      setShowVerificationPopup(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) {
            fieldErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
    setIsSubmitting(false);
  };

  const handleContinueAfterVerification = () => {
    setShowVerificationPopup(false);
    navigate('/journey/brain-injury/energy');
  };

  const handleBack = () => {
    navigate('/mvp/brain-injury-welcome');
  };

  const isFormValid = fieldValid.name && fieldValid.email && fieldValid.password;

  return (
    <JourneyLayout
      currentStep={1}
      totalSteps={5}
      onBack={handleBack}
      showBack={true}
    >
      {/* Hero Section */}
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 flex items-center justify-center mb-6 shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Create Your Account
        </motion.h1>

        <motion.p
          className="text-base text-muted-foreground max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your journey to brain wellness starts here
        </motion.p>
      </div>

      {/* Registration Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Premium Card Container */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
          {/* Name Field */}
          <div className="space-y-2 mb-5">
            <Label htmlFor="name" className="text-base font-medium text-foreground">
              Your Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="h-14 text-lg px-4 pr-12 rounded-xl border-2 border-border focus:border-brain-health-500 focus:ring-2 focus:ring-brain-health-500/20 transition-all"
                autoComplete="name"
              />
              <AnimatePresence>
                {fieldValid.name && (
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-memory-emerald-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2 mb-5">
            <Label htmlFor="email" className="text-base font-medium text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="h-14 text-lg px-4 pr-12 rounded-xl border-2 border-border focus:border-brain-health-500 focus:ring-2 focus:ring-brain-health-500/20 transition-all"
                autoComplete="email"
              />
              <AnimatePresence>
                {fieldValid.email && (
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-memory-emerald-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium text-foreground">
              Create Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="h-14 text-lg px-4 pr-24 rounded-xl border-2 border-border focus:border-brain-health-500 focus:ring-2 focus:ring-brain-health-500/20 transition-all"
                autoComplete="new-password"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  {fieldValid.password && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-memory-emerald-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Form Error */}
        {errors.form && (
          <motion.div
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.form}
          </motion.div>
        )}

        {/* Submit Button - Large Touch Target */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full h-16 text-lg font-semibold rounded-xl bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Create My Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-4 h-4 text-brain-health-500" />
            <span>7-day free trial</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Heart className="w-4 h-4 text-brain-health-500" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-brain-health-500" />
            <span>Bank-level security</span>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/launch/sign-in')}
              className="text-brain-health-600 hover:text-brain-health-700 font-medium underline-offset-4 hover:underline transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.form>

      {/* Email Verification Popup */}
      <EmailVerificationPopup
        isOpen={showVerificationPopup}
        onClose={() => setShowVerificationPopup(false)}
        email={formData.email}
        onContinue={handleContinueAfterVerification}
      />
    </JourneyLayout>
  );
}
