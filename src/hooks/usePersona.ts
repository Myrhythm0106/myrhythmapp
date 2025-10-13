import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export type PersonaMode = 'recovery' | 'executive';

export interface PersonaConfig {
  mode: PersonaMode;
  actionLabel: string;
  actionLabelPlural: string;
  hubLabel: string;
  priorityLabel: string;
  confirmMessage: string;
  scheduleMessage: string;
  frameworkLabel: string;
}

const personaConfigs: Record<PersonaMode, PersonaConfig> = {
  recovery: {
    mode: 'recovery',
    actionLabel: 'Care Step',
    actionLabelPlural: 'Care Steps',
    hubLabel: 'Wellness Hub',
    priorityLabel: 'Care Priority',
    confirmMessage: 'Care step confirmed! 💜 Taking it one step at a time.',
    scheduleMessage: 'Care step scheduled with your support circle! 🌱',
    frameworkLabel: 'Your SMART Care Framework'
  },
  executive: {
    mode: 'executive',
    actionLabel: 'Commitment',
    actionLabelPlural: 'Commitments',
    hubLabel: 'Accountability Hub',
    priorityLabel: 'Life Priority',
    confirmMessage: 'Empowered commitment confirmed! 💪 You\'re building stronger relationships.',
    scheduleMessage: 'Action scheduled with SMART suggestions! 📅💜',
    frameworkLabel: 'Your SMART ACTS Framework'
  }
};

export function usePersona() {
  const { user } = useAuth();
  const [personaMode, setPersonaMode] = useState<PersonaMode>('recovery');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPersonaMode();
  }, [user]);

  const loadPersonaMode = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('persona_mode')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      // Default to 'recovery' if not set
      const mode = (data?.persona_mode as PersonaMode) || 'recovery';
      setPersonaMode(mode);
    } catch (error) {
      console.error('Failed to load persona mode:', error);
      setPersonaMode('recovery');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersonaMode = async (mode: PersonaMode) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ persona_mode: mode })
        .eq('id', user.id);

      if (error) throw error;
      setPersonaMode(mode);
    } catch (error) {
      console.error('Failed to update persona mode:', error);
    }
  };

  const config = personaConfigs[personaMode];

  return {
    personaMode,
    updatePersonaMode,
    isLoading,
    ...config
  };
}
