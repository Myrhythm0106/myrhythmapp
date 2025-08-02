import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { CheckCircle, XCircle, Heart, Clock, Users } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';

export function ExtractedActionsReview() {
  const { extractedActions, fetchExtractedActions, confirmAction } = useMemoryBridge();

  useEffect(() => {
    fetchExtractedActions();
  }, [fetchExtractedActions]);

  const handleConfirmAction = async (action: ExtractedAction, status: 'confirmed' | 'rejected') => {
    await confirmAction(action.id, status);
  };

  if (extractedActions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-2 border-dashed border-purple-200">
        <CardContent className="text-center py-12">
          <Heart className="h-16 w-16 text-purple-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-3 text-purple-900">No Promises Captured Yet</h3>
          <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Start recording conversations and never let anyone down again. Memory Bridge finds every commitment that matters to your relationships.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 max-w-lg mx-auto">
            <p className="text-sm text-purple-700">
              💜 <strong>Your Promise Keeper Journey starts here:</strong><br/>
              Every conversation holds commitments that build trust. Let us help you honor them all.
            </p>
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-purple-900 mb-2">Memory Bridge - Your Promise Keeper</h2>
        <p className="text-muted-foreground mb-6">Building trust, one promise at a time</p>
        
        {totalPromises > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{keptPromises}</div>
                <div className="text-sm text-muted-foreground">Promises Kept</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{pendingPromises}</div>
                <div className="text-sm text-muted-foreground">Awaiting Review</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{Math.round((keptPromises / totalPromises) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Trust Score</div>
              </div>
            </div>
            {keptPromises > 0 && (
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-center text-purple-700">
                  🌟 <strong>You're building incredible trust!</strong> {keptPromises} {keptPromises === 1 ? 'person feels' : 'people feel'} more supported because of your reliability.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {extractedActions.map((action) => (
        <Card key={action.id} className="w-full max-w-4xl mx-auto border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                    {action.action_type === 'commitment' ? 'Your Promise' : 
                     action.action_type === 'promise' ? 'Promise Made' : 
                     action.action_type === 'reminder' ? 'Don\'t Forget' : 'Action Needed'}
                  </span>
                </div>
                <CardTitle className="text-lg leading-relaxed text-slate-800">
                  {action.action_text}
                </CardTitle>
              </div>
              <Badge
                variant={action.status === 'completed' ? 'default' : 
                        action.status === 'confirmed' ? 'secondary' : 'outline'}
                className={`ml-4 ${
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
          
          <CardContent className="space-y-4">
            {/* Priority and Due Date - Most Important */}
            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className="font-medium">
                  {action.due_context || 'No deadline set'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Priority:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.ceil(action.priority_level / 2) ? 'text-red-400 fill-current' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Emotional Context - What matters most */}
            {action.emotional_stakes && (
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-200">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-800 mb-2">Why This Promise Matters:</h4>
                    <p className="text-purple-700">{action.emotional_stakes}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Relationship Impact */}
            {action.relationship_impact && (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-200">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Relationship Impact:</h4>
                    <p className="text-blue-700">{action.relationship_impact}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Intent and Confidence */}
            <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
              <span>AI Confidence: {Math.round(action.confidence_score * 100)}%</span>
              {action.intent_behind && (
                <span className="text-right max-w-[60%] italic">"{action.intent_behind}"</span>
              )}
            </div>

            {action.status === 'pending' && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <p className="text-center text-slate-600 mb-3">
                  🤝 <strong>Is this promise accurate?</strong> Help us keep your relationships strong.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleConfirmAction(action, 'confirmed')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Yes, I Promise This
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleConfirmAction(action, 'rejected')}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Not Accurate
                  </Button>
                </div>
              </div>
            )}

            {action.status === 'confirmed' && (
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-green-700">
                  ✨ <strong>Promise confirmed!</strong> You're building trust and reliability with every commitment you honor.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}