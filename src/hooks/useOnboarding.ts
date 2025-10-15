import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OnboardingStatus {
  completed: boolean;
  current_step: number;
  chosen_path: 'guided' | 'explorer' | null;
  completed_at: string | null;
}

export function useOnboarding() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch onboarding status from database
  const { data: onboarding, isLoading, error } = useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching onboarding status:', error);
        throw error;
      }

      // If no record exists, create one
      if (!data) {
        const { data: newRecord, error: insertError } = await supabase
          .from('user_onboarding')
          .insert({
            user_id: user.id,
            completed: false,
            current_step: 1
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating onboarding record:', insertError);
          throw insertError;
        }

        return newRecord as OnboardingStatus;
      }

      return data as OnboardingStatus;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Update onboarding status
  const updateOnboarding = useMutation({
    mutationFn: async (updates: Partial<OnboardingStatus>) => {
      if (!user) throw new Error('No user authenticated');

      const { data, error } = await supabase
        .from('user_onboarding')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch onboarding data
      queryClient.invalidateQueries({ queryKey: ['onboarding', user?.id] });
    },
  });

  // Mark onboarding as complete
  const completeOnboarding = useMutation({
    mutationFn: async (chosenPath: 'guided' | 'explorer') => {
      if (!user) throw new Error('No user authenticated');

      const { data, error } = await supabase
        .from('user_onboarding')
        .update({
          completed: true,
          chosen_path: chosenPath,
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Also update localStorage for cache consistency
      localStorage.setItem('myrhythm_onboarding_complete', 'true');
      localStorage.setItem('myrhythm_chosen_path', chosenPath);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', user?.id] });
    },
  });

  return {
    onboarding,
    isLoading,
    error,
    updateOnboarding: updateOnboarding.mutate,
    completeOnboarding: completeOnboarding.mutate,
    isOnboardingComplete: onboarding?.completed ?? false,
  };
}
