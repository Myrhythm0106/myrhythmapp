import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { TestTube } from 'lucide-react';

export const TestAccountButton = () => {
  const { signUp, signIn } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const createTestAccount = async () => {
    setIsCreating(true);
    
    try {
      // Clear all onboarding related localStorage
      localStorage.removeItem('myrhythm_onboarding_complete');
      localStorage.removeItem('myrhythm_onboarding_step');
      localStorage.removeItem('myrhythm_profile_complete');
      localStorage.removeItem('myrhythm-welcome-seen');
      localStorage.removeItem('myrhythm_web_onboarding_current_step');
      localStorage.removeItem('myrhythm_web_onboarding_progress_saved');
      
      // Use NEW working test credentials
      const testEmail = 'testuser@lovabletest.com';
      const testPassword = 'TestPassword123!';
      const testName = 'Test User';

      console.log('🧪 Creating test account:', testEmail);
      toast.info('Creating test account...');
      
      // Try to sign up first
      const { error: signUpError } = await signUp(testEmail, testPassword, testName);
      
      if (signUpError) {
        console.log('Sign up failed, trying sign in (user might exist):', signUpError);
        
        // If signup fails, try signing in (user might already exist)
        const { error: signInError } = await signIn(testEmail, testPassword);
        
        if (signInError) {
          console.error('Both signup and signin failed:', signInError);
          toast.error(`Failed to access test account: ${signInError.message}`);
          setIsCreating(false);
          return;
        } else {
          toast.success('Successfully signed in to existing test account!');
          setIsCreating(false);
          return;
        }
      }

      toast.success('Test account created! Attempting auto-login...');
      
      // Wait a moment then try to sign in
      setTimeout(async () => {
        const { error: signInError } = await signIn(testEmail, testPassword);
        
        if (signInError) {
          console.error('Test account login failed:', signInError);
          toast.error(`Auto-login failed: ${signInError.message}. Try manual login with: ${testEmail}`);
        } else {
          toast.success('Test account ready! Recording functionality will work now.');
        }
        setIsCreating(false);
      }, 2000);
      
    } catch (error) {
      console.error('Unexpected error creating test account:', error);
      toast.error('Unexpected error creating test account');
      setIsCreating(false);
    }
  };

  return (
    <Button
      onClick={createTestAccount}
      disabled={isCreating}
      variant="outline"
      size="sm"
      className="text-xs bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
    >
      <TestTube className="h-3 w-3 mr-1" />
      {isCreating ? 'Creating...' : 'Create Test Account'}
    </Button>
  );
};