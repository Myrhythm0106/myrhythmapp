import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SecureLogger } from '@/utils/security/secureLogger';

interface UserStatusResult {
  exists: boolean;
  verified: boolean;
  user_id: string | null;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  emailVerificationStatus: 'verified' | 'pending' | 'unknown';
  signUp: (email: string, password: string, name: string, isFreemium?: boolean) => Promise<{ error: any }>;
  signUpFreemium: (email: string, name: string, age?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  resendVerification: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<'verified' | 'pending' | 'unknown'>('unknown');

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, 'user:', !!session?.user, 'session:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check email verification status
        if (session?.user) {
          const emailVerified = session.user.email_confirmed_at != null;
          setEmailVerificationStatus(emailVerified ? 'verified' : 'pending');
          console.log('User email verification status:', emailVerified ? 'verified' : 'pending');
        } else {
          setEmailVerificationStatus('unknown');
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
          toast.success('Welcome back!');
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          toast.success('Successfully signed out!');
          setEmailVerificationStatus('unknown');
        }

        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery event detected');
          toast.success('You can now set your new password');
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        SecureLogger.error('Error retrieving session:', error);
      }
      
      console.log('Initial session check:', !!session?.user, 'session:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const emailVerified = session.user.email_confirmed_at != null;
        setEmailVerificationStatus(emailVerified ? 'verified' : 'pending');
      } else {
        setEmailVerificationStatus('unknown');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUpFreemium = async (email: string, name: string, age?: string) => {
    try {
      console.log('AuthContext: Attempting freemium sign up for:', email);
      
      // Check user status using secure RPC function
      const { data: userStatus, error: statusError } = await supabase.rpc('check_user_status', {
        p_email: email
      });
      
      if (statusError) {
        console.error('Error checking user status:', statusError);
        toast.error('Unable to check account status. Please try again.');
        return { error: statusError };
      }
      
      console.log('User status check result:', userStatus);
      
      const status = userStatus as unknown as UserStatusResult;
      
      if (status?.exists) {
        if (status.verified) {
          // User exists and is verified - redirect to sign in
          toast.error('An account with this email already exists and is verified. Please sign in instead.');
          return { error: new Error('User already exists and verified') };
        } else {
          // User exists but is not verified - resend verification
          console.log('User exists but not verified, sending verification email');
          const verificationToken = crypto.randomUUID();
          
          // Store verification token in database
          const { error: tokenError } = await supabase
            .from('email_verifications')
            .insert({
              email,
              token: verificationToken,
              user_id: status.user_id
            });

          if (tokenError) {
            console.error('Error storing verification token:', tokenError);
            toast.error('Account exists but verification email failed. Please try resending from the sign-in page.');
            return { error: tokenError };
          }

          // Send verification email
          const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
            body: {
              email,
              name: status.name || name,
              token: verificationToken,
              redirectUrl: `${window.location.origin}/email-verification`
            }
          });

          if (emailError) {
            console.error('Error sending verification email:', emailError);
            toast.error('Account exists but verification email failed. Please try resending from the sign-in page.');
            return { error: emailError };
          }

          toast.success('Account found! Check your email to verify your account.');
          setEmailVerificationStatus('pending');
          return { error: null };
        }
      }
      
      // User doesn't exist, create new account
      const tempPassword = crypto.randomUUID() + '!A1';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            name: name,
            age: age,
            is_freemium: true,
            signup_type: 'freemium'
          },
          emailRedirectTo: `${window.location.origin}/email-verification`
        }
      });
      
      if (error) {
        SecureLogger.error('AuthContext: Freemium sign up error:', error);
        toast.error(error.message);
        return { error };
      }

      if (data?.user?.id) {
        // Generate verification token and send custom email
        const verificationToken = crypto.randomUUID();
        
        // Store verification token in database
        const { error: tokenError } = await supabase
          .from('email_verifications')
          .insert({
            email,
            token: verificationToken,
            user_id: data.user.id
          });

        if (tokenError) {
          console.error('Error storing verification token:', tokenError);
          toast.error('Account created but verification email failed. Please try resending.');
          return { error: tokenError };
        }

        // Send custom verification email
        const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: {
            email,
            name,
            token: verificationToken,
            redirectUrl: `${window.location.origin}/email-verification`
          }
        });

        if (emailError) {
          console.error('Error sending verification email:', emailError);
          toast.error('Account created but verification email failed. Please check your email or try resending.');
        } else {
          console.log('Custom verification email sent successfully');
          toast.success('Welcome! Check your email to verify your account and unlock all features.');
        }
        
        setEmailVerificationStatus('pending');
      }
      
      return { error };
    } catch (error) {
      SecureLogger.error('AuthContext: Freemium sign up exception:', error);
      toast.error('Sign up failed. Please try again.');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string, isFreemium: boolean = false) => {
    try {
      console.log('AuthContext: Attempting sign up for:', email);
      
      // First, check if user already exists by querying profiles table
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('email', email)
        .maybeSingle();
      
      if (existingProfile) {
        // User exists, try to sign them in to check verification status
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!signInError && signInData.user) {
          // User signed in successfully, they're already verified
          toast.error('An account with this email already exists and is verified. You have been signed in.');
          return { error: null }; // Allow the sign in to proceed
        } else if (signInError?.message.includes('Invalid login credentials')) {
          // Wrong password, but user exists - they should sign in with correct password
          toast.error('An account with this email already exists. Please sign in with your existing password.');
          return { error: new Error('User already exists') };
        } else if (signInError?.message.includes('Email not confirmed')) {
          // User exists but not verified
          toast.error('An account with this email already exists but is not verified. Please check your email or use the "Resend Verification" option.');
          setEmailVerificationStatus('pending');
          return { error: new Error('User exists but not verified') };
        }
      }
      
      // User doesn't exist, create new account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            is_freemium: isFreemium,
            signup_type: isFreemium ? 'freemium' : 'premium'
          },
          emailRedirectTo: isFreemium 
            ? `${window.location.origin}/welcome`
            : `${window.location.origin}/email-verification`
        }
      });
      
      if (error) {
        SecureLogger.error('AuthContext: Sign up error:', error);
        toast.error(error.message);
      } else {
        console.log('AuthContext: Sign up successful:', data);
        toast.success('Account created successfully! Please check your email to verify your account.');
        setEmailVerificationStatus('pending');
      }
      
      return { error };
    } catch (error) {
      SecureLogger.error('AuthContext: Sign up exception:', error);
      toast.error('Sign up failed. Please try again.');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting sign in for:', email);
      
      // Simple sign in without additional options
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
      
      if (error) {
        SecureLogger.error('AuthContext: Sign in error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          code: (error as any).code
        });
        
        // Provide specific error messages
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address before signing in.');
          setEmailVerificationStatus('pending');
        } else if (error.message.includes('Too many requests')) {
          toast.error('Too many login attempts. Please wait a moment and try again.');
        } else {
          toast.error(`Sign in failed: ${error.message}`);
        }
      } else {
        console.log('AuthContext: Sign in successful for user:', data.user?.email);
        // Don't show success toast here as it will be handled by onAuthStateChange
      }
      
      return { error };
    } catch (error) {
      SecureLogger.error('AuthContext: Sign in exception:', error);
      toast.error('Sign in failed. Please try again.');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthContext: Sign out error:', error);
        toast.error('Sign out failed. Please try again.');
      }
    } catch (error) {
      console.error('AuthContext: Sign out exception:', error);
      toast.error('Sign out failed. Please try again.');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('AuthContext: Attempting password reset for:', email);
      
      // Use the current domain for the redirect URL
      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/auth`;
      
      console.log('Password reset redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      
      if (error) {
        console.error('AuthContext: Password reset error:', error);
        toast.error(error.message);
      } else {
        toast.success('MyRhythm password reset email sent! Check your inbox for instructions.');
        console.log('Password reset email sent successfully to:', email);
      }
      
      return { error };
    } catch (error) {
      console.error('AuthContext: Password reset exception:', error);
      toast.error('Password reset failed. Please try again.');
      return { error };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      console.log('AuthContext: Attempting to resend verification for:', email);
      
      // Check if user exists by querying profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('email', email)
        .single();
      
      if (profileError || !profileData) {
        toast.error('User not found. Please sign up first.');
        return { error: profileError };
      }

      // Generate new verification token
      const verificationToken = crypto.randomUUID();
      
      // Delete any existing unused tokens for this email
      await supabase
        .from('email_verifications')
        .delete()
        .eq('email', email)
        .eq('used', false);

      // Store new verification token in database
      const { error: tokenError } = await supabase
        .from('email_verifications')
        .insert({
          email,
          token: verificationToken,
          user_id: profileData.id
        });

      if (tokenError) {
        console.error('Error storing verification token:', tokenError);
        toast.error('Failed to generate verification token. Please try again.');
        return { error: tokenError };
      }

      // Send custom verification email
      const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          name: profileData.name || 'User',
          token: verificationToken,
          redirectUrl: `${window.location.origin}/email-verification`
        }
      });

      if (emailError) {
        console.error('Error sending verification email:', emailError);
        toast.error('Failed to send verification email. Please try again.');
        return { error: emailError };
      }

      toast.success('Verification email sent! Check your inbox and spam folder.');
      return { error: null };
      
    } catch (error) {
      console.error('AuthContext: Resend verification exception:', error);
      toast.error('Failed to resend verification email. Please try again.');
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('AuthContext: Attempting to update password');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('AuthContext: Password update error:', error);
        toast.error(error.message);
      } else {
        console.log('AuthContext: Password updated successfully');
        toast.success('Password updated successfully!');
      }
      
      return { error };
    } catch (error) {
      console.error('AuthContext: Password update exception:', error);
      toast.error('Password update failed. Please try again.');
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      emailVerificationStatus,
      signUp,
      signUpFreemium,
      signIn,
      signOut,
      resetPassword,
      resendVerification,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}