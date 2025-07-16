
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  emailVerificationStatus: 'verified' | 'pending' | 'unknown';
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  resendVerification: (email: string) => Promise<{ error: any }>;
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
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error retrieving session:', error);
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

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('AuthContext: Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        console.error('AuthContext: Sign up error:', error);
        toast.error(error.message);
      } else {
        console.log('AuthContext: Sign up successful:', data);
        toast.success('Account created successfully! Please check your email to verify your account.');
        setEmailVerificationStatus('pending');
      }
      
      return { error };
    } catch (error) {
      console.error('AuthContext: Sign up exception:', error);
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
        console.error('AuthContext: Sign in error:', error);
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
      console.error('AuthContext: Sign in exception:', error);
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
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });
      
      if (error) {
        console.error('AuthContext: Password reset error:', error);
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Check your inbox for instructions.');
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
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        console.error('AuthContext: Resend verification error:', error);
        toast.error(error.message);
      } else {
        toast.success('Verification email sent! Check your inbox.');
      }
      
      return { error };
    } catch (error) {
      console.error('AuthContext: Resend verification exception:', error);
      toast.error('Failed to resend verification email. Please try again.');
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
      signIn,
      signOut,
      resetPassword,
      resendVerification,
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
