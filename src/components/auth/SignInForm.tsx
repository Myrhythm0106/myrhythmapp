
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { useAuth } from '@/contexts/AuthContext';

interface SignInFormProps {
  onForgotPassword: () => void;
  onResendVerification: (email: string) => void;
  onSuccess: () => void;
}

export const SignInForm = ({ onForgotPassword, onResendVerification, onSuccess }: SignInFormProps) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      onSuccess();
    } else {
      // If error is about email not confirmed, show resend verification option
      if (error.message?.includes('Email not confirmed')) {
        onResendVerification(formData.email);
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <PasswordInput
          id="signin-password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
          onClick={onForgotPassword}
        >
          Forgot your password?
        </Button>
        <br />
        <Button
          type="button"
          variant="link"
          className="text-sm"
          onClick={() => onResendVerification('')}
        >
          Resend verification email
        </Button>
      </div>
    </form>
  );
};
