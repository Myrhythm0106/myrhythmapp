import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { MemoryBridgeCommentsSection } from './MemoryBridgeCommentsSection';
import { SwipeHint } from '@/components/gratitude/journal/components/SwipeHint';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { ExtractedAction } from '@/types/memoryBridge';
import { convertActionToCalendarEvent, scheduleConfirmedActions } from '@/utils/calendarIntegration';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CheckCircle, Share2, Calendar, Users, Brain, Heart, Clock, AlertTriangle, Star, MessageCircle } from 'lucide-react';

interface ExtractedActionsReviewProps {
  meetingId: string;
  onActionConfirm?: (actionId: string, status: 'confirmed' | 'modified' | 'rejected') => void;
  onShareWithFamily?: (actionId: string) => void;
  tier?: 'free' | 'taste-see' | 'pro';
}

export function ExtractedActionsReview({ 
  meetingId, 
  onActionConfirm, 
  onShareWithFamily, 
  tier = 'free' 
}: ExtractedActionsReviewProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { fetchExtractedActions, confirmAction } = useMemoryBridge();
  const [actions, setActions] = useState<ExtractedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const commentLimits = { free: 1, 'taste-see': 7, pro: Infinity };

  useEffect(() => {
    if (meetingId) {
      loadActions();
    }
  }, [meetingId]);

  const loadActions = async () => {
    try {
      setIsLoading(true);
      const extractedActions = await fetchExtractedActions(meetingId);
      setActions(extractedActions || []);
    } catch (error) {
      console.error('Failed to load actions:', error);
      toast.error('Failed to load actions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipeComplete = async (actionId: string) => {
    try {
      await confirmAction(actionId, 'confirmed');
      setActions(prev => 
        prev.map(action => 
          action.id === actionId 
            ? { ...action, status: 'confirmed' as const }
            : action
        )
      );
      if (onActionConfirm) onActionConfirm(actionId, 'confirmed');
      toast.success("Commitment confirmed and tracked!");
    } catch (error) {
      toast.error("Failed to confirm action");
    }
  };

  const handleSwipeShare = (actionId: string) => {
    const currentComments = commentCounts[actionId] || 0;
    const limit = commentLimits[tier];
    
    if (currentComments >= limit) {
      toast.error(`Comment limit reached (${limit}). Upgrade for unlimited family sharing!`);
      return;
    }
    
    if (onShareWithFamily) onShareWithFamily(actionId);
    setCommentCounts(prev => ({ ...prev, [actionId]: currentComments + 1 }));
    toast.success("Shared with Support Circle!");
  };

  const handleScheduleAction = async (actionId: string) => {
    if (!user) return;
    
    try {
      const action = actions.find(a => a.id === actionId);
      if (!action) return;

      await convertActionToCalendarEvent(action, user.id);
      setActions(prev => 
        prev.map(a => 
          a.id === actionId 
            ? { ...a, status: 'scheduled' as const }
            : a
        )
      );
      toast.success("Action scheduled to calendar!");
    } catch (error) {
      toast.error("Failed to schedule action");
    }
  };

  const handleScheduleAllConfirmed = async () => {
    if (!user) return;
    await scheduleConfirmedActions(user.id);
  };

  const categorizeActions = (actions: ExtractedAction[]) => {
    return {
      awareness: actions.filter(a => 
        a.action_type === 'reminder' || 
        a.action_text.toLowerCase().includes('remember') ||
        a.action_text.toLowerCase().includes('aware')
      ),
      change: actions.filter(a => 
        a.action_type === 'commitment' || 
        a.action_text.toLowerCase().includes('change') ||
        a.action_text.toLowerCase().includes('improve')
      ),
      action: actions.filter(a => 
        a.action_type === 'task' || 
        a.action_type === 'follow_up' ||
        a.action_text.toLowerCase().includes('do') ||
        a.action_text.toLowerCase().includes('call') ||
        a.action_text.toLowerCase().includes('schedule')
      )
    };
  };

  const categorizedActions = categorizeActions(actions);
  const confirmedCount = actions.filter(a => a.status === 'confirmed').length;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading your actions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Professional ACT Framework Results</CardTitle>
          <p className="text-muted-foreground">Your conversation organized into actionable commitments</p>
          {confirmedCount > 0 && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleScheduleAllConfirmed} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule {confirmedCount} Confirmed Actions
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['awareness', 'change', 'action'].map(type => (
          <div key={type} className="space-y-3">
            <div className={`text-center p-3 rounded-lg border-2 ${
              type === 'awareness' ? 'bg-blue-50 border-blue-200' :
              type === 'change' ? 'bg-green-50 border-green-200' : 
              'bg-purple-50 border-purple-200'
            }`}>
              <h3 className={`font-bold ${
                type === 'awareness' ? 'text-blue-800' :
                type === 'change' ? 'text-green-800' : 'text-purple-800'
              }`}>
                {type.toUpperCase()}
              </h3>
            </div>
            
            {categorizedActions[type as keyof typeof categorizedActions].map(action => (
              <SwipeableContainer
                key={action.id}
                enableHorizontalSwipe={isMobile}
                onSwipeLeft={{
                  label: "Confirm",
                  icon: <CheckCircle className="h-4 w-4" />,
                  color: "#22c55e",
                  action: () => handleSwipeComplete(action.id)
                }}
                onSwipeRight={{
                  label: "Share",
                  icon: <Share2 className="h-4 w-4" />,
                  color: "#3b82f6", 
                  action: () => handleSwipeShare(action.id)
                }}
              >
                <Card className="bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-1">{action.action_text}</h4>
                    <p className="text-xs text-muted-foreground">{action.relationship_impact || action.emotional_stakes}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="text-xs">Priority {action.priority_level}</Badge>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0" 
                          onClick={() => handleSwipeComplete(action.id)}
                          disabled={action.status === 'confirmed'}
                        >
                          <CheckCircle className={`h-3 w-3 ${action.status === 'confirmed' ? 'text-green-600' : 'text-gray-400'}`} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0" 
                          onClick={() => handleScheduleAction(action.id)}
                        >
                          <Calendar className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleSwipeShare(action.id)}>
                          <MessageCircle className="h-3 w-3 text-purple-600" />
                        </Button>
                      </div>
                    </div>
                    {action.status === 'confirmed' && (
                      <Badge className="mt-2 text-xs bg-green-100 text-green-800">Confirmed</Badge>
                    )}
                    {action.status === 'scheduled' && (
                      <Badge className="mt-2 text-xs bg-blue-100 text-blue-800">Scheduled</Badge>
                    )}
                  </CardContent>
                </Card>
              </SwipeableContainer>
            ))}
          </div>
        ))}
      </div>

      {isMobile && (
        <div className="text-center bg-muted/30 rounded-lg p-4">
          <SwipeHint isMobile={true} />
          <p className="text-xs text-muted-foreground mt-2">
            ← Swipe left to confirm • → Swipe right to share with family
          </p>
        </div>
      )}
      
      {/* Family Comments Section */}
      {meetingId && (
        <div className="mt-6">
          <MemoryBridgeCommentsSection recordingId={meetingId} />
        </div>
      )}
    </div>
  );
}