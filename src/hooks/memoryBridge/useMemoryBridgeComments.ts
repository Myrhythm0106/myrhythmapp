import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MemoryBridgeComment, SUBSCRIPTION_LIMITS } from '@/types/memoryBridge';

export function useMemoryBridgeComments(recordingId?: string) {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [comments, setComments] = useState<MemoryBridgeComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentUsage, setCommentUsage] = useState({ count: 0, limit: 0 });

  // Get subscription limits
  const limits = SUBSCRIPTION_LIMITS[tier];

  const fetchComments = useCallback(async () => {
    if (!user || !recordingId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/memory_bridge_comments?meeting_recording_id=eq.${recordingId}&order=created_at.desc`,
        {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch comments');

      const data = await response.json();
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [user, recordingId]);

  const fetchUsage = useCallback(async () => {
    if (!user) return;

    try {
      const currentPeriod = new Date();
      const periodStart = new Date(currentPeriod.getFullYear(), currentPeriod.getMonth(), 1);
      
      const response = await fetch(
        `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/recording_usage_tracking?user_id=eq.${user.id}&period_start=eq.${periodStart.toISOString().split('T')[0]}`,
        {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const usage = data[0] || { comment_count: 0 };
        setCommentUsage({
          count: usage.comment_count,
          limit: limits.commentCount
        });
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  }, [user, limits.commentCount]);

  useEffect(() => {
    fetchComments();
    fetchUsage();
  }, [fetchComments, fetchUsage]);

  const addComment = async (commentText: string, commenterMemberId: string) => {
    if (!user || !recordingId) return false;

    // Check limits for non-unlimited tiers
    if (limits.commentCount !== -1 && commentUsage.count >= limits.commentCount) {
      toast.error(`Comment limit reached (${limits.commentCount}). Upgrade to add more comments.`);
      return false;
    }

    try {
      const response = await fetch(
        `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/memory_bridge_comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
          },
          body: JSON.stringify({
            user_id: user.id,
            meeting_recording_id: recordingId,
            commenter_member_id: commenterMemberId,
            comment_text: commentText
          })
        }
      );

      if (!response.ok) throw new Error('Failed to add comment');

      await fetchComments();
      await fetchUsage();
      toast.success('Comment added successfully');
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return false;
    }
  };

  const markAsRead = async (commentId: string) => {
    if (!user) return;

    try {
      await fetch(
        `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/memory_bridge_comments?id=eq.${commentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
          },
          body: JSON.stringify({ is_read: true })
        }
      );

      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_read: true }
            : comment
        )
      );
    } catch (error) {
      console.error('Error marking comment as read:', error);
    }
  };

  return {
    comments,
    isLoading,
    commentUsage,
    limits,
    addComment,
    markAsRead,
    refetch: fetchComments
  };
}