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
import { CheckCircle, Share2, Calendar, Users, Brain, Heart, Clock, AlertTriangle, Star, MessageCircle, Crown, Lock, TrendingUp, Sparkles } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

interface ExtractedActionsReviewProps {
  meetingId?: string;
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
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [actionToReject, setActionToReject] = useState<string | null>(null);

  const commentLimits = { free: 1, 'taste-see': 7, pro: Infinity };

  useEffect(() => {
    loadActions();
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
      toast.success("Empowered commitment confirmed! 💪", {
        description: "You're building stronger relationships with every promise kept"
      });
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
    toast.success("Shared with your Support Circle! 💜", {
      description: "No one walks alone - your circle is here to support you"
    });
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
      toast.success("Action scheduled - you're taking control! 📅", {
        description: "Every scheduled action is a step toward stronger relationships"
      });
    } catch (error) {
      toast.error("Failed to schedule action");
    }
  };

  const handleScheduleAllConfirmed = async () => {
    if (!user) return;
    await scheduleConfirmedActions(user.id);
    toast.success("All confirmed actions scheduled! 🚀", {
      description: "You're empowered and organized - every commitment matters"
    });
  };

  const handleRejectAction = (actionId: string) => {
    setActionToReject(actionId);
    setShowRejectConfirm(true);
  };

  const confirmRejectAction = async () => {
    if (!actionToReject) return;
    
    try {
      await confirmAction(actionToReject, 'rejected');
      setActions(prev => 
        prev.map(action => 
          action.id === actionToReject 
            ? { ...action, status: 'rejected' as const }
            : action
        )
      );
      toast.info("Action respectfully declined", {
        description: "It's okay to set boundaries - you know what's best for you"
      });
    } catch (error) {
      toast.error("Failed to reject action");
    } finally {
      setShowRejectConfirm(false);
      setActionToReject(null);
    }
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

  if (actions.length === 0) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">No Actions Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete a recording to see your extracted actions here.
            </p>
            <Button onClick={loadActions} variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh Actions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Premium Upgrade Banner */}
      <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Crown className="h-8 w-8 text-amber-600" />
              <div>
                <h3 className="text-lg font-bold text-amber-900">Unlock Premium ACTS Features</h3>
                <p className="text-sm text-amber-700">Advanced categorization, unlimited family sharing, and smart scheduling</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your SMART ACTS Framework
            </CardTitle>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Empowering your conversations into actionable progress</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">No One Walks Alone</span>
            <Heart className="h-4 w-4 text-primary" />
          </div>
          {confirmedCount > 0 && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleScheduleAllConfirmed} className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary">
                <Calendar className="h-4 w-4" />
                Schedule {confirmedCount} Empowered Actions
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
                  label: "Share Circle",
                  icon: <Share2 className="h-4 w-4" />,
                  color: "#3b82f6", 
                  action: () => handleSwipeShare(action.id)
                }}
                onPullToRefresh={() => handleRejectAction(action.id)}
                enablePullToRefresh={isMobile}
              >
                <Card className="bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow border border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-1">{action.action_text}</h4>
                    {action.relationship_impact && (
                      <p className="text-xs text-muted-foreground mb-2 italic">
                        💜 {action.relationship_impact}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">Priority {action.priority_level}</Badge>
                        <Badge variant="secondary" className="text-xs">{action.action_type}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0 hover:bg-green-100" 
                          onClick={() => handleSwipeComplete(action.id)}
                          disabled={action.status === 'confirmed'}
                          title="Confirm commitment"
                        >
                          <CheckCircle className={`h-3 w-3 ${action.status === 'confirmed' ? 'text-green-600' : 'text-gray-400'}`} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0 hover:bg-blue-100" 
                          onClick={() => handleScheduleAction(action.id)}
                          title="Schedule action"
                        >
                          <Calendar className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0 hover:bg-purple-100" 
                          onClick={() => handleSwipeShare(action.id)}
                          title="Share with circle"
                        >
                          <MessageCircle className="h-3 w-3 text-purple-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {action.status === 'confirmed' && (
                        <Badge className="text-xs bg-green-100 text-green-800">✓ Confirmed</Badge>
                      )}
                      {action.status === 'scheduled' && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">📅 Scheduled</Badge>
                      )}
                      {action.status === 'rejected' && (
                        <Badge className="text-xs bg-gray-100 text-gray-800">❌ Declined</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </SwipeableContainer>
            ))}
          </div>
        ))}
      </div>

      {isMobile && (
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
          <SwipeHint isMobile={true} />
          <p className="text-xs text-muted-foreground mt-2">
            ← Swipe left to confirm • → Swipe right to share with circle • ↑ Pull to decline respectfully
          </p>
          <p className="text-xs text-primary mt-1 font-medium">
            Remember: You're empowered to choose what works for you 💜
          </p>
        </div>
      )}

      {/* Empowerment Message */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">Building Stronger Relationships</span>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Every action you take strengthens the bonds with those you care about
          </p>
          <p className="text-xs text-primary mt-2 italic">
            "Progress over perfection - you're never alone on this journey"
          </p>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRejectConfirm}
        onConfirm={confirmRejectAction}
        onCancel={() => {
          setShowRejectConfirm(false);
          setActionToReject(null);
        }}
        title="Decline this action?"
        description="It's completely okay to set boundaries and choose what works best for you. You're empowered to make decisions that support your wellbeing."
        confirmText="Yes, decline respectfully"
        cancelText="Keep action"
        variant="default"
      />
      
      {/* Family Comments Section */}
      {meetingId && (
        <div className="mt-6">
          <MemoryBridgeCommentsSection recordingId={meetingId} />
        </div>
      )}
    </div>
  );
}