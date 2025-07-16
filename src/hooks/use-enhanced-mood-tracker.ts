import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmotionalEntry {
  emotions: string[];
  emotional_note?: string;
  gratitude_note?: string;
  context: string;
  energy_level: number;
  mood: string;
}

export const useEnhancedMoodTracker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addEmotionalEntry = async (
    emotion: string,
    energyLevel: number,
    emotionalNote?: string,
    gratitudeNote?: string,
    context: string = 'daily'
  ) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          emotions: [emotion],
          emotional_note: emotionalNote,
          gratitude_note: gratitudeNote,
          context,
          energy_level: energyLevel,
          mood: getMoodFromEmotion(emotion),
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      // Also add to gratitude entries if gratitude note exists
      if (gratitudeNote) {
        await supabase
          .from('gratitude_entries')
          .insert({
            user_id: user.id,
            gratitude_text: gratitudeNote,
            prompt_type: 'emotional_wellness',
            date: new Date().toISOString().split('T')[0]
          });
      }

      return data;
    } catch (error) {
      console.error('Error adding emotional entry:', error);
      toast.error("Failed to save your feelings. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodFromEmotion = (emotion: string): string => {
    const positiveEmotions = ['joyful', 'proud', 'grateful', 'excited', 'calm'];
    const neutralEmotions = ['okay', 'curious', 'focused'];
    
    if (positiveEmotions.includes(emotion)) return 'great';
    if (neutralEmotions.includes(emotion)) return 'okay';
    return 'struggling';
  };

  return {
    addEmotionalEntry,
    isLoading
  };
};