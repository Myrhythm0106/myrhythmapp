import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { useMemoryBridgeComments } from '@/hooks/memoryBridge/useMemoryBridgeComments';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Send, Heart, Users, Crown, Lock, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MemoryBridgeCommentsSectionProps {
  recordingId: string;
}

export function MemoryBridgeCommentsSection({ recordingId }: MemoryBridgeCommentsSectionProps) {
  const { user } = useAuth();
  const { supportCircle } = useAccountabilitySystem();
  const { 
    comments, 
    isLoading, 
    commentUsage, 
    limits, 
    addComment, 
    markAsRead 
  } = useMemoryBridgeComments(recordingId);
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSwipeComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment first');
      return;
    }

    if (limits.commentCount !== -1 && commentUsage.count >= limits.commentCount) {
      toast.error(`Comment limit reached. Upgrade for more comments!`);
      return;
    }

    // For demo, use first support circle member as commenter
    const commenterMember = supportCircle.find(m => m.status === 'active');
    if (!commenterMember) {
      toast.error('No active support circle members found');
      return;
    }

    setIsSubmitting(true);
    const success = await addComment(newComment, commenterMember.id);
    if (success) {
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  const handleSwipeUpgrade = () => {
    toast.info('Swipe to upgrade and unlock unlimited family comments');
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;
    await handleSwipeComment();
  };

  const isAtLimit = limits.commentCount !== -1 && commentUsage.count >= limits.commentCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Family Comments
            {limits.commentCount !== -1 && (
              <Badge variant="secondary" className="text-xs">
                {commentUsage.count}/{limits.commentCount}
              </Badge>
            )}
          </div>
          {limits.commentCount === -1 && (
            <Badge variant="secondary" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Unlimited
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment Section */}
        <div className="space-y-3">
          {isAtLimit ? (
            <SwipeableContainer
              onSwipeRight={{
                label: 'Upgrade',
                icon: <Crown className="h-4 w-4" />,
                color: '#10b981',
                action: handleSwipeUpgrade
              }}
              enableHorizontalSwipe={true}
            >
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Comment Limit Reached
                  </span>
                </div>
                <p className="text-xs text-amber-700 mb-2">
                  You've used all {limits.commentCount} comments for this month.
                </p>
                <p className="text-xs text-amber-600 font-medium">
                  💡 Swipe right to upgrade for unlimited family comments
                </p>
              </div>
            </SwipeableContainer>
          ) : (
            <SwipeableContainer
              onSwipeRight={{
                label: 'Send Comment',
                icon: <Send className="h-4 w-4" />,
                color: '#3b82f6',
                action: handleSwipeComment
              }}
              enableHorizontalSwipe={true}
            >
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a supportive comment for your family member..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    💡 Swipe right to send quickly
                  </p>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || isSubmitting}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </SwipeableContainer>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet</p>
              <p className="text-xs mt-1">Family members can add supportive comments here</p>
            </div>
          ) : (
            comments.map((comment) => {
              const commenter = supportCircle.find(m => m.id === comment.commenter_member_id);
              return (
                <SwipeableContainer
                  key={comment.id}
                  onSwipeLeft={{
                    label: 'Mark Read',
                    icon: <Heart className="h-4 w-4" />,
                    color: '#10b981',
                    action: () => markAsRead(comment.id)
                  }}
                  enableHorizontalSwipe={true}
                >
                  <div className={`p-3 rounded-lg border transition-colors ${
                    comment.is_read 
                      ? 'bg-muted/50 border-border' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {commenter?.member_name || 'Support Circle Member'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {commenter?.role || 'Member'}
                        </Badge>
                        {!comment.is_read && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            New
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.comment_text}</p>
                    {!comment.is_read && (
                      <p className="text-xs text-blue-600 mt-2 font-medium">
                        💡 Swipe left to mark as read
                      </p>
                    )}
                  </div>
                </SwipeableContainer>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}