import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { CheckCircle, XCircle, Heart, Clock, Trash2, Check, Users } from 'lucide-react';
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
      <Card className="border-2 border-dashed border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-lg font-semibold mb-2 text-purple-900">No Promises Captured Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start recording conversations to never let anyone down again.
            </p>
            <div className="bg-purple-50 rounded-lg p-3 mt-4">
              <p className="text-xs text-purple-700">
                💜 <strong>Your Promise Keeper Journey starts here:</strong><br/>
                Record a conversation and watch as we find every commitment that matters to your relationships.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats for encouragement
  const totalPromises = extractedActions.length;
  const keptPromises = extractedActions.filter(a => a.status === 'confirmed' || a.status === 'completed').length;
  const pendingPromises = extractedActions.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-purple-900">Memory Bridge - Your Promise Keeper</h2>
        <p className="text-sm text-muted-foreground">Building trust, one promise at a time</p>
        
        {totalPromises > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mt-3">
            <div className="flex justify-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-600">{keptPromises}</div>
                <div className="text-xs text-muted-foreground">Promises Kept</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">{pendingPromises}</div>
                <div className="text-xs text-muted-foreground">Awaiting Review</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{Math.round((keptPromises / totalPromises) * 100)}%</div>
                <div className="text-xs text-muted-foreground">Trust Score</div>
              </div>
            </div>
            {keptPromises > 0 && (
              <p className="text-xs text-center text-purple-700 mt-2">
                🌟 <strong>You're building incredible trust!</strong> {keptPromises} {keptPromises === 1 ? 'person feels' : 'people feel'} more supported because of you.
              </p>
            )}
          </div>
        )}
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
          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                      {action.action_type === 'commitment' ? 'Your Promise' : 
                       action.action_type === 'promise' ? 'Promise Made' : 
                       action.action_type === 'reminder' ? 'Don\'t Forget' : 'Action Needed'}
                    </span>
                  </div>
                  <CardTitle className="text-base leading-snug text-slate-800">
                    {action.action_text}
                  </CardTitle>
                </div>
                <Badge
                  variant={action.status === 'completed' ? 'default' : 
                          action.status === 'confirmed' ? 'secondary' : 'outline'}
                  className={`text-xs ml-2 ${
                    action.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    action.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'border-orange-200 text-orange-700'
                  }`}
                >
                  {action.status === 'confirmed' ? '✓ Confirmed' :
                   action.status === 'completed' ? '✓ Done' :
                   action.status === 'rejected' ? '✗ Not Accurate' : 'Needs Review'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Priority and Due Date - Most Important */}
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">
                    {action.due_context || 'No deadline set'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Priority:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Heart 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.ceil(action.priority_level / 2) ? 'text-red-400 fill-current' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Emotional Context - What matters most */}
              {action.emotional_stakes && (
                <div className="bg-purple-50 rounded-lg p-3 border-l-2 border-purple-200">
                  <div className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-purple-800">Why This Matters:</span>
                      <p className="text-sm text-purple-700 mt-1">{action.emotional_stakes}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Relationship Impact */}
              {action.relationship_impact && (
                <div className="bg-blue-50 rounded-lg p-3 border-l-2 border-blue-200">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-blue-800">Relationship Impact:</span>
                      <p className="text-sm text-blue-700 mt-1">{action.relationship_impact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Confidence */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>AI Confidence: {Math.round(action.confidence_score * 100)}%</span>
                {action.intent_behind && (
                  <span className="text-right max-w-[60%] italic">"{action.intent_behind}"</span>
                )}
              </div>
            </CardContent>

            {action.status === 'pending' && (
              <CardContent className="pt-0">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-center text-slate-600 mb-2">
                    🤝 <strong>Is this promise accurate?</strong> Help us keep your relationships strong.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleConfirmAction(action, 'confirmed')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Yes, I Promise This
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConfirmAction(action, 'rejected')}
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Accurate
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}

            {action.status === 'confirmed' && (
              <CardContent className="pt-0">
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-green-700">
                    ✨ <strong>Promise confirmed!</strong> You're building trust and reliability.
                  </p>
                </div>
              </CardContent>
             )}
          </Card>
        </SwipeableContainer>
      ))}

      {extractedActions.some(a => a.status === 'pending') && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 text-center border border-purple-100">
          <div className="mb-2">
            <Heart className="h-5 w-5 mx-auto text-purple-500" />
          </div>
          <p className="text-sm text-purple-700 mb-2">
            <strong>Quick Actions:</strong> Swipe right to confirm promises, left to mark as inaccurate
          </p>
          <p className="text-xs text-purple-600">
            Every confirmed promise strengthens your relationships and builds unshakeable trust. 💜
          </p>
        </div>
      )}
    </div>
  );
}