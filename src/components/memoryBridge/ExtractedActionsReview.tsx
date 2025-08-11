import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { MemoryBridgeCommentsSection } from './MemoryBridgeCommentsSection';
import { SwipeHint } from '@/components/gratitude/journal/components/SwipeHint';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { CheckCircle, Share2, Calendar, Users, Brain, Heart, Clock, AlertTriangle, Star, MessageCircle } from 'lucide-react';

interface ExtractedAction {
  id: string;
  type: 'awareness' | 'change' | 'action';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  category: 'family' | 'medical' | 'personal' | 'work';
  deadline?: string;
  participants?: string[];
  emotionalWeight: number;
  status: 'pending' | 'confirmed' | 'completed' | 'rejected';
}

interface ExtractedActionsReviewProps {
  meetingId: string;
  actions: ExtractedAction[];
  onActionConfirm: (actionId: string, status: 'confirmed' | 'modified' | 'rejected') => void;
  onShareWithFamily: (actionId: string) => void;
  tier: 'free' | 'taste-see' | 'pro';
}

export function ExtractedActionsReview({ meetingId, actions, onActionConfirm, onShareWithFamily, tier }: ExtractedActionsReviewProps) {
  const isMobile = useIsMobile();
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const commentLimits = { free: 1, 'taste-see': 7, pro: Infinity };

  const handleSwipeComplete = (actionId: string) => {
    onActionConfirm(actionId, 'confirmed');
    toast.success("Commitment confirmed and tracked!");
  };

  const handleSwipeShare = (actionId: string) => {
    const currentComments = commentCounts[actionId] || 0;
    const limit = commentLimits[tier];
    
    if (currentComments >= limit) {
      toast.error(`Comment limit reached (${limit}). Upgrade for unlimited family sharing!`);
      return;
    }
    
    onShareWithFamily(actionId);
    setCommentCounts(prev => ({ ...prev, [actionId]: currentComments + 1 }));
    toast.success("Shared with Support Circle!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Professional ACT Framework Results</CardTitle>
          <p className="text-muted-foreground">Your conversation organized into actionable commitments</p>
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
            
            {actions.filter(action => action.type === type).map(action => (
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
                    <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">{action.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="text-xs">{action.priority}</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleSwipeComplete(action.id)}>
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleSwipeShare(action.id)}>
                          <MessageCircle className="h-3 w-3 text-blue-600" />
                        </Button>
                      </div>
                    </div>
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