import { useState, useEffect } from 'react';
import { ExtractedAction } from '@/types/memoryBridge';
import { useSubscription } from '@/contexts/SubscriptionContext';

export const useDemoData = () => {
  const { demoMode } = useSubscription();
  const [demoExtractedActions, setDemoExtractedActions] = useState<ExtractedAction[]>([]);

  useEffect(() => {
    if (demoMode) {
      // Create demo PACTs data
      const demoPACTs: ExtractedAction[] = [
        {
          id: 'demo-1',
          meeting_recording_id: 'demo-meeting-1',
          user_id: 'demo-user',
          action_type: 'promise',
          action_text: 'Call mom to check on her health and well-being',
          priority_level: 8,
          confidence_score: 0.95,
          relationship_impact: 'Family conversation about staying connected',
          transcript_excerpt: 'I promise to call mom this week to check how she\'s doing',
          status: 'pending',
          due_context: '2 days from now',
          timestamp_in_recording: 120,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'demo-2',
          meeting_recording_id: 'demo-meeting-1',
          user_id: 'demo-user',
          action_type: 'task',
          action_text: 'Schedule annual health checkup with Dr. Smith',
          priority_level: 7,
          confidence_score: 0.88,
          relationship_impact: 'Health discussion about preventive care',
          transcript_excerpt: 'I need to book that checkup with Dr. Smith that I\'ve been putting off',
          status: 'pending',
          due_context: '1 week from now',
          timestamp_in_recording: 300,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'demo-3',
          meeting_recording_id: 'demo-meeting-2',
          user_id: 'demo-user',
          action_type: 'promise',
          action_text: 'Exercise for 30 minutes at least 3 times this week',
          priority_level: 6,
          confidence_score: 0.72,
          relationship_impact: 'Personal health and wellness commitment',
          transcript_excerpt: 'I\'ll make sure to get some exercise this week, at least 30 minutes three times',
          status: 'confirmed',
          due_context: '5 days from now',
          timestamp_in_recording: 180,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
        {
          id: 'demo-4',
          meeting_recording_id: 'demo-meeting-2',
          user_id: 'demo-user',
          action_type: 'task',
          action_text: 'Organize important documents in filing system',
          priority_level: 5,
          confidence_score: 0.83,
          relationship_impact: 'Home organization and preparation',
          transcript_excerpt: 'Those important papers need to be filed properly so I can find them',
          status: 'pending',
          due_context: '10 days from now',
          timestamp_in_recording: 450,
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'demo-5',
          meeting_recording_id: 'demo-meeting-3',
          user_id: 'demo-user',
          action_type: 'promise',
          action_text: 'Read bedtime story to grandchildren this weekend',
          priority_level: 9,
          confidence_score: 0.96,
          relationship_impact: 'Family time and bonding commitment',
          transcript_excerpt: 'The kids love when I read to them, I promise to do that this weekend',
          status: 'pending',
          due_context: '3 days from now',
          timestamp_in_recording: 240,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      setDemoExtractedActions(demoPACTs);
    } else {
      setDemoExtractedActions([]);
    }
  }, [demoMode]);

  return {
    demoExtractedActions,
    setDemoExtractedActions
  };
};