// Utilities to standardize onboarding completion across the app
import { supabase } from '@/integrations/supabase/client';

const KEY_COMPLETE = 'myrhythm_onboarding_complete';
const KEY_COMPLETED = 'myrhythm_onboarding_completed';

// Async version that checks database first (Phase 3: Database tracking)
export async function isOnboardingCompletedFromDB(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_step')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      // Fall back to localStorage
      return isOnboardingCompleted();
    }
    
    return data.onboarding_step === 'complete';
  } catch {
    // Fall back to localStorage on error
    return isOnboardingCompleted();
  }
}

// Synchronous version for quick checks (checks localStorage only)
export function isOnboardingCompleted(): boolean {
  try {
    const v1 = localStorage.getItem(KEY_COMPLETE) === 'true';
    const v2 = localStorage.getItem(KEY_COMPLETED) === 'true';
    return v1 || v2;
  } catch {
    return false;
  }
}

export async function markOnboardingCompleted(userId?: string, chosenPath?: 'guided' | 'explorer'): Promise<void> {
  try {
    // Update localStorage for cache
    localStorage.setItem(KEY_COMPLETE, 'true');
    localStorage.setItem(KEY_COMPLETED, 'true');
    
    // Update database if user ID is provided
    if (userId && chosenPath) {
      const { error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: userId,
          completed: true,
          chosen_path: chosenPath,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) {
        console.error('Error updating onboarding in database:', error);
      }
    }
  } catch (error) {
    console.error('Error marking onboarding complete:', error);
  }
}

export function clearOnboardingCompletion(): void {
  try {
    localStorage.removeItem(KEY_COMPLETE);
    localStorage.removeItem(KEY_COMPLETED);
  } catch {}
}
