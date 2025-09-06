import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDateRanges, TimeFrame } from './useDateRanges';

interface CapturesSummary {
  voiceRecordings: number;
  memoryEntries: number;
  extractedActs: number;
  totalCaptures: number;
}

export function useCapturesSummary(timeFrame: TimeFrame = 'day') {
  const { user } = useAuth();
  const { start, end } = useDateRanges(timeFrame);
  const [summary, setSummary] = useState<CapturesSummary>({
    voiceRecordings: 0,
    memoryEntries: 0,
    extractedActs: 0,
    totalCaptures: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCapturesSummary = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get voice recordings count
        const { count: voiceCount } = await supabase
          .from('voice_recordings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());

        // Get memory entries count
        const { count: memoryCount } = await supabase
          .from('memory_entries')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());

        // Get extracted actions count (from captures in this period)
        const { count: actsCount } = await supabase
          .from('extracted_actions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());

        const voiceRecordings = voiceCount || 0;
        const memoryEntries = memoryCount || 0;
        const extractedActs = actsCount || 0;
        const totalCaptures = voiceRecordings + memoryEntries;

        setSummary({
          voiceRecordings,
          memoryEntries,
          extractedActs,
          totalCaptures
        });
      } catch (error) {
        console.error('Error fetching captures summary:', error);
        setSummary({ voiceRecordings: 0, memoryEntries: 0, extractedActs: 0, totalCaptures: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCapturesSummary();
  }, [user, start, end]);

  return { summary, isLoading };
}