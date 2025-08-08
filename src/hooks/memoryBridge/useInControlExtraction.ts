import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InControlItem } from '@/types/memoryBridge';

export function useInControlExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedItems, setExtractedItems] = useState<InControlItem[]>([]);

  const extractFromRecording = async (recordingId: string, audioBlob: Blob) => {
    setIsExtracting(true);
    setExtractedItems([]);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const audioData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          let binary = '';
          for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          resolve(btoa(binary));
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(audioBlob);
      });

      // Call edge function for processing
      const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
        body: {
          audioData,
          meetingId: recordingId,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      // Fetch the extracted items
      const { data: items, error: fetchError } = await supabase
        .from('extracted_actions')
        .select('*')
        .eq('meeting_recording_id', recordingId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Map database items to InControlItem format
      const mappedItems: InControlItem[] = (items || []).map(item => ({
        ...item,
        action_type: item.action_type as InControlItem['action_type'],
        status: item.status as InControlItem['status']
      }));

      setExtractedItems(mappedItems);
      return mappedItems;
    } catch (error) {
      console.error('Error extracting InControl items:', error);
      throw error;
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    isExtracting,
    extractedItems,
    extractFromRecording
  };
}