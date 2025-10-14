import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { validateEmail, sanitizeEmail, sanitizeName } from '@/utils/auth/inputValidation';

interface RegistrationFormProps {
  onComplete: (data: { name: string; email: string; password: string }) => void;
  onBack?: () => void;
  initialEmail?: string;
}

export const RegistrationForm = ({ onComplete, onBack, initialEmail }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: initialEmail || '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    const sanitizedName = sanitizeName(formData.name);
    if (!sanitizedName || sanitizedName.length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 characters)';
    }

    // Validate email
    const sanitizedEmail = sanitizeEmail(formData.email);
    if (!validateEmail(sanitizedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsValidating(true);

    try {
      const sanitizedData = {
        name: sanitizeName(formData.name),
        email: sanitizeEmail(formData.email),
        password: formData.password
      };

      onComplete(sanitizedData);
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsValidating(false);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neural-purple-600 via-neural-indigo-600 to-neural-blue-600 bg-clip-text text-transparent">
            Create Your MyRhythm Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Just a few details to personalize your experience
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10"
                  required
                  disabled={isValidating}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                  disabled={isValidating}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PasswordInput
                  id="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10"
                  required
                  disabled={isValidating}
                  autoComplete="new-password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10"
                  required
                  disabled={isValidating}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
              {passwordsMatch && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Passwords match ✓</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isValidating}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={isValidating}
                className="flex-1 bg-gradient-to-r from-neural-purple-600 via-neural-indigo-600 to-neural-blue-600 hover:from-neural-purple-700 hover:via-neural-indigo-700 hover:to-neural-blue-700"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-muted-foreground space-y-1 pt-2">
            <p>🚀 Your account is ready to use immediately</p>
            <p>✨ No email confirmation required</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
