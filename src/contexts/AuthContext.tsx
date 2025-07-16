
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
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
      async (event, session) => {
        console.log('Auth state change:', event, 'user:', !!session?.user, 'session:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
          toast.success('Welcome back!');
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          toast.success('Successfully signed out!');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error retrieving session:', error);
      }
      
      console.log('Initial session check:', !!session?.user, 'session:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
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
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('AuthContext: Sign up error:', error);
        toast.error(error.message);
      } else {
        console.log('AuthContext: Sign up successful:', data);
        toast.success('Account created successfully! You can now sign in.');
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
      
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the confirmation link before signing in.');
        } else {
          toast.error(error.message);
        }
      } else {
        console.log('AuthContext: Sign in successful for user:', data.user?.email);
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
        redirectTo: `${window.location.origin}/auth?reset=true`,
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

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
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
