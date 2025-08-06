
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMeetingHistory } from '@/utils/memoryBridgeApi';
import { MeetingRecording } from '@/types/memoryBridge';

export const useMeetingHistory = () => {
  const { user } = useAuth();
  const [meetingHistory, setMeetingHistory] = useState<MeetingRecording[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const history = await fetchMeetingHistory(user.id);
      setMeetingHistory(history);
    } catch (error) {
      console.error('Error fetching meeting history:', error);
      setMeetingHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    meetingHistory,
    isLoading,
    fetchMeetingHistory: fetchHistory,
  };
};
