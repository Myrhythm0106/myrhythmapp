import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { CheckCircle, XCircle, Heart, Clock, Trash2, Check } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';

export function MobileExtractedActionsReview() {
  const { extractedActions, fetchExtractedActions, confirmAction } = useMemoryBridge();

  useEffect(() => {
    fetchExtractedActions();
  }, [fetchExtractedActions]);

  const handleConfirmAction = async (action: ExtractedAction, status: 'confirmed' | 'rejected') => {
    await confirmAction(action.id, status);
  };

  if (extractedActions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Actions Yet</h3>
            <p className="text-sm text-muted-foreground">
              Start recording conversations to extract important commitments and promises.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-purple-900">Promise Keeper Dashboard</h2>
        <p className="text-sm text-muted-foreground">Review and confirm your commitments</p>
      </div>

      {extractedActions.map((action, index) => (
        <SwipeableContainer
          key={action.id}
          onSwipeLeft={action.status === 'pending' ? {
            label: 'Reject',
            icon: <XCircle className="h-4 w-4" />,
            color: '#ef4444',
            action: () => handleConfirmAction(action, 'rejected')
          } : undefined}
          onSwipeRight={action.status === 'pending' ? {
            label: 'Confirm',
            icon: <CheckCircle className="h-4 w-4" />,
            color: '#22c55e',
            action: () => handleConfirmAction(action, 'confirmed')
          } : undefined}
          enableHorizontalSwipe={action.status === 'pending'}
          className="rounded-lg"
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base leading-snug">
                  {action.action_text}
                </CardTitle>
                <Badge
                  variant={action.status === 'completed' ? 'default' : 
                          action.status === 'confirmed' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {action.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="ml-1 text-xs">
                    {action.action_type}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority:</span>
                  <span className="ml-1 font-medium text-orange-600">
                    {action.priority_level}/10
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground font-medium">Confidence:</span>
                  <span className="ml-1">{Math.round(action.confidence_score * 100)}%</span>
                </div>
                
                {action.emotional_stakes && (
                  <div>
                    <span className="text-muted-foreground font-medium">Stakes:</span>
                    <p className="text-sm mt-1">{action.emotional_stakes}</p>
                  </div>
                )}
                
                {action.relationship_impact && (
                  <div>
                    <span className="text-muted-foreground font-medium">Impact:</span>
                    <p className="text-sm mt-1">{action.relationship_impact}</p>
                  </div>
                )}
                
                {action.due_context && (
                  <div>
                    <span className="text-muted-foreground font-medium">Due:</span>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {action.due_context}
                    </p>
                  </div>
                )}
              </div>

              {action.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleConfirmAction(action, 'confirmed')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConfirmAction(action, 'rejected')}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Not Accurate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </SwipeableContainer>
      ))}

      {extractedActions.some(a => a.status === 'pending') && (
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Swipe right to confirm or left to reject actions
          </p>
        </div>
      )}
    </div>
  );
}