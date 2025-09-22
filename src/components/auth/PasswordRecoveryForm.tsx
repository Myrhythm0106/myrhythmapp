import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordRecoveryFormProps {
  onSuccess: () => void;
}

export const PasswordRecoveryForm = ({ onSuccess }: PasswordRecoveryFormProps) => {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('🔐 PASSWORD RECOVERY DEBUG: Form submitted');
    console.log('🔐 PASSWORD RECOVERY DEBUG: Password length:', password.length);
    console.log('🔐 PASSWORD RECOVERY DEBUG: Passwords match:', password === confirmPassword);
    
    if (!password || !confirmPassword) {
      console.log('🔐 PASSWORD RECOVERY DEBUG: Missing password fields');
      setError('Both password fields are required');
      return;
    }

    if (password !== confirmPassword) {
      console.log('🔐 PASSWORD RECOVERY DEBUG: Passwords do not match');
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('🔐 PASSWORD RECOVERY DEBUG: Password too short');
      setError('Password must be at least 6 characters long');
      return;
    }

    console.log('🔐 PASSWORD RECOVERY DEBUG: Validation passed, calling updatePassword');
    setIsSubmitting(true);
    
    try {
      const { error } = await updatePassword(password);
      
      console.log('🔐 PASSWORD RECOVERY DEBUG: updatePassword result:', {
        success: !error,
        error: error?.message
      });
      
      if (!error) {
        console.log('🔐 PASSWORD RECOVERY DEBUG: Password updated successfully');
        setPassword('');
        setConfirmPassword('');
        onSuccess();
      } else {
        console.error('🔐 PASSWORD RECOVERY DEBUG: Password update failed:', error);
        setError(error.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('🔐 PASSWORD RECOVERY DEBUG: Exception during password update:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">Set New Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !password || !confirmPassword}
          >
            {isSubmitting ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};