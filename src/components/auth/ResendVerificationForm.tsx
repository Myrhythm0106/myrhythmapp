
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ResendVerificationFormProps {
  onBack: () => void;
  initialEmail?: string;
}

export const ResendVerificationForm = ({ onBack, initialEmail = '' }: ResendVerificationFormProps) => {
  const { resendVerification } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    setIsSubmitting(true);
    const { error } = await resendVerification(email);
    
    if (!error) {
      setEmail('');
      onBack();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Email Verification</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resend-email">Email Address</Label>
            <Input
              id="resend-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
