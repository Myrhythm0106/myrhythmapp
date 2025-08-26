import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
  days: number[]; // 0=Sunday, 1=Monday, etc.
}

interface SchedulePreference {
  id?: string;
  preference_type: 'most_productive' | 'least_productive' | 'preferred_meeting_times';
  time_slots: TimeSlot[];
  energy_level?: number;
  notes?: string;
}

export function useSchedulePreferences() {
  const [preferences, setPreferences] = useState<SchedulePreference[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load preferences on mount - for now we'll use hardcoded user ID
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_schedule_preferences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        preference_type: item.preference_type as 'most_productive' | 'least_productive' | 'preferred_meeting_times',
        time_slots: (item.time_slots as unknown) as TimeSlot[],
        energy_level: item.energy_level,
        notes: item.notes
      }));

      setPreferences(transformedData);
    } catch (error) {
      console.error('Error fetching schedule preferences:', error);
      toast.error('Failed to load schedule preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const savePreference = async (preference: SchedulePreference) => {
    try {
      // For now, skip user_id validation - this would need proper auth integration
      const { data, error } = await supabase
        .from('user_schedule_preferences')
        .insert({
          preference_type: preference.preference_type,
          time_slots: preference.time_slots as any,
          energy_level: preference.energy_level,
          notes: preference.notes,
          user_id: 'temp-user-id' // This would be replaced with actual user ID from auth
        })
        .select()
        .single();

      if (error) throw error;

      // Transform and update local state
      const transformedData = {
        id: data.id,
        preference_type: data.preference_type as 'most_productive' | 'least_productive' | 'preferred_meeting_times',
        time_slots: (data.time_slots as unknown) as TimeSlot[],
        energy_level: data.energy_level,
        notes: data.notes
      };

      setPreferences(prev => {
        const existing = prev.find(p => p.id === preference.id);
        if (existing) {
          return prev.map(p => p.id === preference.id ? transformedData : p);
        } else {
          return [transformedData, ...prev];
        }
      });

      toast.success('Schedule preference saved successfully');
      return transformedData;
    } catch (error) {
      console.error('Error saving schedule preference:', error);
      toast.error('Failed to save schedule preference');
      throw error;
    }
  };

  const deletePreference = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_schedule_preferences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPreferences(prev => prev.filter(p => p.id !== id));
      toast.success('Schedule preference deleted');
    } catch (error) {
      console.error('Error deleting schedule preference:', error);
      toast.error('Failed to delete schedule preference');
    }
  };

  // Helper function to get best time slots for scheduling
  const getBestTimeSlots = (): TimeSlot[] => {
    const mostProductive = preferences.find(p => p.preference_type === 'most_productive');
    return mostProductive?.time_slots || [];
  };

  // Helper function to avoid scheduling during least productive times
  const getWorstTimeSlots = (): TimeSlot[] => {
    const leastProductive = preferences.find(p => p.preference_type === 'least_productive');
    return leastProductive?.time_slots || [];
  };

  // Suggest optimal time for a given action based on preferences
  const suggestOptimalTime = (actionPriority: number = 3): { date: string; time: string } | null => {
    const bestSlots = getBestTimeSlots();
    if (bestSlots.length === 0) {
      // Default suggestion if no preferences set
      return {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        time: actionPriority <= 2 ? '09:00' : '14:00' // High priority in morning, lower in afternoon
      };
    }

    // Find the next available slot
    const now = new Date();
    const today = now.getDay();
    
    for (const slot of bestSlots) {
      for (const day of slot.days) {
        let targetDate = new Date(now);
        let daysToAdd = (day - today + 7) % 7;
        if (daysToAdd === 0 && now.getHours() >= parseInt(slot.end.split(':')[0])) {
          daysToAdd = 7; // If today but past the time, schedule for next week
        }
        targetDate.setDate(targetDate.getDate() + daysToAdd);
        
        return {
          date: targetDate.toISOString().split('T')[0],
          time: slot.start
        };
      }
    }

    return null;
  };

  return {
    preferences,
    isLoading,
    savePreference,
    deletePreference,
    fetchPreferences,
    getBestTimeSlots,
    getWorstTimeSlots,
    suggestOptimalTime
  };
}