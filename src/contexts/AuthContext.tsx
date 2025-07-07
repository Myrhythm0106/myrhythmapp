import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isLeakedPasswordError, getLeakedPasswordMessage } from '@/utils/auth/passwordValidation';
import { SessionSecurity } from '@/utils/security/sessionSecurity';
import { DataProtection } from '@/utils/security/dataProtection';
import { errorHandler } from '@/utils/errorHandler';

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
        
        // Handle different auth events with enhanced security
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
          SessionSecurity.startSession();
          DataProtection.logSecurityEvent('USER_SIGNED_IN', {
            userId: session?.user?.id,
            email: session?.user?.email
          });
          
          // Clear any potentially insecure data from localStorage
          localStorage.removeItem('pendingVerificationEmail');
          localStorage.removeItem('myrhythm_security_answers');
        }
        
        if (event === 'PASSWORD_RECOVERY') {
          toast.success('You can now update your password');
        }

        if (event === 'SIGNED_OUT') {
          SessionSecurity.endSession('USER_SIGNOUT');
          DataProtection.logSecurityEvent('USER_SIGNED_OUT', {});
          toast.success('Successfully signed out!');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        errorHandler.handleError(
          errorHandler.createError(
            'Failed to retrieve session',
            'error',
            'SESSION_RETRIEVAL_ERROR',
            { error }
          )
        );
      }
      
      console.log('Initial session check:', !!session?.user, 'session:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session) {
        SessionSecurity.startSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // REMOVED EMAIL VERIFICATION - Immediate signup without email confirmation
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: DataProtection.sanitizeInput(name)
          }
          // NOTE: Removed emailRedirectTo to skip email confirmation for immediate launch
          // This allows users to sign up and use the app immediately
        }
      });
      
      if (error) {
        if (isLeakedPasswordError(error)) {
          toast.error(getLeakedPasswordMessage());
        } else {
          errorHandler.handleError(
            errorHandler.createError(
              error.message,
              'error',
              'SIGNUP_ERROR',
              { email }
            )
          );
        }
      } else {
        // Success message for immediate access
        toast.success('Account created successfully! Welcome to MyRhythm.');
        
        DataProtection.logSecurityEvent('USER_SIGNUP_ATTEMPT', {
          email,
          success: true
        });
      }
      
      return { error };
    } catch (error) {
      const appError = errorHandler.createError(
        'Sign up failed',
        'error',
        'SIGNUP_EXCEPTION',
        { error, email }
      );
      errorHandler.handleError(appError);
      return { error: appError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting sign in');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.log('AuthContext: Sign in error:', error.message);
        
        DataProtection.logSecurityEvent('SIGNIN_FAILED', {
          email,
          error: error.message
        });
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials and try again.');
        } else {
          errorHandler.handleError(
            errorHandler.createError(
              error.message,
              'error',
              'SIGNIN_ERROR',
              { email }
            )
          );
        }
      } else {
        console.log('AuthContext: Sign in successful, waiting for auth state change');
      }
      
      return { error };
    } catch (error) {
      const appError = errorHandler.createError(
        'Sign in failed',
        'error',
        'SIGNIN_EXCEPTION',
        { error, email }
      );
      errorHandler.handleError(appError);
      return { error: appError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        errorHandler.handleError(
          errorHandler.createError(
            error.message,
            'error',
            'SIGNOUT_ERROR'
          )
        );
      }
    } catch (error) {
      const appError = errorHandler.createError(
        'Sign out failed',
        'error',
        'SIGNOUT_EXCEPTION',
        { error }
      );
      errorHandler.handleError(appError);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) {
        errorHandler.handleError(
          errorHandler.createError(
            error.message,
            'error',
            'PASSWORD_RESET_ERROR',
            { email }
          )
        );
      } else {
        toast.success('Password reset email sent! Check your inbox for instructions.');
        DataProtection.logSecurityEvent('PASSWORD_RESET_REQUESTED', { email });
      }
      
      return { error };
    } catch (error) {
      const appError = errorHandler.createError(
        'Password reset failed',
        'error',
        'PASSWORD_RESET_EXCEPTION',
        { error, email }
      );
      errorHandler.handleError(appError);
      return { error: appError };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        errorHandler.handleError(
          errorHandler.createError(
            error.message,
            'error',
            'VERIFICATION_RESEND_ERROR',
            { email }
          )
        );
      } else {
        toast.success('Verification email sent! Please check your inbox.');
      }
      
      return { error };
    } catch (error) {
      const appError = errorHandler.createError(
        'Verification resend failed',
        'error',
        'VERIFICATION_RESEND_EXCEPTION',
        { error, email }
      );
      errorHandler.handleError(appError);
      return { error: appError };
    }
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
