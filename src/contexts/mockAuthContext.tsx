import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

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

// Create a mock user and session
const createMockUser = (email: string, name: string): User => ({
  id: 'mock-user-id-' + Date.now(),
  app_metadata: {},
  user_metadata: { name, email },
  aud: 'authenticated',
  confirmation_sent_at: new Date().toISOString(),
  recovery_sent_at: null,
  email_change_sent_at: null,
  new_email: null,
  new_phone: null,
  invited_at: null,
  action_link: null,
  email: email,
  phone: null,
  created_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: null,
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  identities: [],
  is_anonymous: false,
  factors: []
});

const createMockSession = (user: User): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: user
});

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<'verified' | 'pending' | 'unknown'>('verified');

  useEffect(() => {
    // Check for existing mock session in localStorage
    const mockSession = localStorage.getItem('mock-auth-session');
    if (mockSession) {
      try {
        const sessionData = JSON.parse(mockSession);
        setUser(sessionData.user);
        setSession(sessionData);
        setEmailVerificationStatus('verified');
      } catch (error) {
        console.error('Error parsing mock session:', error);
        localStorage.removeItem('mock-auth-session');
      }
    }
    setLoading(false);
  }, []);

  const signUpFreemium = async (email: string, name: string, age?: string) => {
    console.log('Mock Auth: Freemium sign up for:', email);
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = createMockUser(email, name);
    const mockSession = createMockSession(mockUser);
    
    setUser(mockUser);
    setSession(mockSession);
    setEmailVerificationStatus('verified');
    
    // Store in localStorage for persistence
    localStorage.setItem('mock-auth-session', JSON.stringify(mockSession));
    
    toast.success('Mock: Account created and signed in successfully!');
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string, isFreemium: boolean = false) => {
    console.log('Mock Auth: Sign up for:', email);
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = createMockUser(email, name);
    const mockSession = createMockSession(mockUser);
    
    setUser(mockUser);
    setSession(mockSession);
    setEmailVerificationStatus('verified');
    
    // Store in localStorage for persistence
    localStorage.setItem('mock-auth-session', JSON.stringify(mockSession));
    
    toast.success('Mock: Account created and signed in successfully!');
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Mock Auth: Sign in for:', email);
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Any email/password combination works in mock mode
    const mockUser = createMockUser(email, 'Mock User');
    const mockSession = createMockSession(mockUser);
    
    setUser(mockUser);
    setSession(mockSession);
    setEmailVerificationStatus('verified');
    
    // Store in localStorage for persistence
    localStorage.setItem('mock-auth-session', JSON.stringify(mockSession));
    
    toast.success('Mock: Successfully signed in!');
    return { error: null };
  };

  const signOut = async () => {
    console.log('Mock Auth: Sign out');
    
    setUser(null);
    setSession(null);
    setEmailVerificationStatus('unknown');
    
    // Clear from localStorage
    localStorage.removeItem('mock-auth-session');
    
    toast.success('Mock: Successfully signed out!');
  };

  const resetPassword = async (email: string) => {
    console.log('Mock Auth: Password reset for:', email);
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    toast.success('Mock: Password reset email sent (not actually sent)!');
    return { error: null };
  };

  const resendVerification = async (email: string) => {
    console.log('Mock Auth: Resend verification for:', email);
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    toast.success('Mock: Verification email sent (not actually sent)!');
    return { error: null };
  };

  const updatePassword = async (newPassword: string) => {
    console.log('Mock Auth: Update password');
    
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    toast.success('Mock: Password updated successfully!');
    return { error: null };
  };

  const value = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}