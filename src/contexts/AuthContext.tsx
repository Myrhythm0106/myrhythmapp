
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isLeakedPasswordError, getLeakedPasswordMessage } from '@/utils/auth/passwordValidation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, 'user:', !!session?.user, 'session:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle different auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
          // Clear any potentially insecure data from localStorage
          localStorage.removeItem('pendingVerificationEmail');
          localStorage.removeItem('myrhythm_security_answers'); // Remove any old insecure data
        }
        
        if (event === 'PASSWORD_RECOVERY') {
          toast.success('You can now update your password');
        }

        if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out!');
          // Clear all potentially sensitive data from localStorage
          localStorage.removeItem('pendingVerificationEmail');
          localStorage.removeItem('myrhythm_security_answers');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session?.user, 'session:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    // Use the current origin for redirect, but point to our verification page
    const redirectUrl = `${window.location.origin}/email-verification`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });
    
    if (error) {
      // Check if this is a leaked password error
      if (isLeakedPasswordError(error)) {
        toast.error(getLeakedPasswordMessage());
      } else {
        toast.error(error.message);
      }
    } else {
      // Store email for potential resend verification (this is safe as it's not sensitive data)
      localStorage.setItem('pendingVerificationEmail', email);
      toast.success('Account created! Please check your email to verify your account before signing in.');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('AuthContext: Sign in error:', error.message);
      // Provide more helpful error messages
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email address before signing in. Check your inbox for a verification link.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials and try again.');
      } else {
        toast.error(error.message);
      }
    } else {
      console.log('AuthContext: Sign in successful, waiting for auth state change');
    }
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      // Clear all potentially sensitive data from localStorage on signout
      localStorage.removeItem('pendingVerificationEmail');
      localStorage.removeItem('myrhythm_security_answers');
    }
  };

  const resetPassword = async (email: string) => {
    // Use Supabase's secure password reset functionality
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset email sent! Check your inbox for instructions.');
    }
    
    return { error };
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Verification email sent! Please check your inbox.');
    }
    
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
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
