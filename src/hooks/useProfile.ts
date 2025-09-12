import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  user_type?: string;
  custom_user_type?: string;
  onboarding_completed: boolean;
  phone_number?: string;
  phone_verified: boolean;
  mfa_enabled: boolean;
  require_mfa_for_sensitive_actions: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user profile
  const loadProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading profile:', error);
        setError(error.message);
        return null;
      }

      if (!data) {
        // Profile doesn't exist, create it
        return await createProfile();
      }

      setProfile(data);
      return data;
    } catch (error: any) {
      console.error('Exception loading profile:', error);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create user profile (fallback if auto-creation failed)
  const createProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;

    try {
      const profileData = {
        id: user.id,
        name: user.user_metadata?.name || 'New User',
        email: user.email || '',
        onboarding_completed: false
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        setError(error.message);
        return null;
      }

      setProfile(data);
      toast.success('Profile created successfully!');
      return data;
    } catch (error: any) {
      console.error('Exception creating profile:', error);
      setError(error.message);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (
    updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<UserProfile | null> => {
    if (!user || !profile) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile: ' + error.message);
        setError(error.message);
        return null;
      }

      setProfile(data);
      toast.success('Profile updated successfully!');
      return data;
    } catch (error: any) {
      console.error('Exception updating profile:', error);
      toast.error('Failed to update profile: ' + error.message);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark onboarding as completed
  const completeOnboarding = async (): Promise<boolean> => {
    const result = await updateProfile({ onboarding_completed: true });
    return result !== null;
  };

  // Check if onboarding is completed
  const isOnboardingCompleted = (): boolean => {
    return profile?.onboarding_completed || false;
  };

  // Update user type
  const updateUserType = async (userType: string, customType?: string): Promise<boolean> => {
    const updates: any = { user_type: userType };
    if (customType) updates.custom_user_type = customType;
    
    const result = await updateProfile(updates);
    return result !== null;
  };

  // Load profile on user change
  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    completeOnboarding,
    isOnboardingCompleted,
    updateUserType
  };
}